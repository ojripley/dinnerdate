import React from 'react';

import './styles/MealList.scss';

import Meal from './Meal';

export default function MealList(props) {

  const mealComponents = props.meals.map(meal => {
    return <Meal key={meal.id} meal={meal}></Meal>;
  });

  return(
    <div className={'meal-list'}>
      <p className={'mealListTitle'}>My Meals</p>
      {mealComponents}
    </div>
  );
}