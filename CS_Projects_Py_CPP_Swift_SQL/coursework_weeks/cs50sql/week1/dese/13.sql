SELECT
    "schools"."name",
    "districts"."name" AS "district",
    "graduation_rates"."dropped" AS "dropout_rate"
FROM "schools"
JOIN "districts" ON "schools"."district_id" = "districts"."id"
JOIN "graduation_rates" ON "schools"."id" = "graduation_rates"."school_id"
ORDER BY "graduation_rates"."dropped" DESC, "schools"."name" ASC
LIMIT 10;
