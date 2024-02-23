import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

interface Props {
  handleFilter: (value: string) => void
}

export default function CategoriesInput({ handleFilter }: Props) {

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [buyerNamesToShow, setBuyerNamesToShow] = useState<string[]>([])

  useEffect(() => {
    const allCategoriesCopy = structuredClone(allCategories || [])
    const categoryNames = allCategoriesCopy?.map((s: Category) => s?.name).sort()
    setBuyerNamesToShow(categoryNames)
  }, [allCategories])

  function handleFilterByBuyer(value: string) {
    handleFilter(value)
  }

  return (
    <Autocomplete
      disablePortal
      id="buyer-filter"
      options={buyerNamesToShow || []}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Buyer" />}
      onChange={(e: React.SyntheticEvent, newValue: string | null, reason: string) => {
        handleFilterByBuyer(newValue || "")
      }}
    />
  )
}
