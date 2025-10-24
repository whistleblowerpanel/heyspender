import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — HeySpender',
  description: 'Forgot your password? No worries! Reset your HeySpender account password quickly and securely.',
  keywords: 'forgot password, reset password, password recovery, HeySpender login',
  openGraph: {
    title: 'Reset Password — HeySpender',
    description: 'Forgot your password? No worries! Reset your HeySpender account password quickly and securely.',
    url: 'https://heyspender.com/forgot-password',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif',
        width: 1200,
        height: 630,
        alt: 'Reset Password for HeySpender - Secure Password Recovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reset Password — HeySpender',
    description: 'Forgot your password? No worries! Reset your HeySpender account password quickly and securely.',
    images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/forgot-password',
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
