const selectMeal = function(meals) {

  const sortedMeals = sortMeals(meals);

  const PAST_MEAL_CUTOFF = 0.20; // change this to whatever percentage of most recent meals you want to cutoff

  const pastMealThreshold = Math.floor((sortedMeals.length - 1) * (1 - PAST_MEAL_CUTOFF));
  
  const randomIndex = Math.floor(Math.random() * pastMealThreshold);

  console.log('meals');
  console.log(meals);
  console.log('sorted');
  console.log(sortedMeals);

  ///////////////////////

// TODO : test meal randomization
//          - need to add last_eaten db updating when a meal is planned

  //////////////////////

  return sortedMeals[randomIndex];
}

const sortMeals = function(meals) {

  console.log('sorting meals....');

  const sortedMeals = [];
  const mealsNotYetEaten = [];

  for (let meal of meals) {

    if (meal.last_eaten === null) {
      // meal has not yet been eaten
      // console.log('adding', meal);
      mealsNotYetEaten.unshift(meal);
    } else {
      // for the first meal
      sortedMeals.unshift(meal);
    }
  }

  console.log(sortedMeals);

  for (let i = 0; i < sortedMeals.length; i++) {
    const outerLastEaten = new Date(sortedMeals[i].last_eaten);
    for (let j = 1; j < sortedMeals.length; j++) {
      const innerLastEaten = new Date(sortedMeals[j].last_eaten);
      if ( outerLastEaten > innerLastEaten){
        const temp = sortedMeals[i];
        sortedMeals[i] = sortedMeals[j];
        sortedMeals[j] = temp;
      }
    }
  }

  const temp = mealsNotYetEaten.concat(sortedMeals);

  console.log('meals are sorted', temp.length);
  console.log(meals.length);
  console.log(temp);



  return temp;
}

module.exports = selectMeal;