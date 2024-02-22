"use server"

import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Buyer from "../database/models/buyer.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createBuyer(buyer: CreateClientParams) {
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

    const newBuyer = await Buyer.create({
      ...buyer,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    return JSON.parse(JSON.stringify(newBuyer))
  } catch (error) {
    handleError(error)
  }
}

// READ
export async function getAllBuyers() {
  try {
    await connectToDatabase()

    const allBuyers = await Buyer.find()

    if (!allBuyers) throw new Error("Buyers not found")

    return JSON.parse(JSON.stringify(allBuyers))
  } catch (error) {
    handleError(error)
  }
}

export async function getBuyerById(buyerId: string) {
  try {
    await connectToDatabase()

    const buyer = await Buyer.findOne({ clerkId: buyerId })

    if (!buyer) throw new Error("Buyer not found")

    return JSON.parse(JSON.stringify(buyer))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateBuyer(clerkId: string, buyer: UpdateClientParams) {
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

    const updatedBuyer = await Buyer.findOneAndUpdate(
      { clerkId },
      { ...buyer, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedBuyer) throw new Error("Buyer update failed")

    return JSON.parse(JSON.stringify(updatedBuyer))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteBuyer(clerkId: string) {
  try {
    await connectToDatabase()

    const buyerToDelete = await Buyer.findOne({ clerkId })

    if (!buyerToDelete) {
      throw new Error("Buyer not found.")
    }

    const deletedBuyer = await Buyer.findByIdAndDelete(buyerToDelete._id)
    revalidatePath("/")

    return deletedBuyer ? JSON.parse(JSON.stringify(deletedBuyer)) : null
  } catch (error) {
    handleError(error)
  }
}
