import { resetBuyersState } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { resetCategoriesState } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"
import { resetFooterState } from "@/lib/redux/slices/footerSlice/footerSlice"
import { resetMatchesState } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { resetPostsState } from "@/lib/redux/slices/postsSlice/postsSlice"
import { resetSellersState } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { useDispatch } from "react-redux"


export default function ResetsStatesButton() {

  const dispatch = useDispatch()

  function handleResetStates() {
    dispatch(resetBuyersState())
    dispatch(resetFooterState())
    dispatch(resetMatchesState())
    dispatch(resetPostsState())
    dispatch(resetSellersState())
    dispatch(resetCategoriesState())
  }

  return (
    <button
      className="border rounded-md py-1 px-2"
      onClick={() => handleResetStates()}
    >
      Reset states
    </button>
  )
}
