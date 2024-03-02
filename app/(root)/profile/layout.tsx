import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {

  const { userId, user, session } = auth()
  // console.log(userId, user, session)

  if (!userId) redirect("/sign-in")

  return (
    <div>
      {children}
    </div>
  )
}
