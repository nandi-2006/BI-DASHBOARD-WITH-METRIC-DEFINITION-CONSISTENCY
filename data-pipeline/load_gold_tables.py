
import pandas as pd
import mysql.connector
import os
import math


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "bi_semantic_layer"
}


# ============================================================
# DATA DIRECTORY
# ============================================================

DATA_DIR = r"C:\Users\nandi\OneDrive\Desktop\Capstone\BI_Project\BI_Project\data"


# ============================================================
# GOLD TABLE DEFINITIONS
# ============================================================
TABLES = {
    "Ecom_category_sales_summary.csv": {
        "table_name": "gold_category_sales_summary",
        "schema": """
            product_category VARCHAR(255) PRIMARY KEY,
            order_count INT,
            item_count INT,
            total_item_sales DECIMAL(15, 2),
            total_freight DECIMAL(15, 2),
            total_revenue DECIMAL(15, 2)
        """
    },

    "Ecom_delivery_summary.csv": {
        "table_name": "gold_delivery_summary",
        "schema": """
            order_id VARCHAR(255) PRIMARY KEY,
            customer_id VARCHAR(255),
            order_status VARCHAR(50),
            order_purchase_timestamp DATETIME,
            order_delivered_customer_date DATETIME,
            order_estimated_delivery_date DATETIME,
            delivery_days INT,
            delivery_difference_days INT,
            delivery_performance VARCHAR(50)
        """
    },

    "Ecom_order_status_summary.csv": {
        "table_name": "gold_order_status_summary",
        "schema": """
            order_status VARCHAR(50) PRIMARY KEY,
            order_count INT,
            total_sales DECIMAL(15, 2),
            average_order_value DECIMAL(15, 2)
        """
    },

    "Ecom_order_summary.csv": {
        "table_name": "gold_order_summary",
        "schema": """
            order_id VARCHAR(255) PRIMARY KEY,
            customer_id VARCHAR(255),
            order_status VARCHAR(50),
            order_purchase_timestamp DATETIME,
            order_approved_at DATETIME,
            order_delivered_carrier_date DATETIME,
            order_delivered_customer_date DATETIME,
            order_estimated_delivery_date DATETIME,
            item_count INT,
            item_sales DECIMAL(15, 2),
            freight_value DECIMAL(15, 2),
            order_value DECIMAL(15, 2)
        """
    },

    "Ecom_product_sales_summary.csv": {
        "table_name": "gold_product_sales_summary",
        "schema": """
            product_id VARCHAR(255) PRIMARY KEY,
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
            order_date DATE PRIMARY KEY,
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
            seller_id VARCHAR(255) PRIMARY KEY,
            order_count INT,
            item_count INT,
            total_item_sales DECIMAL(15, 2),
            total_freight DECIMAL(15, 2),
            total_revenue DECIMAL(15, 2)
        """
    }
}

# ============================================================
# CLEAN INDIVIDUAL VALUES
# ============================================================

def clean_value(val):

    if pd.isna(val):
        return None

    if isinstance(val, float) and math.isnan(val):
        return None

    return val


# ============================================================
# CLEAN DATETIME COLUMNS
# ============================================================

def clean_datetime_columns(df):

    datetime_columns = [
        "order_purchase_timestamp",
        "order_approved_at",
        "order_delivered_carrier_date",
        "order_delivered_customer_date",
        "order_estimated_delivery_date"
    ]

    for col in datetime_columns:

        if col in df.columns:

            print(f"  Converting datetime column: {col}")

            # Parse ISO-8601 timestamps such as:
            #
            # 2017-10-17T03:49:34.000Z
            #
            # utc=True makes the parsing consistent.
            df[col] = pd.to_datetime(
                df[col],
                errors="coerce",
                utc=True
            )

            # MySQL DATETIME does not store timezone information.
            # Remove the UTC timezone.
            df[col] = df[col].dt.tz_localize(None)

    return df


