import { useDispatch } from "react-redux"
import { resetBuyersState } from "./slices/buyersSlice/buyersSlice"
import { resetCategoriesState } from "./slices/categoriesSlice/categoriesSlice"
import { resetFooterState } from "./slices/footerSlice/footerSlice"
import { resetMatchesState } from "./slices/matchesSlice/matchesSlice"
import { resetPostsState } from "./slices/postsSlice/postsSlice"
import { resetSellersState } from "./slices/sellersSlice/sellersSlice"

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
