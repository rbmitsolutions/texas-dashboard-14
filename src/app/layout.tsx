import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppProvider from '@/common/providers'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Texas Steakout",
  description: "Texas Steakout - Painel Control",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs14", "next14", "pwa", "next-pwa"],
  authors: [
    { name: "Raphael Brandão Mesquita" },
    {
      name: "Raphael Brandão Mesquita",
      url: "https://www.linkedin.com/in/raphael-mesquita-/",
    },
  ],
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.png" },
    { rel: "icon", url: "/icon-192x192.png" },
  ],
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
