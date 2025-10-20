# Authentication Pages Design & Structure Guide

## Overview
This guide provides comprehensive design specifications and structural guidelines for implementing the authentication pages in HeySpender Next.js. Focus on **visual design, layout structure, and UI components** rather than functionality.

## ⚠️ **CRITICAL DESIGN REQUIREMENTS**

### **NO BORDER RADIUS WHATSOEVER**
- **ALL elements must have `rounded-none` or NO `rounded-*` classes**
- **Forms, inputs, buttons, modals - EVERYTHING must be sharp corners**
- **This is a core brand requirement - NO EXCEPTIONS**

### **EXACT Design Specifications**
- **Border styling**: `border-2 border-black` for all forms and inputs
- **Shadow styling**: `shadow-[-4px_4px_0px_#161B47]` for buttons
- **Color scheme**: Brand purple dark, brand green, brand orange
- **Typography**: Space Grotesk font family with proper weights

---

## 1. LOGIN PAGE DESIGN STRUCTURE

### **1.1 Overall Layout Structure**
```
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │   Login Form    │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │  Welcome  │  │          │
│        │  │   Back    │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Email/    │  │          │
│        │  │ Username  │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Password  │  │          │
│        │  │ [👁️]      │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │  LOGIN    │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  Sign Up Link   │          │
│        └─────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### **1.2 Login Form Container Design**
```tsx
<div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
    {/* Form content */}
  </div>
</div>
```

**Design Specifications:**
- **Container**: `max-w-md` (448px max width)
- **Padding**: `p-8` (32px internal padding)
- **Background**: `bg-white`
- **Border**: `border-2 border-black` (NO border radius)
- **Spacing**: `space-y-6` (24px vertical spacing)
- **Centering**: Flexbox center alignment

### **1.3 Login Form Header Design**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Welcome Back</h1>
  <p className="text-gray-600">Sign in to your account</p>
</div>
```

