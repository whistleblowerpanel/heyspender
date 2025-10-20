"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { claimsService } from '@/lib/claimsService';
import SpenderListCard from '@/components/dashboard/SpenderListCard';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/AuthGuard';

const SpenderListPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchClaims = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await claimsService.fetchUserClaims(user.id);
        setClaims(data || []);
      } catch (error) {
        console.error('Error fetching claims:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading claims',
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user?.id, toast]);

  const handleClaimStatusUpdate = async (claimId, newStatus) => {
    try {
      await claimsService.updateClaimStatus(claimId, newStatus);
      
      // Refresh claims
      const data = await claimsService.fetchUserClaims(user.id);
      setClaims(data || []);
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
        description: error.message
      });
    }
  };

  const handleClaimUpdate = async (claimId, updates) => {
    try {
      console.log('🔄 [SpenderListPage] Starting claim update:', { claimId, updates });
      
      // If updates is empty, just refresh the data without updating
      if (!updates || Object.keys(updates).length === 0) {
        console.log('🔄 [SpenderListPage] Empty updates, refreshing data only');
        const data = await claimsService.fetchUserClaims(user.id);
        setClaims(data || []);
        return;
      }
      
      // Optimistic update - update local state immediately
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.id === claimId 
            ? { ...claim, ...updates }
            : claim
        )
      );
      
      // Update in database
      const updatedClaim = await claimsService.updateClaim(claimId, updates);
      console.log('✅ [SpenderListPage] Claim updated in database:', updatedClaim);
      
      // Update local state with the actual database response to ensure consistency
      setClaims(prevClaims => 
        prevClaims.map(claim => 
          claim.id === claimId 
            ? { ...claim, ...updatedClaim }
            : claim
        )
      );
      
    } catch (error) {
      console.error('🔴 [SpenderListPage] Error updating claim:', error);
      
      // Rollback optimistic update on error by refetching
      try {
        const data = await claimsService.fetchUserClaims(user.id);
        setClaims(data || []);
      } catch (refetchError) {
        console.error('🔴 [SpenderListPage] Error rolling back:', refetchError);
      }
      
      toast({
        variant: 'destructive',
        title: 'Failed to update claim',
        description: error.message
      });
    }
  };

  const handleClaimDelete = async (claimId, quantityToRemove = null) => {
    try {
      const result = await claimsService.deleteClaim(claimId, quantityToRemove);
      const quantity = result?.quantityRemoved || 1;
      const wasPartialRemoval = result?.wasPartialRemoval || false;
      
      // If partial removal, refetch claims to show updated amounts
      // If full removal, just filter out the claim
      if (wasPartialRemoval) {
        // Partial removal - refetch to show updated claim with new amount
        const data = await claimsService.fetchUserClaims(user.id);
        setClaims(data || []);
      } else {
        // Full removal - remove from list
        setClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
      }
      
      toast({ 
        title: 'Item removed from your list',
        description: `${quantity} item${quantity > 1 ? 's' : ''} returned to the wishlist`
      });
    } catch (error) {
      console.error('Error deleting claim:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to remove item',
        description: error.message
      });
    }
  };

  const handleViewClaimWishlist = (claim) => {
    if (claim.wishlist?.slug && claim.wishlist?.user?.username) {
      window.open(`/${claim.wishlist.user.username}/${claim.wishlist.slug}`, '_blank');
    }
  };


  return (
    <AuthGuard>
    <div>
      <div className="px-4 pt-32 pb-28 sm:pb-36">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-purple-dark mb-2">Spender List</h1>
          <p className="text-gray-600">
            Track and manage items you've claimed from other people's wishlists
          </p>
          
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold">No Claims Yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't claimed any items yet. Browse public wishlists to get started!
            </p>
            <Button 
              variant="custom" 
              className="bg-brand-orange text-black mt-4"
              onClick={() => router.push('/explore')}
            >
              Browse Public Wishlists
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {claims.map((claim) => (
              <SpenderListCard
                key={claim.id}
                claim={claim}
                onUpdateStatus={handleClaimStatusUpdate}
                onUpdateClaim={handleClaimUpdate}
                onDelete={handleClaimDelete}
                onViewWishlist={handleViewClaimWishlist}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default SpenderListPage;
