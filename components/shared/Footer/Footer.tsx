'use client'

import { useSelector } from "react-redux"
import styles from "./Footer.module.css"
import { useEffect, useState } from "react"
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react"


export default function Footer() {

  const [className, setClassName] = useState('')
  const [hideMessage, setHideMessage] = useState(false)
  const { footerMessage, hideFooter, footerPosition }: { footerMessage: FooterMessage, hideFooter: boolean, footerPosition: string } = useSelector((state: Store) => state.footer)
  // console.log(respuestaAction);

  // const [expandFooter, setExpandFooter] = useState(true)

  useEffect(() => {
    if (footerMessage?.status >= 200 && footerMessage?.status <= 299) {
      // setClassName(`${styles.footer} ${styles.respuestaValida}`)
      setClassName(`bg-green-800 text-green-200`)
    } else if (footerMessage?.status === 500) {
      // setClassName(`${styles.footer} ${styles.respuestaErrorServidor}`)
      setClassName(`bg-red-800 text-red-200`)
    } else if (footerMessage?.status === 304) {
      // setClassName(`${styles.footer} ${styles.respuestaIdentica}`)
      setClassName(`bg-sky-800 text-sky-200`)
    } else if (footerMessage?.status >= 400 && footerMessage?.status <= 499) {
      // setClassName(`${styles.footer} ${styles.respuestaErrorSolicitud}`)
      setClassName(`bg-amber-800 text-amber-200`)
    }
  }, [footerMessage])

  function handleHideMessage() {
    setHideMessage(!hideMessage)
  }

  return (
    <>
      {
        !footerMessage
          ? ''
          : <footer className={`${styles.footer} ${className} flex justify-center`}>
            <div
              className="cursor-pointer"
              onClick={() => handleHideMessage()}
            >
              {
                hideMessage
                  ? <IconCaretLeftFilled />
                  : <IconCaretRightFilled />
              }
            </div>
            <div className={hideMessage ? "hidden" : ""}>
              {footerMessage?.message}
            </div>
          </footer >
      }
    </>
  )
}
