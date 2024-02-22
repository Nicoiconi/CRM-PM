"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavButton({ path, label }: NavButtonParams) {

  const pathname = usePathname()

  return (
    <Link
      href={path}
      className={`p-2 rounded ${pathname === path ? "bg-purple-400 text-white" : ""}`}
    >
      {label}
    </Link>
  )
}
