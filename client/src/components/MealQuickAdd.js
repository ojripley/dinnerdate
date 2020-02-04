import React, { useState} from 'react';

import Button from'./Button';

export default function MealQuickAdd(props) {

  const [textAreaValue, setTextAreaValue] = useState('');

  const addMeal = function() {
    if(props.socketOpen) {
      props.socket.emit('addMeal', {mealName: textAreaValue, user: props.user});
    }
  };

  const handleTextAreaChange = function(value) {
    setTextAreaValue(value);
  }

  return(
    <div className={'mealQuickAdd'}>
      <textarea onChange={event => handleTextAreaChange(event.target.value)}></textarea>
      <Button className={'add-meal-button'} onClick={addMeal} text={'Add Meal'}></Button>
    </div>
  );
};