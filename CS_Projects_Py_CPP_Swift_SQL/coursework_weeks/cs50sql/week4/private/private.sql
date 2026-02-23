CREATE VIEW "message" AS
SELECT "phrase"
FROM (
    SELECT 1 AS "idx", substr("sentence", 98, 4) AS "phrase"
    FROM "sentences"
    WHERE "id" = 14
    UNION ALL
    SELECT 2 AS "idx", substr("sentence", 3, 5) AS "phrase"
    FROM "sentences"
    WHERE "id" = 114
    UNION ALL
    SELECT 3 AS "idx", substr("sentence", 72, 9) AS "phrase"
    FROM "sentences"
    WHERE "id" = 618
    UNION ALL
    SELECT 4 AS "idx", substr("sentence", 7, 3) AS "phrase"
    FROM "sentences"
    WHERE "id" = 630
    UNION ALL
    SELECT 5 AS "idx", substr("sentence", 12, 5) AS "phrase"
    FROM "sentences"
    WHERE "id" = 932
    UNION ALL
    SELECT 6 AS "idx", substr("sentence", 50, 7) AS "phrase"
    FROM "sentences"
    WHERE "id" = 2230
    UNION ALL
    SELECT 7 AS "idx", substr("sentence", 44, 10) AS "phrase"
    FROM "sentences"
    WHERE "id" = 2346
    UNION ALL
    SELECT 8 AS "idx", substr("sentence", 14, 5) AS "phrase"
    FROM "sentences"
    WHERE "id" = 3041
)
ORDER BY "idx";
