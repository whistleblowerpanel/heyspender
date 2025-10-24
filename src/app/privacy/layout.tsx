import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — HeySpender',
  description: 'Learn how HeySpender collects, uses, and protects your personal information. Your privacy and data security are our top priorities.',
  keywords: 'privacy policy, data protection, security, personal information, HeySpender privacy',
  openGraph: {
    title: 'Privacy Policy — HeySpender',
    description: 'Learn how HeySpender collects, uses, and protects your personal information. Your privacy and data security are our top priorities.',
    url: 'https://heyspender.com/privacy-policy',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'HeySpender Privacy Policy - Data Protection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — HeySpender',
    description: 'Learn how HeySpender collects, uses, and protects your personal information. Your privacy and data security are our top priorities.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/privacy-policy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
