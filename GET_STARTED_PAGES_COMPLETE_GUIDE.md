# GET STARTED PAGES - COMPLETE IMPLEMENTATION GUIDE

## 🚨 CRITICAL: Complete Get Started Pages Design, Structure, Functionality & Implementation

This guide provides the **EXACT** specifications for implementing the Get Started pages with all design elements, functionality, modals, and complete implementation details.

---

## 1. OVERALL ARCHITECTURE & STRUCTURE

### **1.1 Page Structure Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                    GET STARTED WIZARD                          │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │   SIDEBAR       │  │           MAIN CONTENT              │   │
│  │   (Desktop)     │  │                                     │   │
│  │                 │  │  ┌─────────────────────────────────┐ │   │
│  │ • Brand Logo    │  │  │        STEP CONTENT             │ │   │
│  │ • Step Counter  │  │  │                                 │ │   │
│  │ • Step Title    │  │  │  • Welcome Animation           │ │   │
│  │ • Description   │  │  │  • Form Fields                 │ │   │
│  │ • Close Button  │  │  │  • Occasion Selection          │ │   │
│  │                 │  │  │  • Date Picker                 │ │   │
│  │                 │  │  │  • Story Textarea              │ │   │
│  │                 │  │  │  • File Upload                 │ │   │
│  │                 │  │  │  • Privacy Settings            │ │   │
│  │                 │  │  │  • Items/Goals Management      │ │   │
│  │                 │  │  └─────────────────────────────────┘ │   │
│  │                 │  │                                     │   │
│  │                 │  │  ┌─────────────────────────────────┐ │   │
│  │                 │  │  │      BOTTOM NAVIGATION          │ │   │
│  │                 │  │  │                                 │ │   │
│  │                 │  │  │  [←] [●][●][●][●][●][●][●][●] [→] │   │
│  │                 │  │  │                                 │ │   │
│  │                 │  │  └─────────────────────────────────┘ │   │
│  └─────────────────┘  └─────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **1.2 Route Structure**

```typescript
// EXACT route structure - NO MODIFICATIONS
const stepRoutes = [
  'welcome',    // Step 0: Welcome with animated preview
  'title',      // Step 1: Wishlist title input
  'occasion',   // Step 2: Occasion selection
  'date',       // Step 3: Date selection (flexible/specific)
  'story',      // Step 4: Story textarea
  'cover',      // Step 5: Cover image upload
  'privacy',    // Step 6: Visibility settings
  'items'       // Step 7: Add items and cash goals
];

// Route paths
/dashboard/get-started/welcome
/dashboard/get-started/title
/dashboard/get-started/occasion
/dashboard/get-started/date
/dashboard/get-started/story
/dashboard/get-started/cover
/dashboard/get-started/privacy
/dashboard/get-started/items
```

### **1.3 Step Configuration**

```typescript
// EXACT step configuration - NO MODIFICATIONS
const steps = [
  { 
    title: 'Welcome', 
    description: "Let's set up your first wishlist" 
  },
  { 
    title: 'Title', 
    description: 'What should we call your wishlist?' 
  },
  { 
    title: 'Occasion', 
    description: 'Is this for a special occasion?' 
  },
  { 
    title: 'Date', 
    description: 'When would you love to receive these gifts?' 
  },
  { 
    title: 'Story', 
    description: 'Tell your Spenders why this wishlist matters. Tell your supporters why this wishlist is special to you.' 
  },
  { 
    title: 'Cover', 
    description: 'Choose a beautiful cover photo' 
  },
  { 
    title: 'Privacy', 
    description: 'Who can see your wishlist?' 
  },
  { 
    title: 'Wishlist Items & Goals', 
    description: 'Add your first wishlist items or cash goals' 
  }
];
```

---

## 2. RESPONSIVE LAYOUT SPECIFICATIONS

### **2.1 Mobile Layout (Default)**

