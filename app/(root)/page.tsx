"use client"

import Link from "next/link"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import MainDashboard from "./components/MainDashboard/MainDashboard"
import { Button } from "@/components/ui/button"

export default function Home() {

  return (
    <main className="flex h-screen justify-center">

      <SignedOut>
        <div>
          <div className="text-[30px]">
            Welcome! Please log in.
          </div>
          <Button asChild className="button bg-cover">

            <Link href="/sign-in">
              Login
            </Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <MainDashboard />
      </SignedIn>
    </main>
  )
}
