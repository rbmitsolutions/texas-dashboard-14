import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppProvider from '@/common/providers'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Texas Steakout",
  description: "Texas Steakout - Painel Control",
  icons: {
    icon: "/public/logo/icon.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={twMerge("bg-background", inter.className)}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
