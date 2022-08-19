import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { setRequest } from '../redux/GlobalReducer'
const Pusher = require("pusher");


const Content = () => {
  const dispatch = useDispatch()
  const defaultAccount = useSelector((state) => state.global.data.defaultAccount)
  const contract = useSelector((state) => state.global.data.contract)
  const amount = useSelector((state) => state.global.data.request.amount)
  const description = useSelector((state) => state.global.data.request.description)
  const request = useSelector((state) => state.global.data.request)
  
  const handleOnchange = (e) => {
    let name = e.target.name
    let value = e.target.value

    dispatch(setRequest({
      ...request,
      [name]:value
    }))
  }

  const createRequest =  async () => {
    await contract.methods.createRequest(amount, description).send({ from: defaultAccount });

    const pusher = new Pusher({
      appId: "1465289",
      key: "2bce154a64e869202f16",
      secret: "9b9c22a4aaba14a2ab42",
      cluster: "ap1",
      useTLS: false,
    });
    pusher.trigger("request", "createRequest", {
      message: "hello world",
    });
  }

  const submit = () => {
    createRequest()
  }

  return (
    <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Create Request
      </Typography>

      <div style={{ border: "1px solid" }}>
        <div
          style={{ padding: 10 }}
          >
          <div
            style={{ display: 'flex', width: '100%' }}
          >
            Amount 
            <input
              style={{ marginLeft: 10, width: '100%' }}
              type="text" 
              name="amount" 
              value={amount}
              onChange={handleOnchange}
            />
          </div>
          <div
            style={{ display: 'flex', marginTop: 10 }}
          >
            Description 
            <input 
              style={{ marginLeft: 10, width: '100%' }}
              type="text" 
              name="description" 
              value={description}
              onChange={handleOnchange}
            />
          </div>
        </div>
      </div>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => submit()}>Send</Button>
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
