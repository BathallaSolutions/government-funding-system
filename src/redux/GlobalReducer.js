import { createSlice } from '@reduxjs/toolkit'

export const GlobalReducer = createSlice({
  name: 'global',
  initialState: {
    data: {
      barangays: [],
      requests: [],
      defaultAccount: "",
      contract: "",
      balance: 0,
      request: {
        amount: "",
        description: ""
      },
    }
  },
  reducers: {
    setBarangays: (state, action) => {
      state.data.barangays = action.payload
    },
    setRequests: (state, action) => {
      state.data.requests = action.payload
    },
    setAccount: (state, action) => {
      state.data.defaultAccount = action.payload
    },
    setContract: (state, action) => {
      state.data.contract = action.payload
    },
    setBalance: (state, action) => {
      state.data.balance = action.payload
    },
    setRequest: (state, action) => {
      state.data.request = action.payload
    },
  },
})

export const { setBarangays, setRequests, setAccount, setContract,setBalance,setRequest } = GlobalReducer.actions


export default GlobalReducer.reducer
