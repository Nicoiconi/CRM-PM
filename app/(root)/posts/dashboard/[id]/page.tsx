"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { redirect, usePathname } from "next/navigation"
import { IconEdit, IconTrashX } from "@tabler/icons-react"
import { IconEditOff, IconRefresh } from "@tabler/icons-react"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllPosts, setPostById } from "@/lib/redux/slices/postsSlice/postsSlice"
import { deletePost, getPostById } from "@/lib/actions/post.actions"
import EditPostForm from "./components/EditPostForm/EditPostForm"
import SellersInput from "@/components/shared/SellersInput/SellersInput"
import BuyersInput from "@/components/shared/BuyersInput/BuyersInput"

interface FilterBy {
  category?: string
  min?: number
  MAX?: number
}

enum OrderBy {
  Lower,
  Higher,
  Newest,
  Oldest,
}

export default function PostByIdPage() {

  const dispatch = useDispatch()

  const pathname = usePathname()
  const postId = pathname?.split("/").pop()

  const { allPosts, singlePost }: { allPosts: Post[], singlePost: Post } = useSelector((state: Store) => state.posts)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  // const [singlePostToShow, setSinglePostToShow] = useState({ ...singlePost })
  const [singlePostToShow, setSinglePostToShow] = useState<Post>()
  // const [postMatches, setPostMatches] = useState<Match[]>()
  const postMatches = useRef<Match[]>()
  // const [postMatchesToShow, setPostMatchesToShow] = useState(
  //   singlePost?.buyer
  //     ? [...(allMatches || [])]?.filter(m => m?.buyerPost?._id.toString() === singlePost?._id.toString())
  //     : singlePost?.seller
  //       ? [...(allMatches || [])]?.filter(m => m?.sellerPost?._id.toString() === singlePost?._id.toString())
  //       : []
  // )
  const [postMatchesToShow, setPostMatchesToShow] = useState<Match[]>()
  const [namesToFilter, setNamesToFilter] = useState<string[]>()
  const [enableEdit, setEnableEdit] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterBy>()
  const [orderBy, setOrderBy] = useState({})
  const [enableDelete, setEnableDelete] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/posts/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (postId) {
      (async function handleGetById() {
        const singlePostSelected = await getPostById(postId)
        if (singlePostSelected) {
          const { message, status, object } = singlePostSelected
          if (status === 200) {
            dispatch(setFooterMessage({ message, status }))
            dispatch(setPostById(object))
            return
          }
        }
        console.log("hola")
        dispatch(setFooterMessage({ message: "Get Post failed", status: 409 }))
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  useEffect(() => {
    setSinglePostToShow(singlePost)
    const allMatchesCopy = structuredClone(allMatches || [])

    // if the owner of the post is a Buyer
    if (singlePost?.buyer) {
      // find all matches of post, in Match withh be buyerPost
      const matches = allMatchesCopy?.filter(m => m?.buyerPost === singlePost?._id.toString())
      postMatches.current = matches
      setPostMatchesToShow(matches)
    }
    // if the owner of the post is a Seller
    if (singlePost?.seller) {
      // find all matches of post, in Match withh be sellerPost
      const matches = allMatchesCopy?.filter(m => m?.sellerPost === singlePost?._id.toString())
      postMatches.current = matches
      setPostMatchesToShow(matches)
    }
    setEnableEdit(false)
  }, [allMatches, singlePost])

  useEffect(() => {
    // if the owner of the post is a Buyer
    const postMatchesCopy = structuredClone(postMatches?.current || [])

    // an empty string to store the names
    const names: string[] = []

    if (singlePost?.buyer) {

      // find all Seller names
      // get all sellerPost from the Matches of the Buyer singlePost
      const matchingSellerPosts = postMatchesCopy?.map(m => m?.sellerPost)

      // get all sellers from matching posts
      const allPostsCopy = structuredClone(allPosts || [])
      const matchingSellerIds = allPostsCopy?.filter(p => matchingSellerPosts?.includes(p?._id?.toString()))

      // an empty array store the names

      for (const eachSellerId of (matchingSellerIds || [])) {
        const findSeller = allSellers?.find(s => s?._id?.toString() === eachSellerId?.seller)
        if (findSeller && !names?.includes(findSeller?.name)) {
          names?.push(findSeller?.name)
        }
      }
    }

    // if the owner of the post is a Seller
    if (singlePost?.seller) {
      // const postMatchesCopy = structuredClone(postMatches?.current || [])

      // find all Buyer names
      // get all buyerPost from the Matches of the Buyer singlePost
      const matchingBuyerPosts = postMatchesCopy?.map(m => m?.buyerPost)

      // get all buyers from matching posts
      const allPostsCopy = structuredClone(allPosts || [])
      const matchingBuyerIds = allPostsCopy?.filter(p => matchingBuyerPosts?.includes(p?._id?.toString()))

      // const names: string[] = []

      for (const eachBuyerId of (matchingBuyerIds || [])) {
        const findBuyer = allBuyers?.find(s => s?._id?.toString() === eachBuyerId?.buyer)
        if (findBuyer && !names?.includes(findBuyer?.name)) {
          names?.push(findBuyer?.name)
        }
      }

      // const namesOrdered = names.sort((a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()))
      // setNamesToFilter(namesOrdered)
    }

    const namesOrdered = names.sort((a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()))
    setNamesToFilter(namesOrdered)
  }, [allPosts, allBuyers, allSellers, singlePost?.buyer, singlePost?.seller])

  async function handleRefresh() {
    // const refreshPost = [...(allPosts || [])].find(p => p?._id.toString() === singlePost?._id.toString())
    // setSinglePostToShow(refreshPost)
    if (postId) {
      const refreshBuyer = await getPostById(postId)
      if (refreshBuyer) {
        const { message, status, object }: { message: string, status: number, object: Client | null } = refreshBuyer
        if (status === 200) {
          const allBuyersCopy = structuredClone(allBuyers || [])
          const removeOldBuyer = allBuyersCopy?.filter(b => b?._id?.toString() !== singlePost?._id?.toString())
          dispatch(setPostById(object))
          dispatch(setAllPosts([...removeOldBuyer, object]))
        }
        dispatch(setFooterMessage({ message, status }))
      }
    }
  }

  function filterByRange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    if (value) {
      setFilterBy(prevState => {
        return {
          ...prevState,
          [name]: value
        }
      })
    }
  }

  function handleFilterMatchByName(value: string) {
    setFilterBy(prevState => {
      return {
        ...prevState,
        category: value
      }
    })
  }

  useEffect(() => {
    let postMatchesFilteredBy = [...(postMatches?.current || [])]
    // if (singlePostToShow?.buyer) {
    //   if (filterBy?.category) {
    //     postMatchesFilteredBy = postMatchesFilteredBy?.filter(m => m?.sellerPost?.seller?.name === filterBy?.category)
    //   }
    // }
    // if (singlePostToShow?.seller) {
    //   if (filterBy?.category) {
    //     postMatchesFilteredBy = postMatchesFilteredBy?.filter(m => m?.buyerPost?.buyer?.name === filterBy?.category)
    //   }
    // }
    if (filterBy?.category) {
      const findCategoryForFilter = allCategories?.find(c => c?.name === filterBy?.category)
      postMatchesFilteredBy = postMatchesFilteredBy?.filter(m => m?.category === findCategoryForFilter?._id?.toString())
    }
    if (filterBy?.min) {
      postMatchesFilteredBy = postMatchesFilteredBy?.filter(m => m?.profit >= Number(filterBy?.min))
    }
    if (filterBy?.MAX) {
      postMatchesFilteredBy = postMatchesFilteredBy?.filter(m => m?.profit <= Number(filterBy?.MAX))
    }

    setPostMatchesToShow(postMatchesFilteredBy)
  }, [allCategories, filterBy])
  // console.log(postMatches)

  function handleOrderBy(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const { value } = e.target as HTMLInputElement
    setOrderBy(value)
  }

  function parseDate(dateString: string): Date {
    const [day, month, year, time] = dateString.split(/[\/ :]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(time));
  }

  useEffect(() => {
    let postMatchesOrderBy = [...(postMatchesToShow || [])]
    if (OrderBy.Lower) {
      postMatchesOrderBy = postMatchesOrderBy.sort((a, b) => Number(a?.profit) - Number(b?.profit))
    }
    if (OrderBy.Higher) {
      postMatchesOrderBy = postMatchesOrderBy.sort((a, b) => Number(b?.profit) - Number(a?.profit))
    }
    if (OrderBy.Newest) {
      postMatchesOrderBy = postMatchesOrderBy.sort((a, b) => parseDate(b?.created_at).getTime() - parseDate(a?.created_at).getTime())
    }
    if (OrderBy.Oldest) {
      postMatchesOrderBy = postMatchesOrderBy.sort((a, b) => parseDate(a?.created_at).getTime() - parseDate(b?.created_at).getTime())
    }
    setPostMatchesToShow(postMatchesOrderBy)
    // }, [orderBy, postMatchesToShow]) infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy])


  function handleEnbaleEdit() {
    setEnableEdit(!enableEdit)
  }

  async function handleDeletePost() {
    const matchesPost = [...(allMatches || [])]?.filter(m =>
      (m?.buyerPost === singlePost?._id.toString() || m?.sellerPost === singlePost?._id.toString())).length
    if (matchesPost > 0) {
      dispatch(setFooterMessage({ message: `Cannot delete post, currently has > ${matchesPost} < matches.`, status: 409 }))
    } else {
      const deletedPost = await deletePost(singlePost?._id)
      if (deletedPost) {
        const { message, status }: { message: string, status: number } = deletedPost
        dispatch(setFooterMessage({ message, status }))
        if (status === 200) {
          const allPostsCopy = structuredClone(allPosts || [])
          const postRemoved = allPostsCopy?.filter(b => b?._id?.toString() !== singlePost?._id?.toString())
          dispatch(setAllPosts(postRemoved))
          dispatch(setPostById(null))
          setExecuteRedirect(true)
        }
      } else {
        dispatch(setFooterMessage({ message: "Failed delete post", status: 409 }))
      }
    }
  }

  function handleEnbaleDelete(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target
    if (checked) {
      setEnableDelete(true)
    } else {
      setEnableDelete(false)
    }
  }

  return (
    <div className="flex flex-wrap h-full border rounded-t-lg">
      <div className="w-auto min-w-[50%] flex flex-wrap text-[25px] p-3 gap-5">
        {
          !singlePost
            ? "There is no Buyer selected"
            : <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-wrap justify-between h-fit">
                <div className="flex gap-4">
                  <div className="text-[15px]">
                    {singlePostToShow?.disable ? "Disable" : "Enable"}
                  </div>
                  <div className="text-[15px]">
                    {singlePostToShow?.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="border-2 border-black rounded-[9999px]"
                    onClick={() => handleRefresh()}
                  >
                    <IconRefresh className="h-[32px] w-[32px]" />
                  </button>
                  {
                    enableEdit
                      ? <button
                        onClick={() => handleEnbaleEdit()}
                      >
                        <IconEditOff className="h-[35px] w-[35px]" />
                      </button>
                      : <button
                        onClick={() => handleEnbaleEdit()}
                      >
                        <IconEdit className="h-[35px] w-[35px]" />
                      </button>
                  }

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={handleEnbaleDelete}
                    />
                    <button
                      onClick={handleDeletePost}
                      disabled={!enableDelete}
                    >
                      <IconTrashX className={`h-[35px] w-[35px] ${enableDelete ? "text-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[25px]">
                <div className="">
                  {
                    singlePostToShow?.buyer
                      ? <>
                        Buyer: {allBuyers?.find(b => b?._id?.toString() === singlePostToShow?.buyer)?.name}
                      </>
                      : <>
                        Seller: {allSellers?.find(b => b?._id?.toString() === singlePostToShow?.seller)?.name}
                      </>
                  }
                </div>
              </div>

              <div className="text-[25px]">
                Category: {allCategories?.find(b => b?._id?.toString() === singlePostToShow?.category)?.name}
              </div>

              <div className="text-[25px]">
                $ {singlePostToShow?.price?.toLocaleString()}
              </div>

              <div className="text-[25px]">
                Matches: {postMatches?.current?.length}
              </div>

              <div className="text-[25px]">
                Description: {singlePost?.description}
              </div>

              {
                postMatches?.current?.length === 0
                  ? <div className="py-4 text-[24px]">
                    There are no matches for this post
                  </div>
                  : <>
                    <div className="w-full py-2 text-center items-center flex justify-around flex-wrap">
                      <div className="w-full flex flex-wrap justify-around">
                        <div className="w-[250px] px-4 py-2">
                          {
                            singlePostToShow?.buyer
                              ? <div className="w-[250px] px-4 py-2">
                                <SellersInput
                                  sellerNames={namesToFilter || []}
                                  handleFilter={handleFilterMatchByName}
                                />
                              </div>

                              : <BuyersInput
                                buyerNames={namesToFilter || []}
                                handleFilter={handleFilterMatchByName}
                              />
                          }
                        </div>
                        <div className="w-auto flex px-1 items-center flex-wrap justify-around">
                          <div className="flex py-1">
                            <div className="px-1 flex items-center">
                              <label
                                htmlFor="min-profit"
                              >
                                min:
                              </label>
                            </div>
                            <div className="px-1">
                              <input
                                name="min"
                                className="w-[75px] p-1"
                                id="min-profit"
                                type="number"
                                onChange={(e) => filterByRange(e)}
                              />
                            </div>
                          </div>

                          <div className="flex py-1">
                            <div className="px-1 flex items-center">
                              <label
                                htmlFor="max-profit"
                              >
                                MAX:
                              </label>
                            </div>
                            <div className="px-1">
                              <input
                                name="MAX"
                                className="w-[75px] p-1"
                                id="max-price"
                                type="number"
                                onChange={(e) => filterByRange(e)}
                              />
                            </div>
                          </div>
                        </div>
                        {/* </div> */}

                        {/* <div className="w-auto flex flex-wrap justify-around"> */}
                        <div className="w-auto flex flex-wrap justify-around py-2">

                          <div className="flex py-1">
                            <div className="flex items-center">
                              <input
                                onClick={(e) => handleOrderBy(e)}
                                value="Lower"
                                name="order-price-time"
                                type="radio"
                                id="lower-input-order-price"
                              />
                            </div>
                            <div className="flex items-center">
                              <label
                                className="px-2"
                                htmlFor="lower-input-order-price"
                              >
                                Lower
                              </label>
                            </div>
                          </div>

                          <div className="flex py-1">
                            <div className="flex items-center">
                              <input
                                onClick={(e) => handleOrderBy(e)}
                                value="Higher"
                                name="order-price-time"
                                type="radio"
                                id="higher-input-order-price"
                              />
                            </div>
                            <div className="flex items-center">
                              <label
                                className="px-2"
                                htmlFor="higher-input-order-price"
                              >
                                Higher
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="w-auto flex flex-wrap justify-around py-2">

                          <div className="flex py-1">
                            <div className="flex items-center">
                              <input
                                onClick={(e) => handleOrderBy(e)}
                                value="Newest"
                                name="order-price-time"
                                type="radio"
                                id="newest-input-order-time"
                              />
                            </div>
                            <div className="flex items-center">
                              <label
                                className="px-2"
                                htmlFor="newest-input-order-time"
                              >
                                Newest
                              </label>
                            </div>
                          </div>

                          <div className="flex py-1">
                            <div className="flex items-center">
                              <input
                                onClick={(e) => handleOrderBy(e)}
                                value="Oldest"
                                name="order-price-time"
                                type="radio"
                                id="oldest-input-order-time"
                              />
                            </div>
                            <div className="flex items-center">
                              <label
                                className="px-2"
                                htmlFor="oldest-input-order-time"
                              >
                                Oldest
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-[200px] overflow-y-auto whitespace-nowrap overflow-x-auto">
                      <div className="text-[20px] flex flex-col px-2 ">
                        {
                          postMatchesToShow?.length === 0
                            ? "There are no matches with those filters"
                            : postMatchesToShow?.map(p => {
                              const currentDate = p?.created_at?.slice(4, 10)
                              const currentHour = p?.created_at?.slice(16, 24)

                              const findSellerPost = allPosts?.find(p => p?._id?.toString() === p?._id?.toString())
                              const findSeller = allSellers?.find(s => s?._id?.toString() === findSellerPost?.seller)

                              const findBuyerPost = allPosts?.find(p => p?._id?.toString() === p?._id?.toString())
                              const findBuyer = allBuyers?.find(b => b?._id?.toString() === findBuyerPost?.buyer)

                              return (
                                <div
                                  key={p?._id}
                                  className="px-2"
                                >
                                  {
                                    singlePostToShow?.buyer
                                      ? <div>
                                        Seller: {findSeller?.name} - $ {findSellerPost?.price} | Profit: $ {p?.profit.toLocaleString()} | {currentDate} {currentHour}
                                      </div>
                                      : <div>
                                        Buyer: {findBuyer?.name} - $ {findBuyerPost?.price} | Profit: $ {p?.profit.toLocaleString()} | {currentDate} {currentHour}
                                      </div>
                                  }
                                </div>
                              )
                            })
                        }
                      </div>
                    </div>
                  </>
              }
            </div>
        }
      </div>


      {
        !enableEdit
          ? <></>
          : <EditPostForm setEnableEdit={setEnableEdit} />
      }
    </div>
  )
}
