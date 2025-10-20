# HeySpender Next.js Complete Integration Guide

## Overview
This guide provides comprehensive instructions for integrating all converted pages in the HeySpender Next.js application, ensuring proper routing, navigation, and functionality without breaking any links.

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Homepage (already working)
│   ├── about-us/page.tsx          # About Us page
│   ├── faq/page.tsx               # FAQ page
│   ├── pricing/page.tsx           # Pricing page
│   ├── contact/page.tsx           # Contact page
│   ├── explore/page.tsx           # Explore/Public Wishlists page
│   ├── privacy/page.tsx           # Privacy Policy page
│   ├── terms/page.tsx             # Terms of Service page
│   ├── get-started/page.tsx       # Get Started wizard page
│   ├── payment-callback/page.tsx  # Payment callback handler
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   ├── register/page.tsx      # Registration page
│   │   ├── forgot-password/page.tsx # Forgot password page
│   │   ├── reset-password/page.tsx  # Reset password page
│   │   └── verify/page.tsx        # Email verification page
│   ├── dashboard/
│   │   ├── page.tsx               # Main dashboard
│   │   ├── analytics/page.tsx     # Analytics page
│   │   ├── settings/page.tsx      # Settings page
│   │   ├── spender-list/page.tsx  # Spender list page
│   │   ├── wallet/page.tsx        # Wallet page
│   │   └── my-wishlists/page.tsx  # My wishlists page
│   ├── admin/
│   │   ├── page.tsx               # Admin panel
│   │   └── dashboard/page.tsx     # Admin dashboard
│   └── [username]/
│       ├── page.tsx               # User profile page
│       └── [slug]/
│           ├── page.tsx           # Wishlist page
│           └── [itemId]/page.tsx  # Wishlist item page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Main navigation
│   │   ├── Footer.tsx            # Footer component
│   │   └── MobileMenu.tsx        # Mobile navigation
│   └── ui/                       # UI components
├── contexts/
│   ├── SupabaseAuthContext.tsx   # Authentication context
│   ├── WalletContext.tsx         # Wallet context
│   └── ConfettiContext.tsx       # Confetti context
└── lib/
    ├── customSupabaseClient.js   # Supabase client
    ├── wishlistService.js        # Wishlist services
    ├── claimsService.js          # Claims services
    └── utils.js                  # Utility functions
```

## Critical Integration Steps

### 1. Navigation Component Updates

#### Update Navbar Component (`src/components/layout/Navbar.tsx`)
```tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/HeySpenderMedia/General/HeySpender Logoo Reverse.webp" 
              alt="HeySpender" 
              className="h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about-us" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
              About Us
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
              Contact
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
              Explore
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="border-2 border-black">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline" className="border-2 border-black">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="border-2 border-black">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-brand-purple-dark text-white border-2 border-black">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about-us" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
                About Us
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
                Contact
              </Link>
              <Link href="/explore" className="text-gray-700 hover:text-brand-purple-dark transition-colors">
                Explore
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full border-2 border-black">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="w-full border-2 border-black">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full border-2 border-black">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-brand-purple-dark text-white border-2 border-black">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

### 2. Dashboard Layout Component

#### Create Dashboard Layout (`src/components/layout/DashboardLayout.tsx`)
```tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  Settings, 
  ShoppingBag, 
  Wallet, 
  Gift,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Wishlists', href: '/dashboard/my-wishlists', icon: Gift },
    { name: 'Spender List', href: '/dashboard/spender-list', icon: ShoppingBag },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <img 
                src="/HeySpenderMedia/General/HeySpender Logoo Reverse.webp" 
                alt="HeySpender" 
                className="h-8"
              />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-brand-purple-dark text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-brand-purple-dark'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

### 3. Update Dashboard Pages to Use Layout

#### Update each dashboard page to use the layout:
```tsx
// Example for /src/app/dashboard/page.tsx
"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
// ... existing imports and component code ...

const DashboardPage = () => {
  // ... existing component logic ...

  return (
    <DashboardLayout>
      {/* existing component JSX */}
    </DashboardLayout>
  );
};

export default DashboardPage;
```

### 4. Authentication Route Protection

#### Create Auth Guard Component (`src/components/AuthGuard.tsx`)
```tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  if (!requireAuth && user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default AuthGuard;
```

### 5. Update Pages with Auth Guards

#### For protected pages (dashboard, admin):
```tsx
// Example for dashboard pages
import AuthGuard from '@/components/AuthGuard';

const DashboardPage = () => {
  // ... component logic ...

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* page content */}
      </DashboardLayout>
    </AuthGuard>
  );
};
```

#### For auth pages (login, register):
```tsx
// Example for auth pages
import AuthGuard from '@/components/AuthGuard';

