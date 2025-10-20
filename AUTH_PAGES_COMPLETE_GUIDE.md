# Authentication Pages Complete Implementation Guide

## Overview
This guide provides comprehensive instructions for implementing all authentication pages in HeySpender Next.js: Login, Register, Forgot Password, Reset Password, and Email Verification pages.

## ⚠️ **CRITICAL DESIGN REQUIREMENTS**

### **NO BORDER RADIUS WHATSOEVER**
- **ALL elements must have `rounded-none` or NO `rounded-*` classes**
- **Forms, inputs, buttons - EVERYTHING must be sharp corners**
- **This is a core brand requirement - NO EXCEPTIONS**

### **EXACT Design Specifications**
- **Border styling**: `border-2 border-black` for all forms and inputs
- **Color scheme**: Brand purple dark, brand green, brand orange
- **Typography**: Clean, bold headings with proper spacing
- **Form layout**: Centered, max-width-md, proper spacing

---

## 1. LOGIN PAGE (`/auth/login/page.tsx`)

### **1.1 Complete Login Page Implementation**
```tsx
"use client";

import React, { useState } from 'react';
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

const LoginPage = () => {
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
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Username or email not found. Please check your credentials.' });
        setLoading(false);
        return;
      }
      email = user.email;
    }

    const { data, error } = await signInWithEmailPassword({ email, password });

    if (error) {
      const friendlyMessage = getUserFriendlyError(error, 'logging in');
      toast({ variant: 'destructive', title: 'Login Error', description: friendlyMessage });
    } else {
      // Check if user is admin
      const isAdmin = data.user.user_metadata?.role === 'admin';
      
      if (isAdmin) {
        // Admins always go to admin dashboard
        router.push('/admin/dashboard');
      } else {
        // For regular users, redirect to returnTo or default logic
        if (returnTo && !returnTo.startsWith('/admin')) {
          router.push(returnTo);
        } else {
          // Check if they have claims to show spender list
          const { data: claimsCount } = await supabase
            .from('claims')
            .select('id', { count: 'exact', head: true })
            .eq('supporter_user_id', data.user.id);
          
          if (data.user.identities?.length > 0 && (claimsCount || 0) > 0) {
            router.push('/dashboard/spender-list');
          } else {
            router.push('/dashboard');
          }
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

export default LoginPage;
```

---

## 2. REGISTER PAGE (`/auth/register/page.tsx`)

### **2.1 Complete Register Page Implementation**
```tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { EmailService } from '@/lib/emailService';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpWithEmailPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const returnTo = searchParams.get('returnTo');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, full_name, email, password } = formData;

    if (!username || !full_name || !password || !email) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all required fields.' });
      setLoading(false);
      return;
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      toast({ variant: 'destructive', title: 'Username taken', description: 'This username is already taken. Please choose another.' });
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
        emailRedirectTo: 'https://heyspender.com/auth/confirm'
      },
    };
    
    const { data, error } = await signUpWithEmailPassword(signUpPayload);

    if (error) {
      const friendlyMessage = getUserFriendlyError(error, 'creating your account');
      
      // Handle rate limit error specifically
      if (error.message && error.message.includes('rate limit')) {
        toast({ 
          variant: 'destructive', 
          title: 'Email Rate Limit Exceeded', 
          description: 'Too many registration attempts. Please wait a few minutes and try again, or contact support if this continues.' 
        });
      } else {
        toast({ variant: 'destructive', title: 'Sign Up Error', description: friendlyMessage || error.message });
      }
    } else if (data.user) {
      if (data.user.identities && data.user.identities.length === 0) {
        // Email already exists in auth; resend verification email and guide user to verify
        const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
        if (resendError) {
          toast({ variant: 'destructive', title: 'Resend Verification Failed', description: resendError.message });
        } else {
          toast({ title: 'Verification email resent', description: 'Please check your inbox.' });
          router.push(returnTo ? `/auth/verify?returnTo=${encodeURIComponent(returnTo)}` : '/auth/verify');
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

        // Send welcome email immediately after registration
        try {
          const welcomeEmailResult = await EmailService.sendWelcomeEmail({
            userEmail: email,
            username: username,
            fullName: full_name
          });
          
          if (welcomeEmailResult.success) {
            console.log('✅ Welcome email sent successfully to:', email);
          } else {
            console.error('❌ Failed to send welcome email:', welcomeEmailResult.error);
          }
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the registration process if email fails
        }

        // User successfully signed up - redirect to verification page with return URL
        toast({ 
          title: 'Account Created!', 
          description: 'Welcome to HeySpender! Please check your email to verify your account. You can make contributions while waiting for verification.' 
        });
        router.push(returnTo ? `/auth/verify?returnTo=${encodeURIComponent(returnTo)}` : '/auth/verify');
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
                      type={showPassword ? "text" : "password"} 
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

export default RegisterPage;
```

