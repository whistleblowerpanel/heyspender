'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Clock, Loader2, Image as ImageIcon, Copy, QrCode as QrCodeIcon, Share2, Info, CheckCircle, X, PauseCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import QRCode from 'qrcode';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import Confetti from '@/components/Confetti';
import { useConfetti } from '@/contexts/ConfettiContext';
import { getUserFriendlyError } from '@/lib/utils';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';

// Helper function to get progress bar color based on percentage
const getProgressColor = (percentage) => {
  if (percentage >= 100) return 'bg-brand-green'; // Complete - Green
  if (percentage >= 75) return 'bg-brand-orange'; // Almost complete - Orange  
  if (percentage >= 50) return 'bg-brand-salmon'; // Halfway - Salmon
  if (percentage >= 25) return 'bg-brand-accent-red'; // Started - Accent Red
  return 'bg-brand-purple-dark'; // Just started - Purple Dark
};

// Helper function to calculate progress percentage
const calculateProgress = (raised, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((raised / target) * 100), 100);
};

const FormErrors = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="text-xs text-red-600 mt-1">
      {errors.map((error, i) => (
        <p key={i}>{error}</p>
      ))}
    </div>
  );
};

const Countdown = ({ date }) => {
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

const contributionSchema = z.object({
  amount: z.number().min(100, "Contribution must be at least ₦100."),
  displayName: z.string().optional(),
});


const WishlistPage = ({ wishlist: initialWishlist }) => {
  const { username, slug } = useParams();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();
  const [wishlist, setWishlist] = useState(initialWishlist || null);
  const [items, setItems] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const wishlistUrl = `${window.location.origin}/${username}/${slug}`;
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [viewMode, setViewMode] = useState(() => {
    // Set default view based on screen size
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 'grid' : 'list'; // lg breakpoint
    }
    return 'grid'; // fallback
  }); // 'grid' or 'list'

  const fetchWishlistData = useCallback(async () => {
    // No full page loader on re-fetch
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, user:users!inner(full_name, username, email, is_active), goals(*, contributions(*))')
      .eq('slug', slug)
      .eq('user.username', username)
      .single();

    if (error || !data) {
      toast({ variant: 'destructive', title: 'Wishlist not found' });
      setLoading(false);
      return;
    }
    
    setWishlist(data);
    setGoals(data.goals || []);
    
    // Update SEO for this wishlist
    const wishlistUrl = `/${username}/${slug}`;
    const customSEO = {
      title: `${data.title} — HeySpender`,
      description: data.story || `Check out ${data.user?.full_name || 'this user'}'s wishlist for their ${data.occasion || 'special occasion'}!`,
      image: data.cover_image_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'
    };
    updatePageSocialMedia(wishlistUrl, customSEO);

    // Add timestamp to force fresh data and avoid caching issues
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
        toast({ variant: 'destructive', title: 'Error fetching items'});
    } else {
        setItems(itemsData);
    }

    setLoading(false);
  }, [slug, username, toast]);

  const celebrate = useMemo(() => {
    // If there are no goals and no items, don't celebrate
    if (goals.length === 0 && items.length === 0) {
      return false;
    }
    
    // Check if all cash goals are 100% complete (only if there are goals)
    const allGoalsReached = goals.length === 0 || goals.every(goal => (goal.amount_raised || 0) >= goal.target_amount);
    
    // Check if all wishlist items are paid for and not claimed (only if there are items)
    const allItemsPaidAndNotClaimed = items.length === 0 || items.every(item => {
      // Calculate total amount needed for this item
      const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
      
      // If no price estimate, consider it as not paid for
      if (!item.unit_price_estimate || totalAmountNeeded === 0) {
        return false;
      }
      
      // Calculate total amount paid across all claims for this item
      const totalAmountPaid = (item.claims || []).reduce((sum, claim) => {
        return sum + (claim.amount_paid || 0);
      }, 0);
      
      // Item is paid for if total amount paid >= total amount needed
      const isPaidFor = totalAmountPaid >= totalAmountNeeded;
      
      // Item is not claimed if no quantity has been claimed yet
      const isNotClaimed = (item.qty_claimed || 0) === 0;
      
      return isPaidFor && isNotClaimed;
    });
    
    // Only celebrate when ALL cash goals are 100% AND all items are paid for and not claimed
    return allGoalsReached && allItemsPaidAndNotClaimed;
  }, [items, goals]);

  // Trigger confetti when wishlist becomes fully fulfilled
  useEffect(() => {
    if (celebrate && !loading) {
      // Trigger heavy confetti for 15 seconds when wishlist is fully fulfilled
      triggerConfetti(15000);
    }
  }, [celebrate, loading, triggerConfetti]);

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of items section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (celebrate) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 6000); // Confetti for 6 seconds
        return () => clearTimeout(timer);
    }
  }, [celebrate]);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);
  

  useEffect(() => {
    if (!initialWishlist) {
      setLoading(true);
      fetchWishlistData();
    } else {
      setLoading(false);
    }
  }, [fetchWishlistData, initialWishlist]);

  // Handle window resize to update view mode
  useEffect(() => {
    const handleResize = () => {
      const newViewMode = window.innerWidth >= 1024 ? 'grid' : 'list';
      setViewMode(newViewMode);
    };

    window.addEventListener('resize', handleResize);
    
    // Set initial view mode on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track views when wishlist is loaded
  useEffect(() => {
    const trackView = async () => {
      if (!wishlist?.id) return;
      
      // Check if this view has already been tracked in this session
      const sessionKey = `viewed_wishlist_${wishlist.id}`;
      const hasViewed = sessionStorage.getItem(sessionKey);
      
      if (hasViewed) return; // Don't count multiple views in same session
      
      try {
        // Increment views_count
        const { error } = await supabase
          .from('wishlists')
          .update({ 
            views_count: (wishlist.views_count || 0) + 1 
          })
          .eq('id', wishlist.id);
        
        if (!error) {
          // Mark as viewed in this session
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        // Silently fail - view tracking shouldn't disrupt user experience
      }
    };
    
    trackView();
  }, [wishlist?.id, wishlist?.views_count]);

  // Set up real-time subscription for wishlist items
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
          // Refresh the items data when changes occur
          fetchWishlistData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [wishlist?.id, fetchWishlistData]);

  // Set up real-time subscription for claims (when items are available)
  useEffect(() => {
    if (!wishlist?.id || items.length === 0) return;

    const subscription = supabase
      .channel(`claims-${wishlist.id}-changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'claims',
          filter: `wishlist_item_id=in.(${items.map(item => item.id).join(',')})`
        }, 
        (payload) => {
          // Refresh the items data when claims change
          fetchWishlistData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [wishlist?.id, items, fetchWishlistData]);

  const generateQrCode = async () => {
    if (qrCodeUrl) return;
    try {
        const url = await QRCode.toDataURL(wishlistUrl, { width: 160, margin: 2 });
        setQrCodeUrl(url);
    } catch (err) {
        toast({ variant: 'destructive', title: 'Could not generate QR code' });
    }
  };

  const copyLink = async () => {
    navigator.clipboard.writeText(wishlistUrl);
    toast({ title: 'Link copied to clipboard!' });
    
    // Track copy as a share
    if (wishlist?.id) {
      try {
        await supabase
          .from('wishlists')
          .update({ 
            shares_count: (wishlist.shares_count || 0) + 1 
          })
          .eq('id', wishlist.id);
      } catch (error) {
        console.error('Error tracking share:', error);
      }
    }
  };

  const refreshData = async () => {
    // Force a complete refresh by clearing state first
    setItems([]);
    setWishlist(null);
    await fetchWishlistData();
  };
  
  const handleShare = async () => {
    // Track share
    const trackShare = async () => {
      if (!wishlist?.id) return;
      
      try {
        await supabase
          .from('wishlists')
          .update({ 
            shares_count: (wishlist.shares_count || 0) + 1 
          })
          .eq('id', wishlist.id);
      } catch (error) {
        console.error('Error tracking share:', error);
      }
    };
    
    // Implement share functionality with refresh
    if (navigator.share) {
      try {
        await navigator.share({
          title: wishlist.title,
          text: `Check out ${wishlist.title} wishlist!`,
          url: wishlistUrl,
        });
        // Track successful share
        await trackShare();
        // Refresh data after sharing to ensure it's up to date
        await refreshData();
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to copy link if sharing fails
          copyLink();
          await refreshData();
        }
      }
    } else {
      // Fallback to copy link for browsers that don't support Web Share API
      copyLink();
      await refreshData();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" /></div>;
  }
  
  if (!wishlist) {
      return (
          <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
              <Gift className="w-20 h-20 text-brand-purple-dark mx-auto mb-4"/>
              <h1 className="text-3xl font-bold text-brand-purple-dark">Wishlist Not Found</h1>
              <p className="text-gray-600 mt-2">The wishlist you are looking for does not exist or has been moved.</p>
              <Link to="/"><Button variant="custom" className="mt-6 bg-brand-orange text-black">Go Home</Button></Link>
          </div>
      )
  }

  // Check if user account is deactivated
  if (wishlist.user && wishlist.user.is_active === false) {
      return (
          <div className="flex flex-col justify-center items-center min-h-screen text-center px-4 py-12">
              <PauseCircle className="w-32 h-32 md:w-40 md:h-40 text-amber-600 mx-auto mb-8"/>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-purple-dark mb-6">
                  Wishlist Temporarily Unavailable
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-2xl leading-relaxed">
                  <strong className="text-brand-purple-dark">{wishlist.user.full_name}'s</strong> wishlist is currently paused and temporarily unavailable. All wishlists will be back online once they reactivate their account. Please check back later!
              </p>
              <div className="mt-10 space-y-4">
                  <Link to="/explore">
                      <Button variant="custom" className="bg-brand-purple-dark text-white text-lg px-8 py-6 h-auto border-2 border-black shadow-[-4px_4px_0px_#000] hover:shadow-[-2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:brightness-90">
                          Browse Other Wishlists
                      </Button>
                  </Link>
                  <div>
                      <Link to="/">
                          <Button variant="custom" className="bg-brand-green text-black text-base px-6 py-4 h-auto border-2 border-black shadow-[-4px_4px_0px_#000] hover:shadow-[-2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:brightness-90">
                              Go Home
                          </Button>
                      </Link>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <>
      
      <Confetti active={showConfetti} />

      <div>
        <header className="relative h-[500px] bg-brand-purple-dark flex items-center justify-center text-center p-4 pt-28 overflow-hidden">
          {wishlist.cover_image_url && (
            <img alt={wishlist.title} className="absolute top-0 left-0 w-full h-full object-cover opacity-20" src={wishlist.cover_image_url} />
          )}
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{wishlist.title}</h1>
            <p className="text-lg text-white/90 drop-shadow-md">A wishlist by <Link to={`/${wishlist.user.username}`} className="font-bold hover:underline">{wishlist.user.full_name}</Link> for their {wishlist.occasion}</p>
            {wishlist.wishlist_date && <Countdown date={wishlist.wishlist_date} />}
          </div>
        </header>

        {celebrate && (
          <div className="relative -mt-8 z-40 px-4">
            <div className="flex justify-center">
              <div className="bg-brand-green text-black font-bold py-3 px-4 md:px-8 shadow-lg border-2 border-black max-w-[calc(100vw-2rem)] text-center">
                🎉 GOAL REACHED! Thank you for your generosity! 🎉
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto py-8 px-4">
            {/* Share buttons - on top of description */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <Button variant="custom" className="bg-white text-black h-10 px-3" onClick={copyLink}><Copy className="w-4 h-4 mr-2"/>Copy Link</Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="custom" className="bg-white text-black h-10 w-10 p-0" onClick={generateQrCode}>
                      <QrCodeIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    {qrCodeUrl ? <img alt="QR Code" src={qrCodeUrl} /> : <Loader2 className="w-10 h-10 animate-spin"/>}
                  </PopoverContent>
                </Popover>
                <Button variant="custom" className="bg-white text-black h-10 w-10 p-0" onClick={handleShare} title="Share wishlist">
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
                        {goals.map((goal, index) => <GoalCard key={goal.id} goal={goal} index={index} recipientEmail={wishlist.user.email} onContributed={fetchWishlistData} />)}
                    </div>
                </section>
            )}

            <section className="mb-12">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-brand-purple-dark">Wishlist Items</h2>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant={viewMode === 'grid' ? 'custom' : 'outline'} 
                            className={`h-9 w-9 p-0 ${viewMode === 'grid' ? 'bg-brand-purple-dark text-white' : ''}`}
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
                            className={`h-9 w-9 p-0 ${viewMode === 'list' ? 'bg-brand-purple-dark text-white' : ''}`}
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
                
                {items.length > 0 ? (
                    <>
                        <div className={viewMode === 'grid' ? 'space-y-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0' : 'space-y-4'}>
                            {currentItems.map(item => <ItemCard key={item.id} item={item} onClaimed={fetchWishlistData} username={username} slug={slug} viewMode={viewMode} />)}
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
    </>
  );
};

const ImagePreviewModal = ({ item, trigger }) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-4xl p-2 bg-transparent border-0">
                 <div className="relative">
                    <img alt={item.name} src={item.image_url} className="w-full h-auto object-contain max-h-[80vh]"/>
                 </div>
                 <DialogClose className="absolute -top-2 -right-2 bg-white p-1 text-brand-purple-dark">
                    <X className="h-6 w-6 stroke-2" />
                 </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

const ItemCard = ({ item, onClaimed, username, slug, viewMode }) => {
    const isFullyClaimed = (item.qty_claimed || 0) >= item.qty_total;
    const router = useRouter();

    // Check if item is actually paid for (not just claimed/reserved)
    const getPaidStatus = () => {
        if (!item.claims || item.claims.length === 0) {
            return { isPaid: false, spenders: [] };
        }
        
        // Calculate total amount needed for this item
        const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
        
        // If no price estimate, consider it as not paid for
        if (!item.unit_price_estimate || totalAmountNeeded === 0) {
            return { isPaid: false, spenders: [] };
        }
        
        // Calculate total amount paid across all claims for this item
        const totalAmountPaid = item.claims.reduce((sum, claim) => {
            return sum + (claim.amount_paid || 0);
        }, 0);
        
        // Item is fully paid for if total amount paid >= total amount needed
        const isFullyPaid = totalAmountPaid >= totalAmountNeeded;
        
        if (!isFullyPaid) {
            return { isPaid: false, spenders: [] };
        }
        
        // Find claims that have amount_paid > 0 and get spender usernames
        const paidClaims = item.claims.filter(claim => 
            claim.amount_paid > 0 && claim.supporter_user?.username
        );
        
        if (paidClaims.length === 0) {
            return { isPaid: false, spenders: [] };
        }
        
        // Get unique spender usernames
        const spenderUsernames = [...new Set(paidClaims.map(c => c.supporter_user.username))];
        
        return { 
            isPaid: true, 
            spenders: spenderUsernames,
            count: spenderUsernames.length
        };
    };

    const paidStatus = getPaidStatus();

    const handleClaimClick = () => {
        if (!isFullyClaimed) {
            console.log('Navigating to item:', { username, slug, itemId: item.id, itemName: item.name });
            navigate(`/${username}/${slug}/${item.id}`);
        }
    };

    return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`bg-white overflow-hidden ${viewMode === 'grid' ? 'border-2 border-black' : ''}`}
    >
        {viewMode === 'grid' ? (
            // Grid view - vertical cards
            <div className="flex flex-col h-full">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                    <ImagePreviewModal item={item} trigger={
                        <button className="w-full h-full">
                            {item.image_url ? 
                                <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-12 h-12"/></div>
                            }
                        </button>
                    } />
                </div>

                {/* Card content */}
                <div className="p-4 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
                        {item.name}
                    </h3>
                    
                    {/* Price and claimed info */}
                    <div className="text-sm font-semibold text-gray-900 mb-3 flex-shrink-0">
                        {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
                    </div>
                    
                    <Button 
                        variant="custom" 
                        className="bg-brand-green text-black disabled:bg-gray-300 w-full text-sm h-10 px-4 py-2 truncate border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90" 
                        disabled={isFullyClaimed} 
                        onClick={handleClaimClick}
                    >
                        {isFullyClaimed ? 
                            (paidStatus.isPaid ? 
                                (paidStatus.count === 1 ? 
                                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                                ) : 
                                'Claimed This!'
                            ) : 
                            'Odogwu, Pay for This.'
                        }
                    </Button>
                </div>
            </div>
        ) : (
            // List view - horizontal layout
            <div className="flex items-center">
                {/* Image */}
                <div className="relative w-[116px] h-[116px] bg-gray-100 flex-shrink-0">
                    <ImagePreviewModal item={item} trigger={
                        <button className="w-full h-full">
                            {item.image_url ? 
                                <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>
                            }
                        </button>
                    } />
                </div>

                {/* Card content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                        {item.name}
                    </h3>
                    
                    {/* Price and claimed info */}
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                        {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
                    </div>
                    
                    <Button 
                        variant="custom" 
                        className="bg-brand-green text-black disabled:bg-gray-300 w-full text-xs py-2 h-auto truncate" 
                        disabled={isFullyClaimed} 
                        onClick={handleClaimClick}
                    >
                        {isFullyClaimed ? 
                            (paidStatus.isPaid ? 
                                (paidStatus.count === 1 ? 
                                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                                ) : 
                                'Claimed This!'
                            ) : 
                            'Odogwu, Pay for This.'
                        }
                    </Button>
                </div>
            </div>
        )}
    </motion.div>
)};

const GoalCard = ({ goal, index, recipientEmail, onContributed }) => {
    const progress = goal.target_amount > 0 ? Math.round(((goal.amount_raised || 0) / goal.target_amount) * 100) : 0;
    const successfulContributions = goal.contributions?.filter(c => c.status === 'success') || [];

    // Get progress bar color based on percentage
    const getProgressBarColor = (percentage) => {
        if (percentage >= 100) return 'bg-brand-green'; // Complete - Green
        if (percentage >= 75) return 'bg-brand-orange'; // Almost complete - Orange  
        if (percentage >= 50) return 'bg-brand-salmon'; // Halfway - Salmon
        if (percentage >= 25) return 'bg-brand-accent-red'; // Started - Accent Red
        return 'bg-brand-purple-light'; // Just started - Purple Light
    };

    const progressColor = getProgressBarColor(progress);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-black p-6 bg-white flex flex-col h-full">
            <h3 className="text-2xl font-bold text-brand-purple-dark mb-4 min-h-[4rem] line-clamp-2">
                {goal.title}
            </h3>
            
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">Raised: ₦{Number(goal.amount_raised || 0).toLocaleString()}</span>
                    <span className="font-semibold">Target: ₦{Number(goal.target_amount).toLocaleString()}</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden border-2 border-black bg-gray-200">
                    <div 
                        className={`h-full transition-all ${progressColor}`} 
                        style={{
                            width: `${progress}%`, 
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px)'
                        }}
                    ></div>
                </div>
                <div className="text-left text-xs mt-1 text-gray-600">
                    <span>{progress}% Complete</span>
                </div>
            </div>

            <div className="mb-4">
                <ContributeModal 
                    goal={goal} 
                    recipientEmail={recipientEmail} 
                    onContributed={onContributed} 
                    trigger={
                        <Button 
                            variant="custom" 
                            className="w-full bg-brand-green text-black text-sm h-10 px-4 py-2 border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                        >
                            Contribute to this Goal
                        </Button>
                    } 
                />
            </div>

            {successfulContributions.length > 0 && (
                <div className="mt-auto">
                    <h4 className="font-semibold mb-2">Recent Spenders:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {successfulContributions.map(c => (
                            <div key={c.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{c.is_anonymous ? 'Anonymous Spender' : c.display_name} contributed ₦{Number(c.amount).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    )
}

const ContributeModal = ({ goal, recipientEmail, onContributed, trigger }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { user, isVerified, signInWithEmailPassword } = useAuth();
    const [formData, setFormData] = useState({ amount: '', displayName: '', isAnonymous: false });
    const [errors, setErrors] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loginData, setLoginData] = useState({ identifier: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Check verification status locally
    const userIsVerified = user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;
    
    // Also check if user is logged in (has a valid session)
    const [hasValidSession, setHasValidSession] = useState(false);
    
    // Helper function to get current session user
    const getCurrentSessionUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session?.user || null;
        } catch (error) {
            console.error('Error getting session user:', error);
            return null;
        }
    };
    
    // Refresh user state when modal opens
    useEffect(() => {
        if (open) {
            // Force refresh user session to get latest verification status
            supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('Modal opened - Fresh session:', { 
                    userId: session?.user?.id, 
                    email: session?.user?.email, 
                    isVerified: isVerified,
                    userIsVerified: userIsVerified,
                    emailConfirmedAt: session?.user?.email_confirmed_at,
                    hasSession: !!session,
                    sessionUser: session?.user
                });
                
                // Update session state
                setHasValidSession(!!session?.user);
                
                // If we have a session but no user in context, trigger auth state change
                if (session?.user && !user) {
                    console.log('Found session but no user in context - triggering auth refresh');
                    // Force auth state change by calling getSession again
                    supabase.auth.getSession();
                }
            });
        }
    }, [open, isVerified, userIsVerified, user]);

    // Auto-fill display name when modal opens and user is logged in
    useEffect(() => {
        if (open && user && !formData.isAnonymous) {
            setFormData(prev => ({ ...prev, displayName: user.user_metadata?.full_name || '' }));
        } else if (open && !user && !hasValidSession) {
            // Only reset form for truly anonymous users (no session)
            setFormData(prev => ({ ...prev, displayName: '', isAnonymous: false }));
            setShowLogin(false);
            setLoginData({ identifier: '', password: '' });
        }
    }, [open, user, hasValidSession]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setFormData({ amount: '', displayName: '', isAnonymous: false });
            setErrors(null);
            setShowLogin(false);
            setLoginData({ identifier: '', password: '' });
        }
    }, [open]);

    // Format number with commas
    const formatNumber = (value) => {
        // Remove any non-numeric characters except decimal point
        const numericValue = value.replace(/[^\d.]/g, '');
        // Split by decimal point to handle both integer and decimal parts
        const parts = numericValue.split('.');
        // Add commas to the integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // Handle amount input change
    const handleAmountChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatNumber(rawValue);
        setFormData({...formData, amount: formattedValue});
    };

    const handleContribution = async (e) => {
        e.preventDefault();
        setErrors(null);
        
        // Remove commas from amount for parsing
        const cleanAmount = formData.amount.replace(/,/g, '');
        const parsedAmount = parseFloat(cleanAmount);
        const validationResult = contributionSchema.safeParse({
            amount: isNaN(parsedAmount) ? undefined : parsedAmount,
            displayName: formData.displayName,
        });

        if (!validationResult.success) {
            setErrors(validationResult.error.flatten().fieldErrors);
            return;
        }

        // Get user info from context or session
        const currentUser = user || (hasValidSession ? await getCurrentSessionUser() : null);
        const contributorEmail = currentUser?.email || 'anonymous@heyspender.com';

        setIsProcessingPayment(true);

        try {
            // Generate a unique reference for this payment
            const paymentRef = `contribution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            console.log('Starting contribution payment process for amount:', parsedAmount);

            // Initialize Paystack payment
            const paystackResponse = await initializePaystackPayment({
                email: contributorEmail,
                amount: parsedAmount * 100, // Paystack expects amount in kobo
                currency: 'NGN',
                reference: paymentRef,
                metadata: {
                    goal_title: goal.title,
                    goal_id: goal.id,
                    recipient_email: recipientEmail,
                    display_name: formData.isAnonymous ? 'Anonymous' : (formData.displayName || currentUser?.user_metadata?.full_name || 'Anonymous Spender'),
                    is_anonymous: formData.isAnonymous,
                    sender_id: currentUser?.id || null,
                    type: 'goal_contribution'
                },
                callback: (response) => {
                    // Handle successful payment
                    handlePaymentSuccess(response, paymentRef, parsedAmount);
                },
                onClose: () => {
                    // Handle payment cancellation
                    handlePaymentCancellation(paymentRef);
                }
            });

            if (paystackResponse.error) {
                throw new Error(paystackResponse.error.message);
            }

        } catch (error) {
            console.error('Payment initialization error:', error);
            
            // Check if it's a hosted payment case (not a real error)
            if (error.message && error.message.includes('hosted payment page')) {
                // This is expected for development, don't show error
                console.log('Using hosted payment page as expected');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Payment failed',
                    description: getUserFriendlyError(error, 'initializing payment')
                });
            }
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Initialize Paystack payment using the centralized service
    const initializePaystackPayment = async (paymentData) => {
        const { initializePaystackPayment: initPayment } = await import('@/lib/paystackService');
        return initPayment(paymentData);
    };

    // Use hosted payment page (works around CORS issues)
    const useHostedPaymentPage = (paymentData) => {
        try {
            console.log('Using hosted payment page...');
            
            // Show payment instructions for development
            showPaymentInstructions(paymentData);
            
        } catch (error) {
            console.error('Hosted payment page failed:', error);
            toast({
                variant: 'destructive',
                title: 'Payment Error',
                description: getUserFriendlyError(error, 'processing payment')
            });
        }
    };

    // Show payment instructions for development
    const showPaymentInstructions = (paymentData) => {
        const amount = (paymentData.amount / 100).toLocaleString();
        const reference = paymentData.reference;
        const email = paymentData.email;
        const goalTitle = paymentData.metadata?.goal_title || 'Unknown goal';
        
        // Show detailed payment instructions
        toast({
            title: 'Payment Instructions',
            description: `Amount: ₦${amount} | Reference: ${reference.substring(0, 20)}...`,
            duration: 15000
        });
        
        // Log detailed instructions
        console.log('=== CONTRIBUTION PAYMENT INSTRUCTIONS ===');
        console.log(`Goal: ${goalTitle}`);
        console.log(`Amount: ₦${amount}`);
        console.log(`Reference: ${reference}`);
        console.log(`Email: ${email}`);
        console.log('=========================================');
        
        // Show a modal with payment details
        showPaymentModal(paymentData);
    };

    // Show payment modal with instructions
    const showPaymentModal = (paymentData) => {
        const amount = (paymentData.amount / 100).toLocaleString();
        
        // Create a simple modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        content.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Contribution Payment Instructions</h3>
            <p style="margin: 0 0 1rem 0; color: #666;">
                Due to development environment restrictions, please use the following details to complete payment:
            </p>
            <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                <p style="margin: 0.5rem 0;"><strong>Goal:</strong> ${paymentData.metadata?.goal_title || 'Unknown'}</p>
                <p style="margin: 0.5rem 0;"><strong>Amount:</strong> ₦${amount}</p>
                <p style="margin: 0.5rem 0;"><strong>Reference:</strong> ${paymentData.reference}</p>
                <p style="margin: 0.5rem 0;"><strong>Email:</strong> ${paymentData.email}</p>
                <p style="margin: 0.5rem 0;"><strong>Display Name:</strong> ${paymentData.metadata?.display_name || 'Anonymous'}</p>
            </div>
            <p style="margin: 1rem 0; color: #666; font-size: 0.9rem;">
                You can manually process this payment through your Paystack dashboard or contact support.
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
            ">Close</button>
        `;
        
        modal.className = 'modal';
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Auto-close after 30 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 30000);
    };

    // Handle successful payment
    const handlePaymentSuccess = async (response, paymentRef, amount) => {
        try {
            console.log('Processing successful contribution payment...');
            
            // Create contribution record
            const { data: contribution, error: contributionError } = await supabase
                .from('contributions')
                .insert({
                    goal_id: goal.id,
                    display_name: formData.isAnonymous ? null : (formData.displayName || user.user_metadata?.full_name),
                    is_anonymous: formData.isAnonymous,
                    amount: amount,
                    currency: 'NGN',
                    payment_provider: 'paystack',
                    payment_ref: paymentRef,
                    status: 'success'
                })
                .select()
                .single();

            if (contributionError) {
                throw contributionError;
            }

            // Update goal amount_raised
            const { error: goalUpdateError } = await supabase
                .from('goals')
                .update({
                    amount_raised: (goal.amount_raised || 0) + amount
                })
                .eq('id', goal.id);

            if (goalUpdateError) {
                throw goalUpdateError;
            }

            toast({
                title: 'Contribution successful!',
                description: `₦${amount.toLocaleString()} contributed to "${goal.title}"`
            });

            // Close modal and refresh data
            setOpen(false);
            onContributed();

        } catch (error) {
            console.error('Payment success handling error:', error);
            toast({
                variant: 'destructive',
                title: 'Payment processing error',
                description: 'Your payment was successful, but we encountered an issue recording it. Please contact support with your payment reference.'
            });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Handle payment cancellation
    const handlePaymentCancellation = async (paymentRef) => {
        console.log('Payment cancelled by user');
        toast({
            title: 'Payment cancelled',
            description: 'Payment was cancelled. You can try again anytime.'
        });
        setIsProcessingPayment(false);
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Starting login process...');
        setIsLoggingIn(true);
        
        const { identifier, password } = loginData;
        let email = identifier;

        try {
            // Check if identifier is a username and not an email
            if (!identifier.includes('@')) {
                console.log('Looking up username:', identifier);
                const { data: user, error } = await supabase
                    .from('users')
                    .select('email')
                    .eq('username', identifier)
                    .single();
                
                if (error || !user) {
                    console.log('Username lookup failed:', error);
                    toast({ 
                        variant: 'destructive', 
                        title: 'Login Failed', 
                        description: 'Username or email not found. Please check your credentials.' 
                    });
                    setIsLoggingIn(false);
                    return;
                }
                email = user.email;
                console.log('Found email for username:', email);
            }

            console.log('Attempting login with email:', email);
            const { data, error } = await signInWithEmailPassword({ email, password });

            if (error) {
                console.log('Login failed:', error);
                toast({ 
                    variant: 'destructive', 
                    title: 'Login Failed', 
                    description: 'Invalid credentials. Please check your email/username and password.' 
                });
            } else {
                console.log('Login successful:', data);
                toast({
                    title: 'Login successful!',
                    description: 'You can now continue with your contribution.'
                });
                setShowLogin(false);
                setLoginData({ identifier: '', password: '' });
                // Auto-fill display name for logged-in user
                if (data.user && !formData.isAnonymous) {
                    setFormData(prev => ({ 
                        ...prev, 
                        displayName: data.user.user_metadata?.full_name || '' 
                    }));
                }
            }
        } catch (error) {
            console.error('Unexpected error during login:', error);
            toast({ 
                variant: 'destructive', 
                title: 'Login Error', 
                description: 'An unexpected error occurred. Please try again.' 
            });
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Handle modal close - prevent closing during login attempts
    const handleModalClose = (newOpen) => {
        if (!newOpen && (isLoggingIn || isProcessingPayment)) {
            // Don't close if user is logging in or processing payment
            return;
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleModalClose}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent fullscreenOnMobile={false}>
                <DialogHeader>
                    <DialogTitle>Contribute to "{goal.title}"</DialogTitle>
                    <DialogDescription>
                        {(user || hasValidSession) ? 
                            (userIsVerified ? 
                                'Your contribution will help reach the goal. Secure payment powered by Paystack.' :
                                'Your contribution will help reach the goal. Please verify your email to access your dashboard. Secure payment powered by Paystack.'
                            ) :
                            'Anyone can contribute to help reach this goal! No account required. Secure payment powered by Paystack.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleContribution} className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input id="amount" type="text" placeholder="e.g., 5,000" value={formData.amount} onChange={handleAmountChange}/>
                         <FormErrors errors={errors?.amount} />
                    </div>
                    {(user || hasValidSession) ? (
                        // Logged in user - show display name and anonymous option
                        <>
                            {(!userIsVerified && (user || hasValidSession)) && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 mb-4">
                                    <div className="flex items-center">
                                        <Info className="w-4 h-4 text-yellow-600 mr-2" />
                                        <p className="text-sm text-yellow-800">
                                            <strong>Email verification pending:</strong> You can make contributions, but please check your email to verify your account for full access.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <Label htmlFor="displayName">Display Name (Optional)</Label>
                                <Input id="displayName" placeholder="e.g., John Doe" disabled={formData.isAnonymous} value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="is_anonymous" checked={formData.isAnonymous} onCheckedChange={checked => {
                                    const newIsAnonymous = checked === true;
                                    const newDisplayName = newIsAnonymous ? '' : (user?.user_metadata?.full_name || '');
                                    setFormData(prev => ({
                                        ...prev, 
                                        isAnonymous: newIsAnonymous, 
                                        displayName: newDisplayName
                                    }));
                                }}/>
                                <Label htmlFor="is_anonymous">Contribute Anonymously</Label>
                            </div>
                        </>
                    ) : (
                        // Anonymous user - show display name field and explain anonymous option
                        <>
                            <div>
                                <Label htmlFor="displayName">Your Name (Optional)</Label>
                                <Input id="displayName" placeholder="e.g., John Doe" disabled={formData.isAnonymous} value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                                <p className="text-xs text-gray-500 mt-1">Leave blank to contribute anonymously</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="is_anonymous" checked={formData.isAnonymous} onCheckedChange={checked => {
                                    const newIsAnonymous = checked === true;
                                    const newDisplayName = newIsAnonymous ? '' : formData.displayName;
                                    setFormData(prev => ({
                                        ...prev, 
                                        isAnonymous: newIsAnonymous, 
                                        displayName: newDisplayName
                                    }));
                                }}/>
                                <Label htmlFor="is_anonymous">Contribute Anonymously</Label>
                            </div>
                        </>
                    )}
                    
                    {/* Login option for non-logged-in users */}
                    {!user && !showLogin && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-3">Have an account? Login to continue with your saved information.</p>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowLogin(true)}
                                className="w-full border-2 border-brand-purple-dark text-brand-purple-dark hover:bg-brand-purple-dark hover:text-white mb-2"
                            >
                                Login to Continue
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                                Don't have an account? <Link to={`/register?returnTo=${encodeURIComponent(window.location.pathname)}`} className="text-brand-purple-dark hover:underline">Sign up here</Link>
                            </p>
                        </div>
                    )}
                    
                    {/* Login form */}
                    {showLogin && (
                        <div className="border-t pt-4 space-y-4">
                            <h4 className="font-semibold text-brand-purple-dark">Login to Continue</h4>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="login-identifier">Email or Username</Label>
                                    <Input 
                                        id="login-identifier" 
                                        type="text" 
                                        placeholder="Enter your email or username"
                                        value={loginData.identifier}
                                        onChange={e => setLoginData({...loginData, identifier: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input 
                                        id="login-password" 
                                        type="password" 
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={e => setLoginData({...loginData, password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setShowLogin(false)}
                                        className="flex-1 border-2 border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="button" 
                                        onClick={handleLogin}
                                        className="flex-1 bg-brand-purple-dark text-white border-2 border-brand-purple-dark hover:bg-brand-purple-dark/90"
                                        disabled={isLoggingIn}
                                    >
                                        {isLoggingIn ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Don't have an account? <Link to={`/register?returnTo=${encodeURIComponent(window.location.pathname)}`} className="text-brand-purple-dark hover:underline">Sign up here</Link>
                                </p>
                            </div>
                        </div>
                    )}
                    
                     <DialogFooter>
                        <Button 
                            variant="outline" 
                            type="button" 
                            disabled={isProcessingPayment || isLoggingIn} 
                            onClick={() => setOpen(false)}
                            className="border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="custom" className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" disabled={isProcessingPayment}>
                            {isProcessingPayment ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Pay with Paystack'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


export default WishlistPage;