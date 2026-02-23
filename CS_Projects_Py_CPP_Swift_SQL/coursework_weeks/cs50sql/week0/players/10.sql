SELECT "first_name", "last_name", "height" AS "Height (in)"
FROM "players"
WHERE "birth_country" = 'D.R.'
  AND "height" IS NOT NULL
ORDER BY "height" DESC, "last_name", "first_name";
