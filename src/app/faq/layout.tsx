import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — HeySpender',
  description: 'Find answers to common questions about HeySpender, wishlists, payments, and more. Get help with creating wishlist, cash goals and share, making contributions, and using our platform.',
  keywords: 'FAQ, help, support, questions, wishlist help, payment help, HeySpender guide',
  openGraph: {
    title: 'Frequently Asked Questions — HeySpender',
    description: 'Find answers to common questions about HeySpender, wishlists, payments, and more. Get help with creating wishlist, cash goals and share, making contributions, and using our platform.',
    url: 'https://heyspender.com/faq',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'HeySpender FAQ - Get Help and Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions — HeySpender',
    description: 'Find answers to common questions about HeySpender, wishlists, payments, and more. Get help with creating wishlist, cash goals and share, making contributions, and using our platform.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
