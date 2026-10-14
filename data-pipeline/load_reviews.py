import pandas as pd
import mysql.connector

CSV_FILE = r"C:\bi csv\olist_order_reviews_dataset.csv"

print("Reading CSV...")

df = pd.read_csv(CSV_FILE)

print("CSV loaded successfully!")
print("Original rows:", len(df))

# Remove duplicate review IDs
duplicate_count = df["review_id"].duplicated().sum()

print("Duplicate review IDs:", duplicate_count)

df = df.drop_duplicates(
    subset=["review_id"],
    keep="first"
).copy()

print("Rows after removing duplicates:", len(df))

# Convert date columns
date_columns = [
    "review_creation_date",
    "review_answer_timestamp"
]

for col in date_columns:
    df[col] = pd.to_datetime(df[col], errors="coerce")

# Convert missing values to None
df = df.astype(object).where(pd.notnull(df), None)

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
INSERT INTO reviews (
    review_id,
    order_id,
    review_score,
    review_comment_title,
    review_comment_message,
    review_creation_date,
    review_answer_timestamp
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

cursor.execute("SELECT COUNT(*) FROM reviews")
count = cursor.fetchone()[0]

print("\nReview data inserted successfully!")
print(f"Rows currently in reviews table: {count:,}")

cursor.close()
connection.close()

print("\nDone!")