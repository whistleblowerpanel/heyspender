"use client";

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/AuthGuard';

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { signUpWithEmailPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { username, full_name, email, password } = formData;

    if (!username || !full_name || !password || !email) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError('Username is already taken. Please choose a different one.');
        setLoading(false);
        return;
      }
      
      const signUpPayload = {
        email,
        password,
        options: {
          data: {
            username,
            full_name,
            role: 'user',
          },
          emailRedirectTo: `${window.location.origin}/verify`
        },
      };
      
      const { data, error: signUpError } = await signUpWithEmailPassword(signUpPayload);

      if (signUpError) {
        // Handle rate limit error specifically
        if (signUpError.message && signUpError.message.includes('rate limit')) {
          setError('Too many registration attempts. Please wait a few minutes and try again.');
        } else {
          setError(signUpError.message || 'Failed to create account. Please try again.');
        }
      } else if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          // Email already exists in auth; resend verification email
          const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
          if (resendError) {
            setError('Failed to resend verification email. Please try again.');
          } else {
            // Redirect to verification page
            router.push(returnTo ? `/verify?returnTo=${encodeURIComponent(returnTo)}` : '/verify');
          }
        } else {
          // User successfully signed up - create user record in database
          try {
            const { error: userError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                username: username,
                full_name: full_name,
                email: email,
                role: 'user',
                is_admin: false,
                is_active: true,
                email_verified_at: null // Will be set when email is verified
              });

            if (userError) {
              console.error('Error creating user record:', userError);
              // Don't fail the signup if user record creation fails
            }
          } catch (err) {
            console.error('Exception creating user record:', err);
          }

          // User successfully signed up - redirect to verification page
          router.push(returnTo ? `/verify?returnTo=${encodeURIComponent(returnTo)}` : '/verify');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
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
                Join HeySpender
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Create Your</span>
                <br />
                <span className="text-gray-800">Account</span>
              </h1>

              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  Join thousands of people who are already making their dreams come true with HeySpender.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Registration Form */}
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
                <h2 className="text-2xl font-bold text-black mb-2">Create Account</h2>
                <p className="text-gray-600">Join HeySpender today!</p>
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

              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    type="text" 
                    autoComplete="name" 
                    value={formData.full_name} 
                    onChange={handleInputChange} 
                    required 
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
                  />
                </div>
                
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      autoComplete="new-password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
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
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  variant="custom" 
                  className="w-full bg-brand-orange text-black disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Register</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="font-medium text-brand-purple-dark hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </form>
            </motion.div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

const RegisterPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </AuthGuard>
  );
};

export default RegisterPage;