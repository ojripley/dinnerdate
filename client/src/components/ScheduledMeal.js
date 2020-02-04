import React from 'react';

export default function ScheduledMeal(props) {

  const s = `scheduled meal: ${props.meal.name}`;

  return(
    <>
      <p>{s}</p>
    </>
  );
};