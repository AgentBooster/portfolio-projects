UPDATE "users"
SET "password" = '982c0381c279d139fd221fce974916e7'
WHERE "username" = 'admin';

INSERT INTO "user_logs" ("type", "old_username", "new_username", "old_password", "new_password")
SELECT
    'update',
    'admin',
    'admin',
    (
        SELECT "old_password"
        FROM "user_logs"
        WHERE "old_username" = 'admin'
          AND "new_password" = '982c0381c279d139fd221fce974916e7'
        ORDER BY "id" DESC
        LIMIT 1
    ),
    (
        SELECT "password"
        FROM "users"
        WHERE "username" = 'emily33'
    );

DELETE FROM "user_logs"
WHERE "type" = 'update'
  AND "old_username" = 'admin'
  AND "new_password" = '982c0381c279d139fd221fce974916e7';
