# Wishlist Details, Item Detail, and Profile Pages Implementation Guide

## Overview
This guide provides comprehensive instructions for implementing and maintaining the three most critical user-facing pages in the HeySpender Next.js application: **Wishlist Details Page**, **Item Detail Page**, and **Profile Page**. These pages handle the core user experience of viewing, interacting with, and supporting wishlists.

## ⚠️ **CRITICAL DESIGN REQUIREMENTS**

### **NO BORDER RADIUS WHATSOEVER**
- **ALL elements must have `rounded-none` or NO `rounded-*` classes**
- **Cards, buttons, inputs, modals - EVERYTHING must be sharp corners**
- **This is a core brand requirement - NO EXCEPTIONS**

### **EXACT Design Specifications**
- **Border styling**: `border-2 border-black` for all cards and containers
- **Shadow styling**: `shadow-[-4px_4px_0px_#161B47]` for buttons and cards
- **Color scheme**: Brand purple dark, brand green, brand orange, brand salmon
- **Typography**: Bold headings, clean sans-serif fonts
- **Spacing**: Consistent padding and margins throughout

---

## 1. WISHLIST DETAILS PAGE (`/[username]/[slug]/page.tsx`)

### **Current Implementation Status**
✅ **Already implemented** in Next.js with most features working
❌ **Missing critical features** from original React version
❌ **Design inconsistencies** need to be fixed

### **Key Features That Must Be Implemented**

#### **1.1 Hero Section**
```tsx
<header className="relative h-[500px] bg-brand-purple-dark flex items-center justify-center text-center p-4 pt-28 overflow-hidden">
  {wishlist.cover_image_url && (
    <img 
      alt={wishlist.title} 
      className="absolute top-0 left-0 w-full h-full object-cover opacity-20" 
      src={wishlist.cover_image_url} 
    />
  )}
  <div className="relative z-10 space-y-4">
    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
      {wishlist.title}
    </h1>
    <p className="text-lg text-white/90 drop-shadow-md">
      A wishlist by <Link href={`/${wishlist.user.username}`} className="font-bold hover:underline">
        {wishlist.user.full_name}
      </Link> for their {wishlist.occasion}
    </p>
    {wishlist.wishlist_date && <Countdown date={wishlist.wishlist_date} />}
  </div>
</header>
```

#### **1.2 Share Functionality**
```tsx
<div className="flex justify-center mb-8">
  <div className="flex items-center gap-2">
    <Button 
      variant="custom" 
      className="bg-white text-black h-10 px-3 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
      onClick={copyLink}
    >
      <Copy className="w-4 h-4 mr-2"/>Copy Link
    </Button>
    <Button 
      variant="custom" 
      className="bg-white text-black h-10 w-10 p-0 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
      onClick={generateQrCode}
    >
      <QrCodeIcon className="h-4 w-4" />
    </Button>
    <Button 
      variant="custom" 
      className="bg-white text-black h-10 w-10 p-0 border-2 border-black shadow-[-4px_4px_0px_#161B47]" 
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  </div>
</div>
```

#### **1.3 Cash Goals Section**
```tsx
{goals.length > 0 && (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-brand-purple-dark mb-6">Cash Goals</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {goals.map((goal, index) => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          index={index} 
          recipientEmail={wishlist.user.email} 
          onContributed={fetchWishlistData} 
        />
      ))}
    </div>
  </section>
)}
```

