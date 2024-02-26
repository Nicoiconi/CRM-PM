"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Seller from "../database/models/seller.model"
import { connectToDatabase } from "../database/mongoose"
// import { handleError } from "../utils"

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

    if (!newSeller) return { message: `Seller create failed.`, status: 409, object: null }

    return { message: `Seller ${newSeller?.name} created`, status: 201, object: JSON.parse(JSON.stringify(newSeller)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// export async function createSeller(prevState: FormState, seller: CreateClientParams): Promise<FormState> {

//   try {
//     await connectToDatabase()

//     const newSeller = await Seller.create(seller)

//     return JSON.parse(JSON.stringify(newSeller))
//   } catch (error: any) {
// handleError(error)
// console.log(error.message)
//   }
// }

// READ
export async function getAllSellers() {
  try {
    await connectToDatabase()

    const allSellers = await Seller.find()

    if (!allSellers) return { message: "Sellers not found", status: 404, object: null }

    return { message: `${allSellers?.length} sellers found`, status: 200, object: JSON.parse(JSON.stringify(allSellers)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getSellerById(sellerId: string) {
  try {
    await connectToDatabase()

    const sellerById = await Seller.findById(sellerId)

    if (!sellerById) return { message: "Seller not found.", status: 404, object: null }

    return { message: `Seller ${sellerById?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(sellerById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// UPDATE
export async function updateSeller(sellerId: string, seller: UpdateClientParams) {
  try {
    await connectToDatabase()

    const sellerToUpdate = await Seller.findById(sellerId)

    if (!sellerToUpdate) return { message: "Seller not found.", status: 404, object: null }

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
      { _id: sellerId },
      { ...seller, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedSeller) throw new Error("Seller update failed")

    return { message: `Seller ${updatedSeller?.name} updated.`, status: 200, object: JSON.parse(JSON.stringify(updatedSeller)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// DELETE
export async function deleteSeller(sellerId: string) {
  try {
    await connectToDatabase()

    const sellerToDelete = await Seller.findById(sellerId)

    if (!sellerToDelete) return { message: "Seller not found.", status: 404, object: null }

    const deletedSeller = await Seller.findByIdAndDelete(sellerToDelete._id)

    if (!deletedSeller) return { message: `Seller delete failed.`, status: 409, object: null }

    revalidatePath("/")

    return { message: `Seller ${sellerToDelete?.name} deleted.`, status: 200, object: null }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}
