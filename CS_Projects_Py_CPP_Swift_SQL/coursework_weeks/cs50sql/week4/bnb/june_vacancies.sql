CREATE VIEW "june_vacancies" AS
SELECT
    "listings"."id",
    "listings"."property_type",
    "listings"."host_name",
    COUNT("availabilities"."id") AS "days_vacant"
FROM "listings"
JOIN "availabilities" ON "listings"."id" = "availabilities"."listing_id"
WHERE "availabilities"."available" = 'TRUE'
  AND "availabilities"."date" BETWEEN '2023-06-01' AND '2023-06-30'
GROUP BY "listings"."id";
