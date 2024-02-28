import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Niconics CRM",
  description: "CRM for Potential Matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" suppressHydrationWarning>
    <html lang="en">
      <ClerkProvider appearance={{
        variables: {
          colorPrimary: "#624cf5"
        }
      }}>
        <body className={inter.className}>
            <Providers>
              {children}
            </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
