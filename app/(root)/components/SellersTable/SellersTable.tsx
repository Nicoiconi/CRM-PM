"use client"

import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

interface SellersData {
  quantity: number
  posts: number
  active: number
  inactive: number
  enable: number
  disabled: number
}

export default function SellersTable() {

  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [sellersData, setSellersData] = useState<SellersData>()

  useEffect(() => {
    const allSellersCopy = structuredClone(allSellers || [])
    const allPostsCopy = structuredClone(allPosts || [])
    setSellersData({
      quantity: allSellersCopy?.length,
      posts: [...(allPostsCopy || [])].filter(p => p?.seller).length,
      active: [...(allSellersCopy || [])].filter(b => b?.is_active === true).length,
      inactive: [...(allSellersCopy || [])].filter(b => b?.is_active === false).length,
      enable: [...(allSellersCopy || [])].filter(b => b?.disabled === false).length,
      disabled: [...(allSellersCopy || [])].filter(b => b?.disabled === true).length
    })
  }, [allSellers])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td className="py-1 px-2">
              Sellers
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
                href={`/sellers/dashboard`}
              >
                <IconExternalLink className="m-1" />
              </Link>
            </td>
            <td className="py-1 px-2">
              {sellersData?.quantity}
            </td>
            <td className="py-1 px-2">
              {sellersData?.posts}
            </td>
            <td className="py-1 px-2">
              {sellersData?.active}
            </td>
            <td className="py-1 px-2">
              {sellersData?.inactive}
            </td>
            <td className="py-1 px-2">
              {sellersData?.enable}
            </td>
            <td className="py-1 px-2">
              {sellersData?.disabled}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
