"use client"

import { getAllSellers } from '@/lib/actions/seller.actions'
import ReduxProvider from '@/lib/redux/ReduxProvider'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import SellersDashboard from './components/SellersDashboard/SellersDashboard'

export default function SellersDashboardPage() {

  // const { allSellers }: { allSellers: Client[] } = useSelector((state: Store) => state.sellers)

  // const allSellers = useRef()
  // const [sellersToRender, setSellersToRender] = useState<Client[]>()

  // useEffect(() => {
  //   const allSellersCopy = structuredClone(allSellers || [])
  //   setSellersToRender(allSellersCopy)
  // }, [allSellers])

  // async function handleGetAllSellers() {
  //   await getAllSellers()

  //   // if (fetchSellers) {
  //   //   setSellersToRender(fetchSellers)
  //   //   allSellers.current = fetchSellers
  //   // }
  // }

  // console.log("state", sellersToRender)

  return (
    <div>
      {/* <div>
        <button
          onClick={handleGetAllSellers}
        >
          Get All
        </button>
      </div> */}

      <ReduxProvider>
        <SellersDashboard />
      </ReduxProvider>

    </div>
  )
}
