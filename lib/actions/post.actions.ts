"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Post from "../database/models/post.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createPost(post: CreatePostParams) {
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

    const newPost = await Post.create({
      ...post,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    return JSON.parse(JSON.stringify(newPost))
  } catch (error) {
    handleError(error)
  }
}

// READ
export async function getAllPosts() {
  try {
    await connectToDatabase()

    const allPosts = await Post.find()

    if (!allPosts) throw new Error("Posts not found")

    return JSON.parse(JSON.stringify(allPosts))
  } catch (error) {
    handleError(error)
  }
}

export async function getPostById(postId: string) {
  try {
    await connectToDatabase()

    const post = await Post.findOne({ clerkId: postId })

    if (!post) throw new Error("Post not found")

    return JSON.parse(JSON.stringify(post))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updatePost(clerkId: string, post: UpdatePostParams) {
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

    const updatedPost = await Post.findOneAndUpdate(
      { clerkId },
      { ...post, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedPost) throw new Error("Post update failed")
    
    return JSON.parse(JSON.stringify(updatedPost))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deletePost(clerkId: string) {
  try {
    await connectToDatabase()

    const postToDelete = await Post.findOne({ clerkId })

    if (!postToDelete) {
      throw new Error("Post not found.")
    }

    const deletedPost = await Post.findByIdAndDelete(postToDelete._id)
    revalidatePath("/")

    return deletedPost ? JSON.parse(JSON.stringify(deletedPost)) : null
  } catch (error) {
    handleError(error)
  }
}
