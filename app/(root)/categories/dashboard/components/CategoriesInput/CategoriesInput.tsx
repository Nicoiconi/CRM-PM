import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

interface Props {
  handleFilter: (value: string) => void
  specificCategoryNames?: string[] | undefined
}

export default function CategoriesInput({ handleFilter, specificCategoryNames }: Props) {

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [categoryNamesToShow, setCategoryNamesToShow] = useState<string[]>([])

  useEffect(() => {
    if(specificCategoryNames) {
      setCategoryNamesToShow(specificCategoryNames)
    } else {
      const allCategoriesCopy = structuredClone(allCategories || [])
      const categoryNames = allCategoriesCopy?.map((s: Category) => s?.name).sort()
      setCategoryNamesToShow(categoryNames)
    }
  }, [allCategories, specificCategoryNames])

  function handleFilterByCategory(value: string) {
    console.log(value)
    if (value) {
      handleFilter(value)
    } else {
      handleFilter("")
    }
  }

  return (
    <Autocomplete
      disablePortal
      id="category-filter"
      options={categoryNamesToShow || []}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Category" />}
      onChange={(e: React.SyntheticEvent, newValue: string | null, reason: string) => {
        handleFilterByCategory(newValue || "")
      }}
    />
  )
}
