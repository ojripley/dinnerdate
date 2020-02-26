import React, {useEffect, useState} from 'react';

import Button from './Button';
import ScheduledMeal from './ScheduledMeal';
import MealHistory from './MealHistory';

import './styles/Dash.scss';

export default function Dash(props) {

  const handleChooseMeal = function() {
    if (props.socketOpen) {
      console.log('i am');
      console.log(props.user);
      props.socket.emit('chooseMeal', {user: props.user} );

      console.log('meal requested');

      props.socket.on('randomMeal', (data) => {
        console.log(data);
        props.setRandomizedMeal(data.meal);
        props.socket.off('randomMeal');
      });
    }
  };

  const confirmMeal = function() {
    if (props.socketOpen) {
      console.log('confirming', props.randomizedMeal);
      props.socket.emit('confirmMeal', {user: props.user, meal: props.randomizedMeal, updated: props.updatedMeal});
    }
  };

  return (
    <div className={'dash'}>
      {props.todaysMeal ? 
      <ScheduledMeal meal={props.todaysMeal} setRandomizedMeal={props.setRandomizedMeal} randomizedMeal={props.randomizedMeal} todaysMeal={props.todaysMeal} setTodaysMeal={props.setTodaysMeal} setUpdatedMeal={props.setUpdatedMeal} /> :
      <>
        <p id={'meal-message'} className={'text'}>{props.randomizedMeal ? 'Tonight you get to dine onnnnnnn.... ' : 'Use the button to pick a meal!' }{props.randomizedMeal ? props.randomizedMeal.name : ''}</p>
        <div id={'meal-selection-buttons'}>
          <Button onClick={handleChooseMeal} class={props.randomizedMeal ? 'button--random-meal-again' : 'button--random-meal'} text={props.randomizedMeal ? 'Try Another' : 'Choose My Next Meal!'}></Button>
          {props.randomizedMeal && <Button onClick={confirmMeal} class={'button--meal-confirm'} text={'Confirm'}></Button>}
        </div>
      </>
    }
    <MealHistory className={'meal-history'} mealHistory={props.mealHistory} meals={props.meals} ></MealHistory>
    </div>
  );
};