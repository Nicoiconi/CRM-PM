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

    if (!newCategory) return { message: `Category create failed.`, status: 409, object: null }

    return { message: `Category ${newCategory?.name} created`, status: 201, object: JSON.parse(JSON.stringify(newCategory)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// READ
export async function getAllCategories() {
  try {
    await connectToDatabase()

    const allCategories = await Category.find()

    if (!allCategories) return { message: "Categories not found", status: 404, object: null }

    return { message: `${allCategories?.length} categories found`, status: 200, object: JSON.parse(JSON.stringify(allCategories)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

export async function getCategoryById(categoryId: string) {
  try {
    await connectToDatabase()

    const categoryById = await Category.findById(categoryId)

    if (!categoryById) return { message: "Category not found.", status: 404, object: null }

    return { message: `Category ${categoryById?.name} found.`, status: 200, object: JSON.parse(JSON.stringify(categoryById)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// UPDATE
export async function updateCategory(categoryId: string, category: UpdateCategoryParams) {
  try {
    await connectToDatabase()

    const categoryToUpdate = await Category.findById(categoryId)

    if (!categoryToUpdate) return { message: "Category not found.", status: 404, object: null }

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
      { _id: categoryId },
      { ...category, modified_at: `${formattedDate} ${formattedHour}` },
      { new: true }
    )

    if (!updatedCategory) return { message: `Category update failed.`, status: 409, object: null }

    return { message: `Category ${updatedCategory?.name} updated.`, status: 200, object: JSON.parse(JSON.stringify(updatedCategory)) }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}

// DELETE
export async function deleteCategory(categoryId: string) {
  try {
    await connectToDatabase()

    const categoryToDelete = await Category.findById(categoryId)

    if (!categoryToDelete) return { message: "Category not found.", status: 404, object: null }

    const deletedCategory = await Category.findByIdAndDelete(categoryToDelete._id)

    if (!deletedCategory) return { message: `Category delete failed`, status: 409, object: null }

    revalidatePath("/")

    return { message: `Category ${categoryToDelete?.name} deleted`, status: 200, object: null }
  } catch (error: any) {
    // handleError(error)
    console.log(error.message)
  }
}