```tsx
// EXACT mobile layout structure - NO MODIFICATIONS
<div className="min-h-screen bg-white">
  <div className="flex flex-col lg:flex-row min-h-screen">
    {/* Mobile Header */}
    <div className="lg:hidden px-4 py-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          {/* Brand logo */}
          <div className="flex items-center">
            <img 
              src="/HeySpenderMedia/General/HeySpender Logoo Reverse.webp" 
              alt="HeySpender" 
              className="h-10"
            />
          </div>
          {/* Close button */}
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Step Title */}
    <div className="lg:hidden px-4 py-6">
      <div className="max-w-sm mx-auto">
        {/* Progress indicator */}
        <div className="mb-4 mt-4">
          <p className="text-sm font-medium text-gray-500">
            {currentStep + 1} of {steps.length}
          </p>
        </div>
        
        <h1 className="text-[35px] font-bold text-gray-900 mb-3 leading-tight">
          {/* Dynamic step titles */}
        </h1>
        <p className="text-gray-600">
          {/* Dynamic step descriptions */}
        </p>
      </div>
    </div>

    {/* Main content area */}
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 lg:px-56 pt-8 pb-6 lg:pt-[260px] lg:pb-12">
        <div className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
          {/* Step content */}
        </div>
      </div>
    </div>

    {/* Bottom navigation */}
    <div className="px-4 lg:px-8 py-4 lg:py-6 border-t border-gray-200 bg-brand-purple-dark">
      {/* Navigation controls */}
    </div>
  </div>
</div>
```

### **2.2 Desktop Layout (lg: breakpoint and up)**

```tsx
// EXACT desktop layout structure - NO MODIFICATIONS
<div className="flex flex-col lg:flex-row min-h-screen">
  {/* Desktop Sidebar */}
  <div className="lg:w-1/3 lg:bg-gray-50 lg:border-r border-gray-200">
    <div className="hidden lg:block px-8 py-12 h-full">
      {/* Close button */}
      <div className="flex justify-end mb-8">
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Brand icon */}
      <div className="mb-16">
        <div className="w-14 h-14 bg-brand-purple-dark rounded-lg flex items-center justify-center p-3">
          <img 
            src="/HeySpenderMedia/General/HeySpender Icon.webp" 
            alt="HeySpender" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Step counter */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500">
          {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Step title and description */}
      <div>
        <h1 className="text-[35px] font-bold text-gray-900 mb-4 leading-tight">
          {/* Dynamic step titles */}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {/* Dynamic step descriptions */}
        </p>
      </div>
    </div>
  </div>

  {/* Main Content Area */}
  <div className="flex-1 lg:w-2/3 flex flex-col">
    {/* Content and navigation */}
  </div>
</div>
```

---

## 3. STEP-BY-STEP IMPLEMENTATION

### **3.1 Step 0: Welcome (Animated Preview)**

```tsx
// EXACT welcome step implementation - NO MODIFICATIONS
case 0:
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center"
    >
      {/* Dummy Wishlist Card Preview */}
      <div className="w-full max-w-sm bg-white border-2 border-black">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-br from-brand-purple-light to-brand-purple-dark relative">
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white opacity-70" />
          </div>
          
          {/* Status and Visibility badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border border-black">
              Live
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-black">
              Unlisted
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Title and Occasion */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2 min-h-[28px]">
              {typedTitle}
              <span className="animate-pulse">|</span>
            </h3>
            <span className="inline-block px-3 py-1 bg-brand-purple-light text-brand-purple-dark text-sm font-medium border border-brand-purple-dark">
              {sampleWishlists[titleIndex].occasion}
            </span>
          </div>

          {/* Date */}
          <div className="text-sm text-gray-600 mb-4">
            Due December 25, 2024
          </div>

          {/* Progress */}
          <div className="space-y-3 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items Progress</span>
                <span className="font-medium">60%</span>
              </div>
              <Progress value={60} className="h-3 [&>div]:animate-[stripe_4s_linear_infinite]" />
              <div className="text-xs text-gray-500">3 of 5 items fulfilled</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
            <div className="bg-green-50 p-3 border border-black">
              <div className="font-bold text-lg text-gray-900">5</div>
              <div className="text-gray-600 text-xs">Items</div>
            </div>
            <div className="bg-orange-50 p-3 border border-black">
              <div className="font-bold text-lg text-gray-900">₦50,000</div>
              <div className="text-gray-600 text-xs">Cash Goals</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
```

