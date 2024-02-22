import { createSlice } from "@reduxjs/toolkit"

export const matchesSlice = createSlice({
  name: "matchesSlice",
  initialState: {
    allMatches: [],
    singleMatch: {},
    lastMatchCreated: {}
  },
  reducers: {
    setAllMatches: (state, { payload }) => {
      state.allMatches = payload
    },
    setMatchById: (state, { payload }) => {
      state.singleMatch = payload
    },
    setLastMatchCreated: (state, { payload }) => {
      state.lastMatchCreated = payload
    },
    resetMatchesState: (state) => {
      state.allMatches = null
      state.singleMatch = null
      state.lastMatchCreated = null
    }
  }
})

export const {
  setAllMatches,
  setMatchById,
  setLastMatchCreated,
  resetMatchesState
} = matchesSlice.actions
