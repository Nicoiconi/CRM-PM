import CategoriesInput from "@/app/(root)/categories/dashboard/components/CategoriesInput/CategoriesInput"

interface Props {
  handleOrders: (value: string) => void
  handleFilters: ({ name, value }: { name: string, value: string }) => void
}

export default function SearchSellersBar({ handleFilters, handleOrders }: Props) {

  function handleCategoryFilter(value: string) {
    handleFilters({ name: "category", value })
  }

  function filterByRange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    handleFilters({ name, value })
  }

  function handleOrderBy(e: React.MouseEvent<HTMLInputElement>) {
    const { value } = e.currentTarget as HTMLInputElement
    handleOrders(value)
  }

  return (
    <div className="w-full py-2 text-center items-center flex justify-around flex-wrap">

      <div className="flex items-center justify-around flex-wrap">
        <div className="w-[250px] px-4 py-2">
          <CategoriesInput
            handleFilter={handleCategoryFilter}
          />
        </div>

        <div className="w-auto flex px-1 items-center flex-wrap justify-around">
          <div className="flex py-1">
            <div className="px-1 flex items-center">
              <label
                htmlFor="min-profit"
              >
                min:
              </label>
            </div>
            <div className="px-1">
              <input
                name="min"
                className="w-[75px] p-1"
                id="min-profit"
                type="number"
                onChange={(e) => filterByRange(e)}
              />
            </div>
          </div>

          <div className="flex py-1">
            <div className="px-1 flex items-center">
              <label
                htmlFor="max-profit"
              >
                MAX:
              </label>
            </div>
            <div className="px-1">
              <input
                name="MAX"
                className="w-[75px] p-1"
                id="max-price"
                type="number"
                onChange={(e) => filterByRange(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-auto flex flex-wrap justify-around">

        <div className="w-auto flex justify-around py-2">
          <div>
            <input
              onClick={(e) => handleOrderBy(e)}
              value="Lower"
              name="order-price-time"
              type="radio"
              id="lower-input-order-price"
            />
            <label
              className="px-2"
              htmlFor="lower-input-order-price"
            >
              Lower
            </label>
          </div>
          <div>
            <input
              onClick={(e) => handleOrderBy(e)}
              value="Higher"
              name="order-price-time"
              type="radio"
              id="higher-input-order-price"
            />
            <label
              className="px-2"
              htmlFor="higher-input-order-price"
            >
              Higher
            </label>
          </div>
        </div>

        <div className="w-auto flex justify-around py-2">
          <div>
            <input
              onClick={(e) => handleOrderBy(e)}
              value="Newest"
              name="order-price-time"
              type="radio"
              id="newest-input-order-time"
            />
            <label
              className="px-2"
              htmlFor="newest-input-order-time"
            >
              Newest
            </label>
          </div>
          <div>
            <input
              onClick={(e) => handleOrderBy(e)}
              value="Oldest"
              name="order-price-time"
              type="radio"
              id="oldest-input-order-time"
            />
            <label
              className="px-2"
              htmlFor="oldest-input-order-time"
            >
              Oldest
            </label>
          </div>
        </div>

      </div>

    </div>
  )
}