**Typing Animation Implementation:**
```tsx
// EXACT typing animation - NO MODIFICATIONS
const sampleWishlists = [
  { title: "My Birthday Wishlist", occasion: "Birthday" },
  { title: "Wedding Registry", occasion: "Wedding" },
  { title: "Baby Shower Dreams", occasion: "Baby" },
  { title: "Graduation Goals", occasion: "Graduation" },
  { title: "Holiday Wishes", occasion: "Just Because" }
];

// Typing animation effect
useEffect(() => {
  if (currentStep !== 0) return; // Only run on welcome slide

  const currentWishlist = sampleWishlists[titleIndex];
  const currentTitle = currentWishlist.title;
  const typingSpeed = isDeleting ? 50 : 100;
  const pauseAfterComplete = 2000;
  const pauseAfterDelete = 500;

  const timer = setTimeout(() => {
    if (!isDeleting && typedTitle.length < currentTitle.length) {
      // Typing
      setTypedTitle(currentTitle.substring(0, typedTitle.length + 1));
    } else if (!isDeleting && typedTitle.length === currentTitle.length) {
      // Pause before deleting
      setTimeout(() => setIsDeleting(true), pauseAfterComplete);
    } else if (isDeleting && typedTitle.length > 0) {
      // Deleting
      setTypedTitle(currentTitle.substring(0, typedTitle.length - 1));
    } else if (isDeleting && typedTitle.length === 0) {
      // Move to next title
      setIsDeleting(false);
      setTitleIndex((prevIndex) => (prevIndex + 1) % sampleWishlists.length);
      setTimeout(() => {}, pauseAfterDelete);
    }
  }, typingSpeed);

  return () => clearTimeout(timer);
}, [typedTitle, isDeleting, titleIndex, currentStep]);
```

### **3.2 Step 1: Title Input**

```tsx
// EXACT title step implementation - NO MODIFICATIONS
case 1:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <FormField
          control={control}
          name="title"
          behaviorOverrides={{
            helpText: '',
            showCharCount: false,
            inputProps: {
              placeholder: 'Wishlist Title - e.g. My Birthday Wishlist, Wedding Registry',
              maxLength: 60,
              className: 'bg-white border border-gray-300 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-brand-purple-dark'
            }
          }}
        />
        {watch('title')?.length > 0 && (
          <div className="text-right text-gray-500 text-xs mt-1">
            {watch('title').length}/60
          </div>
        )}
      </div>
    </motion.div>
  );
```

### **3.3 Step 2: Occasion Selection**

