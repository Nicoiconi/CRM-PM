import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

interface Props {
  handleFilter: (value: string) => void
}

export default function BuyersInput({ handleFilter }: Props) {

  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)

  const [buyerNamesToShow, setBuyerNamesToShow] = useState<string[]>([])

  useEffect(() => {
    const allBuyersCopy = structuredClone(allBuyers || [])
    const buyerNames = allBuyersCopy?.map((s: Client) => s?.name).sort()
    setBuyerNamesToShow(buyerNames)
  }, [allBuyers])

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
