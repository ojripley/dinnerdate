import React, { useState } from 'react';

import './styles/MealQuickAdd.scss';

export default function MealQuickAdd(props) {

  const [mealToAdd, setMealToAdd] = useState('');

  const submitMealToAdd = function() {
    console.log('adding...', mealToAdd);

    if (mealToAdd.length > 0) {      
      if (props.socket) {
        props.socket.emit('addMeal', {user: props.user, mealName: mealToAdd});
      }
    }
  }

  const handleKeyPress = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      submitMealToAdd();
    }
  }

  return(
    <div className={'meal-quick-add'}>
      <textarea className={'add-meal-field'} onChange={event => setMealToAdd(event.target.value)} onKeyPress={handleKeyPress} placeholder={'Add a new meal!'}></textarea>
      <button className={'add-meal-button'} onClick={submitMealToAdd} >Add Meal</button>
    </div>
  );
};