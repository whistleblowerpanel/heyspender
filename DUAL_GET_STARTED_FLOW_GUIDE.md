# DUAL GET STARTED FLOW - IMPLEMENTATION GUIDE

## 🚨 CRITICAL: Two Separate Get Started Flows

This guide provides the **EXACT** specifications for implementing a dual "Get Started" flow system:
1. **Anonymous Flow**: Homepage → Get Started (unauthenticated) → Register → Dashboard
2. **Authenticated Flow**: Dashboard → Get Started (authenticated) → Dashboard

---

## 1. FLOW ARCHITECTURE OVERVIEW

### **1.1 Anonymous User Flow (New Users)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANONYMOUS USER FLOW                          │
│                                                                 │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌────────┐│
│  │ HOMEPAGE │ -> │ GET STARTED  │ -> │ REGISTER │ -> │DASHBOARD││
│  │          │    │ (Anonymous)  │    │   PAGE   │    │        ││
│  └──────────┘    └──────────────┘    └──────────┘    └────────┘│
│       │                  │                  │              │     │
│       │                  │                  │              │     │
│   Click "Get         Fill out          Create           Auto    │
│   Started"          wishlist          account       create      │
│   button            details            with          wishlist   │
│                     (8 steps)          data          from data  │
│                                                                 │
│  Data Storage: localStorage/sessionStorage during process      │
└─────────────────────────────────────────────────────────────────┘
```

### **1.2 Authenticated User Flow (Existing Users)**

```
┌─────────────────────────────────────────────────────────────────┐
│                 AUTHENTICATED USER FLOW                         │
│                                                                 │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐             │
│  │DASHBOARD │ -> │ GET STARTED  │ -> │DASHBOARD │             │
│  │          │    │(Authenticated)│    │ Updated  │             │
│  └──────────┘    └──────────────┘    └──────────┘             │
│       │                  │                  │                   │
│       │                  │                  │                   │
│   Click "Create      Fill out          Wishlist               │
│   Wishlist"         wishlist          created &               │
│   button            details           saved to DB              │
│                     (8 steps)                                  │
│                                                                 │
│  Data Storage: Direct to database after completion             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ROUTE STRUCTURE

### **2.1 Anonymous Get Started Routes**

```typescript
// EXACT route structure for anonymous users - NO MODIFICATIONS
const anonymousGetStartedRoutes = [
  '/get-started',              // Redirects to /get-started/welcome
  '/get-started/welcome',      // Step 0: Welcome
  '/get-started/title',        // Step 1: Title
  '/get-started/occasion',     // Step 2: Occasion
  '/get-started/date',         // Step 3: Date
  '/get-started/story',        // Step 4: Story
  '/get-started/cover',        // Step 5: Cover image
  '/get-started/privacy',      // Step 6: Privacy
  '/get-started/items'         // Step 7: Items & Goals
];

// After completing all steps, redirect to:
// /register?wishlist_data=<encoded_data>
```

### **2.2 Authenticated Get Started Routes**

```typescript
// EXACT route structure for authenticated users - NO MODIFICATIONS
const authenticatedGetStartedRoutes = [
  '/dashboard/get-started',              // Redirects to /dashboard/get-started/welcome
  '/dashboard/get-started/welcome',      // Step 0: Welcome
  '/dashboard/get-started/title',        // Step 1: Title
  '/dashboard/get-started/occasion',     // Step 2: Occasion
  '/dashboard/get-started/date',         // Step 3: Date
  '/dashboard/get-started/story',        // Step 4: Story
  '/dashboard/get-started/cover',        // Step 5: Cover image
  '/dashboard/get-started/privacy',      // Step 6: Privacy
  '/dashboard/get-started/items'         // Step 7: Items & Goals
];

// After completing all steps, redirect to:
// /dashboard (with wishlist created)
```

---

## 3. DATA STORAGE STRATEGY

### **3.1 Anonymous User Data Storage**

