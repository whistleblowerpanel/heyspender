"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download,
  Search,
  X,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gift,
  Send,
  ChevronsRight,
  Banknote
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, isAfter, isBefore, startOfDay, endOfDay, subDays, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

const WalletPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wallet, transactions, loading, refreshWallet } = useWallet();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to homepage instead of login page
      // This prevents the flash of login page when user logs out
      router.push('/', { replace: true });
    }
  }, [user, authLoading, router]);

  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [bankDetailsModalOpen, setBankDetailsModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch payouts to calculate correct balance
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  // Check if user has bank account details
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [bankDetailsLoading, setBankDetailsLoading] = useState(true);

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

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: ''
  });


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


  // Get transaction icon
  const getTransactionIcon = (transaction) => {
    const source = transaction.source?.toLowerCase() || '';
    if (source.includes('withdrawal') || transaction.is_payout) return Banknote;
    if (source.includes('contribution')) return Gift;
    if (source.includes('sent') || source.includes('cash_payment')) return Send;
    if (transaction.type === 'credit') return ArrowDownLeft;
    if (transaction.type === 'debit') return ArrowUpRight;
    return DollarSign;
  };

  // Get transaction color
  const getTransactionColor = (transaction) => {
    if (transaction.is_payout) return 'text-orange-600';
    if (transaction.type === 'credit') return 'text-green-600';
    if (transaction.type === 'debit') return 'text-red-600';
    return 'text-gray-600';
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status, isWithdrawal = false) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'default';
      case 'paid':
        // For withdrawals, completed status gets green background
        return isWithdrawal ? 'default' : 'default';
      case 'pending':
      case 'requested':
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'paid':
        return CheckCircle2;
      case 'pending':
      case 'requested':
      case 'processing':
        return Clock;
      case 'failed':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  // Get readable status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'paid':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'success':
        return 'Success';
      default:
        return status || 'Unknown';
    }
  };

  // Extract recipient username from transaction description
  const getRecipientUsername = (transaction) => {
    if (transaction.type === 'debit' && transaction.description) {
      // Look for pattern: "Payment sent for "Item Name" to @username - Ref: ..."
      const match = transaction.description.match(/to @([a-zA-Z0-9_]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  // Get transaction category
  const getTransactionCategory = (transaction) => {
    if (transaction.is_payout) return 'Withdrawal';
    if (transaction.type === 'credit') return 'Credit';
    if (transaction.type === 'debit' && transaction.source === 'cash_payment') return 'Cash Payment';
    if (transaction.type === 'debit') return 'Debit';
    return 'Transaction';
  };

  // Date filter logic
  const filterByDate = (transaction) => {
    const txDate = new Date(transaction.created_at);
    const today = new Date();
    
    switch (dateFilter) {
      case 'today':
        return format(txDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      case 'week':
        return isAfter(txDate, subDays(today, 7));
      case 'month':
        return isAfter(txDate, subMonths(today, 1));
      case 'custom':
        // TODO: Implement custom date range picker
        return true;
      default:
        return true;
    }
  };

  // Merge payouts into transactions as withdrawal entries
  const allTransactionsWithPayouts = useMemo(() => {
    const txs = transactions || [];
    const withdrawals = (payouts || []).map(payout => ({
      id: `payout_${payout.id}`,
      wallet_id: payout.wallet_id,
      type: 'debit',
      source: 'withdrawal',
      amount: payout.amount,
      title: 'Wallet Withdrawal',
      description: `Withdrawal to bank account`,
      status: payout.status,
      created_at: payout.created_at,
      // Add payout-specific fields for display
      payout_status: payout.status,
      is_payout: true
    }));
    
    // Merge and sort by created_at descending
    return [...txs, ...withdrawals].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }, [transactions, payouts]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactionsWithPayouts;

    // Tab filter
    if (activeTab === 'received') {
      filtered = filtered.filter(t => t.type === 'credit');
    } else if (activeTab === 'sent') {
      filtered = filtered.filter(t => t.type === 'debit' && !t.is_payout);
    } else if (activeTab === 'withdrawals') {
      filtered = filtered.filter(t => t.is_payout);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Date filter
    filtered = filtered.filter(filterByDate);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(query) ||
        t.contributor_name?.toLowerCase().includes(query) ||
        t.title?.toLowerCase().includes(query) ||
        t.recipient_username?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allTransactionsWithPayouts, activeTab, typeFilter, statusFilter, dateFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allTransactions = transactions || [];
    // Note: All transactions in the array are already successful (filtered at query time)
    // so we don't need to filter by status here
    const totalReceived = allTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalSent = allTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Calculate total withdrawn from payouts table only
    const totalWithdrawn = (payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    // Balance calculation: credits only, minus payouts
    // Do NOT subtract sent contributions; they are paid from bank, not wallet
    const balance = allTransactions.reduce((acc, t) => {
      if (t.type === 'credit') return acc + Number(t.amount || 0);
      // Do not subtract sent contributions; they are paid from bank, not wallet
      return acc;
    }, 0) - totalWithdrawn;
    
    const pendingPayouts = (payouts || [])
      .filter(p => p.status === 'requested' || p.status === 'processing')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    const receivedCount = allTransactions.filter(t => t.type === 'credit').length;
    const sentCount = allTransactions.filter(t => t.type === 'debit').length;

    return {
      totalReceived,
      totalSent: totalWithdrawn, // Show total withdrawn (from payouts) not sent contributions
      pendingPayouts,
      receivedCount,
      sentCount,
      balance
    };
  }, [transactions, payouts]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers

  const handleSaveBankDetails = async () => {
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all bank details fields.'
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not found. Please try again.'
      });
      return;
    }

    try {
      // Get bank code from bank name
      const bankCodes = {
        'access': '044',
        'gtb': '058',
        'uba': '033',
        'zenith': '057',
        'first': '011',
        'fidelity': '070',
        'union': '032',
        'sterling': '232',
        'stanbic': '221',
        'fcmb': '214',
        'heritage': '030',
        'keystone': '082',
        'kuda': '50211',
        'opay': '100004',
        'palmpay': '100033',
        'polaris': '076',
        'providus': '101',
        'standard': '068',
        'suntrust': '100',
        'unity': '215',
        'vfd': '566',
        'wema': '035',
        'citibank': '023',
        'diamond': '063',
        'ecobank': '050'
      };

      const bankCode = bankCodes[bankDetails.bankName.toLowerCase()] || '';

      // Update user's bank details in database
      const { error } = await supabase
        .from('users')
        .update({
          account_name: bankDetails.accountName,
          bank_account_number: bankDetails.accountNumber,
          bank_name: bankDetails.bankName,
          bank_code: bankCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving bank details:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save bank details. Please try again.'
        });
        return;
      }

      toast({
        title: 'Bank Details Saved',
        description: 'Your bank details have been saved successfully.'
      });
      
      setBankDetailsModalOpen(false);
      
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleExportTransactions = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wallet-transactions-${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'Export Completed',
      description: `${filteredTransactions.length} transactions exported successfully.`
    });
    
    setExportModalOpen(false);
  };

  const handleRefresh = async () => {
    toast({
      title: 'Refreshing...',
      description: 'Fetching latest wallet data.'
    });
    await refreshWallet();
    toast({
      title: 'Refreshed',
      description: 'Wallet data updated successfully.'
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Check if we're in loading state
  const isLoading = loading || payoutsLoading || bankDetailsLoading;

  return (
    <AuthGuard>
    <div>
      {/* Main content container */}
      <div className="px-4 pt-32 pb-28 sm:pb-36">
        <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 w-1/4"></div>
            <div className="h-48 bg-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200"></div>
              <div className="h-32 bg-gray-200"></div>
              <div className="h-32 bg-gray-200"></div>
            </div>
            <div className="h-96 bg-gray-200"></div>
          </div>
        ) : (
          <>
        {/* Page Title and Description */}
        <div className="flex flex-row items-start justify-between mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-brand-purple-dark mb-2">Wallet</h1>
            <p className="text-gray-600">
              Manage your earnings, track contributions received, and request payouts.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 self-start mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-none"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 rounded-none"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wallet Balance Card */}
            <div className="border text-card-foreground shadow-sm bg-white">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Wallet Balance</h3>
                <Wallet className="h-4 w-4 text-green-600" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{formatAmount(stats.balance)}</div>
              </div>
            </div>

            {/* Total Received Card */}
            <div className="border text-card-foreground shadow-sm bg-white">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Received</h3>
                <ChevronsRight className="h-4 w-4 text-orange-600" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{formatAmount(stats.totalReceived)}</div>
                <p className="text-xs mt-1 text-muted-foreground">Withdrawal: {formatAmount(stats.totalSent)}</p>
              </div>
            </div>

            {/* Request Payout Card */}
            <button
              onClick={() => router.push('/dashboard/wallet/request-payout')}
              disabled={!stats.balance || stats.balance <= 0}
              className="border text-card-foreground shadow-sm bg-brand-purple-dark p-6 flex flex-col items-center justify-center gap-2 transition-all duration-150 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">Request Payout</span>
            </button>
          </div>

          {/* Transactions Section */}
          <Card className="rounded-none border-none shadow-none px-0">
          <CardHeader className="px-0">
            <div className="flex flex-col gap-0">
              {/* Title and Controls Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-brand-purple-dark whitespace-nowrap">Transaction History</h3>
                  {/* Description - Desktop only */}
                  <CardDescription className="hidden lg:block mt-0.5">
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                
                {/* Search and Tabs */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-none"
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                    <Button
                      onClick={() => setActiveTab('all')}
                      className={`h-10 py-2 border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-sm sm:text-base px-2 sm:px-4 flex-1 sm:flex-none transition-all duration-150 font-semibold active:shadow-[0px_0px_0px_#161B47] active:brightness-90 ${
                        activeTab === 'all'
                          ? 'bg-brand-purple-dark text-white'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setActiveTab('received')}
                      className={`h-10 py-2 border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-sm sm:text-base px-2 sm:px-4 flex-1 sm:flex-none transition-all duration-150 font-semibold active:shadow-[0px_0px_0px_#161B47] active:brightness-90 ${
                        activeTab === 'received'
                          ? 'bg-brand-green text-black'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      Received
                    </Button>
                    <Button
                      onClick={() => setActiveTab('sent')}
                      className={`h-10 py-2 border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-sm sm:text-base px-2 sm:px-4 flex-1 sm:flex-none transition-all duration-150 font-semibold active:shadow-[0px_0px_0px_#161B47] active:brightness-90 ${
                        activeTab === 'sent'
                          ? 'bg-brand-orange text-black'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      Sent
                    </Button>
                    <Button
                      onClick={() => setActiveTab('withdrawals')}
                      className={`h-10 py-2 border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-sm sm:text-base px-2 sm:px-4 flex-1 sm:flex-none transition-all duration-150 font-semibold active:shadow-[0px_0px_0px_#161B47] active:brightness-90 ${
                        activeTab === 'withdrawals'
                          ? 'bg-brand-salmon text-black'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      Withdrawals
                    </Button>
                  </div>

                  {(searchQuery || dateFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-1 rounded-none"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Description - Mobile only, after controls */}
              <CardDescription className="lg:hidden mt-4">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <Wallet className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {transactions?.length === 0 ? 'No Transactions Yet' : 'No Matching Transactions'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {transactions?.length === 0 
                    ? 'Your transaction history will appear here once you start receiving contributions or making payments.'
                    : 'Try adjusting your filters to find what you\'re looking for.'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User/Status</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedTransactions.map((transaction, index) => {
                          const Icon = getTransactionIcon(transaction);
                          
                          return (
                            <motion.tr
                              key={transaction.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                                <br />
                                <span className="text-xs text-gray-400">
                                  {format(new Date(transaction.created_at), 'HH:mm')}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "p-2",
                                    transaction.is_payout 
                                      ? 'bg-orange-100'
                                      : (transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100')
                                  )}>
                                    <Icon className={cn("w-4 h-4", getTransactionColor(transaction))} />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {transaction.title || transaction.description || 'Transaction'}
                                    </div>
                                    {transaction.title && transaction.description && transaction.title !== transaction.description && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {transaction.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant={transaction.is_payout ? getStatusBadgeVariant(transaction.payout_status) : (transaction.type === 'credit' ? 'default' : 'secondary')} className="rounded-none">
                                  {getTransactionCategory(transaction)}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-sm">
                                {transaction.is_payout ? (
                                  <Badge variant={getStatusBadgeVariant(transaction.payout_status, true)} className={cn(
                                    "rounded-none",
                                    transaction.payout_status === 'paid' && "bg-green-600 text-white hover:bg-green-700"
                                  )}>
                                    {getStatusText(transaction.payout_status)}
                                  </Badge>
                                ) : transaction.type === 'credit' ? (
                                  transaction.contributor_name ? (
                                    <span className="text-gray-700">
                                      {transaction.contributor_name.startsWith('@') 
                                        ? transaction.contributor_name 
                                        : `@${transaction.contributor_name}`}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )
                                ) : (
                                  (() => {
                                    const recipientUsername = getRecipientUsername(transaction);
                                    return recipientUsername ? (
                                      <span className="text-gray-700">@{recipientUsername}</span>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    );
                                  })()
                                )}
                              </td>
                              <td className={cn(
                                "py-4 px-4 text-right font-semibold",
                                getTransactionColor(transaction)
                              )}>
                                {transaction.type === 'credit' ? '+' : '-'}
                                {formatAmount(Math.abs(transaction.amount))}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3">
                  <AnimatePresence>
                    {paginatedTransactions.map((transaction, index) => {
                      const Icon = getTransactionIcon(transaction);
                      
                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border p-4 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={cn(
                              "p-2 flex-shrink-0",
                              transaction.is_payout 
                                ? 'bg-orange-100'
                                : (transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100')
                            )}>
                              <Icon className={cn("w-5 h-5", getTransactionColor(transaction))} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {transaction.title || transaction.description || 'Transaction'}
                              </div>
                              {!transaction.is_payout && (transaction.contributor_name || getRecipientUsername(transaction)) && (
                                <div className="text-xs text-gray-600 mt-0.5">
                                  {transaction.type === 'credit' 
                                    ? (transaction.contributor_name?.startsWith('@') 
                                        ? transaction.contributor_name 
                                        : `@${transaction.contributor_name}`)
                                    : `@${getRecipientUsername(transaction)}`
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {!transaction.is_payout && (
                                <Badge variant={transaction.type === 'credit' ? 'default' : 'secondary'} className="text-xs rounded-none">
                                  {getTransactionCategory(transaction)}
                                </Badge>
                              )}
                              {transaction.is_payout && (
                                <Badge variant={getStatusBadgeVariant(transaction.payout_status, true)} className={cn(
                                  "text-xs rounded-none",
                                  transaction.payout_status === 'paid' && "bg-green-600 text-white hover:bg-green-700"
                                )}>
                                  {getStatusText(transaction.payout_status)}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{format(new Date(transaction.created_at), 'MMM dd, yyyy · HH:mm')}</span>
                            </div>
                            <div className={cn(
                              "font-bold text-lg",
                              getTransactionColor(transaction)
                            )}>
                              {transaction.type === 'credit' ? '+' : '-'}
                              {formatAmount(Math.abs(transaction.amount))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-none"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Previous</span>
                      </Button>
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-9 rounded-none"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-none"
                      >
                        <span className="hidden sm:inline mr-1">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          </Card>
        </div>
          </>
        )}
        </div>
      </div>


      {/* Bank Details Modal */}
      <Dialog open={bankDetailsModalOpen} onOpenChange={setBankDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8">
              <CreditCard className="w-5 h-5" />
              Bank Account Details
            </DialogTitle>
            <DialogDescription>
              Add or update your bank account for payouts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                placeholder="Full name on account"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                className="rounded-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="10-digit account number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                maxLength={10}
                className="rounded-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select 
                value={bankDetails.bankName} 
                onValueChange={(value) => setBankDetails({...bankDetails, bankName: value})}
              >
                <SelectTrigger id="bank-name" className="rounded-none">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="access">Access Bank</SelectItem>
                  <SelectItem value="gtb">GTBank</SelectItem>
                  <SelectItem value="uba">UBA</SelectItem>
                  <SelectItem value="zenith">Zenith Bank</SelectItem>
                  <SelectItem value="first">First Bank</SelectItem>
                  <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                  <SelectItem value="union">Union Bank</SelectItem>
                  <SelectItem value="sterling">Sterling Bank</SelectItem>
                  <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                  <SelectItem value="fcmb">FCMB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBankDetailsModalOpen(false)} 
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-base font-bold px-6 py-2 transition-all duration-150 active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveBankDetails} 
              className="bg-brand-purple-dark hover:bg-brand-purple text-white border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-base font-bold px-6 py-2 transition-all duration-150 active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8">
              <Download className="w-5 h-5" />
              Export Transactions
            </DialogTitle>
            <DialogDescription>
              Download your transaction history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transactions:</span>
                <span className="font-semibold">{filteredTransactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date Range:</span>
                <span className="font-semibold">
                  {dateFilter === 'all' ? 'All Time' : dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-semibold">JSON</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setExportModalOpen(false)} 
              className="border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-base font-bold px-6 py-2 transition-all duration-150 active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportTransactions} 
              className="bg-brand-purple-dark hover:bg-brand-purple text-white border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] text-base font-bold px-6 py-2 transition-all duration-150 active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AuthGuard>
  );
};

export default WalletPage;
