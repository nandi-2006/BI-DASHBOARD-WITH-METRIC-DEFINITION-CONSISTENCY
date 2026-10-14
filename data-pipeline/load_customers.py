import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_customers_dataset.csv"

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

# SQL INSERT statement
sql = """
INSERT INTO customers (
    customer_id,
    customer_unique_id,
    customer_zip_code_prefix,
    customer_city,
    customer_state
)
VALUES (%s, %s, %s, %s, %s)
"""

# Convert NaN values to None
df = df.where(pd.notnull(df), None)

# Convert dataframe rows to tuples
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

    inserted = min(start + BATCH_SIZE,	 len(data))

    print(f"Inserted {inserted:,} / {len(data):,}")

print("\nCustomer data inserted successfully!")

# Verify count
cursor.execute("SELECT COUNT(*) FROM customers")
count = cursor.fetchone()[0]

print(f"Rows currently in customers table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")