```tsx
// EXACT occasion step implementation - NO MODIFICATIONS
const occasions = [
  { name: 'Birthday', icon: Cake, value: 'birthday' },
  { name: 'Wedding', icon: Heart, value: 'wedding' },
  { name: 'Baby', icon: Baby, value: 'other' },
  { name: 'Graduation', icon: GraduationCap, value: 'graduation' },
  { name: 'Housewarming', icon: Home, value: 'other' },
  { name: 'Charity', icon: HeartHandshake, value: 'other' },
  { name: 'Just Because', icon: Sparkles, value: 'other' },
  { name: 'Other', icon: Gift, value: 'other' },
  { name: 'No occasion', icon: PartyPopper, value: null }
];

case 2:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {occasions.map(occasion => (
          <motion.div
            key={occasion.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 border-2 border-black rounded-lg cursor-pointer transition-all ${
              watch('occasion') === occasion.name
                ? 'bg-brand-green shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)]'
                : 'bg-white hover:shadow-[-2px_2px_0px_0px_rgba(22,27,71,1)]'
            }`}
            onClick={() => setValue('occasion', occasion.name)}
          >
            {/* Check mark for selected */}
            {watch('occasion') === occasion.name && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-brand-green" />
              </div>
            )}
            
            {/* Icon and Text Container */}
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Icon */}
              <div className="mb-3">
                <occasion.icon className="w-6 h-6 text-gray-600" />
              </div>
              
              {/* Occasion Name */}
              <span className="font-semibold text-sm text-gray-900">{occasion.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
```

### **3.4 Step 3: Date Selection**

```tsx
// EXACT date step implementation - NO MODIFICATIONS
case 3:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-3">
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            !watch('event_date') 
              ? 'border-brand-purple-dark bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setValue('event_date', null)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              !watch('event_date')
                ? 'border-brand-purple-dark bg-brand-purple-dark'
                : 'border-gray-300'
            }`}>
              {!watch('event_date') && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-900">No specific date</span>
              <p className="text-sm text-gray-500">Flexible timing</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            watch('event_date') 
              ? 'border-brand-purple-dark bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setValue('event_date', new Date())}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              watch('event_date')
                ? 'border-brand-purple-dark bg-brand-purple-dark'
                : 'border-gray-300'
            }`}>
              {watch('event_date') && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-900">Specific date</span>
              <p className="text-sm text-gray-500">Set an exact date</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dateType === 'specific' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {/* Use Popover + Calendar Component Instead */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal bg-white border-2 border-gray-300 text-gray-900 p-4 hover:bg-gray-50 hover:border-brand-purple-dark"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('event_date') ? format(watch('event_date'), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch('event_date')}
                  onSelect={(date) => setValue('event_date', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
```

### **3.5 Step 4: Story Textarea**

```tsx
// EXACT story step implementation - NO MODIFICATIONS
case 4:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Your Story (Optional)
        </Label>
        <FormField
          control={control}
          name="story"
          behaviorOverrides={{
            inputProps: {
              placeholder: 'Share what makes this wishlist special...',
              className: 'bg-white border border-gray-300 text-gray-900 min-h-[100px] rounded-lg focus:outline-none focus:border-brand-purple-dark'
            }
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Wishlists with stories encourage and boost spenders to fulfill their wishes. 
          Share your journey and help spenders connect with your goals.
        </p>
      </div>
    </motion.div>
  );
```

### **3.6 Step 5: Cover Image Upload**

```tsx
// EXACT cover step implementation - NO MODIFICATIONS
case 5:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Instructional text */}
      <p className="text-gray-600 text-sm">
        Choose a beautiful cover photo that represents your wishlist and makes it stand out to your supporters.
      </p>
      
      {/* Upload field */}
      <div>
        <label className="text-sm font-medium text-gray-900 mb-2 block">
          Cover Photo
        </label>
        <div className="mt-1">
          <FileUpload
            variant="purple"
            value={coverImageUrl}
            onFileSelect={async (file) => {
              if (!user?.id) {
                console.error('User not authenticated');
                return;
              }
              
              setUploading(true);
              try {
                const { imageService } = await import('@/lib/wishlistService');
                const url = await imageService.uploadCoverImage(file, user.id);
                setValue('cover_image_url', url);
              } catch (error) {
                console.error('Upload failed:', error);
                setValue('cover_image_url', URL.createObjectURL(file));
              } finally {
                setUploading(false);
              }
            }}
            onRemove={() => setValue('cover_image_url', '')}
            acceptedTypes="PNG, JPG, WEBP"
            maxSize="10MB"
            uploading={uploading}
            disabled={uploading}
          />
        </div>
      </div>
    </motion.div>
  );
```

### **3.7 Step 6: Privacy Settings**

```tsx
// EXACT privacy step implementation - NO MODIFICATIONS
case 6:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Visibility Settings
        </Label>
        <FormField
          control={control}
          name="visibility"
        />
      </div>
    </motion.div>
  );
```

### **3.8 Step 7: Items & Goals Management**

```tsx
// EXACT items step implementation - NO MODIFICATIONS
case 7:
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Show added items count */}
      {(items.length > 0 || cashGoals.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2 mb-6"
        >
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <p className="font-medium">{items.length} wishlist item{items.length !== 1 ? 's' : ''} added</p>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <p className="font-medium">{cashGoals.length} cash goal{cashGoals.length !== 1 ? 's' : ''} added</p>
          </div>
        </motion.div>
      )}
      
      <div className="space-y-3">
        <button 
          type="button"
          onClick={() => setAddItemModalOpen(true)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Add Wishlist Item</p>
              <p className="text-sm text-gray-500">Physical items you'd love to receive</p>
            </div>
          </div>
        </button>
        
        <button 
          type="button"
          onClick={() => setAddGoalModalOpen(true)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Plus className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Add Cash Goal</p>
              <p className="text-sm text-gray-500">Monetary contributions for your goals</p>
            </div>
          </div>
        </button>
      </div>
      
      {items.length === 0 && cashGoals.length === 0 && (
        <p className="text-left text-gray-500 text-sm mt-4">
          Skip this step if you prefer to add items later
        </p>
      )}
    </motion.div>
  );
```

---

## 4. BOTTOM NAVIGATION SPECIFICATIONS

### **4.1 Navigation Container**

```tsx
// EXACT bottom navigation - NO MODIFICATIONS
<div className="px-4 lg:px-8 py-4 lg:py-6 border-t border-gray-200 bg-brand-purple-dark">
  <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16">
    {/* Left Arrow Button */}
    <button
      type="button"
      onClick={prevStep}
      disabled={currentStep === 0}
      className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green border-2 border-black flex items-center justify-center hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
    >
      <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
    </button>

    {/* Step Dots */}
    <div className="flex items-center gap-1.5 sm:gap-2">
      {steps.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => navigate(`/dashboard/get-started/${stepRoutes[index]}`)}
          className={`w-[12px] h-[12px] sm:w-[15px] sm:h-[15px] border-2 border-black cursor-pointer transition-all hover:scale-110 ${
            index === currentStep
              ? 'bg-brand-orange'
              : index < currentStep
              ? 'bg-brand-green'
              : 'bg-white hover:bg-gray-200'
          }`}
          style={{ boxShadow: '-1.5px 1.5px 0px 0px rgba(22,27,71,1)' }}
          title={steps[index].title}
        />
      ))}
    </div>

    {/* Right Button - Arrow or Create */}
    {currentStep === steps.length - 1 ? (
      <button
        type="button"
        onClick={handleComplete}
        disabled={isSubmitting}
        className="bg-brand-green border-2 border-black px-4 py-2 sm:px-8 sm:py-3 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-black font-bold text-base sm:text-lg">
          {isSubmitting ? 'Creating...' : 'Create'}
        </span>
      </button>
    ) : (
      <button
        type="button"
        onClick={nextStep}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green border-2 border-black flex items-center justify-center hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all"
      >
        <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
      </button>
    )}
  </div>
