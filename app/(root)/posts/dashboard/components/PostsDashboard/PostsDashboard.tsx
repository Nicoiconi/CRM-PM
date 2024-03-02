import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { IconCaretDownFilled, IconExternalLink } from "@tabler/icons-react"
import { getAllPosts } from "@/lib/actions/post.actions"
import { setAllPosts, setPostById } from "@/lib/redux/slices/postsSlice/postsSlice"
import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"
import BuyersInput from "@/components/shared/BuyersInput/BuyersInput"
import SellersInput from "@/components/shared/SellersInput/SellersInput"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { IconCaretUpFilled } from "@tabler/icons-react"

interface FilterBy {
  category?: string
  name?: string
  is_active?: string
  disabled?: string
  [key: string]: string | boolean | undefined
}

export default function PostsDashboard() {

  const dispatch = useDispatch()

  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const buyerPosts = useRef<Post[]>()
  // const [buyerCategoryNames, setBuyerCategoryNames] = useState<string[]>()
  const [buyerPostsToShow, setBuyerPostsToShow] = useState<Post[]>()
  const [buyerNames, setBuyerNames] = useState<string[]>()
  const [buyerPostsFilterBy, setBuyerPostsFilterBy] = useState<FilterBy>()

  const sellerPosts = useRef<Post[]>()
  // const [sellerCategoryNames, setSellerCategoryNames] = useState<string[]>()
  const [sellerPostsToShow, setSellersPostsToShow] = useState<Post[]>()
  const [sellerNames, setSellerNames] = useState<string[]>()
  const [sellerPostsFilterBy, setSellerPostsFilterBy] = useState<FilterBy>()

  const [hideBuyerPosts, setHideBuyerPosts] = useState(false)
  const [hideSellerPosts, setHideSellerPosts] = useState(false)

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])

    const postsBuyers = allPostsCopy?.filter(p => p?.buyer)
    buyerPosts.current = postsBuyers
    setBuyerPostsToShow(postsBuyers)

    const postsBuyerIds = postsBuyers?.map(p => p?.buyer)
    const uniqueBuyerNames = new Set([...allBuyers || []].map(b => {
      if (postsBuyerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueBuyerNamesFiltered = Array.from(uniqueBuyerNames).filter(name => name !== undefined) as string[]
    setBuyerNames(uniqueBuyerNamesFiltered)
  }, [allBuyers, allCategories, allPosts])

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])

    const postsSellers = allPostsCopy.filter(p => p?.seller)
    sellerPosts.current = postsSellers
    setSellersPostsToShow(postsSellers)

    const postsSellerIds = postsSellers?.map(s => s?.seller)
    const uniqueSellerNames = new Set([...allSellers || []].map(b => {
      if (postsSellerIds?.includes(b?._id?.toString())) return b?.name
    }))
    const uniqueSellerNamesFiltered = Array.from(uniqueSellerNames).filter(name => name !== undefined) as string[]
    setSellerNames(uniqueSellerNamesFiltered)
  }, [allSellers, allCategories, allPosts])

  async function handleGetAll() {
    const fetchAllPosts = await getAllPosts()
    if (fetchAllPosts) {
      const { message, status, object }: { message: string, status: number, object: Client | null } = fetchAllPosts
      if (status === 200) {
        dispatch(setAllPosts(object))
      }
      dispatch(setFooterMessage({ message, status }))
    }
  }

  async function handleSetById(id: string) {
    const findPostById = allPosts?.find(p => p?._id?.toString() === id)
    if (findPostById) {
      dispatch(setPostById(findPostById))
    }
  }

  useEffect(() => {
    let buyerPostsFilteredBy = structuredClone(buyerPosts.current || [])

    if (buyerPostsFilterBy?.category) {
      const findCategory = allCategories?.find(c => c?.name === buyerPostsFilterBy?.category)
      buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(p => p?.category === findCategory?._id?.toString())

      const postsBuyerIds = buyerPostsFilteredBy?.map(pb => pb?.buyer)
      const uniqueBuyerNames = new Set([...allBuyers || []].map(b => {
        if (postsBuyerIds?.includes(b?._id?.toString())) return b?.name
      }))
      const uniqueBuyerNamesArray = Array.from(uniqueBuyerNames).filter(name => name !== undefined) as string[]
      setBuyerNames(uniqueBuyerNamesArray)
    }

    if (!buyerPostsFilterBy?.category) {
      const postsBuyerIds = buyerPostsFilteredBy?.map(pb => pb?.buyer)
      const uniqueBuyerNames = new Set([...allBuyers || []].map(b => {
        if (postsBuyerIds?.includes(b?._id?.toString())) return b?.name
      }))
      const uniqueBuyerNamesArray = Array.from(uniqueBuyerNames).filter(name => name !== undefined) as string[]
      setBuyerNames(uniqueBuyerNamesArray)
    }

    if (buyerPostsFilterBy?.name) {
      const buyerByName = allBuyers?.find(b => b?.name === buyerPostsFilterBy?.name)
      buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(p => p?.buyer === buyerByName?._id?.toString())
    }

    if (buyerPostsFilterBy?.disabled) {
      if (buyerPostsFilterBy?.disabled === "enabled") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => !b?.disabled)
      }
      if (buyerPostsFilterBy?.disabled === "disabled") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => b?.disabled)
      }
      if (buyerPostsFilterBy?.disabled === "all") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => !b?.disabled || b?.disabled)
      }
    }

    if (buyerPostsFilterBy?.is_active) {
      if (buyerPostsFilterBy?.is_active === "active") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => b?.is_active)
      }
      if (buyerPostsFilterBy?.is_active === "inactive") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => !b?.is_active)
      }
      if (buyerPostsFilterBy?.is_active === "all") {
        buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(b => !b?.is_active || b?.is_active)
      }
    }

    setBuyerPostsToShow(buyerPostsFilteredBy)
  }, [allBuyers, allCategories, buyerPostsFilterBy])

  useEffect(() => {
    let sellerPostsFilteredBy = structuredClone(sellerPosts.current || [])

    if (sellerPostsFilterBy?.category) {
      const findCategory = allCategories?.find(c => c?.name === sellerPostsFilterBy?.category)
      sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(p => p?.category === findCategory?._id?.toString())

      const postsSellerIds = sellerPostsFilteredBy?.map(s => s?.seller)
      const uniqueSellerNames = new Set([...allSellers || []].map(b => {
        if (postsSellerIds?.includes(b?._id?.toString())) return b?.name
      }))
      const uniqueSellerNamesArray = Array.from(uniqueSellerNames).filter(name => name !== undefined) as string[]
      setSellerNames(uniqueSellerNamesArray)
    }

    if (!sellerPostsFilterBy?.category) {
      const postsSellerIds = sellerPostsFilteredBy?.map(s => s?.seller)
      const uniqueSellerNames = new Set([...allSellers || []].map(s => {
        if (postsSellerIds?.includes(s?._id?.toString())) return s?.name
      }))
      const uniqueSellerNamesArray = Array.from(uniqueSellerNames).filter(name => name !== undefined) as string[]
      setSellerNames(uniqueSellerNamesArray)
    }

    if (sellerPostsFilterBy?.name) {
      const sellerByName = allSellers?.find(s => s?.name === sellerPostsFilterBy?.name)
      sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(p => p?.seller === sellerByName?._id?.toString())
    }

    if (sellerPostsFilterBy?.disabled) {
      if (sellerPostsFilterBy?.disabled === "enabled") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => !s?.disabled)
      }
      if (sellerPostsFilterBy?.disabled === "disabled") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => s?.disabled)
      }
      if (sellerPostsFilterBy?.disabled === "all") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => !s?.disabled || s?.disabled)
      }
    }

    if (sellerPostsFilterBy?.inactive) {
      if (sellerPostsFilterBy?.is_active === "active") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => s?.is_active)
      }
      if (sellerPostsFilterBy?.is_active === "inactive") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => !s?.is_active)
      }
      if (sellerPostsFilterBy?.is_active === "all") {
        sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(s => !s?.is_active || s?.is_active)
      }
    }

    setSellersPostsToShow(sellerPostsFilteredBy)
  }, [allSellers, allCategories, sellerPostsFilterBy])

  function handleFilterPostsByCategory(value: string) {
    setBuyerPostsFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
    setSellerPostsFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  function handleFilterBuyersByName(value: string) {
    setBuyerPostsFilterBy(prevState => {
      return {
        ...prevState,
        name: value
      }
    })
  }

  function handleFilterSellersByName(value: string) {
    setSellerPostsFilterBy(prevState => {
      return {
        ...prevState,
        name: value
      }
    })
  }

  function handleFilterBuyersByBooleans(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setBuyerPostsFilterBy(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  function handleFilterSellersByBooleans(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setSellerPostsFilterBy(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  function handleHideBuyerPosts(value: boolean) {
    setHideBuyerPosts(value)
  }

  function handleHideSellerPosts(value: boolean) {
    setHideSellerPosts(value)
  }


  return (
    <div className="w-full">

      <div className="flex-center gap-6 text-center py-5">
        <div className="w-[250px]">
          <CategoriesInput
            handleFilter={handleFilterPostsByCategory}
            specificCategoryNames={undefined}
          />
        </div>
        <div className="py-2">
          <button
            className="border border-black py-1 px-2"
            onClick={() => handleGetAll()}
          >
            Get All Posts
          </button>
        </div>
      </div>

      <div className="flex justify-around flex-wrap gap-4">
        <div className="w-2/5 min-w-[400px] border p-2 h-fit">
          <div className="flex-center gap-6">
            <div className="text-center text-[20px] py-1">
              Buyer Posts - {buyerPostsToShow?.length}
            </div>

            <div className="flex-center bg-zinc-700 border-2 rounded border-slate-600">
              {
                hideBuyerPosts
                  ? <button
                    className="w-[30px] flex-center"
                    onClick={() => handleHideBuyerPosts(false)}
                  >
                    <IconCaretDownFilled />
                  </button>
                  : <button
                    className="w-[30px] flex-center"
                    onClick={() => handleHideBuyerPosts(true)}
                  >
                    <IconCaretUpFilled />
                  </button>
              }
            </div>
          </div>

          <div className={hideBuyerPosts ? "hidden" : ""}>
            <div className="flex justify-center">
              <div className="w-[250px]">
                <BuyersInput
                  handleFilter={handleFilterBuyersByName}
                  buyerNames={buyerNames}
                />
              </div>
            </div>

            <div className="flex justify-around py-2">
              <select
                name="is_active"
                id=""
                onChange={(e) => handleFilterBuyersByBooleans(e)}
                className="w-[100px]"
                value={buyerPostsFilterBy?.is_active}
              >
                <option value="all">
                  All
                </option>
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
              </select>

              <select
                name="disabled"
                id=""
                // onChange={(e) => handleFilterBuyerPostsByBooleans(e)}
                className="w-[100px]"
              // value={buyerPostsFilterBy?.disabled}
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

            <div className="px-2 py-1">
              {
                buyerPostsToShow?.map(p => {
                  const postMatches = [...(allMatches || [])].filter(m => m?.buyerPost === p?._id.toString()).length
                  const currentPostBuyer = allBuyers?.find(b => b?._id?.toString() === p?.buyer)
                  const currentPostCategory = allCategories?.find(c => c?._id?.toString() === p?.category)
                  return (
                    <div
                      key={p?._id}
                      className="flex border p-2 items-center buyer-bg-color font-bold"
                    >
                      <div className="text-black">
                        <Link
                          onClick={() => handleSetById(p?._id)}
                          href={`/posts/dashboard/${p?._id}`}
                        >
                          <IconExternalLink className="m-1" />
                        </Link>
                      </div>

                      <div>
                        <div className="text-[16px] flex gap-2">
                          <div className={p?.is_active ? "text-green-400" : "text-zinc-800"}>
                            {p?.is_active ? "Active" : "Inactive"}
                          </div>
                          <div>
                            -
                          </div>
                          <div className={p?.disabled ? "text-zinc-800" : "text-green-400"}>
                            {p?.disabled ? "Disabled" : "Enabled"}
                          </div>
                        </div>

                        <div className="text-black text-[18px]">
                          {`${currentPostCategory?.name} - ${currentPostBuyer?.name} - $ ${p?.price.toLocaleString()} - ${postMatches} matches`}
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        <div className="w-2/5 min-w-[400px] border p-2 h-fit">
          <div className="flex-center gap-6">
            <div className="text-center text-[20px] py-1">
              Seller Posts - {sellerPostsToShow?.length}
            </div>

            <div className="flex-center bg-zinc-700 border-2 rounded border-slate-600">
              {
                hideSellerPosts
                  ? <button
                    className="w-[30px] flex-center"
                    onClick={() => handleHideSellerPosts(false)}
                  >
                    <IconCaretDownFilled />
                  </button>
                  : <button
                    className="w-[30px] flex-center"
                    onClick={() => handleHideSellerPosts(true)}
                  >
                    <IconCaretUpFilled />
                  </button>
              }
            </div>
          </div>

          <div className={hideSellerPosts ? "hidden" : ""}>
            <div className="flex justify-center">
              <div className="w-[250px]">
                <SellersInput
                  handleFilter={handleFilterSellersByName}
                  sellerNames={sellerNames}
                />
              </div>
            </div>

            <div className="flex justify-around py-2">
              <select
                name="is_active"
                id=""
                onChange={(e) => handleFilterSellersByBooleans(e)}
                className="w-[100px]"
                value={sellerPostsFilterBy?.is_active}
              >
                <option value="all">
                  All
                </option>
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
              </select>

              <select
                name="disabled"
                id=""
                onChange={(e) => handleFilterSellersByBooleans(e)}
                className="w-[100px]"
                value={sellerPostsFilterBy?.disabled}
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

            <div className="px-2 py-1">
              {
                sellerPostsToShow?.map(p => {
                  const postMatches = [...(allMatches || [])].filter(m => m?.sellerPost === p?._id.toString()).length
                  const currentPostSeller = allSellers?.find(s => s?._id?.toString() === p?.seller)
                  const currentPostCategory = allCategories?.find(c => c?._id?.toString() === p?.category)
                  return (
                    <div
                      key={p?._id}
                      className="flex border p-2 items-center seller-bg-color text-black text-[18px] font-bold"
                    >
                      <div>
                        <Link
                          onClick={() => handleSetById(p?._id)}
                          href={`/posts/dashboard/${p?._id}`}
                        >
                          <IconExternalLink className="m-1" />
                        </Link>
                      </div>

                      <div>
                        <div className="text-[16px] flex gap-2">
                          <div className={p?.is_active ? "text-green-400" : "text-zinc-800"}>
                            {p?.is_active ? "Active" : "Inactive"}
                          </div>
                          <div>
                            -
                          </div>
                          <div className={p?.disabled ? "text-zinc-800" : "text-green-400"}>
                            {p?.disabled ? "Disabled" : "Enabled"}
                          </div>
                        </div>

                        <div>
                          {`${currentPostCategory?.name} - ${currentPostSeller?.name} - $ ${p?.price} - ${postMatches} matches`}
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

      </div>

    </div >
  )
}
