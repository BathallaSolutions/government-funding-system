import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function createData(description, date) {
  return { description, date};
}

const rows = [
  createData('Rakuten race withdrawn PINE450,000.00 to ₱450,000', 'August 21, 2022 @ 1:59pm'),
  createData('Rigie bought materials worth PINE450,000.00 from Authorized supplier Rakuten', 'August 21, 2022 @ 1:01pm'),
  createData('Ron requested amount PINE900,000.00 for bridge repairs', 'August 18, 2022 @ 3:49pm'),
  createData('Peter requested amount PINE130,000.00 for bridge construction', 'August 18, 2022 @ 10:11am'),
  createData('Rigie requested amount PINE450,0000.00 for Race marathon', 'August 18, 2022 @ 9:31pm'),
];

export default function ListOfTransactions() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button 
        className="animate__animated animate__fadeIn animate__delay-2s"  
        style={{position:'absolute', bottom: 280, left: 50, zIndex: 99999}}
        variant="outlined" onClick={handleClickOpen}
      >
        Track Transactions
      </Button>
      <Dialog
        style={{zIndex: 99999}}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Official transactions"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TableContainer >
              <Table sx={{ minWidth: "100%" }} size="small" aria-label="a dense table" >
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.description}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      style={{width:1000}}
                    >
                      <TableCell style={{width:500}} component="th" scope="row">
                        {row.description}
                      </TableCell>
                      <TableCell style={{width:500}} component="th" scope="row">
                        {row.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}