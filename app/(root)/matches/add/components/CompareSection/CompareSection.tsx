import { createMatch } from "@/lib/actions/match.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllMatches, setMatchById } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface Props {
  categoryFilter: string
}

interface CompareResult {
  result: string
  amount: number
}

export default function CompareSection({ categoryFilter }: Props) {

  const dispatch = useDispatch()

  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { sellerPostToCompare, buyerPostToCompare } = useSelector((state: Store) => state.posts)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [createButtonHovered, setCreateButtonHovered] = useState(false)
  const [compareResult, setCompareResult] = useState<CompareResult>()
  const [newMatch, setNewMatch] = useState<CreateMatchParams>()
  const [matchCategory, setMatchCategory] = useState<Category>()
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/matches/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    const profit = Number(buyerPostToCompare?.price) - Number(sellerPostToCompare?.price)
    if (profit > 0) {
      setCompareResult({ result: "Profit", amount: profit })
    } else if (profit === 0) {
      setCompareResult({ result: "No Profit (Break-even)", amount: profit })
    } else {
      setCompareResult({ result: "Loss", amount: profit })
    }
    setNewMatch({
      buyerPost: buyerPostToCompare?._id,
      sellerPost: sellerPostToCompare?._id,
      category: "",
      profit: 0
    })
  }, [buyerPostToCompare, sellerPostToCompare])

  useEffect(() => {
    const categoryForMatch = allCategories?.find(c => c?.name.toLowerCase() === categoryFilter?.toLowerCase())
    if (categoryForMatch) {
      setMatchCategory(categoryForMatch)
    }
  }, [categoryFilter])

  function handleMatchDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target
    setNewMatch(prevState => {
      if (prevState) {
        return {
          ...prevState,
          description: value
        }
      } else {
        return {
          description: value,
          buyerPost: "",
          sellerPost: "",
          category: "",
          profit: 0
        }
      }
    })
  }

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      buyerPostToCompare?._id &&
      sellerPostToCompare?._id &&
      matchCategory?._id &&
      compareResult?.amount
    ) {
      const matchAlreadyExist = [...(allMatches || [])].find(m =>
        m?.buyerPost === buyerPostToCompare?._id?.toString() &&
        m?.sellerPost === sellerPostToCompare?._id?.toString() &&
        m?.category === matchCategory?._id?.toString()
      )
      if (matchAlreadyExist) {
        const buyerExistingMatch = allBuyers?.find(b => b?._id?.toString() === buyerPostToCompare?.buyer)
        const sellerExistingMatch = allSellers?.find(s => s?._id?.toString() === sellerPostToCompare?.seller)
        dispatch(setFooterMessage({ message: `There is already a match with Seller: > ${sellerExistingMatch?.name} - $ ${sellerPostToCompare?.price?.toLocaleString()} < Buyer: > ${buyerExistingMatch?.name} - $ ${buyerPostToCompare?.price?.toLocaleString()} < for Category: ${matchCategory?.name}.`, status: 409 }))
        return
      } else {
        const newMatchToDispatch = {
          ...newMatch,
          buyerPost: buyerPostToCompare?._id,
          sellerPost: sellerPostToCompare?._id,
          category: matchCategory?._id,
          profit: compareResult?.amount
        }
        const createdMatch = await createMatch(newMatchToDispatch)
        if (createdMatch) {
          const { message, status, object }: { message: string, status: number, object: Client | null } = createdMatch
          if (status === 201) {
            const allMatchesCopy = structuredClone(allMatches || [])
            dispatch(setAllMatches([...allMatchesCopy, object]))
            dispatch(setMatchById(object))
            setExecuteRedirect(true)
          }
          dispatch(setFooterMessage({ message, status }))
        }
      }
    } else {
      dispatch(setFooterMessage({ message: `Data missing.`, status: 409 }))
    }
  }

  return (
    <div className="flex flex-col w-full p-3">

      <div className="w-full flex">
        <div className="w-1/2">
          <div className="text-lg p-2">
            Seller
          </div>

          {
            !sellerPostToCompare
              ? "Please, select a Seller"
              : <div className="">
                <div>
                  Category: {allCategories?.find(c => c._id?.toString() === sellerPostToCompare?.category)?.name}
                </div>
                <div>
                  Name: {allSellers?.find(s => s?._id?.toString() === sellerPostToCompare?.seller)?.name}
                </div>
                <div>
                  Price: $ {sellerPostToCompare?.price}
                </div>
              </div>
          }
        </div>

        <div className="w-1/2">
          <div className="text-lg p-2">
            Buyer
          </div>

          {
            !buyerPostToCompare
              ? "Please, select a Buyer"
              : <div className="">
                <div>
                  Category: {allCategories?.find(c => c._id?.toString() === buyerPostToCompare?.category)?.name}
                </div>
                <div>
                  Name: {allBuyers?.find(b => b?._id?.toString() === buyerPostToCompare?.buyer)?.name}
                </div>
                <div>
                  Price: $ {buyerPostToCompare?.price}
                </div>
              </div>
          }
        </div>
      </div>

      {
        sellerPostToCompare && buyerPostToCompare && (
          <form action="" onSubmit={handleOnSubmit}>
            <div className="border flex justify-around mt-3">
              <div className="w-1/2">
                <div className="text-lg p-2">
                  Compare
                </div>
                <div>
                  {compareResult?.result}: $ {compareResult?.amount}
                </div>
              </div>
              <div className="w-1/2">
                <div
                  onMouseOver={() => setCreateButtonHovered(true)}
                  onMouseLeave={() => setCreateButtonHovered(false)}
                  className="relative text-lg p-2"
                >

                  <button
                    className={`border rounded py-1 px-3 ${(compareResult?.amount || 0) <= 0 ? "bg-gray-400" : "bg-green-600"}`}
                    disabled={(compareResult?.amount || 0) <= 0}
                  >
                    {
                      (compareResult?.amount || 0) <= 0 && createButtonHovered
                        ? "No Profit"
                        : "Create Match"
                    }
                  </button>

                </div>
                <div className="flex flex-col">
                  <div className="py-2">
                    <label htmlFor="">
                      Add a description
                    </label>
                  </div>
                  <div className="px-3">
                    <textarea
                      onChange={(e) => handleMatchDescription(e)}
                      className="w-full px-1 rounded"
                      name="description"
                      id=""
                      cols={10}
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )
      }
    </div>
  )
}
