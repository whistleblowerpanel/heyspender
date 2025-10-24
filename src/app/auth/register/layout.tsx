import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — HeySpender',
  description: 'Create your HeySpender account to start building wishlists and sharing your dreams. Join thousands of users making their wishes come true.',
  keywords: 'sign up, register, create account, join HeySpender, wishlist account',
  openGraph: {
    title: 'Sign Up — HeySpender',
    description: 'Create your HeySpender account to start building wishlists and sharing your dreams. Join thousands of users making their wishes come true.',
    url: 'https://heyspender.com/register',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'Sign Up for HeySpender - Create Your Wishlist Account',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up — HeySpender',
    description: 'Create your HeySpender account to start building wishlists and sharing your dreams. Join thousands of users making their wishes come true.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
