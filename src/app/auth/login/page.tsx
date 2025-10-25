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
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const LoginPageContent = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithEmailPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Get the page the user was trying to access before being redirected to login
  const returnTo = searchParams.get('returnTo');
  const returnUrl = searchParams.get('returnUrl');
  
  // Use returnUrl if available, otherwise fall back to returnTo
  const redirectUrl = returnUrl || returnTo;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { identifier, password } = formData;
    let email = identifier;

    // Check if identifier is a username and not an email
    if (!identifier.includes('@')) {
      const { data: user, error } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .single();

      if (error || !user) {
        toast({
          title: "Error",
          description: "Invalid username or email",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      email = user.email;
    }

    const { data, error } = await signInWithEmailPassword(email, password);

    if (error) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error.message),
        variant: "destructive",
      });
    } else if (data?.user) {
      toast({
        title: "Success",
        description: "Welcome back!",
      });

      // Check user role from database and redirect accordingly
      try {
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (!roleError && userData?.role === 'admin') {
          // Redirect admin users to their intended destination or admin dashboard
          if (redirectUrl && redirectUrl.startsWith('/admin/')) {
            router.push(redirectUrl);
          } else {
            router.push('/admin/dashboard/users');
          }
        } else {
          // Redirect regular users to their intended destination or wishlist dashboard
          if (redirectUrl && !redirectUrl.startsWith('/admin/')) {
            router.push(redirectUrl);
          } else {
            router.push('/dashboard/wishlist/');
          }
        }
      } catch (roleCheckError) {
        console.warn('Error checking user role, defaulting to user dashboard:', roleCheckError);
        // Default to user dashboard if role check fails, but respect return URL if it's not admin
        if (redirectUrl && !redirectUrl.startsWith('/admin/')) {
          router.push(redirectUrl);
        } else {
          router.push('/dashboard/wishlist/');
        }
      }
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
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-purple-dark">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="identifier">Email or Username</Label>
                  <Input 
                    id="identifier" 
                    type="text" 
                    autoComplete="email" 
                    value={formData.identifier} 
                    onChange={handleInputChange} 
                    required 
                    className="border-2 border-black"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-brand-purple-dark hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="current-password" 
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
                className="w-full bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Login</span>}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-medium text-brand-purple-dark hover:underline">
                  Sign Up
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

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
};

export default LoginPage;