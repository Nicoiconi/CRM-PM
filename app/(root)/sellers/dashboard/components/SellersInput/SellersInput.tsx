import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

interface Props {
  handleFilter: (value: string) => void
}

export default function SellersInput({ handleFilter }: Props) {

  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [sellerNamesToShow, setSellerNamesToShow] = useState<string[]>([])

  useEffect(() => {
    const allSellersCopy = [...(allSellers || [])]
    const sellerNames = allSellersCopy?.map((s: Client) => s?.name).sort()
    setSellerNamesToShow(sellerNames)
  }, [allSellers])

  function handleFilterBySeller(value: string) {
    handleFilter(value)
  }

  return (
    <Autocomplete
      disablePortal
      id="seller-filter"
      options={sellerNamesToShow || []}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Seller" />}
      onChange={(e: React.SyntheticEvent, newValue: string | null, reason: string) => {
        handleFilterBySeller(newValue || "")
      }}
    />
  )
}
