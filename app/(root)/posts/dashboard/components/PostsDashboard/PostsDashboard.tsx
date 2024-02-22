import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { IconArrowNarrowDown, IconArrowNarrowUp, IconExternalLink, IconRefresh } from "@tabler/icons-react"
import PostTableRow from "../PostTableRow/PostTableRow"
import PostsInput from "../PostsInput/PostsInput"
import { getAllPosts, getPostById } from "@/lib/actions/post.actions"
import { setAllPosts } from "@/lib/redux/slices/postsSlice/postsSlice"
import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"
import BuyersInput from "../BuyersInput/BuyersInput"
import Link from "next/link"
import SellersInput from "@/app/(root)/sellers/dashboard/components/SellersInput/SellersInput"

interface FilterBy {
  category?: string
  name?: string
}

export default function PostsDashboard() {

  const dispatch = useDispatch()

  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  // const [buyerPosts, setBuyerPosts] = useState([...(allPosts || [])].filter(p => p?.buyer))
  // const [buyerPosts, setBuyerPosts] = useState<Post[]>()
  const buyerPosts = useRef<Post[]>()
  const [buyerCategoryNames, setBuyerCategoryNames] = useState<string[]>()
  const [buyerPostsToShow, setBuyerPostsToShow] = useState<Post[]>()
  const [buyerNames, setBuyerNames] = useState<string[]>()
  const [buyersFilterBy, setBuyersFilterBy] = useState<FilterBy>()

  // const [sellerPosts, setSellersPosts] = useState([...(allPosts || [])].filter(p => p?.seller))
  // const [sellerPosts, setSellersPosts] = useState<Post[]>()
  const sellerPosts = useRef<Post[]>()
  const [sellerCategoryNames, setSellerCategoryNames] = useState<string[]>()
  const [sellerPostsToShow, setSellersPostsToShow] = useState<Post[]>()
  const [sellerNames, setSellerNames] = useState<string[]>()
  const [sellersFilterBy, setSellersFilterBy] = useState<FilterBy>()

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])

    const postsBuyers = allPostsCopy?.filter(p => p?.buyer)
    buyerPosts.current = postsBuyers
    setBuyerPostsToShow(postsBuyers)
    const buyerCategories = postsBuyers?.map(p => p?.category)
    const uniqueBuyerCategoryNames = new Set([...allCategories || []]?.map(c => {
      if (buyerCategories?.includes(c?._id?.toString())) return c?.name
    }))
    setBuyerCategoryNames(Array.from(uniqueBuyerCategoryNames))
    const postsBuyerIds = postsBuyers?.map(p => p?.buyer)
    const uniqueBuyerNames = new Set([...allBuyers || []].map(b => {
      if (postsBuyerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueBuyerNamesFiltered = Array.from(uniqueBuyerNames).filter(name => name !== undefined) as string[]
    setBuyerNames(uniqueBuyerNamesFiltered)
  }, [allPosts])

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])

    const postsSellers = allPostsCopy.filter(p => p?.seller)
    sellerPosts.current = postsSellers
    setSellersPostsToShow(postsSellers)
    const sellerCategories = postsSellers?.map(s => s?.category)
    const uniqueSellerCategoryNames = new Set([...allCategories || []]?.map(c => {
      if (sellerCategories?.includes(c?._id?.toString())) return c?.name
    }))
    setSellerCategoryNames(Array.from(uniqueSellerCategoryNames))
    const postsSellerIds = postsSellers?.map(s => s?.seller)
    const uniqueSellerNames = new Set([...allSellers || []].map(b => {
      if (postsSellerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueSellerNamesFiltered = Array.from(uniqueSellerNames).filter(name => name !== undefined) as string[]
    setSellerNames(uniqueSellerNamesFiltered)
  }, [allPosts])

  async function handleGetAll() {
    const fetchAllPosts = await getAllPosts()
    dispatch(setAllPosts(fetchAllPosts))
  }

  async function handleSetById(id: string) {
    const fetchPostById = await getPostById(id)
  }

  useEffect(() => {
    let buyersFilteredBy = structuredClone(buyerPosts.current || [])
    if (buyersFilterBy?.category) {
      const findCategory = allCategories?.find(c => c?.name === sellersFilterBy?.category)
      buyersFilteredBy = buyersFilteredBy?.filter(p => p?.category === findCategory?._id?.toString())
    }
    const postsBuyerIds = buyersFilteredBy?.map(b => b?.buyer)
    const uniqueBuerNames = new Set([...allBuyers || []].map(b => {
      if (postsBuyerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueBuerNamesFilteredFiltered = Array.from(uniqueBuerNames).filter(name => name !== undefined) as string[]
    setSellerNames(uniqueBuerNamesFilteredFiltered)

    if (buyersFilterBy?.name) {
      const buyerByName = allBuyers?.find(s => s?.name === sellersFilterBy?.name)
      buyersFilteredBy = buyersFilteredBy?.filter(p => p?.seller === buyerByName?._id?.toString())
    }
    setBuyerPostsToShow(buyersFilteredBy)
  }, [buyersFilterBy])

  useEffect(() => {
    let sellersFilteredBy = structuredClone(sellerPosts.current || [])
    if (sellersFilterBy?.category) {
      // sellersFilteredBy = sellersFilteredBy?.filter(p => p?.category?.name.toLowerCase() === sellersFilterBy?.category?.toLowerCase())
      const findCategory = allCategories?.find(c => c?.name === sellersFilterBy?.category)
      sellersFilteredBy = sellersFilteredBy?.filter(p => p?.category === findCategory?._id?.toString())
    }
    const postsSellerIds = sellersFilteredBy?.map(s => s?.seller)
    const uniqueSellerNames = new Set([...allSellers || []].map(b => {
      if (postsSellerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueSellerNamesFiltered = Array.from(uniqueSellerNames).filter(name => name !== undefined) as string[]
    setSellerNames(uniqueSellerNamesFiltered)

    if (sellersFilterBy?.name) {
      const sellerByName = allSellers?.find(s => s?.name === sellersFilterBy?.name)
      sellersFilteredBy = sellersFilteredBy?.filter(p => p?.seller === sellerByName?._id?.toString())
    }
    setSellersPostsToShow(sellersFilteredBy)
  }, [sellersFilterBy])

  function handleFilterBuyersByCategory(value: string) {
    setBuyersFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  function handleFilterBuyersByName(value: string) {
    setBuyersFilterBy(prevState => {
      return {
        ...prevState,
        name: value
      }
    })
  }

  function handleFilterSellersByCategory(value: string) {
    setSellersFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  function handleFilterSellersByName(value: string) {
    setSellersFilterBy(prevState => {
      return {
        ...prevState,
        name: value
      }
    })
  }

  return (
    <div className="w-full h-full">

      <div className="text-center">
        <div className="py-2">
          <button
            className="border border-black py-1 px-2"
            onClick={() => handleGetAll()}
          >
            Get All Posts
          </button>
        </div>
      </div>

      <div className="flex justify-around">
        <div className="w-2/5 border p-2">
          <div className="text-center text-[20px] py-1">
            Buyer Posts - {buyerPostsToShow?.length}
          </div>
          <div className="flex justify-center">
            <div className="w-[250px]">
              <CategoriesInput
                handleFilter={handleFilterBuyersByCategory}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[250px]">
              <BuyersInput
                handleFilter={handleFilterBuyersByName}
              />
            </div>
          </div>
          <div className="px-2 py-1">
            {
              buyerPostsToShow?.map(p => {
                const postMatches = [...(allMatches || [])].filter(m => m?.buyerPost?._id.toString() === p?._id.toString()).length
                return (
                  <div
                    key={p?._id}
                    className="flex border p-2 items-center"
                  >
                    <div>
                      <Link
                        onClick={() => handleSetById(p?._id)}
                        href="/posts/search-posts"
                      >
                        <IconExternalLink className="m-1" />
                      </Link>
                    </div>
                    <div>
                      {`${p?.category?.name} - ${p?.buyer?.name} - $ ${p?.price.toLocaleString()} - ${postMatches} matches`}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className="w-2/5 border p-2">
          <div className="text-center text-[20px] py-1">
            Seller Posts - {sellerPostsToShow?.length}
          </div>
          <div className="flex justify-center">
            <div className="w-[250px]">
              <CategoriesInput
                handleFilter={handleFilterSellersByCategory}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[250px]">
              <SellersInput
                handleFilter={handleFilterSellersByName}
              />
            </div>
          </div>
          <div className="px-2 py-1">
            {
              sellerPostsToShow?.map(p => {
                const postMatches = [...(allMatches || [])].filter(m => m?.sellerPost?._id.toString() === p?._id.toString()).length
                return (
                  <div
                    key={p?._id}
                    className="flex border p-2 items-center"
                  >
                    <div>
                      <Link
                        onClick={() => handleSetById(p?._id)}
                        href="/posts/search-posts"
                      >
                        <IconExternalLink className="m-1" />
                      </Link>
                    </div>
                    <div>
                      {`${p?.category?.name} - ${p?.seller?.name} - $ ${p?.price} - ${postMatches} matches`}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

      </div>

    </div >
  )
}
