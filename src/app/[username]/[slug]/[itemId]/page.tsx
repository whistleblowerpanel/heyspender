"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ExternalLink, CreditCard, Loader2, Image as ImageIcon, CheckCircle, Eye, EyeOff, X, Mail, Lightbulb } from 'lucide-react';
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
import { initializePaystackPayment } from '@/lib/paystackService';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';
import { updateAllSEOTags, generateItemSEOData } from '@/lib/seoUtils';
import { z } from 'zod';

// Form validation schemas
const buyModalSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be less than 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const cashModalSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be less than 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  quantity: z.number().min(1, 'Quantity must be at least 1').optional()
});

const boughtModalSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be less than 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
  
  // Buy Modal States
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyFormData, setBuyFormData] = useState({ email: '', username: '', password: '' });
  const [buyModalLoading, setBuyModalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buyModalErrors, setBuyModalErrors] = useState<any>(null);
  
  // Cash Modal States
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [cashFormData, setCashFormData] = useState({ email: '', username: '', password: '', quantity: 1 });
  const [cashModalLoading, setCashModalLoading] = useState(false);
  const [showCashPassword, setShowCashPassword] = useState(false);
  const [cashModalErrors, setCashModalErrors] = useState<any>(null);
  const [cashQuantityModalOpen, setCashQuantityModalOpen] = useState(false);
  const [cashQuantity, setCashQuantity] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [guestPaymentModalOpen, setGuestPaymentModalOpen] = useState(false);
  const [guestQuantity, setGuestQuantity] = useState(1);
  
  // Bought Modal States
  const [boughtModalOpen, setBoughtModalOpen] = useState(false);
  const [boughtFormData, setBoughtFormData] = useState({ email: '', username: '', password: '', quantity: 1 });
  const [boughtModalLoading, setBoughtModalLoading] = useState(false);
  const [showBoughtPassword, setShowBoughtPassword] = useState(false);
  const [boughtModalErrors, setBoughtModalErrors] = useState<any>(null);
  const [loggedInBoughtModalOpen, setLoggedInBoughtModalOpen] = useState(false);
  const [loggedInBoughtQuantity, setLoggedInBoughtQuantity] = useState(1);
  
  // Verification Banner State
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

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
      
      // Update comprehensive SEO meta tags for this item
      if (itemData && wishlistData) {
        const baseUrl = 'https://heyspender.com';
        const seoData = generateItemSEOData(itemData, wishlistData, baseUrl);
        
        // Update all SEO tags including structured data
        updateAllSEOTags(seoData);
        
        // Also update legacy social media tags for compatibility
        const itemUrl = `/${username}/${slug}/${itemId}`;
        const customSEO = {
          title: seoData.title,
          description: seoData.description,
          image: seoData.image,
          keywords: seoData.keywords
        };
        updatePageSocialMedia(itemUrl, customSEO);
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
    } finally {
      setLoading(false);
    }
  }, [username, slug, itemId, router]);

  useEffect(() => {
    fetchItemData();
  }, [fetchItemData]);

  // ==================== BUY VIA LINK BUTTON ====================
  const handleBuyViaLink = async () => {
    if (!item?.product_url) {
      toast({
        variant: 'destructive',
        title: 'No Link Available',
        description: 'This item does not have a product link.'
      });
      return;
    }

    if (user) {
      // Logged-in users: directly open link and track
      window.open(item.product_url, '_blank');
      
      // Track shares_count
      await supabase
        .from('wishlists')
        .update({ shares_count: (wishlist.shares_count || 0) + 1 })
        .eq('id', wishlist.id);
    } else {
      // Unregistered users: show modal
      setBuyModalOpen(true);
    }
  };

  const handleBuyModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyModalLoading(true);
    setBuyModalErrors(null);

    // Validate form data
    try {
      buyModalSchema.parse(buyFormData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.issues.forEach((err: any) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = [];
          errors[field].push(err.message);
        });
        setBuyModalErrors(errors);
        setBuyModalLoading(false);
        return;
      }
    }

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
        const friendlyError = getUserFriendlyError(authError, 'creating account');
        
        // Check if account already exists
        if (authError.message.includes('already') || authError.message.includes('exists')) {
          toast({
            variant: 'destructive',
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please log in instead.'
          });
          setBuyModalOpen(false);
          router.push('/auth/login');
          return;
        }
        
        setBuyModalErrors({ general: [friendlyError] });
        setBuyModalLoading(false);
        return;
      }

      if (authData.user) {
        // Create claim
        await supabase
          .from('claims')
          .insert({
            wishlist_item_id: item.id,
            supporter_user_id: authData.user.id,
            supporter_contact: buyFormData.email,
            status: 'confirmed',
            expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        // Update qty_claimed
        await supabase
          .from('wishlist_items')
          .update({ qty_claimed: (item.qty_claimed || 0) + 1 })
          .eq('id', item.id);

        // Track shares_count
        await supabase
          .from('wishlists')
          .update({ shares_count: (wishlist.shares_count || 0) + 1 })
          .eq('id', wishlist.id);

        // Open product link in new tab
        window.open(item.product_url, '_blank');

        // Show success toast
        toast({
          title: 'Account Created!',
          description: 'Item added to your spender list. Redirecting to dashboard...'
        });

        // Close modal
        setBuyModalOpen(false);

        // Redirect to spender list dashboard
        setTimeout(() => {
          router.push('/dashboard/spender-list');
        }, 500);
        return;
      }

      setBuyModalOpen(false);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err as Error, 'creating account')
      });
    }

    setBuyModalLoading(false);
  };

  const handleBuyModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBuyFormData(prev => ({ ...prev, [id]: value }));
    // Clear errors for this field
    if (buyModalErrors?.[id]) {
      setBuyModalErrors((prev: any) => ({ ...prev, [id]: null }));
    }
  };

  const handleSkipBuyAccount = async () => {
    // Close modal and open link directly
    setBuyModalOpen(false);
    window.open(item.product_url, '_blank');
    
    // Track shares_count even when skipping
    await supabase
      .from('wishlists')
      .update({ shares_count: (wishlist.shares_count || 0) + 1 })
      .eq('id', wishlist.id);
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

  // ==================== SEND CASH BUTTON ====================
  const handleSendCash = async () => {
    if (isFullyClaimed) return;

    if (!user) {
      setCashModalOpen(true);
      return;
    }
    
    // For logged-in users
    const availableQuantity = item.qty_total - (item.qty_claimed || 0);
    
    if (availableQuantity > 1) {
      // Show quantity selector modal
      setCashQuantity(1);
      setCashQuantityModalOpen(true);
    } else {
      // Process directly with quantity 1
      await processSendCash(1);
    }
  };

  const processSendCash = async (quantity: number) => {
    setActionLoading(true);

    try {
      // Create claim
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .insert({
          wishlist_item_id: item.id,
          supporter_user_id: user.id,
          supporter_contact: user.email,
          status: 'confirmed',
          note: quantity > 1 ? `Quantity: ${quantity}` : undefined,
          expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
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

      // Update qty_claimed
      await supabase
        .from('wishlist_items')
        .update({ qty_claimed: (item.qty_claimed || 0) + quantity })
        .eq('id', item.id);

      // Create automatic reminder
      try {
        await ReminderService.createAutomaticReminder({
          claimId: claimData.id,
          spenderEmail: user.email,
          spenderUsername: user.user_metadata?.username || user.email?.split('@')[0],
          itemName: item.name,
          itemPrice: item.unit_price_estimate || 0,
          quantity: quantity
        });
        console.log('✅ Automatic reminder created for claim:', claimData.id);
      } catch (reminderError) {
        console.error('❌ Error creating automatic reminder:', reminderError);
      }

      toast({
        title: `${quantity} item(s) added to your spender list`,
        description: "We'll send you reminders every 2 days until payment is complete."
      });

      setCashQuantityModalOpen(false);

      // Redirect based on user role
      const isAdmin = user.user_metadata?.role === 'admin';
      router.push(isAdmin ? '/admin/dashboard' : '/dashboard/spender-list');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err as Error, 'claiming this item'),
      });
      setActionLoading(false);
    }
  };

  const handleCashModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashModalLoading(true);
    setCashModalErrors(null);

    // Validate form data
    try {
      cashModalSchema.parse(cashFormData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.issues.forEach((err: any) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = [];
          errors[field].push(err.message);
        });
        setCashModalErrors(errors);
        setCashModalLoading(false);
        return;
      }
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cashFormData.email,
        password: cashFormData.password,
        options: {
          data: {
            username: cashFormData.username,
            full_name: cashFormData.username,
            role: 'user'
          }
        }
      });

      if (authError) {
        const friendlyError = getUserFriendlyError(authError, 'creating account');
        
        // Check if account already exists
        if (authError.message.includes('already') || authError.message.includes('exists')) {
          toast({
            variant: 'destructive',
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please log in instead.'
          });
          setCashModalOpen(false);
          router.push('/auth/login');
          return;
        }
        
        setCashModalErrors({ general: [friendlyError] });
        setCashModalLoading(false);
        return;
      }

      if (authData.user) {
        const quantity = cashFormData.quantity || 1;
        
        // Create claim
        await supabase
          .from('claims')
          .insert({
            wishlist_item_id: item.id,
            supporter_user_id: authData.user.id,
            supporter_contact: cashFormData.email,
            status: 'confirmed',
            note: quantity > 1 ? `Quantity: ${quantity}` : undefined,
            expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        // Update qty_claimed
        await supabase
          .from('wishlist_items')
          .update({ qty_claimed: (item.qty_claimed || 0) + quantity })
          .eq('id', item.id);

        // Show success toast
        toast({
          title: `${quantity} item(s) added to your spender list`,
          description: 'Check your email to verify and access your dashboard.'
        });

        // Show verification banner
        setShowVerificationBanner(true);
      }

      setCashModalOpen(false);
      // Stay on page (don't redirect for unregistered users)
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err as Error, 'creating account')
      });
    }

    setCashModalLoading(false);
  };

  const handleCashModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newValue = id === 'quantity' ? parseInt(value) || 1 : value;
    setCashFormData(prev => ({ ...prev, [id]: newValue }));
    // Clear errors for this field
    if (cashModalErrors?.[id]) {
      setCashModalErrors((prev: any) => ({ ...prev, [id]: null }));
    }
  };

  const handleCashWithoutAccount = () => {
    setCashModalOpen(false);
    setGuestQuantity(1);
    setGuestPaymentModalOpen(true);
  };

  const handleGuestPaymentSubmit = async () => {
    setGuestPaymentModalOpen(false);
    setPaymentProcessing(true);

    try {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
        toast({
          variant: 'destructive',
          title: 'Payment Error',
          description: 'Payment system is not configured. Please contact support.'
        });
        setPaymentProcessing(false);
        return;
      }

      const totalAmount = (item.unit_price_estimate || 0) * guestQuantity;
      const amountInKobo = totalAmount * 100;
      const paymentRef = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const paymentData = {
        email: 'guest@heyspender.com',
        amount: amountInKobo,
        currency: 'NGN',
        reference: paymentRef,
        metadata: {
          custom_fields: [
            { display_name: 'Item', variable_name: 'item_name', value: item.name },
            { display_name: 'Wishlist Owner', variable_name: 'wishlist_owner', value: username },
            { display_name: 'Item ID', variable_name: 'item_id', value: item.id },
            { display_name: 'Quantity', variable_name: 'quantity', value: guestQuantity.toString() }
          ]
        },
        callback: async (response: any) => {
          console.log('Payment successful:', response);
          
          try {
            // Create a claim record for the guest payment
            const { error: claimError } = await supabase
              .from('claims')
              .insert({
                wishlist_item_id: item.id,
                supporter_user_id: null, // Guest payment - no user ID
                supporter_contact: 'guest@heyspender.com',
                status: 'confirmed',
                amount_paid: totalAmount,
                note: `Guest payment - Quantity: ${guestQuantity}`,
                expire_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
              });

            if (claimError) {
              console.error('Error creating guest claim:', claimError);
            }

            // Update qty_claimed on the wishlist item
            const { error: updateError } = await supabase
              .from('wishlist_items')
              .update({ qty_claimed: (item.qty_claimed || 0) + guestQuantity })
              .eq('id', item.id);

            if (updateError) {
              console.error('Error updating qty_claimed:', updateError);
            }

            // Refresh the item data to show updated counts
            await fetchItemData();

            toast({
              title: 'Payment Successful!',
              description: `You've contributed ₦${Number(totalAmount).toLocaleString()} for ${guestQuantity} ${item.name}${guestQuantity > 1 ? 's' : ''}`
            });
          } catch (dbError) {
            console.error('Database update error:', dbError);
            toast({
              title: 'Payment Successful!',
              description: `Payment processed but there was an issue updating the records. Please contact support.`
            });
          }
          
          setPaymentProcessing(false);
        },
        onClose: () => {
          console.log('Payment cancelled');
          toast({
            title: 'Payment Cancelled',
            description: 'You can try again anytime.'
          });
          setPaymentProcessing(false);
        }
      };

      await initializePaystackPayment(paymentData);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: getUserFriendlyError(error as Error, 'processing payment')
      });
      setPaymentProcessing(false);
    }
  };

  // ==================== I BOUGHT ALREADY BUTTON ====================
  const handleBoughtAlready = () => {
    if (!user) {
      setBoughtModalOpen(true);
      return;
    }
    
    setLoggedInBoughtModalOpen(true);
  };

  const handleBoughtModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBoughtModalLoading(true);
    setBoughtModalErrors(null);

    // Validate form data
    try {
      boughtModalSchema.parse(boughtFormData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.issues.forEach((err: any) => {
          const field = err.path[0];
          if (!errors[field]) errors[field] = [];
          errors[field].push(err.message);
        });
        setBoughtModalErrors(errors);
        setBoughtModalLoading(false);
        return;
      }
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: boughtFormData.email,
        password: boughtFormData.password,
        options: {
          data: {
            username: boughtFormData.username,
            full_name: boughtFormData.username,
            role: 'user'
          }
        }
      });

      if (authError) {
        const friendlyError = getUserFriendlyError(authError, 'creating account');
        
        // Check if account already exists
        if (authError.message.includes('already') || authError.message.includes('exists')) {
          toast({
            variant: 'destructive',
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please log in instead.'
          });
          setBoughtModalOpen(false);
          router.push('/auth/login');
          return;
        }
        
        setBoughtModalErrors({ general: [friendlyError] });
        setBoughtModalLoading(false);
        return;
      }

      if (authData.user) {
        const quantity = boughtFormData.quantity;
        
        // Create claim
        await supabase
          .from('claims')
          .insert({
            wishlist_item_id: item.id,
            supporter_user_id: authData.user.id,
            supporter_contact: boughtFormData.email,
            status: 'confirmed',
            expire_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          });

        // Update qty_claimed
        await supabase
          .from('wishlist_items')
          .update({ qty_claimed: (item.qty_claimed || 0) + quantity })
          .eq('id', item.id);

        // Show success toast
        toast({
          title: `${quantity} item(s) marked as purchased`,
          description: 'Check your email to verify and access your dashboard.'
        });

        // Show verification banner
        setShowVerificationBanner(true);
      }

      setBoughtModalOpen(false);
      // Stay on page (don't redirect for unregistered users)
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err as Error, 'creating account')
      });
    }

    setBoughtModalLoading(false);
  };

  const handleBoughtModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newValue = id === 'bought-quantity' ? parseInt(value) || 1 : value;
    const fieldName = id === 'bought-quantity' ? 'quantity' : id;
    setBoughtFormData(prev => ({ ...prev, [fieldName]: newValue }));
    // Clear errors for this field
    if (boughtModalErrors?.[fieldName]) {
      setBoughtModalErrors((prev: any) => ({ ...prev, [fieldName]: null }));
    }
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
        title: `${loggedInBoughtQuantity} item(s) marked as purchased and added to your spender list`,
        description: ''
      });

      setLoggedInBoughtModalOpen(false);
      
      // Redirect based on user role
      const isAdmin = user.user_metadata?.role === 'admin';
      router.push(isAdmin ? '/admin/dashboard' : '/dashboard/spender-list');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(err as Error, 'claiming this item'),
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
  const availableQuantity = item.qty_total - (item.qty_claimed || 0);

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
                          <CreditCard className="w-4 h-4 mr-2" />
                          Send the Cash / Claim
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleBoughtAlready}
                      disabled={actionLoading}
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
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Before you buy this item at {getProductDomain()}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                Create a light account to reserve this item. A verification link will be sent to your email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBuyModalSubmit}>
              <div className="space-y-3 sm:space-y-4">
                {buyModalErrors?.general && (
                  <div className="text-red-600 text-xs sm:text-sm">{buyModalErrors.general[0]}</div>
                )}

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
                  {buyModalErrors?.email && (
                    <p className="text-red-600 text-xs mt-1">{buyModalErrors.email[0]}</p>
                  )}
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
                  {buyFormData.username.length >= 15 && (
                    <p className="text-yellow-600 text-xs mt-1">Maximum 15 characters</p>
                  )}
                  {buyModalErrors?.username && (
                    <p className="text-red-600 text-xs mt-1">{buyModalErrors.username[0]}</p>
                  )}
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
                  {buyModalErrors?.password && (
                    <p className="text-red-600 text-xs mt-1">{buyModalErrors.password[0]}</p>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 sm:mt-6">
                <div className="w-full flex flex-col gap-4">
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
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSkipBuyAccount}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      I don't want to provide my info
                    </button>
                  </div>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Cash Modal for unregistered users */}
        <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Send Cash for {item?.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                Create a light account to reserve this item. A verification link will be sent to your email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCashModalSubmit}>
              <div className="space-y-3 sm:space-y-4">
                {cashModalErrors?.general && (
                  <div className="text-red-600 text-xs sm:text-sm">{cashModalErrors.general[0]}</div>
                )}

                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={cashFormData.email} 
                    onChange={handleCashModalInputChange} 
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                  {cashModalErrors?.email && (
                    <p className="text-red-600 text-xs mt-1">{cashModalErrors.email[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username" className="text-xs sm:text-sm font-medium">Username*</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    value={cashFormData.username} 
                    onChange={handleCashModalInputChange}
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                    maxLength={15}
                  />
                  {cashFormData.username.length >= 15 && (
                    <p className="text-yellow-600 text-xs mt-1">Maximum 15 characters</p>
                  )}
                  {cashModalErrors?.username && (
                    <p className="text-red-600 text-xs mt-1">{cashModalErrors.username[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Create a Password*</Label>
                  <div className="relative mt-1">
                    <Input 
                      id="password" 
                      type={showCashPassword ? "text" : "password"} 
                      value={cashFormData.password} 
                      onChange={handleCashModalInputChange}
                      placeholder=""
                      className="text-sm sm:text-base pr-10 h-10 sm:h-11 border-2 border-black"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                      onClick={() => setShowCashPassword(!showCashPassword)}
                    >
                      {showCashPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                  {cashModalErrors?.password && (
                    <p className="text-red-600 text-xs mt-1">{cashModalErrors.password[0]}</p>
                  )}
                </div>

                {availableQuantity > 1 && (
                  <div>
                    <Label htmlFor="quantity" className="text-xs sm:text-sm font-medium">Quantity*</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      max={availableQuantity}
                      value={cashFormData.quantity} 
                      onChange={handleCashModalInputChange}
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {availableQuantity} item(s)
                    </p>
                    {cashModalErrors?.quantity && (
                      <p className="text-red-600 text-xs mt-1">{cashModalErrors.quantity[0]}</p>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4 sm:mt-6">
                <div className="w-full flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    disabled={cashModalLoading}
                    className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                  >
                    {cashModalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Submit & Continue'
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleCashWithoutAccount}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      I don't want to provide my info ...just to pay
                    </button>
                  </div>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Cash Quantity Selector Modal (Logged-In) */}
        <Dialog open={cashQuantityModalOpen} onOpenChange={setCashQuantityModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Choose Quantity
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                How many items do you want to add to your spender list?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="cash-quantity" className="text-xs sm:text-sm font-medium">Quantity*</Label>
                <Input 
                  id="cash-quantity" 
                  type="number" 
                  min="1"
                  max={availableQuantity}
                  value={cashQuantity} 
                    onChange={(e: any) => setCashQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Requested: {item?.qty_total} | Already claimed: {item?.qty_claimed || 0} | Available: {availableQuantity}
                </p>
                <div className="mt-3 p-2 bg-brand-purple-dark/10 border border-brand-purple-dark/20 rounded">
                  <p className="text-xs text-brand-purple-dark flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    You can claim more than requested to show extra generosity!
                  </p>
                </div>
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
                onClick={() => processSendCash(cashQuantity)}
                disabled={actionLoading}
                className="w-full sm:w-auto bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Add ${cashQuantity} Item(s) to List`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bought Modal (Unregistered Users) */}
        <Dialog open={boughtModalOpen} onOpenChange={setBoughtModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Confirm Your Purchase
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                Register your purchase to let the wishlist owner know you've bought this item. Create an account to get started.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBoughtModalSubmit}>
              <div className="space-y-3 sm:space-y-4">
                {boughtModalErrors?.general && (
                  <div className="text-red-600 text-xs sm:text-sm">{boughtModalErrors.general[0]}</div>
                )}

                <div>
                  <Label htmlFor="bought-quantity" className="text-xs sm:text-sm font-medium">Quantity Purchased*</Label>
                  <Input 
                    id="bought-quantity" 
                    type="number" 
                    min="1"
                    value={boughtFormData.quantity} 
                    onChange={handleBoughtModalInputChange}
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                  {boughtModalErrors?.quantity && (
                    <p className="text-red-600 text-xs mt-1">{boughtModalErrors.quantity[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={boughtFormData.email} 
                    onChange={handleBoughtModalInputChange} 
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                  {boughtModalErrors?.email && (
                    <p className="text-red-600 text-xs mt-1">{boughtModalErrors.email[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username" className="text-xs sm:text-sm font-medium">Username*</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    value={boughtFormData.username} 
                    onChange={handleBoughtModalInputChange}
                    placeholder=""
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                    maxLength={15}
                  />
                  {boughtFormData.username.length >= 15 && (
                    <p className="text-yellow-600 text-xs mt-1">Maximum 15 characters</p>
                  )}
                  {boughtModalErrors?.username && (
                    <p className="text-red-600 text-xs mt-1">{boughtModalErrors.username[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Create a Password*</Label>
                  <div className="relative mt-1">
                    <Input 
                      id="password" 
                      type={showBoughtPassword ? "text" : "password"} 
                      value={boughtFormData.password} 
                      onChange={handleBoughtModalInputChange}
                      placeholder=""
                      className="text-sm sm:text-base pr-10 h-10 sm:h-11 border-2 border-black"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                      onClick={() => setShowBoughtPassword(!showBoughtPassword)}
                    >
                      {showBoughtPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                  {boughtModalErrors?.password && (
                    <p className="text-red-600 text-xs mt-1">{boughtModalErrors.password[0]}</p>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 sm:mt-6">
                <Button 
                  type="submit" 
                  disabled={boughtModalLoading}
                  className="w-full bg-brand-orange text-black hover:bg-brand-orange/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
                >
                  {boughtModalLoading ? (
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
                    onChange={(e: any) => setLoggedInBoughtQuantity(parseInt(e.target.value) || 1)}
                    placeholder="1"
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {item?.qty_total} | Already claimed: {item?.qty_claimed || 0}
                  </p>
                  <div className="mt-3 p-2 bg-brand-purple-dark/10 border border-brand-purple-dark/20 rounded">
                    <p className="text-xs text-brand-purple-dark flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      You can buy more than requested to show extra generosity!
                    </p>
                  </div>
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

        {/* Guest Payment Modal (Quantity Selector for Unregistered Users) */}
        <Dialog open={guestPaymentModalOpen} onOpenChange={setGuestPaymentModalOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[480px] w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
                Choose Quantity for Payment
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-600">
                How many items do you want to pay for?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="guest-quantity" className="text-xs sm:text-sm font-medium">Quantity*</Label>
                <Input 
                  id="guest-quantity" 
                  type="number" 
                  min="1"
                  value={guestQuantity} 
                  onChange={(e: any) => setGuestQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Requested: {item?.qty_total} | Already claimed: {item?.qty_claimed || 0}
                </p>
                <div className="mt-3 p-2 bg-brand-purple-dark/10 border border-brand-purple-dark/20 rounded">
                  <p className="text-xs text-brand-purple-dark flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    You can pay for more than requested to show extra generosity!
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={paymentProcessing}
                  className="w-full sm:w-auto text-sm h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                onClick={handleGuestPaymentSubmit}
                disabled={paymentProcessing}
                className="w-full sm:w-auto bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₦${((item?.unit_price_estimate || 0) * guestQuantity).toLocaleString()}`
                )}
              </Button>
            </DialogFooter>
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
