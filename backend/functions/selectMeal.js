const selectMeal = function(meals) {

  const PAST_MEAL_CUTOFF = 0.20; // change this to whatever percentage of most recent meals you want to cutoff

  const pastMealThreshold = Math.floor((meals.length - 1) * (1 - PAST_MEAL_CUTOFF));
  
  const randomIndex = Math.floor(Math.random() * pastMealThreshold);


  return meals[randomIndex];
}

module.exports = selectMeal;