"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { redirect, usePathname } from "next/navigation"
import EditSellerForm from "./components/EditSellerForm/EditSellerForm"
import SearchSellersBar from "./components/SearchSellersBar/SearchSellersBar"
import { deleteSeller, getSellerById } from "@/lib/actions/seller.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllSellers, setSellerById } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { IconEdit, IconEditOff, IconEye, IconEyeOff, IconRefresh, IconTrashX } from "@tabler/icons-react"

export default function SellerByIdPage() {

  const dispatch = useDispatch()

  const pathname = usePathname()
  const sellerId = pathname?.split("/").pop()

  const { singleSeller, allSellers }: { singleSeller: Client, allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [singleSellerToShow, setSingleSellerToShow] = useState<Client>()
  const [singleSellerPosts, setSingleSellerPosts] = useState<Post[]>()
  const [singleSellerPostsToShow, setSingleSellerPostsToShow] = useState<Post[]>()
  const [enableEdit, setEnableEdit] = useState(false)
  const [filterBy, setFilterBy] = useState<FilterPostsBy | null>(null)
  const [orderBy, setOrderBy] = useState<string | null>(null)
  const [hideEmail, setHideEmail] = useState(true)
  const [hidePhone, setHidePhone] = useState(true)
  const [enableDelete, setEnableDelete] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/sellers/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (sellerId) {
      (async function handleSetById() {
        const singleSellerSelected = allSellers?.find(s => s?._id?.toString() === sellerId)
        if (singleSellerSelected) {
          dispatch(setFooterMessage({ message: `Seller ${singleSellerSelected?.name} found.`, status: 200 }))
          dispatch(setSellerById(singleSellerSelected))
          return
        }
        dispatch(setFooterMessage({ message: "Get Seller failed", status: 409 }))
      })()
    }
  }, [])

  useEffect(() => {
    setEnableEdit(false)
    setSingleSellerToShow(singleSeller)
    const allPostsCopy = structuredClone(allPosts || [])
    const sellerPosts = allPostsCopy?.filter(p => p?.seller === singleSeller?._id?.toString())
    setSingleSellerPosts(sellerPosts)
    setSingleSellerPostsToShow(sellerPosts)
  }, [singleSeller])

  async function handleRefresh() {
    if (sellerId) {
      const refreshSeller = await getSellerById(sellerId)
      if (refreshSeller) {
        const { message, status, object }: { message: string, status: number, object: Client | null } = refreshSeller
        if (status === 200) {
          const allSellersCopy = structuredClone(allSellers || [])
          const removeOldSeller = allSellersCopy?.filter(b => b?._id?.toString() !== singleSeller?._id?.toString())
          dispatch(setSellerById(object))
          dispatch(setAllSellers([...removeOldSeller, object]))
        }
        dispatch(setFooterMessage({ message, status }))
      }
    }
  }

  function handleFilters({ name, value }: { name: string, value: string }) {
    setFilterBy(prevState => {
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
    let sellerPostsFilteredBy = structuredClone(singleSellerPosts || [])
    if (filterBy?.category) {
      const categoryToFilter = allCategories?.find(c => c?.name === filterBy?.category)
      sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(p => p?.category === categoryToFilter?._id?.toString())
    }
    if (filterBy?.min) {
      sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(p => Number(p?.price) >= Number(filterBy?.min))
    }
    if (filterBy?.MAX) {
      sellerPostsFilteredBy = sellerPostsFilteredBy?.filter(p => Number(p?.price) <= Number(filterBy?.MAX))
    }

    setSingleSellerPostsToShow(sellerPostsFilteredBy)
  }, [filterBy])

  useEffect(() => {
    let sellerPostsOrderBy = [...(singleSellerPostsToShow || [])]
    if (orderBy === "Lower") {
      sellerPostsOrderBy = sellerPostsOrderBy.sort((a, b) => Number(a?.price) - Number(b?.price))
    }
    if (orderBy === "Higher") {
      sellerPostsOrderBy = sellerPostsOrderBy.sort((a, b) => Number(b?.price) - Number(a?.price))
    }
    if (orderBy === "Newest") {
      sellerPostsOrderBy = sellerPostsOrderBy.sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime())
    }
    if (orderBy === "Oldest") {
      sellerPostsOrderBy = sellerPostsOrderBy.sort((a, b) => new Date(a?.created_at).getTime() - new Date(b?.created_at).getTime())
    }
    setSingleSellerPostsToShow(sellerPostsOrderBy)
  }, [orderBy])

  function handleEnbaleEdit() {
    setEnableEdit(!enableEdit)
  }

  async function handleDeleteSeller() {
    if (singleSeller?.posts?.length > 0) {
      dispatch(setFooterMessage({ message: `Cannot delete seller > ${singleSeller?.name} <, currently has > ${singleSeller?.posts?.length} < posts.`, status: 409 }))
    } else {
      const sellerDeleted = await deleteSeller(singleSeller?._id)
      if (sellerDeleted) {
        const { message, status, object }: { message: string, status: number, object: Client | null } = sellerDeleted
        dispatch(setFooterMessage({ message, status }))
        if (status === 200) {
          const allSellersCopy = structuredClone(allSellers || [])
          const sellerRemoved = allSellersCopy?.filter(b => b?._id?.toString() !== singleSeller?._id?.toString())
          dispatch(setAllSellers(sellerRemoved))
          dispatch(setSellerById(null))
          setExecuteRedirect(true)
        }
      } else {
        dispatch(setFooterMessage({ message: "Failed delete seller", status: 409 }))
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
      <div className="w-auto min-w-[50%] flex flex-wrap text-[25px] p-3 gap-5">
        {
          !singleSeller
            ? "There is no Seller selected"
            : <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-wrap justify-between h-fit">
                <div className="flex gap-4">
                  <div className="text-[15px]">
                    {singleSellerToShow?.disable ? "Disable" : "Enable"}
                  </div>
                  <div className="text-[15px]">
                    {singleSellerToShow?.is_active ? "Active" : "Inactive"}
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
                      onClick={handleDeleteSeller}
                      disabled={!enableDelete}
                    >
                      <IconTrashX className={`h-[35px] w-[35px] ${enableDelete ? "text-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="">
                Seller: {singleSellerToShow?.name}
              </div>
              <div className="">
                Posts: {singleSellerToShow?.posts?.length}
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
                          ·······{"@" + singleSellerToShow?.email?.split("@")[1]}
                        </div>
                        <button
                          onClick={() => handleHideEmail(false)}
                        >
                          <IconEye />
                        </button>
                      </div>
                      : <div className="flex items-center gap-3">
                        {singleSellerToShow?.email}
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
                          {singleSellerToShow?.phone?.slice(-3)}
                        </div>
                        <button
                          onClick={() => handleHidePhone(false)}
                        >
                          <IconEye />
                        </button>
                      </div>
                      : <div className="flex items-center gap-3">
                        {singleSellerToShow?.phone}
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
                Description: {singleSellerToShow?.description || "-"}
              </div>
            </div>
        }
      </div>

      {
        !enableEdit
          ? <div className="p-3">
            {
              singleSellerPosts?.length === 0
                ? <div className="text-center text-[20px]">
                  There are no posts from this Seller
                </div>
                : <>
                  <SearchSellersBar
                    handleOrders={handleOrders}
                    handleFilters={handleFilters}
                  />
                  <div className="h-[200px] overflow-y-auto whitespace-nowrap overflow-x-auto">
                    <div className="text-[20px] flex flex-col px-2 ">
                      {
                        singleSellerPostsToShow?.length === 0
                          ? `There are no posts with those filters`
                          : singleSellerPostsToShow?.map(p => {
                            const currentCategory = allCategories?.find(c => c?._id.toString() === p?.category)
                            const allMatchesCopy = structuredClone(allMatches || [])
                            const currentMatches = allMatchesCopy?.filter(m => (m?.sellerPost === p?._id))
                            const currentDate = p?.created_at?.slice(4, 10)
                            const currentHour = p?.created_at?.slice(16, 24)
                            return (
                              <div
                                key={`single-seller-post-${p?._id}`}
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
          : <EditSellerForm
            setEnableEdit={setEnableEdit}
          />
      }

    </div>
  )
}
