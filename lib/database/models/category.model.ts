import { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
  userClerkId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
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

const Category = models?.Category || model("Category", CategorySchema)

export default Category