#### **1.4 Items Grid/List View**
```tsx
<section className="mb-12">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-brand-purple-dark">Wishlist Items</h2>
    <div className="flex items-center gap-2">
      <Button 
        variant={viewMode === 'grid' ? 'custom' : 'outline'} 
        className={`h-9 w-9 p-0 border-2 border-black ${
          viewMode === 'grid' 
            ? 'bg-brand-purple-dark text-white shadow-[-4px_4px_0px_#161B47]' 
            : 'border-gray-300'
        }`}
        onClick={() => setViewMode('grid')}
      >
        <GridIcon className="w-4 h-4" />
      </Button>
      <Button 
        variant={viewMode === 'list' ? 'custom' : 'outline'} 
        className={`h-9 w-9 p-0 border-2 border-black ${
          viewMode === 'list' 
            ? 'bg-brand-purple-dark text-white shadow-[-4px_4px_0px_#161B47]' 
            : 'border-gray-300'
        }`}
        onClick={() => setViewMode('list')}
      >
        <ListIcon className="w-4 h-4" />
      </Button>
    </div>
  </div>
  
  <div className={viewMode === 'grid' 
    ? 'space-y-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0' 
    : 'space-y-4'
  }>
    {currentItems.map(item => (
      <ItemCard 
        key={item.id} 
        item={item} 
        onClaimed={fetchWishlistData} 
        username={username} 
        slug={slug} 
        viewMode={viewMode} 
      />
    ))}
  </div>
</section>
```

#### **1.5 Missing Critical Features to Implement**

**A. Confetti Celebration System**
```tsx
// Add to imports
import Confetti from '@/components/Confetti';
import { useConfetti } from '@/contexts/ConfettiContext';

// Add to component
const { triggerConfetti } = useConfetti();
const [showConfetti, setShowConfetti] = useState(false);

// Celebration logic
const celebrate = useMemo(() => {
  if (goals.length === 0 && items.length === 0) return false;
  
  const allGoalsReached = goals.length === 0 || goals.every(goal => 
    (goal.amount_raised || 0) >= goal.target_amount
  );
  
  const allItemsPaidAndNotClaimed = items.length === 0 || items.every(item => {
    const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
    if (!item.unit_price_estimate || totalAmountNeeded === 0) return false;
    
    const totalAmountPaid = (item.claims || []).reduce((sum, claim) => {
      return sum + (claim.amount_paid || 0);
    }, 0);
    
    const isPaidFor = totalAmountPaid >= totalAmountNeeded;
    const isNotClaimed = (item.qty_claimed || 0) === 0;
    
    return isPaidFor && isNotClaimed;
  });
  
  return allGoalsReached && allItemsPaidAndNotClaimed;
}, [items, goals]);

// Trigger confetti
useEffect(() => {
  if (celebrate && !loading) {
    triggerConfetti(15000);
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }
}, [celebrate, loading, triggerConfetti]);
```

**B. Real-time Subscriptions**
```tsx
// Add real-time updates for wishlist items
useEffect(() => {
  if (!wishlist?.id) return;

  const subscription = supabase
    .channel(`wishlist-${wishlist.id}-changes`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'wishlist_items',
        filter: `wishlist_id=eq.${wishlist.id}`
      }, 
      (payload) => {
        fetchWishlistData();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [wishlist?.id, fetchWishlistData]);
```

**C. View Tracking**
```tsx
// Track views when wishlist is loaded
useEffect(() => {
  const trackView = async () => {
    if (!wishlist?.id) return;
    
    const sessionKey = `viewed_wishlist_${wishlist.id}`;
    const hasViewed = sessionStorage.getItem(sessionKey);
    
    if (hasViewed) return;
    
    try {
      await supabase
        .from('wishlists')
        .update({ 
          views_count: (wishlist.views_count || 0) + 1 
        })
        .eq('id', wishlist.id);
      
      sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };
  
  trackView();
}, [wishlist?.id, wishlist?.views_count]);
```

**D. SEO Meta Tags**
```tsx
// Add to component
useEffect(() => {
  if (wishlist) {
    const wishlistUrl = `/${username}/${slug}`;
    const customSEO = {
      title: `${wishlist.title} — HeySpender`,
      description: wishlist.story || `Check out ${wishlist.user?.full_name || 'this user'}'s wishlist for their ${wishlist.occasion || 'special occasion'}!`,
      image: wishlist.cover_image_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'
    };
    updatePageSocialMedia(wishlistUrl, customSEO);
  }
}, [wishlist, username, slug]);
```

---

## 2. ITEM DETAIL PAGE (`/[username]/[slug]/[itemId]/page.tsx`)

### **Current Implementation Status**
✅ **Basic structure implemented**
❌ **Missing critical payment functionality**
❌ **Missing complex modal systems**
❌ **Missing Paystack integration**

### **Key Features That Must Be Implemented**

#### **2.1 Main Item Display**
```tsx
<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }}
  className="bg-white border-2 border-black overflow-hidden mb-6"
