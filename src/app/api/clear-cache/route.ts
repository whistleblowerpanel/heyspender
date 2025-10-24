import { NextRequest, NextResponse } from 'next/server';
import { clearAllSocialMediaCaches, getCacheClearingUrls, validateMetaTags } from '@/lib/socialMediaCache';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    // Validate the URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }
    
    // Clear social media caches
    const cacheCleared = await clearAllSocialMediaCaches(url);
    
    // Validate meta tags
    const validation = await validateMetaTags(url);
    
    // Get manual cache clearing URLs
    const manualUrls = getCacheClearingUrls(url);
    
    return NextResponse.json({
      success: cacheCleared,
      validation,
      manualUrls,
      message: cacheCleared 
        ? 'Social media caches cleared successfully' 
        : 'Failed to clear some caches, use manual URLs below'
    });
    
  } catch (error) {
    console.error('Error in cache clearing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Validate the URL
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }
  
  try {
    // Validate meta tags
    const validation = await validateMetaTags(url);
    
    // Get manual cache clearing URLs
    const manualUrls = getCacheClearingUrls(url);
    
    return NextResponse.json({
      validation,
      manualUrls
    });
    
  } catch (error) {
    console.error('Error validating meta tags:', error);
    return NextResponse.json({ error: 'Failed to validate meta tags' }, { status: 500 });
  }
}
