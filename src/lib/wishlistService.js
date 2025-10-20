import { supabase } from './customSupabaseClient';
import slugify from 'slugify';

// Wishlist CRUD operations
export const wishlistService = {
  // Fetch all wishlists for a user with items count and goals
  async fetchUserWishlists(userId) {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        wishlist_items(id),
        goals(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Transform data to include computed fields
    const wishlistsWithProgress = await Promise.all(
      data.map(async (wishlist) => {
        // Get all item IDs for this wishlist
        const itemIds = wishlist.wishlist_items?.map(item => item.id) || [];
        
        // Calculate fulfilled items count by checking claims with amount_paid > 0
        let items_fulfilled_count = 0;
        if (itemIds.length > 0) {
          const { data: fulfilledItems, error: claimsError } = await supabase
            .from('claims')
            .select('wishlist_item_id, amount_paid, wishlist_items!inner(unit_price_estimate, qty_total)')
            .in('wishlist_item_id', itemIds);

          if (claimsError) {
            console.error('Error fetching claims:', claimsError);
          } else {
            // Count items that are fully paid for
            const fulfilledItemIds = new Set();
            
            fulfilledItems?.forEach(claim => {
              const item = claim.wishlist_items;
              if (item && item.unit_price_estimate && item.qty_total) {
                const totalAmountNeeded = item.unit_price_estimate * item.qty_total;
                const amountPaid = claim.amount_paid || 0;
                
                // Item is fulfilled if amount paid >= total amount needed
                if (amountPaid >= totalAmountNeeded) {
                  fulfilledItemIds.add(claim.wishlist_item_id);
                }
              }
            });
            
            items_fulfilled_count = fulfilledItemIds.size;
          }
        }

        const result = {
          ...wishlist,
          items_count: wishlist.wishlist_items?.length || 0,
          items_fulfilled_count,
          amount_raised: wishlist.goals?.reduce((sum, goal) => sum + (goal.amount_raised || 0), 0) || 0,
          status: this.getWishlistStatus(wishlist)
        };
        
        // Debug logging for progress calculation
        console.log(`📊 Progress calculation for wishlist "${wishlist.title}":`, {
          items_count: result.items_count,
          items_fulfilled_count: result.items_fulfilled_count,
          progress_percentage: result.items_count > 0 ? Math.round((result.items_fulfilled_count / result.items_count) * 100) : 0
        });
        
        return result;
      })
    );

    return wishlistsWithProgress;
  },

  // Fetch occasion titles from user's wishlists
  async fetchUserOccasions(userId) {
    const { data, error } = await supabase
      .from('wishlists')
      .select('title')
      .eq('user_id', userId)
      .not('title', 'is', null);

    if (error) throw error;

    return [...new Set(data.map(w => w.title))];
  },

  // Create a new wishlist
  async createWishlist(userId, wishlistData, items = [], goals = []) {
    const { title, occasion, wishlist_date, story, cover_image_url, visibility } = wishlistData;
    
    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slug = await this.generateUniqueSlug(baseSlug);

    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userId,
        title,
        occasion,
        wishlist_date,
        story,
        cover_image_url,
        visibility: visibility || 'unlisted',
        slug
      })
      .select()
      .single();

    if (wishlistError) throw wishlistError;

    // Create items if provided
    if (items.length > 0) {
      const itemsData = items.map(item => ({
        wishlist_id: wishlist.id,
        name: item.name,
        description: item.description,
        unit_price_estimate: item.price,
        qty_total: item.quantity || 1,
        qty_claimed: 0,
        product_url: item.url,
        image_url: item.image,
        allow_group_gift: item.allowGroupGift || false
      }));

      const { error: itemsError } = await supabase
        .from('wishlist_items')
        .insert(itemsData);

      if (itemsError) throw itemsError;
    }

    // Create goals if provided
    if (goals.length > 0) {
      const goalsData = goals.map(goal => ({
        wishlist_id: wishlist.id,
        title: goal.title,
        target_amount: goal.targetAmount,
        amount_raised: 0,
        deadline: goal.deadline
      }));

      const { error: goalsError } = await supabase
        .from('goals')
        .insert(goalsData);

      if (goalsError) throw goalsError;
    }

    return wishlist;
  },

  // Update wishlist
  async updateWishlist(id, updates) {
    const { data, error } = await supabase
      .from('wishlists')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete wishlist
  async deleteWishlist(id) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Generate unique slug
  async generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - slug is unique
        return slug;
      }

      if (error) throw error;

      // Slug exists, try with counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  },

  // Get wishlist status based on data
  getWishlistStatus(wishlist) {
    if (!wishlist.wishlist_date) return 'live';
    
    const now = new Date();
    const wishlistDate = new Date(wishlist.wishlist_date);
    
    if (wishlistDate < now) return 'completed';
    return 'live';
  },

  // Add items to wishlist
  async addItemsToWishlist(wishlistId, items) {
    const itemsWithWishlistId = items.map(item => ({
      ...item,
      wishlist_id: wishlistId,
      unit_price_estimate: item.unit_price_estimate ? parseFloat(item.unit_price_estimate) : null,
      qty_total: item.qty_total || 1,
      qty_claimed: 0
    }));

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(itemsWithWishlistId)
      .select();

    if (error) throw error;
    return data;
  }
};

