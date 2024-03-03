import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateBuyer } from "@/lib/actions/buyer.actions"
import { setAllBuyers, setBuyerById } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

interface Props {
  setEnableEdit: (value: boolean) => void
}

export default function EditBuyerForm({ setEnableEdit }: Props) {

  const dispatch = useDispatch()

  const { allBuyers, singleBuyer }: { allBuyers: Client[], singleBuyer: Client } = useSelector((state: Store) => state.buyers)

  const [newBuyerData, setNewBuyerData] = useState<UpdateClientParams>({})

  function handleEditDataBuyer(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setNewBuyerData(prevState => {
      // If the value is different from the existing data, update it
      if (value !== singleBuyer[name as keyof UpdateClientParams]) {
        return {
          ...prevState,
          [name]: value
        }
      } else {
        // If the value is the same as the existing data, remove it from newSellerData
        const { [name as keyof UpdateClientParams]: deletedProp, ...newDataWithoutProp } = prevState
        return newDataWithoutProp
      }
    })
  }

  function handleEditBooleansBuyer(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target
    const originalValue = singleBuyer[name as keyof UpdateClientParams]

    setNewBuyerData(prevState => {
      // Toggle the value when the checkbox is checked
      const newValue = checked ? !originalValue : originalValue

      // If the value is different from the existing data, update it
      if (newValue !== originalValue) {
        return {
          ...prevState,
          [name]: newValue
        }
      } else {
        // If the value is the same as the existing data, remove it from newSellerData
        const { [name as keyof UpdateClientParams]: deletedProp, ...newDataWithoutProp } = prevState
        return newDataWithoutProp
      }
    })
  }

  async function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let existingName
    let existingEmail
    if (newBuyerData?.name) {
      existingName = allBuyers?.find(b => b?.name.toLowerCase().trim() === newBuyerData?.name?.toLowerCase().trim() && b?._id !== singleBuyer?._id)
      if (existingName) {
        dispatch(setFooterMessage({ message: `Name ${existingName?.name} already exist.`, status: 409 }))
        return
      }
    }
    if (newBuyerData?.email) {
      existingEmail = allBuyers?.find(b => b?.email.toLowerCase().trim() === newBuyerData?.email?.toLowerCase().trim() && b?._id !== singleBuyer?._id)
      if (existingEmail) {
        dispatch(setFooterMessage({ message: `Email ${existingEmail?.email} already exist.`, status: 409 }))
        return
      }
    }
    const updatedBuyer = await updateBuyer(singleBuyer?._id, newBuyerData)
    if (updatedBuyer) {
      const { message, status, object } = updatedBuyer
      if (status === 200) {
        const allBuyersCopy = structuredClone(allBuyers || [])
        const removeOldBuyer = allBuyersCopy?.filter(b => b?._id?.toString() !== singleBuyer?._id?.toString())
        dispatch(setAllBuyers([...removeOldBuyer, object]))
        dispatch(setBuyerById(object))
        setEnableEdit(false)
      }
      dispatch(setFooterMessage({ message, status }))
    } else {
      dispatch(setFooterMessage({ message: "Buyer update failed", status: 409 }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Replace any non-numeric characters with an empty string
    const newValue = value.replace(/\D/g, "")
    // Update the input value with only numeric characters
    e.target.value = newValue
  }

  return (
    <form
      onSubmit={handleSubmitEdit}
      className="text-[20px] p-3 w-full md:w-auto md:min-w-[50%]"
    >
      <div className="pb-2 flex-center">
        <button
          className="border py-1 px-2 w-[70%]"
          disabled={
            newBuyerData?.name === singleBuyer?.name &&
            newBuyerData?.description === singleBuyer?.description &&
            !newBuyerData?.disabled &&
            !newBuyerData?.is_active
          }
        >
          EDIT
        </button>
      </div>

      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="disabled-input"
        >
          {singleBuyer?.disabled ? "Enabled?" : "Disabled?"}
        </label>
        <input
          id="disabled-input"
          type="checkbox"
          name="disabled"
          onChange={(e) => handleEditBooleansBuyer(e)}
        />
      </div>

      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="activate-input"
          >
            {singleBuyer?.is_active ? "Deactivate?" : "Activate?"}
          </label>
        </div>
        <div className="pr-2">
          <input
            id="activate-input"
            type="checkbox"
            name="is_active"
            onChange={(e) => handleEditBooleansBuyer(e)}
            disabled={singleBuyer?.posts?.length > 0}
          />
        </div>
        <div>
          {
            singleBuyer?.posts?.length && singleBuyer?.posts?.length > 0
              ? <div>
                Cannot deactivate - {singleBuyer?.posts?.length} posts active
              </div>
              : ""
          }
        </div>
      </div>

      <div className="py-1 flex flex-wrap">
        <div className="w-[90px]">
          <label
            className=""
            htmlFor="name-input"
          >
            Name
          </label>
        </div>

        <div className="w-[70%]">
          <input
            className="rounded px-1 w-full"
            id="name-input"
            name="name"
            type="text"
            onChange={(e) => handleEditDataBuyer(e)}
            value={newBuyerData?.name || singleBuyer?.name || ""}
          />
        </div>
      </div>

      <div className="py-1 flex flex-wrap">
        <div className="w-[90px]">
          <label
            className="pr-3 w-[90px]"
            htmlFor="name-input"
          >
            Email
          </label>
        </div>

        <div className="w-[70%]">
          <input
            className="rounded px-1 w-full"
            id="email-input"
            name="email"
            type="text"
            onChange={(e) => handleEditDataBuyer(e)}
            value={newBuyerData?.email || singleBuyer?.email || ""}
          />
        </div>
      </div>

      <div className="py-1 flex flex-wrap">
        <div className="w-[90px]">
          <label
            className="pr-3 w-[90px]"
            htmlFor="name-input"
          >
            Phone
          </label>
        </div>

        <div className="w-[70%]">
          <input
            className="rounded px-1 w-full"
            id="phone-input"
            name="phone"
            type="text"
            onChange={(e) => handleEditDataBuyer(e)}
            value={newBuyerData?.phone || singleBuyer?.phone || ""}
            onInput={handlePhoneChange}
          />
        </div>
      </div>

      <div className="py-1 flex flex-wrap">
        <div>
          <label
            className="pr-3"
            htmlFor="description-input"
          >
            Description
          </label>
        </div>
        <textarea
          className="w-full px-1 rounded"
          name="description"
          id="description-input"
          cols={20}
          rows={3}
          onChange={(e) => handleEditDataBuyer(e)}
          value={newBuyerData?.description || singleBuyer?.description || ""}
        />
      </div>
    </form>
  )
}
