"use client"

import AddCategoryForm from './components/AddCategoryForm/AddCategoryForm'
import ReduxProvider from '@/lib/redux/ReduxProvider'

export default function AddCategoryPage() {
  return (
    <div>
      <ReduxProvider>
        <AddCategoryForm />
      </ReduxProvider>
    </div>
  )
}
