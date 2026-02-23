SELECT "players"."first_name", "players"."last_name"
FROM "players"
WHERE "players"."id" IN (
    SELECT "players"."id"
    FROM "players"
    JOIN "salaries" ON "players"."id" = "salaries"."player_id"
    JOIN "performances" ON "players"."id" = "performances"."player_id"
        AND "salaries"."year" = "performances"."year"
        AND "salaries"."team_id" = "performances"."team_id"
    WHERE "salaries"."year" = 2001
      AND "performances"."H" > 0
    ORDER BY ("salaries"."salary" * 1.0 / "performances"."H") ASC,
             "players"."first_name" ASC,
             "players"."last_name" ASC
    LIMIT 10
)
AND "players"."id" IN (
    SELECT "players"."id"
    FROM "players"
    JOIN "salaries" ON "players"."id" = "salaries"."player_id"
    JOIN "performances" ON "players"."id" = "performances"."player_id"
        AND "salaries"."year" = "performances"."year"
        AND "salaries"."team_id" = "performances"."team_id"
    WHERE "salaries"."year" = 2001
      AND "performances"."RBI" > 0
    ORDER BY ("salaries"."salary" * 1.0 / "performances"."RBI") ASC,
             "players"."first_name" ASC,
             "players"."last_name" ASC
    LIMIT 10
)
ORDER BY "players"."id" ASC;
