import Web3 from 'web3'
import BigNumber from "bignumber.js"
import officials from "./officials";
import {abi,tokenAddress} from "./smartcontracts";
import { nodes as initialNodes } from '../initial-elements';

export const getRequests =  async (contract, brgy) => {
  let combine = await contract.methods.getRequests().call();
  let hold = []
  combine.map((o) => {
    const profile = brgy.find((data) => {
      if(data.data.tokenAddress===o['requestor']){
        return data.data
      }
      return false
    })

    if(o[1] === "0x0000000000000000000000000000000000000000"){
      return o
    }

    hold.push({
      reqId: o['reqId'],
      amount: o['amount'],
      description: o['description'],
      data: profile?.data,
      loading: false,
      deleteMessage: false,
      successMessage: false,
    })
    return o
  })
  return hold
}

export const deleteRequest = async (reqId, defaultAccount, contract) => {
  return await contract.methods.deleteRequest(reqId).send({ from: defaultAccount })
}

export const transfer = async (tokenAddress, amount, defaultAccount, contract) => {
  return await contract.methods.transfer(tokenAddress, amount).send({ from: defaultAccount })
}

export const createRequest =  async (amount, description, defaultAccount, contract) => {
  return await contract.methods.createRequest('pending', officials.mayor, amount, description).send({ from: defaultAccount });
}

export const getBarangays =  async (contract) => {
  let combine = await contract.methods.getBarangay().call();
  let brgyOnly = []

  combine.map((o, key) => {
    brgyOnly.push({
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
  
  combine = initialNodes.concat(brgyOnly)

  return {nodes:combine, brgyOnly}
}

export const createBarangay =  async (contract, defaultAccount) => {
  await contract.methods.createBarangay('captain','ron',1,officials.ron,1570, 1240,100,80).send({ from: defaultAccount });
  await contract.methods.createBarangay('captain','peter',2,officials.peter,1520, 1350,100,80).send({ from: defaultAccount });
  await contract.methods.createBarangay('captain','rigie',3,officials.rigie,1570, 1170,100,80).send({ from: defaultAccount });
}

export const getBalance =  async (contract, defaultAccount) => {
  const bal = await contract.methods.balanceOf(defaultAccount).call({ from: defaultAccount });
  const decimals = await contract.methods.decimals().call();
  const bn = new BigNumber(bal + "e-" + decimals);
  let o = parseFloat(bn.toString()).toFixed(2)
  return o
}

export const getAccount =  async () => {
  let web3
  if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  }

  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  const contract = await new web3.eth.Contract(abi, tokenAddress);

  return {contract, defaultAccount:accounts[0]}
}