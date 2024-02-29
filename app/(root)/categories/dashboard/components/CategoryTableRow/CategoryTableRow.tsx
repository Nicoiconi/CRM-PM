import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"

interface Props {
  category: Category
}

interface CategoryToRender {
  _id: string
  name: string
  description: string
  posts: number
  buyerPosts: number
  sellerPosts: number
  matches: number
  is_active: string
  disable: string
  created_at: string
}

export default function CategoryTableRow({ category }: Props) {

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [categoryData, setCategoryData] = useState<CategoryToRender>()

  useEffect(() => {
    const categoryMatches = [...(allMatches || [])].filter(m => m?.category === category?._id?.toString()).length
    const categoryPosts = [...(allPosts || [])].filter(p => p?.category === category?._id?.toString()).length
    const categoryBuyerPosts = [...(allPosts || [])].filter(p => p?.buyer && p?.category === category?._id?.toString()).length
    const categorySellerPosts = [...(allPosts || [])].filter(p => p?.seller && p?.category === category?._id?.toString()).length
    setCategoryData({
      _id: category?._id,
      name: category?.name,
      description: category?.description,
      posts: categoryPosts,
      buyerPosts: categoryBuyerPosts,
      sellerPosts: categorySellerPosts,
      matches: categoryMatches,
      is_active: category?.is_active?.toString(),
      disable: category?.disable?.toString(),
      created_at: category?.created_at
    })
  }, [allMatches, allPosts, category])

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
          href={`/categories/dashboard/${categoryData?._id}`}
        >
          <IconExternalLink className="m-1" />
        </Link>
      </td>
      <td className="py-1 px-2 overflow-hidden whitespace-nowrap">
        {`...${category?._id?.slice(-7)}`}
      </td>
      <td className="py-1 px-2">
        {categoryData?.name}
      </td>
      <td className="py-1 px-2">
        {categoryData?.posts}
      </td>
      <td className="py-1 px-2">
        {categoryData?.buyerPosts}
      </td>
      <td className="py-1 px-2">
        {categoryData?.sellerPosts}
      </td>
      <td className="py-1 px-2">
        {categoryData?.matches}
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
