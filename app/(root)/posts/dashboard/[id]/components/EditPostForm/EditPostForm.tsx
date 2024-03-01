import { updatePost } from "@/lib/actions/post.actions"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { setAllPosts, setPostById } from "@/lib/redux/slices/postsSlice/postsSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface Props {
  setEnableEdit: (value: boolean) => void
}

interface ExtendedUpdatePostParams extends UpdatePostParams {
  [key: string]: number | string | boolean | undefined
}

interface ExtendedPost extends Post {
  [key: string]: number | string | boolean | undefined;
}

export default function EditPostForm({ setEnableEdit }: Props) {

  const dispatch = useDispatch()

  const { allPosts, singlePost }: { allPosts: Post[], singlePost: ExtendedPost } = useSelector((state: Store) => state.posts)
  const { allMatches }: { allMatches: Match[] } = useSelector((state: Store) => state.matches)

  const [postMatches, setPostMatches] = useState(0)

  // const [newPostData, setNewPostData] = useState({
  //   description: singlePost?.description,
  //   price: singlePost?.price
  // })
  const [newPostData, setNewPostData] = useState<ExtendedUpdatePostParams>({})
  const [priceError, setPriceError] = useState(false)
  console.log(newPostData)

  const initialPrice = newPostData?.price !== undefined ? newPostData.price : singlePost?.price || ""
  const initialDescription = newPostData?.description !== undefined ? newPostData.description : singlePost?.description || ""

  useEffect(() => {
    const allMatchesCopy = structuredClone(allMatches || [])
    const allMatchesLength = allMatchesCopy?.filter(m =>
      (m?.buyerPost === singlePost?._id.toString() || m?.sellerPost === singlePost?._id.toString())
    ).length
    setPostMatches(allMatchesLength)
  }, [allMatches, singlePost])

  function handleEditDataPost(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target

    if (name === "price") {
      setPriceError(!value || Number(value) === 0)
    }

    if ((name === "price" ? Number(value) === singlePost[name] : value === singlePost[name])) {
      const newPostDataCopy = structuredClone(newPostData || {})
      delete newPostDataCopy[name]
      setNewPostData(newPostDataCopy)
    } else {
      setNewPostData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }
  // console.log(post)

  // function handleEditBooleansPost(e: React.ChangeEvent<HTMLInputElement>) {
  //   const { name, checked } = e.target
  //   if (checked) {
  //     setNewPostData(prevState => ({
  //       ...prevState,
  //       [name]: !singlePost[name]
  //     }))
  //   } else {
  //     setNewPostData(prevState => {
  //       const newState: UpdatePostParams = {};
  //       for (const key in prevState) {
  //         if (key !== name) {
  //           newState[key as keyof UpdatePostParams] = prevState[key as keyof UpdatePostParams];
  //         }
  //       }
  //       return newState;
  //     })
  //   }
  // }
  function handleEditBooleansPost(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    if (checked) {
      setNewPostData(prevState => ({
        ...prevState,
        [name]: !singlePost[name]
      }));
    } else {
      setNewPostData(prevState => {
        const newState: UpdatePostParams = { ...prevState } // Create a copy of prevState
        delete newState[name as keyof UpdatePostParams] // Remove the property with the specified name
        return newState;
      })
    }
  }

  async function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const existingPost = allPosts?.find(p => {
      return (
        (
          p?.buyer === singlePost?.buyer ||
          p?.seller === singlePost?.seller
        ) &&
        p?.category === singlePost?.category &&
        Number(p?.price) === Number(newPostData?.price) &&
        p?._id?.toString() !== singlePost?._id?.toString()
      )
    })
    if (existingPost) {
      e.preventDefault()
      dispatch(setFooterMessage({ message: "There is already a post with that Buyer, Category and Price", status: 409 }))
    }
    const updatedPost = await updatePost(singlePost?._id, newPostData)

    if (updatedPost) {
      const { message, status, object } = updatedPost
      if (status === 200) {
        const allPostsCopy = structuredClone(allPosts || [])
        const removeOldBuyer = allPostsCopy?.filter(b => b?._id?.toString() !== singlePost?._id?.toString())
        dispatch(setAllPosts([...removeOldBuyer, object]))
        dispatch(setPostById(object))
        dispatch(setFooterMessage({ message, status }))
        setEnableEdit(false)
      }
    } else {
      dispatch(setFooterMessage({ message: "Buyer update failed", status: 409 }))
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, "");
    e.target.value = newValue;
  }

  console.log(newPostData)

  return (
    <form
      onSubmit={(e) => handleSubmitEdit(e)}
      className="text-[20px] p-5"
    >
      <div className="pb-2 flex items-center gap-3">
        <button
          className="border py-1 px-2"
          disabled={
            Object.keys(newPostData).length === 0 || // No changes
            priceError || // Price cannot be 0
            (
              newPostData?.description === singlePost?.description &&
              Number(newPostData?.price) === Number(singlePost?.price)
            )
          }
        >
          EDIT
        </button>
        {
          priceError
            ? <div className="text-red-500 text-[16px]">
              Price cannot be 0.
            </div>
            : ""
        }
      </div>
      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="disable-input"
          >
            Price
          </label>
        </div>
        <div>
          <input
            className="rounded w-[100px] text-right px-1"
            id="number-input"
            type="text"
            name="price"
            value={initialPrice}
            onChange={(e) => handleEditDataPost(e)}
            onInput={handlePriceChange}
          />
        </div>
      </div>
      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="disable-input"
        >
          {singlePost?.disable ? "Enable?" : "Disable?"}
        </label>
        <input
          id="disable-input"
          type="checkbox"
          name="disable"
          onChange={(e) => handleEditBooleansPost(e)}
        />
      </div>
      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="activate-input"
          >
            {singlePost?.is_active ? "Deactivate?" : "Activate?"}
          </label>
        </div>
        <div className="pr-2">
          <input
            id="activate-input"
            type="checkbox"
            name="is_active"
            onChange={(e) => handleEditBooleansPost(e)}
            disabled={postMatches > 0}
          />
        </div>
        <div>
          {
            postMatches > 0
              ? <div>
                Cannot deactivate - {postMatches} matches active
              </div>
              : ""
          }
        </div>
      </div>
      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="description-input"
          >
            Description
          </label>
        </div>
        <textarea
          name="description"
          id="description-input"
          cols={20}
          rows={3}
          onChange={(e) => handleEditDataPost(e)}
          value={initialDescription}
          className="w-full px-1 rounded"
        />
      </div>
    </form>
  )
}
