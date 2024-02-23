import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface Props {
  categoryFilter: string
}

export default function CompareSection({ categoryFilter }: Props) {

  const dispatch = useDispatch()

  const {allMatches}:{allMatches: Match[]} = useSelector((state: Store) => state.matches)
  const {sellerPostToCompare, buyerPostToCompare} = useSelector((state: Store) => state.posts)
  const {allCategories}:{allCategories: Category[]} = useSelector((state: Store) => state.categories)

  const [createButtonHovered, setCreateButtonHovered] = useState(false)
  const [compareResult, setCompareResult] = useState({})
  const [newMatch, setNewMatch] = useState<CreateMatchParams>()
  const [matchCategory, setMatchCategory] = useState<Category>()

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
    setMatchCategory(categoryForMatch)
  }, [categoryFilter])

  function handleMatchDescription(e) {
    const { value } = e.target
    setNewMatch(prevState => {
      return {
        ...prevState,
        description: value
      }
    })
  }

  function handleOnSubmit(e) {
    const matchAlreadyExist = [...(allMatches || [])].find(m =>
      m?.buyerPost?._id?.toString() === buyerPostToCompare?._id?.toString() &&
      m?.sellerPost?._id?.toString() === sellerPostToCompare?._id?.toString() &&
      m?.category?._id?.toString() === matchCategory?._id?.toString()
    )
    if (matchAlreadyExist) {
      e.preventDefault()
      dispatch(setFooterMessage({ message: `There is already a match with Buyer: > ${buyerPostToCompare?.buyer?.name} < Seller: > ${sellerPostToCompare?.seller?.name} < for Category: ${matchCategory?.name}.`, status: 409 }))

    } else {
      const newMatchToDispatch = {
        ...newMatch,
        buyerPost: buyerPostToCompare?._id,
        sellerPost: sellerPostToCompare?._id,
        category: matchCategory?._id,
        profit: compareResult?.amount
      }
      dispatch(createMatch(newMatchToDispatch))
    }
  }
  // console.log(newMatch)

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
                  Category: {sellerPostToCompare?.category?.name}
                </div>
                <div>
                  Name: {sellerPostToCompare?.seller?.name}
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
                  Category: {buyerPostToCompare?.category?.name}
                </div>
                <div>
                  Name: {buyerPostToCompare?.buyer?.name}
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
          <form action="" onSubmit={(e) => handleOnSubmit(e)}>
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
                    className={`border rounded py-1 px-3 ${compareResult?.amount <= 0 ? "bg-gray-400" : "bg-green-600"}`}
                    disabled={compareResult?.amount <= 0}
                  >
                    {
                      compareResult?.amount <= 0 && createButtonHovered
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
                      className="w-full px-1"
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
