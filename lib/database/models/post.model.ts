import { Schema, model, models } from "mongoose"

const PostSchema = new Schema({
  userClerkId: {
    type: String,
    required: true,
    unique: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "SellersSchema"
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "BuyersSchema"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "CategoriesSchema"
  },
  price: {
    type: Number
  },
  description: String,
  disable: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: String,
    immutable: true,
  },
  modified_at: String
})

const Post = models?.Post || model("Post", PostSchema)

export default Post