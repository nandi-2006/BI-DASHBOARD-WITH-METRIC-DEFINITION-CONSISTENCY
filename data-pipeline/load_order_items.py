import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_order_items_dataset.csv"

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

# Convert date column
df["shipping_limit_date"] = pd.to_datetime(
    df["shipping_limit_date"],
    errors="coerce"
)

# Convert missing values to None
df = df.astype(object).where(pd.notnull(df), None)

sql = """
INSERT INTO order_items (
    order_id,
    order_item_id,
    product_id,
    seller_id,
    shipping_limit_date,
    price,
    freight_value
)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

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

cursor.execute("SELECT COUNT(*) FROM order_items")
count = cursor.fetchone()[0]

print("\nOrder items data inserted successfully!")
print(f"Rows currently in order_items table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")