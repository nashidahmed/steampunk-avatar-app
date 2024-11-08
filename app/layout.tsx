import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const wakeSnake = localFont({
  src: "./fonts/WakeSnake.woff",
  variable: "--font-wake-snake",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${wakeSnake.variable} antialiased`}>{children}</body>
    </html>
  )
}
