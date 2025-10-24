import { supabase } from '@/lib/customSupabaseClient';
import WishlistItemClient from './WishlistItemClient';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Server-side metadata generation for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string; itemId: string }> }): Promise<Metadata> {
  const { username, slug, itemId } = await params;
  
  try {
    // Fetch wishlist data on the server
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active)')
      .eq('slug', slug)
      .eq('user.username', username)
      .single();

    if (wishlistError || !wishlistData) {
      return {
        title: 'Item Not Found — HeySpender',
        description: 'The item you are looking for does not exist or has been moved.',
        openGraph: {
          title: 'Item Not Found — HeySpender',
          description: 'The item you are looking for does not exist or has been moved.',
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Item Not Found — HeySpender',
          description: 'The item you are looking for does not exist or has been moved.',
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
      };
    }

    // Check if user account is deactivated
    if (wishlistData.user && wishlistData.user.is_active === false) {
      return {
        title: 'Item Temporarily Unavailable — HeySpender',
        description: `${wishlistData.user.full_name}'s wishlist item is currently paused and temporarily unavailable.`,
        openGraph: {
          title: 'Item Temporarily Unavailable — HeySpender',
          description: `${wishlistData.user.full_name}'s wishlist item is currently paused and temporarily unavailable.`,
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Item Temporarily Unavailable — HeySpender',
          description: `${wishlistData.user.full_name}'s wishlist item is currently paused and temporarily unavailable.`,
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
      };
    }

    // Fetch item data on the server
    const { data: itemData, error: itemError } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('wishlist_id', wishlistData.id)
      .eq('id', itemId)
      .single();

    if (itemError || !itemData) {
      return {
        title: 'Item Not Found — HeySpender',
        description: 'The item you are looking for does not exist or has been moved.',
        openGraph: {
          title: 'Item Not Found — HeySpender',
          description: 'The item you are looking for does not exist or has been moved.',
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Item Not Found — HeySpender',
          description: 'The item you are looking for does not exist or has been moved.',
          images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
        },
      };
    }

    const title = `${itemData.name} — HeySpender`;
    const description = `${itemData.name} from ${wishlistData.user?.full_name || 'this user'}'s wishlist. Desired: ${itemData.qty_total} | Purchased: ${itemData.qty_claimed || 0}${itemData.unit_price_estimate ? ` | Price: ₦${Number(itemData.unit_price_estimate).toLocaleString()}` : ''}. Support their dreams and make their wishes come true.`;
    const image = itemData.image_url || wishlistData.cover_image_url || 'https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif';
    const url = `https://heyspender.com/${username}/${slug}/${itemId}`;

    return {
      title,
      description,
      keywords: `${itemData.name}, wishlist item, gift, support, contribution, ${wishlistData.occasion || 'special occasion'}, HeySpender`,
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
            alt: itemData.name,
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
      title: 'Wishlist Item — HeySpender',
      description: 'Check out this amazing wishlist item on HeySpender! Support their dreams and make their wishes come true.',
      openGraph: {
        title: 'Wishlist Item — HeySpender',
        description: 'Check out this amazing wishlist item on HeySpender! Support their dreams and make their wishes come true.',
        images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Wishlist Item — HeySpender',
        description: 'Check out this amazing wishlist item on HeySpender! Support their dreams and make their wishes come true.',
        images: ['https://hgvdslcpndmimatvliyu.supabase.co/storage/v1/object/public/HeySpender%20Media/General/1a727d42-4357-44f7-b87a-bb23983f153a-1761277292733-1pnpb2.avif'],
      },
    };
  }
}

// Server-side data fetching for initial page load
async function getItemData(username: string, slug: string, itemId: string) {
    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active)')
        .eq('slug', slug)
        .eq('user.username', username)
        .single();

      if (wishlistError || !wishlistData) {
      return null;
      }

      const { data: itemData, error: itemError } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          claims (
            id,
            supporter_user_id,
            supporter_contact,
            status,
            created_at,
            supporter_user:users!supporter_user_id (
              username,
              full_name
            )
          )
        `)
        .eq('wishlist_id', wishlistData.id)
        .eq('id', itemId)
        .single();

      if (itemError || !itemData) {
      return null;
      }

    return { item: itemData, wishlist: wishlistData };
    } catch (error) {
      console.error('Error fetching item data:', error);
    return null;
  }
}

const WishlistItemPage = async ({ params }: { params: Promise<{ username: string; slug: string; itemId: string }> }) => {
  const { username, slug, itemId } = await params;
  
  // Fetch initial item data on the server
  const initialData = await getItemData(username, slug, itemId);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
      </div>
    }>
      <WishlistItemClient initialData={initialData} />
    </Suspense>
  );
};

export default WishlistItemPage;