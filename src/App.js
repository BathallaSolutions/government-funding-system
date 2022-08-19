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
  const global = useSelector((state) => state.global.data)
  
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const nodeTypes = useMemo(() => ({ 
    barangayBox: BarangayBox,
    philippines: Philippines,
    bathalla: Bathalla
   }), []);


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
    setNodes(barangaysHold.nodes)
    mutableGlobal.barangays = barangaysHold.brgyOnly

    const requestsHold = await getRequests(x.contract, barangaysHold.brgyOnly)
    mutableGlobal.requests = requestsHold

    mutableGlobal.requestLoading=  false
    mutableGlobal.requestMessage=  ""
    dispatch(setGlobal(mutableGlobal))
  }

  useEffect(() => {
    sequence()
  // eslint-disable-next-line
  }, [])

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

      Account: {defaultAccount ? defaultAccount : ''}
      <div style={{position:'absolute', zIndex: 9999, top: 30, right: 45, width:60, height:15, backgroundColor:'white'}}>
        {/* HIDE REACTFLOW */}
      </div>

      {!global.requestLoading && 
        <div style={{position:'absolute', zIndex: 9999, top: 80, left: 500}}>
          {mayor ? 'Mayors View' : 'Barangays View'}
        </div>
      }
      <div style={{position:'absolute', zIndex: 9999, bottom: 30, left: 60}}>
        Balance: 
        {global.requestLoading ?
            <Skeleton animation="wave" />
            :
            <>
              <span style={{color: 'darkgreen'}}>{balance}</span> PINE
            </>
        }
      </div>

      <div style={{position:'absolute', zIndex: 9999, bottom: 15, right: 50, color: 'green'}}>
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
