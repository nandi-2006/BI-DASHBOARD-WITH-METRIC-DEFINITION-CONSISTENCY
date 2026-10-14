import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_orders_dataset.csv"

print("Reading CSV...")

df = pd.read_csv(CSV_FILE)

print("CSV loaded successfully!")
print("Number of rows:", len(df))
print("Columns:")
print(df.columns.tolist())

print("\nConnecting to MySQL...")

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Harish123",
    database="bi_semantic_layer"
)

cursor = connection.cursor()

print("MySQL connection successful!")

sql = """
INSERT INTO orders (
    order_id,
    customer_id,
    order_status,
    order_purchase_timestamp,
    order_approved_at,
    order_delivered_carrier_date,
    order_delivered_customer_date,
    order_estimated_delivery_date
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

# Convert date columns to Python datetime objects
date_columns = [
    "order_purchase_timestamp",
    "order_approved_at",
    "order_delivered_carrier_date",
    "order_delivered_customer_date",
    "order_estimated_delivery_date"
]

for col in date_columns:
    df[col] = pd.to_datetime(df[col], errors="coerce")

# Convert missing values to None
df = df.astype(object).where(pd.notnull(df), None)

data = [
    tuple(row)
    for row in df.itertuples(index=False, name=None)
]

print("\nInserting data...")

BATCH_SIZE = 5000

for start in range(0, len(data), BATCH_SIZE):

    batch = data[start:start + BATCH_SIZE]

    cursor.executemany(sql, batch)
    connection.commit()

    inserted = min(start + BATCH_SIZE, len(data))

    print(f"Inserted {inserted:,} / {len(data):,}")

cursor.execute("SELECT COUNT(*) FROM orders")
count = cursor.fetchone()[0]

print("\nOrder data inserted successfully!")
print(f"Rows currently in orders table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")