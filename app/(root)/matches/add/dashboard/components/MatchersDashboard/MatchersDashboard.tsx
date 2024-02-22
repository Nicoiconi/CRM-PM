import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconRefresh } from "@tabler/icons-react"
import BuyerTableRow from "../BuyerTableRow/BuyerTableRow"
import BuyersInput from "../BuyersInput/BuyersInput"
import { getAllBuyers } from "@/lib/actions/buyer.actions"
import { setAllBuyers } from "@/lib/redux/slices/buyersSlice/buyersSlice"

export default function MatchersDashboard() {
  const dispatch = useDispatch()

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  // console.log(allMatches)

  const [matchesToShow, setMatchesToShow] = useState<Match[]>([])
  const [matchesFilteredBy, setMatchesFilteredBy] = useState(null)
  const [orderPressed, setOrderPressed] = useState("")
  const [categoryNamesToDisplay, setCategoryNamesToDisplay] = useState<string[]>([])
  const [buyerNamesToDisplay, setBuyerNamesToDisplay] = useState<string[]>([])
  const [sellerNamesToDisplay, setSellerNamesToDisplay] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState({})

  useEffect(() => {
    const allMatchesCopy = structuredClone(allMatches || [])
    setMatchesToShow(allMatchesCopy)
  }, [allMatches])

  useEffect(() => {
    const allMatchesCopy = structuredClone(allMatches || [])

    const matchesCategories = new Set(allMatchesCopy?.map(m => m.category))
    console.log()
    const allCategoriesCopy = structuredClone(allCategories || [])
    const categoryNames = allCategoriesCopy.map(c => {
      if (matchesCategories?.includes(c?._id)){

      }
    })
    const uniqueCategories = [...new Set(categoryNames)]
    setCategoryNamesToDisplay(uniqueCategories)

    const buyerNames = allMatchesCopy.map(m => m?.buyerPost?.buyer?.name)
    const uniqueBuyers = [...new Set(buyerNames)]
    setBuyerNamesToDisplay(uniqueBuyers)

    const sellerNames = allMatchesCopy.map(m => m?.sellerPost?.seller?.name)
    const uniqueSellers = [...new Set(sellerNames)]
    setSellerNamesToDisplay(uniqueSellers)
  }, [])
  // console.log(categoryNamesToDisplay)

  function handleGetAll() {
    dispatch(getAllMatches())
  }

  useEffect(() => {
    let matchesFiltered = [...(allMatches || [])]
    const buyerNames = matchesFiltered.map(m => m?.buyerPost?.buyer?.name)
    let buyerUniqueNames = [...new Set(buyerNames)]
    const sellerNames = matchesFiltered.map(m => m?.sellerPost?.seller?.name)
    let sellerUniqueNames = [...new Set(sellerNames)]

    if (filterBy?.category) {
      matchesFiltered = matchesFiltered.filter(m => m?.category?.name?.toLowerCase() === filterBy?.category?.toLowerCase())

      const matchesByCategory = [...(allMatches || [])].filter(m => m?.category?.name.toLowerCase() === filterBy?.category?.toLowerCase())
      const buyerNames = matchesByCategory.map(m => m?.buyerPost?.buyer?.name)
      buyerUniqueNames = [...new Set(buyerNames)]
      const sellerNames = matchesByCategory.map(m => m?.sellerPost?.seller?.name)
      sellerUniqueNames = [...new Set(sellerNames)]
    }
    if (filterBy?.buyer) {
      matchesFiltered = matchesFiltered.filter(m => m?.buyerPost?.buyer?.name?.toLowerCase() === filterBy?.buyer?.toLowerCase())
      const sellers = matchesFiltered?.map(m => m?.sellerPost?.seller?.name)
      sellerUniqueNames = [...new Set(sellers)]
    }
    if (filterBy?.seller) {
      matchesFiltered = matchesFiltered.filter(m => m?.sellerPost?.seller?.name?.toLowerCase() === filterBy?.seller?.toLowerCase())
      const buyers = matchesFiltered?.map(m => m?.buyerPost?.buyer?.name)
      buyerUniqueNames = [...new Set(buyers)]
    }
    setBuyerNamesToDisplay(buyerUniqueNames)
    setSellerNamesToDisplay(sellerUniqueNames)
    setMatchesFilteredBy(matchesFiltered)
    setMatchesToShow(matchesFiltered)
  }, [filterBy])

  function handleFilterByCategory(value) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  function handleFilterByBuyer(value) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        buyer: value
      }
    })
  }

  function handleFilterBySeller(value) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        seller: value
      }
    })
  }
  // console.log(filterBy)

  function handleOrderBy(value) {
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
    if (value === "name-az") {
      matchesOrdered.sort((a, b) => {
        return a?.name?.toString().toLowerCase().localeCompare(b?.name?.toString().toLowerCase())
      })
    }
    if (value === "name-za") {
      matchesOrdered.sort((a, b) => {
        return b?.name?.toString().toLowerCase().localeCompare(a?.name?.toString().toLowerCase())
      })
    }
    if (value === "categories-az") {
      matchesOrdered.sort((a, b) => {
        return a?.category?.name?.toLowerCase().localeCompare(b?.category?.name?.toLowerCase())
      })
    }
    if (value === "categories-za") {
      matchesOrdered.sort((a, b) => {
        return b?.category?.name?.toLowerCase().localeCompare(a?.category?.name?.toLowerCase())
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
        return a?.buyerPost?.price - b?.buyerPost?.price
      })
    }
    if (value === "higher-buyer-price") {
      matchesOrdered.sort((a, b) => {
        return b?.buyerPost?.price - a?.buyerPost?.price
      })
    }
    if (value === "less-seller-price") {
      matchesOrdered.sort((a, b) => {
        return a?.sellerPost?.price - b?.sellerPost?.price
      })
    }
    if (value === "higher-seller-price") {
      matchesOrdered.sort((a, b) => {
        return b?.sellerPost?.price - a?.sellerPost?.price
      })
    }
    if (value === "newest") {
      matchesOrdered.sort((a, b) => {
        return new Date(a?.created_at) - new Date(b?.created_at)
      })
    }
    if (value === "oldest") {
      matchesOrdered.sort((a, b) => {
        return new Date(b?.created_at) - new Date(a?.created_at)
      })
    }
    // if (value === "active") {
    //   matchesOrdered.sort((a, b) => {
    //     return a?.is_active - b?.is_active
    //   })
    // }
    // if (value === "deactive") {
    //   matchesOrdered.sort((a, b) => {
    //     return b?.is_active - a?.is_active
    //   })
    // }
    // if (value === "disable") {
    //   matchesOrdered.sort((a, b) => {
    //     return a?.disable - b?.disable
    //   })
    // }
    // if (value === "enable") {
    //   matchesOrdered.sort((a, b) => {
    //     return b?.disable - a?.disable
    //   })
    // }
    setMatchesToShow(matchesOrdered)
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
                          categoriesToDisplay={categoryNamesToDisplay}
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
                          itemsToShow={buyerNamesToDisplay}
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
                          itemsToShow={sellerNamesToDisplay}
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
