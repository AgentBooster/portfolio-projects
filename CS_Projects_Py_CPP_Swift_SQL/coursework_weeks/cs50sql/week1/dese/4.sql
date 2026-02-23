SELECT "city", COUNT(*) AS "public_schools"
FROM "schools"
WHERE "type" = 'Public School'
GROUP BY "city"
ORDER BY "public_schools" DESC, "city" ASC
LIMIT 10;
