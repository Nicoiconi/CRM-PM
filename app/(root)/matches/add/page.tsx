"use client"

import AddBuyerForm from './components/AddBuyerForm/AddBuyerForm'
import ReduxProvider from '@/lib/redux/ReduxProvider'

export default function AddBuyerPage() {
  return (
    <div>
      <ReduxProvider>
        <AddMatchForm />
      </ReduxProvider>
    </div>
  )
}
