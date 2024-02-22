"use client"

import AddSellerForm from './components/AddSellerForm/AddSellerForm'
import ReduxProvider from '@/lib/redux/ReduxProvider'

export default function AddSellerPage() {
  return (
    <div>
      <ReduxProvider>
        <AddSellerForm />
      </ReduxProvider>
    </div>
  )
}