>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-5 md:p-6">
    {/* Left Side - Product Image */}
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-sm lg:max-w-md aspect-square bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img 
            alt={item.name} 
            src={item.image_url} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        )}
      </div>
      
      {isFullyClaimed && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-brand-green font-semibold text-sm sm:text-base">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Fully Claimed!
        </div>
      )}
    </div>

    {/* Right Side - Product Details */}
    <div className="flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          {item.name}
        </h1>
        
        <div className="space-y-2 sm:space-y-3">
          <div className="text-sm sm:text-base">
            Desired: <span className="font-bold">{item.qty_total}</span> — 
            Purchased: <span className="font-bold">{item.qty_claimed || 0}</span>
          </div>
          
          {item.unit_price_estimate && (
            <div className="text-xl sm:text-2xl font-bold text-brand-purple-dark">
              ₦{Number(item.unit_price_estimate).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        {item.product_url && (
          <Button 
            onClick={handleBuyViaLink}
            variant="custom"
            className="w-full bg-brand-green text-black hover:bg-brand-green/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Buy This Item Via Link
          </Button>
        )}
        
        <Button 
          onClick={handleSendCash}
          disabled={isFullyClaimed || actionLoading}
          variant="custom"
          className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple-dark/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 disabled:bg-gray-300 disabled:text-gray-500"
        >
          {actionLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Send the Cash
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleBoughtAlready}
          disabled={actionLoading}
          variant="custom"
          className="w-full bg-brand-orange text-black hover:bg-brand-orange/90 text-sm py-3 h-auto border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 disabled:bg-gray-300 disabled:text-gray-500"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          I Bought this Item Already
        </Button>
        
        {isFullyClaimed && (
          <p className="text-xs sm:text-sm text-brand-green text-center flex items-center justify-center gap-2 flex-wrap pt-2">
            <CheckCircle className="w-4 h-4" />
            <span>Target reached! Extra contributions welcome 🎉</span>
          </p>
        )}
      </div>
    </div>
  </div>
</motion.div>
```

#### **2.2 Critical Missing Features to Implement**

**A. Complete Modal System**
```tsx
// Buy Modal for non-logged-in users
<Dialog open={buyModalOpen} onOpenChange={setBuyModalOpen}>
  <DialogContent className="max-w-[95vw] sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-base sm:text-lg md:text-xl font-bold pr-6">
        Before you buy this item at {getProductDomain()}
      </DialogTitle>
      <DialogDescription className="text-xs sm:text-sm text-gray-600">
        Create a light account to reserve this item. A verification link will be sent to your email.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleBuyModalSubmit}>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address*</Label>
          <Input 
            id="email" 
            type="email" 
            value={buyFormData.email} 
            onChange={handleBuyModalInputChange} 
            className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
          />
        </div>

        <div>
          <Label htmlFor="username" className="text-xs sm:text-sm font-medium">Username*</Label>
          <Input 
            id="username" 
            type="text" 
            value={buyFormData.username} 
            onChange={handleBuyModalInputChange}
            className="mt-1 text-sm sm:text-base h-10 sm:h-11 border-2 border-black" 
            maxLength={15}
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Create a Password*</Label>
          <div className="relative mt-1">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              value={buyFormData.password} 
              onChange={handleBuyModalInputChange}
              className="text-sm sm:text-base pr-10 h-10 sm:h-11 border-2 border-black"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4 sm:mt-6">
        <Button 
          type="submit" 
          disabled={buyModalLoading}
          className="w-full bg-brand-green text-black hover:bg-brand-green/90 text-sm font-semibold h-11 border-2 border-black shadow-[-3px_3px_0px_#161B47] sm:shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
        >
          {buyModalLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Submit & Continue'
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

**B. Paystack Payment Integration**
```tsx
// Add to imports
import { getUserFriendlyError } from '@/lib/utils';
import { ReminderService } from '@/lib/reminderService';

// Payment processing function
const handleCashWithoutAccount = async () => {
  setCashModalOpen(false);
  setPaymentProcessing(true);

  try {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    
    if (!publicKey) {
      toast({ 
        variant: 'destructive', 
        title: 'Configuration Error', 
        description: 'Payment system is not configured. Please contact support.' 
      });
      setPaymentProcessing(false);
      return;
    }

    const reference = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Load Paystack script
    const loadPaystackScript = () => {
      return new Promise((resolve, reject) => {
        if (window.PaystackPop) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    await loadPaystackScript();

    const itemPrice = item?.unit_price_estimate || item?.price || 0;
    const amountInKobo = Math.round(itemPrice * 100);

    if (amountInKobo <= 0) {
      toast({ 
        variant: 'destructive', 
        title: 'Invalid Amount', 
        description: 'Item price is not set. Please contact the wishlist owner.' 
      });
      setPaymentProcessing(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: 'guest@heyspender.com',
      amount: amountInKobo,
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: 'Item',
            variable_name: 'item_name',
            value: item?.name || 'Wishlist Item'
          },
          {
            display_name: 'Wishlist Owner',
            variable_name: 'wishlist_owner',
            value: wishlist?.user?.username || username
          },
          {
            display_name: 'Item ID',
            variable_name: 'item_id',
            value: item?.id
          }
        ]
      },
      onClose: () => {
        setPaymentProcessing(false);
        toast({ 
          title: 'Payment Cancelled', 
          description: 'You closed the payment window.' 
        });
      },
      callback: (response) => {
        console.log('Payment successful:', response);
        toast({ 
          title: 'Payment Successful!', 
          description: `Thank you for contributing ₦${(amountInKobo / 100).toLocaleString()} to ${item?.name}!` 
        });
        setPaymentProcessing(false);
      }
    });

    handler.openIframe();
  } catch (error) {
    console.error('Error initializing payment:', error);
    toast({ 
      variant: 'destructive', 
      title: 'Payment Error', 
      description: 'Failed to initialize payment. Please try again.' 
    });
    setPaymentProcessing(false);
  }
};
```

**C. Reminder Service Integration**
```tsx
// Add to handleLoggedInBoughtSubmit and processSendCash
try {
  await ReminderService.createAutomaticReminder({
    claimId: claimData.id,
    spenderEmail: user.email,
    spenderUsername: user.user_metadata?.username || user.email?.split('@')[0],
    itemName: item.name,
    itemPrice: item.unit_price_estimate || 0,
    quantity: loggedInBoughtQuantity
  });
  console.log('✅ Automatic reminder created for claim:', claimData.id);
} catch (reminderError) {
  console.error('❌ Error creating automatic reminder:', reminderError);
}
```

---

## 3. PROFILE PAGE (`/[username]/page.tsx`)

### **Current Implementation Status**
✅ **Basic structure implemented**
❌ **Missing SEO meta tags**
❌ **Missing proper error handling**
❌ **Missing owner-specific features**

### **Key Features That Must Be Implemented**

#### **3.1 Hero Section**
```tsx
<header className="relative h-[500px] bg-brand-purple-dark flex items-end justify-center text-center p-4 pt-28">
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
  <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ 
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
  }} />
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative z-10 flex flex-col items-center text-center space-y-4 mb-8 text-white"
  >
    <div className="w-28 h-28 flex items-center justify-center border-4 border-black bg-brand-green">
      <User className="w-16 h-16 text-black" strokeWidth={2.5} />
    </div>
    <h1 className="text-4xl font-bold drop-shadow-lg">{profile.full_name}</h1>
    <p className="text-white/80 drop-shadow-md">@{profile.username}</p>
  </motion.div>
</header>
```

#### **3.2 Wishlists Grid**
```tsx
<main className="max-w-5xl mx-auto px-4 py-8">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold text-brand-purple-dark">Wishlists</h2>
    {isOwner && (
      <Button 
        onClick={() => router.push('/dashboard')} 
        variant="custom" 
        className="bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Manage Wishlists
      </Button>
    )}
  </div>

  {wishlists.length === 0 ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-8 border-2 border-dashed border-gray-300"
    >
      <Gift className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        {isOwner ? "You have no wishlists yet" : `${profile.full_name} has no public wishlists`}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {isOwner ? "Go to your dashboard to create one!" : "Check back later!"}
      </p>
    </motion.div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlists.map((wishlist: any) => (
        <Link href={`/${profile.username}/${wishlist.slug}`} key={wishlist.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-black p-4 flex flex-col space-y-4 h-full bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="relative aspect-square bg-gray-100 mb-2 h-[250px]">
              {wishlist.cover_image_url ? (
                <img 
                  alt={wishlist.title} 
                  src={wishlist.cover_image_url} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold truncate">{wishlist.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{wishlist.occasion}</p>
              {wishlist.wishlist_date && (
                <p className="text-sm text-gray-500">
                  {format(new Date(wishlist.wishlist_date), 'PPP')}
                </p>
              )}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )}
</main>
```

#### **3.3 Missing Features to Implement**

**A. SEO Meta Tags**
```tsx
// Add to component
useEffect(() => {
  if (profile) {
    const profileUrl = `/${username}`;
    const customSEO = {
      title: `${profile.full_name || profile.username} — HeySpender`,
      description: `View ${profile.full_name || profile.username}'s wishlists and support their dreams on HeySpender.`,
      image: profile.avatar_url || 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp'
    };
    updatePageSocialMedia(profileUrl, customSEO);
  }
}, [profile, username]);
```

**B. Proper Error Handling**
```tsx
// Add toast notifications
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

