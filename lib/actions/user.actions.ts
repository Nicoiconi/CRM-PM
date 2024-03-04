"use server"

import { revalidatePath } from "next/cache"
import User from "../database/models/user.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"


export async function getUserByClerkId() {
  try {
    const { userId } = auth()

    if (userId) {

      await connectToDatabase()

      const userByClerkId = await User.findOne({ clerkId: userId })

      if (!userByClerkId) return { message: `Get user failed.`, status: 409, object: null }

      return { message: `Hi ${userByClerkId?.name}! Have a nice day!`, status: 200, object: JSON.parse(JSON.stringify(userByClerkId)) }
    }
  } catch (error) {
    console.log(error)
  }
}

// CREATE
export async function createUser(user: CreateUserParams) {
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

    const newUser = await User.create({
      ...user,
      created_at: `${formattedDate} ${formattedHour}`
    })

    if (!newUser) return { message: `User create failed.`, status: 409, object: null }

    return { message: `User ${newUser?.name} created`, status: 201, object: JSON.parse(JSON.stringify(newUser)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// READ
export async function getAllUsers() {
  try {
    await connectToDatabase()

    const allUsers = await User.find()

    if (!allUsers) return { message: "Users not found", status: 404, object: null }

    return { message: `${allUsers?.length} users found`, status: 200, object: JSON.parse(JSON.stringify(allUsers)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const userById = await User.findById(userId)

    if (!userById) return { message: "User not found.", status: 404, object: null }

    return { message: `Buyer ${userById?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(userById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getUserBy(clerkId: { clerkId: string }) {
  try {
    await connectToDatabase()

    const userBy = await User.findOne(clerkId)

    if (!userBy) return { message: "User not found.", status: 404, object: null }

    return { message: `Buyer ${userBy?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(userBy)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// UPDATE
export async function updateUser(userDBId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const { userId } = auth()
    if (!userId) redirect("/sign-in")

    // const user = await User.findOne({ clerkId: userId })

    // if (!user) return { message: "Unauthorized.", status: 401, object: null }

    const userToUpdate = await User.findById(userDBId)

    if (!userToUpdate) return { message: "User not found.", status: 404, object: null }

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

    const updatedUser = await User.findOneAndUpdate(
      { _id: userDBId },
      { ...user, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true, }
    )

    if (!updatedUser) throw new Error("User update failed")

    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error("User not found.")
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath("/")

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// USER CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase()

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    )

    if (!updatedUserCredits) throw new Error("User credits update failed.")

    return JSON.parse(JSON.stringify(updatedUserCredits))
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

