import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elio',
  description: 'Ton assistant personnel',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#7B9E9A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-elio-bg text-elio-text`}>{children}</body>
    </html>
  )
}
