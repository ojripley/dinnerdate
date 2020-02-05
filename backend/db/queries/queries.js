const db = require('./poolSetup');

const fetchUserByUsername = function(username) {
  const vars = [username];

  return db.query(`
    SELECT id, username, password
    FROM users
    WHERE username = $1;
  `, vars)
  .then(res => {
    return res.rows;
  })
  .catch(error => {
    console.log(error);
  });
};

const fetchMealById = function(id) {
  const vars = [id];

  return db.query(`
    SELECT *
    FROM meals
    WHERE meals = $1;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const fetchMealByName = function(name) {
  const vars = [name];

  return db.query(`
    SELECT *
    FROM meals
    WHERE name ILIKE $1;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const fetchMealsByUserId = function(userId) {
  const vars = [userId];

  return db.query(`
    SELECT meals.id, meals.name, users_meals.last_eaten, users_meals.rating FROM meals
    JOIN users_meals ON users_meals.meal_id = meals.id
    WHERE users_meals.user_id = $1
    ORDER BY users_meals.last_eaten;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const insertUser = function(username, password) {
  const vars = [username, password]

  return db.query(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING username, id;
  `, vars)
  .then(res => {
    return res.rows;
  })
  .catch(error => {
    console.log(error);
  });
};

const insertMeal = function(name) {
  const vars = [name];

  return db.query(`
    INSERT INTO meals (name)
    VALUES ($1)
    RETURNING name, id;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const insertUsersMeal = function(userId, mealId) {
  const vars = [userId, mealId];

  return db.query(`
    INSERT INTO users_meals
    VALUES ($1, $2);
  `, vars)
    .then(() => {
      return;
    })
    .catch(error => {
      console.log(error);
    });
};

const insertPlannedMeal = function(userId, mealId, mealType, date) {
  vars = [userId, mealId, mealType, date];

  return db.query(`
    INSERT INTO planned_meals (user_id, meal_id, mealType, date)
    VALUES ($1, $2, $3, $4);
  `, vars)
    .then(() => {
      return;
    })
    .catch(error => {
      console.log(error);
    })
};

const updateUsersMealsLastEaten = function(userId, mealId, date) {
  vars = [userId, mealId, date];

  return db.query(`
    UPDATE users_meals
    SET last_eaten = $3
    WHERE user_id = $1
    AND meal_id = $2;
  `, vars)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  fetchUserByUsername,
  fetchMealById,
  fetchMealsByUserId,
  fetchMealByName,
  insertUser,
  insertMeal,
  insertUsersMeal,
  insertPlannedMeal,
  updateUsersMealsLastEaten,
};