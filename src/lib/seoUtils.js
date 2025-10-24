/**
 * SEO utilities for dynamic meta tag generation and structured data
 */

/**
 * Update meta description dynamically
 * @param {string} description - The meta description
 */
export const updateMetaDescription = (description) => {
  if (typeof document === 'undefined') return;

  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    document.head.appendChild(metaDescription);
  }
};

/**
 * Update Open Graph meta tags dynamically
 * @param {Object} ogData - Object containing og:title, og:description, og:image, etc.
 */
export const updateOpenGraphTags = (ogData) => {
  if (typeof document === 'undefined') return;

  const ogTags = {
    'og:title': ogData.title,
    'og:description': ogData.description,
    'og:url': ogData.url,
    'og:image': ogData.image,
    'og:type': ogData.type || 'website',
    'og:site_name': ogData.site_name || 'HeySpender'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    if (content) {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        metaTag.setAttribute('content', content);
        document.head.appendChild(metaTag);
      }
    }
  });
};

/**
 * Update Twitter Card meta tags dynamically
 * @param {Object} twitterData - Object containing twitter:title, twitter:description, twitter:image, etc.
 */
export const updateTwitterCardTags = (twitterData) => {
  if (typeof document === 'undefined') return;

  const twitterTags = {
    'twitter:card': twitterData.card || 'summary_large_image',
    'twitter:title': twitterData.title,
    'twitter:description': twitterData.description,
    'twitter:image': twitterData.image,
    'twitter:site': twitterData.site || '@heyspender',
    'twitter:creator': twitterData.creator || '@heyspender'
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    if (content) {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        metaTag.setAttribute('content', content);
        document.head.appendChild(metaTag);
      }
    }
  });
};

/**
 * Generate JSON-LD structured data for wishlist items
 * @param {Object} itemData - The wishlist item data
 * @param {Object} wishlistData - The wishlist data
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export const generateItemStructuredData = (itemData, wishlistData, baseUrl) => {
  const itemUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}/${itemData.id}`;
  const wishlistUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": itemData.name,
    "description": `Support ${wishlistData.user.full_name}'s wishlist! ${itemData.name} - Desired: ${itemData.qty_total}, Purchased: ${itemData.qty_claimed || 0}. Help make their dreams come true!`,
    "url": itemUrl,
    "image": itemData.image_url || wishlistData.cover_image_url,
    "brand": {
      "@type": "Brand",
      "name": "HeySpender"
    },
    "offers": {
      "@type": "Offer",
      "price": itemData.unit_price_estimate || 0,
      "priceCurrency": "NGN",
      "availability": itemData.qty_claimed >= itemData.qty_total ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Person",
        "name": wishlistData.user.full_name,
        "url": `${baseUrl}/${wishlistData.user.username}`
      }
    },
    "isPartOf": {
      "@type": "Collection",
      "name": wishlistData.title,
      "description": wishlistData.story || `A wishlist by ${wishlistData.user.full_name} for their ${wishlistData.occasion}`,
      "url": wishlistUrl,
      "creator": {
        "@type": "Person",
        "name": wishlistData.user.full_name,
        "url": `${baseUrl}/${wishlistData.user.username}`
      }
    }
  };

  return structuredData;
};

/**
 * Generate JSON-LD structured data for wishlists
 * @param {Object} wishlistData - The wishlist data
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export const generateWishlistStructuredData = (wishlistData, baseUrl) => {
  const wishlistUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "name": wishlistData.title,
    "description": wishlistData.story || `A wishlist by ${wishlistData.user.full_name} for their ${wishlistData.occasion}`,
    "url": wishlistUrl,
    "image": wishlistData.cover_image_url,
    "creator": {
      "@type": "Person",
      "name": wishlistData.user.full_name,
      "url": `${baseUrl}/${wishlistData.user.username}`
    },
    "dateCreated": wishlistData.created_at,
    "dateModified": wishlistData.updated_at,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${wishlistData.title} Items`,
      "numberOfItems": wishlistData.items?.length || 0
    }
  };

  return structuredData;
};

/**
 * Generate JSON-LD structured data for user profiles
 * @param {Object} profileData - The user profile data
 * @param {Array} wishlists - Array of user's wishlists
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export const generateProfileStructuredData = (profileData, wishlists, baseUrl) => {
  const profileUrl = `${baseUrl}/${profileData.username}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profileData.full_name,
    "url": profileUrl,
    "image": profileData.avatar_url,
    "description": `View ${profileData.full_name}'s wishlists and support their dreams on HeySpender.`,
    "sameAs": [],
    "knowsAbout": wishlists.map(wishlist => ({
      "@type": "Collection",
      "name": wishlist.title,
      "url": `${baseUrl}/${profileData.username}/${wishlist.slug}`
    }))
  };

  return structuredData;
};

/**
 * Inject JSON-LD structured data into the page
 * @param {Object} structuredData - The structured data object
 */
