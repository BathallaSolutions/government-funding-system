import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setBarangays, setRequests } from '../redux/BreedReducer'

const Sample = () => {
  const dispatch = useDispatch()
  const barangays = useSelector((state) => state.global.barangays)
  const requests = useSelector((state) => state.global.requests)

  return (
    <>
    </>
  )
}
export default Sample;