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
    setLoading(true);

    const { error } = await requestPasswordReset(email);

    if (error) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error.message),
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Success",
        description: "Password reset link sent to your email!",
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
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-brand-purple-dark">Forgot Password?</h1>
                  <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    autoComplete="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="you@example.com"
                    className="border-2 border-black"
                  />
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
            ) : (
              <div className="space-y-6">
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;