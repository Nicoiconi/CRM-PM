"use client"

import { createSeller } from "@/lib/actions/seller.actions"
import { useEffect, useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addSellerValidations } from "../../../validiations/addSellerValidations"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { setAllSellers, setSellerById } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { redirect } from "next/navigation"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

export default function AddSellerForm() {

  const dispatch = useDispatch()

  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const { register, handleSubmit, formState: { errors } } = useForm<CreateClientParams>({
    resolver: zodResolver(addSellerValidations)
  })

  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/sellers/dashboard")
    }
  }, [executeRedirect])

  const handleSubmitForm: SubmitHandler<CreateClientParams> = async (sellerData, e) => {
    try {
      e?.preventDefault()
      const existingName = allSellers?.find(s => s?.name?.toLowerCase().trim() === sellerData?.name?.toLowerCase().trim())
      const existingEmail = allSellers?.find(s => s?.email?.toLowerCase().trim() === sellerData?.email?.toLowerCase().trim())
      if (existingName) {
        dispatch(setFooterMessage({ message: `Name ${existingName?.name} already exist.`, status: 409 }))
        return
      } else if (existingEmail) {
        dispatch(setFooterMessage({ message: `Email ${existingEmail?.email} already exist.`, status: 409 }))
        return
      } else {
        const createdSeller = await createSeller(sellerData)
        if (createdSeller) {
          const { message, status, object }: { message: string, status: number, object: Client | null } = createdSeller
          if (status === 201) {
            const allSellersCopy = structuredClone(allSellers || [])
            dispatch(setAllSellers([...allSellersCopy, object]))
            dispatch(setSellerById(object))
            setExecuteRedirect(true)
          }
          dispatch(setFooterMessage({ message, status }))
        }
      }
    } catch (error: any) {
      // console.log(error.message)
      dispatch(setFooterMessage({ message: error.message, status: 500 }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Replace any non-numeric characters with an empty string
    const newValue = value.replace(/\D/g, "");
    // Update the input value with only numeric characters
    e.target.value = newValue;
    // Call react-hook-form's onChange to update its internal state
    // return register("phone").onChange(newValue);
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
              <label htmlFor="seller-name">
                Name
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="seller-name"
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
            <div className="w-[30%]">
              <label htmlFor="seller-email">
                Email
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="seller-email"
                type="email"
                className="w-full p-1 rounded"
                {...register("email")}
              />
            </div>
          </div>

          <div className="text-red-400 flex-center">
            {
              errors.email?.message &&
              <p>{errors.email?.message}</p>
            }
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex">
            <div className="w-[30%]">
              <label htmlFor="seller-phone">
                Phone
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="seller-phone"
                type="text"
                className="w-full p-1 rounded"
                {...register("phone")}
                onInput={handlePhoneChange}
              />
            </div>
          </div>

          <div className="text-red-400 flex-center">
            {
              errors.phone?.message &&
              <p>{errors.phone?.message}</p>
            }
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex">
            <div className="flex w-[30%]">
              <label htmlFor="seller-description">
                Description
              </label>
            </div>

            <div className="w-[70%]">
              <textarea
                id="seller-description"
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
