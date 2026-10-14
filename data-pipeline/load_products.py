import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_products_dataset.csv"

print("Reading CSV...")

df = pd.read_csv(CSV_FILE)

print("CSV loaded successfully!")
print("Number of rows:", len(df))
print("Columns:")
print(df.columns.tolist())

# Olist CSV uses "lenght"; our database uses "length"
df = df.rename(columns={
    "product_name_lenght": "product_name_length",
    "product_description_lenght": "product_description_length"
})

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
INSERT INTO products (
    product_id,
    product_category_name,
    product_name_length,
    product_description_length,
    product_photos_qty,
    product_weight_g,
    product_length_cm,
    product_height_cm,
    product_width_cm
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Convert NaN to None
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

cursor.execute("SELECT COUNT(*) FROM products")
count = cursor.fetchone()[0]

print("\nProduct data inserted successfully!")
print(f"Rows currently in products table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")