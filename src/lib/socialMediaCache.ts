/**
 * Social Media Cache Clearing Utilities
 * These utilities help clear cached meta tags from social media platforms
 */

/**
 * Clear Facebook/WhatsApp cache for a URL
 * @param {string} url - The URL to clear cache for
 */
export const clearFacebookCache = async (url: string) => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/?id=${encodeURIComponent(url)}&scrape=true`, {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log('✅ Facebook cache cleared for:', url);
      return true;
    } else {
      console.error('❌ Failed to clear Facebook cache:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error clearing Facebook cache:', error);
    return false;
  }
};

/**
 * Clear Twitter cache for a URL
 * @param {string} url - The URL to clear cache for
 */
export const clearTwitterCache = async (url: string) => {
  try {
    const response = await fetch(`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(url)}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      console.log('✅ Twitter cache cleared for:', url);
      return true;
    } else {
      console.error('❌ Failed to clear Twitter cache:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error clearing Twitter cache:', error);
    return false;
  }
};

/**
 * Clear LinkedIn cache for a URL
 * @param {string} url - The URL to clear cache for
 */
export const clearLinkedInCache = async (url: string) => {
  try {
    const response = await fetch(`https://www.linkedin.com/voyager/api/content/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation ClearCache($url: String!) { clearCache(url: $url) }`,
        variables: { url }
      })
    });
    
    if (response.ok) {
      console.log('✅ LinkedIn cache cleared for:', url);
      return true;
    } else {
      console.error('❌ Failed to clear LinkedIn cache:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error clearing LinkedIn cache:', error);
    return false;
  }
};

/**
 * Clear all social media caches for a URL
 * @param {string} url - The URL to clear cache for
 */
export const clearAllSocialMediaCaches = async (url: string) => {
  console.log('🔄 Clearing social media caches for:', url);
  
  const results = await Promise.allSettled([
    clearFacebookCache(url),
    clearTwitterCache(url),
    clearLinkedInCache(url)
  ]);
  
  const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
  console.log(`✅ Cleared ${successCount}/3 social media caches`);
  
  return successCount > 0;
};

/**
 * Generate cache clearing URLs for manual use
 * @param {string} url - The URL to generate cache clearing URLs for
 * @returns {Object} Object containing cache clearing URLs
 */
export const getCacheClearingUrls = (url: string) => {
  return {
    facebook: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`,
    twitter: `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(url)}`,
    whatsapp: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}` // WhatsApp uses Facebook's debugger
  };
};

/**
 * Validate meta tags for a URL
 * @param {string} url - The URL to validate
 * @returns {Promise<Object>} Validation results
 */
export const validateMetaTags = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    
    return {
      title: titleMatch ? titleMatch[1] : null,
      description: descriptionMatch ? descriptionMatch[1] : null,
      ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
      ogDescription: ogDescriptionMatch ? ogDescriptionMatch[1] : null,
      ogImage: ogImageMatch ? ogImageMatch[1] : null,
      hasImage: !!ogImageMatch,
      isValid: !!(titleMatch && descriptionMatch && ogTitleMatch && ogDescriptionMatch)
    };
  } catch (error) {
    console.error('❌ Error validating meta tags:', error);
    return null;
  }
};
