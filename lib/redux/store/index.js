import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist"

import { buyersSlice } from "../slices/buyersSlice/buyersSlice"
import { footerSlice } from "../slices/footerSlice/footerSlice"
import { matchesSlice } from "../slices/matchesSlice/matchesSlice"
import { postsSlice } from "../slices/postsSlice/postsSlice"
import { sellersSlice } from "../slices/sellersSlice/sellersSlice"
import { categoriesSlice } from "../slices/categoriesSlice/categoriesSlice"

import { persistBuyersConfig, persistConfigFooter, persistMatchesConfig, persistPostsConfig, persistSellersConfig, persistCategoriesConfig } from "./persistConfigKeys"

const persistedBuyers = persistReducer(persistBuyersConfig, buyersSlice.reducer)
const persistedFooter = persistReducer(persistConfigFooter, footerSlice.reducer)
const persistedMatches = persistReducer(persistMatchesConfig, matchesSlice.reducer)
const persistedPosts = persistReducer(persistPostsConfig, postsSlice.reducer)
const persistedSellers = persistReducer(persistSellersConfig, sellersSlice.reducer)
const persistedCategories = persistReducer(persistCategoriesConfig, categoriesSlice.reducer)

export const store = configureStore({
  reducer: {
    buyers: persistedBuyers,
    footer: persistedFooter,
    matches: persistedMatches,
    posts: persistedPosts,
    sellers: persistedSellers,
    categories: persistedCategories
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
