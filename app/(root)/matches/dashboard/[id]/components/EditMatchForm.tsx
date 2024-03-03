import { updateMatch } from "@/lib/actions/match.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllMatches, setMatchById } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface Props {
  setEnableEdit: (value: boolean) => void
}

export default function EditMatchForm({ setEnableEdit }: Props) {

  const dispatch = useDispatch()

  const { allMatches, singleMatch }: { allMatches: Match[], singleMatch: Match } = useSelector((state: Store) => state.matches)

  const [newMatchData, setNewMatchData] = useState<UpdateMatchParams>()

  function handleEditBooleansMatch(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target
    const originalValue = singleMatch[name as keyof UpdateMatchParams]
    const checked = e.target.checked

    setNewMatchData(prevState => {
      const newValue = checked ? !originalValue : originalValue
      if (newValue !== originalValue) {
        return {
          ...prevState,
          [name]: newValue
        }
      } else {
        const newMatchDataCopy = structuredClone(newMatchData || {})
        delete newMatchDataCopy[name as keyof UpdateMatchParams]
        setNewMatchData(newMatchDataCopy)
      }
    })

  }

  function handleEditMatchData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setNewMatchData(prevState => {
      if (value !== singleMatch[name as keyof UpdateMatchParams]) {
        return {
          ...prevState,
          [name]: value
        }
      } else {
        const newMatchDataCopy = structuredClone(newMatchData || {})
        delete newMatchDataCopy[name as keyof UpdateMatchParams]
        setNewMatchData(newMatchDataCopy)
      }
    })
  }

  async function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (newMatchData) {
      const updatedMatch = await updateMatch(singleMatch?._id, newMatchData)
      if (updatedMatch) {
        const { message, status, object } = updatedMatch
        if (status === 200) {
          const allMatchessCopy = structuredClone(allMatches || [])
          const removeOldMatch = allMatchessCopy?.filter(m => m?._id?.toString() !== singleMatch?._id?.toString())
          dispatch(setAllMatches([...removeOldMatch, object]))
          dispatch(setMatchById(object))
          setEnableEdit(false)
        }
        dispatch(setFooterMessage({ message, status }))
      } else {
        dispatch(setFooterMessage({ message: "Match update failed", status: 409 }))
      }
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmitEdit(e)}
      className="text-[20px] p-3 w-full md:w-auto md:min-w-[50%]"
    >
      <div className="pb-2 flex-center">
        <button
          className="border py-1 px-2 w-[70%]"
          disabled={
            (!newMatchData?.description || newMatchData?.description === singleMatch?.description) &&
            (!newMatchData?.disabled || newMatchData?.disabled === singleMatch?.disabled) &&
            (!newMatchData?.is_active || newMatchData?.is_active === singleMatch?.is_active)
            // (newBuyerData?.description?.trim() === "" && !buyer?.description)
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
          {singleMatch?.disabled ? "Enable?" : "Disabled?"}
        </label>
        <input
          id="disabled-input"
          type="checkbox"
          name="disabled"
          onChange={(e) => handleEditBooleansMatch(e)}
        />
      </div>

      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="activate-input"
          >
            {singleMatch?.is_active ? "Deactivate?" : "Activate?"}
          </label>
        </div>
        <div className="pr-2">
          <input
            id="activate-input"
            type="checkbox"
            name="is_active"
            onChange={(e) => handleEditBooleansMatch(e)}
          />
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
          onChange={(e) => handleEditMatchData(e)}
          value={newMatchData?.description || singleMatch?.description || ""}
        />
      </div>
    </form>
  )
}
