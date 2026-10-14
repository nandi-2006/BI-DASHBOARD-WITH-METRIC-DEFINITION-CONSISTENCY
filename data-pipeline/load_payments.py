import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_order_payments_dataset.csv"

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

# Convert missing values to None
df = df.astype(object).where(pd.notnull(df), None)

sql = """
INSERT INTO payments (
    order_id,
    payment_sequential,
    payment_type,
    payment_installments,
    payment_value
)
VALUES (%s, %s, %s, %s, %s)
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

cursor.execute("SELECT COUNT(*) FROM payments")
count = cursor.fetchone()[0]

print("\nPayment data inserted successfully!")
print(f"Rows currently in payments table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")