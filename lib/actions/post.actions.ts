"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Post from "../database/models/post.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import Buyer from "../database/models/buyer.model"
import Seller from "../database/models/seller.model"

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

    if (!newPost) return { message: `Post create failed.`, status: 409, object: null }

    let postOwnerName = ""

    if (newPost?.buyer) {
      const buyerPostOwner = await Buyer.findById(newPost?.buyer)
      if (buyerPostOwner) {
        postOwnerName = buyerPostOwner?.name
      }
    }

    if (newPost?.seller) {
      const sellerPostOwner = await Seller.findById(newPost?.seller)
      if (sellerPostOwner) {
        postOwnerName = sellerPostOwner?.name
      }
    }

    return { message: `${newPost?.seller ? "Seller" : "Buyer"} post for ${postOwnerName} created`, status: 201, object: JSON.parse(JSON.stringify(newPost)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// READ
export async function getAllPosts() {
  try {
    await connectToDatabase()

    const allPosts = await Post.find()

    if (!allPosts) return { message: "Posts not found", status: 404, object: null }

    return { message: `${allPosts?.length} posts found`, status: 200, object: JSON.parse(JSON.stringify(allPosts)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getPostById(postId: string) {
  try {
    await connectToDatabase()

    const postById = await Post.findById(postId)

    if (!postById) return { message: "Posts not found", status: 404, object: null }

    return { message: `${postById?.length} posts found`, status: 200, object: JSON.parse(JSON.stringify(postById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// UPDATE
export async function updatePost(postId: string, post: UpdatePostParams) {
  try {
    await connectToDatabase()

    const postToUpdate = await Post.findById(postId)

    if (!postToUpdate) return { message: "Post not found.", status: 404, object: null }

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
      { _id: postId },
      { ...post, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedPost) return { message: `Post update failed.`, status: 409, object: null }

    let postOwnerName = ""

    if (updatedPost?.buyer) {
      const buyerPostOwner = await Buyer.findById(updatedPost?.buyer)
      if (buyerPostOwner) {
        postOwnerName = buyerPostOwner?.name
      }
    }

    if (updatedPost?.seller) {
      const sellerPostOwner = await Seller.findById(updatedPost?.seller)
      if (sellerPostOwner) {
        postOwnerName = sellerPostOwner?.name
      }
    }

    return { message: `${updatedPost?.seller ? "Seller" : "Buyer"} post of ${postOwnerName} updated.`, status: 200, object: JSON.parse(JSON.stringify(updatedPost)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// DELETE
export async function deletePost(postId: string) {
  try {
    await connectToDatabase()

    const postToDelete = await Post.findById(postId)

    if (!postToDelete) return { message: "Post not found.", status: 404, object: null }

    const deletedPost = await Post.findByIdAndDelete(postToDelete._id)

    if (!deletedPost) return { message: `Post delete failed.`, status: 409, object: null }

    revalidatePath("/")

    return { message: `Post ${postToDelete?.name} deleted.`, status: 200, object: null }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}
