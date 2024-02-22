"use client"

import ReduxProvider from '@/lib/redux/ReduxProvider'
import PostsDashboard from './components/PostsDashboard/PostsDashboard'


export default function PostsDashboardPage() {

  return (
    <div>

      <ReduxProvider>
        <PostsDashboard />
      </ReduxProvider>

    </div>
  )
}
