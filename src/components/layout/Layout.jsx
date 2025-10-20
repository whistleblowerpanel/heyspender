import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmailVerificationBanner from '@/components/ui/EmailVerificationBanner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  const isHomePage = location.pathname === '/';
  
  const isProfilePage = /^\/[^/]+\/?$/.test(location.pathname) && !['/register', '/login', '/verify', '/admin', '/dashboard', '/wallet', '/explore', '/', '/auth/confirm'].includes(location.pathname);
  const isWishlistPage = /^\/[^/]+\/[^/]+$/.test(location.pathname);
  const isPublicWishlistsPage = location.pathname === '/explore';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');

  const noPadding = isProfilePage || isWishlistPage || isPublicWishlistsPage;

  // Check if user needs email verification
  useEffect(() => {
    if (user && !user.email_confirmed_at && !bannerDismissed) {
      // Only show banner on dashboard pages
      if (isDashboard || isAdminDashboard) {
        setShowVerificationBanner(true);
      }
    } else {
      setShowVerificationBanner(false);
    }
  }, [user, isDashboard, isAdminDashboard, bannerDismissed]);

  // Reset banner dismissed state when user verifies their email
  useEffect(() => {
    if (user && user.email_confirmed_at && bannerDismissed) {
      setBannerDismissed(false);
    }
  }, [user?.email_confirmed_at, bannerDismissed]);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    setShowVerificationBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Verification Banner - positioned above navbar */}
      {showVerificationBanner && (
        <div className="fixed top-0 left-0 right-0 z-[100001]">
          <EmailVerificationBanner onDismiss={handleDismissBanner} />
        </div>
      )}
      
      {/* Navbar - positioned below banner when banner is shown */}
      <div className={cn(
        'fixed left-0 right-0 z-[100000] px-4 transition-all duration-300',
        showVerificationBanner ? 'top-[5.5rem]' : 'top-4'
      )}>
        <Navbar />
      </div>
      
      <main className={cn(
        'flex-1 transition-all duration-300',
        !isHomePage && !noPadding && 'pt-28',
        showVerificationBanner && 'pt-40' // Extra padding when banner is shown (5.5rem banner + 4.5rem navbar + 1rem spacing)
      )}>
        <Outlet />
      </main>
      {!(isDashboard || isAdminDashboard) && <Footer />}
    </div>
  );
};

export default Layout;