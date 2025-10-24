import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — HeySpender',
  description: 'Welcome back! Sign in to your HeySpender account to manage your wishlists and continue making dreams come true.',
  keywords: 'login, sign in, HeySpender account, access wishlist',
  openGraph: {
    title: 'Login — HeySpender',
    description: 'Welcome back! Sign in to your HeySpender account to manage your wishlists and continue making dreams come true.',
    url: 'https://heyspender.com/login',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'Login to HeySpender - Access Your Wishlist Account',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login — HeySpender',
    description: 'Welcome back! Sign in to your HeySpender account to manage your wishlists and continue making dreams come true.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
