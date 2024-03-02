"use client"

import { deleteCategory, getCategoryById } from "@/lib/actions/category.actions"
import { setAllCategories, setCategoryById } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { IconEdit, IconEditOff, IconRefresh, IconTrashX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import EditCategoryForm from "./components/EditCategoryForm/EditCategoryForm"
import { redirect, usePathname } from "next/navigation"

export default function CategoryByIdPage() {

  const dispatch = useDispatch()

  const pathname = usePathname()
  const categoryId = pathname?.split("/").pop()

  const { singleCategory, allCategories }: { singleCategory: Category, allCategories: Category[] } = useSelector((state: Store) => state.categories)
  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  const [categoryPosts, setCategoryPosts] = useState<CategoryPosts | undefined>()
  const [categoryMatches, setCategoryMatches] = useState<Match[]>([])
  const [singleCategoryToShow, setSingleCategoryToShow] = useState<Category>()
  const [enableEdit, setEnableEdit] = useState(false)
  const [enableDelete, setEnableDelete] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)

  useEffect(() => {
    if (executeRedirect) {
      redirect("/categories/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (categoryId) {
      (async function handleGetById() {
        const singleBuyerSelected = await getCategoryById(categoryId)
        if (singleBuyerSelected) {
          const { message, status, object } = singleBuyerSelected
          if (status === 200) {
            dispatch(setFooterMessage({ message, status }))
            dispatch(setCategoryById(object))
            return
          }
        }
        dispatch(setFooterMessage({ message: "Get Category failed", status: 409 }))
      })()
    }
  }, [categoryId])

  useEffect(() => {
    const singleCategoryCopy = structuredClone(singleCategory || {})
    setSingleCategoryToShow(singleCategoryCopy)
    setEnableEdit(false)
  }, [singleCategory])

  useEffect(() => {
    const allPostsCopy = structuredClone(allPosts || [])

    const buyerPostsByCategory = [...(allPostsCopy || [])]?.filter(p => (p?.category === singleCategory?._id.toString() && p?.buyer))
    // const uniqueBuyers = [...buyerPostsByCategory]?.filter((p, index, self) => self.findIndex(e => e.buyer === p.buyer) === index)
    const uniqueBuyerNames: string[] = []
    for (const eachBuyerPost of buyerPostsByCategory) {
      const buyerPostBuyer = allBuyers?.find(b => b?._id?.toString() === eachBuyerPost?.buyer)
      if (buyerPostBuyer) {
        if (!uniqueBuyerNames.includes(buyerPostBuyer?.name)) {
          uniqueBuyerNames.push(buyerPostBuyer?.name)
        }
      }
    }

    const sellerPostsByCategory = [...(allPostsCopy || [])]?.filter(p => (p?.category === singleCategory?._id.toString() && p?.seller))
    // const uniqueSellers = [...sellerPostsByCategory]?.filter((p, index, self) => self.findIndex(e => e.seller === p.seller) === index)
    const uniqueSellerNames: string[] = []
    for (const eachBuyerPost of sellerPostsByCategory) {
      const sellerPostSeller = allSellers?.find(s => s?._id?.toString() === eachBuyerPost?.seller)
      if (sellerPostSeller) {
        if (!uniqueSellerNames.includes(sellerPostSeller?.name)) {
          uniqueSellerNames.push(sellerPostSeller?.name)
        }
      }
    }

    setCategoryPosts({
      buyers: {
        posts: buyerPostsByCategory,
        unique: uniqueBuyerNames
      },
      sellers: {
        posts: sellerPostsByCategory,
        unique: uniqueSellerNames
      }
    })

    const allMatchesCopy = structuredClone(allMatches || [])
    const matchesByCategory = allMatchesCopy?.filter(m => m?.category === singleCategory?._id?.toString())
    setCategoryMatches(matchesByCategory)
  }, [allBuyers, allMatches, allPosts, allSellers, singleCategory])

  async function handleRefresh() {
    if (categoryId) {
      const refreshCategory = await getCategoryById(categoryId)
      if (refreshCategory) {
        const { message, status, object }: { message: string, status: number, object: Client | null } = refreshCategory
        if (status === 200) {
          const allCategoriesCopy = structuredClone(allCategories || [])
          const removeOldCategory = allCategoriesCopy?.filter(b => b?._id?.toString() !== singleCategory?._id?.toString())
          dispatch(setCategoryById(object))
          dispatch(setAllCategories([...removeOldCategory, object]))
        }
        dispatch(setFooterMessage({ message, status }))
      }
    }
  }

  function handleEnbaleEdit() {
    setEnableEdit(!enableEdit)
  }

  async function handleDeleteCategory() {
    if (
      (categoryPosts?.buyers?.posts && categoryPosts?.buyers?.posts?.length > 0) ||
      (categoryPosts?.sellers?.posts && categoryPosts?.sellers?.posts?.length > 0) ||
      categoryMatches?.length > 0
    ) {
      dispatch(setFooterMessage(
        {
          message: `Cannot delete cantegory > ${singleCategory?.name} <, there are currently > ${(categoryPosts?.buyers?.posts?.length || 0) + (categoryPosts?.sellers?.posts?.length || 0)} < posts with that category.`,
          status: 409
        })
      )
    } else {
      const deletedCategory = await deleteCategory(singleCategory?._id)
      if (deletedCategory) {
        const { message, status }: { message: string, status: number } = deletedCategory
        dispatch(setFooterMessage({ message, status }))
        if (status === 200) {
          const allCategoriesCopy = structuredClone(allCategories || [])
          const categoryRemoved = allCategoriesCopy?.filter(c => c?._id?.toString() !== singleCategory?._id?.toString())
          dispatch(setAllCategories(categoryRemoved))
          dispatch(setCategoryById(null))
          setExecuteRedirect(true)
        }
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
          !singleCategory
            ? "There is no Category selected"
            : <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-between h-fit">
                <div className="flex gap-4">
                  <div className="text-[15px]">
                    {singleCategoryToShow?.disabled ? "Disabled" : "Enabled"}
                  </div>
                  <div className="text-[15px]">
                    {singleCategoryToShow?.is_active ? "Active" : "Inactive"}
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
                      onClick={handleDeleteCategory}
                      disabled={!enableDelete}
                    >
                      <IconTrashX className={`h-[35px] w-[35px] ${enableDelete ? "text-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="">
                  Category: {singleCategoryToShow?.name}
                </div>
                <div className="pr-2">
                  Posts {(categoryPosts?.buyers?.posts?.length || 0) + (categoryPosts?.sellers?.posts?.length || 0)}
                </div>
                <div className="">
                  Buyers: {categoryPosts?.buyers?.posts?.length} ({categoryPosts?.buyers?.unique?.length} unique)
                </div>
                <div className="">
                  Sellers: {categoryPosts?.sellers?.posts?.length} ({categoryPosts?.sellers?.unique?.length} unique)
                </div>
              </div>

              <div className="w-full flex  py-1">
                <div>
                  Matches: {categoryMatches?.length > 0 ? categoryMatches?.length : "No matches for this Category"}
                </div>
              </div>

              <div className="w-full flex  py-1">
                Description: {singleCategoryToShow?.description}
              </div>
            </div>
        }
      </div>

      <div className="p-3">
        {
          !enableEdit
            ? <>

            </>
            : <EditCategoryForm
              posts={categoryPosts}
              setEnableEdit={setEnableEdit}
            // category={singleCategoryToShow}
            />
        }
      </div >
    </div >

  )
}
