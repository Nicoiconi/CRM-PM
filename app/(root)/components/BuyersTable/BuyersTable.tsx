"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"

interface BuyersData {
  quantity: number
  posts: number
  active: number
  inactive: number
  enable: number
  disabled: number
}

export default function BuyersTable() {

  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [buyersData, setBuyersData] = useState<BuyersData>()

  useEffect(() => {
    const allBuyersCopy = structuredClone(allBuyers || [])
    const allPostsCopy = structuredClone(allPosts || [])
    setBuyersData({
      quantity: allBuyersCopy?.length,
      posts: [...(allPostsCopy || [])].filter(p => p?.buyer).length,
      active: [...(allBuyersCopy || [])].filter(b => b?.is_active === true).length,
      inactive: [...(allBuyersCopy || [])].filter(b => b?.is_active === false).length,
      enable: [...(allBuyersCopy || [])].filter(b => b?.disabled === false).length,
      disabled: [...(allBuyersCopy || [])].filter(b => b?.disabled === true).length
    })
  }, [allBuyers])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td className="py-1 px-2">
              Buyers
            </td>
            <td className="py-1 px-2">
              Quantity
            </td>
            <td className="py-1 px-2">
              Posts
            </td>
            <td className="py-1 px-2">
              Active
            </td>
            <td className="py-1 px-2">
              Inactive
            </td>
            <td className="py-1 px-2">
              Enable
            </td>
            <td className="py-1 px-2">
              Disable
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2">
              <Link
                href={`/buyers/dashboard`}
              >
                <IconExternalLink className="m-1" />
              </Link>
            </td>
            <td className="py-1 px-2">
              {buyersData?.quantity}
            </td>
            <td className="py-1 px-2">
              {buyersData?.posts}
            </td>
            <td className="py-1 px-2">
              {buyersData?.active}
            </td>
            <td className="py-1 px-2">
              {buyersData?.inactive}
            </td>
            <td className="py-1 px-2">
              {buyersData?.enable}
            </td>
            <td className="py-1 px-2">
              {buyersData?.disabled}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
