import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import BuyerTableRow from "../BuyerTableRow/BuyerTableRow"
import { getAllBuyers } from "@/lib/actions/buyer.actions"
import { setAllBuyers } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import BuyersInput from "@/components/shared/BuyersInput/BuyersInput"

interface FilterBy {
  name?: string
  is_active?: string
  disabled?: string
  [key: string]: string | boolean | undefined
}

export default function BuyersDashboard() {

  const dispatch = useDispatch()

  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const buyersRef = useRef<Client[]>()
  const [buyersToRender, setBuyersToRender] = useState<Client[]>([])
  const [filteredBuyerNames, setFilteredBuyerNames] = useState<string[] | undefined>(undefined)
  const [orderPressed, setOrderPressed] = useState("")
  const [buyersFilterBy, setBuyersFilterBy] = useState<FilterBy>()

  useEffect(() => {
    const allBuyersCopy = structuredClone(allBuyers || [])
    const orderedBuyers = allBuyersCopy?.sort((a, b) => {
      return a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase())
    })
    buyersRef.current = orderedBuyers
    setBuyersToRender(orderedBuyers)
  }, [allBuyers])

  async function handleGetAll() {
    const fetchAllBuyers = await getAllBuyers()
    if (fetchAllBuyers) {
      const { message, status, object }: { message: string, status: number, object: Client | null } = fetchAllBuyers
      if (status === 200) {
        dispatch(setAllBuyers(object))
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  function handleFilterByName(value: string) {
    setBuyersFilterBy(prevState => ({
      ...prevState,
      name: value
    }))

    if (!buyersFilterBy?.disabled && !buyersFilterBy?.is_active) {
      setFilteredBuyerNames(undefined)
    }
  }

  function parseDate(dateString: string): Date {
    const [day, month, year, time] = dateString.split(/[\/ :]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(time));
  }

  function handleFilterSellersByBooleans(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setBuyersFilterBy(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  useEffect(() => {
    let buyersRefCopy = structuredClone(buyersRef?.current || [])

    if (buyersFilterBy?.is_active) {
      if (buyersFilterBy?.is_active === "active") {
        buyersRefCopy = buyersRefCopy?.filter(s => s?.is_active)
      }
      if (buyersFilterBy?.is_active === "deactive") {
        buyersRefCopy = buyersRefCopy?.filter(s => !s?.is_active)
      }
      if (buyersFilterBy?.is_active === "all") {
        buyersRefCopy = buyersRefCopy?.filter(s => !s?.is_active || s?.is_active)
      }
    }

    if (buyersFilterBy?.disabled) {
      if (buyersFilterBy?.disabled === "enabled") {
        buyersRefCopy = buyersRefCopy?.filter(s => !s?.disabled)
      }
      if (buyersFilterBy?.disabled === "disabled") {
        buyersRefCopy = buyersRefCopy?.filter(s => s?.disabled)
      }
      if (buyersFilterBy?.disabled === "all") {
        buyersRefCopy = buyersRefCopy?.filter(s => !s?.disabled || s?.disabled)
      }
    }

    if (buyersFilterBy?.name) {
      buyersRefCopy = buyersRefCopy?.filter(b => buyersFilterBy?.name && b?.name?.toLowerCase().includes(buyersFilterBy?.name?.toLowerCase()))
    }

    if ((buyersFilterBy?.is_active || buyersFilterBy?.disabled) && !buyersFilterBy?.name) {
      const sellerNames = []
      for (const eachSellerRefCopy of buyersRefCopy) {
        sellerNames?.push(eachSellerRefCopy?.name)
      }
      const sellerNamesSorted = sellerNames?.sort((a, b) => a?.localeCompare(b))
      setFilteredBuyerNames(sellerNamesSorted)
    }

    setBuyersToRender(buyersRefCopy)
  }, [buyersFilterBy])

  function handleOrderBy(value: string) {
    setOrderPressed(value)
    const buyersOrdered = structuredClone(buyersToRender || [])

    if (value === "id-lower") {
      buyersOrdered.sort((a, b) => {
        return a?._id?.toString().toLowerCase().localeCompare(b?._id?.toString().toLowerCase())
      })
    }

    if (value === "id-higher") {
      buyersOrdered.sort((a, b) => {
        return b?._id?.toString().toLowerCase().localeCompare(a?._id?.toString().toLowerCase())
      })
    }

    if (value === "name-az") {
      buyersOrdered.sort((a, b) => {
        return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
      })
    }

    if (value === "name-za") {
      buyersOrdered.sort((a, b) => {
        return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
      })
    }

    if (value === "categories-lower") {
      buyersOrdered.sort((a, b) => {
        const uniqueCategoryPostsA = new Set(a.posts.map(post => {
          const buyerPost = allPosts?.find(p => p?._id?.toString() === post)
          return buyerPost?.category
        }))
        const uniqueCategoryPostsB = new Set(b.posts.map(post => {
          const buyerPost = allPosts?.find(p => p?._id?.toString() === post)
          return buyerPost?.category
        }))

        const countUniquePostsA = uniqueCategoryPostsA.size
        const countUniquePostsB = uniqueCategoryPostsB.size

        return countUniquePostsA - countUniquePostsB
      })
    }

    if (value === "categories-higher") {
      buyersOrdered.sort((a, b) => {
        const uniqueCategoryPostsA = new Set(a.posts.map(post => {
          const buyerPost = allPosts?.find(p => p?._id?.toString() === post)
          if (buyerPost) return buyerPost?.category
        }))
        const uniqueCategoryPostsB = new Set(b.posts.map(post => {
          const buyerPost = allPosts?.find(p => p?._id?.toString() === post)
          if (buyerPost) return buyerPost?.category
        }))

        const countUniquePostsA = uniqueCategoryPostsA.size
        const countUniquePostsB = uniqueCategoryPostsB.size

        return countUniquePostsB - countUniquePostsA
      })
    }

    if (value === "less-posts") {
      buyersOrdered.sort((a, b) => {
        return a?.posts?.length - b?.posts.length
      })
    }

    if (value === "more-posts") {
      buyersOrdered.sort((a, b) => {
        return b?.posts?.length - a?.posts.length
      })
    }

    if (value === "less-matches") {
      buyersOrdered.sort((a, b) => {
        const aMatchedPostsLength = [...(allMatches || [])].filter(m => m?.buyerPost && a?.posts?.includes(m?.buyerPost)).length
        const bMatchedPostsLength = [...(allMatches || [])].filter(m => m?.buyerPost && b?.posts?.includes(m?.buyerPost)).length

        return aMatchedPostsLength - bMatchedPostsLength
      })
    }

    if (value === "more-matches") {
      buyersOrdered.sort((a, b) => {
        const aMatchedPostsLength = [...(allMatches || [])].filter(m => m?.buyerPost && a?.posts?.includes(m?.buyerPost)).length
        const bMatchedPostsLength = [...(allMatches || [])].filter(m => m?.buyerPost && b?.posts?.includes(m?.buyerPost)).length

        return bMatchedPostsLength - aMatchedPostsLength
      })
    }

    if (value === "oldest") {
      buyersOrdered.sort((a, b) => {
        return parseDate(a?.created_at).getTime() - parseDate(b?.created_at).getTime()
      })
    }

    if (value === "newest") {
      buyersOrdered.sort((a, b) => {
        return parseDate(b?.created_at).getTime() - parseDate(a?.created_at).getTime()
      })
    }

    if (value === "active") {
      buyersOrdered.sort((a, b) => {
        return a?.is_active === b?.is_active ? 0 : a?.is_active ? -1 : 1
      })
    }

    if (value === "deactive") {
      buyersOrdered.sort((a, b) => {
        return a?.is_active === b?.is_active ? 0 : a?.is_active ? 1 : -1
      })
    }

    if (value === "disabled") {
      buyersOrdered.sort((a, b) => {
        return a?.disabled === b?.disabled ? 0 : a?.disabled ? -1 : 1
      })
    }

    if (value === "enabled") {
      buyersOrdered.sort((a, b) => {
        return a?.disabled === b?.disabled ? 0 : a?.disabled ? 1 : -1
      })
    }
    setBuyersToRender(buyersOrdered)
  }

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
                      buyersToRender?.length <= 1
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
                        <BuyersInput
                          handleFilter={handleFilterByName}
                          buyerNames={filteredBuyerNames}
                        />
                      </div>
                    </div>
                    {
                      buyersToRender?.length <= 1
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
                      buyersToRender?.length <= 1
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
                      buyersToRender?.length <= 1
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
                      buyersToRender?.length <= 1
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
                        value={buyersFilterBy?.is_active}
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
                      buyersToRender?.length <= 1
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
                        value={buyersFilterBy?.disabled}
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
                      buyersToRender?.length <= 1
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
                      buyersToRender?.length <= 1
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
                buyersToRender?.map(b => (
                  <BuyerTableRow
                    buyer={b}
                    key={b?._id}
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
