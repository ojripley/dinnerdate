import React from 'react';

export default function Meal(props) {

  return (
    <div
      className={'meal'}
      key={props.meal.id}
    >
      <p>{props.meal.name}</p>
    </div>
  );
}