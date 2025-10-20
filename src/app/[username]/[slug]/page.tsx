import { supabase } from '@/lib/customSupabaseClient';
import WishlistPageClient from '@/components/WishlistPageClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;
  
  try {
    // Fetch wishlist data on the server
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active)')
      .eq('slug', slug)
      .eq('user.username', username)
      .single();

    if (error || !wishlist) {
      return {
        title: 'Wishlist Not Found — HeySpender',
        description: 'The wishlist you are looking for does not exist or has been moved.',
        openGraph: {
          title: 'Wishlist Not Found — HeySpender',
          description: 'The wishlist you are looking for does not exist or has been moved.',
          images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Wishlist Not Found — HeySpender',
          description: 'The wishlist you are looking for does not exist or has been moved.',
          images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
        },
      };
    }

    // Check if user account is deactivated
    if (wishlist.user && wishlist.user.is_active === false) {
      return {
        title: 'Wishlist Temporarily Unavailable — HeySpender',
        description: `${wishlist.user.full_name}'s wishlist is currently paused and temporarily unavailable.`,
        openGraph: {
          title: 'Wishlist Temporarily Unavailable — HeySpender',
          description: `${wishlist.user.full_name}'s wishlist is currently paused and temporarily unavailable.`,
          images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Wishlist Temporarily Unavailable — HeySpender',
          description: `${wishlist.user.full_name}'s wishlist is currently paused and temporarily unavailable.`,
          images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
        },
      };
    }

    const title = `${wishlist.title} — HeySpender`;
    const description = wishlist.story || `Check out ${wishlist.user?.full_name || 'this user'}'s wishlist for their ${wishlist.occasion || 'special occasion'}! Support their dreams and make their wishes come true.`;
    const image = wishlist.cover_image_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp';
    const url = `https://heyspender.com/${username}/${slug}`;

    return {
      title,
      description,
      keywords: `wishlist, ${wishlist.occasion}, ${wishlist.user?.full_name}, HeySpender, gifts, support, dreams`,
      authors: [{ name: 'HeySpender Team' }],
      openGraph: {
        title,
        description,
        url,
        siteName: 'HeySpender',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: wishlist.title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
        site: '@heyspender',
        creator: '@heyspender',
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Wishlist — HeySpender',
      description: 'Check out this amazing wishlist on HeySpender! Support their dreams and make their wishes come true.',
      openGraph: {
        title: 'Wishlist — HeySpender',
        description: 'Check out this amazing wishlist on HeySpender! Support their dreams and make their wishes come true.',
        images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Wishlist — HeySpender',
        description: 'Check out this amazing wishlist on HeySpender! Support their dreams and make their wishes come true.',
        images: ['https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'],
      },
    };
  }
}


// Server-side data fetching for initial page load
async function getWishlistData(username: string, slug: string) {
  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active), goals(*, contributions(*))')
      .eq('slug', slug)
      .eq('user.username', username)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
      } catch (error) {
    console.error('Error fetching wishlist data:', error);
    return null;
  }
}

const WishlistPage = async ({ params }: { params: Promise<{ username: string; slug: string }> }) => {
  const { username, slug } = await params;
  
  // Fetch initial wishlist data on the server
  const initialWishlist = await getWishlistData(username, slug);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
      </div>
    }>
      <WishlistPageClient initialWishlist={initialWishlist} />
    </Suspense>
  );
};

export default WishlistPage;
