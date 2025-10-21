"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Clock, Loader2, Image as ImageIcon, Copy, QrCode as QrCodeIcon, Share2, Info, CheckCircle, X, PauseCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';
import { useConfetti } from '@/contexts/ConfettiContext';
import Confetti from '@/components/Confetti';
import GoalCard from '@/components/GoalCard';
import ItemCard from '@/components/ItemCard';

const Countdown = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = useState(formatDistanceToNow(parseISO(date), { addSuffix: true }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatDistanceToNow(parseISO(date), { addSuffix: true }));
    }, 60000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <div className="flex items-center justify-center space-x-2 text-white">
      <Clock className="w-5 h-5" />
      <span className="font-semibold">{timeLeft}</span>
    </div>
  );
};

const WishlistPageClient = ({ initialWishlist }: { initialWishlist?: any }) => {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();
  const [wishlist, setWishlist] = useState<any>(initialWishlist || null);
  const [items, setItems] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialWishlist);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showConfetti, setShowConfetti] = useState(false);

  const wishlistUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}/${slug}` : '';

  const fetchWishlistData = useCallback(async () => {
    setItemsLoading(true);
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active), goals(*, contributions(*))')
      .eq('slug', slug)
      .eq('user.username', username)
      .single();

    if (error || !data) {
      router.push('/');
      return;
    }
    
    setWishlist(data);
    setGoals(data.goals || []);

    const { data: itemsData, error: itemsError } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        claims (
          id,
          supporter_user_id,
          supporter_contact,
          status,
          created_at,
          amount_paid,
          supporter_user:users!supporter_user_id (
            username,
            full_name
          )
        )
      `)
      .eq('wishlist_id', data.id)
      .order('created_at', { ascending: false });

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    } else {
      setItems(itemsData || []);
    }

    setLoading(false);
    setItemsLoading(false);
  }, [slug, username, router]);

  useEffect(() => {
    if (!initialWishlist) {
      fetchWishlistData();
    } else {
      // Set the initial wishlist data
      setWishlist(initialWishlist);
      setGoals(initialWishlist.goals || []);
      
      // Still need to fetch items separately
      const fetchItems = async () => {
        setItemsLoading(true);
        const { data: itemsData, error: itemsError } = await supabase
          .from('wishlist_items')
          .select(`
            *,
            claims (
              id,
              supporter_user_id,
              supporter_contact,
              status,
              created_at,
              amount_paid,
              supporter_user:users!supporter_user_id (
                username,
                full_name
              )
            )
          `)
          .eq('wishlist_id', initialWishlist.id)
          .order('created_at', { ascending: false });

        if (itemsError) {
          console.error('Error fetching items:', itemsError);
        } else {
          setItems(itemsData || []);
        }
        setItemsLoading(false);
      };
      
      fetchItems();
      setLoading(false);
    }
  }, [initialWishlist]);

  // Celebration logic
  const celebrate = useMemo(() => {
    if (goals.length === 0 && items.length === 0) return false;
    
    const allGoalsReached = goals.length === 0 || goals.every(goal => 
      (goal.amount_raised || 0) >= goal.target_amount
    );
    
    const allItemsPaidAndNotClaimed = items.length === 0 || items.every(item => {
      const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
      if (!item.unit_price_estimate || totalAmountNeeded === 0) return false;
      
      const totalAmountPaid = (item.claims || []).reduce((sum, claim) => {
        return sum + (claim.amount_paid || 0);
      }, 0);
      
      const isPaidFor = totalAmountPaid >= totalAmountNeeded;
      const isNotClaimed = (item.qty_claimed || 0) === 0;
      
      return isPaidFor && isNotClaimed;
    });
    
    return allGoalsReached && allItemsPaidAndNotClaimed;
  }, [items, goals]);

  // Trigger confetti
  useEffect(() => {
    if (celebrate && !loading) {
      triggerConfetti(15000);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [celebrate, loading, triggerConfetti]);

  // Real-time subscriptions
  useEffect(() => {
    if (!wishlist?.id) return;

    const subscription = supabase
      .channel(`wishlist-${wishlist.id}-changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'wishlist_items',
          filter: `wishlist_id=eq.${wishlist.id}`
        }, 
        (payload) => {
          fetchWishlistData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [wishlist?.id, fetchWishlistData]);

  // Track views when wishlist is loaded
  useEffect(() => {
    const trackView = async () => {
      if (!wishlist?.id) return;
      
      const sessionKey = `viewed_wishlist_${wishlist.id}`;
      const hasViewed = sessionStorage.getItem(sessionKey);
      
      if (hasViewed) return;
      
      try {
        await supabase
          .from('wishlists')
          .update({ 
            views_count: (wishlist.views_count || 0) + 1 
          })
          .eq('id', wishlist.id);
        
        sessionStorage.setItem(sessionKey, 'true');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    
    trackView();
  }, [wishlist?.id, wishlist?.views_count]);

  // Handle window resize to update view mode
  useEffect(() => {
    const handleResize = () => {
      const newViewMode = window.innerWidth >= 1024 ? 'grid' : 'list';
      setViewMode(newViewMode);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateQrCode = async () => {
    if (qrCodeUrl) return;
    try {
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(wishlistUrl, { width: 160, margin: 2 });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Could not generate QR code:', err);
    }
  };

  const copyLink = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(wishlistUrl);
      toast({
        title: 'Link Copied!',
        description: 'Wishlist link has been copied to your clipboard.',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: wishlist.title,
          text: `Check out ${wishlist.title} wishlist!`,
          url: wishlistUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
        </div>
        <Footer />
      </>
    );
  }
  
  if (!wishlist) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
          <Gift className="w-20 h-20 text-brand-purple-dark mx-auto mb-4"/>
          <h1 className="text-3xl font-bold text-brand-purple-dark">Wishlist Not Found</h1>
          <p className="text-gray-600 mt-2">The wishlist you are looking for does not exist or has been moved.</p>
          <Button onClick={() => router.push('/')} variant="custom" className="mt-6 bg-brand-orange text-black">
            Go Home
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  // Check if user account is deactivated
  if (wishlist.user && wishlist.user.is_active === false) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 py-12">
          <PauseCircle className="w-32 h-32 md:w-40 md:h-40 text-amber-600 mx-auto mb-8"/>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-purple-dark mb-6">
            Wishlist Temporarily Unavailable
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-2xl leading-relaxed">
            <strong className="text-brand-purple-dark">{wishlist.user.full_name}'s</strong> wishlist is currently paused and temporarily unavailable. All wishlists will be back online once they reactivate their account. Please check back later!
          </p>
          <div className="mt-10 space-y-4">
            <Button onClick={() => router.push('/explore')} variant="custom" className="bg-brand-purple-dark text-white text-lg px-8 py-6 h-auto border-2 border-black shadow-[-4px_4px_0px_#000] hover:shadow-[-2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:brightness-90">
              Browse Other Wishlists
            </Button>
            <div>
              <Button onClick={() => router.push('/')} variant="custom" className="bg-brand-green text-black text-base px-6 py-4 h-auto border-2 border-black shadow-[-4px_4px_0px_#000] hover:shadow-[-2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:brightness-90">
                Go Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      {showConfetti && <Confetti active={true} duration={6000} />}
      <div className="min-h-screen bg-white">
        <header className="relative h-[500px] bg-brand-purple-dark flex items-center justify-center text-center p-4 pt-28 overflow-hidden">
          {wishlist.cover_image_url && (
            <img alt={wishlist.title} className="absolute top-0 left-0 w-full h-full object-cover opacity-20" src={wishlist.cover_image_url} />
          )}
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{wishlist.title}</h1>
            <p className="text-lg text-white/90 drop-shadow-md">A wishlist by <Link href={`/${wishlist.user.username}`} className="font-bold hover:underline">{wishlist.user.full_name}</Link> for their {wishlist.occasion}</p>
            {wishlist.wishlist_date && <Countdown date={wishlist.wishlist_date} />}
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4">
          {/* Share buttons */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Button 
                variant="custom" 
                className="bg-white text-black h-10 px-3 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
                onClick={copyLink}
              >
                <Copy className="w-4 h-4 mr-2"/>Copy Link
              </Button>
              <Button 
                variant="custom" 
                className="bg-white text-black h-10 w-10 p-0 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
                onClick={generateQrCode}
              >
                <QrCodeIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="custom" 
                className="bg-white text-black h-10 w-10 p-0 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
                onClick={handleShare} 
                title="Share wishlist"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {wishlist.story && (
            <section className="mb-16 text-center max-w-3xl mx-auto">
              <p className="text-lg text-gray-700">{wishlist.story}</p>
            </section>
          )}

          {goals.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">Cash Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map((goal, index) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    index={index} 
                    recipientEmail={wishlist.user.email} 
                    onContributed={fetchWishlistData} 
                  />
                ))}
              </div>
            </section>
          )}

          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-brand-purple-dark">Wishlist Items</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'custom' : 'outline'} 
                  className={`h-9 w-9 p-0 border-2 border-black ${
                    viewMode === 'grid' 
                      ? 'bg-brand-purple-dark text-white shadow-[-4px_4px_0px_#161B47]' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 12h18"></path>
                    <path d="M12 3v18"></path>
                  </svg>
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'custom' : 'outline'} 
                  className={`h-9 w-9 p-0 border-2 border-black ${
                    viewMode === 'list' 
                      ? 'bg-brand-purple-dark text-white shadow-[-4px_4px_0px_#161B47]' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="8" x2="21" y1="6" y2="6"></line>
                    <line x1="8" x2="21" y1="12" y2="12"></line>
                    <line x1="8" x2="21" y1="18" y2="18"></line>
                    <line x1="3" x2="3.01" y1="6" y2="6"></line>
                    <line x1="3" x2="3.01" y1="12" y2="12"></line>
                    <line x1="3" x2="3.01" y1="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
            </div>
            
            {itemsLoading ? (
              <div className="text-center py-16 px-8">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-purple-dark" />
                <p className="mt-4 text-gray-600">Loading wishlist items...</p>
              </div>
            ) : items.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'space-y-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0' : 'space-y-4'}>
                  {currentItems.map((item: any) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onClaimed={fetchWishlistData} 
                      username={username} 
                      slug={slug} 
                      viewMode={viewMode} 
                    />
                  ))}
                </div>
                
                <div className="text-center mt-6 text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length} items
                </div>
              </>
            ) : (
              <div className="text-center py-16 px-8 border-2 border-dashed border-gray-300">
                <Info className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold">No items yet</h3>
                <p className="mt-2 text-sm text-gray-500">The creator hasn't added any items to this wishlist.</p>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPageClient;
