import { supabase } from './customSupabaseClient';

export const claimsService = {
  // Fetch user's claims with item and wishlist details
  async fetchUserClaims(userId) {
    console.log('🔍 [claimsService] Fetching claims for user:', userId);
    
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        wishlist_items!inner(
          *,
          wishlists!inner(
            id,
            title,
            slug,
            user_id,
            occasion,
            wishlist_date,
            cover_image_url,
            users!inner(
              id,
              username
            )
          )
        ),
        wallet_transactions(
          id,
          amount,
          type,
          source,
          created_at
        )
      `)
      .eq('supporter_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🔴 [claimsService] Error fetching claims:', error);
      throw error;
    }
    
    // Ensure amount_paid field exists with default value of 0
    const claims = (data || []).map(claim => ({
      ...claim,
      amount_paid: claim.amount_paid || 0
    }));
    
    // Claims fetched successfully
    
    return claims;
  },

  // Update claim status
  async updateClaimStatus(claimId, status) {
    
    // First, get the current claim to see its current status
    const { data: currentClaim, error: fetchError } = await supabase
      .from('claims')
      .select('id, status, supporter_user_id, wishlist_item_id')
      .eq('id', claimId)
      .single();
    
    if (fetchError) {
      console.error('🔴 Error fetching current claim:', fetchError);
      throw fetchError;
    }
    
    console.log('🔍 Current claim data:', currentClaim);
    
    // Validate the status value
    const validStatuses = ['pending', 'confirmed', 'expired', 'cancelled', 'fulfilled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(', ')}`);
    }
    
    const { data, error } = await supabase
      .from('claims')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', claimId)
      .select()
      .single();

    if (error) {
      console.error('🔴 Database error updating claim status:', error);
      console.error('🔴 Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('✅ Claim status updated successfully:', data);
    return data;
  },

  // Update claim details
  async updateClaim(claimId, updates) {
    console.log('🔧 [claimsService] Updating claim:', { claimId, updates });
    
    // Prepare update data with timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Only validate and set status if it's explicitly provided in updates
    if ('status' in updates && updates.status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'expired', 'cancelled', 'fulfilled'];
      if (!validStatuses.includes(updates.status)) {
        console.log('⚠️ [claimsService] Invalid status provided, removing from update:', updates.status);
        delete updateData.status; // Remove invalid status instead of defaulting
      }
    }
    
    console.log('🔧 [claimsService] Final update data:', updateData);
    
    const { data, error } = await supabase
      .from('claims')
      .update(updateData)
      .eq('id', claimId)
      .select()
      .single();

    if (error) {
      console.error('🔴 [claimsService] Error updating claim:', error);
      console.error('🔴 [claimsService] Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('✅ [claimsService] Claim updated successfully in database:', {
      claimId: data.id,
      status: data.status,
      amount_paid: data.amount_paid,
      updated_at: data.updated_at
    });
    
    return data;
  },

  // Delete a claim (fully or partially) and restore items to the wishlist
  async deleteClaim(claimId, quantityToRemove = null) {
    console.log('🗑️ [claimsService] Deleting claim:', claimId, 'Quantity to remove:', quantityToRemove);
    
    // First, get the claim details to know which item to update and calculate quantity
    const { data: claim, error: fetchError } = await supabase
      .from('claims')
      .select('id, wishlist_item_id, amount_paid, note, wishlist_items!inner(id, qty_claimed, qty_total, unit_price_estimate)')
      .eq('id', claimId)
      .single();

    if (fetchError) {
      console.error('🔴 [claimsService] Error fetching claim:', fetchError);
      throw fetchError;
    }

    if (!claim) {
      throw new Error('Claim not found');
    }

    console.log('📦 [claimsService] Claim data:', claim);

    // Calculate the quantity purchased
    const unitPrice = claim.wishlist_items.unit_price_estimate || 0;
    const amountPaid = claim.amount_paid || 0;
    
    let totalQuantityPurchased = 1; // default to 1 item
    
    // Try to extract quantity from note field first (for "Send Cash" claims)
    if (claim.note && claim.note.startsWith('Quantity:')) {
      const qtyMatch = claim.note.match(/Quantity:\s*(\d+)/);
      if (qtyMatch) {
        totalQuantityPurchased = parseInt(qtyMatch[1]);
      }
    }
    // For "I bought this already" claims, calculate from amount_paid
    else if (amountPaid > 0 && unitPrice > 0) {
      totalQuantityPurchased = Math.round(amountPaid / unitPrice);
    }
    
    // Determine how many items to remove (default to all)
    const quantityToActuallyRemove = quantityToRemove || totalQuantityPurchased;
    
    console.log('📊 [claimsService] Calculated quantities:', {
      amountPaid,
      unitPrice,
      totalQuantityPurchased,
      quantityToActuallyRemove
    });

    let wasPartialRemoval = false;

    // If removing all items, delete the claim entirely
    if (quantityToActuallyRemove >= totalQuantityPurchased) {
      const { error: deleteError } = await supabase
        .from('claims')
        .delete()
        .eq('id', claimId);

      if (deleteError) {
        console.error('🔴 [claimsService] Error deleting claim:', deleteError);
        throw deleteError;
      }

      console.log('✅ [claimsService] Claim deleted successfully');
    } else {
      // Partial removal - update the claim's amount_paid and note
      wasPartialRemoval = true;
      const newAmountPaid = amountPaid - (unitPrice * quantityToActuallyRemove);
      const remainingQuantity = totalQuantityPurchased - quantityToActuallyRemove;
      
      // Update note to reflect new quantity
      let newNote = claim.note || '';
      if (newNote.startsWith('Quantity:')) {
        // Update the quantity in the note
        const lines = newNote.split('\n');
        const userNotes = lines.slice(1).join('\n'); // Preserve user notes
        newNote = remainingQuantity > 1 
          ? `Quantity: ${remainingQuantity}${userNotes ? '\n' + userNotes : ''}`
          : userNotes; // Remove quantity note if only 1 item remaining
      }
      
      const { error: updateClaimError } = await supabase
        .from('claims')
        .update({ 
          amount_paid: newAmountPaid,
          note: newNote,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (updateClaimError) {
        console.error('🔴 [claimsService] Error updating claim amount:', updateClaimError);
        throw updateClaimError;
      }

      console.log(`✅ [claimsService] Claim updated (partial removal) - amount_paid: ${amountPaid} → ${newAmountPaid}, remaining qty: ${remainingQuantity}`);
    }

    // Decrement the qty_claimed by the quantity being removed
    const currentQtyClaimed = claim.wishlist_items.qty_claimed || 0;
    const newQtyClaimed = Math.max(0, currentQtyClaimed - quantityToActuallyRemove);

    const { error: updateError } = await supabase
      .from('wishlist_items')
      .update({ qty_claimed: newQtyClaimed })
      .eq('id', claim.wishlist_item_id);

    if (updateError) {
      console.error('🔴 [claimsService] Error updating wishlist item qty_claimed:', updateError);
      // Don't throw error here since the claim was already modified
      // Just log it for debugging
    } else {
      // Wishlist item quantity updated successfully
    }

    return { 
      quantityRemoved: quantityToActuallyRemove,
      wasPartialRemoval
    };
  },

  // Get claim statistics
  async getUserClaimStats(userId) {
    const { data, error } = await supabase
      .from('claims')
      .select('status, wishlist_items!inner(unit_price_estimate)')
      .eq('supporter_user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(c => c.status === 'pending').length,
      confirmed: data.filter(c => c.status === 'confirmed').length,
      fulfilled: data.filter(c => c.status === 'fulfilled').length,
      cancelled: data.filter(c => c.status === 'cancelled').length,
      totalValue: data.reduce((sum, c) => sum + (c.wishlist_items.unit_price_estimate || 0), 0)
    };

    return stats;
  }
};
