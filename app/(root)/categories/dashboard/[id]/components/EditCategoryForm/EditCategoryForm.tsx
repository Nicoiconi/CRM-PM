import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { updateCategory } from "@/lib/actions/category.actions"
import { setAllCategories, setCategoryById } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import { setFooterMessage } from "@/lib/redux/slices/footerSlice/footerSlice"
import { IconX } from "@tabler/icons-react"

interface Props {
  posts: CategoryPosts | undefined
  setEnableEdit: (value: boolean) => void
}

interface ExtendedUpdateCategoryParams extends UpdateCategoryParams {
  [key: string]: string | boolean | undefined;
}

interface ExtendedCategory extends Category {
  [key: string]: string | boolean | undefined;
}

export default function EditCategoryForm({ posts, setEnableEdit }: Props) {

  const dispatch = useDispatch()

  const { allCategories, singleCategory }: { allCategories: Category[], singleCategory: ExtendedCategory } = useSelector((state: Store) => state.categories)

  const [newCategoryData, setNewCategoryData] = useState<ExtendedUpdateCategoryParams>({})
  const [nameError, setNameError] = useState(false)

  const initialName = newCategoryData?.name !== undefined ? newCategoryData.name : singleCategory?.name || ""
  const initialDescription = newCategoryData?.description !== undefined ? newCategoryData.description : singleCategory?.description || ""

  function handleEditDataCategory(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target

    if (name === "name") {
      setNameError(!value || value.length < 3)
    }

    if (value === singleCategory[name]) {
      const newCategoryDataCopy = structuredClone(newCategoryData || {})
      delete newCategoryDataCopy[name]
      setNewCategoryData(newCategoryDataCopy)
    } else {
      setNewCategoryData(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  function handleEditBooleansCategory(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target
    if (checked) {
      setNewCategoryData(prevState => ({
        ...prevState,
        [name]: !singleCategory[name]
      }))
    } else {
      setNewCategoryData(prevState => {
        const newState: UpdateCategoryParams = {};
        for (const key in prevState) {
          if (key !== name) {
            newState[key as keyof UpdateCategoryParams] = prevState[key as keyof UpdateCategoryParams];
          }
        }
        return newState;
      })
    }
  }

  async function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let existingName
    if (newCategoryData?.name) {
      existingName = allCategories?.find(c => c?.name.toLowerCase().trim() === newCategoryData?.name?.toLowerCase().trim() && c?._id !== singleCategory?._id)
      if (existingName) {
        dispatch(setFooterMessage({ message: `Name ${existingName?.name} already exist.`, status: 409 }))
        return
      }
    }
    const updatedCategory = await updateCategory(singleCategory?._id, newCategoryData)
    if (updatedCategory) {
      const { message, status, object } = updatedCategory
      if (status === 200) {
        const allCategoriesCopy = structuredClone(allCategories || [])
        const removeOldCategory = allCategoriesCopy?.filter(c => c?._id?.toString() !== singleCategory?._id?.toString())
        dispatch(setAllCategories([...removeOldCategory, object]))
        dispatch(setCategoryById(object))
        setEnableEdit(false)
      }
      dispatch(setFooterMessage({ message, status }))
    } else {
      dispatch(setFooterMessage({ message: "Category update failed", status: 409 }))
    }
  }

  return (
    <form
      onSubmit={handleSubmitEdit}
      className="text-[20px] p-5"
    >
      <div className="pb-2 flex items-center gap-3">
        <button
          className="border-4 rounded py-1 px-2"
          disabled={
            Object.keys(newCategoryData).length === 0 || // No changes
            nameError || // Name length less than 3
            (
              newCategoryData.name === singleCategory.name && // Name is equal
              newCategoryData.description === singleCategory.description // Description is equal
            )
          }
        >
          EDIT
        </button>
        {
          nameError
            ? <div className="text-red-500 text-[16px]">
              Name length cannot be less than 3.
            </div>
            : ""
        }
      </div>

      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="name-input"
        >
          Name
        </label>
        <input
          className="px-1"
          id="name-input"
          name="name"
          type="text"
          onChange={(e) => handleEditDataCategory(e)}
          value={initialName}
        />
      </div>

      <div className="py-1">
        <label
          className="pr-3"
          htmlFor="disabled-input"
        >
          {singleCategory?.disabled ? "Enabled?" : "Disabled?"}
        </label>
        <input
          id="disabled-input"
          type="checkbox"
          name="disabled"
          onChange={(e) => handleEditBooleansCategory(e)}
        />
      </div>

      <div className="py-1 flex">
        <div>
          <label
            className="pr-3"
            htmlFor="activate-input"
          >
            {singleCategory?.is_active ? "Deactivate?" : "Activate?"}
          </label>
        </div>

        <div className="pr-2">
          <input
            id="activate-input"
            type="checkbox"
            name="is_active"
            onChange={(e) => handleEditBooleansCategory(e)}
            disabled={
              ((posts?.buyers?.posts && (posts?.buyers?.posts?.length > 0) || 0)) ||
              (posts?.sellers?.posts && (posts?.sellers?.posts?.length > 0 || 0)) ||
              false
            }
          />
        </div>

        {
          ((posts?.buyers?.posts && (posts?.buyers?.posts?.length > 0) || 0)) ||
            (posts?.sellers?.posts && (posts?.sellers?.posts?.length > 0 || 0))
            ? <div className="flex-center">
              <IconX className="text-red-500" /> - {(posts?.buyers?.posts?.length || 0) + (posts?.sellers?.posts?.length || 0)} posts active
            </div>
            : ""
        }
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
          className="px-1"
          name="description"
          id="description-input"
          cols={20}
          rows={3}
          onChange={(e) => handleEditDataCategory(e)}
          value={initialDescription}
        />
      </div>
    </form>
  )
}
