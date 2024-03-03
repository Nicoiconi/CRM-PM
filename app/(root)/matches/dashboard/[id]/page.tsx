"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { redirect, usePathname } from "next/navigation"

import { deleteMatch, getMatchById } from "@/lib/actions/match.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllMatches, setMatchById } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { IconEdit, IconEditOff, IconRefresh, IconTrashX } from "@tabler/icons-react"
import EditMatchForm from "./components/EditMatchForm"

export default function MatchByIdPage() {

  const dispatch = useDispatch()

  const pathname = usePathname()
  const matchId = pathname?.split("/").pop()

  const { allMatches, singleMatch }: { allMatches: Match[], singleMatch: Match } = useSelector((state: Store) => state.matches)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [enableEdit, setEnableEdit] = useState(false)
  const [matchBuyer, setMatchBuyer] = useState<Client>()
  const [matchSeller, setMatchSeller] = useState<Client>()
  const [matchCategory, setMatchCategory] = useState<Category>()
  const [enableDelete, setEnableDelete] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/matches/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (matchId) {
      (async function handleGetById() {
        const singleMatchSelected = await getMatchById(matchId)
        if (singleMatchSelected) {
          const { message, status, object } = singleMatchSelected
          if (status === 200) {
            dispatch(setFooterMessage({ message, status }))
            dispatch(setMatchById(object))
            return
          }
        }
        dispatch(setFooterMessage({ message: "Get Match failed", status: 409 }))
      })()
    }
  }, [matchId])

  useEffect(() => {
    if (singleMatch) {

      const matchBuyerPost = allPosts?.find(p => p?._id?.toString() === singleMatch?.buyerPost)
      if (matchBuyerPost) {
        const findMatchBuyer = allBuyers?.find(b => b?._id?.toString() === matchBuyerPost?.buyer)
        if (findMatchBuyer) {
          setMatchBuyer(findMatchBuyer)
        }
      }

      const matchSellerPost = allPosts?.find(p => p?._id?.toString() === singleMatch?.sellerPost)
      if (matchBuyerPost) {
        const findMatchSeller = allSellers?.find(s => s?._id?.toString() === matchSellerPost?.seller)
        if (findMatchSeller) {
          setMatchSeller(findMatchSeller)
        }
      }

      const findMatchCategory = allCategories?.find(c => c?._id?.toString() === matchSellerPost?.category)
      if (findMatchCategory) {
        setMatchCategory(findMatchCategory)
      }
    }
  }, [allBuyers, allCategories, allPosts, allSellers, singleMatch])

  function handleRefresh() {
    const refreshMatch = allMatches?.find(b => b?._id.toString() === singleMatch?._id.toString())
    dispatch(setMatchById(refreshMatch))
  }

  function handleEnbaleEdit() {
    setEnableEdit(!enableEdit)
  }


  async function handleDeleteMatch() {
    if (singleMatch?.is_active || !singleMatch?.disabled) {
      dispatch(setFooterMessage({ message: `Cannot delete the match if it is Active or Enabled.`, status: 409 }))
    } else {
      const matchDeleted = await deleteMatch(singleMatch?._id)
      if (matchDeleted) {
        const { message, status }: { message: string, status: number } = matchDeleted
        dispatch(setFooterMessage({ message, status }))
        if (status === 200) {
          const allMatchesCopy = structuredClone(allMatches || [])
          const matchRemoved = allMatchesCopy?.filter(b => b?._id?.toString() !== singleMatch?._id?.toString())
          dispatch(setAllMatches(matchRemoved))
          dispatch(setMatchById(null))
          setExecuteRedirect(true)
        }
      } else {
        dispatch(setFooterMessage({ message: "Failed delete buyer", status: 409 }))
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
      <div className="w-full md:w-auto md:min-w-[50%] flex flex-wrap text-[25px] p-3 gap-5">
        {
          !singleMatch
            ? "Please, choose a Match"
            : <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-wrap justify-around items-center h-fit">
                <div className="flex gap-4">
                  <div className="text-[15px]">
                    {singleMatch?.disabled ? "Disabled" : "Enabled"}
                  </div>
                  <div className="text-[15px]">
                    {singleMatch?.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="border-2 border-black rounded-[9999px] p-[2px]"
                    onClick={() => handleRefresh()}
                  >
                    <IconRefresh />
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
                      onClick={() => handleDeleteMatch()}
                      disabled={!enableDelete}
                    >
                      <IconTrashX className={`h-[35px] w-[35px] ${enableDelete ? "text-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="">
                Category: {matchCategory?.name}
              </div>

              <div className="">
                Seller: {matchSeller?.name} - $ {allPosts?.find(p => p?._id?.toString() === singleMatch?.sellerPost)?.price?.toLocaleString()}
              </div>

              <div className="">
                Buyer: {matchBuyer?.name} - $ {allPosts?.find(p => p?._id?.toString() === singleMatch?.buyerPost)?.price?.toLocaleString()}
              </div>

              <div className="">
                Profit: $ {singleMatch?.profit?.toLocaleString()}
              </div>

              <div className="">
                Description: {singleMatch?.description}
              </div>
            </div>
        }
      </div>

      {
        !enableEdit
          ? ""
          : <EditMatchForm
            setEnableEdit={setEnableEdit}
          />
      }

    </div>
  )
}
