import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { IconExternalLink } from "@tabler/icons-react"
import { getBuyerById } from "@/lib/actions/buyer.actions"

interface Props {
  match: Match
}

interface MatchToRender {
  _id: string
  category: string
  profit: string
  buyerPost: string
  sellerPost: string
  is_active: string
  disabled: string
  created_at: string
}

export default function MatchTableRow({ match }: Props) {

  const dispatch = useDispatch()

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [matchData, setMatchData] = useState<MatchToRender>()

  useEffect(() => {
    const findMatchCategory = allCategories?.find(c => c?._id?.toString() === match?.category)

    const matchBuyerPost = allPosts?.find(p => p?._id?.toString() === match?.buyerPost)
    const findMatchBuyer = allBuyers?.find(b => b?._id?.toString() === matchBuyerPost?.buyer)

    const matchSellerPost = allPosts?.find(p => p?._id?.toString() === match?.sellerPost)
    const findMatchSeller = allSellers?.find(s => s?._id?.toString() === matchSellerPost?.seller)

    setMatchData({
      _id: match?._id?.toString(),
      category: findMatchCategory?.name,
      profit: match?.profit.toLocaleString(),
      buyerPost: `${findMatchBuyer?.name} $ ${matchBuyerPost?.price.toLocaleString()}`,
      sellerPost: `${findMatchSeller?.name} $ ${matchSellerPost?.price.toLocaleString()}`,
      is_active: match?.is_active ? "Active" : "Deactive",
      disabled: match?.disabled ? "Disabled" : "Enabled",
      created_at: match?.created_at
    })
  }, [match])

  return (
    <tr className="border text-[20px]">
      <td>
        <Link
          href={`/matches/dashboard/${match?._id?.toString()}`}
        >
          <IconExternalLink className="m-1" />
        </Link>
      </td>
      <td className="py-1 px-2 overflow-hidden whitespace-nowrap">
        {`...${match?._id?.slice(- 7)
          }`}
      </td>
      <td className="py-1 px-2">
        {matchData?.category}
      </td>
      <td className="py-1 px-2">
        {matchData?.profit}
      </td>
      <td className="py-1 px-2">
        {matchData?.buyerPost}
      </td>
      <td className="py-1 px-2">
        {matchData?.sellerPost}
      </td>
      <td className="py-1 px-2">
        {matchData?.created_at}
      </td>
    </tr>
  )
}
