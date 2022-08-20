import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState
} from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux'
import BarangayBox from './components/BarangayBox'
import Philippines from './components/Philippines'
import MatRequestForm from './components/MatRequestForm'
import MatRequestList from './components/MatRequestList'
import Bathalla from './components/Bathalla'
import { setGlobal } from './redux/GlobalReducer'
import { nodes as initialNodes } from './initial-elements';
import {getRequests, getBalance, getAccount, getBarangays,
  // eslint-disable-next-line
  createBarangay
} from "./smartcontracts/api";
import './App.css';
import officials from "./smartcontracts/officials";
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ListOfTransactions from './components/ListOfTransactions';

const onInit = (reactFlowInstance) => {
	reactFlowInstance.setViewport({ x: 0, y: 0, zoom: .5 });
};

if (typeof window.ethereum !== 'undefined') {
  // console.log('MetaMask is installed!');
}else{
  // console.log('Please install metamask!');
}

const App = () => {
  const dispatch = useDispatch()
  const defaultAccount = useSelector((state) => state.global.data.defaultAccount)
  const balance = useSelector((state) => state.global.data.balance)
  const barangays = useSelector((state) => state.global.data.barangays)
  const requests = useSelector((state) => state.global.data.requests)
  const global = useSelector((state) => state.global.data)
  
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const nodeTypes = useMemo(() => ({ 
    barangayBox: BarangayBox,
    philippines: Philippines,
    bathalla: Bathalla
   }), []);

  const getBarangayRequest = async (requests, barangays) => {
    let mutablebrgy = JSON.parse(JSON.stringify(barangays))
    const newdata = mutablebrgy.map((brgy) => {
      let findReq = requests.find((req) => req.data.tokenAddress === brgy.data.tokenAddress)
      brgy.data.isRequesting = (findReq?.reqId) ? true : false

      return brgy
    })
    return newdata
  }

  const sequence = async () => {
    let mutableGlobal = JSON.parse(JSON.stringify(global))
    mutableGlobal.requestLoading=  true
    mutableGlobal.requestMessage=  "Fetching data in the blockchain"
    dispatch(setGlobal(mutableGlobal))
    
    mutableGlobal = JSON.parse(JSON.stringify(global))

    const x = await getAccount()
    mutableGlobal.contract = x.contract
    mutableGlobal.defaultAccount = x.defaultAccount

    const balanceHold = await getBalance(x.contract, x.defaultAccount)
    mutableGlobal.balance = balanceHold

    const barangaysHold = await getBarangays(x.contract)

    const requestsHold = await getRequests(x.contract, barangaysHold)
    mutableGlobal.requests = requestsHold

    const withRequestIconBrgy = await getBarangayRequest(requestsHold, barangaysHold)
    // await createBarangay(x.contract, x.defaultAccount)

    mutableGlobal.requestLoading=  false
    mutableGlobal.requestMessage=  ""
    mutableGlobal.barangays = withRequestIconBrgy

    const newnodes = initialNodes.concat(withRequestIconBrgy)
    setNodes(newnodes)
    dispatch(setGlobal(mutableGlobal))
  }

  useEffect(() => {
    sequence()
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const self = async () => {
      const withRequestIconBrgy = await getBarangayRequest(requests, barangays)
      const newnodes = nodes.concat(withRequestIconBrgy)
      setNodes(newnodes)
    }
    self()
  // eslint-disable-next-line
  }, [global.trigger])


  let mayor = false
  if(defaultAccount === officials.mayor){
    // console.log("you are mayor")
    mayor = true
  }else{
    // console.log("you are barangay ")
  }

  if (typeof window.ethereum === 'undefined') {
    return (<>Please login via Metamask</>)
  }

  return (
    <div style={{ width:"95%", height:"95vh", margin: 10 }}>
      <ListOfTransactions/>  

      Account: {defaultAccount ? defaultAccount : ''}
      <div style={{position:'absolute', zIndex: 9999, top: 30, right: 75, width:60, height:15, backgroundColor:'white'}}>
        {/* HIDE REACTFLOW */}
      </div>

      {!global.requestLoading && 
        <div style={{position:'absolute', zIndex: 9999, top: 80, left: 500}}>
          <Paper elevation={3} style={{padding:'5px 25px 5px 25px'}}>
            <Typography variant="h5" gutterBottom>
            {mayor ? 'Mayors View' : 'Barangays View'}
            </Typography>
          </Paper>
        </div>
      }
      <div class="animate__animated animate__fadeIn animate__delay-2s" style={{position:'absolute', zIndex: 9999, bottom: 30, left: 60}}>
        Balance: 
        {global.requestLoading ?
            <Skeleton animation="wave" />
            :
            <>
              <span style={{color: 'darkgreen'}}>{balance}</span> PINE
            </>
        }
      </div>

      <div style={{position:'absolute', zIndex: 9999, bottom: 15, right: 80, color: 'green'}}>
        {global.requestMessage  }
      </div>
      {mayor&&<MatRequestList/>}
      {(!mayor&&!global.requestLoading)&&<MatRequestForm/>}

      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        style={{border:'1px solid black'}}
      >
        <Controls />
          <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default App;
