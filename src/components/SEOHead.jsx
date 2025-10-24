/**
 * SEO Head Component for dynamic meta tag management
 * This component provides a reusable way to set SEO meta tags for any page
 */

import { useEffect } from 'react';
import { updateAllSEOTags } from '@/lib/seoUtils';

const SEOHead = ({ 
  title, 
  description, 
  image, 
  url, 
  keywords, 
  structuredData, 
  ogData = {}, 
  twitterData = {} 
}) => {
  useEffect(() => {
    const seoData = {
      title,
      description,
      image: image || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
      url: url || 'https://heyspender.com',
      keywords,
      structuredData,
      ogData: {
        type: 'website',
        site_name: 'HeySpender',
        ...ogData
      },
      twitterData: {
        card: 'summary_large_image',
        site: '@heyspender',
        creator: '@heyspender',
        ...twitterData
      }
    };
    
    updateAllSEOTags(seoData);
  }, [title, description, image, url, keywords, structuredData, ogData, twitterData]);

  return null; // This component doesn't render anything
};

export default SEOHead;
