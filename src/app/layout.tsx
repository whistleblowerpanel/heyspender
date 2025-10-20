import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://heyspender.com'),
  title: 'HeySpender - Smart Wishlist Management',
  description: 'Create, share, and manage your wishlists with smart features',
  keywords: 'wishlist, gifts, money, savings, goals',
  authors: [{ name: 'HeySpender Team' }],
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.webp',
  },
  openGraph: {
    title: 'HeySpender - Smart Wishlist Management',
    description: 'Create, share, and manage your wishlists with smart features',
    type: 'website',
    locale: 'en_US',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
        width: 1200,
        height: 630,
        alt: 'HeySpender - Smart Wishlist Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeySpender - Smart Wishlist Management',
    description: 'Create, share, and manage your wishlists with smart features',
    images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
    site: '@heyspender',
    creator: '@heyspender',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.webp" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}