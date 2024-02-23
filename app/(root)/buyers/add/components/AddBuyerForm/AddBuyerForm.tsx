"use client"

import { createBuyer } from "@/lib/actions/buyer.actions"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addBuyerValidations } from "../../validiations/addBuyerValidations"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { setAllBuyers } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { redirect } from "next/navigation"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

export default function AddBuyerForm() {

  const dispatch = useDispatch()

  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateClientParams>({
    resolver: zodResolver(addBuyerValidations)
  })

  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/buyers/dashboard")
    }
  }, [executeRedirect])

  const handleSubmitForm: SubmitHandler<CreateClientParams> = async buyerData => {
    try {
      const existingName = allBuyers?.find(d => d?.name?.toLowerCase().trim() === buyerData?.name?.toLowerCase().trim())
      const existingEmail = allBuyers?.find(d => d?.email?.toLowerCase().trim() === buyerData?.email?.toLowerCase().trim())
      if (existingName) {
        dispatch(setFooterMessage({ message: `Name ${existingName?.name} already in use.`, status: 409 }))
      } else if (existingEmail) {
        dispatch(setFooterMessage({ message: `Email ${existingEmail?.email} already in use.`, status: 409 }))
      } else {
        const createdBuyer = await createBuyer(buyerData)
        if (createdBuyer && createdBuyer?._id) {
          const allBuyersCopy = structuredClone(allBuyers || [])
          dispatch(setAllBuyers([...allBuyersCopy, createdBuyer]))
          dispatch(setFooterMessage({ message: `Buyer ${createdBuyer?.name} created`, status: 200 }))
          setExecuteRedirect(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Replace any non-numeric characters with an empty string
    const newValue = value.replace(/\D/g, "");
    // Update the input value with only numeric characters
    e.target.value = newValue;
    // Call react-hook-form's onChange to update its internal state
    return register("phone").onChange(e);
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
              <label htmlFor="buyer-name">
                Name
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="buyer-name"
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
              <label htmlFor="buyer-email">
                Email
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="buyer-email"
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
              <label htmlFor="buyer-phone">
                Phone
              </label>
            </div>

            <div className="w-[70%]">
              <input
                id="buyer-phone"
                type="text"
                className="w-full p-1 rounded"
                {...register("phone")}
                onChange={handlePhoneChange}
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
              <label htmlFor="buyer-description">
                Description
              </label>
            </div>

            <div className="w-[70%]">
              <textarea
                id="buyer-description"
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
