"use client"

import { getUserBy } from "@/lib/actions/user.actions"
import { resetProperyValues } from "@/lib/database/props/resetProperyValues"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useState } from "react"

interface PropToReset {
  schema: string
  propertyName: string
  newValue?: any
}

export default function ProfilePage() {

  const [propToReset, setPropToReset] = useState<PropToReset>({
    schema: "",
    propertyName: ""
  })

  // const user = await getUserBy({clerkId: userId})
  // const images = await getUserImages({ page, userId: user._id })

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

  return (
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
  )
}
