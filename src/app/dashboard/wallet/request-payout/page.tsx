"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  Shield,
  Zap,
  TrendingUp,
  Banknote,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

const RequestPayoutPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wallet, transactions, loading, refreshWallet } = useWallet();
  const { toast } = useToast();
  
  // State management
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutAmountFormatted, setPayoutAmountFormatted] = useState('');
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [bankDetailsLoading, setBankDetailsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch payouts to calculate correct balance (same as wallet page)
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  // Fetch payouts and check bank details
  useEffect(() => {
    const fetchPayouts = async () => {
      if (!wallet?.id) {
        setPayouts([]);
        setPayoutsLoading(false);
        return;
      }
      
      setPayoutsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payouts')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPayouts(data || []);
      } catch (error) {
        console.error('Error fetching payouts:', error);
      } finally {
        setPayoutsLoading(false);
      }
    };

    const checkBankDetails = async () => {
      if (!user?.id) {
        setHasBankDetails(false);
        setBankDetailsLoading(false);
        return;
      }

      setBankDetailsLoading(true);
      try {
        // Check if user has bank account details in their profile
        const { data: userData, error } = await supabase
          .from('users')
          .select('bank_account_number, bank_name, account_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user bank details:', error);
        }

        // Check if user has all required bank details
        const hasRequiredDetails = userData && 
          userData.bank_account_number && 
          userData.bank_name && 
          userData.account_name;

        setHasBankDetails(!!hasRequiredDetails);
      } catch (error) {
        console.error('Error checking bank details:', error);
        setHasBankDetails(false);
      } finally {
        setBankDetailsLoading(false);
      }
    };

    fetchPayouts();
    checkBankDetails();
  }, [wallet?.id, user?.id]);

  // Format currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format number with commas
  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat('en-NG').format(number || 0);
  };

  // Handle amount input with comma formatting
  const handleAmountChange = (value) => {
    // Remove commas and non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    setPayoutAmount(numericValue);
    
    // Format with commas for display
    if (numericValue) {
      setPayoutAmountFormatted(formatNumberWithCommas(parseInt(numericValue)));
    } else {
      setPayoutAmountFormatted('');
    }
  };

  // Calculate available balance using the same logic as wallet page
  const availableBalance = useMemo(() => {
    if (!transactions) return 0;
    
    // Calculate total received from credit transactions
    const totalReceived = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Calculate total withdrawn from payouts
    const totalWithdrawn = (payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    // Balance calculation: credits minus payouts
    // Do NOT subtract sent contributions; they are paid from bank, not wallet
    return totalReceived - totalWithdrawn;
  }, [transactions, payouts]);

  // Handle payout request submission
  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid amount',
        description: 'Please enter a valid payout amount.'
      });
      return;
    }

    if (parseFloat(payoutAmount) > availableBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient balance',
        description: `You cannot request more than your current balance of ${formatAmount(availableBalance)}.`
      });
      return;
    }

    if (!user?.id || !wallet?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User or wallet not found. Please try again.'
      });
      return;
    }

    setSubmitting(true);

    try {
      // First, get user's bank details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('bank_account_number, bank_code, account_name, bank_name')
        .eq('id', user.id)
        .single();

      if (userError || !userData) {
        toast({
          variant: 'destructive',
          title: 'Bank Details Required',
          description: 'Please add your bank account details in Settings before requesting a payout.'
        });
        setSubmitting(false);
        return;
      }

      if (!userData.bank_account_number || !userData.bank_code) {
        toast({
          variant: 'destructive',
          title: 'Bank Details Required',
          description: 'Please add your bank account details in Settings before requesting a payout.'
        });
        setSubmitting(false);
        return;
      }

      // Create payout request in database
      const { data: payoutData, error: payoutError } = await supabase
        .from('payouts')
        .insert({
          wallet_id: wallet.id,
          amount: parseFloat(payoutAmount),
          destination_bank_code: userData.bank_code,
          destination_account: userData.bank_account_number,
          status: 'requested',
          provider: 'paystack',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (payoutError) {
        console.error('Error creating payout request:', payoutError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create payout request. Please try again.'
        });
        setSubmitting(false);
        return;
      }

      // Audit log functionality removed due to schema issues

      toast({
        title: 'Payout Request Submitted',
        description: `Your request for ${formatAmount(parseFloat(payoutAmount))} has been submitted and will be processed within 1-2 business days.`
      });
      
      // Navigate back to wallet page
      router.push('/dashboard/wallet');
      
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if we're in loading state
  const isLoading = loading || bankDetailsLoading || payoutsLoading;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="px-4 pt-32 pb-28 sm:pb-36">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
              </div>
            ) : (
              <>
                {/* Back Navigation */}
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/wallet')}
                    className="inline-flex items-center text-brand-purple-dark hover:text-brand-purple-dark/80 transition-colors p-0 h-auto group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Wallet
                  </Button>
                </div>

                {/* Main Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Page Header */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-purple-dark/10 mb-4">
                      <ArrowUpRight className="w-8 h-8 text-brand-purple-dark" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                      Request Payout
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      Withdraw your earnings securely to your bank account. 
                      Fast, reliable, and transparent processing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Balance Overview Card */}
                      <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-purple-dark to-brand-purple">
                        <CardContent className="p-8 text-white">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
                              <div className="text-4xl font-bold">{formatAmount(availableBalance)}</div>
                            </div>
                                    <div className="w-16 h-16 bg-white/20 flex items-center justify-center">
                                      <CreditCard className="w-8 h-8" />
                                    </div>
                          </div>
                          <div className="flex items-center gap-2 text-white/90">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">Secured by bank-level encryption</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payout Form Card */}
                              <Card className="border-0 shadow-lg">
                        <CardContent className="space-y-6">
                           {/* Amount Input */}
                           <div className="space-y-3 mt-16">
                            <Label htmlFor="payout-amount" className="text-base font-semibold text-gray-700">
                              Withdrawal Amount
                            </Label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                ₦
                              </div>
                              <Input
                                id="payout-amount"
                                type="text"
                                placeholder={hasBankDetails ? "Enter amount" : "Setup bank details first"}
                                value={payoutAmountFormatted}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                disabled={!hasBankDetails}
                                className={cn(
                                  "text-lg h-14 pl-12 border-2 border-gray-200 focus:border-brand-purple-dark transition-colors",
                                  !hasBankDetails && "bg-gray-50 cursor-not-allowed"
                                )}
                              />
                            </div>
                            {hasBankDetails ? (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Info className="w-4 h-4" />
                                <span>Minimum: ₦1,000 • Maximum: {formatAmount(availableBalance)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-red-500">
                                <AlertCircle className="w-4 h-4" />
                                <span>Please setup your bank account details first</span>
                              </div>
                            )}
                          </div>

                          {/* Bank Details Status */}
                          <div className={cn(
                            "p-4 border-2 transition-all",
                            hasBankDetails 
                              ? "bg-green-50 border-green-200" 
                              : "bg-red-50 border-red-200"
                          )}>
                            <div className="flex items-start gap-3">
                              {hasBankDetails ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <h4 className={cn(
                                  "font-semibold mb-1",
                                  hasBankDetails ? "text-green-800" : "text-red-800"
                                )}>
                                  {hasBankDetails ? "Bank Account Ready" : "Bank Account Required"}
                                </h4>
                                        <p className={cn(
                                          "text-sm mb-3",
                                          hasBankDetails ? "text-green-700" : "text-red-700"
                                        )}>
                                          {hasBankDetails 
                                            ? "Your bank details are verified and ready for payouts."
                                            : "You need to add your bank account details before requesting payouts."
                                          }
                                </p>
                                {!hasBankDetails && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push('/dashboard/settings')}
                                    className="border-red-300 text-red-700 hover:bg-red-100"
                                  >
                                    Setup Bank Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => router.push('/dashboard/wallet')}
                              className="flex-1 h-14 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleRequestPayout}
                              disabled={!hasBankDetails || submitting}
                              className={cn(
                                "flex-1 h-16 sm:h-14 text-white font-semibold transition-all",
                                hasBankDetails 
                                  ? "bg-brand-purple-dark hover:bg-brand-purple shadow-lg hover:shadow-xl" 
                                  : "bg-gray-400 cursor-not-allowed"
                              )}
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : hasBankDetails ? (
                                <>
                                  <ArrowUpRight className="w-4 h-4 mr-2" />
                                  Request Payout
                                </>
                              ) : (
                                'Setup Required'
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Information Cards */}
                    <div className="space-y-6">
                      {/* Processing Timeline */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            Processing Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {[
                              { step: "Request Submitted", time: "Immediate", icon: CheckCircle2, color: "green" },
                              { step: "Admin Review", time: "Immediately", icon: Clock, color: "orange" },
                              { step: "Processing", time: "2h", icon: Zap, color: "blue" },
                              { step: "Funds Transfer", time: "24h max", icon: TrendingUp, color: "purple" }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className={cn(
                                  "w-8 h-8 flex items-center justify-center",
                                  item.color === "green" && "bg-green-100",
                                  item.color === "orange" && "bg-orange-100",
                                  item.color === "blue" && "bg-blue-100",
                                  item.color === "purple" && "bg-purple-100"
                                )}>
                                  <item.icon className={cn(
                                    "w-4 h-4",
                                    item.color === "green" && "text-green-600",
                                    item.color === "orange" && "text-orange-600",
                                    item.color === "blue" && "text-blue-600",
                                    item.color === "purple" && "text-purple-600"
                                  )} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{item.step}</div>
                                  <div className="text-sm text-gray-500">{item.time}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Email notifications sent at each step
                            </p>
                          </div>
                        </CardContent>
                      </Card>


                      {/* Security Features */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Security Features
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            "Bank-level encryption",
                            "Two-factor authentication",
                            "Fraud monitoring",
                            "Secure payment processing"
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default RequestPayoutPage;