</div>
```

### **4.2 Navigation States**

```tsx
// EXACT navigation state logic - NO MODIFICATIONS
const nextStep = () => {
  if (currentStep < steps.length - 1) {
    navigate(`/dashboard/get-started/${stepRoutes[currentStep + 1]}`);
    window.scrollTo(0, 0);
  }
};

const prevStep = () => {
  if (currentStep > 0) {
    navigate(`/dashboard/get-started/${stepRoutes[currentStep - 1]}`);
    window.scrollTo(0, 0);
  }
};

// Step dot colors
const getDotColor = (index) => {
  if (index === currentStep) return 'bg-brand-orange';
  if (index < currentStep) return 'bg-brand-green';
  return 'bg-white hover:bg-gray-200';
};
```

---

## 5. MODAL IMPLEMENTATIONS

### **5.1 Add Item/Goal Modal Structure**

```tsx
// EXACT modal structure - NO MODIFICATIONS
const AddItemFormModal = ({ isOpen, onClose, onSave, type = 'item', initialData = {} }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || 0,
    quantity: initialData.quantity || 1,
    url: initialData.url || '',
    description: initialData.description || '',
    image: initialData.image || '',
    title: initialData.title || '',
    targetAmount: initialData.targetAmount || 0,
    deadline: initialData.deadline || null,
    ...initialData
  });
  const [uploading, setUploading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-brand-purple-dark w-full max-w-2xl max-h-[90vh] overflow-hidden border-2 border-black rounded-lg">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
              Add {type === 'item' ? 'Wishlist Item' : 'Cash Goal'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon className="w-6 h-6 sm:w-7 sm:w-7 lg:w-8 lg:h-8 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Form fields based on type */}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white border-2 border-black text-black hover:bg-gray-50 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-brand-green border-2 border-black text-black hover:bg-brand-green/90 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all order-1 sm:order-2"
            >
              Add {type === 'item' ? 'Wishlist Item' : 'Cash Goal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **5.2 Item Form Fields**

```tsx
// EXACT item form fields - NO MODIFICATIONS
{type === 'item' ? (
  <>
    <div>
      <Label className="text-white text-sm sm:text-base">Wishlist Item Name</Label>
      <Input
        value={formData.name}
        onChange={(e) => updateFormData({ name: e.target.value })}
        placeholder="Item name"
        className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
      />
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-white text-sm sm:text-base">Price (₦)</Label>
        <Input
          type="text"
          value={formatNumberWithCommas(formData.price)}
          onChange={handlePriceChange}
          placeholder="0"
          className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
        />
      </div>
      <div>
        <Label className="text-white text-sm sm:text-base">Quantity</Label>
        <Input
          type="number"
          value={formData.quantity || ''}
          onChange={(e) => updateFormData({ quantity: Number(e.target.value) })}
          placeholder="1"
          className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
        />
      </div>
    </div>
    
    <div>
      <Label className="text-white text-sm sm:text-base">Product URL</Label>
      <Input
        value={formData.url || ''}
        onChange={(e) => updateFormData({ url: e.target.value })}
        placeholder="https://..."
        className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
      />
    </div>
    
    <div>
      <Label className="text-white text-sm sm:text-base">Wishlist Item Image</Label>
      <div className="mt-1">
        <FileUpload 
          variant="purple"
          value={formData.image}
          onFileSelect={async (file) => {
            if (!user?.id) {
              console.error('User not authenticated');
              return;
            }
            
            setUploading(true);
            try {
              const { imageService } = await import('@/lib/wishlistService');
              const url = await imageService.uploadItemImage(file, user.id);
              updateFormData({ image: url });
            } catch (error) {
              console.error('Upload failed:', error);
              updateFormData({ image: URL.createObjectURL(file) });
            } finally {
              setUploading(false);
            }
          }}
          onRemove={() => updateFormData({ image: '' })}
          acceptedTypes="PNG, JPG, WEBP"
          maxSize="10MB"
          uploading={uploading}
          disabled={uploading}
        />
      </div>
    </div>
  </>
) : (
  // Cash Goal fields
)}
```

### **5.3 Cash Goal Form Fields**

```tsx
// EXACT cash goal form fields - NO MODIFICATIONS
{type === 'goal' ? (
  <>
    <div>
      <Label className="text-white text-sm sm:text-base">Goal Title</Label>
      <Input
        value={formData.title}
        onChange={(e) => updateFormData({ title: e.target.value })}
        placeholder="e.g. Vacation Fund"
        className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
      />
    </div>
    
    <div>
      <Label className="text-white text-sm sm:text-base">Target Amount (₦)</Label>
      <Input
        type="text"
        value={formatNumberWithCommas(formData.targetAmount)}
        onChange={handleTargetAmountChange}
        placeholder="0"
        className="mt-1 bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
      />
    </div>
    
    <div>
      <Label className="text-white text-sm sm:text-base">Deadline (optional)</Label>
      <div className="mt-1">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-2 border-black text-black hover:bg-gray-50 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.deadline ? format(formData.deadline, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.deadline}
              onSelect={(date) => {
                updateFormData({ deadline: date });
                setDatePickerOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
    
    <div>
      <Label className="text-white text-sm sm:text-base">Description</Label>
      <Textarea
        value={formData.description || ''}
        onChange={(e) => updateFormData({ description: e.target.value })}
        placeholder="Describe this goal..."
        className="mt-1 min-h-[60px] bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:border-brand-purple-dark"
      />
    </div>
  </>
) : null}
```

---

## 6. FORM VALIDATION & SCHEMAS

### **6.1 Wishlist Schema**

```typescript
// EXACT wishlist schema - NO MODIFICATIONS
export const wishlistSchema = z.object({
  title: titleSchema,
  occasion: z.string().optional(),
  story: descriptionSchema,
  visibility: visibilitySchema,
  event_date: dateOptionalSchema,
  cover_image_url: imageUrlSchema,
});

// Supporting schemas
export const titleSchema = z.string().min(1, 'Title is required').max(60, 'Title must be 60 characters or less');
export const descriptionSchema = z.string().optional();
export const visibilitySchema = z.enum(['public', 'unlisted', 'private']);
export const dateOptionalSchema = z.date().optional();
export const imageUrlSchema = z.string().optional();
```

### **6.2 Form Configuration**

```typescript
// EXACT form configuration - NO MODIFICATIONS
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
```

---

## 7. ANIMATION SPECIFICATIONS

### **7.1 Framer Motion Animations**

```tsx
// EXACT animation configurations - NO MODIFICATIONS
const stepAnimations = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

const welcomeAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

const occasionHoverAnimations = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};

const successAnimations = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};
```

### **7.2 CSS Animations**

```css
/* EXACT CSS animations - NO MODIFICATIONS */
@keyframes stripe {
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
}

.animate-stripe {
  animation: stripe 4s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 8. COMPLETION & SUBMISSION

### **8.1 Form Submission Handler**

```tsx
// EXACT submission handler - NO MODIFICATIONS
const handleComplete = handleSubmit(async (data) => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  try {
    const wizardData = {
      ...data,
      items,
      cashGoals
    };
    
    const wishlistData = {
      title: data.title,
      occasion: getOccasionValue(data.occasion),
      wishlist_date: data.event_date ? new Date(data.event_date).toISOString() : null,
      story: data.story,
      cover_image_url: data.cover_image_url,
      visibility: data.visibility
    };

    await wishlistService.createWishlist(user.id, wishlistData, wizardData.items, wizardData.cashGoals);
    
    // Show confetti for 12 seconds (continues on dashboard)
    triggerConfetti(12000);
    
    toast({
      title: 'Wishlist created successfully!',
      description: 'Your new wishlist is ready to share.'
    });

    // Navigate to dashboard immediately (confetti continues)
    navigate('/dashboard');
  } catch (error) {
    console.error('Error creating wishlist:', error);
    toast({
      variant: 'destructive',
      title: 'Unable to create wishlist',
      description: error.message || 'An error occurred while creating your wishlist.'
    });
  } finally {
    setIsSubmitting(false);
  }
});
```

### **8.2 Occasion Value Mapping**

```tsx
// EXACT occasion mapping - NO MODIFICATIONS
const getOccasionValue = (displayName) => {
  const occasion = occasions.find(occ => occ.name === displayName);
  return occasion ? occasion.value : null;
};
```

---

## 9. UTILITY FUNCTIONS

### **9.1 Number Formatting**

```tsx
// EXACT number formatting - NO MODIFICATIONS
const formatNumberWithCommas = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseNumberFromFormatted = (formattedValue) => {
  if (!formattedValue) return 0;
  return Number(formattedValue.replace(/,/g, ''));
};

const handlePriceChange = (e) => {
  const rawValue = e.target.value.replace(/,/g, '');
  const numericValue = Number(rawValue);
  if (!isNaN(numericValue)) {
    updateFormData({ price: numericValue });
  }
};
```

### **9.2 File Upload Handling**

```tsx
// EXACT file upload handling - NO MODIFICATIONS
const handleImageUpload = async (file, type = 'cover') => {
  if (!file || !user?.id) return;
  
  setUploading(true);
  try {
    const { imageService } = await import('@/lib/wishlistService');
    const url = type === 'cover' 
      ? await imageService.uploadCoverImage(file, user.id)
      : await imageService.uploadItemImage(file, user.id);
    
    if (type === 'cover') {
      setValue('cover_image_url', url);
    } else {
      updateFormData({ image: url });
    }
  } catch (error) {
    console.error('Upload failed:', error);
    // Fallback to object URL for preview
    const fallbackUrl = URL.createObjectURL(file);
    if (type === 'cover') {
      setValue('cover_image_url', fallbackUrl);
    } else {
      updateFormData({ image: fallbackUrl });
    }
  } finally {
    setUploading(false);
  }
};
```

---

## 10. ACCESSIBILITY & UX FEATURES

### **10.1 Keyboard Navigation**

```tsx
// EXACT keyboard handling - NO MODIFICATIONS
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };
  
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, []);
```

### **10.2 Scroll Management**

```tsx
// EXACT scroll management - NO MODIFICATIONS
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [currentStep]);
```

### **10.3 Loading States**

```tsx
// EXACT loading states - NO MODIFICATIONS
const [isSubmitting, setIsSubmitting] = useState(false);
const [uploading, setUploading] = useState(false);

