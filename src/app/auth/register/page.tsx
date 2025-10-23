"use client";

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import { wishlistService } from '@/lib/wishlistService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const RegisterPageContent = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpWithEmailPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Get the page the user was trying to access before being redirected to register
  const returnTo = searchParams.get('returnTo');

  // Handle wizard data after successful registration
  const handleWizardData = async (userId) => {
    try {
      const wizardDataStr = localStorage.getItem('wizardData');
      if (!wizardDataStr) return;

      const wizardData = JSON.parse(wizardDataStr);
      
      // Get occasion value mapping
      const occasions = [
        { name: 'Birthday', value: 'birthday' },
        { name: 'Wedding', value: 'wedding' },
        { name: 'Baby Shower', value: 'baby_shower' },
        { name: 'Graduation', value: 'graduation' },
        { name: 'Housewarming', value: 'housewarming' },
        { name: 'Anniversary', value: 'anniversary' },
        { name: 'Holiday', value: 'holiday' },
        { name: 'Other', value: 'other' }
      ];
      
      const getOccasionValue = (displayName) => {
        const occasion = occasions.find(occ => occ.name === displayName);
        return occasion ? occasion.value : null;
      };

      const wishlistData = {
        title: wizardData.title,
        occasion: getOccasionValue(wizardData.occasion),
        wishlist_date: wizardData.event_date ? new Date(wizardData.event_date).toISOString() : null,
        story: wizardData.story,
        cover_image_url: wizardData.cover_image_url,
        visibility: wizardData.visibility
      };

      await wishlistService.createWishlist(userId, wishlistData, wizardData.items || [], wizardData.cashGoals || []);
      
      // Clear wizard data from localStorage
      localStorage.removeItem('wizardData');
      
      toast({
        title: 'Wishlist created successfully!',
        description: 'Your wishlist has been created and is ready to share.'
      });
    } catch (error) {
      console.error('Error creating wishlist from wizard data:', error);
      toast({
        variant: 'destructive',
        title: 'Wishlist creation failed',
        description: 'Your account was created, but there was an issue creating your wishlist. You can create one from your dashboard.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { full_name, username, email, password } = formData;

    try {
      // Validate input format before checking database
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        toast({
          title: "Invalid Username",
          description: "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (full_name.trim().length < 2) {
        toast({
          title: "Invalid Name",
          description: "Please enter your full name (at least 2 characters).",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if username is already taken
      const { data: existingUser, error: usernameCheckError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (usernameCheckError) {
        console.error('Error checking username availability:', usernameCheckError);
        toast({
          title: "Error",
          description: "Unable to verify username availability. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (existingUser) {
        toast({
          title: "Error",
          description: "Username is already taken. Please choose another one.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if email is already registered and verified
      const { data: existingEmailUser, error: emailCheckError } = await supabase
        .from('users')
        .select('id, email, email_verified_at, is_active')
        .eq('email', email)
        .maybeSingle();

      if (emailCheckError) {
        console.error('Error checking email availability:', emailCheckError);
        toast({
          title: "Error",
          description: "Unable to verify email availability. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (existingEmailUser && existingEmailUser.email_verified_at) {
        toast({
          title: "Error",
          description: "This email is already registered and verified. Please use a different email or try logging in.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await signUpWithEmailPassword({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            full_name: full_name,
            username: username
          }
        }
      });

      console.log('🔍 Registration Response:', { 
        user: data?.user ? { 
          id: data.user.id, 
          email: data.user.email, 
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at,
          confirmed_at: data.user.confirmed_at,
          email_confirm_change_at: data.user.email_confirm_change_at,
          email_confirm_sent_at: data.user.email_confirm_sent_at
        } : null,
        error: error?.message,
        session: data?.session ? 'Session created' : 'No session'
      });

      if (error) {
        toast({
          title: "Error",
          description: getUserFriendlyError(error.message),
          variant: "destructive",
        });
      } else if (data?.user) {
        // Check if user is automatically confirmed (this shouldn't happen with email confirmation enabled)
        if (data.user.email_confirmed_at) {
          console.warn('⚠️ User was automatically confirmed during registration - this should not happen with email confirmation enabled');
        }
        
        // Create or update user record in database
        try {
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: email,
              full_name: full_name,
              username: username,
              role: 'user',
              is_active: true, // Active immediately since email confirmation is disabled
              email_verified_at: new Date().toISOString(), // Mark as verified immediately
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (userError) {
            // If it's a duplicate key error, try to update instead
            if (userError.code === '23505') {
              console.log('User record already exists, updating instead...');
              const { error: updateError } = await supabase
                .from('users')
                .update({
                  email: email,
                  full_name: full_name,
                  username: username,
                  role: 'user',
                  email_verified_at: new Date().toISOString(), // Mark as verified immediately
                  is_active: true, // Active immediately since email confirmation is disabled
                  updated_at: new Date().toISOString()
                })
                .eq('id', data.user.id);
              
              if (updateError) {
                console.error('❌ Error updating user record:', updateError);
                // This is critical - can't proceed without user record
                await supabase.auth.signOut();
                toast({
                  title: "Registration Error",
                  description: "Failed to update your account profile. Please try again.",
                  variant: "destructive",
                });
                setLoading(false);
                return;
              } else {
                console.log('✅ User record updated successfully - verification status reset');
              }
            } else {
              // Non-duplicate error is critical
              console.error('❌ Critical error creating user record:', userError);
              await supabase.auth.signOut();
              toast({
                title: "Registration Error",
                description: "Failed to create your account profile. Please try again.",
                variant: "destructive",
              });
              setLoading(false);
              return;
            }
          } else {
            console.log('✅ User record created successfully');
          }

          // Verify the user record was created/updated successfully
          const { data: verifyUser, error: verifyError } = await supabase
            .from('users')
            .select('id, username, email, full_name')
            .eq('id', data.user.id)
            .single();

          if (verifyError || !verifyUser) {
            console.error('❌ User record verification failed:', verifyError);
            // Clean up auth user
            await supabase.auth.signOut();
            toast({
              title: "Registration Error",
              description: "Failed to verify your account profile. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          console.log('✅ User record verified in database:', verifyUser.username);
        } catch (error) {
          console.error('❌ Exception creating user record:', error);
          // Clean up auth user
          await supabase.auth.signOut();
          toast({
            title: "Registration Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // User is automatically signed in (email confirmation disabled)
        console.log('✅ User created successfully and automatically signed in');
        
        // Handle wizard data if it exists
        await handleWizardData(data.user.id);
        
        toast({
          title: "Registration Successful!",
          description: "Welcome to HeySpender! You're now signed in.",
        });

        // Redirect directly to dashboard - no email verification needed
        router.push(returnTo || '/dashboard/wishlist');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-purple-dark">Create Account</h1>
                <p className="text-gray-600">Join HeySpender today!</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    type="text" 
                    autoComplete="name" 
                    value={formData.full_name} 
                    onChange={handleInputChange} 
                    required 
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    autoComplete="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    autoComplete="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    className="border-2 border-black"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="new-password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      required 
                      className="border-2 border-black"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 bottom-1 h-7 w-7" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                variant="custom" 
                className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Register</span>}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-brand-purple-dark hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const RegisterPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
};

export default RegisterPage;