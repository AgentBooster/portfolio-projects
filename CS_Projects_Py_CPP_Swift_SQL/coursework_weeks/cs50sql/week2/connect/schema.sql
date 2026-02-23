CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL
);

CREATE TABLE "schools" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "founded_year" INTEGER
);

CREATE TABLE "companies" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "location" TEXT NOT NULL
);

CREATE TABLE "connections" (
    "user_id" INTEGER NOT NULL,
    "connection_id" INTEGER NOT NULL,
    PRIMARY KEY ("user_id", "connection_id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("connection_id") REFERENCES "users"("id"),
    CHECK ("user_id" < "connection_id")
);

CREATE TABLE "user_schools" (
    "user_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "degree" TEXT NOT NULL,
    PRIMARY KEY ("user_id", "school_id", "start_date"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("school_id") REFERENCES "schools"("id")
);

CREATE TABLE "user_companies" (
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    PRIMARY KEY ("user_id", "company_id", "start_date"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("company_id") REFERENCES "companies"("id")
);