---

## 3. FORGOT PASSWORD PAGE (`/auth/forgot-password/page.tsx`)

### **3.1 Complete Forgot Password Page Implementation**
```tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({ variant: 'destructive', title: 'Email Required', description: 'Please enter your email address.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await requestPasswordReset(email);

      if (error) {
        console.error('Password reset request error:', error);
        const friendlyMessage = getUserFriendlyError(error, 'requesting password reset');
        toast({ variant: 'destructive', title: 'Request Failed', description: friendlyMessage });
      } else {
        console.log('Password reset email sent successfully to:', email);
        setEmailSent(true);
        toast({ title: 'Email Sent!', description: 'Check your inbox for the password reset link.' });
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred. Please try again.' });
    }

    setLoading(false);
  };

  if (emailSent) {
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
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-purple-dark">Check Your Email</h1>
                <p className="text-gray-600">We've sent a password reset link to your email address.</p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-green flex items-center justify-center mx-auto mb-4 border-2 border-black">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <p className="font-semibold text-gray-900">{email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                </div>
              </div>

              <Link href="/auth/login">
                <Button variant="custom" className="w-full bg-brand-purple-dark text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-purple-dark">Forgot Password?</h1>
                <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    autoComplete="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    required 
                    className="border-2 border-black"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                variant="custom" 
                className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Send Reset Link</span>}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
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

export default ForgotPasswordPage;
```

---

## 4. RESET PASSWORD PAGE (`/auth/reset-password/page.tsx`)

