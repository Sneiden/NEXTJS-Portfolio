import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display, IBM_Plex_Mono } from "next/font/google"
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
 
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif" 
});

const ibmMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500"], 
  variable: "--font-mono" 
});

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
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${ibmMono.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}