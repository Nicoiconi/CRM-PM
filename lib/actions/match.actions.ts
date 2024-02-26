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

    if (!newMatch) return { message: `Matches create failed.`, status: 409, object: null }

    return { message: `Match ${newMatch?.name} created`, status: 201, object: JSON.parse(JSON.stringify(newMatch)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// READ
export async function getAllMatches() {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    const allMatches = await Match.find()

    if (!allMatches) return { message: "Matches not found", status: 404, object: null }

    return { message: `${allMatches?.length} matches found`, status: 200, object: JSON.parse(JSON.stringify(allMatches)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getMatchById(matchId: string) {
  try {
    await connectToDatabase()

    const matchById = await Match.findById(matchId)

    if (!matchById) return { message: "Match not found.", status: 404, object: null }

    return { message: `Match ${matchById?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(matchById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// UPDATE
export async function updateMatch(matchId: string, match: UpdateMatchParams) {
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
      { _id: matchId },
      { ...match, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedMatch) return { message: `Match update failed.`, status: 409, object: null }

    return { message: `Match ${updatedMatch?.name} updated.`, status: 200, object: JSON.parse(JSON.stringify(updatedMatch)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// DELETE
export async function deleteMatch(matchId: string) {
  try {
    await connectToDatabase()

    const matchToDelete = await Match.findById({ matchId })

    if (!matchToDelete) return { message: "Match not found.", status: 404, object: null }

    const deletedMatch = await Match.findByIdAndDelete(matchToDelete._id)

    if (!deletedMatch) return { message: `Match delete failed.`, status: 409, object: null }

    revalidatePath("/")

    return { message: `Match ${matchToDelete?.name} deleted.`, status: 200, object: null }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}
