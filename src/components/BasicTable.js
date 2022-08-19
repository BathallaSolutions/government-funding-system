import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux'

export default function BasicTable() {
  const requests = useSelector((state) => state.global.data.requests)
  const contract = useSelector((state) => state.global.data.contract)

  const reject = () => {
  }

  const accept = async (tokenAddress, amount, reqId, description) => {
    // await contract.methods.transfer(tokenAddress, amount).send({ from: defaultAccount })
    console.log("reqId",reqId)
    const x = await contract.methods.updateRequest(reqId, amount, description).call()
    console.log("x",x)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {!!(requests?.length) && requests.map((row, key) => {
            if(!row?.data){
              return <React.Fragment key={key}></React.Fragment>
            }
          
            return (
              <TableRow
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.data.name.charAt(0).toUpperCase() + row.data.name.slice(1)} from Barangay #{row.data.number} is requesting money amounting to <span style={{color:"red"}}>PINE {row.amount}</span><br/>
                  <Button variant="text" color="error" onClick={() => reject()}>Reject</Button>
                  <Button variant="text" color="success" onClick={() => accept(row.data.tokenAddress, row.amount, row.reqId, row.description)}>Accept</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}