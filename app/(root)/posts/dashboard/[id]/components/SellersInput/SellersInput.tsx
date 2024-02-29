import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'

interface Props {
  handleFilter: (value: string) => void
  itemsToShow: string[]
}

export default function SellersInput({ handleFilter, itemsToShow }: Props) {

  const [sellersToShow, setSellersToShow] = useState<string[]>()

  const { allSellers } = useSelector((state: Store) => state.sellers)

  useEffect(() => {
    if (itemsToShow) {
      setSellersToShow(itemsToShow)
    } else {
      const sellerNames = [...(allSellers || [])]?.map(c => c?.name).sort()
      setSellersToShow(sellerNames)
    }
  }, [allSellers, itemsToShow])

  function handleFilterBySeller(value: string) {
    handleFilter(value)
  }

  return (
    <Autocomplete
      disablePortal
      id="seller-filter"
      options={sellersToShow || []}
      sx={{ width: 'auto', backgroundColor: 'white', borderRadius: '10px' }}
      renderInput={(params) => <TextField {...params} label="Seller" />}
      onChange={(e, newValue) => {
        handleFilterBySeller(newValue || "")
      }}
    />
  )
}
