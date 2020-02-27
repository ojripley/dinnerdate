import React from 'react';

import './styles/MealHistory.scss';

export default function MealHistory(props) {

  const mealsObject = {};

  for (let meal of props.meals) {
    mealsObject[meal.id] = meal.name;
  }

  const historyComponents = props.mealHistory.map(element => {
    
    console.log(element);
    console.log(mealsObject);
    
    return (
    <p key={element.date}>{mealsObject[element.meal_id]}</p>
    );
  });


  console.log(historyComponents.length);
  return (
    <>
      {historyComponents.length > 0 && <p>Recent History</p> }
      {historyComponents}
    </>
  );
};