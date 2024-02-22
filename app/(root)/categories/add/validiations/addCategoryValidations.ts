import { z } from "zod"

export const addCategoryValidations = z.object({
  name: z.string().min(3),
  description: z.string().optional()
})