const LoginPage = () => {
  // ... component logic ...

  return (
    <AuthGuard requireAuth={false}>
      {/* page content */}
    </AuthGuard>
  );
};
```

### 6. Dynamic Route Handling

#### Ensure proper dynamic routing for user profiles and wishlists:

#### Update `src/app/[username]/page.tsx`:
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// ... other imports

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  
  // ... rest of component logic using username
};
```

#### Update `src/app/[username]/[slug]/page.tsx`:
```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// ... other imports

const WishlistPage = () => {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;
  
  // ... rest of component logic using username and slug
};
```

### 7. Navigation Links Updates

#### Update all internal navigation to use Next.js Link:
```tsx
// Replace all router.push() calls with Link components where appropriate
import Link from 'next/link';

// Instead of:
// <button onClick={() => router.push('/dashboard')}>Dashboard</button>

// Use:
// <Link href="/dashboard">
//   <button>Dashboard</button>
// </Link>
```

### 8. Form Submissions and Redirects

#### Update form submissions to use Next.js router:
```tsx
import { useRouter } from 'next/navigation';

const handleSubmit = async (data) => {
  try {
    // ... form submission logic
    router.push('/dashboard'); // Use Next.js router
  } catch (error) {
    // ... error handling
  }
};
```

### 9. External Links and Window Opens

#### For external links and new window opens:
```tsx
// Keep using window.open() for external links
const handleViewWishlist = (wishlist) => {
  const username = user?.user_metadata?.username;
  if (username) {
    window.open(`/${username}/${wishlist.slug}`, '_blank');
  }
};
```

### 10. SEO and Metadata

#### Add metadata to each page:
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title - HeySpender',
  description: 'Page description',
  openGraph: {
    title: 'Page Title - HeySpender',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
};

// For dynamic pages, use generateMetadata
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} - HeySpender`,
    description: `View ${params.username}'s wishlists on HeySpender`,
  };
}
```

## Testing Checklist

### ✅ Navigation Testing
- [ ] All navbar links work correctly
- [ ] Mobile menu functions properly
- [ ] Dashboard navigation works
- [ ] Back/forward browser buttons work
- [ ] Direct URL access works for all pages

### ✅ Authentication Testing
- [ ] Protected routes redirect to login when not authenticated
- [ ] Auth pages redirect to dashboard when authenticated
- [ ] Sign out functionality works
- [ ] Session persistence works

### ✅ Dynamic Routes Testing
- [ ] User profile pages load correctly
- [ ] Wishlist pages load correctly
- [ ] Wishlist item pages load correctly
- [ ] Invalid usernames/slugs handle gracefully

### ✅ Form Submissions Testing
- [ ] Login form redirects correctly
- [ ] Registration form redirects correctly
- [ ] Dashboard forms work correctly
- [ ] Payment callbacks work correctly

### ✅ External Links Testing
- [ ] Social sharing links work
- [ ] External payment links work
- [ ] Email verification links work

## Common Issues and Solutions

### Issue: Links not working
**Solution**: Ensure all internal navigation uses Next.js `Link` component or `useRouter().push()`

### Issue: Authentication redirects not working
**Solution**: Implement `AuthGuard` component and wrap protected pages

### Issue: Dynamic routes not loading
**Solution**: Ensure proper `useParams()` usage and parameter extraction

### Issue: Mobile navigation not working
**Solution**: Implement responsive navigation with proper state management

### Issue: Form submissions breaking
**Solution**: Update form handlers to use Next.js router instead of React Router

## Final Integration Steps

1. **Install Required Dependencies**:
   ```bash
   npm install next@latest react@latest react-dom@latest
   npm install @supabase/supabase-js framer-motion lucide-react
   npm install tailwindcss @tailwindcss/forms
   ```

2. **Update package.json scripts**:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
   }
   ```

3. **Configure Next.js** (`next.config.js`):
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       domains: ['your-supabase-domain.supabase.co'],
     },
     experimental: {
       appDir: true,
     },
   };

   module.exports = nextConfig;
   ```

4. **Test All Routes**:
   - Navigate through all pages
   - Test authentication flows
   - Verify dynamic routes
   - Check mobile responsiveness

5. **Deploy**:
   - Build the application: `npm run build`
   - Deploy to your preferred platform (Vercel, Netlify, etc.)

## Success Criteria

✅ All pages load without errors
✅ Navigation works seamlessly
✅ Authentication flows work correctly
✅ Dynamic routes function properly
✅ Mobile navigation is responsive
✅ Forms submit and redirect correctly
✅ External links open in new tabs
✅ SEO metadata is properly set
✅ No console errors or warnings

This comprehensive guide ensures that all converted pages work together seamlessly in the Next.js application while maintaining all original functionality and improving performance and SEO capabilities.
