import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bi_semantic_layer"
}

DASHBOARDS = [
    (1, 'Sales Executive Dashboard', 'High-level sales KPIs', 'Sales', 'sales_dashboard_url'),
    (2, 'Ops Daily Monitor', 'Daily operations and delivery tracking', 'Operations', 'ops_dashboard_url')
]

# metric_id reference: 1=Total Orders, 2=Avg Order Value, 3=Delivered Orders
# Fields: dashboard_definition_id, dashboard_id, metric_id, widget_name, formula, source_tables, filters, time_window, dimensions
DASHBOARD_DEFINITIONS = [
    # PERFECT MATCH: Total Orders
    (1, 1, 1, 'Total Orders KPI', 'SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'order_date'),
    
    # MISMATCH (Formula): Avg Order Value
    (2, 1, 2, 'AOV Widget', 'AVG(total_sales)', 'gold_sales_summary', '', 'all_time', 'order_date'),
    
    # MISMATCH (Filters): Delivered Orders
    (3, 2, 3, 'Delivered Orders Count', 'SUM(order_count)', 'gold_order_status_summary', '', 'all_time', 'order_status')
]

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    # Create tables just in case
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dashboards (
        dashboard_id INT AUTO_INCREMENT PRIMARY KEY,
        dashboard_name VARCHAR(255) NOT NULL,
        description TEXT,
        owner VARCHAR(255),
        url VARCHAR(255)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dashboard_definitions (
        dashboard_definition_id INT AUTO_INCREMENT PRIMARY KEY,
        dashboard_id INT NOT NULL,
        metric_id INT NOT NULL,
        widget_name VARCHAR(255),
        formula TEXT NOT NULL,
        source_tables TEXT NOT NULL,
        filters TEXT,
        time_window VARCHAR(255),
        dimensions TEXT,
        FOREIGN KEY (dashboard_id) REFERENCES dashboards(dashboard_id)
    )
    """)
    
    # Insert Dashboards
    cursor.executemany(
        "INSERT INTO dashboards (dashboard_id, dashboard_name, description, owner, url) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE dashboard_name=VALUES(dashboard_name)",
        DASHBOARDS
    )
    
    # Insert Dashboard Definitions
    cursor.executemany(
        "INSERT INTO dashboard_definitions (dashboard_definition_id, dashboard_id, metric_id, widget_name, formula, source_tables, filters, time_window, dimensions) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE formula=VALUES(formula)",
        DASHBOARD_DEFINITIONS
    )
    
    connection.commit()
    print("Successfully populated mock dashboards and definitions.")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'connection' in locals(): connection.close()
