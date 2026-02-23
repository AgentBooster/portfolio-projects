-- Core users for the tracker
CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Portfolios group assets per user
CREATE TABLE "portfolios" (
    "id" INTEGER PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("user_id", "name"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Assets use standard market tickers, including FX pairs
CREATE TABLE "assets" (
    "id" INTEGER PRIMARY KEY,
    "ticker" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL CHECK ("asset_type" IN ('STOCK', 'FX'))
);

-- Transactions are the source of truth for holdings
CREATE TABLE "transactions" (
    "id" INTEGER PRIMARY KEY,
    "portfolio_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL CHECK ("transaction_type" IN ('BUY', 'SELL')),
    "units" REAL NOT NULL CHECK ("units" > 0),
    "buy_price" REAL NOT NULL CHECK ("buy_price" > 0),
    "executed_at" TEXT NOT NULL,
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id"),
    FOREIGN KEY ("asset_id") REFERENCES "assets"("id")
);

-- Snapshots store results from get_price and calculate_performance
CREATE TABLE "snapshots" (
    "id" INTEGER PRIMARY KEY,
    "portfolio_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "units" REAL NOT NULL CHECK ("units" > 0),
    "buy_price" REAL NOT NULL CHECK ("buy_price" > 0),
    "current_price" REAL NOT NULL CHECK ("current_price" > 0),
    "initial_value" REAL NOT NULL CHECK ("initial_value" > 0),
    "current_value" REAL NOT NULL CHECK ("current_value" > 0),
    "performance_pct" REAL NOT NULL,
    "observed_at" TEXT NOT NULL,
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id"),
    FOREIGN KEY ("asset_id") REFERENCES "assets"("id")
);

-- Keep a log when a transaction is deleted
CREATE TABLE "transaction_logs" (
    "id" INTEGER PRIMARY KEY,
    "transaction_id" INTEGER NOT NULL,
    "portfolio_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "units" REAL NOT NULL,
    "buy_price" REAL NOT NULL,
    "executed_at" TEXT NOT NULL,
    "deleted_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Net units per portfolio and asset
CREATE VIEW "portfolio_summary" AS
SELECT
    "portfolios"."id" AS "portfolio_id",
    "portfolios"."name" AS "portfolio_name",
    "assets"."id" AS "asset_id",
    "assets"."ticker",
    SUM(
        CASE
            WHEN "transactions"."transaction_type" = 'BUY' THEN "transactions"."units"
            ELSE -1 * "transactions"."units"
        END
    ) AS "net_units"
FROM "transactions"
JOIN "portfolios" ON "transactions"."portfolio_id" = "portfolios"."id"
JOIN "assets" ON "transactions"."asset_id" = "assets"."id"
GROUP BY "portfolios"."id", "assets"."id";

-- Index for fast lookups by ticker
CREATE INDEX "assets_ticker"
ON "assets"("ticker");

-- Index for fast lookups by user
CREATE INDEX "portfolios_user_id"
ON "portfolios"("user_id");

-- Audit deletes to keep a trail
CREATE TRIGGER "log_transaction_delete"
AFTER DELETE ON "transactions"
FOR EACH ROW
BEGIN
    INSERT INTO "transaction_logs" (
        "transaction_id",
        "portfolio_id",
        "asset_id",
        "transaction_type",
        "units",
        "buy_price",
        "executed_at"
    )
    VALUES (
        OLD."id",
        OLD."portfolio_id",
        OLD."asset_id",
        OLD."transaction_type",
        OLD."units",
        OLD."buy_price",
        OLD."executed_at"
    );
END;
