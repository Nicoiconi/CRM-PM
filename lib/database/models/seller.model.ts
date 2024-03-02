import { Schema, model, models } from "mongoose"

const SellerSchema = new Schema({
  userClerkId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "PostsSchema"
    }
  ],
  description: String,
  email: String,
  phone: String,
  disabled: {
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

const Seller = models?.Seller || model("Seller", SellerSchema)

export default Seller