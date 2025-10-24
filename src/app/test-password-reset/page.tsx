'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const PasswordResetTestPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const testPasswordReset = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('Testing password reset for:', email);
      
      // Test the password reset request
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      console.log('Password reset response:', { data, error });

      if (error) {
        setResult({
          success: false,
          error: error.message,
          details: error
        });
        toast({
          title: 'Password Reset Failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setResult({
          success: true,
          message: 'Password reset email sent successfully',
          details: data
        });
        toast({
          title: 'Success',
          description: 'Password reset email sent! Check your inbox.'
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({
        success: false,
        error: 'Unexpected error occurred',
        details: err
      });
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }

    setLoading(false);
  };

  const testSessionCheck = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session:', { session, error });
      
      setResult({
        success: true,
        message: 'Session check completed',
        details: { session, error }
      });
    } catch (err) {
      console.error('Session check error:', err);
      setResult({
        success: false,
        error: 'Session check failed',
        details: err
      });
    }
  };

  const testAuthState = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Current user:', { user, error });
      
      setResult({
        success: true,
        message: 'User check completed',
        details: { user, error }
      });
    } catch (err) {
      console.error('User check error:', err);
      setResult({
        success: false,
        error: 'User check failed',
        details: err
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Password Reset Testing Tool
          </h1>
          
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <Label htmlFor="email">Test Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="mt-1"
              />
            </div>

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={testPasswordReset}
                disabled={loading || !email}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Test Password Reset'}
              </Button>
              
              <Button
                onClick={testSessionCheck}
                variant="outline"
              >
                Check Session
              </Button>
              
              <Button
                onClick={testAuthState}
                variant="outline"
              >
                Check User
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Test Results
                </h3>
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="font-medium mb-2">
                    {result.success ? '✅ Success' : '❌ Error'}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {result.message || result.error}
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Testing Instructions:
              </h4>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Enter a test email address</li>
                <li>Click "Test Password Reset"</li>
                <li>Check the results above</li>
                <li>Check your email inbox (and spam folder)</li>
                <li>If email received, click the reset link</li>
                <li>Verify it redirects to the reset password page</li>
              </ol>
            </div>

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Debug Information:
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                <div>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</div>
                <div>Expected Reset URL: {typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetTestPage;
