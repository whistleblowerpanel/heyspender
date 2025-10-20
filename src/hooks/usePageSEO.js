import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';

/**
 * Custom hook to automatically update page SEO based on current route
 * This ensures each page has proper social media metadata when shared
 */
export const usePageSEO = (customData = {}) => {
  const location = useLocation();

  useEffect(() => {
    // Update social media metadata when route changes
    console.log('Updating SEO for route:', location.pathname);
    updatePageSocialMedia(location.pathname, customData);
  }, [location.pathname, customData]);

  // Also update immediately on mount
  useEffect(() => {
    console.log('Initial SEO update for route:', location.pathname);
    updatePageSocialMedia(location.pathname, customData);
  }, []); // Run once on mount

  return null; // This hook doesn't return anything, it just updates the page
};