```typescript
// EXACT data storage for anonymous users - NO MODIFICATIONS
interface WishlistDraftData {
  title: string;
  occasion: string;
  event_date: string | null;
  story: string;
  cover_image_url: string;
  visibility: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    url?: string;
    image?: string;
  }>;
  cashGoals: Array<{
    title: string;
    targetAmount: number;
    deadline?: string;
    description?: string;
  }>;
  timestamp: number;
}

// Storage functions
const saveWishlistDraft = (data: WishlistDraftData) => {
  try {
    const draftData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem('wishlist_draft', JSON.stringify(draftData));
    console.log('✅ Wishlist draft saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving wishlist draft:', error);
    // Fallback to sessionStorage
    sessionStorage.setItem('wishlist_draft', JSON.stringify(draftData));
  }
};

const getWishlistDraft = (): WishlistDraftData | null => {
  try {
    const draft = localStorage.getItem('wishlist_draft') || sessionStorage.getItem('wishlist_draft');
    if (!draft) return null;
    
    const data = JSON.parse(draft);
    
    // Check if draft is older than 24 hours
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > twentyFourHours) {
      clearWishlistDraft();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error reading wishlist draft:', error);
    return null;
  }
};

const clearWishlistDraft = () => {
  localStorage.removeItem('wishlist_draft');
  sessionStorage.removeItem('wishlist_draft');
  console.log('🗑️ Wishlist draft cleared');
};
```

### **3.2 Authenticated User Data Storage**

```typescript
// EXACT data storage for authenticated users - NO MODIFICATIONS
// Direct database save after completion - no temporary storage needed
const saveAuthenticatedWishlist = async (userId: string, wishlistData: any) => {
  try {
    await wishlistService.createWishlist(userId, wishlistData, wishlistData.items, wishlistData.cashGoals);
    console.log('✅ Wishlist saved directly to database');
  } catch (error) {
    console.error('❌ Error saving wishlist:', error);
    throw error;
  }
};
```

---

## 4. HOMEPAGE "GET STARTED" BUTTON

### **4.1 Homepage Button Implementation**

```tsx
// EXACT homepage button - NO MODIFICATIONS
<Button
  onClick={() => {
    // Check if user is authenticated
    if (user) {
      // Authenticated user - go to authenticated flow
      navigate('/dashboard/get-started/welcome');
    } else {
      // Anonymous user - go to anonymous flow
      navigate('/get-started/welcome');
    }
  }}
  variant="custom"
  className="bg-brand-orange text-black text-lg px-8 py-6 border-2 border-black hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)]"
>
  Get Started
</Button>
```

### **4.2 Homepage Button with Analytics**

```tsx
// EXACT homepage button with tracking - NO MODIFICATIONS
<Button
  onClick={() => {
    // Track button click
    console.log('Get Started button clicked', { 
      authenticated: !!user,
      timestamp: new Date().toISOString() 
    });
    
    if (user) {
      navigate('/dashboard/get-started/welcome');
    } else {
      navigate('/get-started/welcome');
    }
  }}
  variant="custom"
  className="bg-brand-orange text-black text-lg px-8 py-6 border-2 border-black hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)]"
>
  Get Started - It's Free!
</Button>
```

---

## 5. ANONYMOUS GET STARTED COMPONENT

### **5.1 Component Structure**

```tsx
// EXACT anonymous get started component - NO MODIFICATIONS
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistSchema } from '@/lib/formValidation';

const AnonymousGetStartedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map route paths to step numbers
  const stepRoutes = ['welcome', 'title', 'occasion', 'date', 'story', 'cover', 'privacy', 'items'];
  const currentPath = location.pathname.split('/').pop();
  const currentStep = stepRoutes.indexOf(currentPath);
  
  // State management
  const [items, setItems] = useState([]);
  const [cashGoals, setCashGoals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      title: '',
      occasion: '',
      story: '',
      visibility: 'public',
      event_date: null,
      cover_image_url: ''
    }
  });

  // Load draft data on mount
  useEffect(() => {
    const draft = getWishlistDraft();
    if (draft) {
      setValue('title', draft.title);
      setValue('occasion', draft.occasion);
      setValue('story', draft.story);
      setValue('visibility', draft.visibility);
      setValue('event_date', draft.event_date ? new Date(draft.event_date) : null);
      setValue('cover_image_url', draft.cover_image_url);
      setItems(draft.items || []);
      setCashGoals(draft.cashGoals || []);
    }
  }, []);

  // Auto-save draft on form changes
  useEffect(() => {
    const subscription = watch((value) => {
      const draftData = {
        title: value.title || '',
        occasion: value.occasion || '',
        event_date: value.event_date ? value.event_date.toISOString() : null,
        story: value.story || '',
        cover_image_url: value.cover_image_url || '',
        visibility: value.visibility || 'public',
        items,
        cashGoals,
        timestamp: Date.now()
      };
      saveWishlistDraft(draftData);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, items, cashGoals]);

  const handleComplete = handleSubmit(async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare wishlist data
      const wishlistData = {
        title: data.title,
        occasion: getOccasionValue(data.occasion),
        wishlist_date: data.event_date ? new Date(data.event_date).toISOString() : null,
        story: data.story,
        cover_image_url: data.cover_image_url,
        visibility: data.visibility,
        items,
        cashGoals
      };

      // Save to localStorage for registration page
      saveWishlistDraft(wishlistData);

      // Encode data for URL (optional - can use localStorage instead)
      const encodedData = btoa(JSON.stringify({
        hasWishlistData: true,
        itemCount: items.length,
        goalCount: cashGoals.length
      }));

      // Navigate to registration with wishlist data indicator
      navigate(`/register?wishlist_data=${encodedData}`);
      
    } catch (error) {
      console.error('Error preparing wishlist data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to save your wishlist data. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Render same step content as authenticated version
  return (
    <div className="min-h-screen bg-white">
      {/* Same UI as authenticated version */}
      {/* ... */}
      
      {/* Final button shows "Continue to Register" instead of "Create" */}
      {currentStep === steps.length - 1 && (
        <button
          type="button"
          onClick={handleComplete}
          disabled={isSubmitting}
          className="bg-brand-green border-2 border-black px-8 py-3 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)]"
        >
          <span className="text-black font-bold text-lg">
            {isSubmitting ? 'Saving...' : 'Continue to Register'}
          </span>
        </button>
      )}
    </div>
  );
};

export default AnonymousGetStartedPage;
```

