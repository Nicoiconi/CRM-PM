'use client'

import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'

interface OwnersForInput {
  _id: string
  name: string
}

type SetNewPost = React.Dispatch<React.SetStateAction<CreatePostParams>>

interface Props {
  setNewPost: React.Dispatch<React.SetStateAction<CreatePostParams | undefined>>
  componentName: string
  elements: OwnersForInput[] | Category[]
  newPost: CreatePostParams | undefined
}

export default function AutoCompleteInputNewForm({ setNewPost, componentName, elements, newPost }: Props) {

  const [elementsToShow, setelEmentsToShow] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  useEffect(() => {
    const elementsCopy = structuredClone(elements || [])
    const elementsNames = elementsCopy?.map(e => e.name)
      .sort((a, b) => { return a?.toLowerCase().localeCompare(b?.toLowerCase()) })
    setelEmentsToShow(elementsNames)
    if (selectedValue !== null) {
      setSelectedValue(null)
    }
  }, [elements])

  function handleNewData(value: string | null) {
    if (value) {
      const selectedElement = elements?.find((element) => element.name === value)
      if (selectedElement) {
        setNewPost(prevState => {
          if (prevState) {
            return {
              ...prevState,
              [componentName]: selectedElement?._id
            }
          } else {
            return {
              [componentName]: selectedElement?._id,
              category: '',
              price: 0
            }
          }
        })
      }
    } else {
      const newPostCopy = structuredClone(newPost || {})
      if (componentName === "seller") {
        delete newPostCopy.seller
      }
      if (componentName === "buyer") {
        delete newPostCopy.buyer
      }
      setNewPost(newPostCopy)
    }
  }

  return (
    <Autocomplete
      disablePortal
      id={`${componentName}-input-new-form`}
      options={elementsToShow}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      value={selectedValue}
      renderInput={(params) => <TextField
        {...params}
        label={componentName}
        placeholder="Choose a value"
      />}
      onChange={(e, newValue) => {
        setSelectedValue(newValue)
        handleNewData(newValue)
      }}
    />
  )
}
