"use client"

import { createCategory } from "@/lib/actions/category.actions"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCategoryValidations } from "../../validiations/addCategoryValidations"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { setAllCategories } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import { redirect } from "next/navigation"

export default function AddCategoryForm() {

  const dispatch = useDispatch()

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateClientParams>({
    resolver: zodResolver(addCategoryValidations)
  })

  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/categories/dashboard")
    }
  }, [executeRedirect])

  const handleSubmitForm: SubmitHandler<CreateClientParams> = async categoryData => {
    try {
      const createdCategory = await createCategory(categoryData)
      if (createdCategory && createdCategory?._id) {
        dispatch(setAllCategories([...allCategories, createdCategory]))
        setExecuteRedirect(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex justify-center items-center"
    >
      <div className="w-[400px] gap-5 flex flex-col border rounded p-4 bg-dark-500">
        <div className="w-full">
          <div className="w-full flex">
            <div className="w-[30%]">
              <label htmlFor="category-name">
                Name
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="category-name"
                type="text"
                className="w-full p-1 rounded"
                {...register("name")} // crea las prop name, value y onChange
              />
            </div>
          </div>

          <div className="text-red-400 flex-center">
            {
              errors.name?.message &&
              <p>{errors.name?.message}</p>
            }
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex">
            <div className="flex w-[30%]">
              <label htmlFor="category-description">
                Description
              </label>
            </div>

            <div className="w-[70%]">
              <textarea
                id="category-description"
                cols={30}
                rows={4}
                className="w-full p-1 rounded"
                {...register("description")}
              />
            </div>
          </div>

          <div className="text-red-400 flex-center">
            {
              errors.description?.message &&
              <p>{errors.description?.message}</p>
            }
          </div>
        </div>

        <div className="w-full">
          <Button
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}
