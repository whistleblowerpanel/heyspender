import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { getUserFriendlyError } from '@/lib/utils';
import { Loader2, Info, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import Link from 'next/link';

// Validation schema
const contributionSchema = z.object({
  amount: z.number().min(100, "Contribution must be at least ₦100."),
  displayName: z.string().optional(),
});

// Form errors component
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

const ContributeModal = ({ goal, recipientEmail, onContributed, trigger }) => {
  // State management
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user, isVerified, signInWithEmailPassword } = useAuth();
  const [formData, setFormData] = useState({ 
    amount: '', 
    displayName: '', 
    isAnonymous: false 
  });
  const [errors, setErrors] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ 
    identifier: '', 
    password: '' 
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setFormData(prev => ({ 
        ...prev, 
        displayName: user.user_metadata?.full_name || '' 
      }));
    } else if (open && !user && !hasValidSession) {
      // Only reset form for truly anonymous users (no session)
      setFormData(prev => ({ 
        ...prev, 
        displayName: '', 
        isAnonymous: false 
      }));
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
      setShowPassword(false);
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

  // Main contribution handler
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

  // Initialize Paystack payment
  const initializePaystackPayment = async (paymentData) => {
    return new Promise((resolve) => {
      console.log('Initializing Paystack payment with data:', paymentData);
      
      // Check if Paystack public key is available
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        console.error('Paystack public key not found in environment variables');
        resolve({ error: { message: 'Paystack configuration missing. Please check your environment variables.' } });
        return;
      }

      console.log('Paystack public key found:', publicKey.substring(0, 20) + '...');

      // For development/localhost, use hosted payment page due to CORS issues
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development environment detected, using hosted payment page...');
        useHostedPaymentPage(paymentData);
        resolve({ error: { message: 'Using hosted payment page for development' } });
        return;
      }

      // Try to load Paystack script for production
      const loadPaystackScript = () => {
        return new Promise((scriptResolve, scriptReject) => {
          if (window.PaystackPop) {
            console.log('Paystack script already loaded');
            scriptResolve();
            return;
          }

          console.log('Loading Paystack script...');
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          
          // Add timeout to prevent infinite loading
          const timeout = setTimeout(() => {
            scriptReject(new Error('Paystack script loading timeout'));
          }, 10000);

          script.onload = () => {
            clearTimeout(timeout);
            console.log('Paystack script loaded successfully');
            scriptResolve();
          };
          
          script.onerror = (error) => {
            clearTimeout(timeout);
            console.error('Failed to load Paystack script:', error);
            scriptReject(new Error('Failed to load Paystack script'));
          };
          
          document.head.appendChild(script);
        });
      };

      // Load script and initialize payment
      loadPaystackScript()
        .then(() => {
          initPayment();
        })
        .catch((error) => {
          console.error('Script loading failed:', error);
          console.log('Falling back to hosted payment page...');
          useHostedPaymentPage(paymentData);
          resolve({ error: { message: 'Using hosted payment page due to script loading error' } });
        });

      function initPayment() {
        try {
          console.log('Setting up Paystack payment...');
          
          // Add a small delay to ensure script is fully loaded
          setTimeout(() => {
            try {
              const handler = window.PaystackPop.setup({
                key: publicKey,
                email: paymentData.email,
                amount: paymentData.amount,
                currency: paymentData.currency,
                ref: paymentData.reference,
                metadata: paymentData.metadata,
                callback: (response) => {
                  console.log('Paystack callback received:', response);
                  paymentData.callback(response);
                },
                onClose: () => {
                  console.log('Paystack modal closed');
                  paymentData.onClose();
                }
              });

              console.log('Opening Paystack iframe...');
              handler.openIframe();
              resolve({ success: true });
            } catch (error) {
              console.error('Error in Paystack setup:', error);
              console.log('Falling back to hosted payment page...');
              useHostedPaymentPage(paymentData);
              resolve({ error: { message: 'Using hosted payment page due to inline setup error' } });
            }
          }, 500);
          
        } catch (error) {
          console.error('Error setting up Paystack payment:', error);
          console.log('Falling back to hosted payment page...');
          useHostedPaymentPage(paymentData);
          resolve({ error: { message: 'Using hosted payment page due to setup error' } });
        }
      }
    });
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
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border: 2px solid black;
    `;
    
    content.innerHTML = `
      <h3 style="margin: 0 0 1rem 0; color: #333; font-weight: bold;">Contribution Payment Instructions</h3>
      <p style="margin: 0 0 1rem 0; color: #666;">
        Due to development environment restrictions, please use the following details to complete payment:
      </p>
      <div style="background: #f5f5f5; padding: 1rem; margin: 1rem 0; border: 2px solid black;">
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
        background: #7C3AED;
        color: white;
        border: 2px solid black;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        box-shadow: -4px 4px 0px #161B47;
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
          display_name: formData.isAnonymous ? null : (formData.displayName || user?.user_metadata?.full_name),
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
      <DialogContent fullscreenOnMobile={false} className="border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Contribute to "{goal.title}"</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
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
          {/* Amount Input */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium">Amount (₦)</Label>
            <Input 
              id="amount" 
              type="text" 
              placeholder="e.g., 5,000" 
              value={formData.amount} 
              onChange={handleAmountChange}
              className="mt-1 border-2 border-black"
            />
            <FormErrors errors={errors?.amount} />
          </div>

          {/* User-specific fields */}
          {(user || hasValidSession) ? (
            // Logged in user - show display name and anonymous option
            <>
              {(!userIsVerified && (user || hasValidSession)) && (
                <div className="bg-yellow-50 border-2 border-yellow-200 p-3 mb-4">
                  <div className="flex items-center">
                    <Info className="w-4 h-4 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      <strong>Email verification pending:</strong> You can make contributions, but please check your email to verify your account for full access.
                    </p>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="displayName" className="text-sm font-medium">Display Name (Optional)</Label>
                <Input 
                  id="displayName" 
                  placeholder="e.g., John Doe" 
                  disabled={formData.isAnonymous} 
                  value={formData.displayName} 
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  className="mt-1 border-2 border-black"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_anonymous" 
                  checked={formData.isAnonymous} 
                  onCheckedChange={checked => {
                    const newIsAnonymous = checked === true;
                    const newDisplayName = newIsAnonymous ? '' : (user?.user_metadata?.full_name || '');
                    setFormData(prev => ({
                      ...prev, 
                      isAnonymous: newIsAnonymous, 
                      displayName: newDisplayName
                    }));
                  }}
                  className="border-2 border-black"
                />
                <Label htmlFor="is_anonymous" className="text-sm font-medium">Contribute Anonymously</Label>
              </div>
            </>
          ) : (
            // Anonymous user - show display name field and explain anonymous option
            <>
              <div>
                <Label htmlFor="displayName" className="text-sm font-medium">Your Name (Optional)</Label>
                <Input 
                  id="displayName" 
                  placeholder="e.g., John Doe" 
                  disabled={formData.isAnonymous} 
                  value={formData.displayName} 
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  className="mt-1 border-2 border-black"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to contribute anonymously</p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_anonymous" 
                  checked={formData.isAnonymous} 
                  onCheckedChange={checked => {
                    const newIsAnonymous = checked === true;
                    const newDisplayName = newIsAnonymous ? '' : formData.displayName;
                    setFormData(prev => ({
                      ...prev, 
                      isAnonymous: newIsAnonymous, 
                      displayName: newDisplayName
                    }));
                  }}
                  className="border-2 border-black"
                />
                <Label htmlFor="is_anonymous" className="text-sm font-medium">Contribute Anonymously</Label>
              </div>
            </>
          )}
          
          {/* Login option for non-logged-in users */}
          {!user && !showLogin && (
            <div className="border-t-2 border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">Have an account? Login to continue with your saved information.</p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowLogin(true)}
                className="w-full border-2 border-brand-purple-dark text-brand-purple-dark hover:bg-brand-purple-dark hover:text-white mb-2 shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                Login to Continue
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Don't have an account? <Link href={`/auth/register?returnTo=${encodeURIComponent(window.location.pathname)}`} className="text-brand-purple-dark hover:underline">Sign up here</Link>
              </p>
            </div>
          )}
          
          {/* Login form */}
          {showLogin && (
            <div className="border-t-2 border-gray-200 pt-4 space-y-4">
              <h4 className="font-semibold text-brand-purple-dark">Login to Continue</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="login-identifier" className="text-sm font-medium">Email or Username</Label>
                  <Input 
                    id="login-identifier" 
                    type="text" 
                    placeholder="Enter your email or username"
                    value={loginData.identifier}
                    onChange={e => setLoginData({...loginData, identifier: e.target.value})}
                    required
                    className="mt-1 border-2 border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input 
                      id="login-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={e => setLoginData({...loginData, password: e.target.value})}
                      required
                      className="mt-1 border-2 border-black pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowLogin(false)}
                    className="flex-1 border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleLogin}
                    className="flex-1 bg-brand-purple-dark text-white border-2 border-black hover:bg-brand-purple-dark/90 shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
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
                  Don't have an account? <Link href={`/auth/register?returnTo=${encodeURIComponent(window.location.pathname)}`} className="text-brand-purple-dark hover:underline">Sign up here</Link>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button" 
              disabled={isProcessingPayment || isLoggingIn} 
              onClick={() => setOpen(false)}
              className="border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="custom" 
              className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
              disabled={isProcessingPayment}
            >
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
  );
};

export default ContributeModal;
