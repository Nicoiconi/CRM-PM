import { createSlice } from "@reduxjs/toolkit"

export const buyersSlice = createSlice({
  name: "buyersSlice",
  initialState: {
    allBuyers: [],
    singleBuyer: {},
    lastBuyerCreated: {}
  },
  reducers: {
    setAllBuyers: (state, { payload }) => {
      state.allBuyers = payload
    },
    setBuyerById: (state, { payload }) => {
      state.singleBuyer = payload
    },
    setLastBuyerCreated: (state, { payload }) => {
      state.lastBuyerCreated = payload
    },
    resetBuyersState: (state) => {
      state.allBuyers = null
      state.singleBuyer = null
      state.lastBuyerCreated = null
    }
  }
})

export const {
  setAllBuyers,
  setBuyerById,
  setLastBuyerCreated,
  resetBuyersState
} = buyersSlice.actions
