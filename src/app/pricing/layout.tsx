import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — HeySpender',
  description: 'Simple pricing, powerful wishlists. Learn about HeySpender\'s transparent pricing structure for creating wishlist, cash goals and share.',
  keywords: 'pricing, cost, fees, wishlist pricing, HeySpender pricing, transparent pricing',
  openGraph: {
    title: 'Pricing — HeySpender',
    description: 'Simple pricing, powerful wishlists. Learn about HeySpender\'s transparent pricing structure for creating wishlist, cash goals and share.',
    url: 'https://heyspender.com/pricing',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'HeySpender Pricing - Simple and Transparent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — HeySpender',
    description: 'Simple pricing, powerful wishlists. Learn about HeySpender\'s transparent pricing structure for creating wishlist, cash goals and share.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
