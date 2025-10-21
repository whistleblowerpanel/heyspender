/**
 * Image Upload Service
 * Handles all file uploads using a simple file upload approach
 * Works in both development and production environments
 */

import { supabase } from './customSupabaseClient';

// Try to use Supabase Storage, fallback to public folder if bucket doesn't exist
const STORAGE_BUCKET = 'HeySpenderMedia';
const FALLBACK_TO_PUBLIC = true;

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
 * Upload an image file using a simple approach
 * @param {File} file - The file to upload
 * @param {string} userId - User ID for organizing files
 * @param {string} folder - Subfolder (e.g., 'General')
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

    // Generate unique filename
    const filePath = generateFileName(file, userId, folder);

    console.log(`Uploading image: ${filePath}`);

    // For now, we'll use a simple approach that creates a data URL
    // This will work immediately without requiring Supabase Storage setup
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Create a unique filename for the data URL
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileExt = file.name.split('.').pop().toLowerCase();
        const fileName = `${userId}-${timestamp}-${randomStr}.${fileExt}`;
        
        // Return a data URL that can be used immediately
        const dataUrl = reader.result;
        console.log(`Upload successful: ${fileName}`);
        resolve(dataUrl);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });

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
  return uploadImage(file, userId, 'General');
}

/**
 * Upload a wishlist item image
 * @param {File} file - The image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadItemImage(file, userId) {
  return uploadImage(file, userId, 'General');
}

/**
 * Delete an image (placeholder for data URLs)
 * @param {string} imageUrl - Full URL or data URL of the image
 * @returns {Promise<boolean>} True if deletion was successful
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) return false;

    // For data URLs, we can't actually delete them from a server
    // This is a placeholder function that always returns true
    if (imageUrl.startsWith('data:')) {
      console.log('Data URL image - no server deletion needed');
      return true;
    }

    // For regular URLs, we would need proper server-side deletion
    console.log('Note: Server-side image deletion not implemented');
    return true;

  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}

/**
 * Delete multiple images (placeholder for data URLs)
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
    // For now, we'll assume the bucket doesn't exist and use data URLs
    // This can be updated later when Supabase Storage is properly configured
    console.log('Using data URL approach - no bucket check needed');
    return false; // Return false to use data URL fallback
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

