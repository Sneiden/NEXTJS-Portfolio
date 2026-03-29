import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// Geist is the font that comes with the Nova shadcn/ui preset
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// This metadata applies to the whole site by default.
// Individual pages can override specific fields like title and description.
export const metadata: Metadata = {
  title: {
    default: "My Portfolio",
    template: "%s | My Portfolio", // e.g. "About | My Portfolio"
  },
  description: "Welcome to my professional portfolio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}