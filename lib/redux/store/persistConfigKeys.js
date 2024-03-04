import storage from "redux-persist/lib/storage"

export const persistBuyersConfig = {
  key: "rootBuyersKey",
  storage,
  blacklist: ["auth"]
}

export const persistConfigFooter = {
  key: "rootFooterKey",
  storage,
  blacklist: ["auth"]
}

export const persistMatchesConfig = {
  key: "rootMatchesKey",
  storage,
  blacklist: ["auth"]
}

export const persistPostsConfig = {
  key: "rootPostsKey",
  storage,
  blacklist: ["auth"]
}

export const persistSellersConfig = {
  key: "rootSellersKey",
  storage,
  blacklist: ["auth"]
}

export const persistCategoriesConfig = {
  key: "rootCategoriesKey",
  storage,
  blacklist: ["auth"]
}

export const persistUsersConfig = {
  key: "rootUsersKey",
  storage,
  blacklist: ["auth"]
}
