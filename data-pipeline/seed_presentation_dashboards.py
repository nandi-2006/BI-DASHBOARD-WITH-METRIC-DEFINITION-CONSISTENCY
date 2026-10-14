import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bi_semantic_layer"
}

NEW_DASHBOARDS = [
    (3, 'Product Performance Dashboard', 'Deep dive into product categories and individual item performance.', 'Product Team', 'product_dash_url'),
    (4, 'Marketing ROI Dashboard', 'Tracking acquisition cost vs LTV and campaign performance.', 'Marketing', 'marketing_dash_url'),
    (5, 'Regional Sales Dashboard', 'Geographic breakdown of sales and delivery times.', 'Sales Team', 'regional_dash_url'),
    (6, 'Seller Analytics Dashboard', 'Monitoring top sellers and marketplace health.', 'Marketplace Ops', 'seller_dash_url'),
    (7, 'Customer Retention Dashboard', 'Repeat purchase rates and cohort analysis.', 'Growth Team', 'retention_dash_url'),
    (8, 'Logistics & Freight Dashboard', 'Detailed view of shipping costs and carrier performance.', 'Logistics', 'freight_dash_url'),
    (9, 'Executive Overview Dashboard', 'C-suite summary of all top-level business KPIs.', 'Executive', 'exec_dash_url'),
    (10, 'Inventory Health Dashboard', 'Stock levels and product velocity.', 'Supply Chain', 'inventory_dash_url')
]

# (dashboard_definition_id, dashboard_id, metric_id, widget_name, formula, source_tables, filters, time_window, dimensions, definition_text)
NEW_DEFINITIONS = [
    # Dashboard 3 (Product) - MATCH on metric 1, divergent AOV formula on metric 2
    (4, 3, 1, 'Product Sales Volume', 'SUM(order_count)', 'gold_product_sales_summary', '', 'all_time', 'product_id', 'Total product sales volume across all products'),
    (5, 3, 2, 'Category AOV', 'SUM(total_revenue)/SUM(order_count)', 'gold_category_sales_summary', '', 'all_time', 'product_category', 'Average order value broken down by category'),
    # Dashboard 4 (Marketing) - Divergent formula AND filters on metric 1
    (6, 4, 1, 'Acquired Orders', 'COUNT(order_id)', 'gold_sales_summary', 'channel="paid"', 'all_time', 'order_date', 'Orders acquired through paid marketing channels'),
    # Dashboard 5 (Regional) - Divergent dimensions on metric 1
    (7, 5, 1, 'Orders by Region', 'SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'region', 'Order count broken down by geographic region'),
    # Dashboard 6 (Seller) - Divergent source table on metric 2
    (8, 6, 2, 'Seller AOV', 'SUM(total_revenue) / SUM(order_count)', 'gold_seller_sales_summary', '', 'all_time', 'seller_id', 'Average order value per seller'),
    # Dashboard 7 (Retention) - Divergent formula AND filters on metric 1
    (9, 7, 1, 'Repeat Orders', 'SUM(order_count) * 0.8', 'gold_sales_summary', 'customer_type="repeat"', 'all_time', 'order_date', 'Orders from repeat customers estimated at 80%'),
    # Dashboard 8 (Logistics) - MATCH on metric 3, divergent dimensions
    (10, 8, 3, 'Delivered Freight', 'SUM(order_count)', 'gold_order_status_summary', "order_status = 'delivered'", 'all_time', 'carrier_id', 'Count of delivered orders broken by carrier'),
    # Dashboard 9 (Exec) - Both MATCH on metric 1 and 2
    (11, 9, 1, 'Total Global Orders', 'SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'order_date', 'Total orders across the entire platform'),
    (12, 9, 2, 'Global AOV', 'SUM(total_sales) / SUM(order_count)', 'gold_sales_summary', '', 'all_time', 'order_date', 'Global average order value'),
    # Dashboard 10 (Inventory) - Divergent filters AND time_window on metric 3
    (13, 10, 3, 'Fulfilled Orders', 'SUM(order_count)', 'gold_order_status_summary', "order_status = 'shipped'", 'last_30_days', 'product_id', 'Fulfilled (shipped) orders in the last 30 days'),
]

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    cursor.executemany(
        "INSERT INTO dashboards (dashboard_id, dashboard_name, description, owner, url) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE dashboard_name=VALUES(dashboard_name)",
        NEW_DASHBOARDS
    )
    
    cursor.executemany(
        "INSERT INTO dashboard_definitions (dashboard_definition_id, dashboard_id, metric_id, widget_name, formula, source_tables, filters, time_window, dimensions, definition_text) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE formula=VALUES(formula)",
        NEW_DEFINITIONS
    )
    
    connection.commit()
    print("Successfully seeded 8 more dashboards with 10 widget definitions.")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'connection' in locals(): connection.close()
