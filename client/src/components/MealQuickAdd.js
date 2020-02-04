import React, { useState} from 'react';

import Button from'./Button';

export default function MealQuickAdd() {

  const addMeal = function() {
    console.log('adding...');

    console.log()
  }

  return(
    <div className={'mealQuickAdd'}>
      <textarea></textarea>
      <Button className={'add-meal-button'} onClick={addMeal} text={'Add Meal'}></Button>
    </div>
  );
};