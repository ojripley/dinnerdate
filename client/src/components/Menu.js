import React from 'react';

import MealQuickAdd from './MealQuickAdd';

export default function Menu(props) {

  return(
    <div className={'menu-container'}>
      <div className={props.menuClasses}>
        <MealQuickAdd socket={props.socket} socketOpen={props.socketOpen} user={props.user} ></MealQuickAdd>
      </div>
    </div>
  );
};