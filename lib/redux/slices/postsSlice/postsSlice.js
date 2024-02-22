import { createSlice } from "@reduxjs/toolkit"

export const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    allPosts: [],
    singlePost: {},
    lastPostCreated: {},
    buyerPostToCompare: {},
    sellerPostToCompare: {}
  },
  reducers: {
    setAllPosts: (state, { payload }) => {
      state.allPosts = payload
    },
    setPostById: (state, { payload }) => {
      state.singlePost = payload
    },
    setLastPostCreated: (state, { payload }) => {
      state.lastPostCreated = payload
    },
    setBuyerPostToCompare: (state, { payload }) => {
      state.buyerPostToCompare = payload
    },
    setSellerPostToCompare: (state, { payload }) => {
      state.sellerPostToCompare = payload
    },
    resetPostsState: (state) => {
      state.allPosts = null
      state.singlePost = null
      state.lastPostCreated = null
      state.buyerPostToCompare = null
      state.sellerPostToCompare = null
    }
  }
})

export const {
  setAllPosts,
  setPostById,
  setLastPostCreated,
  setBuyerPostToCompare,
  setSellerPostToCompare,
  resetPostsState
} = postsSlice.actions