**Design Specifications:**
- **Heading**: `text-3xl font-bold` (30px, bold weight)
- **Color**: `text-brand-purple-dark` (#7c3bed)
- **Subtitle**: `text-gray-600` (medium gray)
- **Alignment**: `text-center`

### **1.4 Input Field Design Structure**
```tsx
<div>
  <Label htmlFor="identifier">Email or Username</Label>
  <Input 
    id="identifier" 
    type="text" 
    autoComplete="email" 
    value={formData.identifier} 
    onChange={handleInputChange} 
    required 
    className="border-2 border-black"
  />
</div>
```

**Design Specifications:**
- **Label**: Standard label styling
- **Input**: `border-2 border-black` (NO border radius)
- **Background**: White background
- **Focus**: No outline, no box-shadow
- **Spacing**: Standard form spacing

### **1.5 Password Field with Toggle Design**
```tsx
<div className="relative">
  <div className="flex items-center justify-between mb-1">
    <Label htmlFor="password">Password</Label>
    <Link href="/auth/forgot-password" className="text-xs text-brand-purple-dark hover:underline">
      Forgot Password?
    </Link>
  </div>
  <div className="relative">
    <Input 
      id="password" 
      type={showPassword ? 'text' : 'password'} 
      autoComplete="current-password" 
      value={formData.password} 
      onChange={handleInputChange} 
      required 
      className="border-2 border-black"
    />
    <Button 
      type="button" 
      variant="ghost" 
      size="icon" 
      className="absolute right-1 bottom-1 h-7 w-7" 
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
    </Button>
  </div>
</div>
```

**Design Specifications:**
- **Password Toggle**: Eye/EyeOff icon in top-right corner
- **Button Size**: `h-7 w-7` (28px square)
- **Icon Size**: `h-4 w-4` (16px)
- **Position**: `absolute right-1 bottom-1`
- **Forgot Link**: `text-xs text-brand-purple-dark` with hover underline

### **1.6 Login Button Design**
```tsx
<Button 
  type="submit" 
  disabled={loading} 
  variant="custom" 
  className="w-full bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
>
  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Login</span>}
  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
</Button>
```

**Design Specifications:**
- **Background**: `bg-brand-green` (#86E589)
- **Text**: `text-black`
- **Border**: `border-2 border-black`
- **Shadow**: `shadow-[-4px_4px_0px_#161B47]`
- **Hover**: `hover:shadow-[-2px_2px_0px_#161B47]`
- **Active**: `active:shadow-[0px_0px_0px_#161B47]`
- **Width**: `w-full`
- **Loading State**: Spinner with `animate-spin`
- **Icon**: ArrowRight icon when not loading

---

## 2. REGISTER PAGE DESIGN STRUCTURE

### **2.1 Overall Layout Structure**
```
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │ Register Form   │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Create    │  │          │
│        │  │ Account   │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │Full Name  │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Username  │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │  Email    │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Password  │  │          │
│        │  │ [👁️]      │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ REGISTER  │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  Login Link     │          │
│        └─────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### **2.2 Register Form Header Design**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Create Account</h1>
  <p className="text-gray-600">Join HeySpender today!</p>
</div>
```

**Design Specifications:**
- **Heading**: `text-3xl font-bold` (30px, bold weight)
- **Color**: `text-brand-purple-dark` (#7c3bed)
- **Subtitle**: `text-gray-600` with encouraging message
- **Alignment**: `text-center`

### **2.3 Register Button Design**
```tsx
<Button 
  type="submit" 
  disabled={loading} 
  variant="custom" 
  className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
>
  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Register</span>}
  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
</Button>
```

**Design Specifications:**
- **Background**: `bg-brand-orange` (#E98144) - Different from login
- **Text**: `text-black`
- **Border**: `border-2 border-black`
- **Shadow**: Same shadow system as login button
- **Loading State**: Spinner with `animate-spin`
- **Icon**: ArrowRight icon when not loading

---

## 3. FORGOT PASSWORD PAGE DESIGN STRUCTURE

### **3.1 Overall Layout Structure**
```
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │ Forgot Password │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │ Forgot    │  │          │
│        │  │ Password? │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │  Email    │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │SEND RESET │  │          │
│        │  │   LINK    │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  Back to Login  │          │
│        └─────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### **3.2 Forgot Password Form Header**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Forgot Password?</h1>
  <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
</div>
```

**Design Specifications:**
- **Heading**: `text-3xl font-bold` (30px, bold weight)
- **Color**: `text-brand-purple-dark` (#7c3bed)
- **Subtitle**: Reassuring message in `text-gray-600`
- **Alignment**: `text-center`

### **3.3 Forgot Password Button Design**
```tsx
<Button 
  type="submit" 
  disabled={loading} 
  variant="custom" 
  className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
>
  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Send Reset Link</span>}
  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
</Button>
```

**Design Specifications:**
- **Background**: `bg-brand-orange` (#E98144)
- **Text**: `text-black`
- **Border**: `border-2 border-black`
- **Shadow**: Same shadow system
- **Loading State**: Spinner with `animate-spin`
- **Icon**: ArrowRight icon when not loading

### **3.4 Success State Design**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Check Your Email</h1>
  <p className="text-gray-600">We've sent a password reset link to your email address.</p>
</div>

<div className="space-y-4">
  <div className="text-center">
    <div className="w-16 h-16 bg-brand-green flex items-center justify-center mx-auto mb-4 border-2 border-black">
      <CheckCircle className="w-8 h-8 text-black" />
    </div>
    <p className="font-semibold text-gray-900">{email}</p>
    <p className="text-sm text-gray-500 mt-2">
      Click the link in the email to reset your password. If you don't see it, check your spam folder.
    </p>
  </div>
</div>

<Link href="/auth/login">
  <Button variant="custom" className="w-full bg-brand-purple-dark text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
    Back to Login
  </Button>
</Link>
```

**Design Specifications:**
- **Success Icon**: `w-16 h-16` (64px) circle with CheckCircle icon
- **Background**: `bg-brand-green` (#86E589)
- **Border**: `border-2 border-black` (NO border radius)
- **Icon**: `w-8 h-8` (32px) CheckCircle in black
- **Email Display**: `font-semibold text-gray-900`
- **Instructions**: `text-sm text-gray-500`
- **Back Button**: `bg-brand-purple-dark text-white`

---

## 4. RESET PASSWORD PAGE DESIGN STRUCTURE

### **4.1 Overall Layout Structure**
```
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │ Reset Password  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │    🔒     │  │          │
│        │  │   Reset   │  │          │
│        │  │ Password  │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │New Password│  │          │
│        │  │ [👁️]      │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │Confirm    │  │          │
│        │  │Password   │  │          │
│        │  │ [👁️]      │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │RESET      │  │          │
│        │  │PASSWORD   │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  Back to Login  │          │
│        └─────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### **4.2 Reset Password Form Header**
```tsx
<div className="text-center">
  <div className="flex justify-center mb-4">
    <div className="w-12 h-12 bg-brand-green flex items-center justify-center border-2 border-black">
      <Lock className="w-6 h-6 text-black" />
    </div>
  </div>
  <h1 className="text-3xl font-bold text-brand-purple-dark">Reset Password</h1>
  <p className="text-gray-600 mt-2">
    Enter your new password below
  </p>
</div>
```

**Design Specifications:**
- **Lock Icon**: `w-12 h-12` (48px) circle with Lock icon
- **Background**: `bg-brand-green` (#86E589)
- **Border**: `border-2 border-black` (NO border radius)
- **Icon**: `w-6 h-6` (24px) Lock icon in black
- **Heading**: `text-3xl font-bold text-brand-purple-dark`
- **Subtitle**: `text-gray-600 mt-2`

### **4.3 Password Fields Design**
```tsx
<div className="relative">
  <Label htmlFor="password">New Password</Label>
  <div className="relative">
    <Input 
      id="password" 
      type={showPassword ? 'text' : 'password'}
      autoComplete="new-password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
      placeholder="At least 8 characters"
      required 
      className="border-2 border-black"
    />
    <Button 
      type="button" 
      variant="ghost" 
      size="icon" 
      className="absolute right-1 bottom-1 h-7 w-7" 
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
    </Button>
  </div>
  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
</div>
```

**Design Specifications:**
- **Input**: `border-2 border-black` (NO border radius)
- **Placeholder**: "At least 8 characters"
- **Password Toggle**: Eye/EyeOff icon in top-right corner
- **Button Size**: `h-7 w-7` (28px square)
- **Icon Size**: `h-4 w-4` (16px)
- **Helper Text**: `text-xs text-gray-500 mt-1`

### **4.4 Reset Password Button Design**
```tsx
<Button 
  type="submit" 
  disabled={loading} 
  variant="custom" 
  className="w-full bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
>
  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Reset Password</span>}
  {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
</Button>
```

**Design Specifications:**
- **Background**: `bg-brand-green` (#86E589)
- **Text**: `text-black`
- **Border**: `border-2 border-black`
- **Shadow**: Same shadow system
- **Loading State**: Spinner with `animate-spin`
- **Icon**: CheckCircle icon when not loading

### **4.5 Invalid Link State Design**
```tsx
<div className="text-center">
  <div className="flex justify-center mb-4">
    <div className="w-16 h-16 bg-red-100 flex items-center justify-center border-2 border-black">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
  </div>

  <h1 className="text-3xl font-bold text-brand-purple-dark mb-2">Invalid or Expired Link</h1>

  <p className="text-gray-600 mb-6">
    This password reset link is invalid or has expired. Please request a new one.
  </p>

  <Link href="/auth/forgot-password">
    <Button variant="custom" className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
      Request New Link
    </Button>
  </Link>
</div>
```

**Design Specifications:**
- **Error Icon**: `w-16 h-16` (64px) circle with AlertCircle icon
- **Background**: `bg-red-100` (light red background)
- **Border**: `border-2 border-black` (NO border radius)
- **Icon**: `w-8 h-8` (32px) AlertCircle in red
- **Heading**: `text-3xl font-bold text-brand-purple-dark`
- **Message**: `text-gray-600 mb-6`
- **Button**: `bg-brand-orange text-black`

---

## 5. EMAIL VERIFICATION PAGE DESIGN STRUCTURE

### **5.1 Overall Layout Structure**
```
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │ Email Verify    │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │    📧     │  │          │
│        │  │Check Your │  │          │
│        │  │  Inbox!   │  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │Continue   │  │          │
│        │  │Contributing│  │          │
│        │  └───────────┘  │          │
│        │                 │          │
│        │  ┌───────────┐  │          │
│        │  │Go to      │  │          │
│        │  │Dashboard  │  │          │
│        │  └───────────┘  │          │
│        └─────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### **5.2 Email Verification Container Design**
```tsx
<div className="min-h-[80vh] flex items-center justify-center px-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md p-8 space-y-6 bg-brand-purple-dark text-white border-2 border-black text-center"
  >
    {/* Content */}
  </motion.div>
</div>
```

**Design Specifications:**
- **Container**: `max-w-md` (448px max width)
- **Padding**: `p-8` (32px internal padding)
- **Background**: `bg-brand-purple-dark` (#7c3bed) - Different from other pages
- **Text**: `text-white` - White text on purple background
- **Border**: `border-2 border-black` (NO border radius)
- **Alignment**: `text-center`
- **Animation**: Framer Motion slide-up animation

### **5.3 Email Verification Header**
```tsx
<MailCheck className="w-16 h-16 mx-auto text-brand-green" />
<h1 className="text-3xl font-bold text-white">Check Your Inbox!</h1>
<p className="text-white/90">
  We've sent a verification link to your email address. Please click the link to confirm your account.
</p>
<p className="text-sm text-white/80">
  You can make contributions while waiting for verification, but you'll need to verify your email to access your dashboard.
</p>
```

**Design Specifications:**
- **Icon**: `w-16 h-16` (64px) MailCheck icon
- **Icon Color**: `text-brand-green` (#86E589) - Green on purple background
- **Heading**: `text-3xl font-bold text-white`
- **Main Text**: `text-white/90` (90% opacity white)
- **Secondary Text**: `text-sm text-white/80` (80% opacity white)

### **5.4 Mobile Instructions Design**
```tsx
<p className="text-xs text-white/60 bg-white/5 p-2 border border-white/10">
  💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
</p>
```

**Design Specifications:**
- **Background**: `bg-white/5` (5% opacity white background)
- **Border**: `border border-white/10` (10% opacity white border)
- **Text**: `text-xs text-white/60` (60% opacity white)
- **Padding**: `p-2` (8px padding)
- **Emoji**: 💡 for visual appeal

### **5.5 User Info Display Design**
```tsx
{user && (
  <div className="text-xs text-white/60 bg-white/10 p-2 border border-white/10">
    <p>Current user: {user.email}</p>
    <p>Verified: {user.email_confirmed_at ? 'Yes' : 'No'}</p>
  </div>
)}
```

**Design Specifications:**
- **Background**: `bg-white/10` (10% opacity white background)
- **Border**: `border border-white/10` (10% opacity white border)
- **Text**: `text-xs text-white/60` (60% opacity white)
- **Padding**: `p-2` (8px padding)
- **Conditional**: Only shows if user exists

### **5.6 Action Buttons Design**
```tsx
<div className="flex flex-col gap-3">
  {returnTo && (
    <Button 
      variant="custom" 
      className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
      onClick={handleContinueContributing}
      disabled={isCheckingSession}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {isCheckingSession ? 'Checking session...' : 'Continue Contributing'}
    </Button>
  )}
  <Button 
    variant="custom" 
    className="bg-brand-accent-red text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
    onClick={handleClose} 
    disabled={isCheckingSession}
  >
    <X className="mr-2 h-4 w-4" />
    {isCheckingSession ? 'Checking session...' : 'Go to Dashboard'}
  </Button>
</div>
```

**Design Specifications:**
- **Container**: `flex flex-col gap-3` (vertical stack with 12px gap)
- **Continue Button**: `bg-brand-green text-black` (Green background, black text)
- **Dashboard Button**: `bg-brand-accent-red text-white` (Red background, white text)
- **Icons**: ArrowLeft and X icons with `mr-2 h-4 w-4`
- **Loading States**: Text changes when `isCheckingSession` is true
- **Shadow System**: Same shadow system as other buttons

---

## 6. RESPONSIVE DESIGN SPECIFICATIONS

### **6.1 Mobile Breakpoints**
```css
/* Mobile (up to 768px) */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem; /* 16px */
    margin: 0.5rem; /* 8px */
  }
  
  .auth-form {
    max-width: 100%;
    padding: 1.5rem; /* 24px */
  }
  
  .auth-heading {
    font-size: 1.875rem; /* 30px */
  }
  
  .auth-button {
    height: 2.75rem; /* 44px - touch-friendly */
  }
}

/* Tablet (769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .auth-container {
    padding: 2rem; /* 32px */
  }
  
  .auth-form {
    padding: 2rem; /* 32px */
  }
}

/* Desktop (1025px and up) */
@media (min-width: 1025px) {
  .auth-container {
    padding: 3rem; /* 48px */
  }
  
  .auth-form {
    padding: 2.5rem; /* 40px */
  }
}
```

### **6.2 Touch-Friendly Design**
```css
/* Minimum touch target size */
.auth-button,
.auth-input,
.auth-link {
  min-height: 44px; /* iOS recommended minimum */
  min-width: 44px;
}

/* Touch-friendly spacing */
.auth-form {
  gap: 1.5rem; /* 24px between form elements */
}

.auth-input {
  padding: 0.75rem 1rem; /* 12px 16px */
  font-size: 1rem; /* 16px - prevents zoom on iOS */
}
```

---

## 7. ANIMATION SPECIFICATIONS

### **7.1 Page Entry Animation**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="auth-form"
>
  {/* Form content */}
</motion.div>
```

**Animation Specifications:**
- **Initial**: `opacity: 0, y: 20` (invisible, 20px down)
- **Animate**: `opacity: 1, y: 0` (visible, original position)
- **Duration**: `0.5s` (500ms)
- **Easing**: Default ease-out

### **7.2 Button Loading Animation**
```tsx
{loading ? (
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
) : (
  <span>Button Text</span>
)}
```

**Animation Specifications:**
- **Spinner**: `animate-spin` (continuous rotation)
- **Size**: `h-4 w-4` (16px)
- **Margin**: `mr-2` (8px right margin)

---

## 8. COLOR SCHEME SPECIFICATIONS

### **8.1 Brand Colors**
```css
:root {
  --brand-purple-dark: #7c3bed;
  --brand-green: #86E589;
  --brand-orange: #E98144;
  --brand-accent-red: #E94B29;
  --black: #161B47;
  --white: #ffffff;
  --gray-600: #6b7280;
  --gray-500: #9ca3af;
}
```

### **8.2 Color Usage by Page**
- **Login**: Green button (`bg-brand-green`)
- **Register**: Orange button (`bg-brand-orange`)
- **Forgot Password**: Orange button (`bg-brand-orange`)
- **Reset Password**: Green button (`bg-brand-green`)
- **Email Verification**: Purple background (`bg-brand-purple-dark`)

---

## 9. TYPOGRAPHY SPECIFICATIONS

### **9.1 Font Hierarchy**
```css
.auth-heading {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.875rem; /* 30px */
  font-weight: 700; /* Bold */
  line-height: 1.2;
}

.auth-subtitle {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400; /* Regular */
  line-height: 1.5;
}

.auth-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500; /* Medium */
  line-height: 1.4;
}

.auth-button {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 500; /* Medium */
  line-height: 1.5;
}
```

---

## 10. ACCESSIBILITY SPECIFICATIONS

### **10.1 ARIA Labels**
```tsx
<Input 
  id="password" 
  type="password"
  aria-label="Password"
  aria-describedby="password-help"
  required 
/>
<p id="password-help" className="text-xs text-gray-500">
  Minimum 8 characters
</p>
```

### **10.2 Focus States**
```css
.auth-input:focus {
  outline: none;
  box-shadow: none;
  border-color: var(--brand-purple-dark);
}

.auth-button:focus {
  outline: 2px solid var(--brand-purple-dark);
  outline-offset: 2px;
}
```

### **10.3 Color Contrast**
- **Text on white**: Minimum 4.5:1 contrast ratio
- **Text on purple**: Minimum 4.5:1 contrast ratio
- **Button text**: Minimum 4.5:1 contrast ratio

---

## CONCLUSION

This guide provides complete design specifications for all authentication pages in HeySpender Next.js. Each page maintains **consistent visual design** while having **unique color schemes** and **appropriate messaging** for different user states.

**Key design principles:**
1. **NO border radius** anywhere (critical requirement)
2. **Consistent form structure** across all pages
3. **Brand color usage** with appropriate button colors
4. **Mobile-first responsive design**
5. **Accessibility compliance** with proper contrast and focus states
6. **Smooth animations** for better user experience
7. **Touch-friendly design** for mobile devices

Follow this guide exactly to ensure perfect visual consistency across all authentication pages! 🎉
