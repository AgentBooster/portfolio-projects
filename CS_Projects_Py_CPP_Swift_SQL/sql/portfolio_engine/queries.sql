-- Add a user (safe to re-run)
INSERT OR IGNORE INTO "users" ("full_name", "email")
VALUES ('Christian Moraes', 'christian@example.com');

-- Create a portfolio for that user
INSERT OR IGNORE INTO "portfolios" ("user_id", "name", "description")
SELECT "id", 'Retirement Savings', 'Long-term savings'
FROM "users"
WHERE "email" = 'christian@example.com';

-- Add assets (safe to re-run)
INSERT OR IGNORE INTO "assets" ("ticker", "name", "asset_type")
VALUES ('USDUYU=X', 'USD/UYU', 'FX');

INSERT OR IGNORE INTO "assets" ("ticker", "name", "asset_type")
VALUES ('AAPL', 'Apple Inc.', 'STOCK');

-- Record a buy transaction
INSERT INTO "transactions" (
    "portfolio_id",
    "asset_id",
    "transaction_type",
    "units",
    "buy_price",
    "executed_at"
)
SELECT
    "portfolios"."id",
    "assets"."id",
    'BUY',
    100,
    38,
    '2025-01-01'
FROM "portfolios"
JOIN "users" ON "portfolios"."user_id" = "users"."id"
JOIN "assets" ON "assets"."ticker" = 'USDUYU=X'
WHERE "users"."email" = 'christian@example.com'
  AND "portfolios"."name" = 'Retirement Savings'
  AND NOT EXISTS (
      SELECT 1
      FROM "transactions"
      WHERE "portfolio_id" = "portfolios"."id"
        AND "asset_id" = "assets"."id"
        AND "transaction_type" = 'BUY'
        AND "units" = 100
        AND "buy_price" = 38
        AND "executed_at" = '2025-01-01'
  );

-- Store a snapshot
INSERT INTO "snapshots" (
    "portfolio_id",
    "asset_id",
    "units",
    "buy_price",
    "current_price",
    "initial_value",
    "current_value",
    "performance_pct",
    "observed_at"
)
SELECT
    "portfolios"."id",
    "assets"."id",
    100,
    38,
    40,
    3800,
    4000,
    5.26,
    '2025-01-01 10:00:00'
FROM "portfolios"
JOIN "users" ON "portfolios"."user_id" = "users"."id"
JOIN "assets" ON "assets"."ticker" = 'USDUYU=X'
WHERE "users"."email" = 'christian@example.com'
  AND "portfolios"."name" = 'Retirement Savings'
  AND NOT EXISTS (
      SELECT 1
      FROM "snapshots"
      WHERE "portfolio_id" = "portfolios"."id"
        AND "asset_id" = "assets"."id"
        AND "observed_at" = '2025-01-01 10:00:00'
  );

-- See the current units per asset in a portfolio
SELECT "portfolio_name", "ticker", "net_units"
FROM "portfolio_summary"
WHERE "portfolio_id" = (
    SELECT "portfolios"."id"
    FROM "portfolios"
    JOIN "users" ON "portfolios"."user_id" = "users"."id"
    WHERE "users"."email" = 'christian@example.com'
      AND "portfolios"."name" = 'Retirement Savings'
);

-- Show the last snapshot for a user
SELECT
    "users"."full_name",
    "assets"."ticker",
    "snapshots"."current_price",
    "snapshots"."performance_pct",
    "snapshots"."observed_at"
FROM "snapshots"
JOIN "portfolios" ON "snapshots"."portfolio_id" = "portfolios"."id"
JOIN "users" ON "portfolios"."user_id" = "users"."id"
JOIN "assets" ON "snapshots"."asset_id" = "assets"."id"
WHERE "users"."email" = 'christian@example.com'
ORDER BY "snapshots"."observed_at" DESC
LIMIT 1;

-- Fix a price if a manual entry was wrong
UPDATE "transactions"
SET "buy_price" = 37.50
WHERE "id" = (
    SELECT "transactions"."id"
    FROM "transactions"
    JOIN "portfolios" ON "transactions"."portfolio_id" = "portfolios"."id"
    JOIN "users" ON "portfolios"."user_id" = "users"."id"
    JOIN "assets" ON "transactions"."asset_id" = "assets"."id"
    WHERE "users"."email" = 'christian@example.com'
      AND "portfolios"."name" = 'Retirement Savings'
      AND "assets"."ticker" = 'USDUYU=X'
      AND "transactions"."executed_at" = '2025-01-01'
    LIMIT 1
);

-- Delete a transaction (trigger will log it)
DELETE FROM "transactions"
WHERE "id" = (
    SELECT "transactions"."id"
    FROM "transactions"
    JOIN "portfolios" ON "transactions"."portfolio_id" = "portfolios"."id"
    JOIN "users" ON "portfolios"."user_id" = "users"."id"
    JOIN "assets" ON "transactions"."asset_id" = "assets"."id"
    WHERE "users"."email" = 'christian@example.com'
      AND "portfolios"."name" = 'Retirement Savings'
      AND "assets"."ticker" = 'USDUYU=X'
      AND "transactions"."executed_at" = '2025-01-01'
    LIMIT 1
);

-- Review the audit log
SELECT *
FROM "transaction_logs"
ORDER BY "deleted_at" DESC;
