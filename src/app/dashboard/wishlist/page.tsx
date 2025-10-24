"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Gift, Edit, MoreHorizontal, Trash2, Share2, Move, Sparkles, Copy, Eye, ArrowRight, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import OccasionBar from '@/components/dashboard/OccasionBar';
import CashGoalCard from '@/components/dashboard/CashGoalCard';
import WishlistCard from '@/components/dashboard/WishlistCard';
import AddCard from '@/components/dashboard/AddCard';
import SideDrawer from '@/components/dashboard/SideDrawer';
import ShareModal from '@/components/dashboard/ShareModal';
import Confetti from '@/components/ui/Confetti';
import { useConfetti } from '@/contexts/ConfettiContext';
import EditWishlistModal from '@/components/dashboard/EditWishlistModal';
import DeleteConfirmationModal from '@/components/dashboard/DeleteConfirmationModal';
import AddItemsModal from '@/components/dashboard/AddItemsModal';
import AddCashGoalModal from '@/components/dashboard/AddCashGoalModal';
import EditCashGoalModal from '@/components/dashboard/EditCashGoalModal';
import EditWishlistItemModal from '@/components/dashboard/EditWishlistItemModal';
import AddWishlistItemModal from '@/components/dashboard/AddWishlistItemModal';
import AddOccasionModal from '@/components/dashboard/AddOccasionModal';
import WishlistStats from '@/components/dashboard/WishlistStats';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { wishlistService, goalsService, itemsService } from '@/lib/wishlistService';
import { getUserFriendlyError } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

