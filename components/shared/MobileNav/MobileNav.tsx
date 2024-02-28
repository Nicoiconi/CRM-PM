"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch"
import FooterButton from "../SideBar/FooterButton/FooterButton"

export default function MobileNav() {

  const pathname = usePathname()
  return (
    <header className="header h-full">
      <div className="flex flex-col">
        <div className="text-[26px] font-bold flex gap-3 items-center">
          <Link href="/" >
            CRM
          </Link>
          <div className="cursor-pointer">
            <ThemeSwitch />
          </div>
        </div>
        <div className="text-[16px] overflow-hidden whitespace-nowrap truncate">
          <Link href="/" >
            Potential Matches
          </Link>
        </div>
      </div>

      <nav className="flex gap-2 h-full">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image
                src="/assets/menu.svg"
                alt="Menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>

            <SheetContent className="sheet-content sm:w-auto">
              <>
                <div>
                  <div>
                    Niconics
                  </div>
                  <div>
                    Potential Matches
                  </div>
                </div>

                <div className="flex flex-col gap-[60px]">
                  {/* <ul className="header-nav_elements"> */}
                  <div className="sidebar-nav_elements pt-[50px]">
                    <Link
                      href="/sellers/dashboard"
                      className={`sidebar-nav_element p-2 ${pathname === "sellers" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Sellers
                    </Link>

                    <Link
                      href="/buyers/dashboard"
                      className={`sidebar-nav_element p-2 ${pathname === "buyers" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Buyers
                    </Link>

                    <Link
                      href="/categories/dashboard"
                      className={`sidebar-nav_element p-2 ${pathname === "categories" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Categories
                    </Link>

                    <Link
                      href="/posts/dashboard"
                      className={`sidebar-nav_element p-2 ${pathname === "posts" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Posts
                    </Link>

                    <Link
                      href="/matches/dashboard"
                      className={`sidebar-nav_element p-2 ${pathname === "matches" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Matches
                    </Link>
                  </div>
                  {/* </ul> */}

                  <div className="sidebar-nav_elements">
                    <FooterButton />

                    <Link
                      href="/profile"
                      className={`sidebar-nav_element p-2 ${pathname === "matches" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">
              Login
            </Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}