---

## 6. REGISTRATION PAGE INTEGRATION

### **6.1 Enhanced Registration Page**

```tsx
// EXACT registration page with wishlist data - NO MODIFICATIONS
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUpWithEmailPassword } = useAuth();
  
  const [hasWishlistData, setHasWishlistData] = useState(false);
  const [wishlistPreview, setWishlistPreview] = useState(null);
  
  // Check for wishlist data on mount
  useEffect(() => {
    const wishlistData = searchParams.get('wishlist_data');
    if (wishlistData) {
      try {
        const decodedData = JSON.parse(atob(wishlistData));
        setHasWishlistData(true);
        setWishlistPreview(decodedData);
      } catch (error) {
        console.error('Error decoding wishlist data:', error);
      }
    }
    
    // Also check localStorage
    const draft = getWishlistDraft();
    if (draft) {
      setHasWishlistData(true);
      setWishlistPreview({
        itemCount: draft.items?.length || 0,
        goalCount: draft.cashGoals?.length || 0
      });
    }
  }, [searchParams]);

  const handleSignUp = async (formData) => {
    try {
      // Create user account
      const { data, error } = await signUpWithEmailPassword({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name,
            role: 'user',
          },
          emailRedirectTo: 'https://heyspender.com/auth/confirm'
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user record in database
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username: formData.username,
            full_name: formData.full_name,
            email: formData.email,
            role: 'user',
            is_admin: false,
            is_active: true,
            email_verified_at: null
          });

        if (userError) console.error('Error creating user record:', userError);

        // If there's wishlist data, create the wishlist
        if (hasWishlistData) {
          const draft = getWishlistDraft();
          if (draft) {
            try {
              await wishlistService.createWishlist(
                data.user.id,
                {
                  title: draft.title,
                  occasion: draft.occasion,
                  wishlist_date: draft.event_date,
                  story: draft.story,
                  cover_image_url: draft.cover_image_url,
                  visibility: draft.visibility
                },
                draft.items || [],
                draft.cashGoals || []
              );
              
              // Clear draft after successful creation
              clearWishlistDraft();
              
              // Show success with confetti
              triggerConfetti(12000);
              
              toast({
                title: 'Account created & Wishlist saved!',
                description: 'Your account and wishlist have been created successfully.'
              });
            } catch (wishlistError) {
              console.error('Error creating wishlist:', wishlistError);
              // Still proceed to verification even if wishlist creation fails
              toast({
                title: 'Account created!',
                description: 'Your account was created, but there was an issue with your wishlist. You can create it from your dashboard.'
              });
            }
          }
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome to HeySpender! Please verify your email.'
          });
        }

        // Navigate to verification or dashboard
        navigate('/verify');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-purple-dark">Create Account</h1>
            <p className="text-gray-600">Join HeySpender today!</p>
            
            {/* Show wishlist preview if available */}
            {hasWishlistData && wishlistPreview && (
              <div className="mt-4 p-3 bg-brand-green/20 border-2 border-brand-green rounded">
                <p className="text-sm font-medium text-black">
                  🎉 Your wishlist is ready! Complete registration to save it.
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {wishlistPreview.itemCount} items, {wishlistPreview.goalCount} cash goals
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Registration form fields */}
            {/* ... */}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
```

