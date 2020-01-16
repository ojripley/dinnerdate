import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';

export default function Dash(props) {

  const [meals, setMeals] = useState([]);
  const [randomizedMeal, setRandomizedMeal] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <>
      <Button variant="contained" size="large" color="primary">Choose My Next Meal!</Button>
      {}
    </>
  );
};