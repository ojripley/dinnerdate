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

const fetchMealsByUserId = function(userId) {
  const vars = [userId];

  return db.query(`
    SELECT meals.id, meals.name, meals.prep_time, users_meals.last_eaten, users_meals.rating FROM meals
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

const insertMeal = function(name, prepTime, addedBy) {
  const vars = [name, prepTime, addedBy]

  return db.query(`
    INSERT INTO meals (name, prep_time, added_by_user)
    VALUES ($1, $2, $3)
    RETURNING name, id, prep_time, added_by_user;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
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
  insertUser,
  insertMeal,
  updateUsersMealsLastEaten
};