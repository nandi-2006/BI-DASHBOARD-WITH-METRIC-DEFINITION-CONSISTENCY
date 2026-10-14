import pandas as pd
import mysql.connector
import random
from datetime import timedelta

# =========================
# DATABASE CONFIGURATION
# =========================

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
# GET DELIVERED ORDERS
# =========================

query = """
SELECT
    order_id,
    order_delivered_customer_date
FROM orders
WHERE order_status = 'delivered'
  AND order_delivered_customer_date IS NOT NULL
"""

orders = pd.read_sql(query, connection)

print(f"Delivered orders found: {len(orders):,}")


# =========================
# SELECT REFUND ORDERS
# =========================

# Fixed seed makes our synthetic dataset reproducible
random.seed(42)

REFUND_RATE = 0.05

refund_count = int(len(orders) * REFUND_RATE)

refund_orders = orders.sample(
    n=refund_count,
    random_state=42
).copy()

print(f"Synthetic refunds to generate: {len(refund_orders):,}")


# =========================
# GET ORDER ITEM TOTALS
# =========================

order_ids = tuple(refund_orders["order_id"].tolist())

placeholders = ",".join(["%s"] * len(order_ids))

query = f"""
SELECT
    order_id,
    SUM(price) AS order_total
FROM order_items
WHERE order_id IN ({placeholders})
GROUP BY order_id
"""

cursor.execute(query, order_ids)

order_totals = cursor.fetchall()

totals_df = pd.DataFrame(
    order_totals,
    columns=["order_id", "order_total"]
)

refund_orders = refund_orders.merge(
    totals_df,
    on="order_id",
    how="inner"
)


# =========================
# GENERATE REFUNDS
# =========================

refund_rows = []

reasons = [
    "Customer requested refund",
    "Product returned",
    "Damaged product",
    "Incorrect product",
    "Order issue"
]

for _, row in refund_orders.iterrows():

    order_total = float(row["order_total"])

    # Refund between 10% and 100% of item value
    refund_percentage = random.uniform(0.10, 1.00)

    refund_amount = round(
        order_total * refund_percentage,
        2
    )

    refund_date = (
        pd.to_datetime(row["order_delivered_customer_date"])
        + timedelta(days=random.randint(1, 30))
    )

    refund_rows.append(
        (
            f"REF-{row['order_id']}",
            row["order_id"],
            refund_date.to_pydatetime(),
            refund_amount,
            random.choice(reasons)
        )
    )


# =========================
# INSERT REFUNDS
# =========================

sql = """
INSERT INTO refunds (
    refund_id,
    order_id,
    refund_date,
    refund_amount,
    refund_reason
)
VALUES (%s, %s, %s, %s, %s)
"""

print("\nInserting synthetic refunds...")

cursor.executemany(sql, refund_rows)

connection.commit()

print(f"Inserted refunds: {len(refund_rows):,}")


# =========================
# VERIFY
# =========================

cursor.execute("SELECT COUNT(*) FROM refunds")
count = cursor.fetchone()[0]

cursor.execute("SELECT COALESCE(SUM(refund_amount), 0) FROM refunds")
total_refunds = cursor.fetchone()[0]

print("\nSynthetic refund data generated successfully!")
print(f"Refund rows in database: {count:,}")
print(f"Total refund amount: {total_refunds:,.2f}")


cursor.close()
connection.close()

print("\nDone!")