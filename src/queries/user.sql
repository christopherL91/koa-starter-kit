DO
$body$
BEGIN
   IF NOT EXISTS (
      SELECT *
      FROM   pg_catalog.pg_user
      WHERE  usename = ${username}) THEN

      CREATE ROLE ${username^} LOGIN PASSWORD ${password};
   END IF;
END
$body$;
