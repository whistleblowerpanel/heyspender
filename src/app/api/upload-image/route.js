/**
 * AVIF Image Upload API Route
 * Converts uploaded images to AVIF format and uploads to Supabase Storage
 * Organized by folders: wishlist-covers, wishlist-items, item-images
 */

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const STORAGE_BUCKET = 'HeySpender Media';

// AVIF Quality Settings
const AVIF_QUALITY = 80; // 60-90 recommended (80 is a good balance)
const AVIF_EFFORT = 4;    // 0-9, higher = smaller file but slower (4 is balanced)

/**
 * POST /api/upload-image
 * Accepts: multipart/form-data with 'file', 'userId', 'folder'
 * Returns: { success: true, url: string, originalSize: number, compressedSize: number, savings: number }
 */
export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const folder = formData.get('folder') || 'General';

    // Validate inputs
    if (!file) {
      return Response.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ 
        success: false, 
        error: 'File must be an image' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json({ 
        success: false, 
        error: 'File size must be less than 10MB' 
      }, { status: 400 });
    }

    console.log(`📸 Converting image to AVIF: ${file.name} (${file.size} bytes)`);

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to AVIF using Sharp
    const avifBuffer = await sharp(buffer)
      .avif({
        quality: AVIF_QUALITY,
        effort: AVIF_EFFORT,
        chromaSubsampling: '4:2:0', // Better compression
      })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${userId}-${timestamp}-${randomStr}.avif`;
    const filePath = `${folder}/${fileName}`;

    console.log(`📤 Uploading to Supabase Storage: ${filePath}`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, avifBuffer, {
        contentType: 'image/avif',
        cacheControl: '31536000', // Cache for 1 year
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Calculate savings
    const originalSize = buffer.length;
    const compressedSize = avifBuffer.length;
    const savings = Math.round((1 - compressedSize / originalSize) * 100);

    console.log(`✅ Upload successful!`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   AVIF: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}%`);

    return Response.json({
      success: true,
      url: publicUrl,
      originalSize,
      compressedSize,
      savings,
      format: 'avif',
      folder,
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    return Response.json({
      success: false,
      error: error.message || 'Upload failed',
    }, { status: 500 });
  }
}

// Optional: Add GET endpoint to check API health
export async function GET() {
  return Response.json({
    status: 'ok',
    message: 'AVIF Image Upload API is running',
    bucket: STORAGE_BUCKET,
    avifQuality: AVIF_QUALITY,
    avifEffort: AVIF_EFFORT,
  });
}


