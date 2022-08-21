import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector, batch } from 'react-redux'
import Snackbar from '@mui/material/Snackbar';
import { setRequests, setBarangays, setTrigger } from '../redux/GlobalReducer'
import {
  getRequests,
  deleteRequest, 
  transfer
} from "../smartcontracts/api";
import MuiAlert from '@mui/material/Alert';
import Zoom from '../assets/zoom.png';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BasicTable() {
  const dispatch = useDispatch()
  const requests = useSelector((state) => state.global.data.requests)
  const contract = useSelector((state) => state.global.data.contract)
  const barangays = useSelector((state) => state.global.data.barangays)
  const defaultAccount = useSelector((state) => state.global.data.defaultAccount)
  const global = useSelector((state) => state.global.data)
  
  const [deleteMessage, setDeleteMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  
  const reject = async (reqId, key) => {
    let mutablerequests = JSON.parse(JSON.stringify(requests))
    mutablerequests[key].loading =  true
    mutablerequests[key].deleteMessage = ""
    mutablerequests[key].successMessage= ""

    dispatch(setRequests(mutablerequests))
    
    mutablerequests = JSON.parse(JSON.stringify(requests))

    setSuccessMessage("")
    setDeleteMessage("")

    const responseDelete = await deleteRequest(reqId, defaultAccount, contract)
    if(responseDelete){
      mutablerequests[key].successMessage = "Successfully rejected demand"
      setDeleteMessage("Successfully rejected the demand")
      const requestsHold = await getRequests(global.contract, global.barangays)
      mutablerequests = requestsHold
    }else{
      mutablerequests[key].loading =  false
      mutablerequests[key].deleteMessage = "Failed Transferred money"
      setDeleteMessage("Failed Transferred money")
    }
    
    dispatch(setRequests(mutablerequests))
  }

  const accept = async (tokenAddress, amount, reqId, key) => {
    let mutablerequests = JSON.parse(JSON.stringify(requests))
    mutablerequests[key].loading =  true
    mutablerequests[key].deleteMessage = ""
    mutablerequests[key].successMessage= ""

    dispatch(setRequests(mutablerequests))
    mutablerequests = JSON.parse(JSON.stringify(requests))
    let mutablegbarangays = JSON.parse(JSON.stringify(barangays))

    setSuccessMessage("")
    setDeleteMessage("")

    let updatedRequest = mutablerequests
    let deletedRequest = mutablerequests

    // eslint-disable-next-line 
    const transferLog = await transfer(tokenAddress, amount, defaultAccount, contract)
    const responseDelete = await deleteRequest(reqId, defaultAccount, contract)
    if(responseDelete){
      setSuccessMessage("Successfully Transferred money")
      deletedRequest[key].successMessage = "Successfully Transferred money"
      updatedRequest = await getRequests(global.contract, global.barangays)
    }else{
      updatedRequest[key].deleteMessage = "Failed Transferred money"
      setDeleteMessage("Failed Transferred money")
      return false
    }

    mutablegbarangays[deletedRequest[key].barangayIndex].data.isRequesting = false

    batch(() => {
      dispatch(setRequests(updatedRequest))
      dispatch(setBarangays(mutablegbarangays))
      dispatch(setTrigger())
    })
  }

  let dopen = deleteMessage ? true:false
  let sopen = successMessage ? true:false
  return (
    <>
      <Snackbar open={dopen} autoHideDuration={6000} onClose={() => setDeleteMessage('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
      {deleteMessage&&<Alert severity="error">{deleteMessage}</Alert>}
      </Snackbar>
      

      <Snackbar open={sopen} autoHideDuration={6000} onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
      {successMessage&&<Alert severity="success">{successMessage}!</Alert>}
      </Snackbar>
      
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {!global.requestLoading ?
              <>
                {!!(requests?.length) ? 
                  requests.map((row, key) => {
                    if(!row?.data){
                      return <React.Fragment key={key}></React.Fragment>
                    }
                  
                    return (
                      <TableRow
                        key={key}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.data?.name.charAt(0).toUpperCase() + row?.data?.name.slice(1)} from Barangay #{row?.data?.number} is requesting money amounting to <span style={{color:"red"}}>PINE {row.amount.replace('000000000000000000', '')}</span> <br/>
                          Reason: <span style={{color:"darkblue"}}>{row.description}  <img src={Zoom} width="10" style={{cursor:'pointer'}} /></span>
                          {!row.loading ?
                              <div style={{textAlign:'right'}}>
                                <Button disabled={row.loading} variant="text" color="error" onClick={() => reject(row.reqId, key)}>Reject</Button>
                                <Button disabled={row.loading} variant="text" color="success" onClick={() => accept(row?.data?.tokenAddress, row.amount, row.reqId, key)}>Accept</Button>
                              </div>
                            :
                              <div style={{textAlign:'center'}}>
                                <CircularProgress />
                              </div>
                          }

                          {row.deleteMessage && 
                            <div style={{textAlign:'center', color:"red"}}>
                              {row.deleteMessage}
                            </div>
                          } 
                          {row.successMessage && 
                            <div style={{textAlign:'center', color:"green"}}>
                              {row.successMessage}
                            </div>
                          } 
                        </TableCell>
                      </TableRow>
                    )
                  })
                  :
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align='center' style={{color: "gray", fontStyle: "italic"}}>
                      No request for today Mr. Mayor 😜
                    </TableCell>
                  </TableRow>
                }
              </>
            :
              <>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Skeleton animation="wave" />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Skeleton animation="wave" />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Skeleton animation="wave" />
                  </TableCell>
                </TableRow>
              </>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}