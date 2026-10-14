import pandas as pd
import mysql.connector
import os
import math

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root", # assuming the user's password is now root
    "database": "bi_semantic_layer"
}

DATA_DIR = r"C:\Users\nandi\OneDrive\Desktop\Capstone\BI_Project\BI_Project\data"

TABLES = {
    "Ecom_product_sales_summary.csv": {
        "table_name": "gold_product_sales_summary",
        "schema": """
            product_id VARCHAR(255),
            order_count INT,
            item_count INT,
            total_item_sales DECIMAL(15, 2),
            total_freight DECIMAL(15, 2),
            total_revenue DECIMAL(15, 2)
        """
    },
    "Ecom_sales_summary.csv": {
        "table_name": "gold_sales_summary",
        "schema": """
            order_date DATE,
            order_count INT,
            total_item_sales DECIMAL(15, 2),
            total_freight DECIMAL(15, 2),
            total_sales DECIMAL(15, 2),
            average_order_value DECIMAL(15, 2)
        """
    },
    "Ecom_seller_sales_summar.csv": {
        "table_name": "gold_seller_sales_summary",
        "schema": """
            seller_id VARCHAR(255),
            order_count INT,
            item_count INT,
            total_item_sales DECIMAL(15, 2),
            total_freight DECIMAL(15, 2),
            total_revenue DECIMAL(15, 2)
        """
    }
}

def clean_value(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return val

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    for filename, config in TABLES.items():
        filepath = os.path.join(DATA_DIR, filename)
        table_name = config["table_name"]
        schema = config["schema"]
        
        print(f"Processing {table_name}...")
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
        cursor.execute(f"CREATE TABLE {table_name} ({schema})")
        
        df = pd.read_csv(filepath)
        if 'date' in df.columns or 'order_date' in df.columns:
            for col in df.columns:
                if 'date' in col.lower():
                    df[col] = pd.to_datetime(df[col]).dt.strftime('%Y-%m-%d')
                    
        df = df.where(pd.notnull(df), None)
        columns = ", ".join(df.columns)
        placeholders = ", ".join(["%s"] * len(df.columns))
        sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        
        data_tuples = [tuple(clean_value(val) for val in row) for row in df.to_numpy()]
        cursor.executemany(sql, data_tuples)
        connection.commit()
        print(f"Loaded {len(data_tuples)} rows into {table_name}")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'connection' in locals(): connection.close()
