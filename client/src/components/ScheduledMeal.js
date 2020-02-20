import React from 'react';

export default function ScheduledMeal(props) {

  console.log(props.meal);

  const s = `scheduled meal: ${props.meal.name}`;

  const handleChangeSelectedMeal = function() {
    props.setRandomizedMeal(props.todaysMeal);
    props.setTodaysMeal(null);
    props.setUpdatedMeal(true);
  }

  return(
    <>
      <p>{s}</p>
      <button className={'change-selected-meal-button'} onClick={handleChangeSelectedMeal}>Change This</button>
    </>
  );
};