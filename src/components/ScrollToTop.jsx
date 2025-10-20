import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Use native scroll restoration to top on each route change
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Fallback for browsers without the 'instant' behavior
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, search]);

  return null;
}
