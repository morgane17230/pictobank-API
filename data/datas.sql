BEGIN;

INSERT INTO
  "category" ("name", "color")
VALUES
('manger', '#03fcb6'),
('dormir','#7303fc'),
('se promener', '#fc0398'),
('se laver', '#fcbe03'),
('jouer', '#3003fc'),
('travailler', '#fc031c'),
('autre', '#03fcc6');

INSERT INTO
  "account" ("id", "lastname", "firstname", "email", "name", "isOrganization")
VALUES
('ee47f3a0-941c-11ec-b909-0242ac120002', 'Gambis', 'Morgane', 'aboumorgane@live.fr', 'pikto', false),
('41255716-941d-11ec-b909-0242ac120002', 'Gambis', 'Vincent', 'bbamoi6@live.fr', 'IME', true);

INSERT INTO
  "user" ("username", "password", "role", "account_id")
VALUES
('PIKTO', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'isOwner', 'ee47f3a0-941c-11ec-b909-0242ac120002'),
('IME-ADMIN', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'admin', '41255716-941d-11ec-b909-0242ac120002'),
('IME-USER', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'user', '41255716-941d-11ec-b909-0242ac120002');

COMMIT;