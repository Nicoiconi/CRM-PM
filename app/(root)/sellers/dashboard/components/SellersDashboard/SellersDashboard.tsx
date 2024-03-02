import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import SellerTableRow from "../SellerTableRow/SellerTableRow"
import SellersInput from "../../../../../../components/shared/SellersInput/SellersInput"
import { getAllSellers } from "@/lib/actions/seller.actions"
import { setAllSellers } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"

interface FilterBy {
  name?: string
  is_active?: string
  disabled?: string
  [key: string]: string | boolean | undefined
}

export default function SellersDashboard() {

  const dispatch = useDispatch()

  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const sellersRef = useRef<Client[]>()
  const [sellersToRender, setSellersToRender] = useState<Client[]>([])
  const [filteredSellerNames, setFilteredSellerNames] = useState<string[] | undefined>(undefined)
  const [orderPressed, setOrderPressed] = useState("")
  const [sellersFilterBy, setSellersFilterBy] = useState<FilterBy>()

  useEffect(() => {
    const allSellersCopy = structuredClone(allSellers || [])
    const orderedSellers = allSellersCopy.sort((a, b) => {
      return a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
    })
    sellersRef.current = orderedSellers
    setSellersToRender(orderedSellers)
  }, [allSellers])

  async function handleGetAll() {
    const fetchAllSellers = await getAllSellers()
    if (fetchAllSellers) {
      const { message, status, object }: { message: string, status: number, object: Client | null } = fetchAllSellers
      if (status === 200) {
        dispatch(setAllSellers(object))
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  function handleFilterByName(value: string) {
    setSellersFilterBy(prevState => ({
      ...prevState,
      name: value
    }))

    if (!sellersFilterBy?.disabled && !sellersFilterBy?.is_active) {
      setFilteredSellerNames(undefined)
    }
  }

  function parseDate(dateString: string): Date {
    const [day, month, year, time] = dateString.split(/[\/ :]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(time));
  }

  function handleFilterSellersByBooleans(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setSellersFilterBy(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  useEffect(() => {
    let sellersRefCopy = structuredClone(sellersRef?.current || [])

    if (sellersFilterBy?.is_active) {
      if (sellersFilterBy?.is_active === "active") {
        sellersRefCopy = sellersRefCopy?.filter(s => s?.is_active)
      }
      if (sellersFilterBy?.is_active === "deactive") {
        sellersRefCopy = sellersRefCopy?.filter(s => !s?.is_active)
      }
      if (sellersFilterBy?.is_active === "all") {
        sellersRefCopy = sellersRefCopy?.filter(s => !s?.is_active || s?.is_active)
      }
    }

    if (sellersFilterBy?.disabled) {
      if (sellersFilterBy?.disabled === "enabled") {
        sellersRefCopy = sellersRefCopy?.filter(s => !s?.disabled)
      }
      if (sellersFilterBy?.disabled === "disabled") {
        sellersRefCopy = sellersRefCopy?.filter(s => s?.disabled)
      }
      if (sellersFilterBy?.disabled === "all") {
        sellersRefCopy = sellersRefCopy?.filter(s => !s?.disabled || s?.disabled)
      }
    }

    if (sellersFilterBy?.name) {
      sellersRefCopy = sellersRefCopy?.filter(b => sellersFilterBy?.name && b?.name?.toLowerCase().includes(sellersFilterBy?.name?.toLowerCase()))
    }


    if ((sellersFilterBy?.is_active || sellersFilterBy?.disabled) && !sellersFilterBy?.name) {
      const sellerNames = []
      for (const eachSellerRefCopy of sellersRefCopy) {
        sellerNames?.push(eachSellerRefCopy?.name)
      }
      const sellerNamesSorted = sellerNames?.sort((a, b) => a?.localeCompare(b))
      setFilteredSellerNames(sellerNamesSorted)
    }

    setSellersToRender(sellersRefCopy)
  }, [sellersFilterBy])

  function handleOrderBy(value: string) {
    setOrderPressed(value)
    let sellersToRenderOrdered = structuredClone(sellersToRender || [])
    if (value === "id-lower") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        return a?._id?.toString().toLowerCase().localeCompare(b?._id?.toString().toLowerCase())
      })
    }
    if (value === "id-higher") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        return b?._id?.toString().toLowerCase().localeCompare(a?._id?.toString().toLowerCase())
      })
    }
    if (value === "name-az") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
      })
    }
    if (value === "name-za") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
      })
    }
    if (value === "categories-lower") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        const uniquePostsA = new Set(a.posts.map(post => {
          const sellerPost = allPosts?.find(c => c?._id === post)
          if (sellerPost) return sellerPost?.category
        }))
        const uniquePostsB = new Set(b.posts.map(post => {
          const sellerPost = allPosts?.find(c => c?._id === post)
          if (sellerPost) return sellerPost?.category
        }))

        const countUniquePostsA = uniquePostsA.size
        const countUniquePostsB = uniquePostsB.size

        return countUniquePostsA - countUniquePostsB
      })
    }
    if (value === "categories-higher") {
      sellersToRenderOrdered = [...(allSellers || [])].sort((a, b) => {
        const uniquePostsA = new Set(a.posts.map(post => {
          const sellerPost = allPosts?.find(c => c?._id === post)
          if (sellerPost) return sellerPost?.category
        }))
        const uniquePostsB = new Set(b.posts.map(post => {
          const sellerPost = allPosts?.find(c => c?._id === post)
          if (sellerPost) return sellerPost?.category
        }))
        const countUniquePostsA = uniquePostsA.size
        const countUniquePostsB = uniquePostsB.size

        return countUniquePostsB - countUniquePostsA
      })
    }
    if (value === "less-posts") {
      sellersToRenderOrdered.sort((a, b) => {
        return a?.posts?.length - b?.posts.length
      })
    }
    if (value === "more-posts") {
      sellersToRenderOrdered.sort((a, b) => {
        return b?.posts?.length - a?.posts.length
      })
    }
    if (value === "less-matches") {
      sellersToRenderOrdered.sort((a, b) => {
        const aMatchedPostsLength = [...(allMatches || [])].filter(m => m?.sellerPost && a?.posts?.includes(m?.sellerPost)).length
        const bMatchedPostsLength = [...(allMatches || [])].filter(m => m?.sellerPost && b?.posts?.includes(m?.sellerPost)).length

        return aMatchedPostsLength - bMatchedPostsLength
      })
    }
    if (value === "more-matches") {
      sellersToRenderOrdered.sort((a, b) => {
        const aMatchedPostsLength = [...(allMatches || [])].filter(m => m?.sellerPost && a?.posts?.includes(m?.sellerPost)).length
        const bMatchedPostsLength = [...(allMatches || [])].filter(m => m?.sellerPost && b?.posts?.includes(m?.sellerPost)).length

        return bMatchedPostsLength - aMatchedPostsLength
      })
    }
    if (value === "oldest") {
      sellersToRenderOrdered.sort((a, b) => {
        return parseDate(a.created_at).getTime() - parseDate(b.created_at).getTime()
      })
    }
    if (value === "newest") {
      sellersToRenderOrdered.sort((a, b) => {
        return parseDate(b.created_at).getTime() - parseDate(a.created_at).getTime()
      })
    }
    if (value === "active") {
      sellersToRenderOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1
      })
    }
    if (value === "deactive") {
      sellersToRenderOrdered.sort((a, b) => {
        return a.is_active === b.is_active ? 0 : a.is_active ? 1 : -1
      })
    }
    if (value === "disabled") {
      sellersToRenderOrdered.sort((a, b) => {
        return a.disabled === b.disabled ? 0 : a.disabled ? -1 : 1
      })
    }
    if (value === "enabled") {
      sellersToRenderOrdered.sort((a, b) => {
        return a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1
      })
    }
    setSellersToRender(sellersToRenderOrdered)
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
                      sellersToRender?.length <= 1
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
                          sellerNames={filteredSellerNames}
                        />
                      </div>
                    </div>
                    {
                      sellersToRender?.length <= 1
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
                      sellersToRender?.length <= 1
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
                      sellersToRender?.length <= 1
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
                      sellersToRender?.length <= 1
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
                      <select
                        name="is_active"
                        id=""
                        onChange={(e) => handleFilterSellersByBooleans(e)}
                        className="w-[100px]"
                        value={sellersFilterBy?.is_active}
                      >
                        <option value="all">
                          All
                        </option>
                        <option value="active">
                          Active
                        </option>
                        <option value="deactive">
                          Deactive
                        </option>
                      </select>
                    </div>
                    {
                      sellersToRender?.length <= 1
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
                      <select
                        name="disabled"
                        id=""
                        onChange={(e) => handleFilterSellersByBooleans(e)}
                        className="w-[100px]"
                        value={sellersFilterBy?.disabled}
                      >
                        <option value="all">
                          All
                        </option>
                        <option value="enabled">
                          Enabled
                        </option>
                        <option value="disabled">
                          Disabled
                        </option>
                      </select>
                    </div>
                    {
                      sellersToRender?.length <= 1
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
                      sellersToRender?.length <= 1
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
