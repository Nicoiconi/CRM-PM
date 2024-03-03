"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"

interface CategoriesData {
  quantity: number
  active: number
  inactive: number
  enable: number
  disabled: number
}

export default function CategoriesTable() {

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [categoriesData, setCategoriesData] = useState<CategoriesData>()

  useEffect(() => {
    const allCategoriesCopy = structuredClone(allCategories || [])
    setCategoriesData({
      quantity: allCategoriesCopy?.length,
      active: [...(allCategoriesCopy || [])].filter(b => b?.is_active === true).length,
      inactive: [...(allCategoriesCopy || [])].filter(b => b?.is_active === false).length,
      enable: [...(allCategoriesCopy || [])].filter(b => b?.disabled === false).length,
      disabled: [...(allCategoriesCopy || [])].filter(b => b?.disabled === true).length
    })
  }, [allCategories])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td className="py-1 px-2">
              Categories
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
                href={`/categories/dashboard`}
              >
                <IconExternalLink className="m-1" />
              </Link>
            </td>
            <td className="py-1 px-2">
              {categoriesData?.quantity}
            </td>
            <td className="py-1 px-2">
              {categoriesData?.active}
            </td>
            <td className="py-1 px-2">
              {categoriesData?.inactive}
            </td>
            <td className="py-1 px-2">
              {categoriesData?.enable}
            </td>
            <td className="py-1 px-2">
              {categoriesData?.disabled}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
