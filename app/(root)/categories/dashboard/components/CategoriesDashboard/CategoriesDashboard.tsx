import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import CategoryTableRow from "../CategoryTableRow/CategoryTableRow"
import CategoriesInput from "../CategoriesInput/CategoriesInput"
import { getAllCategories } from "@/lib/actions/category.actions"
import { setAllCategories } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

export default function CategoriesDashboard() {

  const dispatch = useDispatch()

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [categoriesToRender, setCategoriesToRender] = useState<Category[]>([])
  const [orderPressed, setOrderPressed] = useState("")
  const [isFilteringByName, setIsFilteringByName] = useState(false)

  useEffect(() => {
    const allCategoriesCopy = structuredClone(allCategories || [])
    const orderedCategories = allCategoriesCopy.sort((a, b) => {
      return a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
    })
    setCategoriesToRender(orderedCategories)
  }, [allCategories])

  async function handleGetAll() {
    const fetchAllCategories = await getAllCategories()
    if (fetchAllCategories) {
      const { message, status, object }: { message: string, status: number, object: Client | null } = fetchAllCategories
      if (status === 200) {
        dispatch(setAllCategories(object))
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  function handleFilterByName(value: string) {
    if (value) {
      const categoriesFilteredByName = [...(allCategories || [])].filter(b => b?.name?.toLowerCase().includes(value.toLowerCase()))
      setCategoriesToRender(categoriesFilteredByName)
      setIsFilteringByName(true)
    } else {
      setCategoriesToRender([...(allCategories || [])])
      setIsFilteringByName(false)
    }
  }

  function handleOrderBy(value: string) {
    // setOrderBy(value)
    setOrderPressed(value)
    const categoriesOrdered = structuredClone(allCategories || [])
    if (value === "id-lower") {
      categoriesOrdered.sort((a, b) => {
        return a?._id?.toString().toLowerCase().localeCompare(b?._id?.toString().toLowerCase())
      })
    }
    if (value === "id-higher") {
      categoriesOrdered.sort((a, b) => {
        return b?._id?.toString().toLowerCase().localeCompare(a?._id?.toString().toLowerCase())
      })
    }
    if (value === "name-az") {
      categoriesOrdered.sort((a, b) => {
        return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
      })
    }
    if (value === "name-za") {
      categoriesOrdered.sort((a, b) => {
        return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
      })
    }
    if (value === "less-posts") {
      categoriesOrdered.sort((a, b) => {
        const aCategoryPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString())
        const bCategoryPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString())
        return aCategoryPosts?.length - bCategoryPosts?.length
      })
    }
    if (value === "more-posts") {
      categoriesOrdered.sort((a, b) => {
        const aCategoryPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString())
        const bCategoryPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString())
        return bCategoryPosts?.length - aCategoryPosts?.length
      })
    }
    if (value === "less-buyer-posts") {
      categoriesOrdered.sort((a, b) => {
        const aBuyerPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString() && p?.buyer)
        const bBuyerPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString() && p?.buyer)

        return aBuyerPosts?.length - bBuyerPosts?.length
      })
    }
    if (value === "more-buyer-posts") {
      categoriesOrdered.sort((a, b) => {
        const aBuyerPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString() && p?.buyer)
        const bBuyerPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString() && p?.buyer)

        return bBuyerPosts?.length - aBuyerPosts?.length
      })
    }
    if (value === "less-seller-posts") {
      categoriesOrdered.sort((a, b) => {
        const aSellerPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString() && p?.seller)
        const bSellerPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString() && p?.seller)

        return aSellerPosts?.length - bSellerPosts?.length
      })
    }
    if (value === "more-seller-posts") {
      categoriesOrdered.sort((a, b) => {
        const aSellerPosts = [...(allPosts || [])].filter(p => p?.category === a?._id.toString() && p?.seller)
        const bSellerPosts = [...(allPosts || [])].filter(p => p?.category === b?._id.toString() && p?.seller)

        return bSellerPosts?.length - aSellerPosts?.length
      })
    }
    if (value === "less-matches") {
      categoriesOrdered.sort((a, b) => {
        const aMatches = [...(allMatches || [])].filter(m => m?.category === a?._id.toString())
        const bMatches = [...(allMatches || [])].filter(m => m?.category === b?._id.toString())

        return aMatches?.length - bMatches?.length
      })
    }
    if (value === "more-matches") {
      categoriesOrdered.sort((a, b) => {
        const aMatches = [...(allMatches || [])].filter(m => m?.category === a?._id.toString())
        const bMatches = [...(allMatches || [])].filter(m => m?.category === b?._id.toString())

        return bMatches?.length - aMatches?.length
      })
    }
    if (value === "newest") {
      categoriesOrdered.sort((a, b) => {
        return new Date(a?.created_at).getTime() - new Date(b?.created_at).getTime()
      })
    }
    if (value === "oldest") {
      categoriesOrdered.sort((a, b) => {
        return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      })
    }
    if (value === "active") {
      categoriesOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1
      })
    }
    if (value === "deactive") {
      categoriesOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? 1 : -1
      })
    }
    if (value === "disabled") {
      categoriesOrdered.sort((a, b) => {
        return a.disabled === b.disabled ? 0 : a.disabled ? -1 : 1
      })
    }
    if (value === "enabled") {
      categoriesOrdered.sort((a, b) => {
        return a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1
      })
    }
    setCategoriesToRender(categoriesOrdered)
  }
  // console.log(orderBy)

  return (
    <div className="w-full h-full">

      <div className="w-full p-3">
        <div className="border max-w-fit w-full overflow-x-auto">
          <table className="text-left">
            <thead className="border-b">
              <tr className="text-[18px]">
                <th className="">
                  <button
                    className="border-2 border-black rounded-[9999px] m-1"
                    onClick={() => handleGetAll()}
                  >
                    <IconRefresh className="h-[20px]" />
                  </button>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      ID
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("id-lower")}
                              className={`text-[10px] ${orderPressed === "id-lower" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowDown className="w-[20px]" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => handleOrderBy("id-higher")}
                              className={`text-[10px] ${orderPressed === "id-higher" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      <div className="w-[200px]">
                        <CategoriesInput
                          handleFilter={handleFilterByName}
                        />
                      </div>
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("name-az")}
                              className={`text-[10px] ${orderPressed === "name-az" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("name-za")}
                              className={`text-[10px] ${orderPressed === "name-za" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Posts
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("less-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("more-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Buyer Posts
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("less-buyer-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("more-buyer-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Seller Posts
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("less-seller-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("more-seller-posts")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Matches
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("less-matches")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("more-matches")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Active?
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("deactive")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("active")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Disabled?
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("disabled")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("enabled")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex gap-[5px]">
                    <div className="px-1 flex items-center">
                      Created
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("oldest")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("newest")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowUp className="w-[20px] " />
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                categoriesToRender?.map((c) => (
                  <CategoryTableRow
                    category={c}
                    key={c?._id}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
