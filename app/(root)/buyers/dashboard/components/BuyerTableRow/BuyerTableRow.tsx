"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"

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
  is_active: string
  disabled: string
  created_at: string
}

export default function BuyerTableRow({ buyer }: Props) {

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
      is_active: buyer?.is_active ? "Active" : "Deactive",
      disabled: buyer?.disabled ? "Disabled" : "Enabled",
      created_at: buyer?.created_at
    })
  }, [allCategories, allMatches, buyer])

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
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
        {buyerData?.disabled}
      </td>
      <td className="py-1 px-2">
        {buyerData?.created_at}
      </td>
    </tr>
  )
}
