
import AllGetsAllBar from "../AllGetsAllBar/AllGetsAllBar"
import BuyersTable from "../BuyersTable/BuyersTable"
import CategoriesTable from "../CategoriesTable/CategoriesTable"
import MatchesTable from "../MatchesTable/MatchesTable"
import PostsTable from "../PostsTable/PostsTable"
import SellersTable from "../SellersTable/SellersTable"

export default function MainDashboard() {

  return (
    <div className="w-full h-full">

      <div className="py-2">
        <AllGetsAllBar />
      </div>

      <div className="w-full p-3 flex flex-col gap-3 main-dashboard-tables">
        <div className="border max-w-fit w-full overflow-x-auto text-left">
          <BuyersTable />
        </div>

        <div className="border max-w-fit w-full overflow-x-auto text-left">
          <SellersTable />
        </div>

        <div className="border max-w-fit w-full overflow-x-auto text-left">
          <CategoriesTable />
        </div>

        <div className="border max-w-fit w-full overflow-x-auto text-left">
          <PostsTable />
        </div>

        <div className="border max-w-fit w-full overflow-x-auto text-left">
          <MatchesTable />
        </div>
      </div>

    </div>
  )
}
