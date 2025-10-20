# EXACT AUTH PAGES DESIGN SPECIFICATION - NO MODIFICATIONS ALLOWED

## 🚨 CRITICAL INSTRUCTIONS FOR AI IMPLEMENTATION

**YOU MUST FOLLOW THESE EXACT SPECIFICATIONS. NO DEVIATIONS. NO "IMPROVEMENTS". NO "MODERNIZATIONS".**

### **ABSOLUTE REQUIREMENTS:**
1. **ZERO BORDER RADIUS** - Every single element must have sharp corners
2. **EXACT COLORS** - Use only the specified brand colors
3. **EXACT LAYOUT** - Follow the precise structure shown
4. **EXACT SPACING** - Use only the specified measurements
5. **EXACT TYPOGRAPHY** - Space Grotesk font family only
6. **EXACT SHADOWS** - Use only the specified shadow values

---

## 1. LOGIN PAGE - EXACT SPECIFICATIONS

### **1.1 EXACT LAYOUT STRUCTURE**
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

### **1.2 EXACT CONTAINER SPECIFICATIONS**
```tsx
<div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
    {/* EXACTLY THIS STRUCTURE - NO CHANGES */}
  </div>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `min-h-[80vh]` - 80% viewport height minimum
- **Centering**: `flex items-center justify-center` - Perfect center alignment
- **Padding**: `px-4 py-12` - 16px horizontal, 48px vertical
- **Form Width**: `max-w-md` - 448px maximum width
- **Form Padding**: `p-8` - 32px internal padding
- **Background**: `bg-white` - Pure white background
- **Border**: `border-2 border-black` - 2px solid black border
- **Spacing**: `space-y-6` - 24px vertical spacing between elements
- **NO BORDER RADIUS** - Absolutely none

### **1.3 EXACT HEADER SPECIFICATIONS**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Welcome Back</h1>
  <p className="text-gray-600">Sign in to your account</p>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Heading**: `text-3xl font-bold` - 30px, bold weight
- **Heading Color**: `text-brand-purple-dark` - #7c3bed (EXACT color)
- **Subtitle**: `text-gray-600` - #6b7280 (EXACT color)
- **Alignment**: `text-center` - Center alignment
- **Font Family**: Space Grotesk (inherited from body)

### **1.4 EXACT INPUT FIELD SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Label**: Standard label styling (no custom classes)
- **Input**: `border-2 border-black` - 2px solid black border
- **Background**: White background (default)
- **Focus**: No outline, no box-shadow (default)
- **NO BORDER RADIUS** - Absolutely none
- **Font**: Space Grotesk (inherited)

### **1.5 EXACT PASSWORD FIELD SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Container**: `relative` - For absolute positioning
- **Label Row**: `flex items-center justify-between mb-1` - Space between label and link
- **Forgot Link**: `text-xs text-brand-purple-dark hover:underline` - 12px, purple, underline on hover
- **Input Container**: `relative` - For button positioning
- **Input**: `border-2 border-black` - 2px solid black border
- **Toggle Button**: `absolute right-1 bottom-1 h-7 w-7` - 28px square, positioned in corner
- **Icon**: `h-4 w-4` - 16px icon size
- **NO BORDER RADIUS** - Absolutely none

### **1.6 EXACT LOGIN BUTTON SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Width**: `w-full` - Full width
- **Background**: `bg-brand-green` - #86E589 (EXACT color)
- **Text**: `text-black` - Pure black text
- **Border**: `border-2 border-black` - 2px solid black border
- **Shadow**: `shadow-[-4px_4px_0px_#161B47]` - EXACT shadow value
- **Hover Shadow**: `hover:shadow-[-2px_2px_0px_#161B47]` - EXACT hover shadow
- **Active Shadow**: `active:shadow-[0px_0px_0px_#161B47]` - EXACT active shadow
- **Loading Icon**: `Loader2` with `animate-spin`
- **Arrow Icon**: `ArrowRight` with `w-4 h-4 ml-2`
- **NO BORDER RADIUS** - Absolutely none

### **1.7 EXACT SIGN UP LINK SPECIFICATIONS**
```tsx
<p className="text-center text-sm text-gray-600">
  Don't have an account?{' '}
  <Link href="/auth/register" className="font-medium text-brand-purple-dark hover:underline">
    Sign Up
  </Link>
</p>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `text-center text-sm text-gray-600` - Center, 14px, gray
- **Link**: `font-medium text-brand-purple-dark hover:underline` - Medium weight, purple, underline on hover
- **Spacing**: Single space between text and link

---

## 2. REGISTER PAGE - EXACT SPECIFICATIONS

### **2.1 EXACT LAYOUT STRUCTURE**
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

### **2.2 EXACT HEADER SPECIFICATIONS**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Create Account</h1>
  <p className="text-gray-600">Join HeySpender today!</p>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Heading**: `text-3xl font-bold` - 30px, bold weight
- **Heading Color**: `text-brand-purple-dark` - #7c3bed (EXACT color)
- **Subtitle**: `text-gray-600` - #6b7280 (EXACT color)
- **Text**: "Join HeySpender today!" - EXACT text
- **Alignment**: `text-center` - Center alignment

### **2.3 EXACT REGISTER BUTTON SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Background**: `bg-brand-orange` - #E98144 (EXACT color - DIFFERENT from login)
- **Text**: `text-black` - Pure black text
- **Border**: `border-2 border-black` - 2px solid black border
- **Shadow**: `shadow-[-4px_4px_0px_#161B47]` - EXACT shadow value
- **Hover Shadow**: `hover:shadow-[-2px_2px_0px_#161B47]` - EXACT hover shadow
- **Active Shadow**: `active:shadow-[0px_0px_0px_#161B47]` - EXACT active shadow
- **NO BORDER RADIUS** - Absolutely none

---

## 3. FORGOT PASSWORD PAGE - EXACT SPECIFICATIONS

### **3.1 EXACT HEADER SPECIFICATIONS**
```tsx
<div className="text-center">
  <h1 className="text-3xl font-bold text-brand-purple-dark">Forgot Password?</h1>
  <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Heading**: `text-3xl font-bold` - 30px, bold weight
- **Heading Color**: `text-brand-purple-dark` - #7c3bed (EXACT color)
- **Subtitle**: `text-gray-600` - #6b7280 (EXACT color)
- **Text**: "No worries! Enter your email and we'll send you a reset link." - EXACT text

### **3.2 EXACT FORGOT PASSWORD BUTTON SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Background**: `bg-brand-orange` - #E98144 (EXACT color)
- **Text**: "Send Reset Link" - EXACT text
- **Same shadow system as other buttons**

### **3.3 EXACT SUCCESS STATE SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Success Icon**: `w-16 h-16` - 64px circle
- **Icon Background**: `bg-brand-green` - #86E589 (EXACT color)
- **Icon Border**: `border-2 border-black` - 2px solid black border
- **Icon**: `CheckCircle` with `w-8 h-8 text-black` - 32px black icon
- **Back Button**: `bg-brand-purple-dark text-white` - Purple background, white text
- **NO BORDER RADIUS** - Absolutely none

---

## 4. RESET PASSWORD PAGE - EXACT SPECIFICATIONS

### **4.1 EXACT HEADER SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Lock Icon**: `w-12 h-12` - 48px circle
- **Icon Background**: `bg-brand-green` - #86E589 (EXACT color)
- **Icon Border**: `border-2 border-black` - 2px solid black border
- **Icon**: `Lock` with `w-6 h-6 text-black` - 24px black icon
- **Heading**: `text-3xl font-bold text-brand-purple-dark` - 30px, bold, purple
- **Subtitle**: `text-gray-600 mt-2` - Gray with 8px top margin
- **NO BORDER RADIUS** - Absolutely none

### **4.2 EXACT RESET PASSWORD BUTTON SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Background**: `bg-brand-green` - #86E589 (EXACT color)
- **Text**: "Reset Password" - EXACT text
- **Icon**: `CheckCircle` when not loading
- **Same shadow system as other buttons**

---

## 5. EMAIL VERIFICATION PAGE - EXACT SPECIFICATIONS

### **5.1 EXACT CONTAINER SPECIFICATIONS**
```tsx
<div className="min-h-[80vh] flex items-center justify-center px-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md p-8 space-y-6 bg-brand-purple-dark text-white border-2 border-black text-center"
  >
    {/* EXACTLY THIS STRUCTURE - NO CHANGES */}
  </motion.div>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Background**: `bg-brand-purple-dark` - #7c3bed (EXACT color - DIFFERENT from other pages)
- **Text**: `text-white` - White text on purple background
- **Border**: `border-2 border-black` - 2px solid black border
- **Animation**: Framer Motion slide-up animation
- **NO BORDER RADIUS** - Absolutely none

### **5.2 EXACT HEADER SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Icon**: `MailCheck` with `w-16 h-16 mx-auto text-brand-green` - 64px green icon
- **Heading**: `text-3xl font-bold text-white` - 30px, bold, white
- **Main Text**: `text-white/90` - 90% opacity white
- **Secondary Text**: `text-sm text-white/80` - 14px, 80% opacity white

### **5.3 EXACT MOBILE INSTRUCTIONS SPECIFICATIONS**
```tsx
<p className="text-xs text-white/60 bg-white/5 p-2 border border-white/10">
  💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
</p>
```

**MANDATORY SPECIFICATIONS:**
- **Background**: `bg-white/5` - 5% opacity white background
- **Border**: `border border-white/10` - 10% opacity white border
- **Text**: `text-xs text-white/60` - 12px, 60% opacity white
- **Padding**: `p-2` - 8px padding
- **Emoji**: 💡 - EXACT emoji
- **NO BORDER RADIUS** - Absolutely none

### **5.4 EXACT ACTION BUTTONS SPECIFICATIONS**
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

**MANDATORY SPECIFICATIONS:**
- **Container**: `flex flex-col gap-3` - Vertical stack with 12px gap
- **Continue Button**: `bg-brand-green text-black` - Green background, black text
- **Dashboard Button**: `bg-brand-accent-red text-white` - #E94B29 background, white text
- **Icons**: `ArrowLeft` and `X` with `mr-2 h-4 w-4` - 16px icons with 8px right margin
- **Same shadow system as other buttons**

---

## 6. EXACT COLOR SPECIFICATIONS

### **6.1 MANDATORY BRAND COLORS**
```css
:root {
  --brand-purple-dark: #7c3bed;  /* EXACT - Use for headings */
  --brand-green: #86E589;         /* EXACT - Use for login/reset buttons */
  --brand-orange: #E98144;        /* EXACT - Use for register/forgot buttons */
  --brand-accent-red: #E94B29;    /* EXACT - Use for dashboard button */
  --black: #161B47;               /* EXACT - Use for borders and shadows */
  --white: #ffffff;               /* EXACT - Use for backgrounds and text */
  --gray-600: #6b7280;            /* EXACT - Use for subtitles */
  --gray-500: #9ca3af;            /* EXACT - Use for helper text */
}
```

### **6.2 EXACT SHADOW SPECIFICATIONS**
```css
/* EXACT shadow values - NO MODIFICATIONS */
.shadow-default {
  box-shadow: -4px 4px 0px #161B47;
}

.shadow-hover {
  box-shadow: -2px 2px 0px #161B47;
}

.shadow-active {
  box-shadow: 0px 0px 0px #161B47;
}
```

---

## 7. EXACT TYPOGRAPHY SPECIFICATIONS

### **7.1 MANDATORY FONT FAMILY**
```css
/* EXACT font family - NO SUBSTITUTIONS */
body {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}
```

### **7.2 EXACT FONT SIZES**
```css
/* EXACT font sizes - NO MODIFICATIONS */
.auth-heading {
  font-size: 1.875rem; /* 30px - EXACT */
  font-weight: 700;    /* Bold - EXACT */
  line-height: 1.2;    /* EXACT */
}

.auth-subtitle {
  font-size: 1rem;     /* 16px - EXACT */
  font-weight: 400;    /* Regular - EXACT */
  line-height: 1.5;    /* EXACT */
}

.auth-label {
  font-size: 0.875rem; /* 14px - EXACT */
  font-weight: 500;    /* Medium - EXACT */
  line-height: 1.4;    /* EXACT */
}

.auth-button {
  font-size: 1rem;     /* 16px - EXACT */
  font-weight: 500;    /* Medium - EXACT */
  line-height: 1.5;    /* EXACT */
}
```

---

## 8. EXACT SPACING SPECIFICATIONS

### **8.1 MANDATORY SPACING VALUES**
```css
/* EXACT spacing - NO MODIFICATIONS */
.auth-container {
  padding: 2rem;       /* 32px - EXACT */
  margin: 0;           /* 0px - EXACT */
}

.auth-form {
  padding: 2rem;       /* 32px - EXACT */
  gap: 1.5rem;         /* 24px - EXACT */
}

.auth-button {
  height: 2.5rem;      /* 40px - EXACT */
  padding: 0.5rem 1rem; /* 8px 16px - EXACT */
}

.auth-input {
  height: 2.5rem;      /* 40px - EXACT */
  padding: 0.5rem 0.75rem; /* 8px 12px - EXACT */
}
```

---

## 9. EXACT BORDER SPECIFICATIONS

### **9.1 MANDATORY BORDER VALUES**
```css
/* EXACT borders - NO MODIFICATIONS */
.auth-form {
  border: 2px solid #000000;  /* 2px solid black - EXACT */
}

.auth-input {
  border: 2px solid #000000;  /* 2px solid black - EXACT */
}

.auth-button {
  border: 2px solid #000000;  /* 2px solid black - EXACT */
}

/* CRITICAL: NO BORDER RADIUS ANYWHERE */
* {
  border-radius: 0 !important;  /* FORCE NO RADIUS */
}
```

---

## 10. EXACT ANIMATION SPECIFICATIONS

### **10.1 MANDATORY ANIMATION VALUES**
```tsx
// EXACT animation - NO MODIFICATIONS
<motion.div
  initial={{ opacity: 0, y: 20 }}    // EXACT initial state
  animate={{ opacity: 1, y: 0 }}     // EXACT final state
  transition={{ duration: 0.5 }}     // EXACT duration
>
```

**MANDATORY SPECIFICATIONS:**
- **Initial Opacity**: `0` - Invisible
- **Initial Y**: `20` - 20px down
- **Final Opacity**: `1` - Visible
- **Final Y**: `0` - Original position
- **Duration**: `0.5` - 500ms
- **Easing**: Default ease-out

---

## 11. EXACT ICON SPECIFICATIONS

### **11.1 MANDATORY ICON SIZES**
```tsx
// EXACT icon sizes - NO MODIFICATIONS
<Loader2 className="mr-2 h-4 w-4 animate-spin" />     // 16px loading spinner
<ArrowRight className="w-4 h-4 ml-2" />              // 16px arrow
<CheckCircle className="w-8 h-8 text-black" />       // 32px checkmark
<Lock className="w-6 h-6 text-black" />              // 24px lock
<MailCheck className="w-16 h-16 mx-auto text-brand-green" /> // 64px mail check
<Eye className="h-4 w-4"/>                           // 16px eye
<EyeOff className="h-4 w-4"/>                        // 16px eye off
<X className="mr-2 h-4 w-4" />                       // 16px X
<ArrowLeft className="mr-2 h-4 w-4" />               // 16px arrow left
```

---

## 12. EXACT RESPONSIVE SPECIFICATIONS

### **12.1 MANDATORY BREAKPOINTS**
```css
/* EXACT breakpoints - NO MODIFICATIONS */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;        /* 16px - EXACT */
    margin: 0.5rem;       /* 8px - EXACT */
  }
  
  .auth-form {
    max-width: 100%;      /* Full width - EXACT */
    padding: 1.5rem;      /* 24px - EXACT */
  }
}

@media (min-width: 769px) {
  .auth-container {
    padding: 2rem;        /* 32px - EXACT */
  }
  
  .auth-form {
    padding: 2rem;        /* 32px - EXACT */
  }
}
```

---

## 🚨 FINAL CRITICAL INSTRUCTIONS

### **ABSOLUTE REQUIREMENTS:**
1. **ZERO BORDER RADIUS** - Every single element must have sharp corners
2. **EXACT COLORS** - Use only the specified brand colors (#7c3bed, #86E589, #E98144, #E94B29, #161B47)
3. **EXACT LAYOUT** - Follow the precise structure shown in the ASCII diagrams
4. **EXACT SPACING** - Use only the specified measurements (32px, 24px, 16px, 8px)
5. **EXACT TYPOGRAPHY** - Space Grotesk font family only
6. **EXACT SHADOWS** - Use only the specified shadow values (-4px 4px 0px #161B47)
7. **EXACT ANIMATIONS** - Use only the specified Framer Motion values
8. **EXACT ICONS** - Use only the specified Lucide React icons with exact sizes

### **FORBIDDEN MODIFICATIONS:**
- ❌ NO border radius anywhere
- ❌ NO color changes
- ❌ NO spacing modifications
- ❌ NO font substitutions
- ❌ NO shadow modifications
- ❌ NO layout changes
- ❌ NO animation modifications
- ❌ NO icon substitutions

### **MANDATORY IMPLEMENTATION:**
- ✅ Use EXACT class names provided
- ✅ Use EXACT color values provided
- ✅ Use EXACT spacing values provided
- ✅ Use EXACT shadow values provided
- ✅ Use EXACT animation values provided
- ✅ Use EXACT icon specifications provided
- ✅ Follow EXACT layout structure provided

**IMPLEMENT EXACTLY AS SPECIFIED. NO DEVIATIONS. NO "IMPROVEMENTS". NO "MODERNIZATIONS".**
