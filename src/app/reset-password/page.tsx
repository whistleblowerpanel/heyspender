"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/AuthGuard';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { user, resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user has a valid reset session
    const checkSession = async () => {
      try {
        // First, check if there are URL hash parameters (from email link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        // If we have tokens in the URL, set the session
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
            // Clean up the URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Check existing session
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

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Please make sure both passwords match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(password);

      if (error) {
        setError(error.message || 'Failed to reset password. Please try again.');
      } else {
        // Redirect to login or dashboard
        setTimeout(() => {
          router.push('/dashboard/wishlist/');
        }, 1500);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  if (checkingSession) {
    return (
      <AuthGuard requireAuth={false}>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-purple mb-4" />
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
        <Footer />
      </AuthGuard>
    );
  }

  if (!isValidSession) {
    return (
      <AuthGuard requireAuth={false}>
        <Navbar />
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8"
              >
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Invalid Link
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-red-600">Invalid or</span>
                  <br />
                  <span className="text-gray-800">Expired Link</span>
                </h1>
              </motion.div>
            </div>
          </section>

          {/* Error Message */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 border-2 border-black shadow-flat-left text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-black mb-4">Invalid or Expired Link</h2>
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>

                <Button
                  onClick={() => router.push('/forgot-password')}
                  variant="custom"
                  className="w-full bg-brand-orange text-black cursor-pointer"
                >
                  Request New Link
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Remember your password?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="font-medium text-brand-purple-dark hover:underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </p>
              </motion.div>
            </div>
          </section>
        </div>
        <Footer />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Reset Password
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Create New</span>
                <br />
                <span className="text-gray-800">Password</span>
              </h1>

              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  Enter your new password below to complete the reset process.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Reset Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 border-2 border-black shadow-flat-left"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your new password below</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
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
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div className="relative">
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
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 bottom-1 h-7 w-7" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  variant="custom" 
                  className="w-full bg-brand-green text-black disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resetting Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Reset Password</span>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="font-medium text-brand-purple-dark hover:underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </p>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </AuthGuard>
  );
};

export default ResetPasswordPage;
