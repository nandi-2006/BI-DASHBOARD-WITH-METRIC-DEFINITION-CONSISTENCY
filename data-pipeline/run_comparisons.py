import mysql.connector
import re

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bi_semantic_layer"
}

def normalize(val):
    if not val:
        return ""
    val = str(val).strip().lower()
    val = re.sub(r'\s+', ' ', val)
    val = re.sub(r'\s*\(\s*', '(', val)
    val = re.sub(r'\s*\)\s*', ')', val)
    val = re.sub(r'\s*,\s*', ',', val)
    return val

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor(dictionary=True)
    
    # Clear old comparisons
    cursor.execute("DELETE FROM definition_comparisons")
    
    # Get all dashboard definitions
    cursor.execute("SELECT * FROM dashboard_definitions")
    dash_defs = cursor.fetchall()
    
    comparisons = []
    
    for d_def in dash_defs:
        metric_id = d_def['metric_id']
        cursor.execute("SELECT * FROM metric_versions WHERE metric_id = %s AND is_current = 1 LIMIT 1", (metric_id,))
        m_def = cursor.fetchone()
        
        if not m_def:
            continue
            
        formula_match = normalize(m_def['formula']) == normalize(d_def['formula'])
        source_match = normalize(m_def['source_tables']) == normalize(d_def['source_tables'])
        
        m_filters = m_def['filters'] if m_def['filters'] is not None else ""
        d_filters = d_def['filters'] if d_def['filters'] is not None else ""
        filter_match = normalize(m_filters) == normalize(d_filters)
        
        time_match = normalize(m_def['time_window']) == normalize(d_def['time_window'])
        dim_match = normalize(m_def['dimensions']) == normalize(d_def['dimensions'])
        
        all_match = formula_match and source_match and filter_match and time_match and dim_match
        status = "MATCH" if all_match else "MISMATCH"
        
        if all_match:
            reason = "Dashboard definition completely matches the official metric definition."
        else:
            mismatches = []
            if not formula_match: mismatches.append("Formula")
            if not source_match: mismatches.append("Source Tables")
            if not filter_match: mismatches.append("Filters")
            if not time_match: mismatches.append("Time Window")
            if not dim_match: mismatches.append("Dimensions")
            reason = "Mismatch found in: " + ", ".join(mismatches) + "."
            
        comparisons.append((
            metric_id,
            d_def['dashboard_id'],
            m_def['metric_version_id'],
            d_def['dashboard_definition_id'],
            status,
            formula_match,
            source_match,
            filter_match,
            time_match,
            dim_match,
            reason
        ))

    cursor.executemany("""
        INSERT INTO definition_comparisons 
        (metric_id, dashboard_id, metric_version_id, dashboard_definition_id, status, formula_match, source_match, filter_match, time_window_match, dimension_match, reason) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, comparisons)
    
    connection.commit()
    
    matches = sum(1 for c in comparisons if c[4] == 'MATCH')
    mismatches = sum(1 for c in comparisons if c[4] == 'MISMATCH')
    print(f"Ran {len(comparisons)} comparisons: {matches} MATCH, {mismatches} MISMATCH")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'connection' in locals(): connection.close()
