/* eslint-disable no-unused-vars */

declare type NavButtonParams = {
  path: string
  label: string
}

// User Params
declare type CreateUserParams = {
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
}

declare type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

declare type User = {
  clerkId: string
  email: string
  username: string
  photo: string
  firstName: string
  lastName: string
  disable: string
  is_active: string
  created_at: boolean
  modified_at: boolean
}

// Category Params
declare type CreateCategoryParams = {
  userClerkId: string
  name: string
  description?: string
}

declare type UpdateCategoryParams = {
  name?: string
  description?: string
}

declare type Category = {
  _id: string
  userClerkId: sting
  name: sting
  description: sting
  disable: boolean
  is_active: boolean
  created_at: sting
  modified_at: sting
}

// Post Params
declare type CreatePostParams = {
  userClerkId: string
  seller?: string
  buyer?: string
  category: string
  price: number
  description?: string
}

declare type UpdatePostParams = {
  seller?: string
  buyer?: string
  category?: string
  price?: number
  description?: string
}

declare type Post = {
  _id: string
  userClerkId: string
  seller?: string
  buyer?: string
  category: string
  price: string
  description?: string
  disable: boolean
  is_active: boolean
  created_at: string
  modified_at: string
}

// Seller/Buyer Params
declare type CreateClientParams = {
  userClerkId: string
  name: string
  posts: Array
  matches: Array
  description?: string
  email: string
  phone?: string
}

declare type UpdateClientParams = {
  name?: string
  posts?: string
  description?: string
  email?: string
  phone?: string
}

declare type Client = {
  categories: any
  _id: string
  userClerkId: string
  name: string
  posts: string[]
  matches: string[]
  description?: string
  email: string
  phone?: string
  disable: boolean
  is_active: boolean
  created_at: string
  modified_at: string
}

// Match Params
declare type CreateMatchParams = {
  userClerkId: string
  status: string
  buyerPost: string
  sellerPost: string
  category: string
  description: string
}

declare type UpdateMatchParams = {
  status?: string
  buyerPost?: string
  sellerPost?: string
  category?: string
  description?: string
}

declare type Match = {
  _id: string
  userClerkId: string
  status: string
  buyerPost: string
  buyerPost: string
  category: string
  disable: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Form State
// declare type FormState = {
// message: string
// errors: Record<keyof FieldsetHTMLAttributes, string> | undefined
// formFields: CreateClientParams
// }

// Slices

declare type Sellers = {
  allBuyers: Client[]
  singleBuyer: Client
  lastBuyerCreated: Client
}

declare type Buyers = {
  allSellers: Client[]
  singleSeller: Client
  lastSellerCreated: Client
}

declare type Matches = {
  allMatches: Match[]
  singleMatch: Match
  lastMatchCreated: Match
}

declare type Posts = {
  allPosts: Post[]
  singlePost: Post
  lastPostCreated: Post
  buyerPostToCompare: Post
  sellerPostToCompare: Post
}

declare type Users = {
  allUsers: User[]
  singleUser: User
  ultimoUsuarioCreado: User
}


// Store
declare type Store = {
  sellers,
  buyers,
  categories,
  matches,
  posts,
  users,
}