---

## 7. ROUTING CONFIGURATION

### **7.1 App Routes Setup**

```tsx
// EXACT routing configuration - NO MODIFICATIONS
// In App.jsx or routing configuration

// Anonymous Get Started Routes (No authentication required)
<Route path="/get-started">
  <Route index element={<Navigate to="/get-started/welcome" replace />} />
  <Route path="welcome" element={<AnonymousGetStartedPage />} />
  <Route path="title" element={<AnonymousGetStartedPage />} />
  <Route path="occasion" element={<AnonymousGetStartedPage />} />
  <Route path="date" element={<AnonymousGetStartedPage />} />
  <Route path="story" element={<AnonymousGetStartedPage />} />
  <Route path="cover" element={<AnonymousGetStartedPage />} />
  <Route path="privacy" element={<AnonymousGetStartedPage />} />
  <Route path="items" element={<AnonymousGetStartedPage />} />
</Route>

// Authenticated Get Started Routes (Requires authentication)
<Route path="/dashboard/get-started">
  <Route index element={<Navigate to="/dashboard/get-started/welcome" replace />} />
  <Route path="welcome" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="title" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="occasion" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="date" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="story" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="cover" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="privacy" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
  <Route path="items" element={<ProtectedRoute><AuthenticatedGetStartedPage /></ProtectedRoute>} />
</Route>
```

---

## 8. UI/UX DIFFERENCES

### **8.1 Anonymous Flow UI Differences**

```tsx
// EXACT UI differences for anonymous flow - NO MODIFICATIONS

// 1. Final Step Button Text
// Anonymous: "Continue to Register"
// Authenticated: "Create"

// 2. Header Text
// Anonymous: "Let's create your wishlist" (no user mention)
// Authenticated: "Create your wishlist" (can show user name)

// 3. Close Button Behavior
// Anonymous: Navigate to homepage "/"
// Authenticated: Navigate to dashboard "/dashboard"

// 4. Progress Indicator
// Anonymous: "Step X of 8 - Then create your account"
// Authenticated: "Step X of 8"

// 5. Success Message
// Anonymous: Saved to temporary storage + redirect to register
// Authenticated: Saved to database + confetti + redirect to dashboard
```

### **8.2 Visual Indicators**

```tsx
// EXACT visual indicators - NO MODIFICATIONS

// Anonymous flow - Show banner
{!user && (
  <div className="bg-brand-orange/10 border-b-2 border-brand-orange p-3 text-center">
    <p className="text-sm font-medium text-black">
      📝 Creating your wishlist • You'll create an account in the next step
    </p>
  </div>
)}

// Authenticated flow - Show user greeting
{user && (
  <div className="bg-brand-green/10 border-b-2 border-brand-green p-3 text-center">
    <p className="text-sm font-medium text-black">
      👋 Hi {user.user_metadata?.full_name}! Let's create your wishlist
    </p>
  </div>
)}
```

---

## 9. ERROR HANDLING & EDGE CASES

### **9.1 Draft Expiration**

```typescript
// EXACT draft expiration handling - NO MODIFICATIONS

// Check draft age before using
const isValidDraft = (draft: WishlistDraftData): boolean => {
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (Date.now() - draft.timestamp > twentyFourHours) {
    console.log('⏰ Draft expired (older than 24 hours)');
    clearWishlistDraft();
    return false;
  }
  return true;
};

// Show expiration warning
{draftExpired && (
  <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded mb-4">
    <p className="text-sm text-yellow-800">
      ⚠️ Your previous wishlist draft has expired. Starting fresh!
    </p>
  </div>
)}
```

### **9.2 User Already Authenticated**

```typescript
// EXACT authenticated user redirect - NO MODIFICATIONS

// In AnonymousGetStartedPage
useEffect(() => {
  if (user) {
    // User is authenticated, redirect to authenticated flow
    toast({
      title: 'Redirecting...',
      description: 'You\'re already logged in. Taking you to the dashboard flow.'
    });
    navigate('/dashboard/get-started/welcome', { replace: true });
  }
}, [user, navigate]);
```

### **9.3 Registration Failure with Wishlist Data**

```typescript
// EXACT registration failure handling - NO MODIFICATIONS

// If registration fails, preserve wishlist data
if (registrationError) {
  // Don't clear wishlist draft
  toast({
    variant: 'destructive',
    title: 'Registration failed',
    description: 'Your wishlist data is still saved. Please try again.'
  });
  
  // Keep draft in storage for retry
  console.log('💾 Wishlist draft preserved for retry');
}
```

