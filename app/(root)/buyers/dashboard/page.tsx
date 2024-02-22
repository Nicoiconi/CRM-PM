"use client"

import ReduxProvider from '@/lib/redux/ReduxProvider'
import BuyersDashboard from './components/BuyersDashboard/BuyersDashboard'


export default function BuyersDashboardPage() {

  return (
    <div>

      <ReduxProvider>
        <BuyersDashboard />
      </ReduxProvider>

    </div>
  )
}