const MyWishlistV2Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { wallet, transactions } = useWallet();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();
  
  // State management
  const [wishlists, setWishlists] = useState([]);
  const [cashGoals, setCashGoals] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addItemsModalOpen, setAddItemsModalOpen] = useState(false);
  const [addCashGoalModalOpen, setAddCashGoalModalOpen] = useState(false);
  const [editCashGoalModalOpen, setEditCashGoalModalOpen] = useState(false);
  const [selectedCashGoal, setSelectedCashGoal] = useState(null);
  const [editWishlistItemModalOpen, setEditWishlistItemModalOpen] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);
  const [addWishlistItemModalOpen, setAddWishlistItemModalOpen] = useState(false);
  const [addOccasionModalOpen, setAddOccasionModalOpen] = useState(false);
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [moveItemModalOpen, setMoveItemModalOpen] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  // Bulk actions state
  
  // Wallet balance calculation
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [drawerData, setDrawerData] = useState({
    title: '',
    category: '',
    date: '',
    description: '',
    visibility: 'unlisted'
  });

  // Fetch real data from Supabase
  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [wishlistsData, goalsData, itemsData, occasionsData] = await Promise.all([
        wishlistService.fetchUserWishlists(user.id),
        goalsService.fetchUserGoals(user.id),
        itemsService.fetchUserWishlistItems(user.id),
        wishlistService.fetchUserOccasions(user.id)
      ]);
      
      setWishlists(wishlistsData);
      setCashGoals(goalsData);
      setWishlistItems(itemsData);
      setOccasions(occasionsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Unable to load your wishlists',
        description: JSON.stringify(error)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Check if all items are fully paid for and trigger confetti
  useEffect(() => {
    if (!loading && wishlistItems.length > 0) {
      // Check if all items are fully paid for
      const allItemsFullyPaid = wishlistItems.every(item => {
        // Calculate total amount needed for this item
        const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
        
        // If no price estimate, consider it as not paid for
        if (!item.unit_price_estimate || totalAmountNeeded === 0) {
          return false;
        }
        
        // Calculate total amount paid across all claims for this item
        const totalAmountPaid = (item.claims || []).reduce((sum, claim) => {
          return sum + (claim.amount_paid || 0);
        }, 0);
        
        // Item is fully paid for if total amount paid >= total amount needed
        return totalAmountPaid >= totalAmountNeeded;
      });
      
      // Trigger confetti if all items are fully paid for
      if (allItemsFullyPaid) {
        triggerConfetti(10000); // 10 seconds of confetti
      }
    }
  }, [loading, wishlistItems, triggerConfetti]);

  // Fetch payouts to calculate correct wallet balance
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

    fetchPayouts();
  }, [wallet?.id]);

  // Calculate correct wallet balance (same logic as WalletPage)
  const correctWalletBalance = React.useMemo(() => {
    const allTransactions = transactions || [];
    // Calculate total withdrawn from payouts table only
    const totalWithdrawn = (payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    // Balance calculation: credits only, minus payouts
    // Do NOT subtract sent contributions; they are paid from bank, not wallet
    const balance = allTransactions.reduce((acc, t) => {
      if (t.type === 'credit') return acc + Number(t.amount || 0);
      // Do not subtract sent contributions; they are paid from bank, not wallet
      return acc;
    }, 0) - totalWithdrawn;
    
    return balance;
  }, [transactions, payouts]);

  // Filter and sort wishlists
  const filteredWishlists = React.useMemo(() => {
    let filtered = wishlists;

    // Filter by occasion title
    if (selectedOccasion) {
      filtered = filtered.filter(wishlist => wishlist.title === selectedOccasion);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(wishlist => wishlist.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(wishlist => 
        wishlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (wishlist.story && wishlist.story.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [wishlists, selectedOccasion, statusFilter, searchQuery, sortBy, sortOrder]);
    
  const filteredCashGoals = selectedOccasion 
    ? cashGoals.filter(g => g.wishlist_title === selectedOccasion)
    : cashGoals;

  const filteredWishlistItems = selectedOccasion 
    ? wishlistItems.filter(item => item.wishlist_title === selectedOccasion)
    : wishlistItems;

  // Event handlers
  const handleGetStarted = () => {
    router.push('/get-started');
  };

  const handleCreateWishlist = () => {
    router.push('/get-started');
  };

  const handleOccasionSelect = (occasion) => {
    setSelectedOccasion(occasion);
  };

  const handleOccasionCreate = () => {
    setAddOccasionModalOpen(true);
  };

  const handleSaveOccasion = async (formData) => {
    try {
      // Create a new wishlist with the occasion title
      await wishlistService.createWishlist(user.id, {
        title: formData.title,
        occasion: formData.category || 'other',
        story: formData.description,
        visibility: formData.visibility || 'unlisted',
        cover_image_url: formData.coverImage || null
      });
      
      await fetchDashboardData(); // Refresh data
      setAddOccasionModalOpen(false);
    } catch (error) {
      console.error('Error creating occasion:', error);
      toast({ variant: 'destructive', title: 'Unable to create occasion', description: JSON.stringify(error) });
    }
  };

  const handleOccasionRename = async (prev, newVal) => {
    try {
      // Update all wishlists with the old title to have the new title
      const wishlistsToUpdate = wishlists.filter(w => w.title === prev);
      await Promise.all(
        wishlistsToUpdate.map(wishlist => 
          wishlistService.updateWishlist(wishlist.id, { title: newVal })
        )
      );
      
      // Update local state
    setOccasions(occasions.map(o => o === prev ? newVal : o));
      setWishlists(wishlists.map(w => w.title === prev ? { ...w, title: newVal } : w));
      
      // Update selected occasion if it was renamed
      if (selectedOccasion === prev) {
        setSelectedOccasion(newVal);
      }
      
    } catch (error) {
      console.error('Error renaming occasion:', error);
      toast({ variant: 'destructive', title: 'Unable to rename occasion', description: JSON.stringify(error) });
    }
  };

  const handleOccasionDelete = async (occasion) => {
    try {
      // Delete all wishlists with this title
      const wishlistsToDelete = wishlists.filter(w => w.title === occasion);
      await Promise.all(
        wishlistsToDelete.map(wishlist => wishlistService.deleteWishlist(wishlist.id))
      );
      
      // Update local state
    setOccasions(occasions.filter(o => o !== occasion));
      setWishlists(wishlists.filter(w => w.title !== occasion));
      setCashGoals(cashGoals.filter(g => {
        const wishlist = wishlists.find(w => w.id === g.wishlist_id);
        return wishlist?.title !== occasion;
      }));
      
    if (selectedOccasion === occasion) {
      setSelectedOccasion(null);
      }
      
    } catch (error) {
      console.error('Error deleting occasion:', error);
      toast({ variant: 'destructive', title: 'Unable to delete occasion', description: JSON.stringify(error) });
    }
  };

  const handleDrawerSave = async () => {
    if (drawerData.title) {
      try {
        // Create a new wishlist with the occasion title
        await wishlistService.createWishlist(user.id, {
          title: drawerData.title,
          occasion: drawerData.category || 'other',
          story: drawerData.description,
          visibility: drawerData.visibility || 'unlisted'
        });
        
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error creating occasion:', error);
        toast({ variant: 'destructive', title: 'Unable to create occasion', description: JSON.stringify(error) });
      }
    }
    setDrawerOpen(false);
  };

  const handleAddCashGoal = () => {
    setAddCashGoalModalOpen(true);
  };

  const handleAddWishlist = () => {
    setAddOccasionModalOpen(true);
  };

  const handleShareWishlist = (wishlist) => {
    setSelectedWishlist(wishlist);
    setShareModalOpen(true);
  };

  const handleViewWishlist = (wishlist) => {
    const username = user?.user_metadata?.username;
    if (username) {
      window.open(`/${username}/${wishlist.slug}`, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Unable to view wishlist',
        description: 'Your username could not be found. Please try refreshing the page.'
      });
    }
  };

  const handleEditWishlist = (wishlist) => {
    setSelectedWishlist(wishlist);
    setEditModalOpen(true);
  };

  const handleDeleteWishlist = (wishlist) => {
    setSelectedWishlist(wishlist);
    setDeleteModalOpen(true);
  };

  const handleAddItemsToWishlist = (wishlist) => {
    setSelectedWishlist(wishlist);
    setAddItemsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedWishlist) return;
    
    try {
      await wishlistService.deleteWishlist(selectedWishlist.id);
      await fetchDashboardData();
      setDeleteModalOpen(false);
      setSelectedWishlist(null);
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      toast({ variant: 'destructive', title: 'Unable to delete wishlist', description: JSON.stringify(error) });
    }
  };

  const handleUpdateWishlist = async (updates) => {
    if (!selectedWishlist) return;
    
    try {
      await wishlistService.updateWishlist(selectedWishlist.id, updates);
      await fetchDashboardData();
      setEditModalOpen(false);
      setSelectedWishlist(null);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({ variant: 'destructive', title: 'Unable to update wishlist', description: JSON.stringify(error) });
    }
  };

  const handleAddItems = async (items) => {
    if (!selectedWishlist) return;
    
    try {
      await wishlistService.addItemsToWishlist(selectedWishlist.id, items);
      await fetchDashboardData();
      setAddItemsModalOpen(false);
      setSelectedWishlist(null);
    } catch (error) {
      console.error('Error adding items:', error);
      toast({ variant: 'destructive', title: 'Unable to add items', description: JSON.stringify(error) });
    }
  };

  const handleSaveCashGoal = async (goalData) => {
    try {
      await goalsService.createGoal(goalData);
      await fetchDashboardData();
    } catch (error) {
      console.error('Error creating cash goal:', error);
      toast({ variant: 'destructive', title: 'Unable to create cash goal', description: JSON.stringify(error) });
    }
  };

  const handleEditCashGoal = (goal) => {
    setSelectedCashGoal(goal);
    setEditCashGoalModalOpen(true);
  };

  const handleUpdateCashGoal = async (goalId, updates) => {
    try {
      await goalsService.updateGoal(goalId, updates);
      await fetchDashboardData();
      setEditCashGoalModalOpen(false);
      setSelectedCashGoal(null);
    } catch (error) {
      console.error('Error updating cash goal:', error);
      toast({ variant: 'destructive', title: 'Unable to update cash goal', description: JSON.stringify(error) });
    }
  };

  const handleEditWishlistItem = (item) => {
    setSelectedWishlistItem(item);
    setEditWishlistItemModalOpen(true);
  };

  const handleUpdateWishlistItem = async (itemId, updates) => {
    try {
      await itemsService.updateItem(itemId, updates);
      await fetchDashboardData();
      setEditWishlistItemModalOpen(false);
      setSelectedWishlistItem(null);
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      toast({ variant: 'destructive', title: 'Unable to update item', description: JSON.stringify(error) });
    }
  };

  const handleAddWishlistItem = () => {
    setAddWishlistItemModalOpen(true);
  };

  const handleSaveWishlistItem = async (payload) => {
    try {
      await itemsService.createItem(payload);
      await fetchDashboardData();
      setAddWishlistItemModalOpen(false);
    } catch (error) {
      console.error('Error creating wishlist item:', error);
      toast({ variant: 'destructive', title: 'Unable to create item', description: JSON.stringify(error) });
    }
  };

  const handleDeleteWishlistItem = (item) => {
    setSelectedWishlistItem(item);
    setDeleteItemModalOpen(true);
  };

  const handleConfirmDeleteItem = async () => {
    if (!selectedWishlistItem) return;
    
    try {
      await itemsService.deleteItem(selectedWishlistItem.id);
      await fetchDashboardData();
      setDeleteItemModalOpen(false);
      setSelectedWishlistItem(null);
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast({ variant: 'destructive', title: 'Unable to delete item', description: JSON.stringify(error) });
    }
  };

  const handleShareWishlistItem = (item) => {
    // Find the parent wishlist to share its link
    const parentWishlist = wishlists.find(w => w.id === item.wishlist_id);
    if (parentWishlist) {
      setSelectedWishlist(parentWishlist);
      setShareModalOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Unable to share item',
        description: 'The wishlist for this item could not be found.'
      });
    }
  };

  const handleViewWishlistItem = (item) => {
    const username = user?.user_metadata?.username;
    
    if (item.wishlist_slug && username) {
      window.open(`/${username}/${item.wishlist_slug}`, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Unable to view item',
        description: !item.wishlist_slug ? 'The wishlist for this item could not be found.' : 'Your username could not be found. Please try refreshing the page.'
      });
    }
  };

  const handleMoveWishlistItem = (item) => {
    setSelectedWishlistItem(item);
    setMoveItemModalOpen(true);
  };

  const handleSaveMoveItem = async (targetWishlistId) => {
    if (!selectedWishlistItem || !targetWishlistId) return;
    
    try {
      await itemsService.updateItem(selectedWishlistItem.id, { wishlist_id: targetWishlistId });
      await fetchDashboardData();
      setMoveItemModalOpen(false);
      setSelectedWishlistItem(null);
    } catch (error) {
      console.error('Error moving wishlist item:', error);
      toast({ variant: 'destructive', title: 'Unable to move item', description: JSON.stringify(error) });
    }
  };


  const handleViewCashGoal = (goal) => {
    const username = user?.user_metadata?.username;
    if (username && goal.wishlist_slug) {
      window.open(`/${username}/${goal.wishlist_slug}`, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Unable to view cash goal',
        description: 'The cash goal page could not be found.'
      });
    }
  };

  const handleShareCashGoal = (goal) => {
    // Find the parent wishlist to share its link
    const parentWishlist = wishlists.find(w => w.id === goal.wishlist_id);
    if (parentWishlist) {
      setSelectedWishlist(parentWishlist);
      setShareModalOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Unable to share cash goal',
        description: 'The wishlist for this cash goal could not be found.'
      });
    }
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-16 px-8 border-2 border-dashed border-gray-300">
      <Gift className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-xl font-semibold">No wishlists yet!</h3>
      <p className="mt-2 text-sm text-gray-500">
        Click 'Get Started' to create your first wishlist — it's fun and takes 2 minutes.
      </p>
      <Button 
        onClick={handleGetStarted}
        variant="custom" 
        className="bg-brand-orange text-black mt-4"
      >
        Get Started
      </Button>
    </div>
  );

  // Page content for wishlists section
  const currentPage = {
    title: 'Wishlists',
    description: 'Organize occasions, add wishlist items or cash goals, and share with your Spenders.',
    showButton: true
  };

  return (
    <AuthGuard>
    <div>
      {/* Main content container */}
      <div className="px-4 pt-32 pb-28 sm:pb-36">
        <div className="max-w-7xl mx-auto">
        {/* Page Title and Description */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-brand-purple-dark mb-2">{currentPage.title}</h1>
            <p className="text-gray-600">
              {currentPage.description}
            </p>
          </div>
          {currentPage.showButton && (
            <div className="flex gap-4 lg:flex-shrink-0">
              {!occasions.length ? (
                <Button onClick={handleGetStarted} variant="custom" className="bg-brand-orange text-black w-full lg:w-auto">
                  <span>Get Started</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleCreateWishlist} variant="custom" className="bg-brand-orange text-black w-full lg:w-auto">
                  <span>Create Wishlist</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>



        {/* Wishlists Content */}
        <div className="mt-6">
          {(
            <div>
              {loading ? (
                renderLoadingState()
              ) : (
                <div className="space-y-12">
                  {/* Wishlist Statistics */}
                  <WishlistStats 
                    wishlistItems={filteredWishlistItems} 
                    cashGoals={filteredCashGoals}
                    walletBalance={correctWalletBalance}
                  />


                  {/* Occasion Bar */}
                  <div>
                    <h2 className="text-[30px] font-semibold text-brand-purple-dark mb-4">Occasion Titles</h2>
                    <OccasionBar
                      occasions={occasions}
                      active={selectedOccasion}
                      onSelect={handleOccasionSelect}
                      onCreate={handleOccasionCreate}
                      onRename={handleOccasionRename}
                      onDelete={handleOccasionDelete}
                    />
                  </div>

                  {/* Cash Goals Section */}
                  <div>
                    <h2 className="text-[30px] font-semibold text-brand-purple-dark mb-4">Cash Goals</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {filteredCashGoals.map((goal) => (
                        <CashGoalCard
                          key={goal.id}
                          goal={goal}
                          onEdit={() => handleEditCashGoal(goal)}
                          onView={() => handleViewCashGoal(goal)}
                          onShare={() => handleShareCashGoal(goal)}
                        />
                      ))}
                      <AddCard 
                        label="Add New Cash Goal"
                        onClick={handleAddCashGoal}
                      />
                    </div>
                  </div>

                  {/* Wishlist Items Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-[30px] font-semibold text-brand-purple-dark">Wishlist Items</h2>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={viewMode === 'grid' ? 'custom' : 'outline'} 
                          className={`h-9 w-9 p-0 ${viewMode === 'grid' ? 'bg-brand-purple-dark text-white' : ''}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            <path d="M3 12h18"></path>
                            <path d="M12 3v18"></path>
                          </svg>
                        </Button>
                        <Button 
                          variant={viewMode === 'list' ? 'custom' : 'outline'} 
                          className={`h-9 w-9 p-0 ${viewMode === 'list' ? 'bg-brand-purple-dark text-white' : ''}`}
                          onClick={() => setViewMode('list')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <line x1="8" x2="21" y1="6" y2="6"></line>
                            <line x1="8" x2="21" y1="12" y2="12"></line>
                            <line x1="8" x2="21" y1="18" y2="18"></line>
                            <line x1="3" x2="3.01" y1="6" y2="6"></line>
                            <line x1="3" x2="3.01" y1="12" y2="12"></line>
                            <line x1="3" x2="3.01" y1="18" y2="18"></line>
                          </svg>
                        </Button>
                      </div>
                    </div>
                    
                    {filteredWishlistItems.length === 0 ? (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                        <AddCard 
                          label="Add New Wishlist Item"
                          onClick={handleAddWishlistItem}
                          viewMode={viewMode}
                        />
                      </div>
                    ) : (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                        {filteredWishlistItems.map((item) => {
                          const isFullyClaimed = (item.qty_claimed || 0) >= (item.qty_total || 1);
                          const getSpenderInfo = () => {
                            if (!isFullyClaimed || !item.claims || item.claims.length === 0) return null;
                            const confirmedClaims = item.claims.filter(claim => 
                              claim.status === 'confirmed' && claim.supporter_user?.username
                            );
                            if (confirmedClaims.length > 0) {
                              confirmedClaims.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                              return confirmedClaims[0].supporter_user.username;
                            }
                            return null;
                          };
                          const getPaidSpenderInfo = () => {
                            if (!isFullyClaimed || !item.claims || item.claims.length === 0) return null;
                            const paidClaims = item.claims.filter(claim => 
                              claim.status === 'confirmed' && claim.supporter_user?.username && claim.amount_paid > 0
                            );
                            if (paidClaims.length > 0) {
                              paidClaims.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                              return paidClaims[0].supporter_user.username;
                            }
                            return null;
                          };
                          const spenderUsername = getSpenderInfo();
                          const paidSpenderUsername = getPaidSpenderInfo();

                          return (
                            <div key={item.id} className={`group relative bg-white transition-all duration-300 overflow-hidden ${
                              viewMode === 'grid' 
                                ? 'flex flex-col h-full border-2 border-black' 
                                : 'flex flex-row h-32'
                            }`}>
                              {/* Image Container */}
                              <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${
                                viewMode === 'grid' 
                                  ? 'h-48' 
                                  : 'w-32 h-32 flex-shrink-0'
                              }`}>
                                {item.image_url ? (
                                  <img 
                                    alt={item.name} 
                                    src={item.image_url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Gift className="w-16 h-16" />
                                  </div>
                                )}
                                
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* 3-Dot Menu - Top Right */}
                                <div className="absolute top-3 right-3">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 bg-brand-purple-dark hover:bg-brand-purple-dark/90"
                                      >
                                        <MoreHorizontal className="h-4 w-4 text-white" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleViewWishlistItem(item)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleEditWishlistItem(item)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteWishlistItem(item)} className="text-brand-accent-red">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleShareWishlistItem(item)}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleMoveWishlistItem(item)}>
                                        <Move className="w-4 h-4 mr-2" />
                                        Move
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {/* Content */}
                              <div className={`flex flex-col gap-2 ${
                                viewMode === 'grid' 
                                  ? 'p-4 flex-1' 
                                  : 'p-3 flex-1 w-0'
                              }`}>
                                {/* Title */}
                                <h3 className={`font-bold text-gray-900 leading-6 line-clamp-1 ${
                                  viewMode === 'grid' 
                                    ? 'text-lg' 
                                    : 'text-base'
                                }`}>
                                  {item.name}
                                </h3>
                                
                                {/* Wishlist Source - Hidden in list view */}
                                <div className={`items-center ${
                                  viewMode === 'grid' 
                                    ? 'flex' 
                                    : 'hidden'
                                }`}>
                                  <div className="w-2 h-2 bg-brand-purple-dark mr-2"></div>
                                  <p className="text-xs text-gray-500 font-medium">
                                    {item.wishlist_title}
                                  </p>
                                </div>
                                
                                {/* Bottom-anchored amount + status */}
                                <div className={`space-y-2 ${
                                  viewMode === 'grid' 
                                    ? 'mt-auto' 
                                    : 'mt-2'
                                }`}>
                                  {item.unit_price_estimate && (
                                    <div>
                                      {(() => {
                                        // Calculate total amount paid across all claims for this item
                                        const totalAmountPaid = (item.claims || []).reduce((sum, claim) => {
                                          return sum + (claim.amount_paid || 0);
                                        }, 0);
                                        
                                        // Show paid amount if there are any payments, otherwise show desired amount
                                        const displayAmount = totalAmountPaid > 0 ? totalAmountPaid : (item.unit_price_estimate * (item.qty_total || 1));
                                        const isPaid = totalAmountPaid > 0;
                                        
                                        return (
                                          <span className={`font-semibold text-gray-900 ${
                                            viewMode === 'grid' 
                                              ? 'text-lg' 
                                              : 'text-sm'
                                          } ${isPaid ? 'text-green-600' : 'text-gray-600'}`}>
                                            ₦{displayAmount.toLocaleString()}
                                            {(item.qty_total || 1) > 1 && ` (${item.qty_total})`}
                                            {isPaid && <span className="text-sm font-normal ml-1">paid</span>}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  )}
                                  <div className={`bg-brand-green text-black font-medium border-2 border-black text-center ${
                                    viewMode === 'grid' 
                                      ? 'w-full text-sm py-2 px-3' 
                                      : 'text-xs py-2 h-auto'
                                  }`}>
                                    {isFullyClaimed ? (
                                      paidSpenderUsername ? (
                                        <><strong>@{paidSpenderUsername}</strong> Paid For This!</>
                                      ) : spenderUsername ? (
                                        <><strong>@{spenderUsername}</strong> Claimed This!</>
                                      ) : (
                                        'Fully Claimed'
                                      )
                                    ) : (
                                      `Available (${(item.qty_total || 1) - (item.qty_claimed || 0)} left)`
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <AddCard 
                          label="Add New Wishlist Item"
                          onClick={handleAddWishlistItem}
                          viewMode={viewMode}
                        />
                      </div>
                    )}
                  </div>

                  {/* Occasions Section (moved to fourth position) */}
                  <div>
                    <h2 className="text-[30px] font-semibold text-brand-purple-dark mb-4">Occasions</h2>
                    {filteredWishlists.length === 0 && occasions.length === 0 ? (
                      renderEmptyState()
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {filteredWishlists.map((wishlist) => (
                                  <WishlistCard
                                    key={wishlist.id}
                                    wishlist={wishlist}
                                    onEdit={() => handleEditWishlist(wishlist)}
                                    onView={() => handleViewWishlist(wishlist)}
                                    onShare={() => handleShareWishlist(wishlist)}
                                    onAddItems={() => handleAddItemsToWishlist(wishlist)}
                                    onDelete={() => handleDeleteWishlist(wishlist)}
                                  />
                        ))}
                        <AddCard 
                          label="Add New Wishlist"
                          onClick={handleAddWishlist}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            )}

          </div>

        </div>

        {/* Modals */}
        <SideDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Create New Occasion"
          onSave={handleDrawerSave}
          onCancel={() => setDrawerOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Occasion Title</Label>
              <Input
                id="title"
                value={drawerData.title}
                onChange={(e) => setDrawerData({...drawerData, title: e.target.value})}
                placeholder="e.g. Graduation, Anniversary"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={drawerData.category} onValueChange={(value) => setDrawerData({...drawerData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celebration">Celebration</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={drawerData.date}
                onChange={(e) => setDrawerData({...drawerData, date: e.target.value})}
                className="cursor-pointer"
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={drawerData.description}
                onChange={(e) => setDrawerData({...drawerData, description: e.target.value})}
                placeholder="Tell us about this occasion..."
              />
            </div>
          </div>
        </SideDrawer>

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          wishlist={selectedWishlist}
        />

        <EditWishlistModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          wishlist={selectedWishlist}
          onSave={handleUpdateWishlist}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemType="wishlist"
          itemName={selectedWishlist?.title}
        />

        <AddItemsModal
          isOpen={addItemsModalOpen}
          onClose={() => setAddItemsModalOpen(false)}
          wishlist={selectedWishlist}
          onSave={handleAddItems}
        />

        <AddCashGoalModal
          isOpen={addCashGoalModalOpen}
          onClose={() => setAddCashGoalModalOpen(false)}
          wishlists={wishlists}
          onSave={handleSaveCashGoal}
        />

        <EditCashGoalModal
          isOpen={editCashGoalModalOpen}
          onClose={() => setEditCashGoalModalOpen(false)}
          goal={selectedCashGoal}
          wishlists={wishlists}
          onSave={handleUpdateCashGoal}
        />

        <EditWishlistItemModal
          isOpen={editWishlistItemModalOpen}
          onClose={() => setEditWishlistItemModalOpen(false)}
          item={selectedWishlistItem}
          wishlists={wishlists}
          onSave={handleUpdateWishlistItem}
        />

        <AddWishlistItemModal
          isOpen={addWishlistItemModalOpen}
          onClose={() => setAddWishlistItemModalOpen(false)}
          wishlists={wishlists}
          defaultWishlistId={selectedWishlist?.id}
          onSave={handleSaveWishlistItem}
        />

        <AddOccasionModal
          isOpen={addOccasionModalOpen}
          onClose={() => setAddOccasionModalOpen(false)}
          onSave={handleSaveOccasion}
        />

        {/* Wishlist Item Modals */}
        <DeleteConfirmationModal
          isOpen={deleteItemModalOpen}
          onClose={() => setDeleteItemModalOpen(false)}
          onConfirm={handleConfirmDeleteItem}
          itemType="item"
          itemName={selectedWishlistItem?.name}
        />

        {/* Move Item Modal */}
        <Dialog open={moveItemModalOpen} onOpenChange={setMoveItemModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 pr-8">
                <Move className="w-5 h-5" />
                Move Item
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Move "{selectedWishlistItem?.name}" to another wishlist
              </p>
              <div className="space-y-2">
                <Label>Select Destination Wishlist</Label>
                <Select onValueChange={(value) => handleSaveMoveItem(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a wishlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {wishlists
                      .filter(w => w.id !== selectedWishlistItem?.wishlist_id)
                      .map(wishlist => (
                        <SelectItem key={wishlist.id} value={wishlist.id}>
                          {wishlist.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confetti Animation */}
        <Confetti trigger={showConfetti} />
      </div>
    </div>
    </AuthGuard>
  );
};

export default MyWishlistV2Page;
