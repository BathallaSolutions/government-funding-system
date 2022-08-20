import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from 'react-redux'
import { setRequest } from '../redux/GlobalReducer'
import {
  createRequest
} from "../smartcontracts/api";

const Content = () => {
  const dispatch = useDispatch()
  const defaultAccount = useSelector((state) => state.global.data.defaultAccount)
  const contract = useSelector((state) => state.global.data.contract)
  const amount = useSelector((state) => state.global.data.request.amount)
  const description = useSelector((state) => state.global.data.request.description)
  const request = useSelector((state) => state.global.data.request)
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [messageStatus, setMessageStatus] = React.useState(false)

  const handleOnchange = (e) => {
    let name = e.target.name
    let value = e.target.value

    dispatch(setRequest({
      ...request,
      [name]:value
    }))
  }

  const submit =  async () => {
    let mutablerequest = JSON.parse(JSON.stringify(request))
    setLoading(true)
    try {
      setMessage("")
      setMessageStatus(false)

      const logs = await createRequest(amount, description, defaultAccount, contract)
      if(logs.status){
        mutablerequest.amount = ""
        mutablerequest.description= ""
        setMessage("Successfully sent a request to the mayor")
      }else{
        setMessage("Failed to sent request, something must be wrong.")
      }
    } catch (error) {
      setMessage("Failed to sent request, something must be wrong.")
      setMessageStatus(true)
    }

    dispatch(setRequest(mutablerequest))
    setLoading(false)
  }

  return (
    <React.Fragment>
    <CardContent className="animate__animated animate__fadeIn">
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Create Request
      </Typography>
      <div>
      <TextField
        disabled={loading}
        fullWidth
        label="Amount"
        id="outlined-size-small"
        defaultValue="Small"
        size="small"
        name="amount" 
        value={amount}
        onChange={handleOnchange}
      /> 
      </div>
      <br/>
      <div>
      <TextField
        disabled={loading}
        fullWidth
        label="Description"
        id="outlined-size-small"
        defaultValue="Small"
        size="small"
        name="description" 
        value={description}
        onChange={handleOnchange}
      />
      </div>
    </CardContent>
    <CardActions>
      {loading ?
        <div style={{textAlign:'center', width: '100%'}}>
          <CircularProgress />
        </div>
        :
        <Button size="small" onClick={() => submit()}>Send</Button>
      }
      
      <div style={{textAlign:'center', color: messageStatus ? "red" : "green"}}>
        {message}
      </div>
      
    </CardActions>
  </React.Fragment>
  )
}

export default function MatRequestForm() {
  return (
    <Box sx={{ minWidth: 275 }} style={{position:'absolute', zIndex: 9999, top: 120, left: 50}}>
      <Card variant="outlined">
        <Content/>
      </Card>
    </Box>
  );
}
