import React from 'react';
// Removed react-router-dom import - using Next.js layout system
import { Gift, ShoppingBag, Wallet, Settings, BarChart3 } from 'lucide-react';
import BottomNavbar from '@/components/dashboard/BottomNavbar';
import Navbar from '@/components/layout/Navbar';

const DashboardLayout = ({ children }) => {
  const tabs = [
    { value: 'wishlists', label: 'Wishlists', icon: Gift, path: '/dashboard/wishlist' },
    { value: 'spender-list', label: 'Spender List', icon: ShoppingBag, path: '/dashboard/spender-list' },
    { value: 'wallet', label: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
    { value: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { value: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div>
      <Navbar />
      {children}
      <BottomNavbar tabs={tabs} />
    </div>
  );
};

export default DashboardLayout;

