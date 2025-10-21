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

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      toast({
        title: "Error",
        description: "Username is already taken. Please choose another one.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await signUpWithEmailPassword(email, password);

    if (error) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error.message),
        variant: "destructive",
      });
    } else if (data?.user) {
      // Handle wizard data if it exists
      await handleWizardData(data.user.id);
      
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      });

      // Redirect to verification page
      const verificationUrl = `/auth/verify?email=${encodeURIComponent(email)}${returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ''}`;
      router.push(verificationUrl);
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