export const injectStructuredData = (structuredData) => {
  if (typeof document === 'undefined') return;

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

/**
 * Update all SEO meta tags comprehensively
 * @param {Object} seoData - Complete SEO data object
 */
export const updateAllSEOTags = (seoData) => {
  if (typeof document === 'undefined') return;

  const {
    title,
    description,
    image,
    url,
    keywords,
    structuredData,
    ogData = {},
    twitterData = {}
  } = seoData;

  // Update page title
  if (title) {
    document.title = title;
  }

  // Update meta description
  if (description) {
    updateMetaDescription(description);
  }

  // Update keywords
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      document.head.appendChild(metaKeywords);
    }
  }

  // Update canonical URL
  if (url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }

  // Update Open Graph tags
  updateOpenGraphTags({
    title,
    description,
    image,
    url,
    ...ogData
  });

  // Update Twitter Card tags
  updateTwitterCardTags({
    title,
    description,
    image,
    ...twitterData
  });

  // Inject structured data
  if (structuredData) {
    injectStructuredData(structuredData);
  }
};

/**
 * Generate comprehensive SEO data for wishlist items
 * @param {Object} itemData - The wishlist item data
 * @param {Object} wishlistData - The wishlist data
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} Complete SEO data object
 */
export const generateItemSEOData = (itemData, wishlistData, baseUrl) => {
  const itemUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}/${itemData.id}`;
  const wishlistUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}`;
  
  const title = `${itemData.name} — ${wishlistData.title} — HeySpender`;
  const description = `Support ${wishlistData.user?.full_name || 'this user'}'s wishlist! ${itemData.name} - Desired: ${itemData.qty_total}, Purchased: ${itemData.qty_claimed || 0}. ${itemData.unit_price_estimate ? `₦${Number(itemData.unit_price_estimate).toLocaleString()}` : 'Price TBD'}. Help make their dreams come true!`;
  const image = itemData.image_url || wishlistData.cover_image_url || `${baseUrl}/HeySpender%20Media/General/HeySpender%20Banner.webp`;
  const keywords = `${itemData.name}, wishlist item, gift, support, contribution, ${wishlistData.occasion || 'special occasion'}, HeySpender`;

  return {
    title,
    description,
    image,
    url: itemUrl,
    keywords,
    structuredData: generateItemStructuredData(itemData, wishlistData, baseUrl),
    ogData: {
      type: 'product',
      site_name: 'HeySpender'
    },
    twitterData: {
      card: 'summary_large_image',
      site: '@heyspender',
      creator: '@heyspender'
    }
  };
};

/**
 * Generate comprehensive SEO data for wishlists
 * @param {Object} wishlistData - The wishlist data
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} Complete SEO data object
 */
export const generateWishlistSEOData = (wishlistData, baseUrl) => {
  const wishlistUrl = `${baseUrl}/${wishlistData.user.username}/${wishlistData.slug}`;
  
  const title = `${wishlistData.title} — HeySpender`;
  const description = wishlistData.story || `Check out ${wishlistData.user?.full_name || 'this user'}'s wishlist for their ${wishlistData.occasion || 'special occasion'}! Support their dreams and make their wishes come true.`;
  const image = wishlistData.cover_image_url || `${baseUrl}/HeySpender%20Media/General/HeySpender%20Banner.webp`;
  const keywords = `wishlist, ${wishlistData.occasion || 'special occasion'}, gift registry, support, contribution, ${wishlistData.user?.full_name || 'user'}, HeySpender`;

  return {
    title,
    description,
    image,
    url: wishlistUrl,
    keywords,
    structuredData: generateWishlistStructuredData(wishlistData, baseUrl),
    ogData: {
      type: 'website',
      site_name: 'HeySpender'
    },
    twitterData: {
      card: 'summary_large_image',
      site: '@heyspender',
      creator: '@heyspender'
    }
  };
};

/**
 * Generate comprehensive SEO data for user profiles
 * @param {Object} profileData - The user profile data
 * @param {Array} wishlists - Array of user's wishlists
 * @param {string} baseUrl - The base URL of the site
 * @returns {Object} Complete SEO data object
 */
export const generateProfileSEOData = (profileData, wishlists, baseUrl) => {
  const profileUrl = `${baseUrl}/${profileData.username}`;
  
  const title = `${profileData.full_name || profileData.username} — HeySpender`;
  const description = `View ${profileData.full_name || profileData.username}'s wishlists and support their dreams on HeySpender. ${wishlists.length > 0 ? `Check out their ${wishlists.length} wishlist${wishlists.length > 1 ? 's' : ''}!` : 'Help them create their first wishlist!'}`;
  const image = profileData.avatar_url || `${baseUrl}/HeySpender%20Media/General/HeySpender%20Banner.webp`;
  const keywords = `profile, ${profileData.full_name || profileData.username}, wishlist, support, dreams, HeySpender`;

  return {
    title,
    description,
    image,
    url: profileUrl,
    keywords,
    structuredData: generateProfileStructuredData(profileData, wishlists, baseUrl),
    ogData: {
      type: 'profile',
      site_name: 'HeySpender'
    },
    twitterData: {
      card: 'summary_large_image',
      site: '@heyspender',
      creator: '@heyspender'
    }
  };
};