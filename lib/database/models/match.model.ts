import { Schema, model, models } from "mongoose"

const MatchSchema = new Schema({
  userClerkId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["In review", "Approved", "Rejected", "Paused"]
  },
  buyerPost: {
    type: Schema.Types.ObjectId,
    ref: "PostsSchema"
  },
  sellerPost: {
    type: Schema.Types.ObjectId,
    ref: "PostsSchema"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "CategoriesSchema"
  },
  profit: Number,
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

const Match = models?.Match || model("Match", MatchSchema)

export default Match