"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Match from "../database/models/match.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createMatch(match: CreateMatchParams) {
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

    const newMatch = await Match.create({
      ...match,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    return JSON.parse(JSON.stringify(newMatch))
  } catch (error) {
    handleError(error)
  }
}

// READ
export async function getMatchById(matchId: string) {
  try {
    await connectToDatabase()

    const match = await Match.findOne({ clerkId: matchId })

    if (!match) throw new Error("Match not found")

    return JSON.parse(JSON.stringify(match))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateMatch(clerkId: string, match: UpdateMatchParams) {
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

    const updatedMatch = await Match.findOneAndUpdate(
      { clerkId },
      { ...match, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedMatch) throw new Error("Match update failed")
    
    return JSON.parse(JSON.stringify(updatedMatch))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteMatch(clerkId: string) {
  try {
    await connectToDatabase()

    const matchToDelete = await Match.findOne({ clerkId })

    if (!matchToDelete) {
      throw new Error("Match not found.")
    }

    const deletedMatch = await Match.findByIdAndDelete(matchToDelete._id)
    revalidatePath("/")

    return deletedMatch ? JSON.parse(JSON.stringify(deletedMatch)) : null
  } catch (error) {
    handleError(error)
  }
}
