import React, {useEffect, useState} from 'react';

import Button from './Button';
import ScheduledMeal from './ScheduledMeal';

import './styles/Dash.scss';

export default function Dash(props) {

  const [randomizedMeal, setRandomizedMeal] = useState(null);
  const [scheduledMeal, setScheduledMeal] = useState(props.scheduledMeal);

  useEffect(() => {

  }, []);

  const handleChooseMeal = function() {
    if (props.socketOpen) {
      console.log('i am');
      console.log(props.user);
      props.socket.emit('chooseMeal', {user: props.user} );

      console.log('meal requested');

      props.socket.on('randomMeal', (data) => {
        console.log(data);
        setRandomizedMeal(data.meal);
        props.socket.off('randomMeal');
      });
    }
  };

  const confirmMeal = function() {
    if (props.socketOpen) {
      console.log('confirming', randomizedMeal);
      setScheduledMeal(randomizedMeal);
      props.socket.emit('confirmMeal', {user: props.user, meal: randomizedMeal});
    }
  };

  return (
    <div className={'dash'}>
      {scheduledMeal ? 
      <ScheduledMeal meal={scheduledMeal}/> :
      <>
        <p id={'meal-message'} className={'text'}>{randomizedMeal ? 'Tonight you get to dine onnnnnnn.... ' : 'Use the button to pick a meal!' }{randomizedMeal ? randomizedMeal.name : ''}</p>
        <div id={'meal-selection-buttons'}>
          <Button onClick={handleChooseMeal} class={randomizedMeal ? 'button--random-meal-again' : 'button--random-meal'} text={randomizedMeal ? 'Try Another' : 'Choose My Next Meal!'}></Button>
          {randomizedMeal && <Button onClick={confirmMeal} class={'button--meal-confirm'} text={'Confirm'}></Button>}
        </div>
      </>
    }
    </div>
  );
};