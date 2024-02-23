"use client"

import { useDispatch, useSelector } from "react-redux"
import { setFooterPosition, setHideFooter } from "@/lib/redux/slices/footerSlice/footerSlice"
import { usePathname } from "next/navigation"

export default function FooterButton() {

  const dispatch = useDispatch()

  const pathname = usePathname()

  const { hideFooter, footerPosition }: { footerMessage: FooterMessage, hideFooter: boolean, footerPosition: string } = useSelector((state: Store) => state.footer)

  function handleFotterPosition(value: string) {
    console.log(value)
    dispatch(setFooterPosition(value))
  }

  function handleHideFooter(value: boolean) {
    console.log(value)
    dispatch(setHideFooter(value))
  }

  return (
    <div
      className={`sidebar-nav_element justify-between p-2 ${pathname === "matches" ? "bg-purple-gradient text-white" : "text-gray-700"}`}
    >
      <div>
        Footer
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleFotterPosition("left")}
          disabled={footerPosition === "left" || false || hideFooter}
        >
          {"<"}
        </button>
        <button
          className={`border rounded-md flex justify-center p-1 cursor-pointer ${hideFooter ? "bg-zinc-600" : "bg-green-700"}`}
          onClick={() => handleHideFooter(!hideFooter)}
        >
          {
            hideFooter
              ? "OFF"
              : "ON"
          }
        </button>
        <button
          onClick={() => handleFotterPosition("right")}
          disabled={footerPosition === "right" || false || hideFooter}
        >
          {">"}
        </button>
      </div>
    </div>
  )
}
