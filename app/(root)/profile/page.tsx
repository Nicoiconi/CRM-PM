"use client"

import { getUserByClerkId } from "@/lib/actions/user.actions"
import { resetProperyValues } from "@/lib/database/props/resetPropertyValues"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setLoggedInUser } from "@/lib/redux/slices/usuariosSlice/usuariosSlice"
// import { UserProfile } from "@clerk/nextjs"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface PropToReset {
  schema: string
  propertyName: string
  newValue?: any
}

export default function ProfilePage() {

  const dispatch = useDispatch()

  const { loggedInUser }: { loggedInUser: User } = useSelector((state: Store) => state.users)
  console.log(loggedInUser)

  const [propToReset, setPropToReset] = useState<PropToReset>({
    schema: "",
    propertyName: ""
  })

  function handlePropToResetData(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    setPropToReset(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  function handleResetProp() {
    resetProperyValues(propToReset)
  }

  async function handleFetchUserData() {
    const fetchUser = await getUserByClerkId()
    if (fetchUser) {
      const { message, status, object } = fetchUser
      if (status === 200) {
        dispatch(setLoggedInUser(object))
        dispatch(setFooterMessage({ message, status }))
        return
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  return (
    <div>
      <div>
        <button
          onClick={handleFetchUserData}
        >
          Get User data
        </button>
      </div>

      <div>
        <div>
          <button
            onClick={handleResetProp}
            disabled={
              !propToReset?.schema ||
              !propToReset.propertyName
            }
          >
            Reset Prop
          </button>
        </div>

        <div>
          <label
            htmlFor=""
          >
            Schema
          </label>
          <input
            type="text"
            name="schema"
            value={propToReset?.schema || ""}
            placeholder="Schema"
            onChange={(e) => handlePropToResetData(e)}
          />
        </div>

        <div>
          <label
            htmlFor=""
          >
            Prop
          </label>
          <input
            type="text"
            name="propertyName"
            value={propToReset?.propertyName || ""}
            placeholder="Prop"
            onChange={(e) => handlePropToResetData(e)}
          />
        </div>

        <div>
          <label
            htmlFor=""
          >
            New value
          </label>
          {/* <input
          type="text"
          placeholder="New Value"
        /> */}
        </div>
      </div>

      {/* <UserProfile /> */}
    </div>
  )
}
