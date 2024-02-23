import { createSlice } from "@reduxjs/toolkit"

export const footerSlice = createSlice({
  name: "footerSlice",
  initialState: {
    footerMessage: {},
    hideFooter: false,
    footerPosition: "left"
  },
  reducers: {
    setFooterMessage: (state, { payload }) => {
      state.footerMessage = payload
    },
    setHideFooter: (state, { payload }) => {
      state.hideFooter = payload
    },
    setFooterPosition: (state, { payload }) => {
      state.footerPosition = payload
    },
    resetFooterState: (state) => {
      state.footerMessage = null
    }
  }
})

export const {
  setFooterMessage,
  setHideFooter,
  setFooterPosition,
  resetFooterState
} = footerSlice.actions
