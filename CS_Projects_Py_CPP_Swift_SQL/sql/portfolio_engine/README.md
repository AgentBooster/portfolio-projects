# Portfolio Engine (CS50 SQL Final Project)

#### Video Demo: [https://youtu.be/5bQ4sG4z0AA](https://youtu.be/5bQ4sG4z0AA)

**How to Design a Financial Database: Joins, Triggers, and Indexes (SQL)**

<a href="https://youtu.be/5bQ4sG4z0AA">
  <img src="https://img.youtube.com/vi/5bQ4sG4z0AA/maxresdefault.jpg" width="720" />
</a>

[![Watch on YouTube](https://img.shields.io/badge/▶%20Watch%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/5bQ4sG4z0AA)

## Description

This project implements a SQL database to track financial portfolios. It manages users, assets, and transactions, with a specific focus on maintaining historical performance data through snapshots.

The schema is built on SQLite for portability and supports standard market tickers, including currency pairs like `USDUYU=X`.

## Getting Started

To initialize the database and run the built-in test queries:

```bash
sqlite3 portfolio.db < schema.sql
sqlite3 portfolio.db < queries.sql
```

## Files

- `schema.sql`: Core architecture (tables, views, indexes, and triggers).
- `queries.sql`: Functional tests and example implementation.
- `DESIGN.md`: Technical rationale behind the schema design.

## Implementation Example

To avoid "no such table" errors, you must load the schema first. Run these commands at the SQLite prompt after opening the database (`sqlite3 portfolio.db`):

1. Environment Setup  
   Initialize the tables and configure the display mode.

```sql
.read schema.sql
.mode box
.headers on
```

2. Data Entry  
   Register a user, a portfolio, and an asset.

```sql
INSERT INTO "users" ("full_name", "email") VALUES ('Christian Moraes', 'christian@example.com');

INSERT INTO "portfolios" ("user_id", "name")
SELECT "id", 'Retirement Savings' FROM "users" WHERE "email" = 'christian@example.com';

INSERT INTO "assets" ("ticker", "name", "asset_type") VALUES ('USDUYU=X', 'USD/UYU', 'FX');
```

3. Transactions and Views  
   Record a buy. The `portfolio_summary` view calculates the balance automatically.

```sql
INSERT INTO "transactions" ("portfolio_id", "asset_id", "transaction_type", "units", "buy_price", "executed_at")
SELECT p.id, a.id, 'BUY', 100, 38, '2025-01-01'
FROM "portfolios" p, "assets" a WHERE a.ticker = 'USDUYU=X' AND p.name = 'Retirement Savings';

SELECT * FROM "portfolio_summary";
```

4. Audit Verification  
   Delete the transaction to trigger the audit log. After this, `portfolio_summary` will appear empty, but the record will persist in the logs.

```sql
DELETE FROM "transactions" WHERE id = 1;
SELECT * FROM "transaction_logs";
```
