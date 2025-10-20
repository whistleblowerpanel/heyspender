"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/AuthGuard';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await requestPasswordReset(email);

      if (error) {
        console.error('Password reset request error:', error);
        setError(error.message || 'Failed to send reset email. Please try again.');
      } else {
        console.log('Password reset email sent successfully to:', email);
        setEmailSent(true);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  if (emailSent) {
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
                  Check Your Email
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-brand-purple-dark">Reset Link</span>
                  <br />
                  <span className="text-gray-800">Sent!</span>
                </h1>
              </motion.div>
            </div>
          </section>

          {/* Success Message */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 border-2 border-black shadow-flat-left text-center"
              >
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                
                <h2 className="text-2xl font-bold text-black mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to your email address.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="font-semibold text-gray-900">{email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  variant="custom"
                  className="w-full bg-brand-purple text-white cursor-pointer"
                >
                  Back to Login
                </Button>
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
                <span className="text-brand-purple-dark">Forgot Your</span>
                <br />
                <span className="text-gray-800">Password?</span>
              </h1>

              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  No worries! Enter your email and we'll send you a reset link.
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
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email to receive a reset link</p>
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
                  />
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
                      <span>Sending Reset Link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
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

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-purple-dark text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Need Help?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                If you're still having trouble, contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/contact')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Contact Support</span>
                </Button>
                <Button
                  onClick={() => router.push('/faq')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>View FAQ</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </AuthGuard>
  );
};

export default ForgotPasswordPage;
