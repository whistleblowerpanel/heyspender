import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://heyspender.com'),
  title: 'HeySpender — Create Wishlists, Cash Goals & Share with your Spenders',
  description: 'Create wishlist, cash goals and share with Spender friends, and receive support. Organize your dreams and make it easy for people to contribute. Perfect for birthdays, weddings, graduations, and more.',
  keywords: 'wishlist, cash goals, gift registry, birthday gifts, wedding registry, graduation gifts, crowdfunding, contributions, Paystack, Flutterwave, Monnify',
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
    title: 'HeySpender — Create Wishlists, Cash Goals & Share with your Spenders',
    description: 'Create wishlist, cash goals and share with Spender friends, and receive support. Organize your dreams and make it easy for people to contribute. Perfect for birthdays, weddings, graduations, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'HeySpender',
    url: 'https://heyspender.com',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'HeySpender — Create Wishlists, Cash Goals & Share with your Spenders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeySpender — Create Wishlists, Cash Goals & Share with your Spenders',
    description: 'Create wishlist, cash goals and share with Spender friends, and receive support. Organize your dreams and make it easy for people to contribute. Perfect for birthdays, weddings, graduations, and more.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/',
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
        {/* Preload critical font files for mobile performance */}
        <link
          rel="preload"
          href="/fonts/space-grotesk/space-grotesk-400.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/space-grotesk/space-grotesk-600.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/space-grotesk/space-grotesk-700.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        
        {/* Import font CSS */}
        <link rel="stylesheet" href="/fonts/space-grotesk.css" />
        
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.webp" />
      </head>
      <body className="font-space-grotesk">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}