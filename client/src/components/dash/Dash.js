import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';

export default function Dash(props) {

  const [meals, setMeals] = useState([]);
  const [randomizedMeal, setRandomizedMeal] = useState(null);

  useEffect(() => {

  }, []);

  const handleChooseMeal = function() {
    if (props.socketOpen) {
      props.socket.emit('chooseMeal');

      console.log('meal requested');

      props.socket.on('randomMeal', (data) => {
        console.log(data);
        setRandomizedMeal(data.name);
        props.socket.off('randomMeal');
      });
    }
  }

  return (
    <>
      <Button variant="contained" size="large" color="primary" onClick={handleChooseMeal}>Choose My Next Meal!</Button>
      {randomizedMeal && <p>{randomizedMeal}</p> }
    </>
  );
};