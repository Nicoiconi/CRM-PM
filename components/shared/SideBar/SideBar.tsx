"use client"

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import FooterButton from "./FooterButton/FooterButton";

export default function SideBar() {

  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-[26px] font-bold flex gap-3 items-center">
            <Link href="/" >
              CRM
            </Link>
            <div className="cursor-pointer">
              <ThemeSwitch />
            </div>
          </div>
          <div className="text-[16px]">
            <Link href="/" >
              Potential Matches
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="header-nav_elements">
              <div className="sidebar-nav_elements">
                <Link
                  href="/"
                  className={`sidebar-nav_element p-2 ${pathname === "/" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
                >
                  Home
                </Link>

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
            </ul>

            <div className="sidebar-nav_elements">
              <FooterButton />

              <Link
                href="/profile"
                className={`sidebar-nav_element p-2 ${pathname === "matches" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
              >
                Profile
              </Link>

              <div className="cursor-pointer gap-2 p-2">
                <UserButton afterSignOutUrl="/" showName />
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}
