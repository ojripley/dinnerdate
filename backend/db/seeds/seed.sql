INSERT INTO users (username, password)
VALUES('rips', 'p'),
('bean', 'p');

INSERT INTO meals (name, prep_time, added_by_user)
VALUES
('salmon', 20, 1),
('herb crusted tenderloin', 20, 2),
('seafood enchiladas', 20, 1),
('seafood pasta', 20, 1),
('burgers', 20, 1),
('steak', 20, 1),
('tilapia', 20, 1),
('nachos', 20, 1),
('byron bay bowl', 20, 2),
('stirfry', 20, 1);

INSERT INTO users_meals (user_id, meal_id)
VALUES
(1, 1),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 10),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10);

