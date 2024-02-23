import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { IconExternalLink } from "@tabler/icons-react"
import { getCategoryById } from "@/lib/actions/category.actions"

interface Props {
  category: Category
}

interface CategoryToRender {
  _id: string
  name: string
  description: string
  is_active: boolean
  disable: boolean
  created_at: string
}

export default function CategoryTableRow({ category }: Props) {

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [categoryData, setCategoryData] = useState<CategoryToRender>()

  useEffect(() => {

    // const allCategoriesCopy = structuredClone(allCategories || [])
    // const buyerCategories = allCategoriesCopy?.filter((c: Category) => buyer?.categories?.includes(c?._id))
    // const uniqueCategoryNames = new Set(buyerCategories?.map((c: Category) => c?.name))
    // const uniqueCategoriesArray = Array.from(uniqueCategoryNames)
    // const uniqueCategoriesLength = uniqueCategoriesArray.length

    // const allMatchesCopy = structuredClone(allMatches || [])
    // const buyerMatches = allMatchesCopy?.filter((m: Match) => buyer?.matches?.includes(m?._id))


    setCategoryData({
      _id: `...${category?._id?.slice(-7)}`,
      name: category?.name,
      description: category?.description,
      is_active: category?.is_active,
      disable: category?.disable,
      created_at: category?.created_at

    })
  }, [category])

  function handleSetById() {
    getCategoryById(category?._id)
  }

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
          onClick={() => handleSetById()}
          href="/categories/search-categories"
        >
          <IconExternalLink className="m-1" />
        </Link>
      </td>
      <td className="py-1 px-2 overflow-hidden whitespace-nowrap">
        {categoryData?._id}
      </td>
      <td className="py-1 px-2">
        {categoryData?.name}
      </td>
      <td className="py-1 px-2">
        {categoryData?.is_active}
      </td>
      <td className="py-1 px-2">
        {categoryData?.disable}
      </td>
      <td className="py-1 px-2">
        {categoryData?.created_at}
      </td>
    </tr>
  )
}
