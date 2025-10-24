import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — HeySpender',
  description: 'Get in touch with the HeySpender team. We\'re here to help with any questions, concerns, or feedback about our wishlist platform.',
  keywords: 'contact HeySpender, support, help, feedback, customer service',
  openGraph: {
    title: 'Contact Us — HeySpender',
    description: 'Get in touch with the HeySpender team. We\'re here to help with any questions, concerns, or feedback about our wishlist platform.',
    url: 'https://heyspender.com/contact',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'Contact HeySpender - Get Help and Support',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — HeySpender',
    description: 'Get in touch with the HeySpender team. We\'re here to help with any questions, concerns, or feedback about our wishlist platform.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
