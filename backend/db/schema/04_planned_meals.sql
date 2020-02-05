DROP TABLE IF EXISTS planned_meals CASCADE;

CREATE TABLE planned_meals (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL
);