# ============================================================
# CLEAN DATE COLUMNS
# ============================================================

def clean_date_columns(df):

    if "order_date" in df.columns:

        print("  Converting order_date to DATE format")

        df["order_date"] = pd.to_datetime(
            df["order_date"],
            errors="coerce"
        ).dt.date

    return df


# ============================================================
# LOAD DATA
# ============================================================

def load_data():

    print("Connecting to MySQL...")

    try:

        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()

        print("Connected successfully.")

    except Exception as e:

        print(f"Failed to connect to database: {e}")
        return


    # ========================================================
    # PROCESS EACH GOLD CSV
    # ========================================================

    for filename, config in TABLES.items():

        filepath = os.path.join(DATA_DIR, filename)

        # ----------------------------------------------------
        # CHECK FILE EXISTS
        # ----------------------------------------------------

        if not os.path.exists(filepath):

            print(
                f"Warning: {filename} not found "
                f"in {DATA_DIR}. Skipping."
            )

            continue


        table_name = config["table_name"]
        schema = config["schema"]


        print("\n" + "=" * 70)
        print(f"Processing {filename}")
        print(f"Target table: {table_name}")
        print("=" * 70)


        # ====================================================
        # 1. DROP EXISTING TABLE
        # ====================================================

        cursor.execute(
            f"DROP TABLE IF EXISTS {table_name}"
        )

        # ====================================================
        # 2. CREATE TABLE
        # ====================================================

        cursor.execute(
            f"CREATE TABLE {table_name} ({schema})"
        )

        print(f"Table {table_name} created.")


        # ====================================================
        # 3. READ CSV
        # ====================================================

        df = pd.read_csv(filepath)

        print(f"CSV rows read: {len(df)}")


        # ====================================================
        # 4. CLEAN DATETIME COLUMNS
        # ====================================================

        df = clean_datetime_columns(df)


        # ====================================================
        # 5. CLEAN DATE COLUMNS
        # ====================================================

        df = clean_date_columns(df)


        # ====================================================
        # 6. REPLACE NaN WITH None
        # ====================================================

        df = df.where(
            pd.notnull(df),
            None
        )


        # ====================================================
        # 7. PREPARE SQL INSERT
        # ====================================================

        columns = ", ".join(df.columns)

        placeholders = ", ".join(
            ["%s"] * len(df.columns)
        )

        sql = (
            f"INSERT INTO {table_name} "
            f"({columns}) "
            f"VALUES ({placeholders})"
        )


        # ====================================================
        # 8. CONVERT DATAFRAME TO TUPLES
        # ====================================================

        data_tuples = [
            tuple(
                clean_value(value)
                for value in row
            )
            for row in df.to_numpy()
        ]


        total_rows = len(data_tuples)

        BATCH_SIZE = 1000


        # ====================================================
        # 9. INSERT DATA IN BATCHES
        # ====================================================

        for i in range(
            0,
            total_rows,
            BATCH_SIZE
        ):

            batch = data_tuples[
                i:i + BATCH_SIZE
            ]

            cursor.executemany(
                sql,
                batch
            )

            connection.commit()

            print(
                f"  Inserted rows "
                f"{i + 1} - "
                f"{min(i + BATCH_SIZE, total_rows)}"
            )


        print(
            f"Successfully inserted "
            f"{total_rows} rows into "
            f"{table_name}."
        )


        # ====================================================
        # 10. DATA QUALITY CHECK
        # ====================================================

        cursor.execute(
            f"SELECT COUNT(*) FROM {table_name}"
        )

        count = cursor.fetchone()[0]


        if count == total_rows:

            print(
                f"Data Quality Check PASSED: "
                f"Row count matches ({count})."
            )

        else:

            print(
                f"Data Quality Check FAILED: "
                f"Expected {total_rows}, "
                f"Found {count}."
            )


    # ========================
