"use client";

import React, { useState } from 'react';
import { AlertCircle, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const EmailVerificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Don't show banner if user is not logged in
  if (!user) return null;

  // Don't show banner if user's email is already verified
  // This will be used in the future when we re-enable email verification
  const shouldShowBanner = false; // TODO: Change this to check user.email_verified_at when we re-enable verification

  if (!shouldShowBanner || !isVisible) return null;

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Sent",
          description: "Verification email has been sent to your inbox.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-500 border-b border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-yellow-800 mr-3" />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-yellow-800">
                Please verify your email address to access all features.
              </p>
              <div className="mt-2 sm:mt-0 sm:ml-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-600 border-yellow-700 text-yellow-100 hover:bg-yellow-700"
                >
                  {isResending ? "Sending..." : "Resend Email"}
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-yellow-800 hover:bg-yellow-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;