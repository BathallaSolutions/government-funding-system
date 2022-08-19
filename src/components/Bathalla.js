import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import bathalla from "../assets/bathalla.png";

const card = (
  <React.Fragment>
    <CardContent>
      <img src={bathalla} alt={'bathalla'} width="300" />
    </CardContent>
  </React.Fragment>
);

export default function Bathalla() {
  return (
    <Box style={{position:'absolute', zIndex: 9999, top: 120, right: 250}}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
