"use client"

import ReduxProvider from '@/lib/redux/ReduxProvider'
import BuyersDashboard from './components/MatchersDashboard/MatchersDashboard'


export default function BuyersDashboardPage() {

  return (
    <div>

      <ReduxProvider>
        <MatchesDashboard />
      </ReduxProvider>

    </div>
  )
}
