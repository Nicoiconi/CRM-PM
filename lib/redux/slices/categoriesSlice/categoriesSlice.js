import { createSlice } from "@reduxjs/toolkit"

export const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState: {
    allCategories: [],
    singleCategory: {},
    lastCategoryCreated: {}
  },
  reducers: {
    setAllCategories: (state, { payload }) => {
      state.allCategories = payload
    },
    setCategoryById: (state, { payload }) => {
      state.singleCategory = payload
    },
    setLastCategoryCreated: (state, { payload }) => {
      state.lastCategoryCreated = payload
    },
    resetCategoriesState: (state) => {
      state.allCategories = null
      state.singleCategory = null
      state.lastCategoryCreated = null
    }
  }
})

export const {
  setAllCategories,
  setCategoryById,
  setLastCategoryCreated,
  resetCategoriesState
} = categoriesSlice.actions
