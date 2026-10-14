import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bi_semantic_layer"
}

METRICS = [
    (1, 'Total Orders', 'Total number of orders placed.', 'Sales Team', 'ACTIVE'),
    (2, 'Average Order Value', 'Average revenue per order.', 'Sales Team', 'ACTIVE'),
    (3, 'Delivered Orders', 'Number of orders successfully delivered.', 'Ops Team', 'ACTIVE')
]

METRIC_VERSIONS = [
    (1, 1, 1, 'Total orders placed across the platform', 'SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'order_date', True),
    (2, 2, 1, 'Average revenue generated per order', 'SUM(total_sales) / SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'order_date', True),
    (3, 3, 1, 'Total orders with status delivered', 'SUM(order_count)', 'gold_order_status_summary', "order_status = 'delivered'", 'all_time', 'order_status', True)
]

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS metrics (
        metric_id INT AUTO_INCREMENT PRIMARY KEY,
        metric_name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        owner VARCHAR(255),
        status VARCHAR(50)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS metric_versions (
        metric_version_id INT AUTO_INCREMENT PRIMARY KEY,
        metric_id INT NOT NULL,
        version_number INT NOT NULL,
        business_definition TEXT NOT NULL,
        formula TEXT NOT NULL,
        source_tables TEXT NOT NULL,
        filters TEXT,
        time_window VARCHAR(255),
        dimensions TEXT,
        is_current BOOLEAN,
        FOREIGN KEY (metric_id) REFERENCES metrics(metric_id)
    )
    """)
    
    # Insert Metrics
    cursor.executemany(
        "INSERT INTO metrics (metric_id, metric_name, description, owner, status) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE description=VALUES(description)",
        METRICS
    )
    
    # Insert Metric Versions
    cursor.executemany(
        "INSERT INTO metric_versions (metric_version_id, metric_id, version_number, business_definition, formula, source_tables, filters, time_window, dimensions, is_current) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE formula=VALUES(formula)",
        METRIC_VERSIONS
    )
    
    connection.commit()
    print("Successfully created tables and populated official metrics registry.")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'connection' in locals(): connection.close()
