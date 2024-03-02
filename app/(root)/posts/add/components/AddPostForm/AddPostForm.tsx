"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { redirect } from "next/navigation"

import { createPost } from "@/lib/actions/post.actions"
import { setAllPosts, setPostById } from "@/lib/redux/slices/postsSlice/postsSlice"
import AutoCompleteInputNewForm from "../AutoCompleteInputNewForm/AutoCompleteInputNewForm"
import { IconRefresh, IconSquareRoundedX } from "@tabler/icons-react"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { getAllCategories } from "@/lib/actions/category.actions"
import { setAllCategories } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"

interface OwnersForInput {
  _id: string
  name: string
}

export default function AddPostForm() {

  const dispatch = useDispatch()

  const { allPosts }: { allPosts: Post[] } = useSelector((state: Store) => state.posts)
  const { allBuyers }: { allBuyers: Client[] } = useSelector((state: Store) => state.buyers)
  const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)
  const { allCategories }: { allCategories: Category[] } = useSelector((state: Store) => state.categories)

  const [postOwner, setPostOwner] = useState("")
  const [newPost, setNewPost] = useState<CreatePostParams | undefined>()
  const [ownersForInput, setOwnersForInput] = useState<OwnersForInput[]>([])
  const [alreadyExistError, setAlreadyExistError] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState<string | undefined>()
  const [selectedCategory, setSelectedCategory] = useState("")
  // console.log(newPost)  

  useEffect(() => {
    if (executeRedirect === "dashboard") {
      redirect("/posts/dashboard")
    }
    if (executeRedirect === "add") {
      redirect("/posts/add")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (selectedCategory) {
      const findSelectedCategory = allCategories?.find(c => c?.name === selectedCategory)
      setNewPost(prevState => {
        if (prevState) {
          return {
            ...prevState,
            category: findSelectedCategory?._id?.toString()
          }
        } else {
          return {
            category: findSelectedCategory?._id?.toString(),
            price: 0
          }
        }
      })
    } else {
      setNewPost(prevState => {
        if (prevState) {
          return {
            ...prevState,
            category: ""
          }
        } else {
          return {
            category: "",
            price: 0
          }
        }
      })
    }
  }, [selectedCategory])

  // useEffect(() => {
  //   if (postOwner === "Buyer") {
  //     const allBuyersCopy = structuredClone(allBuyers || [])
  //     const buyersForInput = allBuyersCopy?.map(b => ({ _id: b?._id, name: b?.name }))
  //     setOwnersForInput(buyersForInput)
  //   }
  //   if (postOwner === "Seller") {
  //     const allSellersCopy = structuredClone(allSellers || [])
  //     const sellersForInput = allSellersCopy?.map(b => ({ _id: b?._id, name: b?.name }))
  //     setOwnersForInput(sellersForInput)
  //   }
  // }, [allBuyers, allSellers, postOwner])

  function handlePostOwner(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    const newPostCopy = structuredClone(newPost || {})
    if (value === "Seller") {
      setPostOwner("Seller")
      if (newPostCopy?.buyer) {
        delete newPostCopy?.buyer
      }
      const allSellersCopy = structuredClone(allSellers || [])
      const sellersForInput = allSellersCopy?.map(b => ({ _id: b?._id, name: b?.name }))
      setOwnersForInput(sellersForInput)
    }
    if (value === "Buyer") {
      setPostOwner("Buyer")
      if (newPost?.seller) {
        delete newPostCopy?.seller
      }
      const allBuyersCopy = structuredClone(allBuyers || [])
      const buyersForInput = allBuyersCopy?.map(b => ({ _id: b?._id, name: b?.name }))
      setOwnersForInput(buyersForInput)
    }
    if (newPost && !newPost?.category) {
      newPostCopy.category = ""
    }
    if (newPost && !newPost?.category) {
      newPostCopy.category = ""
    }
    setNewPost(newPostCopy)
  }

  function handleNewPost(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    setNewPost(prevState => {
      if (prevState) {
        return {
          ...prevState,
          [name]: value
        }
      } else {
        return {
          [name]: value,
          category: '',
          price: 0
        }
      }
    })
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, createOneMore: boolean
  ) {
    e.preventDefault()
    if (
      newPost &&
      (newPost?.seller || newPost?.buyer) &&
      newPost?.category
    ) {
      if (postOwner === "Buyer") {
        const postAlreadyExist = allPosts.find(p =>
          p?.buyer === newPost?.buyer &&
          p?.category === newPost?.category &&
          Number(p?.price) === Number(newPost?.price)
        )
        if (postAlreadyExist) {
          setAlreadyExistError(true)
          const buyerPostAlreadyExist = allBuyers?.find(b => b?._id?.toString() === newPost?.buyer)
          const categoryPostAlreadyExist = allCategories?.find(c => c?._id?.toString() === newPost?.category)
          dispatch(setFooterMessage({ status: 409, message: `Buyer post >> ${buyerPostAlreadyExist?.name} - ${categoryPostAlreadyExist?.name} - $ ${postAlreadyExist?.price} << already existe` }))
          return
        }
        const createdPost = await createPost(newPost)
        if (createdPost) {
          const { message, status, object }: { message: string, status: number, object: Client | null } = createdPost
          if (status === 201) {
            const allPostsCopy = structuredClone(allPosts || [])
            dispatch(setAllPosts([...allPostsCopy, object]))
            dispatch(setPostById(object))
            if (!createOneMore) {
              setExecuteRedirect("dashboard")
            }
            if (createOneMore) {
              setExecuteRedirect("add")
            }
          }
          dispatch(setFooterMessage({ message, status }))
        }
      }
      if (postOwner === "Seller") {
        const postAlreadyExist = allPosts.find((p) =>
          p?.seller === newPost?.seller &&
          p?.category === newPost?.category &&
          Number(p?.price) === Number(newPost?.price)
        )
        if (postAlreadyExist) {
          setAlreadyExistError(true)
          const sellerPostAlreadyExist = allSellers?.find(b => b?._id?.toString() === newPost?.seller)
          const categoryPostAlreadyExist = allCategories?.find(c => c?._id?.toString() === newPost?.category)
          dispatch(setFooterMessage({ status: 409, message: `Seller post >> ${sellerPostAlreadyExist?.name} - ${categoryPostAlreadyExist?.name} - $ ${postAlreadyExist?.price} << already existe` }))
          return
        }
        const createdPost = await createPost(newPost)
        if (createdPost) {
          const { message, status, object }: { message: string, status: number, object: Client | null } = createdPost
          if (status === 201) {
            const allPostsCopy = structuredClone(allPosts || [])
            dispatch(setAllPosts([...allPostsCopy, object]))
            dispatch(setPostById(object))
            if (!createOneMore) {
              setExecuteRedirect("dashboard")
            }
            if (createOneMore) {
              setExecuteRedirect("add")
            }
          }
          dispatch(setFooterMessage({ message, status }))
        }
      }
    }
  }

  function handleClearErrorAlreadyExist() {
    setAlreadyExistError(false)
  }

  async function handleGetAllCategories(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const allCategoriesData = await getAllCategories()
    if (allCategoriesData) {
      const { message, status, object } = allCategoriesData
      if (status === 200) {
        dispatch(setAllCategories(object))
      }
      dispatch(setFooterMessage({ message, status }))
      return
    }
    dispatch(setFooterMessage({ message: "Get Categories failed", status: 409 }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, "");
    e.target.value = newValue;
  }

  // console.log(newPost)

  return (
    <form className="w-1/2 p-2 shadow bg-dark-500 rounded border">
      {/* <form onSubmit={(e) => handleSubmit(e)} className="w-1/2 p-2 shadow bg-dark-500 rounded border"> */}

      <div className={`flex flex-wrap justify-around`}>
        {
          alreadyExistError
            ? <div className="text-red-500 flex p-4">
              <div>
                There is already a post with that data
              </div>
              <div
                className="pl-1 cursor-pointer"
                onClick={() => handleClearErrorAlreadyExist()}
              >
                <IconSquareRoundedX />
              </div>
            </div>
            : <div className="w-full">
              <div className="w-full flex-center p-4">
                <h5>New Post</h5>
              </div>
              <div className="w-full flex-center p-4">
                {
                  (newPost?.seller || newPost?.buyer) &&
                    newPost?.category &&
                    newPost?.price &&
                    newPost?.price > 0
                    ? <div className="flex justify-around w-full">
                      <div>
                        <button
                          type="submit"
                          onClick={(e) => handleSubmit(e, false)}
                        >
                          CREATE
                        </button>
                      </div>
                      <div>
                        <button
                          type="submit"
                          onClick={(e) => handleSubmit(e, true)}
                        >
                          CREATE & ONE MORE
                        </button>
                      </div>
                    </div>
                    : "Required field: Owner, Category and Price"
                }
              </div>
            </div>
        }
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className={`${postOwner === "Seller" ? "seller-bg-color" : postOwner === "Buyer" ? "buyer-bg-color" : ""} flex justify-around bg-gray-400 shadow-md rounded py-5 px-10`}>
          <div>
            <input
              id="seller-input"
              type="radio"
              name="post-owner"
              value="Seller"
              onChange={(e) => handlePostOwner(e)}
              checked={postOwner === "Seller" || false}
            />

            <label
              className="pl-1"
              htmlFor="seller-input"
            >
              Seller
            </label>
          </div>
          <div>
            <input
              id="buyer-input"
              type="radio"
              name="post-owner"
              value="Buyer"
              onChange={(e) => handlePostOwner(e)}
              checked={postOwner === "Buyer" || false}
            />
            <label
              className="pl-1"
              htmlFor="buyer-input"
            >
              Buyer
            </label>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-3 shadow-md rounded py-5 px-10">
          <div className="w-full">
            <AutoCompleteInputNewForm
              setNewPost={setNewPost}
              componentName={postOwner.toLowerCase() || "Choose a Seller or Buyer"}
              elements={ownersForInput}
              newPost={newPost}
            />

          </div>
          <div className="flex-center">
            <button
              onClick={handleGetAllCategories}
            >
              <IconRefresh
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-3 shadow-md rounded py-5 px-10">
          <div className="w-full">
            {/* <AutoCompleteInputNewForm
              setNew={setNewPost}
              componentName="category"
              elements={allCategories}
              newPost={newPost}
            /> */}
            <CategoriesInput
              handleFilter={setSelectedCategory}
            />
          </div>
          <div className="flex-center">
            <button
              onClick={handleGetAllCategories}
            >
              <IconRefresh
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto text-[18px]">
        <div className="flex flex-wrap shadow-md rounded py-5 px-10 gap-3">
          <div className="w-[90px] mb-4">
            <label
              htmlFor="price-input"
              className="text-black font-bold"
            >
              Price
            </label>
          </div>

          <div className="">
            <input
              className="rounded w-[100px] text-right px-1"
              id="price-input"
              type="text"
              name="price"
              onChange={(e) => handleNewPost(e)}
              value={newPost?.price || 0}
              placeholder="Price"
              onInput={handlePriceChange}
            />
            {
              newPost?.price === 0
                ? <div className={` text-center w-full text-sm`}>
                  Cannot be 0.
                </div>
                : ""
            }
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-wrap shadow-md rounded py-5 px-10 gap-3">
          <div className="w-[90px] mb-4">
            <label
              htmlFor="inputDescription"
              className="text-black font-bold"
            >
              Description
            </label>
          </div>
          <div className="">
            <textarea
              name="description"
              id="inputDescription"
              value={newPost?.description || ""}
              onChange={(e) => handleNewPost(e)}
              // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              className="w-full px-1 rounded"
              placeholder="What ever you want"
            />
          </div>
        </div>
      </div>

    </form >
  )
}
