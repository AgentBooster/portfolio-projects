-- Keep a log of any SQL queries you execute as you solve the mystery.

-- 1. Check crime scene reports for the theft description (July 28, 2025, Humphrey Street)
SELECT description 
  FROM crime_scene_reports 
 WHERE year = 2025 AND month = 7 AND day = 28 AND street = 'Humphrey Street';

-- 2. Check interviews transcripts
SELECT transcript 
  FROM interviews 
 WHERE year = 2025 AND month = 7 AND day = 28;

-- 3. Check Flights leaving Fiftyville on July 29th (Earliest)
SELECT f.id, f.hour, f.minute, a.city 
  FROM flights f 
  JOIN airports a ON f.destination_airport_id = a.id 
 WHERE f.origin_airport_id = (SELECT id FROM airports WHERE city = 'Fiftyville') 
   AND f.year = 2025 AND f.month = 7 AND f.day = 29 
 ORDER BY f.hour, f.minute 
 LIMIT 1;

-- 4. Find the Thief by intersecting all clues:
SELECT p.name
  FROM people p
  JOIN bank_accounts b ON p.id = b.person_id
  JOIN atm_transactions atm ON b.account_number = atm.account_number
  JOIN bakery_security_logs bak ON p.license_plate = bak.license_plate
  JOIN phone_calls pc ON p.phone_number = pc.caller
  JOIN passengers pass ON p.passport_number = pass.passport_number
 WHERE atm.year = 2025 AND atm.month = 7 AND atm.day = 28 AND atm.atm_location = 'Leggett Street' AND atm.transaction_type = 'withdraw'
   AND bak.year = 2025 AND bak.month = 7 AND bak.day = 28 AND bak.hour = 10 AND bak.minute BETWEEN 15 AND 25
   AND pc.year = 2025 AND pc.month = 7 AND pc.day = 28 AND pc.duration < 60
   AND pass.flight_id = 36;
-- Result: Bruce

-- 5. Find the Accomplice (receiver of Bruce's call)
SELECT p.name 
  FROM people p 
 WHERE p.phone_number = (
       SELECT receiver 
         FROM phone_calls 
        WHERE caller = (SELECT phone_number FROM people WHERE name = 'Bruce')
          AND year = 2025 AND month = 7 AND day = 28 AND duration < 60
       );
-- Result: Robin
