import React from 'react';

// import './Loading.scss';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

export default function Loading() {
  return (
    <div id='loading'>
      <Typography variant='h2'>Loading...</Typography>
      <LinearProgress />
    </div>
  );
}