'use client'

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSellerPostToCompare } from "@/lib/redux/slices/postsSlice/postsSlice"
import FilterPostByOwnerInput from "../FilterPostByOwnerInput/FilterPostByOwnerInput"

interface Props {
  posts: Post[]
  categoryFilter: string
  ownerType: string
}

export default function ComparePostsList({ posts, categoryFilter, ownerType }: Props) {

  const dispatch = useDispatch()

  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)

  const [postsToRender, setPostsToRender] = useState<Post[]>()
  const [alphabeticInputChecked, setAlphabeticInputChecked] = useState("")
  const [amountInputChecked, setAmountInputChecked] = useState("")
  const [namesToDisplay, setNamesToDisplay] = useState<string[]>()
  const [postsByCategory, setPostsByCategory] = useState<Post[]>()

  useEffect(() => {
    if (categoryFilter) {
      const postsCopy = structuredClone(posts || [])

      const categoryForFilter = allCategories?.find(c => c?.name === categoryFilter)

      const postsFilsteredByCategory = postsCopy?.filter(p => p?.category === categoryForFilter?._id?.toString())

      setPostsByCategory(postsFilsteredByCategory)
      setPostsToRender(postsFilsteredByCategory)

      const uniquePostIds = new Set(postsFilsteredByCategory.map(p => p?.[ownerType as keyof Post]))
      const uniquePostIdsArray = Array.from(uniquePostIds)

      const postNames: string[] = []

      if (ownerType === "seller") {
        [...(allSellers || [])].map(s => {
          if (uniquePostIdsArray?.includes(s?._id?.toString())) {
            postNames.push(s?.name)
          }
        })
      }
      if (ownerType === "buyer") {
        [...(allBuyers || [])].map(b => {
          if (uniquePostIdsArray?.includes(b?._id?.toString())) {
            postNames.push(b?.name)
          }
        })
      }
      const uniqueSortedPostNames = postNames.sort((a, b) => {
        return a?.toLowerCase().localeCompare(b?.toLowerCase())
      })
      setNamesToDisplay(uniqueSortedPostNames)
    }
    setAlphabeticInputChecked("")
    setAmountInputChecked("")
  }, [categoryFilter, ownerType])

  function handleSetToCompare(e: React.MouseEvent<HTMLButtonElement>) {
    const { name, value } = e.currentTarget as HTMLButtonElement
    if (name === "seller") {
      const sellerPostToCompare = posts?.find(p => p?._id.toString() === value)
      dispatch(setSellerPostToCompare(sellerPostToCompare))
    }
    if (name === "buyer") {
      const buyerPostToCompare = posts?.find(p => p?._id.toString() === value)
      dispatch(setSellerPostToCompare(buyerPostToCompare))
    }
  }

  function handleOrderBy(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target
    if (checked) {
      const postsOrdered = [...(postsToRender || [])]
      if (name === `${ownerType}-alphabetical`) {
        if (value === "A-Z") {
          postsOrdered.sort((a, b) => {
            let postA
            let postB
            if (ownerType === "seller") {
              postA = allSellers?.find(s => s?._id?.toString() === a?.seller)
              postB = allSellers?.find(s => s?._id?.toString() === b?.seller)
            }
            if (ownerType === "buyer") {
              postA = allBuyers?.find(s => s?._id?.toString() === a?.buyer)
              postB = allBuyers?.find(s => s?._id?.toString() === b?.buyer)
            }
            if (postA && postB) {
              return postA.name.localeCompare(postB.name) || 0
            }
            return 0
          })
          setAlphabeticInputChecked(value)
        }
        if (value === "Z-A") {
          postsOrdered.sort((a, b) => {
            let postA
            let postB
            if (ownerType === "seller") {
              postA = allSellers?.find(s => s?._id?.toString() === a?.seller)
              postB = allSellers?.find(s => s?._id?.toString() === b?.seller)
            }
            if (ownerType === "buyer") {
              postA = allBuyers?.find(s => s?._id?.toString() === a?.buyer)
              postB = allBuyers?.find(s => s?._id?.toString() === b?.buyer)
            }
            if (postA && postB) {
              return postB.name.localeCompare(postA.name) || 0
            }
            return 0
          })
          setAlphabeticInputChecked(value)
        }
      }
      if (name === `${ownerType}-amount`) {
        if (value === "Lower") {
          postsOrdered.sort((a, b) => {
            return Number(a?.price) - Number(b?.price)
          })
          setAmountInputChecked(value)
        }
        if (value === "Higher") {
          postsOrdered.sort((a, b) => {
            return Number(b?.price) - Number(a?.price)
          })
          setAmountInputChecked(value)
        }
      }
      setPostsToRender(postsOrdered)
    }
  }

  function handleFilterByName(value: string) {
    if (value) {
      const categoryForFilter = allCategories?.find(c => c?.name === value)
      const postsFilsteredByCategory = [...(postsByCategory || [])].filter(p => p?.[ownerType as keyof Post] === categoryForFilter?._id?.toString())
      setPostsToRender(postsFilsteredByCategory)
    } else {
      setPostsToRender([...(postsByCategory || [])])
      setAlphabeticInputChecked("")
      setAmountInputChecked("")
    }
  }

  return (
    <div className="w-full max-w-xs text-center border-2">

      <div className="w-full flex justify-around py-1">
        {
          categoryFilter
            ? <div>
              {`Category: ${categoryFilter}`}
            </div>
            : ""
        }
        <div>
          {`${postsToRender?.length} posts`}
        </div>
      </div>

      <div>
        <FilterPostByOwnerInput
          ownerType={ownerType}
          namesToDisplay={namesToDisplay}
          handleFilterByName={handleFilterByName}
          categoryFilter={categoryFilter}
        />
      </div>

      <div className="flex justify-around flex-wrap">
        <div>
          <div>
            <input
              id={`${ownerType}-alphabetical-order-A-Z`}
              name={`${ownerType}-alphabetical`}
              type="radio"
              value="A-Z"
              onChange={(e) => handleOrderBy(e)}
              checked={alphabeticInputChecked === "A-Z"}
            />
            <label
              htmlFor={`${ownerType}-alphabetical-order-A-Z`}
              className="px-2"
            >
              A-Z
            </label>
          </div>
          <div>
            <input
              id={`${ownerType}-alphabetical-order-Z-A`}
              name={`${ownerType}-alphabetical`}
              type="radio"
              value="Z-A"
              onChange={(e) => handleOrderBy(e)}
              checked={alphabeticInputChecked === "Z-A"}
            />
            <label
              htmlFor={`${ownerType}-alphabetical-order-Z-A`}
              className="px-2"
            >
              Z-A
            </label>
          </div>
        </div>

        <div>
          <div>
            <input
              id={`${ownerType}-amount-order-lower`}
              name={`${ownerType}-amount`}
              type="radio"
              value="Lower"
              onChange={(e) => handleOrderBy(e)}
              checked={amountInputChecked === "Lower"}
            />
            <label
              htmlFor={`${ownerType}-amount-order-lower`}
              className="px-2"
            >
              Lower
            </label>
          </div>
          <div>
            <input
              id={`${ownerType}-amount-order-higher`}
              name={`${ownerType}-amount`}
              type="radio"
              value="Higher"
              onChange={(e) => handleOrderBy(e)}
              checked={amountInputChecked === "Higher"}
            />
            <label
              htmlFor={`${ownerType}-amount-order-higher`}
              className="px-2"
            >
              Higher
            </label>
          </div>
        </div>
      </div>

      <div className="list-container">
        {
          postsToRender?.map(p => {
            let client
            if (ownerType === "seller") {
              client = allSellers?.find(s => s?._id?.toString() === p?.seller)
            }
            if (ownerType === "buyer") {
              client = allBuyers?.find(s => s?._id?.toString() === p?.buyer)
            }
            return (
              <button
                key={p?._id}
                className={`w-full py-2 border ${p?.seller ? "bg-red-400 text-red-950" : "bg-blue-400 text-blue-950"}`}
                value={p?._id}
                name={p?.seller ? "seller" : "buyer"}
                onClick={(e) => handleSetToCompare(e)}
              >
                {client?.name} - $ {p?.price}
              </button>
            )
          })
        }
      </div>
    </div>
  )
}
