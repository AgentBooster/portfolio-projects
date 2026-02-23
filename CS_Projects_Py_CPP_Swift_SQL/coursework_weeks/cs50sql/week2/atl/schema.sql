CREATE TABLE "passengers" (
    "id" INTEGER PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL CHECK ("age" >= 0)
);

CREATE TABLE "airlines" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "concourses" (
    "code" TEXT PRIMARY KEY CHECK ("code" IN ('A', 'B', 'C', 'D', 'E', 'F', 'T'))
);

CREATE TABLE "airline_concourses" (
    "airline_id" INTEGER NOT NULL,
    "concourse_code" TEXT NOT NULL,
    PRIMARY KEY ("airline_id", "concourse_code"),
    FOREIGN KEY ("airline_id") REFERENCES "airlines"("id"),
    FOREIGN KEY ("concourse_code") REFERENCES "concourses"("code")
);

CREATE TABLE "flights" (
    "id" INTEGER PRIMARY KEY,
    "flight_number" TEXT NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "origin_airport" TEXT NOT NULL CHECK (LENGTH("origin_airport") = 3),
    "destination_airport" TEXT NOT NULL CHECK (LENGTH("destination_airport") = 3),
    "scheduled_departure" TEXT NOT NULL,
    "scheduled_arrival" TEXT NOT NULL,
    FOREIGN KEY ("airline_id") REFERENCES "airlines"("id")
);

CREATE TABLE "check_ins" (
    "id" INTEGER PRIMARY KEY,
    "passenger_id" INTEGER NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "checked_in_at" TEXT NOT NULL,
    FOREIGN KEY ("passenger_id") REFERENCES "passengers"("id"),
    FOREIGN KEY ("flight_id") REFERENCES "flights"("id")
);
