import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_sellers_dataset.csv"

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
INSERT INTO sellers (
    seller_id,
    seller_zip_code_prefix,
    seller_city,
    seller_state
)
VALUES (%s, %s, %s, %s)
"""

df = df.astype(object).where(pd.notnull(df), None)

data = [
    tuple(row)
    for row in df.itertuples(index=False, name=None)
]

print("\nInserting data...")

BATCH_SIZE = 1000

for start in range(0, len(data), BATCH_SIZE):

    batch = data[start:start + BATCH_SIZE]

    cursor.executemany(sql, batch)
    connection.commit()

    inserted = min(start + BATCH_SIZE, len(data))

    print(f"Inserted {inserted:,} / {len(data):,}")

cursor.execute("SELECT COUNT(*) FROM sellers")
count = cursor.fetchone()[0]

print("\nSeller data inserted successfully!")
print(f"Rows currently in sellers table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")