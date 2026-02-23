-- *** The Lost Letter ***
-- Find Anneke's address
SELECT "id" FROM "addresses" WHERE "address" = '900 Somerville Avenue';

-- Find Varsha's address (note the tricky spelling).
SELECT "id" FROM "addresses" WHERE "address" LIKE '%Finnigan%';

-- Find the package sent from Anneke.
SELECT "id", "contents", "to_address_id"
FROM "packages"
WHERE "from_address_id" = 432;

-- Find the most recent scan for that package.
SELECT "addresses"."address", "addresses"."type"
FROM "scans"
JOIN "addresses" ON "scans"."address_id" = "addresses"."id"
WHERE "scans"."package_id" = 384
ORDER BY "scans"."timestamp" DESC
LIMIT 1;

-- *** The Devious Delivery ***
-- Find the package with no sender.
SELECT "id", "contents", "to_address_id"
FROM "packages"
WHERE "from_address_id" IS NULL;

-- Find the most recent scan for that package.
SELECT "addresses"."address", "addresses"."type"
FROM "scans"
JOIN "addresses" ON "scans"."address_id" = "addresses"."id"
WHERE "scans"."package_id" = 5098
ORDER BY "scans"."timestamp" DESC
LIMIT 1;

-- *** The Forgotten Gift ***
-- Find the sender and recipient addresses
SELECT "id" FROM "addresses" WHERE "address" = '109 Tileston Street';
SELECT "id" FROM "addresses" WHERE "address" = '728 Maple Place';

-- Find the package sent between those addresses.
SELECT "id", "contents"
FROM "packages"
WHERE "from_address_id" = 9873
  AND "to_address_id" = 4983;

-- Find who last scanned the package.
SELECT "drivers"."name"
FROM "scans"
JOIN "drivers" ON "scans"."driver_id" = "drivers"."id"
WHERE "scans"."package_id" = 9523
ORDER BY "scans"."timestamp" DESC
LIMIT 1;
