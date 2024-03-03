"use client"

import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

interface PostsData {
  quantity: number
  active: number
  inactive: number
  enable: number
  disabled: number

  buyerPosts: number
  uniqueBuyers: number
  activeBuyerPosts: number
  inactiveBuyerPosts: number
  enableBuyerPosts: number
  disabledBuyerPosts: number

  sellerPosts: number
  uniqueSellers: number
  activeSellerPosts: number
  inactiveSellerPosts: number
  enableSellerPosts: number
  disabledSellerPosts: number
}

export default function PostsTable() {

  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [postsData, setPostsData] = useState<PostsData>()

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])


    const uniqueBuyers: Set<string> = new Set()
    const uniqueSellers: Set<string> = new Set()
    allPostsCopy.forEach(post => {
      if (post.buyer) {
        uniqueBuyers.add(post.buyer) // Assuming buyer has an id property
      }
      if (post.seller) {
        uniqueSellers.add(post.seller) // Assuming buyer has an id property
      }
    })
    const uniqueBuyersArray: string[] = Array.from(uniqueBuyers)
    const uniqueSellersArray: string[] = Array.from(uniqueSellers)

    setPostsData({
      quantity: allPostsCopy?.length,
      active: [...(allPostsCopy || [])].filter(p => p?.is_active === true).length,
      inactive: [...(allPostsCopy || [])].filter(p => p?.is_active === false).length,
      enable: [...(allPostsCopy || [])].filter(p => p?.disabled === false).length,
      disabled: [...(allPostsCopy || [])].filter(p => p?.disabled === true).length,

      buyerPosts: [...(allPostsCopy || [])].filter(p => p?.buyer).length,
      uniqueBuyers: uniqueBuyersArray?.length,
      activeBuyerPosts: [...(allPostsCopy || [])].filter(p => p?.buyer && p?.is_active === true).length,
      inactiveBuyerPosts: [...(allPostsCopy || [])].filter(p => p?.buyer && p?.is_active === false).length,
      enableBuyerPosts: [...(allPostsCopy || [])].filter(p => p?.buyer && p?.disabled === false).length,
      disabledBuyerPosts: [...(allPostsCopy || [])].filter(p => p?.buyer && p?.disabled === true).length,

      sellerPosts: [...(allPostsCopy || [])].filter(p => p?.seller).length,
      uniqueSellers: uniqueSellersArray.length,
      activeSellerPosts: [...(allPostsCopy || [])].filter(p => p?.seller && p?.is_active === true).length,
      inactiveSellerPosts: [...(allPostsCopy || [])].filter(p => p?.seller && p?.is_active === false).length,
      enableSellerPosts: [...(allPostsCopy || [])].filter(p => p?.seller && p?.disabled === false).length,
      disabledSellerPosts: [...(allPostsCopy || [])].filter(p => p?.seller && p?.disabled === true).length,
    })
  }, [allPosts])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td className="py-1 px-2">
              Posts
            </td>
            <td className="py-1 px-2">
              Quantity
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
                href={`/posts/dashboard`}
              >
                <IconExternalLink className="m-1" />
              </Link>
            </td>
            <td className="py-1 px-2">
              {postsData?.quantity}
            </td>
            <td className="py-1 px-2">
              {postsData?.active}
            </td>
            <td className="py-1 px-2">
              {postsData?.inactive}
            </td>
            <td className="py-1 px-2">
              {postsData?.enable}
            </td>
            <td className="py-1 px-2">
              {postsData?.disabled}
            </td>
          </tr>

          <tr>
            <td className="py-1 px-2">
              Buyers
            </td>
            <td className="py-1 px-2">
              {postsData?.buyerPosts} {`(${postsData?.uniqueBuyers})`}
            </td>
            <td className="py-1 px-2">
              {postsData?.activeBuyerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.inactiveBuyerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.enableBuyerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.disabledBuyerPosts}
            </td>
          </tr>

          <tr>
            <td className="py-1 px-2">
              Sellers
            </td>
            <td className="py-1 px-2">
              {postsData?.sellerPosts} {`(${postsData?.uniqueSellers})`}
            </td>
            <td className="py-1 px-2">
              {postsData?.activeSellerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.inactiveSellerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.enableSellerPosts}
            </td>
            <td className="py-1 px-2">
              {postsData?.disabledSellerPosts}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
