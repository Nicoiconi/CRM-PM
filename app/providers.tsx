"use client"

import ReduxProvider from "@/lib/redux/ReduxProvider"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider
    attribute="class"
    defaultTheme="system"
  >
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: "#624cf5"
      }
    }}>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </ClerkProvider>
  </ThemeProvider>
}