/**
 * Supabase Storage Service
 * Handles all file uploads to Supabase Storage
 * Works in both development and production environments
 */

import { supabase } from './customSupabaseClient';

const STORAGE_BUCKET = 'HeySpenderMedia';

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
 * Upload an image file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} userId - User ID for organizing files
 * @param {string} folder - Subfolder (e.g., 'wishlist-covers', 'wishlist-items')
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadImage(file, userId, folder = '') {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const filePath = generateFileName(file, userId, folder);

    console.log(`Uploading to Supabase Storage: ${STORAGE_BUCKET}/${filePath}`);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    console.log(`Upload successful: ${publicUrl}`);
    return publicUrl;

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
 * Delete an image from Supabase Storage
 * @param {string} imageUrl - Full URL or path of the image
 * @returns {Promise<boolean>} True if deletion was successful
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) return false;

    // Extract file path from URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.indexOf('public') + 1;
    
    if (bucketIndex === 0) {
      console.warn('Could not extract file path from URL:', imageUrl);
      return false;
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/'); // Skip bucket name

    console.log(`Deleting from Supabase Storage: ${STORAGE_BUCKET}/${filePath}`);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Delete multiple images from Supabase Storage
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
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', {
        limit: 1
      });

    if (error) {
      console.error('Bucket check failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking bucket:', error);
    return false;
  }
}

// Export all functions as a service object
export const supabaseStorageService = {
  uploadImage,
  uploadCoverImage,
  uploadItemImage,
  deleteImage,
  deleteMultipleImages,
  checkBucketExists
};