---

## 10. ANALYTICS & TRACKING

### **10.1 Track User Journey**

```typescript
// EXACT analytics tracking - NO MODIFICATIONS

// Track anonymous get started start
const trackAnonymousGetStartedStart = () => {
  console.log('📊 Analytics: Anonymous Get Started - Started', {
    timestamp: new Date().toISOString(),
    source: 'homepage',
    flow: 'anonymous'
  });
};

// Track anonymous get started completion
const trackAnonymousGetStartedComplete = (data: any) => {
  console.log('📊 Analytics: Anonymous Get Started - Completed', {
    timestamp: new Date().toISOString(),
    itemCount: data.items?.length || 0,
    goalCount: data.cashGoals?.length || 0,
    hasImage: !!data.cover_image_url,
    flow: 'anonymous'
  });
};

// Track registration with wishlist
const trackRegistrationWithWishlist = () => {
  console.log('📊 Analytics: Registration - With Wishlist Data', {
    timestamp: new Date().toISOString(),
    source: 'get_started_flow'
  });
};
```

---

## 11. TESTING CHECKLIST

### **11.1 Anonymous Flow Testing**

- [ ] Homepage "Get Started" button navigates to `/get-started/welcome` when not logged in
- [ ] All 8 steps are accessible without authentication
- [ ] Form data is saved to localStorage/sessionStorage
- [ ] Draft data persists across page refreshes
- [ ] Draft data expires after 24 hours
- [ ] Final button shows "Continue to Register"
- [ ] Clicking "Continue to Register" navigates to `/register?wishlist_data=...`
- [ ] Registration page detects wishlist data
- [ ] Wishlist preview shows in registration page
- [ ] After registration, wishlist is created in database
- [ ] Draft is cleared after successful registration
- [ ] Confetti animation triggers on success
- [ ] User is redirected to verification/dashboard

### **11.2 Authenticated Flow Testing**

- [ ] Homepage "Get Started" button navigates to `/dashboard/get-started/welcome` when logged in
- [ ] All 8 steps require authentication
- [ ] Non-authenticated users are redirected to login
- [ ] Form data is NOT saved to localStorage
- [ ] Final button shows "Create"
- [ ] Clicking "Create" saves wishlist to database immediately
- [ ] Confetti animation triggers on success
- [ ] User is redirected to dashboard
- [ ] Wishlist appears in user's dashboard

### **11.3 Edge Case Testing**

- [ ] User starts anonymous flow, then logs in mid-process (should redirect to auth flow)
- [ ] User abandons anonymous flow, draft is preserved for 24 hours
- [ ] User returns after draft expiration, starts fresh
- [ ] Registration fails, wishlist data is preserved
- [ ] User completes anonymous flow but doesn't register, can return later
- [ ] Multiple wishlist drafts don't conflict

---

## 🚨 CRITICAL IMPLEMENTATION REQUIREMENTS

### **ABSOLUTE REQUIREMENTS:**

1. **TWO SEPARATE COMPONENTS**: Create `AnonymousGetStartedPage` and `AuthenticatedGetStartedPage`
2. **DIFFERENT ROUTES**: `/get-started/*` for anonymous, `/dashboard/get-started/*` for authenticated
3. **DIFFERENT FINAL ACTIONS**: Register redirect vs. Database save
4. **DATA PERSISTENCE**: localStorage for anonymous, direct DB for authenticated
5. **DRAFT CLEANUP**: Clear draft after successful registration
6. **USER FEEDBACK**: Show wishlist preview in registration page
7. **ERROR HANDLING**: Preserve data on registration failure
8. **EXPIRATION**: 24-hour draft expiration

### **FORBIDDEN MODIFICATIONS:**

- ❌ NO single component for both flows
- ❌ NO mixing of anonymous and authenticated data storage
- ❌ NO clearing draft before registration succeeds
- ❌ NO silent failures (always show user feedback)
- ❌ NO permanent draft storage (implement expiration)

### **MANDATORY IMPLEMENTATION:**

- ✅ Separate routing for anonymous and authenticated flows
- ✅ localStorage/sessionStorage for anonymous draft data
- ✅ 24-hour draft expiration mechanism
- ✅ Wishlist preview in registration page
- ✅ Automatic wishlist creation after registration
- ✅ Draft cleanup after successful registration
- ✅ Proper error handling with data preservation
- ✅ User feedback at every step

**IMPLEMENT EXACTLY AS SPECIFIED. This dual-flow system provides the best onboarding experience by allowing users to create wishlists before committing to registration!** 🎉
