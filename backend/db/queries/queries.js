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
    WHERE users_meals.user_id = $1;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const fetchUsersMealByIds = function(userId, mealId) {
  const vars = [userId, mealId];

  return db.query(`
    SELECT *
    FROM users_meals
    WHERE user_id = $1
    AND meal_id = $2;
  `, vars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    })
};

const fetchTodaysMeal = function(userId) {

  let date = new Date();

  let m = date.getMinutes();
  let hh = date.getHours();
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // Jan is 0!
  let yyyy = date.getFullYear();
  if (m < 10) {
    m = '0' + m;
  }
  if (hh < 10) {
    m = '0' + m;
  }
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  const currentDate = yyyy + '-' + mm + '-' + dd;

  console.log('checking for todays meal...', currentDate);

  const vars = [userId, currentDate];

  return db.query(`
    SELECT date, meals.name FROM planned_meals
    JOIN meals on meals.id = planned_meals.meal_id
    WHERE user_id = $1
    AND planned_meals.date = $2;
  `, vars)
    .then((res) => {
      console.log(res.rows);
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

const insertUsersMeal = function (userId, mealId) {
  const vars = [userId, mealId];

  console.log('inserting user meal', vars);

  return db.query(`
    INSERT INTO users_meals (user_id, meal_id)
    VALUES ($1, $2)
    RETURNING meal_id;
  `, vars)
    .then((res) => {
      return res.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

const insertPlannedMeal = function(userId, mealId) {

  let date = new Date();

  let m = date.getMinutes();
  let hh = date.getHours();
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // Jan is 0!
  let yyyy = date.getFullYear();
  if (m < 10) {
    m = '0' + m;
  }
  if (hh < 10) {
    m = '0' + m;
  }
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  const currentDate = yyyy + '-' + mm + '-' + dd;

  vars = [userId, mealId, currentDate];

  return db.query(`
    INSERT INTO planned_meals (user_id, meal_id, date)
    VALUES ($1, $2, $3);
  `, vars)
    .then(() => {
      return;
    })
    .catch(error => {
      console.log(error);
    })
};

const updatePlannedMeal = function(userId, mealId) {

  let date = new Date();

  let m = date.getMinutes();
  let hh = date.getHours();
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // Jan is 0!
  let yyyy = date.getFullYear();
  if (m < 10) {
    m = '0' + m;
  }
  if (hh < 10) {
    m = '0' + m;
  }
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  const currentDate = yyyy + '-' + mm + '-' + dd;


  const vars = [userId, mealId, currentDate];

  console.log('updating where, ', userId, mealId, currentDate);

  return db.query(`
    UPDATE planned_meals
    SET meal_id = $2
    WHERE user_id = $1
    AND date LIKE $3;
  `, vars)
    .then(() => {
      console.log('last_eaten updated');
      return true;
    })
    .catch(() => {
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
  fetchMealByName,
  fetchUsersMealByIds,
  fetchTodaysMeal,
  insertUser,
  insertMeal,
  insertUsersMeal,
  insertPlannedMeal,
  updatePlannedMeal,
  updateUsersMealsLastEaten,
};