'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ResetPasswordPage = () => {
  // State Management
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  // Hooks
  const { user, resetPassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Effect: Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Extract tokens from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Hash params:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type 
        });

        // 2. If tokens present and type is 'recovery', establish session
        if (accessToken && refreshToken && type === 'recovery') {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            setIsValidSession(false);
          } else {
            console.log('Session set successfully for password recovery');
            setIsValidSession(true);
            // Clean up URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // 3. Check if existing session exists
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            setIsValidSession(false);
          } else if (session?.user) {
            setIsValidSession(true);
          } else {
            setIsValidSession(false);
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setIsValidSession(false);
      }
      
      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate all fields present
    if (!password || !confirmPassword) {
      toast({ 
        variant: 'destructive', 
        title: 'Missing Fields', 
        description: 'Please fill in all fields.' 
      });
      return;
    }

    // 2. Validate password length
    if (password.length < 8) {
      toast({ 
        variant: 'destructive', 
        title: 'Password Too Short', 
        description: 'Password must be at least 8 characters long.' 
      });
      return;
    }

    // 3. Validate passwords match
    if (password !== confirmPassword) {
      toast({ 
        variant: 'destructive', 
        title: 'Passwords Don\'t Match', 
        description: 'Please make sure both passwords match.' 
      });
      return;
    }

    setLoading(true);

    try {
      // 4. Update password via Supabase
      const { error } = await resetPassword(password);

      if (error) {
        const friendlyMessage = getUserFriendlyError(error, 'resetting password');
        toast({ 
          variant: 'destructive', 
          title: 'Reset Failed', 
          description: friendlyMessage 
        });
      } else {
        // 5. Success: Show toast and redirect
        toast({
          title: 'Password Reset!',
          description: 'Your password has been successfully updated.'
        });
        
        // Delay to show toast, then redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again.' 
      });
    }

    setLoading(false);
  };

  // Loading State
  if (checkingSession) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-brand-purple-dark mx-auto" />
            <p className="text-gray-600 font-medium">Verifying reset link...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Invalid Link State
  if (!isValidSession) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black rounded-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-red border-2 border-black flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-brand-purple-dark">Invalid or Expired Link</h1>
                <p className="text-gray-600">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  asChild
                  className="w-full h-11 bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] font-semibold transition-all"
                >
                  <Link href="/auth/forgot-password">
                    Request New Link
                  </Link>
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="font-medium text-brand-purple-dark hover:underline">
                    Back to Login
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Form State
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black rounded-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-brand-purple-dark border-2 border-black flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-brand-purple-dark">Reset Password</h1>
                <p className="text-gray-600">Enter your new password below</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="At least 8 characters"
                    required 
                    className="border-2 border-black pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Re-enter your password"
                    required 
                    className="border-2 border-black pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-11 bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-medium text-brand-purple-dark hover:underline">
                  Back to Login
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

export default ResetPasswordPage;
