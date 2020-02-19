import React from 'react';

import MealQuickAdd from './MealQuickAdd';

export default function Menu(props) {

  const mealComponents = props.meals.map(meal => {
    console.log(meal);
    return (
      <p
        key={meal.id}
      >{meal.name}</p>
    );
  });

  return(
    <div className={'menu-container'}>
      <div className={props.menuClasses}>
        <MealQuickAdd socket={props.socket} socketOpen={props.socketOpen} user={props.user} ></MealQuickAdd>
        <div className={'meal-list'}>
          {mealComponents}
        </div>
      </div>
    </div>
  );
};