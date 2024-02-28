import { z } from "zod"

export const updateSellerValidations = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email({
    message: "Invalid email."
  }).optional(),
  phone: z.string().optional(),
  description: z.string().optional()
})
