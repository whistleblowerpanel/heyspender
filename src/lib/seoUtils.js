/**
 * SEO Utilities for dynamic page updates
 * Since we're keeping SEO centralized in index.html, these utilities
 * help update page titles and meta tags dynamically for user-specific content
 */

/**
 * Update the page title dynamically
 * @param {string} title - The new page title
 */
export const updatePageTitle = (title) => {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
};

/**
 * Update meta description dynamically
 * @param {string} description - The new meta description
 */
export const updateMetaDescription = (description) => {
  if (typeof document !== 'undefined') {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      // Create meta description if it doesn't exist
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }
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
    'og:type': ogData.type || 'website'
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
export const updateTwitterTags = (twitterData) => {
  if (typeof document === 'undefined') return;

  const twitterTags = {
    'twitter:title': twitterData.title,
    'twitter:description': twitterData.description,
    'twitter:image': twitterData.image,
    'twitter:card': twitterData.card || 'summary_large_image'
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
 * Update canonical URL dynamically
 * @param {string} url - The new canonical URL
 */
export const updateCanonicalUrl = (url) => {
  if (typeof document !== 'undefined') {
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
};

/**
 * Reset SEO tags to default homepage values
 */
export const resetToDefaultSEO = () => {
  updatePageTitle('HeySpender — Create & Share Wishlists & Cash Goals');
  updateMetaDescription('HeySpender lets you create wishlists or cash goals, share with Spender friends, and receive support. Organize your dreams and make it easy for people to contribute. Perfect for birthdays, weddings, graduations, and more.');
  updateCanonicalUrl('https://heyspender.com/');
  
  updateOpenGraphTags({
    title: 'HeySpender — Create & Share Wishlists & Cash Goals',
    description: 'Create beautiful wishlists and cash goals, then share them with your spenders to help you fulfill them. Perfect for birthdays, weddings, graduations, and special occasions.',
    url: 'https://heyspender.com/',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    type: 'website'
  });
  
  updateTwitterTags({
    title: 'HeySpender – Create & Share Wishlists & Cash Goals',
    description: 'Create wishlists & cash goals, share them, and let supporters help you fulfill them. Perfect for birthdays, weddings, graduations, and special occasions.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    card: 'summary_large_image'
  });
};

/**
 * Update SEO for a wishlist page
 * @param {Object} wishlist - The wishlist object
 * @param {string} wishlistUrl - The full URL of the wishlist
 */
export const updateWishlistSEO = (wishlist, wishlistUrl) => {
  if (!wishlist) return;

  const title = `${wishlist.title} - HeySpender`;
  const description = wishlist.story || `Check out ${wishlist.user?.full_name || 'this user'}'s wishlist for their ${wishlist.occasion || 'special occasion'}!`;
  
  updatePageTitle(title);
  updateMetaDescription(description);
  updateCanonicalUrl(wishlistUrl);
  
  updateOpenGraphTags({
    title: wishlist.title,
    description: description,
    url: wishlistUrl,
    image: wishlist.cover_image_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    type: 'website'
  });
  
  updateTwitterTags({
    title: wishlist.title,
    description: description,
    image: wishlist.cover_image_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    card: 'summary_large_image'
  });
};

/**
 * Update SEO for a user profile page
 * @param {Object} user - The user object
 * @param {string} profileUrl - The full URL of the profile
 */
export const updateProfileSEO = (user, profileUrl) => {
  if (!user) return;

  const title = `${user.full_name || user.username} - HeySpender`;
  const description = `View ${user.full_name || user.username}'s wishlists and support their dreams on HeySpender.`;
  
  updatePageTitle(title);
  updateMetaDescription(description);
  updateCanonicalUrl(profileUrl);
  
  updateOpenGraphTags({
    title: title,
    description: description,
    url: profileUrl,
    image: user.avatar_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    type: 'profile'
  });
  
  updateTwitterTags({
    title: title,
    description: description,
    image: user.avatar_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    card: 'summary_large_image'
  });
};
