"use client"

import ReduxProvider from '@/lib/redux/ReduxProvider'


export default function CategoriesDashboardPage() {

  return (
    <div>

      <ReduxProvider>
        <CategoriesDashboard />
      </ReduxProvider>

    </div>
  )
}
