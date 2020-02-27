import React from 'react';

import './styles/ScheduledMeal.scss';

export default function ScheduledMeal(props) {

  console.log(props.meal);

  const s = `Todays Meal: ${props.meal.name}`;

  const handleChangeSelectedMeal = function() {
    props.setRandomizedMeal(props.todaysMeal);
    props.setTodaysMeal(null);
    props.setUpdatedMeal(true);
  }

  return(
    <>
      <p className={'scheduled-meal-message'}>{s}</p>
      <button className={'change-selected-meal-button'} onClick={handleChangeSelectedMeal}>Change This</button>
    </>
  );
};