CREATE TABLE "ingredients" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "unit" TEXT NOT NULL,
    "price_per_unit" NUMERIC NOT NULL CHECK ("price_per_unit" >= 0)
);

CREATE TABLE "donuts" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "gluten_free" INTEGER NOT NULL CHECK ("gluten_free" IN (0, 1)),
    "price" NUMERIC NOT NULL CHECK ("price" >= 0)
);

CREATE TABLE "donut_ingredients" (
    "donut_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    PRIMARY KEY ("donut_id", "ingredient_id"),
    FOREIGN KEY ("donut_id") REFERENCES "donuts"("id"),
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id")
);

CREATE TABLE "customers" (
    "id" INTEGER PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

CREATE TABLE "orders" (
    "order_number" INTEGER PRIMARY KEY,
    "customer_id" INTEGER NOT NULL,
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
);

CREATE TABLE "order_items" (
    "order_number" INTEGER NOT NULL,
    "donut_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL CHECK ("quantity" > 0),
    PRIMARY KEY ("order_number", "donut_id"),
    FOREIGN KEY ("order_number") REFERENCES "orders"("order_number"),
    FOREIGN KEY ("donut_id") REFERENCES "donuts"("id")
);
