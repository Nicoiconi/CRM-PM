import { Schema, model, models } from "mongoose"

const BuyerSchema = new Schema({
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

const Buyer = models?.Buyer || model("Buyer", BuyerSchema)

export default Buyer