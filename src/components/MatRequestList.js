import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import BasicTable from './BasicTable';

const List = () => {
  return (<React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Request List
        </Typography>
        <BasicTable />
      </CardContent>
  </React.Fragment>
  )
};

export default function MatRequestList() {
  return (
    <Box style={{position:'absolute', zIndex: 9999, top: 120, left: 50, width: 300}}>
      <Card variant="outlined"><List/></Card>
    </Box>
  );
}