import { z } from "zod"

export const addPostValidations = z.object({
  seller: z.string().optional(),
  buyer: z.string().optional(),
  category: z.string(),
  price: z.string(),
  description: z.string().optional(),
})
