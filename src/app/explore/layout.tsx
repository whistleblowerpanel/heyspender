import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Public Wishlists — HeySpender',
  description: 'Feeling generous? Browse public wishlists and make someone\'s day! Discover amazing wishlists from our community and support their dreams.',
  keywords: 'public wishlists, explore, browse, support, community, generous',
  openGraph: {
    title: 'Explore Public Wishlists — HeySpender',
    description: 'Feeling generous? Browse public wishlists and make someone\'s day! Discover amazing wishlists from our community and support their dreams.',
    url: 'https://heyspender.com/explore',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'Explore Public Wishlists on HeySpender - Support Community Dreams',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Public Wishlists — HeySpender',
    description: 'Feeling generous? Browse public wishlists and make someone\'s day! Discover amazing wishlists from our community and support their dreams.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/explore',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
