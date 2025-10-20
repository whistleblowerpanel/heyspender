"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PaymentCallbackForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment reference from URL
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');
        const paymentRef = reference || trxref;

        if (!paymentRef) {
          setStatus('error');
          setMessage('Payment reference not found');
          return;
        }

        // Verify payment with Paystack
        const verifyResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference: paymentRef }),
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success) {
          setStatus('error');
          setMessage(verifyResult.message || 'Payment verification failed');
          return;
        }

        const paymentData = verifyResult.data;

        // Update claim status
        const { error: claimError } = await supabase
          .from('claims')
          .update({ 
            status: 'completed',
            payment_reference: paymentRef,
            payment_data: paymentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentData.metadata.claim_id);

        if (claimError) {
          console.error('Error updating claim:', claimError);
          setStatus('error');
          setMessage('Failed to update claim status');
          return;
        }

        // Credit recipient's wallet
        const { error: walletError } = await supabase
          .from('wallets')
          .upsert({
            user_id: paymentData.metadata.recipient_id,
            balance: paymentData.amount / 100, // Convert from kobo to naira
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (walletError) {
          console.error('Error updating wallet:', walletError);
          setStatus('error');
          setMessage('Failed to credit wallet');
          return;
        }

        // Create wallet transaction record
        const { error: transactionError } = await supabase
          .from('wallet_transactions')
          .insert({
            user_id: paymentData.metadata.recipient_id,
            amount: paymentData.amount / 100,
            type: 'credit',
            description: `Payment for ${paymentData.metadata.item_name}`,
            reference: paymentRef,
            created_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('Error creating transaction:', transactionError);
        }

        // Send notification to recipient
        try {
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipient_id: paymentData.metadata.recipient_id,
              type: 'payment_received',
              title: 'Payment Received!',
              message: `You received ₦${(paymentData.amount / 100).toLocaleString()} for ${paymentData.metadata.item_name}`,
              data: {
                claim_id: paymentData.metadata.claim_id,
                amount: paymentData.amount / 100,
                item_name: paymentData.metadata.item_name
              }
            }),
          });
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError);
        }

        setStatus('success');
        setMessage('Payment processed successfully!');
        setDetails({
          amount: paymentData.amount / 100,
          itemName: paymentData.metadata.item_name,
          recipientName: paymentData.metadata.recipient_name
        });

        // Redirect to wishlist after 3 seconds
        setTimeout(() => {
          router.push(`/${paymentData.metadata.username}/${paymentData.metadata.wishlist_slug}`);
        }, 3000);

      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment');
      }
    };

    if (user) {
      processPayment();
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [searchParams, user, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {details && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Amount:</span> ₦{details.amount.toLocaleString()}</p>
                <p><span className="font-medium">Item:</span> {details.itemName}</p>
                <p><span className="font-medium">Recipient:</span> {details.recipientName}</p>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-gray-500">
              Redirecting to wishlist in a few seconds...
            </p>
          )}
          
          {status === 'error' && (
            <button
              onClick={() => router.back()}
              className="mt-4 bg-brand-purple-dark text-white px-6 py-2 rounded-lg hover:bg-brand-purple-light transition-colors"
            >
              Go Back
            </button>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

const PaymentCallbackPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
      </div>
    }>
      <PaymentCallbackForm />
    </Suspense>
  );
};

export default PaymentCallbackPage;