// Goals CRUD operations
export const goalsService = {
  // Fetch all goals for a user
  async fetchUserGoals(userId) {
    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        wishlist:wishlists!inner(
          id,
          user_id,
          title,
          occasion,
          visibility,
          slug
        )
      `)
      .eq('wishlist.user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(goal => ({
      ...goal,
      wishlist_id: goal.wishlist.id,
      wishlist_title: goal.wishlist.title,
      wishlist_occasion: goal.wishlist.occasion,
      wishlist_slug: goal.wishlist.slug,
      visibility: goal.wishlist.visibility
    }));
  },

  // Create a new goal
  async createGoal(goalData) {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        ...goalData,
        amount_raised: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update goal
  async updateGoal(id, updates) {
    const { data, error } = await supabase
      .from('goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete goal
  async deleteGoal(id) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Items CRUD operations
export const itemsService = {
  // Fetch all wishlist items for a user
  async fetchUserWishlistItems(userId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        wishlist:wishlists!inner(
          id,
          user_id,
          title,
          occasion,
          visibility,
          slug
        ),
        claims:claims(
          id,
          status,
          created_at,
          supporter_user_id,
          amount_paid,
          supporter_user:users!supporter_user_id(
            id,
            username,
            email
          )
        )
      `)
      .eq('wishlist.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      wishlist_id: item.wishlist.id,
      wishlist_title: item.wishlist.title,
      wishlist_occasion: item.wishlist.occasion,
      wishlist_slug: item.wishlist.slug,
      visibility: item.wishlist.visibility,
      claims: item.claims || []
    }));
  },

  // Create wishlist item
  async createItem(itemData) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        ...itemData,
        qty_claimed: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update item
  async updateItem(id, updates) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete item
  async deleteItem(id) {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update wishlist
  async updateWishlist(wishlistId, updates) {
    const { data, error } = await supabase
      .from('wishlists')
      .update(updates)
      .eq('id', wishlistId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete wishlist
  async deleteWishlist(wishlistId) {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', wishlistId);

    if (error) throw error;
  },

  // Add items to wishlist
  async addItemsToWishlist(wishlistId, items) {
    const itemsWithWishlistId = items.map(item => ({
      ...item,
      wishlist_id: wishlistId,
      unit_price_estimate: item.unit_price_estimate ? parseFloat(item.unit_price_estimate) : null,
      qty_total: item.qty_total || 1,
      qty_claimed: 0
    }));

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert(itemsWithWishlistId)
      .select();

    if (error) throw error;
    return data;
  }
};

// Image upload service - PHP Upload Endpoint
// Works in both development (Vite plugin) and production (PHP script)
// Development: /upload.php handled by Vite plugin -> saves to public/HeySpenderMedia/General/
// Production: /upload.php handled by PHP script -> saves to HeySpenderMedia/General/
export const imageService = {
  async uploadCoverImage(file, userId) {
    try {
      console.log('Uploading cover image via /upload.php...');
      const url = await this.uploadImage(file);
      return url;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw error;
    }
  },

  async uploadItemImage(file, userId) {
    try {
      console.log('Uploading item image via /upload.php...');
      const url = await this.uploadImage(file);
      return url;
    } catch (error) {
      console.error('Error uploading item image:', error);
      throw error;
    }
  },

  async uploadImage(file) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to /upload.php
      const response = await fetch('/upload.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result.url);
      return result.url;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  async deleteImage(imageUrl) {
    try {
      // In a static site, we can't delete files from the server
      // This would require a backend API endpoint
      console.log('Note: File deletion not implemented for static hosting');
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  async deleteMultipleImages(imageUrls) {
    try {
      console.log('Note: File deletion not implemented for static hosting');
      return { success: imageUrls.length, failed: 0 };
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      return { success: 0, failed: imageUrls.length };
    }
  }
};
