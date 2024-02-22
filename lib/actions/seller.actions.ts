"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Seller from "../database/models/seller.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createSeller(seller: CreateClientParams) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    const nuevaFecha = new Date()

    const dateFormat: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }

    const hourFormat: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }

    const formattedDate = nuevaFecha.toLocaleDateString("en-GB", dateFormat)
    const formattedHour = nuevaFecha.toLocaleTimeString("en-GB", hourFormat)

    const newSeller = await Seller.create({
      ...seller,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    return JSON.parse(JSON.stringify(newSeller))
  } catch (error) {
    handleError(error)
  }
}

// export async function createSeller(prevState: FormState, seller: CreateClientParams): Promise<FormState> {

//   try {
//     await connectToDatabase()

//     const newSeller = await Seller.create(seller)

//     return JSON.parse(JSON.stringify(newSeller))
//   } catch (error) {
//     handleError(error)
//   }
// }

// READ
export async function getAllSellers() {
  try {
    await connectToDatabase()

    const allSellers = await Seller.find()

    if (!allSellers) throw new Error("Sellers not found")


    return JSON.parse(JSON.stringify(allSellers))
  } catch (error) {
    handleError(error)
  }
}

export async function getSellerById(sellerId: string) {
  try {
    await connectToDatabase()

    const seller = await Seller.findOne({ clerkId: sellerId })

    if (!seller) throw new Error("Seller not found")

    return JSON.parse(JSON.stringify(seller))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateSeller(clerkId: string, seller: UpdateClientParams) {
  try {
    await connectToDatabase()

    const nuevaFecha = new Date()

    const dateFormat: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }

    const hourFormat: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }

    const formattedDate = nuevaFecha.toLocaleDateString("en-GB", dateFormat)
    const formattedHour = nuevaFecha.toLocaleTimeString("en-GB", hourFormat)

    const updatedSeller = await Seller.findOneAndUpdate(
      { clerkId },
      { ...seller, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedSeller) throw new Error("Seller update failed")

    return JSON.parse(JSON.stringify(updatedSeller))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteSeller(clerkId: string) {
  try {
    await connectToDatabase()

    const sellerToDelete = await Seller.findOne({ clerkId })

    if (!sellerToDelete) {
      throw new Error("Seller not found.")
    }

    const deletedSeller = await Seller.findByIdAndDelete(sellerToDelete._id)
    revalidatePath("/")

    return deletedSeller ? JSON.parse(JSON.stringify(deletedSeller)) : null
  } catch (error) {
    handleError(error)
  }
}
