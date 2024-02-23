"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { IconExternalLink } from "@tabler/icons-react"
import { getBuyerById } from "@/lib/actions/buyer.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setBuyerById } from "@/lib/redux/slices/buyersSlice/buyersSlice"

interface Props {
  buyer: Client
}

interface BuyerToRender {
  _id: string
  name: string
  categories: number
  posts: number
  matches: number
  description: string
  is_active: boolean
  disable: boolean
  created_at: string
}

export default function BuyerTableRow({ buyer }: Props) {

  const dispatch = useDispatch()

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [buyerData, setBuyerData] = useState<BuyerToRender>()

  useEffect(() => {

    const allCategoriesCopy = structuredClone(allCategories || [])
    const buyerCategories = allCategoriesCopy?.filter((c: Category) => buyer?.categories?.includes(c?._id))
    const uniqueCategoryNames = new Set(buyerCategories?.map((c: Category) => c?.name))
    const uniqueCategoriesArray = Array.from(uniqueCategoryNames)
    const uniqueCategoriesLength = uniqueCategoriesArray.length

    const allMatchesCopy = structuredClone(allMatches || [])
    const buyerMatches = allMatchesCopy?.filter((m: Match) => buyer?.matches?.includes(m?._id))


    setBuyerData({
      _id: buyer?._id,
      name: buyer?.name,
      categories: uniqueCategoriesLength,
      posts: buyer?.posts?.length,
      matches: buyerMatches.length,
      description: buyer?.description || "",
      is_active: buyer?.is_active,
      disable: buyer?.disable,
      created_at: buyer?.created_at

    })
  }, [buyer])

  // async function handleSetById() {
  //   const singleBuyerSelected = await getBuyerById(buyer?._id)
  //   if (singleBuyerSelected) {
  //     const { message, status, object } = singleBuyerSelected
  //     if (status === 200) {
  //       dispatch(setFooterMessage({ message, status }))
  //       dispatch(setBuyerById(singleBuyerSelected))
  //       return
  //     }
  //   }
  //   dispatch(setFooterMessage({ message: "Get Buyer failed", status: 409 }))
  // }

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
          // onClick={() => handleSetById()}
          href={`/buyers/dashboard/${buyerData?._id}`}
        >
          <IconExternalLink className="m-1" />
        </Link>
      </td>
      <td className="py-1 px-2 overflow-hidden whitespace-nowrap">
        {`...${buyer?._id?.slice(-7)}`}
      </td>
      <td className="py-1 px-2">
        {buyerData?.name}
      </td>
      <td className="py-1 px-2">
        {buyerData?.categories}
      </td>
      <td className="py-1 px-2">
        {buyerData?.posts}
      </td>
      <td className="py-1 px-2">
        {buyerData?.matches}
      </td>
      <td className="py-1 px-2">
        {buyerData?.is_active}
      </td>
      <td className="py-1 px-2">
        {buyerData?.disable}
      </td>
      <td className="py-1 px-2">
        {buyerData?.created_at}
      </td>
    </tr>
  )
}
