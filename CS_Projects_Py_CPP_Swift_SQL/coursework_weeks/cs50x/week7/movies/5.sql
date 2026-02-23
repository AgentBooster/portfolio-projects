-- 5.sql: List the titles and released years of all Harry Potter movies, in chronological order.
SELECT title, year FROM movies WHERE title LIKE 'Harry Potter and the%' ORDER BY year;
