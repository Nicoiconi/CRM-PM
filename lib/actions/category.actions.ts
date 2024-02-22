"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Category from "../database/models/category.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createCategory(category: CreateCategoryParams) {
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

    const newCategory = await Category.create({
      ...category,
      created_at: `${formattedDate} ${formattedHour}`,
      userClerkId: userId
    })

    return JSON.parse(JSON.stringify(newCategory))
  } catch (error) {
    handleError(error)
  }
}

// READ
export async function getAllCategories() {
  try {
    await connectToDatabase()

    const allCategories = await Category.find()

    if (!allCategories) throw new Error("Categories not found")

    return JSON.parse(JSON.stringify(allCategories))
  } catch (error) {
    handleError(error)
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    await connectToDatabase()

    const category = await Category.findOne({ clerkId: categoryId })

    if (!category) throw new Error("Category not found")

    return JSON.parse(JSON.stringify(category))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateCategory(clerkId: string, category: UpdateCategoryParams) {
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

    const updatedCategory = await Category.findOneAndUpdate(
      { clerkId },
      { ...category, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedCategory) throw new Error("Category update failed")
    
    return JSON.parse(JSON.stringify(updatedCategory))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteCategory(clerkId: string) {
  try {
    await connectToDatabase()

    const categoryToDelete = await Category.findOne({ clerkId })

    if (!categoryToDelete) {
      throw new Error("Category not found.")
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryToDelete._id)
    revalidatePath("/")

    return deletedCategory ? JSON.parse(JSON.stringify(deletedCategory)) : null
  } catch (error) {
    handleError(error)
  }
}