// In fetchProfileData
if (profileError || !profileData) {
  toast({ variant: 'destructive', title: 'Profile not found' });
  router.push('/');
  return;
}

if (wishlistError) {
  toast({ variant: 'destructive', title: 'Error fetching wishlists', description: wishlistError.message });
}
```

---

## 4. CRITICAL COMPONENTS TO IMPLEMENT

### **4.1 GoalCard Component**
```tsx
const GoalCard = ({ goal, index, recipientEmail, onContributed }) => {
  const progress = goal.target_amount > 0 ? Math.round(((goal.amount_raised || 0) / goal.target_amount) * 100) : 0;
  const successfulContributions = goal.contributions?.filter(c => c.status === 'success') || [];

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-brand-green';
    if (percentage >= 75) return 'bg-brand-orange';
    if (percentage >= 50) return 'bg-brand-salmon';
    if (percentage >= 25) return 'bg-brand-accent-red';
    return 'bg-brand-purple-light';
  };

  const progressColor = getProgressBarColor(progress);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="border-2 border-black p-6 bg-white flex flex-col h-full"
    >
      <h3 className="text-2xl font-bold text-brand-purple-dark mb-4 min-h-[4rem] line-clamp-2">
        {goal.title}
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold">Raised: ₦{Number(goal.amount_raised || 0).toLocaleString()}</span>
          <span className="font-semibold">Target: ₦{Number(goal.target_amount).toLocaleString()}</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden border-2 border-black bg-gray-200">
          <div 
            className={`h-full transition-all ${progressColor}`} 
            style={{
              width: `${progress}%`, 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px)'
            }}
          ></div>
        </div>
        <div className="text-left text-xs mt-1 text-gray-600">
          <span>{progress}% Complete</span>
        </div>
      </div>

      <div className="mb-4">
        <ContributeModal 
          goal={goal} 
          recipientEmail={recipientEmail} 
          onContributed={onContributed} 
          trigger={
            <Button 
              variant="custom" 
              className="w-full bg-brand-green text-black text-sm h-10 px-4 py-2 border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
            >
              Contribute to this Goal
            </Button>
          } 
        />
      </div>

      {successfulContributions.length > 0 && (
        <div className="mt-auto">
          <h4 className="font-semibold mb-2">Recent Spenders:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {successfulContributions.map(c => (
              <div key={c.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{c.is_anonymous ? 'Anonymous Spender' : c.display_name} contributed ₦{Number(c.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
```

### **4.2 ItemCard Component**
```tsx
const ItemCard = ({ item, onClaimed, username, slug, viewMode }) => {
  const isFullyClaimed = (item.qty_claimed || 0) >= item.qty_total;
  const router = useRouter();

  const getPaidStatus = () => {
    if (!item.claims || item.claims.length === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const totalAmountNeeded = (item.unit_price_estimate || 0) * (item.qty_total || 1);
    
    if (!item.unit_price_estimate || totalAmountNeeded === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const totalAmountPaid = item.claims.reduce((sum, claim) => {
      return sum + (claim.amount_paid || 0);
    }, 0);
    
    const isFullyPaid = totalAmountPaid >= totalAmountNeeded;
    
    if (!isFullyPaid) {
      return { isPaid: false, spenders: [] };
    }
    
    const paidClaims = item.claims.filter(claim => 
      claim.amount_paid > 0 && claim.supporter_user?.username
    );
    
    if (paidClaims.length === 0) {
      return { isPaid: false, spenders: [] };
    }
    
    const spenderUsernames = [...new Set(paidClaims.map(c => c.supporter_user.username))];
    
    return { 
      isPaid: true, 
      spenders: spenderUsernames,
      count: spenderUsernames.length
    };
  };

  const paidStatus = getPaidStatus();

  const handleClaimClick = () => {
    if (!isFullyClaimed) {
      router.push(`/${username}/${slug}/${item.id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`bg-white overflow-hidden ${viewMode === 'grid' ? 'border-2 border-black' : ''}`}
    >
      {viewMode === 'grid' ? (
        <div className="flex flex-col h-full">
          <div className="relative h-48 bg-gray-100">
            <ImagePreviewModal item={item} trigger={
              <button className="w-full h-full">
                {item.image_url ? 
                  <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-12 h-12"/></div>
                }
              </button>
            } />
          </div>

          <div className="p-4 flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
              {item.name}
            </h3>
            
            <div className="text-sm font-semibold text-gray-900 mb-3 flex-shrink-0">
              {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
            </div>
            
            <Button 
              variant="custom" 
              className="bg-brand-green text-black disabled:bg-gray-300 w-full text-sm h-10 px-4 py-2 truncate border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90" 
              disabled={isFullyClaimed} 
              onClick={handleClaimClick}
            >
              {isFullyClaimed ? 
                (paidStatus.isPaid ? 
                  (paidStatus.count === 1 ? 
                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                  ) : 
                  'Claimed This!'
                ) : 
                'Odogwu, Pay for This.'
              }
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative w-[116px] h-[116px] bg-gray-100 flex-shrink-0">
            <ImagePreviewModal item={item} trigger={
              <button className="w-full h-full">
                {item.image_url ? 
                  <img alt={item.name} src={item.image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>
                }
              </button>
            } />
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
              {item.name}
            </h3>
            
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {item.unit_price_estimate ? `₦${Number(item.unit_price_estimate).toLocaleString()}` : 'Price TBD'} — <span className="text-gray-500 font-normal">{item.qty_claimed || 0}/{item.qty_total} claimed</span>
            </div>
            
            <Button 
              variant="custom" 
              className="bg-brand-green text-black disabled:bg-gray-300 w-full text-xs py-2 h-auto truncate border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90" 
              disabled={isFullyClaimed} 
              onClick={handleClaimClick}
            >
              {isFullyClaimed ? 
                (paidStatus.isPaid ? 
                  (paidStatus.count === 1 ? 
                    <><strong>@{paidStatus.spenders[0]}</strong>&nbsp;Paid For This!</> :
                    <><strong>{paidStatus.count} Spenders</strong>&nbsp;Paid For This!</>
                  ) : 
                  'Claimed This!'
                ) : 
                'Odogwu, Pay for This.'
              }
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
```

---

## 5. IMPLEMENTATION CHECKLIST

### **5.1 Wishlist Details Page**
- [ ] ✅ Hero section with cover image and countdown
- [ ] ✅ Share functionality (copy link, QR code, native share)
- [ ] ❌ **MISSING**: Confetti celebration system
- [ ] ❌ **MISSING**: Real-time subscriptions
- [ ] ❌ **MISSING**: View tracking
- [ ] ❌ **MISSING**: SEO meta tags
- [ ] ❌ **MISSING**: Complete GoalCard component with contribution modal
- [ ] ❌ **MISSING**: Complete ItemCard component with payment status
- [ ] ❌ **MISSING**: Pagination system
- [ ] ❌ **MISSING**: Responsive view mode switching

### **5.2 Item Detail Page**
- [ ] ✅ Basic item display
- [ ] ✅ Back navigation
- [ ] ❌ **MISSING**: Complete modal system (buy, cash, bought)
- [ ] ❌ **MISSING**: Paystack payment integration
- [ ] ❌ **MISSING**: Reminder service integration
- [ ] ❌ **MISSING**: Form validation with Zod
- [ ] ❌ **MISSING**: Quantity selection for multiple items
- [ ] ❌ **MISSING**: Payment processing states
- [ ] ❌ **MISSING**: Error handling and user feedback

### **5.3 Profile Page**
- [ ] ✅ Basic profile display
- [ ] ✅ Wishlists grid
- [ ] ❌ **MISSING**: SEO meta tags
- [ ] ❌ **MISSING**: Proper error handling
- [ ] ❌ **MISSING**: Owner-specific features
- [ ] ❌ **MISSING**: Profile statistics
- [ ] ❌ **MISSING**: Social sharing

---

## 6. CRITICAL DEPENDENCIES TO ADD

### **6.1 Required Imports**
```tsx
// Add to all three pages
import { useToast } from '@/components/ui/use-toast';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';
import { getUserFriendlyError } from '@/lib/utils';
import { ReminderService } from '@/lib/reminderService';
import { z } from 'zod';
import { useConfetti } from '@/contexts/ConfettiContext';
import Confetti from '@/components/Confetti';
```

### **6.2 Environment Variables**
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **6.3 Required Services**
- **ConfettiContext**: For celebration animations
- **ReminderService**: For automatic reminder creation
- **Toast notifications**: For user feedback
- **SEO service**: For dynamic meta tags

---

## 7. TESTING REQUIREMENTS

### **7.1 Functionality Tests**
- [ ] Wishlist loading and display
- [ ] Item interaction and navigation
- [ ] Profile viewing and wishlist access
- [ ] Share functionality (copy, QR, native)
- [ ] Payment processing (Paystack integration)
- [ ] Form validation and error handling
- [ ] Real-time updates and subscriptions
- [ ] Responsive design across devices

### **7.2 Design Tests**
- [ ] **NO border radius anywhere** (critical requirement)
- [ ] Consistent border styling (`border-2 border-black`)
- [ ] Proper shadow styling (`shadow-[-4px_4px_0px_#161B47]`)
- [ ] Brand color consistency
- [ ] Typography and spacing
- [ ] Button states and interactions
- [ ] Modal designs and layouts

### **7.3 Performance Tests**
- [ ] Page load times
- [ ] Image optimization
- [ ] Real-time subscription efficiency
- [ ] Payment processing speed
- [ ] Mobile responsiveness
- [ ] SEO meta tag generation

---

## 8. DEPLOYMENT CONSIDERATIONS

### **8.1 Environment Setup**
- Ensure all environment variables are configured
- Test Paystack integration in staging
- Verify Supabase real-time subscriptions
- Test SEO meta tag generation

### **8.2 Monitoring**
- Set up error tracking for payment failures
- Monitor real-time subscription performance
- Track user engagement metrics
- Monitor page load times

---

## CONCLUSION

These three pages are the core of the HeySpender user experience. The current Next.js implementations are basic and missing critical features from the original React versions. This guide provides the exact specifications needed to implement pixel-perfect replicas with all functionality intact.

**Key priorities:**
1. **NO border radius** - this is non-negotiable
2. **Complete payment integration** - Paystack with proper error handling
3. **Real-time features** - subscriptions and live updates
4. **Celebration system** - confetti and user engagement
5. **SEO optimization** - dynamic meta tags for social sharing

Follow this guide exactly to ensure the Next.js version matches the original React implementation perfectly.
