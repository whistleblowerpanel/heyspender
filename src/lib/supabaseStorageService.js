/**
 * Image Upload Service
 * Supports both legacy Data URL approach and new AVIF Supabase Storage approach
 * Toggle between approaches using NEXT_PUBLIC_USE_AVIF_STORAGE environment variable
 * 
 * FOLDERS:
 * - wishlist-covers: Cover images for wishlists
 * - wishlist-items: Item images for wishlist items
 * - item-images: Additional item images
 * - General: Fallback folder
 */

import { supabase } from './customSupabaseClient';

// 🔄 FEATURE FLAG: Toggle between Data URL (old) and AVIF Storage (new)
const USE_AVIF_STORAGE = process.env.NEXT_PUBLIC_USE_AVIF_STORAGE === 'true';

// Storage configuration
const STORAGE_BUCKET = 'HeySpender Media';

/**
 * Generate a unique filename with timestamp and random string
 * @param {File} file - The file to generate name for
 * @param {string} userId - User ID for organizing files
 * @param {string} folder - Subfolder (e.g., 'wishlist-covers', 'wishlist-items')
 * @returns {string} Unique filename with path
 */
function generateFileName(file, userId, folder = '') {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${userId}-${timestamp}-${randomStr}.${fileExt}`;
  
  return folder ? `${folder}/${fileName}` : fileName;
}

/**
 * 📦 OLD APPROACH: Upload as Data URL (Base64)
 * Used when NEXT_PUBLIC_USE_AVIF_STORAGE=false or not set
 * Safe fallback that always works
 */
async function uploadAsDataURL(file, userId) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${userId}-${timestamp}-${randomStr}.${fileExt}`;
      
      const dataUrl = reader.result;
      console.log(`✅ Upload successful (Data URL): ${fileName}`);
      resolve(dataUrl);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * ✨ NEW APPROACH: Upload with AVIF conversion to Supabase Storage
 * Used when NEXT_PUBLIC_USE_AVIF_STORAGE=true
 * Provides 60-80% size reduction and proper storage
 */
async function uploadWithAVIF(file, userId, folder) {
  try {
    // Create FormData for API call
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('folder', folder);

    // Call our AVIF conversion API
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    console.log(`✅ Upload successful (AVIF) - Saved ${result.savings}%`);
    console.log(`   URL: ${result.url}`);
    
    return result.url;

  } catch (error) {
    console.error('❌ AVIF upload failed:', error);
    console.log('⚠️ Falling back to Data URL approach...');
    
    // Fallback to Data URL if AVIF fails
    return await uploadAsDataURL(file, userId);
  }
}

/**
 * Main upload function - Routes to appropriate method based on feature flag
 * @param {File} file - The file to upload
 * @param {string} userId - User ID for organizing files
 * @param {string} folder - Subfolder (e.g., 'wishlist-covers', 'wishlist-items', 'item-images')
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadImage(file, userId, folder = 'General') {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    console.log(`📸 Uploading image: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    console.log(`   Storage mode: ${USE_AVIF_STORAGE ? 'AVIF + Supabase Storage' : 'Data URL (Legacy)'}`);
    console.log(`   Folder: ${folder}`);

    // 🔄 Route to appropriate upload method
    if (USE_AVIF_STORAGE) {
      return await uploadWithAVIF(file, userId, folder);
    } else {
      return await uploadAsDataURL(file, userId);
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Upload a wishlist cover image
 * @param {File} file - The image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadCoverImage(file, userId) {
  return uploadImage(file, userId, 'wishlist-covers');
}

/**
 * Upload a wishlist item image
 * @param {File} file - The image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadItemImage(file, userId) {
  return uploadImage(file, userId, 'wishlist-items');
}

/**
 * Upload an item detail image
 * @param {File} file - The image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadItemDetailImage(file, userId) {
  return uploadImage(file, userId, 'item-images');
}

/**
 * Delete an image
 * @param {string} imageUrl - Full URL or data URL of the image
 * @returns {Promise<boolean>} True if deletion was successful
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) return false;

    // Data URLs can't be deleted (no server storage)
    if (imageUrl.startsWith('data:')) {
      console.log('📦 Data URL image - no server deletion needed');
      return true;
    }

    // For Supabase Storage URLs, extract path and delete
    if (USE_AVIF_STORAGE && imageUrl.includes(STORAGE_BUCKET)) {
      try {
        // Extract file path from URL
        const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`);
        if (urlParts.length < 2) {
          console.error('Could not extract file path from URL');
          return false;
        }
        
        const filePath = urlParts[1].split('?')[0]; // Remove query params
        
        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([filePath]);

        if (error) {
          console.error('Error deleting from Supabase Storage:', error);
          return false;
        }

        console.log(`✅ Deleted from Supabase Storage: ${filePath}`);
        return true;
      } catch (err) {
        console.error('Error deleting image:', err);
        return false;
      }
    }

    // For other URLs, can't delete (external or unknown source)
    console.log('⚠️ Image URL not from Supabase Storage - skipping deletion');
    return true;

  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Delete multiple images
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<{success: number, failed: number}>} Count of successful and failed deletions
 */
export async function deleteMultipleImages(imageUrls) {
  let successCount = 0;
  let failedCount = 0;

  for (const imageUrl of imageUrls) {
    const success = await deleteImage(imageUrl);
    if (success) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

/**
 * Check if the storage bucket exists and is accessible
 * @returns {Promise<boolean>} True if bucket is accessible
 */
export async function checkBucketExists() {
  try {
    if (!USE_AVIF_STORAGE) {
      console.log('📦 Using Data URL approach - no bucket check needed');
      return false;
    }

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', { limit: 1 });

    if (error) {
      console.error('❌ Bucket check failed:', error);
      return false;
    }

    console.log('✅ Supabase Storage bucket is accessible');
    return true;
  } catch (error) {
    console.error('Error checking bucket:', error);
    return false;
  }
}

/**
 * Get current storage mode
 * @returns {string} 'avif' or 'data-url'
 */
export function getStorageMode() {
  return USE_AVIF_STORAGE ? 'avif' : 'data-url';
}

// Export all functions as a service object
export const supabaseStorageService = {
  uploadImage,
  uploadCoverImage,
  uploadItemImage,
  uploadItemDetailImage,
  deleteImage,
  deleteMultipleImages,
  checkBucketExists,
  getStorageMode,
};
