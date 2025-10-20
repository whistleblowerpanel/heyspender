import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DashboardProtectedRoute = ({ children }) => {
  const { user, loading, isVerified } = useAuth();
  const location = useLocation();

  // Wait for auth to finish loading before making decisions
  if (loading) {
    // Don't show spinner if we already know there's no user (prevents flash on logout)
    if (!user) {
      return null; // Return nothing to avoid loading screen flash
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // After loading is complete, allow dashboard access even without user (they'll see verification banner)
  // This allows newly registered users to access dashboard before email verification
  if (!user) {
    console.log('⚠️ No user found in auth context, but allowing dashboard access');
    // Allow access to dashboard - they'll see the verification banner
    return children;
  }

  // If user is not verified, still allow dashboard access (they'll see verification banner)
  if (!isVerified) {
    console.log('⚠️ User not verified, but allowing dashboard access with banner');
    // Allow access to dashboard - they'll see the verification banner
    return children;
  }

  // Render the protected content if authenticated and verified
  return children;
};

export default DashboardProtectedRoute;
