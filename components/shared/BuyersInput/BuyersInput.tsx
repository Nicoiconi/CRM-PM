import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, TextField } from '@mui/material'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

interface Props {
  handleFilter: (value: string) => void
  buyerNames?: string[] | undefined
}

export default function BuyersInput({ handleFilter, buyerNames }: Props) {

  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)

  const [buyerNamesToShow, setBuyerNamesToShow] = useState<string[]>([])

  useEffect(() => {
    if (buyerNames) {
      setBuyerNamesToShow(buyerNames)
    } else {
      const allBuyersCopy = [...(allBuyers || [])]
      const allBuyerNames = allBuyersCopy?.map((s: Client) => s?.name).sort()
      setBuyerNamesToShow(allBuyerNames)
    }
  }, [allBuyers, buyerNames])

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
