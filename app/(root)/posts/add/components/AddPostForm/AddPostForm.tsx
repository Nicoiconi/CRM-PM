"use client"

import { createPost } from "@/lib/actions/post.actions"
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addPostValidations } from "../../validiations/addPostValidations"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { setAllPosts } from "@/lib/redux/slices/postsSlice/postsSlice"
import { redirect } from "next/navigation"
import AutoCompleteInputNewForm from "../AutoCompleteInputNewForm/AutoCompleteInputNewForm"
import { IconSquareRoundedX } from "@tabler/icons-react"

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
  const [newPost, setNewPost] = useState<CreatePostParams>({
    seller: null,
    buyer: null,
    category: "",
    price: 0,
    description: ""
  })
  const [ownersForInput, setOwnersForInput] = useState<OwnersForInput[]>([])
  const [alreadyExistError, setAlreadyExistError] = useState(false)
  const [executeRedirect, setExecuteRedirect] = useState(false)
  // console.log(newPost)  

  useEffect(() => {
    if (executeRedirect) {
      redirect("/buyers/dashboard")
    }
  }, [executeRedirect])

  useEffect(() => {
    if (postOwner === "Buyer") {
      const buyersForInput = allBuyers?.map(b => ({ _id: b?._id, name: b?.name }))
      setOwnersForInput(buyersForInput)
    }
    if (postOwner === "Seller") {
      const sellersForInput = allSellers?.map(b => ({ _id: b?._id, name: b?.name }))
      setOwnersForInput(sellersForInput)
    }
  }, [postOwner])

  function handlePostOwner(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    if (value === "Seller") {
      setPostOwner("Seller")
      setNewPost((prevState) => ({
        ...prevState,
        buyer: null
      }))
    }
    if (value === "Buyer") {
      setPostOwner("Buyer")
      setNewPost((prevState) => ({
        ...prevState,
        seller: null
      }))
    }
  }

  function handleNewPost(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    setNewPost(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (postOwner === "Buyer") {
      const postAlreadyExist = allPosts.find((p: Post) =>
        p?.buyer === newPost?.buyer &&
        p?.category === newPost?.category &&
        Number(p?.price) === Number(newPost?.price)
      )
      if (postAlreadyExist) {
        e.preventDefault()
        setAlreadyExistError(true)
        // dispatch(setFooterMessage({ status: 409, message: `Buyer post >> ${postAlreadyExist?.buyer?.name} - ${postAlreadyExist?.category?.name} - $ ${postAlreadyExist?.price} << already existe` }))
        return
      }
      const createdPost = await createPost(newPost)
      if (createdPost && createdPost?._id) {
        if (createdPost && createdPost?._id) {
          const allPostsCopy = structuredClone(allPosts || [])
          dispatch(setAllPosts([...allPostsCopy, createdPost]))
          setExecuteRedirect(true)
        }
      }
    }
    if (postOwner === "Seller") {
      const postAlreadyExist = allPosts.find((p) =>
        p?.seller === newPost?.seller &&
        p?.category === newPost?.category &&
        Number(p?.price) === Number(newPost?.price)
      )
      if (postAlreadyExist) {
        e.preventDefault()
        setAlreadyExistError(true)
        // dispatch(setFooterMessage({ status: 409, message: `Seller post >> ${postAlreadyExist?.seller?.name} - ${postAlreadyExist?.category?.name} - $ ${postAlreadyExist?.price} << already existe` }))
        return
      }
      const createdPost = await createPost(newPost)
      if (createdPost && createdPost?._id) {
        if (createdPost && createdPost?._id) {
          const allPostsCopy = structuredClone(allPosts || [])
          dispatch(setAllPosts([...allPostsCopy, createdPost]))
          setExecuteRedirect(true)
        }
      }
    }
  }
  // console.log(newPost)

  function handleClearErrorAlreadyExist() {
    setAlreadyExistError(false)
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-1/2 p-2 shadow bg-gray-500">

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

            : <>
              <div className="w-1/2 p-4">
                <h5>New Post</h5>
              </div>
              <div className="w-1/2 p-4">
                {

                  (newPost?.seller || newPost?.buyer) && newPost?.category && newPost?.price
                    ? <button type="submit">CREATE</button>
                    : "Required field: Owner, Category and Price"
                }
              </div>
            </>
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
              // onClick={(e) => handlePostOwner(e)}
              onChange={(e) => handlePostOwner(e)}
              checked={postOwner === "Seller"}
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
              // onClick={(e) => handlePostOwner(e)}
              onChange={(e) => handlePostOwner(e)}
              checked={postOwner === "Seller"}
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
        <div className=" bg-gray-400 shadow-md rounded py-5 px-10">
          <AutoCompleteInputNewForm
            setNew={setNewPost}
            componentName={postOwner.toLowerCase()}
            elements={ownersForInput}
          />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className=" bg-gray-400 shadow-md rounded py-5 px-10">
          <AutoCompleteInputNewForm
            setNew={setNewPost}
            componentName="category"
            elements={allCategories}
          />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex bg-gray-400 shadow-md rounded p-5 px-10">
          <div className="w-1/4 mb-4">
            <label
              htmlFor="price-input"
              className="text-black text-sm font-bold"
            >
              Price
            </label>
          </div>

          <div className="w-auto px-4 w-full">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price-input"
              type="number"
              name="price"
              onChange={(e) => handleNewPost(e)}
              value={newPost?.price}
              placeholder="Price"
            />
            {
              newPost?.price === 0
                ? <div className={` text-center w-full text-sm`}>
                  The price cannot be 0.
                </div>
                : ""
            }
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex bg-gray-400 shadow-md rounded p-5 px-10">
          <div className="w-1/4 mb-4">
            <label
              htmlFor="inputDescription"
              className="text-black text-sm font-bold"
            >
              Description
            </label>
          </div>
          <div className="w-3/4 px-4">
            <textarea
              name="description"
              id="inputDescription"
              value={newPost?.description}
              onChange={(e) => handleNewPost(e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="What ever you want"
            />
          </div>
        </div>
      </div>

    </form >
  )
}
