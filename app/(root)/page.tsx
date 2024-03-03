import { SignedOut, auth } from "@clerk/nextjs"
import MainDashboard from "./components/MainDashboard/MainDashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {

  const { userId } = auth()
  // console.log(userId, user, session)

  return (
    <main className="flex h-screen justify-center">
      {
        !userId
          ? <div className="text-[30px]">
            Welcome! Please log in.

            <SignedOut>
              <Button asChild className="button bg-cover">
                <Link href="/sign-in">
                  Login
                </Link>
              </Button>
            </SignedOut>
          </div>
          : <MainDashboard />
      }
    </main>
  )
}
