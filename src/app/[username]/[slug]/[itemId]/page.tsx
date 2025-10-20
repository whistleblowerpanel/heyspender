"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ExternalLink, DollarSign, Loader2, Image as ImageIcon, CheckCircle, Eye, EyeOff, X, Mail } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';
import { getUserFriendlyError } from '@/lib/utils';
import { ReminderService } from '@/lib/reminderService';
import { z } from 'zod';

// Form validation schemas
const buyModalSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(15, 'Username must be less than 15 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const boughtModalSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(15, 'Username must be less than 15 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  quantity: z.number().min(1, 'Quantity must be at least 1')
});

const WishlistItemForm = () => {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;
  const itemId = params.itemId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [item, setItem] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyFormData, setBuyFormData] = useState({ email: '', username: '', password: '' });
  const [buyModalLoading, setBuyModalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buyModalErrors, setBuyModalErrors] = useState<any>(null);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [boughtModalOpen, setBoughtModalOpen] = useState(false);
  const [boughtFormData, setBoughtFormData] = useState({ email: '', username: '', password: '', quantity: 1 });
  const [boughtModalLoading, setBoughtModalLoading] = useState(false);
  const [showBoughtPassword, setShowBoughtPassword] = useState(false);
  const [boughtModalErrors, setBoughtModalErrors] = useState<any>(null);
  const [loggedInBoughtModalOpen, setLoggedInBoughtModalOpen] = useState(false);
  const [loggedInBoughtQuantity, setLoggedInBoughtQuantity] = useState(1);
  const [cashModalOpen, setCashModalOpen] = useState(false);

  useEffect(() => {
    if (user && !user.email_confirmed_at) {
      setShowVerificationBanner(true);
      const timer = setTimeout(() => {
        setShowVerificationBanner(false);
      }, 30000);
      return () => clearTimeout(timer);
    } else {
      setShowVerificationBanner(false);
    }
  }, [user]);

  const fetchItemData = useCallback(async () => {
    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*, user:users!inner(full_name, username, email)')
        .eq('slug', slug)
        .eq('user.username', username)
        .single();

      if (wishlistError || !wishlistData) {
        router.push('/');
        return;
      }

      setWishlist(wishlistData);

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
        router.push(`/${username}/${slug}`);
        return;
      }

      setItem(itemData);
    } catch (error) {
      console.error('Error fetching item data:', error);
    } finally {
      setLoading(false);
    }
  }, [username, slug, itemId, router]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  const handleBuyViaLink = () => {
    if (item?.product_url) {
      if (user) {
        window.open(item.product_url, '_blank');
      } else {
        setBuyModalOpen(true);
      }
    }
  };

  const handleBuyModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyModalLoading(true);
    setBuyModalErrors(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: buyFormData.email,
        password: buyFormData.password,
        options: {
          data: {
            username: buyFormData.username,
            full_name: buyFormData.username,
            role: 'user'
          }
        }
      });

      if (authError) {
        setBuyModalErrors({ general: [authError.message] });
        setBuyModalLoading(false);
        return;
      }

      if (authData.user) {
        await supabase
          .from('claims')
          .insert({
            wishlist_item_id: item.id,
            supporter_user_id: authData.user.id,
            supporter_contact: buyFormData.email,
            status: 'confirmed',
            expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        await supabase
          .from('wishlist_items')
          .update({ qty_claimed: (item.qty_claimed || 0) + 1 })
          .eq('id', item.id);
      }

      setBuyModalOpen(false);
      setShowVerificationBanner(true);
      if (item?.product_url) {
        window.open(item.product_url, '_blank');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setBuyModalLoading(false);
  };

  const handleBuyModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBuyFormData(prev => ({ ...prev, [id]: value }));
  };

  const getProductDomain = () => {
    if (!item?.product_url) return 'the store';
    try {
      const url = new URL(item.product_url);
      return url.hostname.replace('www.', '');
    } catch {
      return 'the store';
    }
  };

  const handleSendCash = () => {
    if (!user) {
      setCashModalOpen(true);
      return;
    }
    
    handleCashWithoutAccount();
  };

  const handleCashWithoutAccount = async () => {
    setCashModalOpen(false);
    setPaymentProcessing(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        toast({ 
          variant: 'destructive', 
          title: 'Configuration Error', 
          description: 'Payment system is not configured. Please contact support.' 
        });
        setPaymentProcessing(false);
        return;
      }

      const reference = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Load Paystack script
      const loadPaystackScript = () => {
        return new Promise((resolve, reject) => {
          if (window.PaystackPop) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      await loadPaystackScript();

      const itemPrice = item?.unit_price_estimate || item?.price || 0;
      const amountInKobo = Math.round(itemPrice * 100);

      if (amountInKobo <= 0) {
        toast({ 
          variant: 'destructive', 
          title: 'Invalid Amount', 
          description: 'Item price is not set. Please contact the wishlist owner.' 
        });
        setPaymentProcessing(false);
        return;
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: user?.email || 'guest@heyspender.com',
        amount: amountInKobo,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Item',
              variable_name: 'item_name',
              value: item?.name || 'Wishlist Item'
            },
            {
              display_name: 'Wishlist Owner',
              variable_name: 'wishlist_owner',
              value: wishlist?.user?.username || username
            },
            {
              display_name: 'Item ID',
              variable_name: 'item_id',
              value: item?.id
            }
          ]
        },
        onClose: () => {
          setPaymentProcessing(false);
          toast({ 
            title: 'Payment Cancelled', 
            description: 'You closed the payment window.' 
          });
        },
        callback: (response) => {
          console.log('Payment successful:', response);
          toast({ 
            title: 'Payment Successful!', 
            description: `Thank you for contributing ₦${(amountInKobo / 100).toLocaleString()} to ${item?.name}!` 
          });
          setPaymentProcessing(false);
          // Redirect to spender list
          router.push('/dashboard/spender-list');
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Payment Error', 
        description: 'Failed to initialize payment. Please try again.' 
      });
      setPaymentProcessing(false);
    }
  };

  const handleBoughtAlready = () => {
    if (!user) {
      setBoughtModalOpen(true);
      return;
    }
    
    setLoggedInBoughtModalOpen(true);
  };

  const handleLoggedInBoughtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loggedInBoughtQuantity || loggedInBoughtQuantity < 1) {
      return;
    }

    setActionLoading(true);

    try {
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .insert({
          wishlist_item_id: item.id,
          supporter_user_id: user.id,
          supporter_contact: user.email,
          status: 'confirmed',
          amount_paid: (item.unit_price_estimate || 0) * loggedInBoughtQuantity,
          expire_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (claimError) {
        console.error('Claim error:', claimError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: getUserFriendlyError(claimError, 'claiming this item'),
        });
        setActionLoading(false);
        return;
      }

      await supabase
        .from('wishlist_items')
        .update({ qty_claimed: (item.qty_claimed || 0) + loggedInBoughtQuantity })
        .eq('id', item.id);

      // Create automatic reminder
      try {
        await ReminderService.createAutomaticReminder({
          claimId: claimData.id,
          spenderEmail: user.email,
          spenderUsername: user.user_metadata?.username || user.email?.split('@')[0],
          itemName: item.name,
          itemPrice: item.unit_price_estimate || 0,
          quantity: loggedInBoughtQuantity
        });
        console.log('✅ Automatic reminder created for claim:', claimData.id);
      } catch (reminderError) {
        console.error('❌ Error creating automatic reminder:', reminderError);
      }

      toast({
        title: 'Item Claimed!',
        description: `You've successfully claimed ${loggedInBoughtQuantity} ${item.name}(s). We'll send you reminders to complete your payment.`,
      });

      setLoggedInBoughtModalOpen(false);
      router.push('/dashboard/spender-list');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err, 'claiming this item'),
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
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

  if (!item || !wishlist) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
          <Gift className="w-20 h-20 text-brand-purple-dark mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-brand-purple-dark">Item Not Found</h1>
          <p className="text-gray-600 mt-2">The item you are looking for does not exist or has been moved.</p>
          <Button onClick={() => router.push('/')} variant="custom" className="mt-6 bg-brand-orange text-black">
            Go Home
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const isFullyClaimed = (item.qty_claimed || 0) >= item.qty_total;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Verification Banner */}
        {showVerificationBanner && (
          <div className="fixed top-0 left-0 right-0 z-[100001] bg-brand-orange border-b-2 border-black shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-black">
                      Please verify your email address
                    </p>
                    <p className="text-xs text-black/80 hidden sm:block">
                      Check your inbox and click the verification link to activate your account.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerificationBanner(false)}
                  className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`min-h-screen flex items-center justify-center py-4 sm:py-6 md:py-8 ${showVerificationBanner ? 'pt-16 sm:pt-20' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
            {/* Back Navigation */}
            <div className="mb-4 sm:mb-6">
              <Link 
                href={`/${username}/${slug}`}
                className="inline-flex items-center text-brand-purple-dark hover:text-brand-purple-dark/80 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {wishlist.user.full_name}'s Wishlist
              </Link>
            </div>

            {/* Main Item Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-black overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-5 md:p-6">
                {/* Left Side - Product Image */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-sm lg:max-w-md aspect-square bg-gray-100 overflow-hidden">
                    {item.image_url ? (
                      <img 
                        alt={item.name} 
                        src={item.image_url} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                    )}
                  </div>
                  
                  {isFullyClaimed && (
                    <div className="mt-3 sm:mt-4 flex items-center gap-2 text-brand-green font-semibold text-sm sm:text-base">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Fully Claimed!
                    </div>
                  )}
                </div>

                {/* Right Side - Product Details */}
                <div className="flex flex-col">
                  <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      {item.name}
                    </h1>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-sm sm:text-base">
                        Desired: <span className="font-bold">{item.qty_total}</span> — 
                        Purchased: <span className="font-bold">{item.qty_claimed || 0}</span>
                      </div>
                      
                      {item.unit_price_estimate && (
                        <div className="text-xl sm:text-2xl font-bold text-brand-purple-dark">
                          ₦{Number(item.unit_price_estimate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-auto">
                    {item.product_url && (
                      <Button 
                        onClick={handleBuyViaLink}
                        variant="custom"
                        className="w-full bg-brand-green text-black hover:bg-brand-green/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buy This Item Via Link
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleSendCash}
                      disabled={isFullyClaimed || actionLoading || paymentProcessing}
                      variant="custom"
                      className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      {actionLoading || paymentProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Send the Cash
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleBoughtAlready}
                      disabled={actionLoading || paymentProcessing}
                      variant="custom"
                      className="w-full bg-brand-orange text-black hover:bg-brand-orange/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      I Bought this Item Already
                    </Button>
                    
                    {isFullyClaimed && (
                      <p className="text-xs sm:text-sm text-brand-green text-center flex items-center justify-center gap-2 flex-wrap pt-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Target reached! Extra contributions welcome 🎉</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Buy Modal */}
        <Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">Before you buy this item at {getProductDomain()}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                Create a light account to reserve this item. A verification link will be sent to your email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBuyModalSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={buyFormData.email} 
                    onChange={handleBuyModalInputChange} 
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                </div>

                <div>
                  <Label htmlFor="username" className="text-xs sm:text-sm font-medium">Username*</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    value={buyFormData.username} 
                    onChange={handleBuyModalInputChange}
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                    maxLength={15}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Create a Password*</Label>
                  <div className="relative mt-1">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={buyFormData.password} 
                      onChange={handleBuyModalInputChange}
                      placeholder=""
                      className="text-sm sm:text-base pr-10 h-10 sm:h-11 border-2 border-black"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 sm:mt-6">
                <Button 
                  type="submit" 
                  disabled={buyModalLoading}
                  className="w-full bg-brand-green text-black hover:bg-brand-green/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                >
                  {buyModalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Submit & Continue'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Cash Modal for non-logged-in users */}
        <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Send Cash for {item?.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                You need to be logged in to send cash. Please log in or create an account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Amount: ₦{item?.unit_price_estimate ? Number(item.unit_price_estimate).toLocaleString() : 'Price TBD'}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full sm:w-auto text-sm h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={() => {
                  setCashModalOpen(false);
                  router.push('/auth/login');
                }}
                className="w-full sm:w-auto bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
              >
                Login to Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logged In User - Bought Modal */}
        <Dialog open={loggedInBoughtModalOpen} onOpenChange={setLoggedInBoughtModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">Confirm Your Purchase</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                Enter the quantity you've purchased for "{item?.name}"
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLoggedInBoughtSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="logged-in-quantity" className="text-xs sm:text-sm font-medium">Quantity Purchased*</Label>
                  <Input 
                    id="logged-in-quantity" 
                    type="number" 
                    min="1"
                    value={loggedInBoughtQuantity} 
                    onChange={(e) => setLoggedInBoughtQuantity(parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {item?.qty_total} | Already claimed: {item?.qty_claimed || 0}
                  </p>
                  <p className="text-xs text-brand-green mt-1">
                    💡 You can buy more than requested to show extra generosity!
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={actionLoading}
                    className="w-full sm:w-auto text-sm h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={actionLoading}
                  className="w-full sm:w-auto bg-brand-green text-black hover:bg-brand-green/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Purchase'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

const WishlistItemPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
      </div>
    }>
      <WishlistItemForm />
    </Suspense>
  );
};

export default WishlistItemPage;
