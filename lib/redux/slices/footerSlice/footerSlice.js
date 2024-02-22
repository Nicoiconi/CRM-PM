import { createSlice } from "@reduxjs/toolkit"

export const footerSlice = createSlice({
  name: "footerSlice",
  initialState: {
    footerMessage: {}
  },
  reducers: {
    setFooterMessage: (state, { payload }) => {
      state.footerMessage = payload
    },
    resetFooterState: (state) => {
      state.footerMessage = null
    }
  }
})

export const {
  setFooterMessage,
  resetFooterState
} = footerSlice.actions