// Loading indicators
{isSubmitting ? 'Creating...' : 'Create'}
{uploading && <Loader2 className="w-4 h-4 animate-spin" />}
```

---

## 11. RESPONSIVE BREAKPOINTS

### **11.1 Mobile-First Approach**

```css
/* EXACT responsive breakpoints - NO MODIFICATIONS */
/* Mobile (default) */
.wizard-container {
  @apply flex flex-col;
}

.wizard-sidebar {
  @apply hidden;
}

.wizard-content {
  @apply px-4 pt-8 pb-6;
}

/* Small screens (sm: 640px+) */
@media (min-width: 640px) {
  .wizard-navigation {
    @apply gap-12;
  }
  
  .wizard-buttons {
    @apply w-14 h-14;
  }
}

/* Large screens (lg: 1024px+) */
@media (min-width: 1024px) {
  .wizard-container {
    @apply flex-row;
  }
  
  .wizard-sidebar {
    @apply block w-1/3 bg-gray-50 border-r;
  }
  
  .wizard-content {
    @apply w-2/3 px-56 pt-[260px] pb-12;
  }
}
```

---

## 12. ERROR HANDLING & VALIDATION

### **12.1 Form Validation**

```tsx
// EXACT validation handling - NO MODIFICATIONS
const validateStep = (step) => {
  switch (step) {
    case 1: // Title
      return watch('title')?.trim().length > 0;
    case 2: // Occasion
      return true; // Optional
    case 3: // Date
      return true; // Optional
    case 4: // Story
      return true; // Optional
    case 5: // Cover
      return true; // Optional
    case 6: // Privacy
      return watch('visibility')?.length > 0;
    case 7: // Items
      return true; // Optional
    default:
      return true;
  }
};
```

### **12.2 Error Display**

```tsx
// EXACT error display - NO MODIFICATIONS
{errors && Object.keys(errors).length > 0 && (
  <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
    <div className="flex items-center gap-2 text-red-700 mb-2">
      <AlertCircle className="w-4 h-4" />
      <p className="font-medium">Please fix the following errors:</p>
    </div>
    <ul className="text-sm text-red-600 space-y-1">
      {Object.entries(errors).map(([field, messages]) => (
        <li key={field}>• {messages[0]}</li>
      ))}
    </ul>
  </div>
)}
```

---

## 🚨 CRITICAL IMPLEMENTATION REQUIREMENTS

### **ABSOLUTE REQUIREMENTS:**
1. **EXACT Layout Structure** - Follow the precise responsive layout shown
2. **EXACT Step Configuration** - Use only the specified 8 steps with exact titles and descriptions
3. **EXACT Animation Timing** - Use the specified Framer Motion configurations
4. **EXACT Color Scheme** - Use only the specified brand colors
5. **EXACT Form Validation** - Use the specified Zod schemas
6. **EXACT Modal Structure** - Follow the precise modal layout and styling
7. **EXACT Navigation Logic** - Use the specified step navigation system
8. **EXACT File Upload** - Use the specified upload handling with fallbacks

### **FORBIDDEN MODIFICATIONS:**
- ❌ NO step order changes
- ❌ NO color modifications
- ❌ NO layout structure changes
- ❌ NO animation timing changes
- ❌ NO form field modifications
- ❌ NO modal structure changes
- ❌ NO navigation logic changes
- ❌ NO validation rule changes

### **MANDATORY IMPLEMENTATION:**
- ✅ Use EXACT step configuration provided
- ✅ Use EXACT responsive layout provided
- ✅ Use EXACT animation configurations provided
- ✅ Use EXACT form validation provided
- ✅ Use EXACT modal structure provided
- ✅ Use EXACT navigation system provided
- ✅ Use EXACT color scheme provided
- ✅ Use EXACT file upload handling provided

**IMPLEMENT EXACTLY AS SPECIFIED. NO DEVIATIONS. NO "IMPROVEMENTS". NO "MODERNIZATIONS".**

This guide provides **everything needed** to implement the Get Started pages with pixel-perfect accuracy, including all design elements, functionality, modals, animations, and complete implementation details! 🎉
