import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — HeySpender',
  description: 'Read the Terms of Service for using HeySpender\'s wishlist platform. Understand your rights and responsibilities when using our services.',
  keywords: 'terms of service, user agreement, HeySpender terms, legal, conditions',
  openGraph: {
    title: 'Terms of Service — HeySpender',
    description: 'Read the Terms of Service for using HeySpender\'s wishlist platform. Understand your rights and responsibilities when using our services.',
    url: 'https://heyspender.com/terms-of-service',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'HeySpender Terms of Service - Legal Agreement',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — HeySpender',
    description: 'Read the Terms of Service for using HeySpender\'s wishlist platform. Understand your rights and responsibilities when using our services.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/terms-of-service',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
