SELECT "title", "air_date"
FROM "episodes"
WHERE "title" LIKE '%Hacker%'
  AND "air_date" >= '2010-01-01'
ORDER BY "air_date";
