'use client'

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBuyerPostToCompare, setSellerPostToCompare } from "@/lib/redux/slices/postsSlice/postsSlice"
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

  const postsToRenderRef = useRef<Post[]>()
  const [postsToRender, setPostsToRender] = useState<Post[]>()
  const [orderByChecked, setOrderByChecked] = useState("")
  const [namesToDisplay, setNamesToDisplay] = useState<string[]>([])
  const [postsByCategory, setPostsByCategory] = useState<Post[]>()

  useEffect(() => {
    if (categoryFilter) {
      const postsCopy = structuredClone(posts || [])

      const categoryForFilter = allCategories?.find(c => c?.name === categoryFilter)

      const postsFilsteredByCategory = postsCopy?.filter(p => p?.category === categoryForFilter?._id?.toString())

      setPostsByCategory(postsFilsteredByCategory)
      setPostsToRender(postsFilsteredByCategory)
      postsToRenderRef.current = postsFilsteredByCategory

      const uniquePostIds = new Set(postsFilsteredByCategory.map(p => p?.[ownerType as keyof Post]))
      const uniquePostIdsArray = Array.from(uniquePostIds)

      const postNames: string[] = []

      if (ownerType === "seller") {
        for (const eachSeller of allSellers) {
          if (uniquePostIdsArray?.includes(eachSeller?._id?.toString())) {
            postNames.push(eachSeller?.name)
          }
        }
      }
      if (ownerType === "buyer") {
        for (const eachBuyer of allBuyers) {
          if (uniquePostIdsArray?.includes(eachBuyer?._id?.toString())) {
            postNames.push(eachBuyer?.name)
          }
        }
      }
      const uniqueSortedPostNames = postNames.sort((a, b) => {
        return a?.toLowerCase().localeCompare(b?.toLowerCase())
      })
      setNamesToDisplay(uniqueSortedPostNames)
    }
    setOrderByChecked("")
  }, [categoryFilter, ownerType])

  function handleSetToCompare(e: React.MouseEvent<HTMLButtonElement>) {
    const { name, value } = e.currentTarget as HTMLButtonElement
    if (name === "seller") {
      const sellerPostToCompare = posts?.find(p => p?._id.toString() === value)
      dispatch(setSellerPostToCompare(sellerPostToCompare))
    }
    if (name === "buyer") {
      const buyerPostToCompare = posts?.find(p => p?._id.toString() === value)
      dispatch(setBuyerPostToCompare(buyerPostToCompare))
    }
  }

  function handleOrderBy(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target
    if (checked) {
      const postsOrdered = [...(postsToRender || [])]
      setOrderByChecked(value)

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
      }

      if (value === "Lower") {
        postsOrdered.sort((a, b) => {
          return Number(a?.price) - Number(b?.price)
        })
      }

      if (value === "Higher") {
        postsOrdered.sort((a, b) => {
          return Number(b?.price) - Number(a?.price)
        })
      }
      // }
      setPostsToRender(postsOrdered)
    }
  }

  function handleFilterByName(value: string) {
    if (value) {

      let findOwner: Client | undefined = undefined

      if (ownerType === "seller") {
        findOwner = allSellers?.find(s => s?.name === value)
      }

      if (ownerType === "buyer") {
        findOwner = allBuyers?.find(b => b?.name === value)
      }

      if (findOwner) {
        const postsToRenderRefCopy = structuredClone(postsToRenderRef?.current || [])

        const postsFilsteredByCategory = postsToRenderRefCopy?.filter(p => p?.[ownerType as keyof Post] === findOwner?._id?.toString())
        setPostsToRender(postsFilsteredByCategory)
      }

    } else {
      setPostsToRender([...(postsByCategory || [])])
      setOrderByChecked("")
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
              name={`order-by-${ownerType}`}
              type="radio"
              value="A-Z"
              onChange={(e) => handleOrderBy(e)}
              checked={orderByChecked === "A-Z"}
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
              name={`order-by-${ownerType}`}
              type="radio"
              value="Z-A"
              onChange={(e) => handleOrderBy(e)}
              checked={orderByChecked === "Z-A"}
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
              name={`order-by-${ownerType}`}
              type="radio"
              value="Lower"
              onChange={(e) => handleOrderBy(e)}
              checked={orderByChecked === "Lower"}
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
              name={`order-by-${ownerType}`}
              type="radio"
              value="Higher"
              onChange={(e) => handleOrderBy(e)}
              checked={orderByChecked === "Higher"}
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
