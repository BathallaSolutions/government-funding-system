import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState
} from 'react-flow-renderer';
import Web3 from 'web3'
import { useSelector, useDispatch, batch } from 'react-redux'
import BarangayBox from './components/BarangayBox'
import Philippines from './components/Philippines'
import MatRequestForm from './components/MatRequestForm'
import MatRequestList from './components/MatRequestList'
import Bathalla from './components/Bathalla'
import { setAccount, setContract, setBalance, setRequests, setBarangays } from './redux/GlobalReducer'
import { nodes as initialNodes } from './initial-elements';
import {abi,tokenAddress} from "./smartcontracts/smartcontracts";
import BigNumber from "bignumber.js"
import './App.css';

const onInit = (reactFlowInstance) => {
	reactFlowInstance.setViewport({ x: 0, y: 0, zoom: .5 });
};

if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}else{
  console.log('Please install metamask!');
}

const App = () => {
  const dispatch = useDispatch()
  const defaultAccount = useSelector((state) => state.global.data.defaultAccount)
  const balance = useSelector((state) => state.global.data.balance)
  
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const nodeTypes = useMemo(() => ({ 
    barangayBox: BarangayBox,
    philippines: Philippines,
    bathalla: Bathalla
   }), []);

  // const createBarangay =  async (contract, defaultAccount) => {
  //   await contract.methods.createBarangay('captain','ron',1,'0xd04f6D397D07E216F465cB88C9F10482f45F7A4D',1060, 1230,100,80).send({ from: defaultAccount });
  //   await contract.methods.createBarangay('captain','peter',2,'0x3D3c66ea40d8068E245b0247F9d7Ab17472D635C',1000, 1350,100,80).send({ from: defaultAccount });
  //   await contract.methods.createBarangay('captain','rigie',1,'0xEC5D87Fa50B16A141196436Ae64fd3BCa336B9E1',1070, 1170,100,80).send({ from: defaultAccount });
  // }

  const getBalance =  async (contract, defaultAccount) => {
    const bal = await contract.methods.balanceOf(defaultAccount).call({ from: defaultAccount });
    const decimals = await contract.methods.decimals().call();
    const bn = new BigNumber(bal + "e-" + decimals);
    let o = parseFloat(bn.toString()).toFixed(2)
    dispatch(setBalance(o))
  }
  
  const getAccount =  async () => {
    let web3
    if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }

    let accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    let contract = await new web3.eth.Contract(abi, tokenAddress);
    
    dispatch(setContract(contract))
    dispatch(setAccount(accounts[0]))

    return {contract, defaultAccount:accounts[0]}
  }

  const getRequests =  async (contract, defaultAccount, brgy) => {
    let combine = await contract.methods.getRequests().call();
    let hold = []
    combine.map((o, key) => {
      let profile = brgy.find((data) => {
        if(data.data.tokenAddress===o['author']){
          return data.data
        }
        return false
      })

      hold.push({
        reqId: o['reqId'],
        amount: o['amount'],
        description: o['description'],
        data: profile?.data
      })
      return o
    })
    dispatch(setRequests(hold))
  }
  
  const getBarangays =  async (contract, defaultAccount) => {
    let combine = await contract.methods.getBarangay().call();

    let hold = []
    combine.map((o, key) => {
      hold.push({
        id: String(key),
        type: 'barangayBox',
        data: {
          author: o['author'],
          brgyId: o['brgyId'],
          status: o['status'],
          name: o['name'],
          number: o['number'],
          tokenAddress: o['tokenaddress'],
          positionx: o['positionx'],
          positiony: o['positiony'],
          width: o['width'],
          height: o['height'],
        },
        draggable: false,
        selectable: false,
        position: { x: o['positionx'], y: o['positiony'] },
        style: { width: o['width'], height: o['height'], zIndex: -1 },
      })
      return o
    })
    
    combine = initialNodes.concat(hold)
    batch(() => {
      setNodes(combine)
      dispatch(setBarangays(hold))
    })

    return hold
  }

  const sequence = async () => {
    const x = await getAccount()
    await getBalance(x.contract, x.defaultAccount)
    const brgy = await getBarangays(x.contract, x.defaultAccount)
    await getRequests(x.contract, x.defaultAccount, brgy)
    // await createBarangay(x.contract, x.defaultAccount)
  }

  useEffect(() => {
    sequence()


  // eslint-disable-next-line
  }, [])

  let mayor = false
  if(defaultAccount === '0xDb796cAb1E1085510423fD6353e5a8C45E2b840a'){
    console.log("you are mayor")
    mayor = true
  }else{
    console.log("you are barangay tanud ina")
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
      <div style={{position:'absolute', zIndex: 9999, top: 80, left: 500}}>
      {mayor ? 'Mayors View' : 'Barangays View'}
      </div>
      <div style={{position:'absolute', zIndex: 9999, bottom: 30, left: 60}}>
       Balance: <span style={{color: 'darkgreen'}}>{balance}</span> PINE
      </div>
      {mayor&&<MatRequestList/>}
      {!mayor&&<MatRequestForm/>}
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
