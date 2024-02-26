"use server"

import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Buyer from "../database/models/buyer.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import User from "../database/models/user.model"

// CREATE
export async function createBuyer(buyer: CreateClientParams) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

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

    const newBuyer = await Buyer.create({
      ...buyer,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    if (!newBuyer) return { message: `Buyer create failed.`, status: 409, object: null }

    return { message: `Buyer ${newBuyer?.name} created`, status: 201, object: JSON.parse(JSON.stringify(newBuyer)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error)
  }
}

// READ
export async function getAllBuyers() {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

    const allBuyers = await Buyer.find()

    if (!allBuyers) return { message: "Buyers not found", status: 404, object: null }

    return { message: `${allBuyers?.length} buyers found`, status: 200, object: JSON.parse(JSON.stringify(allBuyers)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error)
  }
}

export async function getBuyerById(buyerId: string) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

    const buyerById = await Buyer.findById(buyerId)

    if (!buyerById) return { message: "Buyer not found.", status: 404, object: null }

    return { message: `Buyer ${buyerById?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(buyerById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error)
  }
}

// UPDATE
export async function updateBuyer(buyerId: string, buyer: UpdateClientParams) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

    const buyerToUpdate = await Buyer.findById(buyerId)

    if (!buyerToUpdate) return { message: "Buyer not found.", status: 404, object: null }

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

    const updatedBuyer = await Buyer.findOneAndUpdate(
      { _id: buyerId },
      { ...buyer, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedBuyer) return { message: `Buyer update failed.`, status: 409, object: null }

    return { message: `Buyer ${updatedBuyer?.name} updated.`, status: 200, object: JSON.parse(JSON.stringify(updatedBuyer)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error)
  }
}

// DELETE
export async function deleteBuyer(buyerId: string) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

    const buyerToDelete = await Buyer.findById(buyerId)

    if (!buyerToDelete) return { message: "Buyer not found.", status: 404, object: null }

    const deletedBuyer = await Buyer.findByIdAndDelete(buyerToDelete._id)

    if (!deletedBuyer) return { message: `Buyer delete failed.`, status: 409, object: null }

    revalidatePath("/")

    return { message: `Buyer ${buyerToDelete?.name} deleted.`, status: 200, object: null }
  } catch (error: any) {
    // handleError(error)
    console.log(error)
  }
}
