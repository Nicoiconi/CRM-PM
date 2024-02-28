import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateSeller } from "@/lib/actions/seller.actions"
import { setAllSellers, setSellerById } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

interface Props {
  setEnableEdit: (value: boolean) => void
}

export default function EditSellerForm({ setEnableEdit }: Props) {

  const dispatch = useDispatch()

  const { allSellers, singleSeller }: { allSellers: Client[], singleSeller: Client } = useSelector((state: Store) => state.sellers)

  const [newSellerData, setNewSellerData] = useState<UpdateClientParams>({})

  function handleEditDataSeller(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setNewSellerData(prevState => {
      // If the value is different from the existing data, update it
      if (value !== singleSeller[name as keyof UpdateClientParams]) {
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

  function handleEditBooleansSeller(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target
    const originalValue = singleSeller[name as keyof UpdateClientParams]
    const checked = e.target.checked

    setNewSellerData(prevState => {
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
    try {
      e.preventDefault()
      let existingName = undefined
      let existingEmail = undefined
      if (newSellerData?.name) {
        existingName = allSellers?.find(s => s?.name.toLowerCase().trim() === newSellerData?.name?.toLowerCase().trim() && s?._id !== singleSeller?._id)
        if (existingName) {
          dispatch(setFooterMessage({ message: `Name ${existingName?.name} already exist.`, status: 409 }))
          return
        }
      }
      if (newSellerData?.email) {
        existingEmail = allSellers?.find(s => s?.email.toLowerCase().trim() === newSellerData?.email?.toLowerCase().trim() && s?._id !== singleSeller?._id)
        if (existingEmail) {
          dispatch(setFooterMessage({ message: `Email ${existingEmail?.email} already exist.`, status: 409 }))
          return
        }
      }
      const updatedSeller = await updateSeller(singleSeller?._id, newSellerData)
      if (updatedSeller) {
        const { message, status, object } = updatedSeller
        if (status === 200) {
          const allSellersCopy = structuredClone(allSellers || [])
          const removeOldSeller = allSellersCopy?.filter((s: Client) => s?._id?.toString() !== singleSeller?._id?.toString())
          dispatch(setAllSellers([...removeOldSeller, object]))
          dispatch(setSellerById(object))
          dispatch(setFooterMessage({ message, status }))
          setEnableEdit(false)
        }
      } else {
        dispatch(setFooterMessage({ message: "Seller update failed", status: 409 }))
      }
    } catch (error) {
      console.log(error)
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
      className="text-[20px] p-3 w-auto min-w-[50%]"
    >
      <div className="pb-2">
        <button
          type="submit"
          className="border py-1 px-2"
          disabled={
            (!newSellerData?.name || newSellerData?.name === singleSeller?.name) &&
            (!newSellerData?.description || newSellerData?.description === singleSeller?.description) &&
            (!newSellerData?.disable || newSellerData?.disable === singleSeller?.disable) &&
            (!newSellerData?.is_active || newSellerData?.is_active === singleSeller?.is_active)
          }
        >
          EDIT
        </button>
      </div>
      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="name-input"
        >
          Name
        </label>
        <input
          className="px-1"
          id="name-input"
          name="name"
          type="text"
          onChange={(e) => handleEditDataSeller(e)}
          value={newSellerData?.name || singleSeller?.name || ""}
        />
      </div>
      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="name-input"
        >
          Email
        </label>
        <input
          className="px-1"
          id="email-input"
          name="email"
          type="text"
          onChange={(e) => handleEditDataSeller(e)}
          value={newSellerData?.email || singleSeller?.email || ""}
        />
      </div>
      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="name-input"
        >
          Phone
        </label>
        <input
          className="px-1"
          id="phone-input"
          name="phone"
          type="text"
          onChange={(e) => handleEditDataSeller(e)}
          value={newSellerData?.phone || singleSeller?.phone || ""}
          onInput={handlePhoneChange}
        />
      </div>
      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="disable-input"
        >
          {singleSeller?.disable ? "Enable?" : "Disable?"}
        </label>
        <input
          id="disable-input"
          type="checkbox"
          name="disable"
          onChange={(e) => handleEditBooleansSeller(e)}
        />
      </div>
      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="activate-input"
          >
            {singleSeller?.is_active ? "Deactivate?" : "Activate?"}
          </label>
        </div>
        <div className="pr-2">
          <input
            id="activate-input"
            type="checkbox"
            name="is_active"
            onChange={(e) => handleEditBooleansSeller(e)}
            disabled={singleSeller?.posts?.length > 0}
          />
        </div>
        <div>
          {
            singleSeller?.posts?.length > 0
              ? <div>
                Cannot deactivate - {singleSeller?.posts?.length} posts active
              </div>
              : ""
          }
        </div>
      </div>
      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="description-input"
          >
            Description
          </label>
        </div>
        <textarea
          className="px-1"
          name="description"
          id="description-input"
          cols={20}
          rows={3}
          onChange={(e) => handleEditDataSeller(e)}
          value={newSellerData?.description || singleSeller?.description || ""}
        />
      </div>
    </form>
  )
}
