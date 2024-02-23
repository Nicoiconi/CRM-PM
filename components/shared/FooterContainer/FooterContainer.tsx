"use client"

import { useSelector } from "react-redux";
import Footer from "../Footer/Footer";

export default function FooterContainer() {

  const { hideFooter, footerPosition }: { footerMessage: FooterMessage, hideFooter: boolean, footerPosition: string } = useSelector((state: Store) => state.footer)
  console.log({ hideFooter, footerPosition })

  return (
    <div className={`fixed ${footerPosition === "left" ? "bottom-4" : "right-4 bottom-4"}`}>
      {
        hideFooter
          ? ""
          : <div >
            <Footer />
          </div>
      }
    </div>
  )
}
