import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';

export default function Dash(props) {

  const [meals, setMeals] = useState([]);
  const [randomizedMeal, setRandomizedMeal] = useState(null);

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
  }

  return (
    <>
      <Button variant="contained" size="large" color="primary" onClick={handleChooseMeal}>{randomizedMeal ? 'Pick A Different Dish' : 'Choose My Next Meal!'}</Button>
      {randomizedMeal && <p>Tonight you get to dine onnnnnnn.... {randomizedMeal.name}!</p> }
    </>
  );
};