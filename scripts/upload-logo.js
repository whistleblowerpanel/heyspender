#!/usr/bin/env node

/**
 * Upload HeySpender Logo to Supabase Storage
 * This script uploads the logo to Supabase storage for use in email templates
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hgvdslcpndmimatvliyu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Missing Supabase service role key');
  console.error('Required: SUPABASE_SERVICE_ROLE_KEY');
  console.error('You can find this in your Supabase dashboard under Settings > API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadLogo() {
  try {
    const logoPath = path.join(__dirname, '..', 'public', 'HeySpenderMedia', 'General', 'HeySpender Logoo.webp');
    
    // Check if logo file exists
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Logo file not found:', logoPath);
      process.exit(1);
    }

    console.log('📸 Reading logo file...');
    const logoBuffer = fs.readFileSync(logoPath);
    
    // Upload to Supabase storage
    console.log('☁️ Uploading to Supabase storage...');
    const { data, error } = await supabase.storage
      .from('HeySpender Media')
      .upload('branding/heyspender-logo.webp', logoBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });

    if (error) {
      console.error('❌ Upload failed:', error);
      process.exit(1);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('HeySpender Media')
      .getPublicUrl('branding/heyspender-logo.webp');

    console.log('✅ Logo uploaded successfully!');
    console.log('📁 File path:', data.path);
    console.log('🔗 Public URL:', publicUrlData.publicUrl);
    console.log('');
    console.log('📧 Use this URL in your email templates:');
    console.log(publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadLogo();
