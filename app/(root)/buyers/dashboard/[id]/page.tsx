"use client"

import { deleteBuyer, getBuyerById } from "@/lib/actions/buyer.actions"
import { setAllBuyers, setBuyerById } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { IconEdit, IconEditOff, IconEye, IconEyeOff, IconRefresh, IconTrashX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import SearchBuyersBar from "./components/SearchBuyersBar/SearchBuyersBar"
import EditBuyerForm from "./components/EditBuyerForm/EditBuyerForm"
import { redirect, usePathname } from "next/navigation"

export default function BuyerByIdPage() {

  const dispatch = useDispatch()

  const pathname = usePathname()
  const buyerId = pathname?.split("/").pop()

  const { singleBuyer, allBuyers }: { singleBuyer: Client, allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allCategories } = useSelector((state: Store) => state.categories)
  const { allMatches } = useSelector((state: Store) => state.matches)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [singleBuyerToShow, setSingleBuyerToShow] = useState<Client>()
  const [singleBuyerPosts, setSingleBuyerPosts] = useState<Post[]>()
  const [singleBuyerPostsToShow, setSingleBuyerPostsToShow] = useState<Post[]>()
  const [enableEdit, setEnableEdit] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterPostsBy | null>(null)
  const [orderBy, setOrderBy] = useState<string | null>(null)
  const [hideEmail, setHideEmail] = useState(true)
  const [hidePhone, setHidePhone] = useState(true)
  const [enableDelete, setEnableDelete] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/buyers/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (buyerId) {
      (async function handleGetById() {
        const singleBuyerSelected = await getBuyerById(buyerId)
        if (singleBuyerSelected) {
          const { message, status, object } = singleBuyerSelected
          if (status === 200) {
            dispatch(setFooterMessage({ message, status }))
            dispatch(setBuyerById(object))
            return
          }
        }
        dispatch(setFooterMessage({ message: "Get Buyer failed", status: 409 }))
      })()
    }
  }, [buyerId])

  useEffect(() => {
    setEnableEdit(false)
    setSingleBuyerToShow(singleBuyer)
    const allPostsCopy = structuredClone(allPosts || [])
    const buyerPosts = allPostsCopy?.filter(p => p?.buyer === singleBuyer?._id?.toString())
    setSingleBuyerPosts(buyerPosts)
    setSingleBuyerPostsToShow(buyerPosts)
  }, [singleBuyer])

  async function handleRefresh() {
    if (buyerId) {
      const refreshBuyer = await getBuyerById(buyerId)
      if (refreshBuyer) {
        const { message, status, object }: { message: string, status: number, object: Client | null } = refreshBuyer
        if (status === 200) {
          const allBuyersCopy = structuredClone(allBuyers || [])
          const removeOldBuyer = allBuyersCopy?.filter(b => b?._id?.toString() !== singleBuyer?._id?.toString())
          dispatch(setBuyerById(object))
          dispatch(setAllBuyers([...removeOldBuyer, object]))
        }
        dispatch(setFooterMessage({ message, status }))
      }
    }
  }

  function handleFilters({ name, value }: { name: string, value: string }) {
    setFilterBy(prevState => {
      if (prevState === null) {
        return { [name]: value }
      }
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  function handleOrders(value: string) {
    setOrderBy(value)
  }

  useEffect(() => {
    let buyerPostsFilteredBy = structuredClone(singleBuyerPosts || [])
    if (filterBy?.category) {
      const categoryToFilter = allCategories?.find(c => c?.name === filterBy?.category)
      buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(p => p?.category === categoryToFilter?._id?.toString())
    }
    if (filterBy?.min) {
      buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(p => Number(p?.price) >= Number(filterBy?.min))
    }
    if (filterBy?.MAX) {
      buyerPostsFilteredBy = buyerPostsFilteredBy?.filter(p => Number(p?.price) <= Number(filterBy?.MAX))
    }

    setSingleBuyerPostsToShow(buyerPostsFilteredBy)
  }, [filterBy])

  useEffect(() => {
    let buyerPostsOrderBy = [...(singleBuyerPostsToShow || [])]
    if (orderBy === "Lower") {
      buyerPostsOrderBy = buyerPostsOrderBy.sort((a, b) => Number(a?.price) - Number(b?.price))
    }
    if (orderBy === "Higher") {
      buyerPostsOrderBy = buyerPostsOrderBy.sort((a, b) => Number(b?.price) - Number(a?.price))
    }
    if (orderBy === "Newest") {
      buyerPostsOrderBy = buyerPostsOrderBy.sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime())
    }
    if (orderBy === "Oldest") {
      buyerPostsOrderBy = buyerPostsOrderBy.sort((a, b) => new Date(a?.created_at).getTime() - new Date(b?.created_at).getTime())
    }
    setSingleBuyerPostsToShow(buyerPostsOrderBy)
  }, [orderBy])

  function handleEnbaleEdit() {
    setEnableEdit(!enableEdit)
  }

  async function handleDeleteBuyer() {
    if (singleBuyer?.posts?.length > 0) {
      dispatch(setFooterMessage({ message: `Cannot delete buyer > ${singleBuyer?.name} <, currently has > ${singleBuyer?.posts?.length} < posts.`, status: 409 }))
    } else {
      const buyerDeleted = await deleteBuyer(singleBuyer?._id)
      if (buyerDeleted) {
        const { message, status }: { message: string, status: number } = buyerDeleted
        dispatch(setFooterMessage({ message, status }))
        if (status === 200) {
          const allBuyersCopy = structuredClone(allBuyers || [])
          const buyerRemoved = allBuyersCopy?.filter(b => b?._id?.toString() !== singleBuyer?._id?.toString())
          dispatch(setAllBuyers(buyerRemoved))
          dispatch(setBuyerById(null))
          setExecuteRedirect(true)
        }
      } else {
        dispatch(setFooterMessage({ message: "Failed delete buyer", status: 409 }))
      }
    }
  }

  function handleHideEmail(value: boolean) {
    setHideEmail(value)
  }

  function handleHidePhone(value: boolean) {
    setHidePhone(value)
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
      <div className="w-full md:w-auto md:min-w-[50%] flex flex-wrap text-[25px] p-3 gap-5">
        {
          !singleBuyer
            ? "There is no Buyer selected"
            : <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-wrap justify-around items-center h-fit">
                <div className="flex gap-4">
                  <div className="text-[15px]">
                    {singleBuyerToShow?.disabled ? "Disabled" : "Enabled"}
                  </div>
                  <div className="text-[15px]">
                    {singleBuyerToShow?.is_active ? "Active" : "Inactive"}
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
                      onClick={handleDeleteBuyer}
                      disabled={!enableDelete}
                    >
                      <IconTrashX className={`h-[35px] w-[35px] ${enableDelete ? "text-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="">
                Buyer: {singleBuyerToShow?.name}
              </div>
              <div className="">
                Posts: {singleBuyerToShow?.posts?.length}
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  Email:
                </div>
                <div className="flex">
                  {
                    hideEmail
                      ? <div className="flex flex-wrap w-full items-center gap-2">
                        <div>
                          ·······{"@" + singleBuyerToShow?.email?.split("@")[1]}
                        </div>
                        <button
                          onClick={() => handleHideEmail(false)}
                        >
                          <IconEye />
                        </button>
                      </div>
                      : <div className="flex items-center gap-3">
                        {singleBuyerToShow?.email}
                        <button
                          onClick={() => handleHideEmail(true)}
                        >
                          <IconEyeOff />
                        </button>
                      </div>
                  }
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div>
                  Phone:
                </div>
                <div className="flex">
                  {
                    hidePhone
                      ? <div className="flex flex-wrap w-full items-center gap-2">
                        <div>
                          ·······
                          {singleBuyerToShow?.phone?.slice(-3)}
                        </div>
                        <button
                          onClick={() => handleHidePhone(false)}
                        >
                          <IconEye />
                        </button>
                      </div>
                      : <div className="flex items-center gap-3">
                        {singleBuyerToShow?.phone}
                        <button
                          onClick={() => handleHidePhone(true)}
                        >
                          <IconEyeOff />
                        </button>
                      </div>
                  }
                </div>
              </div>
              <div className="">
                Description: {singleBuyerToShow?.description || "-"}
              </div>
            </div>
        }
      </div>

      {
        !enableEdit
          ? <div className="p-3">
            {
              singleBuyerPosts?.length === 0
                ? <div className="text-center text-[20px]">
                  There are no posts from this Buyer
                </div>
                : <>
                  <SearchBuyersBar
                    handleOrders={handleOrders}
                    handleFilters={handleFilters}
                  />
                  <div className="h-[200px] overflow-y-auto whitespace-nowrap overflow-x-auto">
                    <div className="text-[20px] flex flex-col px-2 ">
                      {
                        singleBuyerPostsToShow?.length === 0
                          ? `There are no posts with those filters`
                          : singleBuyerPostsToShow?.map(p => {
                            const currentCategory = allCategories?.find(c => c?._id.toString() === p?.category)
                            const allMatchesCopy = structuredClone(allMatches || [])
                            const currentMatches = allMatchesCopy?.filter(m => (m?.buyerPost === p?._id))
                            const currentDate = p?.created_at?.slice(4, 10)
                            const currentHour = p?.created_at?.slice(16, 24)
                            return (
                              <div
                                key={`single-buyer-post-${p?._id}`}
                                className="px-2"
                              >
                                $ {p?.price} - {currentCategory?.name} | {currentMatches?.length} matches | {currentDate} - {currentHour}
                              </div>
                            )
                          })
                      }
                    </div>
                  </div>
                </>
            }
          </div>
          : <EditBuyerForm
            setEnableEdit={setEnableEdit}
          />
      }

    </div>
  )
}
