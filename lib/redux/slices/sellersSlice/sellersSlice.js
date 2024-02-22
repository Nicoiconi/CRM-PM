import { createSlice } from "@reduxjs/toolkit"

export const sellersSlice = createSlice({
  name: "sellersSlice",
  initialState: {
    allSellers: [],
    singleSeller: {},
    lastSellerCreated: {}
  },
  reducers: {
    setAllSellers: (state, { payload }) => {
      state.allSellers = payload
    },
    setSellerById: (state, { payload }) => {
      state.singleSeller = payload
    },
    setLastSellerCreated: (state, { payload }) => {
      state.lastSellerCreated = payload
    },
    resetSellersState: (state) => {
      state.allSellers = null
      state.singleSeller = null
      state.lastSellerCreated = null
    }
  }
})

export const {
  setAllSellers,
  setSellerById,
  setLastSellerCreated,
  resetSellersState
} = sellersSlice.actions
