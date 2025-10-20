"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AuthGuard from '@/components/AuthGuard';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Users, Gift, Settings, Trash2, ExternalLink, Banknote, CheckCircle, XCircle, DollarSign, Eye, EyeOff, Flag, Save, CreditCard, ArrowUpDown, Wallet as WalletIcon, ChevronsRight, Calendar as CalendarIcon, ArrowDown, ArrowUp, Clock, Code2, Bell, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StatCard = ({ title, value, icon, loading, bgColor = 'bg-brand-cream', textColor = 'text-black' }) => (
    <div className={`border-2 border-black p-4 ${bgColor} relative after:absolute after:left-[-8px] after:bottom-[-8px] after:w-full after:h-full after:bg-black after:z-[-1]`}>
        <div className="relative">
            <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold uppercase ${textColor}`}>{title}</p>
                <div className={textColor}>{icon}</div>
            </div>
            <div className="mt-2">
                {loading ? <Loader2 className={`h-6 w-6 animate-spin ${textColor}`} /> : <p className={`text-3xl font-bold ${textColor}`}>{value}</p>}
            </div>
        </div>
    </div>
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWishlists: 0,
    totalTransactions: 0,
    totalPayouts: 0,
    pendingPayouts: 0,
    totalRevenue: 0
  });

  // Data states
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (usersError) throw usersError;

      // Fetch wishlists
      const { data: wishlistsData, error: wishlistsError } = await supabase
        .from('wishlists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (wishlistsError) throw wishlistsError;

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from('payouts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (payoutsError) throw payoutsError;

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const totalWishlists = wishlistsData?.length || 0;
      const totalTransactions = transactionsData?.length || 0;
      const totalPayouts = payoutsData?.length || 0;
      const pendingPayouts = payoutsData?.filter(p => p.status === 'requested' || p.status === 'processing').length || 0;
      const totalRevenue = transactionsData?.filter(t => t.type === 'credit').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalUsers,
        totalWishlists,
        totalTransactions,
        totalPayouts,
        pendingPayouts,
        totalRevenue
      });

      setUsers(usersData || []);
      setWishlists(wishlistsData || []);
      setTransactions(transactionsData || []);
      setPayouts(payoutsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading dashboard',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePayoutStatusUpdate = async (payoutId, newStatus) => {
    try {
      const { error } = await supabase
        .from('payouts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', payoutId);

      if (error) throw error;

      toast({
        title: 'Payout status updated',
        description: `Payout status changed to ${newStatus}`
      });

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating payout',
        description: error.message
      });
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-[133px] pb-28 sm:pb-36">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-purple-dark mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage users, transactions, and platform operations
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-blue-100"
              textColor="text-blue-800"
            />
            <StatCard
              title="Total Wishlists"
              value={stats.totalWishlists}
              icon={<Gift className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-green-100"
              textColor="text-green-800"
            />
            <StatCard
              title="Total Transactions"
              value={stats.totalTransactions}
              icon={<DollarSign className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-yellow-100"
              textColor="text-yellow-800"
            />
            <StatCard
              title="Total Payouts"
              value={stats.totalPayouts}
              icon={<Banknote className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-purple-100"
              textColor="text-purple-800"
            />
            <StatCard
              title="Pending Payouts"
              value={stats.pendingPayouts}
              icon={<Clock className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-orange-100"
              textColor="text-orange-800"
            />
            <StatCard
              title="Total Revenue"
              value={formatAmount(stats.totalRevenue)}
              icon={<ChevronsRight className="h-6 w-6" />}
              loading={loading}
              bgColor="bg-green-100"
              textColor="text-green-800"
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-200 p-1 w-fit">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'Users' },
                { id: 'wishlists', label: 'Wishlists' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'payouts', label: 'Payouts' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>New user registered</span>
                    </div>
                    <span className="text-sm text-gray-500">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Gift className="h-5 w-5 text-green-600" />
                      <span>New wishlist created</span>
                    </div>
                    <span className="text-sm text-gray-500">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                      <span>New transaction completed</span>
                    </div>
                    <span className="text-sm text-gray-500">10 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Users</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>@{user.username || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'wishlists' && (
            <div className="bg-white shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Wishlists</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wishlists.map((wishlist) => (
                      <TableRow key={wishlist.id}>
                        <TableCell>{wishlist.title}</TableCell>
                        <TableCell>@{wishlist.user?.username || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs ${
                            wishlist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {wishlist.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(wishlist.created_at)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{formatAmount(transaction.amount)}</TableCell>
                        <TableCell>{transaction.description || 'N/A'}</TableCell>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800">
                            Success
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="bg-white shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Payouts</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{formatAmount(payout.amount)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs ${
                            payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payout.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                            payout.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payout.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(payout.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {payout.status === 'requested' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePayoutStatusUpdate(payout.id, 'processing')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {payout.status === 'processing' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePayoutStatusUpdate(payout.id, 'paid')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default AdminDashboardPage;
