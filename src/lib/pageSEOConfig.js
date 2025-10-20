/**
 * Page-specific SEO configuration for social media sharing
 * Each page gets its own title, description, and image for better social media previews
 */

export const pageSEOConfig = {
  // Homepage
  '/': {
    title: 'HeySpender — Create & Share Wishlists & Cash Goals',
    description: 'HeySpender lets you create wishlist, cash goals and share with Spender friends, and receive support. Organize your dreams and make it easy for people to contribute. Perfect for birthdays, weddings, graduations, and more.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'wishlist, cash goals, gift registry, birthday gifts, wedding registry, graduation gifts, crowdfunding, contributions, Paystack, Flutterwave, Monnify'
  },

  // About Us Page
  '/about-us': {
    title: 'About Us — HeySpender',
    description: 'Learn about HeySpender\'s mission to make dreams come true, one goal at a time. Discover our values, team, and commitment to helping you create wishlist, cash goals and share.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'about HeySpender, our mission, team, values, wishlist platform, cash goals, community, empathy, innovation, making dreams come true'
  },

  // FAQ Page
  '/faq': {
    title: 'Frequently Asked Questions — HeySpender',
    description: 'Find answers to common questions about HeySpender, wishlists, payments, and more. Get help with creating wishlist, cash goals and share, making contributions, and using our platform.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'FAQ, help, support, questions, wishlist help, payment help, HeySpender guide'
  },

  // Contact Page
  '/contact': {
    title: 'Contact Us — HeySpender',
    description: 'Get in touch with the HeySpender team. We\'re here to help with any questions, concerns, or feedback about our wishlist platform.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'contact HeySpender, support, help, feedback, customer service'
  },

  // Privacy Policy
  '/privacy-policy': {
    title: 'Privacy Policy — HeySpender',
    description: 'Learn how HeySpender collects, uses, and protects your personal information. Your privacy and data security are our top priorities.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'privacy policy, data protection, security, personal information, HeySpender privacy'
  },

  // Terms of Service
  '/terms-of-service': {
    title: 'Terms of Service — HeySpender',
    description: 'Read the Terms of Service for using HeySpender\'s wishlist platform. Understand your rights and responsibilities when using our services.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'terms of service, user agreement, HeySpender terms, legal, conditions'
  },

  // Explore/Public Wishlists
  '/explore': {
    title: 'Explore Public Wishlists — HeySpender',
    description: 'Feeling generous? Browse public wishlists and make someone\'s day! Discover amazing wishlists from our community and support their dreams.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'public wishlists, explore, browse, support, community, generous'
  },

  // Register Page
  '/register': {
    title: 'Sign Up — HeySpender',
    description: 'Create your HeySpender account to start building wishlists and sharing your dreams. Join thousands of users making their wishes come true.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'sign up, register, create account, join HeySpender, wishlist account'
  },

  // Login Page
  '/login': {
    title: 'Login — HeySpender',
    description: 'Welcome back! Sign in to your HeySpender account to manage your wishlists and continue making dreams come true.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'login, sign in, HeySpender account, access wishlist'
  },

  // Forgot Password
  '/forgot-password': {
    title: 'Reset Password — HeySpender',
    description: 'Forgot your password? No worries! Reset your HeySpender account password quickly and securely.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'forgot password, reset password, password recovery, HeySpender login'
  },

  // Interactive Cards
  '/interactive-cards': {
    title: 'Interactive Cards — HeySpender',
    description: 'Discover our interactive card features that make wishlist sharing more engaging and fun. Create beautiful, interactive experiences for your Spender friends.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'interactive cards, wishlist cards, sharing features, HeySpender cards'
  },

  // Pricing Page
  '/pricing': {
    title: 'Pricing — HeySpender',
    description: 'Simple pricing, powerful wishlists. Learn about HeySpender\'s transparent pricing structure for creating wishlist, cash goals and share.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'pricing, cost, fees, wishlist pricing, HeySpender pricing, transparent pricing'
  },

  // Explore Page
  '/explore': {
    title: 'Explore Public Wishlists — HeySpender',
    description: 'Feeling generous? Browse public wishlists and make someone\'s day! Discover amazing wishlists from our community and support their dreams.',
    image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
    keywords: 'public wishlists, explore, browse, support, community, generous'
  }
};

/**
 * Get SEO configuration for a specific route
 * @param {string} pathname - The current pathname
 * @returns {Object} SEO configuration object
 */
export const getPageSEO = (pathname) => {
  // Handle exact matches first
  if (pageSEOConfig[pathname]) {
    return pageSEOConfig[pathname];
  }

  // Handle dynamic routes (wishlist and profile pages)
  if (pathname.match(/^\/[^\/]+\/[^\/]+$/)) {
    // This is a wishlist page (username/slug)
    // For client-side rendering, we'll use generic metadata
    // The actual metadata will be handled by the Edge Function for social media crawlers
    return {
      title: 'Wishlist — HeySpender',
      description: 'Check out this amazing wishlist on HeySpender! Support their dreams and make their wishes come true.',
      image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
      keywords: 'wishlist, support, dreams, HeySpender wishlist'
    };
  }

  if (pathname.match(/^\/[^\/]+$/)) {
    // This is a profile page (username)
    return {
      title: 'Profile — HeySpender',
      description: 'View this user\'s wishlists and support their dreams on HeySpender.',
      image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
      keywords: 'profile, user, wishlist, HeySpender profile'
    };
  }

  // Default fallback
  return pageSEOConfig['/'];
};

/**
 * Update social media metadata for the current page
 * @param {string} pathname - The current pathname
 * @param {Object} customData - Optional custom data to override defaults
 */
export const updatePageSocialMedia = (pathname, customData = {}) => {
  const seoConfig = getPageSEO(pathname);
  const config = { ...seoConfig, ...customData };

  console.log('SEO Config for', pathname, ':', config);

  if (typeof document === 'undefined') return;

  // Update immediately and synchronously
  updateMetaTagsSync(config, pathname);
};

/**
 * Synchronously update meta tags for immediate effect
 * @param {Object} config - SEO configuration
 * @param {string} pathname - Current pathname
 */
const updateMetaTagsSync = (config, pathname) => {

  // Update page title
  document.title = config.title;

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', config.description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', config.description);
    document.head.appendChild(metaDescription);
  }

  // Update keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', config.keywords);
  } else {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', config.keywords);
    document.head.appendChild(metaKeywords);
  }

  // Update canonical URL
  const canonicalUrl = `https://heyspender.com${pathname}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl);
  } else {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonical);
  }

  // Update Open Graph tags
  const ogTags = {
    'og:title': config.title,
    'og:description': config.description,
    'og:url': canonicalUrl,
    'og:image': config.image,
    'og:type': 'website',
    'og:site_name': 'HeySpender'
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

  // Update Twitter Card tags
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.image,
    'twitter:site': '@heyspender',
    'twitter:creator': '@heyspender'
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
