import { useEffect, useState } from "react"
import { Autocomplete, TextField } from "@mui/material"

export default function FilterPostByOwnerInput({ ownerType, namesToDisplay, handleFilterByName, categoryFilter }) {

  const [selectedValue, setSelectedValue] = useState()
  const [allResourcesNames, setAllResourcesNames] = useState()

  useEffect(() => {
    setAllResourcesNames(namesToDisplay)
    setSelectedValue(undefined)
  }, [namesToDisplay, ownerType, categoryFilter])

  function handleChangeName(value) {
    handleFilterByName(value)
  }

  return (
    <Autocomplete
      disablePortal
      id={`filter-by-name-${ownerType}-input`}
      options={allResourcesNames || []}
      sx={{
        width: 'auto',
        backgroundColor: 'white'
      }}
      renderInput={(params) => <TextField
        {...params}
        label={ownerType}
      />}
      value={selectedValue}
      onChange={(e, newValue) => {
        handleChangeName(newValue)
      }}
    />
  )
}
