BEGIN;

INSERT INTO
  "category" ("name", "color")
VALUES
('manger', '{"background": "#03fcb6", "text": "black"}'),
('dormir', '{"background": "#7303fc", "text": "white"}'),
('se promener', '{"background": "#fc0398", "text": "black"}'),
('se laver','{"background": "#fcbe03", "text": "black"}'),
('jouer', '{"background": "#3003fc", "text": "white"}'),
('travailler', '{"background": "#fc031c", "text": "white"}'),
('autre', '{"background": "#03fcc6", "text": "black"}');

INSERT INTO
  "account" ("id", "lastname", "firstname", "email", "name", "isOrganization")
VALUES
('ee47f3a0-941c-11ec-b909-0242ac120002', 'Gambis', 'Morgane', 'aboumorgane@live.fr', 'pikto', false),
('41255716-941d-11ec-b909-0242ac120002', 'Gambis', 'Vincent', 'mgambis@outlook.fr', 'IME', true);

INSERT INTO
  "user" ("username", "password", "role", "account_id")
VALUES
('PIKTO', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'isOwner', 'ee47f3a0-941c-11ec-b909-0242ac120002'),
('IME-ADMIN', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'admin', '41255716-941d-11ec-b909-0242ac120002'),
('IME-USER', '$2a$10$oTHyg7kTinoGw6P6rfMQiOE7sbdBGtSelJ5zTCGOvmGayrR7eyEbG', 'user', '41255716-941d-11ec-b909-0242ac120002');

COMMIT;