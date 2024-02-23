'use client'

import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'

interface OwnersForInput {
  _id: string
  name: string
}

type SetNewPost = React.Dispatch<React.SetStateAction<CreatePostParams>>

interface Props {
  setNew: SetNewPost
  componentName: string
  elements: OwnersForInput[] | Category[]
}

export default function AutoCompleteInputNewForm({ setNew, componentName, elements }: Props) {

  const [elementsToShow, setelEmentsToShow] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  useEffect(() => {
    const elementsNames = [...(elements || [])]?.map(e => e.name)
      .sort((a, b) => { return a?.toLowerCase().localeCompare(b?.toLowerCase()) })
    setelEmentsToShow(elementsNames)
    setSelectedValue(null)
  }, [elements])

  function handleNewData(value: string | null) {
    setSelectedValue(value)
    const selectedElement = elements?.find((element) => element.name === value)
    // console.log(selectedElement)
    if (selectedElement) {
      setNew(prevState => ({
        ...prevState,
        [componentName]: selectedElement?._id
      }))
    }
  }

  return (
    <Autocomplete
      disablePortal
      id={`${componentName}-input-new-form`}
      options={elementsToShow || ""}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      renderInput={(params) => <TextField
        {...params}
        label={componentName}
      />}
      value={selectedValue}
      onChange={(e, newValue) => {
        handleNewData(newValue)
      }}
    />
  )
}
