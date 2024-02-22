import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { IconExternalLink } from "@tabler/icons-react"
import { getSellerById } from "@/lib/actions/seller.actions"

interface Props {
  seller: Client
}

interface SellerToRender {
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

export default function SellerTableRow({ seller }: Props) {

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.matches)

  const [sellerData, setSellerData] = useState<SellerToRender>()

  useEffect(() => {

    const allCategoriesCopy = structuredClone(allCategories || [])
    const sellerCategories = allCategoriesCopy?.filter((c: Category) => seller?.categories?.includes(c?._id))
    const uniqueCategoryNames = new Set(sellerCategories?.map((c: Category) => c?.name))
    const uniqueCategoriesArray = Array.from(uniqueCategoryNames)
    const uniqueCategoriesLength = uniqueCategoriesArray.length

    const allMatchesCopy = structuredClone(allMatches || [])
    const sellerMatches = allMatchesCopy?.filter((m: Match) => seller?.matches?.includes(m?._id))


    setSellerData({
      _id: `...${seller?._id?.slice(-7)}`,
      name: seller?.name,
      // categories: [...new Set([...(seller?.posts?.map((p: Post) => p?.category?.name))])].length,
      categories: uniqueCategoriesLength,
      posts: seller?.posts?.length,
      matches: sellerMatches.length,
      description: seller?.description || "",
      is_active: seller?.is_active,
      disable: seller?.disable,
      created_at: seller?.created_at

    })
  }, [seller])

  function handleSetById() {
    getSellerById(seller?._id)
  }

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
          onClick={() => handleSetById()}
          href="/sellers/search-sellers"
        >
          <IconExternalLink className="m-1" />
        </Link>
      </td>
      <td className="py-1 px-2 overflow-hidden whitespace-nowrap">
        {sellerData?._id}
      </td>
      <td className="py-1 px-2">
        {sellerData?.name}
      </td>
      <td className="py-1 px-2">
        {sellerData?.categories}
      </td>
      <td className="py-1 px-2">
        {sellerData?.posts}
      </td>
      <td className="py-1 px-2">
        {sellerData?.matches}
      </td>
      <td className="py-1 px-2">
        {sellerData?.is_active}
      </td>
      <td className="py-1 px-2">
        {sellerData?.disable}
      </td>
      <td className="py-1 px-2">
        {sellerData?.created_at}
      </td>
    </tr>
  )
}