### **4.1 Complete Reset Password Page Implementation**
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { user, resetPassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all fields.' });
      return;
    }

    if (password.length < 8) {
      toast({ variant: 'destructive', title: 'Password Too Short', description: 'Password must be at least 8 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords Don\'t Match', description: 'Please make sure both passwords match.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(password);

      if (error) {
        const friendlyMessage = getUserFriendlyError(error, 'resetting password');
        toast({ variant: 'destructive', title: 'Reset Failed', description: friendlyMessage });
      } else {
        toast({ title: 'Password Reset Successfully!', description: 'Your password has been updated.' });
        // Redirect to login or dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred. Please try again.' });
    }

    setLoading(false);
  };

  if (checkingSession) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-purple-dark" />
              <p className="mt-4 text-gray-600">Verifying reset link...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isValidSession) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 flex items-center justify-center border-2 border-black">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-brand-purple-dark mb-2">Invalid or Expired Link</h1>

              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <Link href="/auth/forgot-password">
                <Button variant="custom" className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
                  Request New Link
                </Button>
              </Link>

              <div className="pt-4">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-brand-green flex items-center justify-center border-2 border-black">
                    <Lock className="w-6 h-6 text-black" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-brand-purple-dark">Reset Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your new password below
                </p>
              </div>

              <div className="space-y-4">
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
                      className="border-2 border-black"
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
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                variant="custom" 
                className="w-full bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Reset Password</span>}
                {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
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
```

---

## 5. EMAIL VERIFICATION PAGE (`/auth/verify/page.tsx`)

### **5.1 Complete Email Verification Page Implementation**
```tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { user } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  const handleContinueContributing = async () => {
    setIsCheckingSession(true);
    
    try {
      console.log('🔍 Checking session for contribution access...');
      
      // Try to get session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session check result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        returnTo: returnTo,
        error: error?.message
      });
      
      if (session?.user) {
        console.log('✅ User has valid session, navigating to contribution');
        router.push(returnTo);
      } else {
        console.log('⚠️ No session found, but allowing access to return URL');
        // Allow access even without session
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('❌ Error checking session:', error);
      // Even on error, allow access
      console.log('⚠️ Error occurred, but allowing access anyway');
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/dashboard');
      }
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleClose = async () => {
    setIsCheckingSession(true);
    
    try {
      console.log('🔍 Checking session for dashboard access...');
      
      // Try to get session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session check result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
        error: error?.message
      });
      
      if (session?.user) {
        console.log('✅ User has valid session, navigating to dashboard');
        const isAdmin = session.user.user_metadata?.role === 'admin';
        router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        console.log('⚠️ No session found, but allowing dashboard access anyway');
        // Allow access to dashboard even without session - they'll see the verification banner
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('❌ Error checking session:', error);
      // Even on error, allow dashboard access
      console.log('⚠️ Error occurred, but allowing dashboard access anyway');
      router.push('/dashboard');
    } finally {
      setIsCheckingSession(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-6 bg-brand-purple-dark text-white border-2 border-black text-center"
        >
          <MailCheck className="w-16 h-16 mx-auto text-brand-green" />
          <h1 className="text-3xl font-bold text-white">Check Your Inbox!</h1>
          <p className="text-white/90">
            We've sent a verification link to your email address. Please click the link to confirm your account.
          </p>
          <p className="text-sm text-white/80">
            You can make contributions while waiting for verification, but you'll need to verify your email to access your dashboard.
          </p>
          <p className="text-xs text-white/60 bg-white/5 p-2 border border-white/10">
            💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
          </p>
          {user && (
            <div className="text-xs text-white/60 bg-white/10 p-2 border border-white/10">
              <p>Current user: {user.email}</p>
              <p>Verified: {user.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {returnTo && (
              <Button 
                variant="custom" 
                className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
                onClick={handleContinueContributing}
                disabled={isCheckingSession}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isCheckingSession ? 'Checking session...' : 'Continue Contributing'}
              </Button>
            )}
            <Button 
              variant="custom" 
              className="bg-brand-accent-red text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
              onClick={handleClose} 
              disabled={isCheckingSession}
            >
              <X className="mr-2 h-4 w-4" />
              {isCheckingSession ? 'Checking session...' : 'Go to Dashboard'}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyPage;
```

---

## 6. REQUIRED DEPENDENCIES & SETUP

### **6.1 Environment Variables**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **6.2 Required Components**
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/label`
- `@/components/ui/use-toast`
- `@/contexts/SupabaseAuthContext`
- `@/lib/customSupabaseClient`
- `@/lib/emailService`
- `@/lib/utils`

### **6.3 Database Tables Required**
- `users` - stores user information
- `claims` - for checking user claims (login redirect logic)

---

## 7. TESTING CHECKLIST

### **7.1 Login Page Tests**
- [ ] Username login works
- [ ] Email login works
- [ ] Password visibility toggle works
- [ ] Admin redirect to admin dashboard
- [ ] Regular user redirect logic
- [ ] ReturnTo parameter handling
- [ ] Error handling for invalid credentials
- [ ] Forgot password link works

### **7.2 Register Page Tests**
- [ ] Form validation works
- [ ] Username uniqueness check
- [ ] Email validation
- [ ] Password visibility toggle
- [ ] Welcome email sending
- [ ] Database user record creation
- [ ] Redirect to verification page
- [ ] ReturnTo parameter handling
- [ ] Rate limiting error handling

### **7.3 Forgot Password Tests**
- [ ] Email validation
- [ ] Reset email sending
- [ ] Success state display
- [ ] Back to login navigation
- [ ] Error handling

### **7.4 Reset Password Tests**
- [ ] Session validation
- [ ] Invalid link handling
- [ ] Password confirmation matching
- [ ] Password length validation
- [ ] Password visibility toggles
- [ ] Successful reset redirect
- [ ] Error handling

### **7.5 Verification Page Tests**
- [ ] Session checking
- [ ] Continue contributing button
- [ ] Go to dashboard button
- [ ] ReturnTo parameter handling
- [ ] User info display
- [ ] Mobile user instructions

### **7.6 Design Tests**
- [ ] **NO border radius anywhere** (critical requirement)
- [ ] All forms have `border-2 border-black`
- [ ] All buttons have proper shadow styling
- [ ] Brand colors used correctly
- [ ] Typography and spacing consistent
- [ ] Responsive design works on mobile

---

## 8. DEPLOYMENT CONSIDERATIONS

### **8.1 Supabase Configuration**
- Ensure email templates are configured
- Set up proper redirect URLs
- Configure rate limiting
- Set up email verification settings

### **8.2 Email Service Setup**
- Configure SMTP settings in Supabase
- Test email delivery
- Set up email templates
- Monitor email delivery rates

### **8.3 Security Considerations**
- Rate limiting on auth endpoints
- Proper session management
- Secure password requirements
- Email verification enforcement

---

## CONCLUSION

This guide provides complete implementations for all authentication pages in HeySpender Next.js. Each page maintains **100% feature parity** with the original React version while ensuring **exact design compliance** (no border radius) and proper Next.js integration.

**Key features implemented:**
1. **Complete authentication flow** with Supabase
2. **Username/email login** support
3. **Password reset** with email verification
4. **User registration** with welcome emails
5. **Email verification** handling
6. **Admin/regular user** redirect logic
7. **ReturnTo parameter** support
8. **Exact design specifications** (no border radius)
9. **Error handling** and user feedback
10. **Mobile-friendly** responsive design

Follow this guide exactly to ensure the Next.js version matches the original React implementation perfectly! 🎉
