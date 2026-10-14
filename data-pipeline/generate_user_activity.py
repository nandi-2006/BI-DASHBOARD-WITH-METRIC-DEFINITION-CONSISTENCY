import pandas as pd
import mysql.connector
import random
from datetime import datetime, timedelta

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "@Harish123",
    "database": "bi_semantic_layer"
}

print("Connecting to MySQL...")

connection = mysql.connector.connect(**DB_CONFIG)
cursor = connection.cursor()

print("MySQL connection successful!")


# =========================
# GET CUSTOMERS
# =========================

query = """
SELECT customer_unique_id
FROM customers
"""

customers = pd.read_sql(query, connection)

print(f"Customers found: {len(customers):,}")


# =========================
# GENERATE ACTIVITY
# =========================

random.seed(42)

activity_types = [
    "LOGIN",
    "VIEW_PRODUCT",
    "SEARCH",
    "ADD_TO_CART",
    "PURCHASE"
]

# Generate activity for 30% of customers
activity_customer_count = int(len(customers) * 0.30)

active_customers = customers.sample(
    n=activity_customer_count,
    random_state=42
)

print(
    f"Customers selected for synthetic activity: "
    f"{len(active_customers):,}"
)


# Activity dates spread across the last 60 days
today = datetime.now()

activity_rows = []

activity_id = 1

for _, row in active_customers.iterrows():

    # Each customer gets between 1 and 5 activities
    number_of_activities = random.randint(1, 5)

    for _ in range(number_of_activities):

        days_ago = random.randint(0, 59)

        activity_date = today - timedelta(
            days=days_ago,
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )

        activity_rows.append(
            (
                row["customer_unique_id"],
                activity_date,
                random.choice(activity_types)
            )
        )


# =========================
# INSERT DATA
# =========================

sql = """
INSERT INTO user_activity (
    customer_unique_id,
    activity_date,
    activity_type
)
VALUES (%s, %s, %s)
"""

print("\nInserting synthetic user activity...")

BATCH_SIZE = 5000

for start in range(0, len(activity_rows), BATCH_SIZE):

    batch = activity_rows[start:start + BATCH_SIZE]

    cursor.executemany(sql, batch)
    connection.commit()

    inserted = min(
        start + BATCH_SIZE,
        len(activity_rows)
    )

    print(
        f"Inserted {inserted:,} / "
        f"{len(activity_rows):,}"
    )


# =========================
# VERIFY
# =========================

cursor.execute(
    "SELECT COUNT(*) FROM user_activity"
)

count = cursor.fetchone()[0]

cursor.execute(
    """
    SELECT COUNT(DISTINCT customer_unique_id)
    FROM user_activity
    WHERE activity_date >= NOW() - INTERVAL 30 DAY
    """
)

active_users_30d = cursor.fetchone()[0]

print("\nSynthetic user activity generated successfully!")

print(
    f"Activity rows in database: {count:,}"
)

print(
    f"Active users in last 30 days: "
    f"{active_users_30d:,}"
)


cursor.close()
connection.close()

print("\nDone!")