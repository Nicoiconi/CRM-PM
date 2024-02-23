"use client"

import ReduxProvider from "@/lib/redux/ReduxProvider"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider
    attribute="class"
    defaultTheme="system"
  >
    <ReduxProvider>
      {children}
    </ReduxProvider>
  </ThemeProvider>
}