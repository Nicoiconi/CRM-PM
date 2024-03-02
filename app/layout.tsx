import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
    <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
          <Providers>
            {children}
          </Providers>
        </body>
    </html>
  );
}
