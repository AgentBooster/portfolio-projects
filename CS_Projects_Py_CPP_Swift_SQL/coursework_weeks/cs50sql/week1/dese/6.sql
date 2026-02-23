SELECT DISTINCT "schools"."name"
FROM "schools"
JOIN "graduation_rates" ON "schools"."id" = "graduation_rates"."school_id"
WHERE "graduation_rates"."graduated" = 100;
