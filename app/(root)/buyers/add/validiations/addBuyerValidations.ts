import { z } from "zod"

export const addBuyerValidations = z.object({
  name: z.string().min(3),
  email: z.string().email({
    message: "Invalid email."
  }),
  phone: z.string().optional(),
  description: z.string().optional()
})
