"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBuyerPostToCompare, setSellerPostToCompare } from "@/lib/redux/slices/postsSlice/postsSlice"
import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"
import CompareSection from "../CompareSection/CompareSection"
import ComparePostsList from "../ComparePostsList/ComparePostsList"

export default function AddMatchForm() {

  const dispatch = useDispatch()

  // const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)

  // const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateMatchParams>({
  //   resolver: zodResolver(addMatchValidations)
  // })

  // const [executeRedirect, setExecuteRedirect] = useState(false)

  // useEffect(() => {
  //   if (executeRedirect) {
  //     redirect("/matches/dashboard")
  //   }
  // }, [executeRedirect])

  // const handleSubmitForm: SubmitHandler<CreateMatchParams> = async matchData => {
  //   try {
  //     const createdMatch = await createMatch(matchData)
  //     console.log(createdMatch)
  //     if (createdMatch && createdMatch?._id) {
  //       dispatch(setAllMatches([...allMatches, createdMatch]))
  //       setExecuteRedirect(true)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)

  const [sellersPosts, setSellersPosts] = useState<Post[]>([])
  const [buyersPosts, setBuyersPosts] = useState<Post[]>([])
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    const sellersSameCategoryPosts = allPosts?.filter(p => p?.seller)
    const buyersSameCategoryPosts = allPosts?.filter(p => p?.buyer)
    setSellersPosts(sellersSameCategoryPosts)
    setBuyersPosts(buyersSameCategoryPosts)
  }, [allPosts])

  useEffect(() => {
    dispatch(setBuyerPostToCompare(null))
    dispatch(setSellerPostToCompare(null))
  }, [categoryFilter])

  return (
    // <form
    // onSubmit={handleSubmit(handleSubmitForm)}
    // className="flex justify-center items-center"
    // >
    <div className="flex flex-col text-center w-full">

      <div className="w-full flex flex-wrap justify-around py-1">

        <div className="w-52">
          {
            <CategoriesInput
              handleFilter={setCategoryFilter}
            />
          }
        </div>

      </div>

      <div className="flex flex-wrap justify-center p-5">
        <div className="lg:w-1/2 md:w-1/2 sm:w-1/2 xs:w-1/2 w-auto px-4 mb-4 lg:mb-0">
          Sellers: {sellersPosts?.length} posts - Buyers {buyersPosts?.length} posts

          {
            !categoryFilter
              ? <div className="pt-5 text-xl">
                Please, choose a Category
              </div>
              : <div className="flex">
                <div className="w-full">
                  <div className="text-lg p-2">
                    Sellers
                  </div>
                  <ComparePostsList
                    ownerType="seller"
                    posts={sellersPosts}
                    categoryFilter={categoryFilter}
                  />
                </div>
                <div className="w-full">
                  <div className="text-lg p-2">
                    Buyers
                  </div>
                  <ComparePostsList
                    ownerType="buyer"
                    posts={buyersPosts}
                    categoryFilter={categoryFilter}
                  />
                </div>
              </div>
          }
        </div>
        <div className="lg:w-1/2 md:w-1/2 sm:w-1/2 xs:w-1/2 w-auto px-4 text-center p-5">
          <CompareSection categoryFilter={categoryFilter} />
        </div>
      </div>

    </div>
    // </form> 
  )
}
