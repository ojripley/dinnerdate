import React from 'react';

import MealQuickAdd from './MealQuickAdd';
import MealList from './MealList';

export default function Menu(props) {

  return(
    <div className={'menu-container'}>
      <div className={props.menuClasses}>
        <MealQuickAdd socket={props.socket} socketOpen={props.socketOpen} user={props.user} ></MealQuickAdd>
        <MealList meals={props.meals} socket={props.socket} socketOpen={props.socketOpen} user={props.user} ></MealList>
      </div>
    </div>
  );
};