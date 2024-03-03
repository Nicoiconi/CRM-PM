import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import { getAllMatches } from "@/lib/actions/match.actions"
import { setAllMatches } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"
import BuyersInput from "@/components/shared/BuyersInput/BuyersInput"
import SellersInput from "@/components/shared/SellersInput/SellersInput"
import MatchTableRow from "../MatchTableRow/MatchTableRow"

interface FilterBy {
  category?: string
  buyer?: string
  seller?: string
}

export default function MatchesDashboard() {

  const dispatch = useDispatch()

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [matchesToShow, setMatchesToShow] = useState<Match[]>([])
  const [matchesFilteredBy, setMatchesFilteredBy] = useState<Match[]>()
  const [orderPressed, setOrderPressed] = useState("")
  const [categoryNamesToDisplay, setCategoryNamesToDisplay] = useState<string[]>([])
  const [buyerNamesToDisplay, setBuyerNamesToDisplay] = useState<string[]>([])
  const [sellerNamesToDisplay, setSellerNamesToDisplay] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState<FilterBy>()

  useEffect(() => {
    const allMatchesCopy = structuredClone(allMatches || [])
    setMatchesToShow(allMatchesCopy)
  }, [allMatches])

  useEffect(() => {
    const categoryIds = [...(allMatches || [])].map(m => m?.category)
    const uniqueCategoryIds = new Set(categoryIds)
    const uniqueCategoryIdsArray = Array.from(uniqueCategoryIds)
    const uniqueCategoryNames: string[] = []
    for (const categoryId of uniqueCategoryIdsArray) {
      const findCategory = allCategories?.find(c => c?._id?.toString() === categoryId)
      if (findCategory && !uniqueCategoryNames?.includes(findCategory?.name)) {
        uniqueCategoryNames?.push(findCategory?.name)
      }
    }
    setCategoryNamesToDisplay(uniqueCategoryNames)

  }, [])

  async function handleGetAll() {
    const fetchAllMatches = await getAllMatches()
    if (fetchAllMatches) {
      const { message, status, object }: { message: string, status: number, object: Client | null } = fetchAllMatches
      if (status === 200) {
        dispatch(setAllMatches(object))
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  useEffect(() => {
    let matchesFiltered = structuredClone(allMatches || [])

    const uniqueBuyerNames: string[] = []
    const uniqueSellerNames: string[] = []

    if (filterBy?.category) {
      const findMatchCategory = allCategories?.find(c => c?.name === filterBy?.category)
      matchesFiltered = matchesFiltered.filter(m => m?.category === findMatchCategory?._id?.toString())

      // const matchesByCategory = [...(allMatches || [])].filter(m => m?.category?.name.toLowerCase() === filterBy?.category?.toLowerCase())

      // const buyerNames = matchesByCategory.map(m => m?.buyerPost?.buyer?.name)
      // buyerUniqueNames = new Set(buyerNames)

      // const sellerNames = matchesByCategory.map(m => m?.sellerPost?.seller?.name)
      // sellerUniqueNames = new Set(sellerNames)
      // const buyerPostsIds = [...(matchesFiltered || [])].map(m => m?.buyerPost)
      // const uniqueBuyerPostsIds = new Set(buyerPostsIds)
      // const uniqueBuyerPostsIdArray = Array.from(uniqueBuyerPostsIds)
      // for (const buyerPostId of uniqueBuyerPostsIdArray) {
      //   const findBuyerPost = allPosts?.find(p => p?._id?.toString() === buyerPostId)
      //   if (findBuyerPost) {
      //     const findBuyer: Client | undefined = allBuyers?.find(b => b?._id?.toString() === findBuyerPost?.buyer)
      //     if (findBuyer && !uniqueBuyerNames?.includes(findBuyer?.name)) {
      //       uniqueBuyerNames?.push(findBuyer?.name)
      //     }
      //   }
      // }

      // const sellerPostsIds = [...(matchesFiltered || [])].map(m => m?.sellerPost)
      // const uniqueSellerPostsIds = new Set(sellerPostsIds)
      // const uniqueSellerPostsIdArray = Array.from(uniqueSellerPostsIds)
      // for (const sellerPostId of uniqueSellerPostsIdArray) {
      //   const findSellerPost = allPosts?.find(p => p?._id?.toString() === sellerPostId)
      //   if (findSellerPost) {
      //     const findSeller: Client | undefined = allSellers?.find(s => s?._id?.toString() === findSellerPost?.seller)
      //     if (findSeller && !uniqueSellerNames?.includes(findSeller?.name)) {
      //       uniqueSellerNames?.push(findSeller?.name)
      //     }
      //   }
      // }
    }

    if (filterBy?.buyer) {

      const findBuyer = allBuyers?.find(b => b?.name === filterBy?.buyer)

      if (findBuyer) {
        // const buyerPostsIds = [...(matchesFiltered || [])].map(m => {
        //   const findMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === m?.buyerPost)
        //   if (findMatchBuyerPost && findMatchBuyerPost?.buyer === findBuyer?._id?.toString()) {
        //     return findBuyer?._id?.toString()
        //   }
        // })
        matchesFiltered = matchesFiltered?.filter(m => {
          const findMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === m?.buyerPost)
          if (findMatchBuyerPost && findMatchBuyerPost?.buyer === findBuyer?._id?.toString()) {
            return true
          }
        })

        // const sellerPostsIds = [...(matchesFiltered || [])].map(m => m?.sellerPost)
        // const uniqueSellerPostsIds = new Set(sellerPostsIds)
        // const uniqueSellerPostsIdArray = Array.from(uniqueSellerPostsIds)
        // for (const sellerPostId of uniqueSellerPostsIdArray) {
        //   const findSellerPost = allPosts?.find(p => p?._id?.toString() === sellerPostId)
        //   if (findSellerPost) {
        //     const findSeller: Client | undefined = allSellers?.find(s => s?._id?.toString() === findSellerPost?.seller)
        //     if (findSeller && !uniqueSellerNames?.includes(findSeller?.name)) {
        //       uniqueSellerNames?.push(findSeller?.name)
        //     }
        //   }
        // }
      }

    }

    if (filterBy?.seller) {

      const findSeller = allSellers?.find(s => s?.name === filterBy?.seller)

      if (findSeller) {

        matchesFiltered = matchesFiltered?.filter(m => {
          const findMatchSellerPost = allPosts?.find(p => p?._id?.toString() === m?.sellerPost)
          if (findMatchSellerPost && findMatchSellerPost?.seller === findSeller?._id?.toString()) {
            return true
          }
        })

        // const buyerPostsIds = [...(matchesFiltered || [])].map(m => m?.buyerPost)
        // const uniqueBuyerPostsIds = new Set(buyerPostsIds)
        // const uniqueBuyerPostsIdArray = Array.from(uniqueBuyerPostsIds)
        // for (const buyerPostId of uniqueBuyerPostsIdArray) {
        //   const findBuyerPost = allPosts?.find(p => p?._id?.toString() === buyerPostId)
        //   if (findBuyerPost) {
        //     const findBuyer: Client | undefined = allBuyers?.find(b => b?._id?.toString() === findBuyerPost?.buyer)
        //     if (findBuyer && !uniqueBuyerNames?.includes(findBuyer?.name)) {
        //       uniqueBuyerNames?.push(findBuyer?.name)
        //     }
        //   }
        // }
      }
    }

    if (!filterBy?.buyer && !filterBy?.seller) {
      const buyerPostsIds = [...(matchesFiltered || [])].map(m => m?.buyerPost)
      const uniqueBuyerPostsIds = new Set(buyerPostsIds)
      const uniqueBuyerPostsIdArray = Array.from(uniqueBuyerPostsIds)
      for (const buyerPostId of uniqueBuyerPostsIdArray) {
        const findBuyerPost = allPosts?.find(p => p?._id?.toString() === buyerPostId)
        if (findBuyerPost) {
          const findBuyer: Client | undefined = allBuyers?.find(b => b?._id?.toString() === findBuyerPost?.buyer)
          if (findBuyer && !uniqueBuyerNames?.includes(findBuyer?.name)) {
            uniqueBuyerNames?.push(findBuyer?.name)
          }
        }
      }
      setBuyerNamesToDisplay(uniqueBuyerNames)

      const sellerPostsIds = [...(matchesFiltered || [])].map(m => m?.sellerPost)
      const uniqueSellerPostsIds = new Set(sellerPostsIds)
      const uniqueSellerPostsIdArray = Array.from(uniqueSellerPostsIds)
      for (const sellerPostId of uniqueSellerPostsIdArray) {
        const findSellerPost = allPosts?.find(p => p?._id?.toString() === sellerPostId)
        if (findSellerPost) {
          const findSeller: Client | undefined = allSellers?.find(s => s?._id?.toString() === findSellerPost?.seller)
          if (findSeller && !uniqueSellerNames?.includes(findSeller?.name)) {
            uniqueSellerNames?.push(findSeller?.name)
          }
        }
      }
      setSellerNamesToDisplay(uniqueSellerNames)
    }

    setMatchesFilteredBy(matchesFiltered)
    setMatchesToShow(matchesFiltered)
  }, [allBuyers, allCategories, allMatches, allPosts, allSellers, filterBy])

  function handleFilterByCategory(value: string) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  function handleFilterByBuyer(value: string) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        buyer: value
      }
    })
  }

  function handleFilterBySeller(value: string) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        seller: value
      }
    })
  }

  function parseDate(dateString: string): Date {
    const [day, month, year, time] = dateString.split(/[\/ :]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(time));
  }

  function handleOrderBy(value: string) {
    setOrderPressed(value)

    const matchesOrdered = matchesFilteredBy
      ? [...(matchesFilteredBy)]
      : [...(allMatches || [])]

    if (value === "id-lower") {
      matchesOrdered.sort((a, b) => {
        return a?._id?.toString().toLowerCase().localeCompare(b?._id?.toString().toLowerCase())
      })
    }
    if (value === "id-higher") {
      matchesOrdered.sort((a, b) => {
        return b?._id?.toString().toLowerCase().localeCompare(a?._id?.toString().toLowerCase())
      })
    }
    // if (value === "name-az") {
    //   matchesOrdered.sort((a, b) => {
    //     return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
    //   })
    // }
    // if (value === "name-za") {
    //   matchesOrdered.sort((a, b) => {
    //     return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
    //   })
    // }
    if (value === "categories-az") {
      matchesOrdered.sort((a, b) => {
        const aMatchCategory = allCategories?.find(c => c?._id?.toString() === a?.category)
        const bMatchCategory = allCategories?.find(c => c?._id?.toString() === b?.category)

        return aMatchCategory?.name?.toLowerCase().localeCompare(bMatchCategory?.name?.toLowerCase())
      })
    }
    if (value === "categories-za") {
      matchesOrdered.sort((a, b) => {
        const aMatchCategory = allCategories?.find(c => c?._id?.toString() === a?.category)
        const bMatchCategory = allCategories?.find(c => c?._id?.toString() === b?.category)

        return bMatchCategory?.name?.toLowerCase().localeCompare(aMatchCategory?.name?.toLowerCase())
      })
    }
    if (value === "lower-profit") {
      matchesOrdered.sort((a, b) => {
        return a?.profit - b?.profit
      })
    }
    if (value === "higher-profit") {
      matchesOrdered.sort((a, b) => {
        return b?.profit - a?.profit
      })
    }
    if (value === "less-buyer-price") {
      matchesOrdered.sort((a, b) => {
        const aMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === a?.buyerPost)
        const bMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === b?.buyerPost)

        return (Number(aMatchBuyerPost?.price) || 0) - (Number(bMatchBuyerPost?.price) || 0)
      })
    }
    if (value === "higher-buyer-price") {
      matchesOrdered.sort((a, b) => {
        const aMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === a?.buyerPost)
        const bMatchBuyerPost = allPosts?.find(p => p?._id?.toString() === b?.buyerPost)

        return (Number(bMatchBuyerPost?.price) || 0) - (Number(aMatchBuyerPost?.price) || 0)
      })
    }
    if (value === "less-seller-price") {
      matchesOrdered.sort((a, b) => {
        const aMatchSellerPost = allPosts?.find(p => p?._id?.toString() === a?.sellerPost)
        const bMatchSellerPost = allPosts?.find(p => p?._id?.toString() === b?.sellerPost)

        return (Number(aMatchSellerPost?.price) || 0) - (Number(bMatchSellerPost?.price) || 0)
      })
    }
    if (value === "higher-seller-price") {
      matchesOrdered.sort((a, b) => {
        const aMatchSellerPost = allPosts?.find(p => p?._id?.toString() === a?.sellerPost)
        const bMatchSellerPost = allPosts?.find(p => p?._id?.toString() === b?.sellerPost)

        return (Number(bMatchSellerPost?.price) || 0) - (Number(aMatchSellerPost?.price) || 0)
      })
    }
    if (value === "newest") {
      matchesOrdered.sort((a, b) => {
        return parseDate(b?.created_at).getTime() - parseDate(a?.created_at).getTime()
      })
    }
    if (value === "oldest") {
      matchesOrdered.sort((a, b) => {
        return parseDate(a?.created_at).getTime() - parseDate(b?.created_at).getTime()
      })
    }
    if (value === "active") {
      matchesOrdered.sort((a, b) => {
        return a?.is_active === b?.is_active ? 0 : a?.is_active ? -1 : 1
      })
    }
    if (value === "deactive") {
      matchesOrdered.sort((a, b) => {
        return a?.is_active === b?.is_active ? 0 : a?.is_active ? 1 : -1
      })
    }
    if (value === "disabled") {
      matchesOrdered.sort((a, b) => {
        return a?.disabled === b?.disabled ? 0 : a?.disabled ? -1 : 1
      })
    }
    if (value === "enabled") {
      matchesOrdered.sort((a, b) => {
        return a?.disabled === b?.disabled ? 0 : a?.disabled ? 1 : -1
      })
    }
    setMatchesToShow(matchesOrdered)
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
                    <div className="flex gap-[5px]">
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
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="pr-1 flex items-center">
                      <div className="w-[150px]">
                        <CategoriesInput
                          handleFilter={handleFilterByCategory}
                          specificCategoryNames={categoryNamesToDisplay}
                        />
                      </div>
                    </div>
                    {
                      filterBy?.category
                        ? ""
                        : <div className="flex gap-[5px]">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleOrderBy("categories-az")}
                              className={`text-[10px] ${orderPressed === "categories-az" ? "bg-sky-200" : ""}`}
                            >
                              <IconArrowNarrowDown className="w-[20px] " />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => handleOrderBy("categories-za")}
                              className={`text-[10px] ${orderPressed === "categories-za" ? "bg-sky-200" : ""}`}
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
                      Profit
                    </div>
                    <div className="flex gap-[5px]">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleOrderBy("lower-profit")}
                          className={`text-[10px] ${orderPressed === "categories-lower" ? "bg-sky-200" : ""}`}
                        >
                          <IconArrowNarrowDown className="w-[20px] " />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => handleOrderBy("higher-profit")}
                          className={`text-[10px] ${orderPressed === "categories-higher" ? "bg-sky-200" : ""}`}
                        >
                          <IconArrowNarrowUp className="w-[20px] " />
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="pr-1 flex items-center">
                      <div className="w-[150px]">
                        <BuyersInput
                          buyerNames={buyerNamesToDisplay}
                          handleFilter={handleFilterByBuyer}
                        />
                      </div>
                    </div>
                    <div className="flex gap-[5px]">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleOrderBy("less-buyer-price")}
                          className="text-[10px]"
                        >
                          <IconArrowNarrowDown className="w-[20px] " />
                        </button>
                      </div>
                      <div className="flex items-center">
                        $
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleOrderBy("higher-buyer-price")}
                          className="text-[10px]"
                        >
                          <IconArrowNarrowUp className="w-[20px] " />
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="pr-1 flex items-center">
                      <div className="w-[150px]">
                        <SellersInput
                          sellerNames={sellerNamesToDisplay}
                          handleFilter={handleFilterBySeller}
                        />
                      </div>
                    </div>
                    <div className="flex gap-[5px]">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleOrderBy("less-seller-price")}
                          className="text-[10px]"
                        >
                          <IconArrowNarrowDown className="w-[20px] " />
                        </button>
                      </div>
                      <div className="flex items-center">
                        $
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleOrderBy("higher-seller-price")}
                          className="text-[10px]"
                        >
                          <IconArrowNarrowUp className="w-[20px] " />
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                {/* <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Active?
                    </div>
                    <div className="flex gap-[5px]">
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
                  </div>
                </th>
                <th className="py-1 px-2">
                  <div className="flex">
                    <div className="px-1 flex items-center">
                      Disable?
                    </div>
                    <div className="flex gap-[5px]">
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
                  </div>
                </th> */}
                <th className="py-1 px-2">
                  <div className="flex gap-[5px]">
                    <div className="px-1 flex items-center">
                      Created
                    </div>
                    <div className="flex">
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
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                matchesToShow?.map(m => (
                  <MatchTableRow
                    match={m}
                    key={m?._id}
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
