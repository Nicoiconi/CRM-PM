import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import SellerTableRow from "../SellerTableRow/SellerTableRow"
import SellersInput from "../SellersInput/SellersInput"
import { getAllSellers } from "@/lib/actions/seller.actions"
import { setAllSellers } from "@/lib/redux/slices/sellersSlice/sellersSlice"

export default function SellersDashboard() {

  const dispatch = useDispatch()

  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [sellersToRender, setSellersToRender] = useState<Client[]>([])
  const [orderPressed, setOrderPressed] = useState("")
  const [isFilteringByName, setIsFilteringByName] = useState(false)

  useEffect(() => {
    const allSellersCopy = structuredClone(allSellers || [])
    const orderedSellers = allSellersCopy.sort((a, b) => {
      return a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
    })
    setSellersToRender(orderedSellers)
  }, [allSellers])

  async function handleGetAll() {
    const fetchAllSellers = await getAllSellers()
    dispatch(setAllSellers(fetchAllSellers))
  }
  console.log("state", sellersToRender)

  function handleFilterByName(value: string) {
    if (value) {
      // const sellersFilteredByName = [...(allSellers || [])].filter(b => b?.name?.toLowerCase() === value.toLowerCase())
      const sellersFilteredByName = [...(allSellers || [])].filter(b => b?.name?.toLowerCase().includes(value.toLowerCase()))
      setSellersToRender(sellersFilteredByName)
      setIsFilteringByName(true)
    } else {
      setSellersToRender([...(allSellers || [])])
      setIsFilteringByName(false)
    }
  }

  function handleOrderBy(value: string) {
    setOrderPressed(value)
    let sellersOrdered = structuredClone(allSellers || [])
    if (value === "id-lower") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        return a?._id?.toString().toLowerCase().localeCompare(b?._id?.toString().toLowerCase())
      })
    }
    if (value === "id-higher") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        return b?._id?.toString().toLowerCase().localeCompare(a?._id?.toString().toLowerCase())
      })
    }
    if (value === "name-az") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
      })
    }
    if (value === "name-za") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
      })
    }
    if (value === "categories-lower") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        const uniquePostsA = new Set(a.posts.map(post => {
          const categoryPost = allCategories.find(c => c?._id === post)
          return categoryPost?.name
        }))
        const uniquePostsB = new Set(b.posts.map(post => {
          const categoryPost = allCategories.find(c => c?._id === post)
          return categoryPost?.name
        }))

        const countUniquePostsA = uniquePostsA.size
        const countUniquePostsB = uniquePostsB.size

        return countUniquePostsA - countUniquePostsB
      })
    }
    if (value === "categories-higher") {
      sellersOrdered = [...(allSellers || [])].sort((a, b) => {
        const uniquePostsA = new Set(a.posts.map(post => {
          const categoryPost = allCategories.find(c => c?._id === post)
          return categoryPost?.name
        }))
        const uniquePostsB = new Set(b.posts.map(post => {
          const categoryPost = allCategories.find(c => c?._id === post)
          return categoryPost?.name
        }))
        const countUniquePostsA = uniquePostsA.size
        const countUniquePostsB = uniquePostsB.size

        return countUniquePostsB - countUniquePostsA
      })
    }
    if (value === "less-posts") {
      sellersOrdered.sort((a, b) => {
        return a?.posts?.length - b?.posts.length
      })
    }
    if (value === "more-posts") {
      sellersOrdered.sort((a, b) => {
        return b?.posts?.length - a?.posts.length
      })
    }
    if (value === "less-matches") {
      sellersOrdered.sort((a, b) => {
        const allMatchesCopy = structuredClone(allMatches || [])
        const aMatches = allMatchesCopy.filter(m => m?.buyerPost === a?._id.toString())
        const bMatches = allMatchesCopy.filter(m => m?.buyerPost === b?._id.toString())

        return aMatches?.length - bMatches?.length
      })
    }
    if (value === "more-matches") {
      sellersOrdered.sort((a, b) => {
        const allMatchesCopy = structuredClone(allMatches || [])
        const aMatches = allMatchesCopy.filter(m => m?.buyerPost === a?._id.toString())
        const bMatches = allMatchesCopy.filter(m => m?.buyerPost === b?._id.toString())

        return bMatches?.length - aMatches?.length
      })
    }
    if (value === "newest") {
      sellersOrdered.sort((a, b) => {
        return new Date(a?.created_at).getTime() - new Date(b?.created_at).getTime()
      })
    }
    if (value === "oldest") {
      sellersOrdered.sort((a, b) => {
        return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      })
    }
    if (value === "active") {
      sellersOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1
      })
    }
    if (value === "deactive") {
      sellersOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? 1 : -1
      })
    }
    if (value === "disable") {
      sellersOrdered.sort((a, b) => {
        return a.disable === b.disable ? 0 : a.disable ? -1 : 1
      })
    }
    if (value === "enable") {
      sellersOrdered.sort((a, b) => {
        return a.disable === b.disable ? 0 : a.disable ? 1 : -1
      })
    }
    setSellersToRender(sellersOrdered)
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
                        <SellersInput
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
                      Catergories
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("categories-lower")}
                              className={`text-[10px] ${orderPressed === "categories-lower" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => handleOrderBy("categories-higher")}
                              className={`text-[10px] ${orderPressed === "categories-higher" ? "bg-sky-200" : ""}`}
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
                      Disable?
                    </div>
                    {
                      isFilteringByName
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("disable")}
                              className="text-[10px]"
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("enable")}
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
                sellersToRender?.map(s => (
                  <SellerTableRow
                    seller={s}
                    key={s?._id}
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
