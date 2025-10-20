# EXACT FOOTER DESIGN SPECIFICATION - NO MODIFICATIONS ALLOWED

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

## 1. FOOTER - EXACT SPECIFICATIONS

### **1.1 EXACT LAYOUT STRUCTURE**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    FOOTER CONTENT                       │   │
│  │                                                         │   │
│  │  ┌─────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │   BRAND     │ │ PRODUCT │ │ COMPANY │ │ THEME   │   │   │
│  │  │             │ │         │ │         │ │         │   │   │
│  │  │ [LOGO]      │ │ Explore │ │ About   │ │ [🖥️]    │   │   │
│  │  │             │ │ Dashboard│ │ Contact │ │ [☀️]    │   │   │
│  │  │ Description │ │ Pricing │ │ Privacy │ │ [🌙]    │   │   │
│  │  │             │ │ FAQ     │ │ Terms   │ │         │   │   │
│  │  │ Made with ❤️│ │         │ │         │ │         │   │   │
│  │  │ by Express  │ │         │ │         │ │         │   │   │
│  │  └─────────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                BOTTOM BAR                       │   │   │
│  │  │                                                 │   │   │
│  │  │ [🐦] [📷] [📘] [📺]    © 2024 HeySpender      │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **1.2 EXACT FOOTER CONTAINER SPECIFICATIONS**
```tsx
<footer className="mt-auto bg-brand-purple">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
    {/* EXACTLY THIS STRUCTURE - NO CHANGES */}
  </div>
</footer>
```

**MANDATORY SPECIFICATIONS:**
- **Footer**: `mt-auto bg-brand-purple` - Auto margin top, purple background
- **Container**: `max-w-7xl mx-auto` - 1280px max width, centered
- **Padding**: `px-4 sm:px-6 lg:px-8` - Responsive horizontal padding
- **Vertical Padding**: `py-12` - 48px top and bottom padding
- **Text Color**: `text-white` - White text throughout
- **NO BORDER RADIUS** - Absolutely none

### **1.3 EXACT GRID LAYOUT SPECIFICATIONS**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
  {/* EXACTLY THIS STRUCTURE - NO CHANGES */}
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Mobile**: `grid-cols-1` - Single column on mobile
- **Small**: `sm:grid-cols-2` - Two columns on small screens
- **Large**: `lg:grid-cols-5` - Five columns on large screens
- **Gap**: `gap-10` - 40px gap between grid items

---

## 2. BRAND SECTION - EXACT SPECIFICATIONS

### **2.1 EXACT BRAND CONTAINER SPECIFICATIONS**
```tsx
<div className="col-span-1 lg:col-span-2">
  <div className="flex items-center">
    <img src="/HeySpenderMedia/General/HeySpender Logoo.webp" alt="HeySpender" className="h-18 sm:h-20" />
  </div>
  <p className="mt-4 text-sm text-white/80 max-w-sm sm:max-w-md">
    Build thoughtful wishlists, accept contributions securely, and celebrate with the people you love.
  </p>
  <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
    <span>Made with</span>
    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
    <span>by ExpressCreo</span>
  </div>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Column Span**: `col-span-1 lg:col-span-2` - Single column on mobile, double on large
- **Logo Container**: `flex items-center` - Centered logo alignment
- **Logo Image**: `h-18 sm:h-20` - 72px on mobile, 80px on small screens
- **Logo Source**: `/HeySpenderMedia/General/HeySpender Logoo.webp` - EXACT path
- **Logo Alt**: `alt="HeySpender"` - EXACT alt text
- **Description**: `mt-4 text-sm text-white/80 max-w-sm sm:max-w-md` - 16px top margin, 14px text, 80% opacity white
- **Description Text**: "Build thoughtful wishlists, accept contributions securely, and celebrate with the people you love." - EXACT text
- **Made With**: `mt-4 flex items-center gap-2 text-sm text-white/80` - 16px top margin, flex row, 8px gap
- **Made With Text**: "Made with" and "by ExpressCreo" - EXACT text
- **Heart Icon**: `Heart` with `w-4 h-4 text-pink-500 fill-pink-500` - 16px pink filled heart

---

## 3. PRODUCT LINKS SECTION - EXACT SPECIFICATIONS

### **3.1 EXACT PRODUCT CONTAINER SPECIFICATIONS**
```tsx
<div className="ml-8 lg:ml-12">
  <p className="font-semibold text-white mb-3">Product</p>
  <ul className="space-y-2 text-sm text-white/80">
    <li><Link href="/explore" className="hover:text-white">Explore</Link></li>
    <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
    <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
    <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
  </ul>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `ml-8 lg:ml-12` - 32px left margin on mobile, 48px on large
- **Heading**: `font-semibold text-white mb-3` - Semibold white text, 12px bottom margin
- **Heading Text**: "Product" - EXACT text
- **List**: `space-y-2 text-sm text-white/80` - 8px vertical spacing, 14px text, 80% opacity white
- **Links**: `hover:text-white` - White text on hover
- **Link Text**: "Explore", "Dashboard", "Pricing", "FAQ" - EXACT text
- **Link Paths**: `/explore`, `/dashboard`, `/pricing`, `/faq` - EXACT paths

---

## 4. COMPANY LINKS SECTION - EXACT SPECIFICATIONS

### **4.1 EXACT COMPANY CONTAINER SPECIFICATIONS**
```tsx
<div className="ml-8">
  <p className="font-semibold text-white mb-3">Company</p>
  <ul className="space-y-2 text-sm text-white/80">
    <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
    <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
    <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
    <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
  </ul>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `ml-8` - 32px left margin
- **Heading**: `font-semibold text-white mb-3` - Semibold white text, 12px bottom margin
- **Heading Text**: "Company" - EXACT text
- **List**: `space-y-2 text-sm text-white/80` - 8px vertical spacing, 14px text, 80% opacity white
- **Links**: `hover:text-white` - White text on hover
- **Link Text**: "About Us", "Contact", "Privacy Policy", "Terms of Service" - EXACT text
- **Link Paths**: `/about-us`, `/contact`, `/privacy-policy`, `/terms-of-service` - EXACT paths

---

## 5. THEME TOGGLE SECTION - EXACT SPECIFICATIONS

### **5.1 EXACT THEME CONTAINER SPECIFICATIONS**
```tsx
<div className="ml-8">
  <p className="font-semibold text-white mb-3">Theme</p>
  <div className="flex gap-3">
    <button className="flex items-center justify-center w-8 h-8 bg-brand-green border-2 border-black shadow-[-2px_2px_0px_#161B47] hover:shadow-[-1px_1px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 text-black">
      <Monitor className="w-4 h-4" />
    </button>
    <button className="flex items-center justify-center w-8 h-8 border-2 border-black shadow-[-2px_2px_0px_#161B47] hover:shadow-[-1px_1px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 text-white">
      <Sun className="w-4 h-4" />
    </button>
    <button className="flex items-center justify-center w-8 h-8 border-2 border-black shadow-[-2px_2px_0px_#161B47] hover:shadow-[-1px_1px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 text-white">
      <Moon className="w-4 h-4" />
    </button>
  </div>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `ml-8` - 32px left margin
- **Heading**: `font-semibold text-white mb-3` - Semibold white text, 12px bottom margin
- **Heading Text**: "Theme" - EXACT text
- **Button Container**: `flex gap-3` - Flex row with 12px gap
- **Button Size**: `w-8 h-8` - 32px square buttons
- **Button Alignment**: `flex items-center justify-center` - Centered content
- **System Button**: `bg-brand-green` - Green background (#86E589)
- **System Button Text**: `text-black` - Black text
- **Sun/Moon Buttons**: No background, `text-white` - White text
- **Border**: `border-2 border-black` - 2px solid black border
- **Shadow**: `shadow-[-2px_2px_0px_#161B47]` - EXACT shadow value
- **Hover Shadow**: `hover:shadow-[-1px_1px_0px_#161B47]` - EXACT hover shadow
- **Active Shadow**: `active:shadow-[0px_0px_0px_#161B47]` - EXACT active shadow
- **Active Brightness**: `active:brightness-90` - 90% brightness when active
- **Transition**: `transition-all duration-150` - 150ms transition
- **Icons**: `Monitor`, `Sun`, `Moon` with `w-4 h-4` - 16px icons
- **NO BORDER RADIUS** - Absolutely none

---

## 6. BOTTOM BAR SECTION - EXACT SPECIFICATIONS

### **6.1 EXACT BOTTOM BAR CONTAINER SPECIFICATIONS**
```tsx
<div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-4 text-white/80">
    <a href="#" aria-label="X" className="hover:text-white"><Twitter className="w-4 h-4" /></a>
    <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="w-4 h-4" /></a>
    <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="w-4 h-4" /></a>
    <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube className="w-4 h-4" /></a>
  </div>
  <p className="text-sm text-white/70">© {currentYear} HeySpender. All rights reserved.</p>
</div>
```

**MANDATORY SPECIFICATIONS:**
- **Container**: `mt-10 pt-6 border-t border-white/20` - 40px top margin, 24px top padding, white border
- **Layout**: `flex flex-col md:flex-row items-center justify-between gap-4` - Column on mobile, row on medium+, centered, space between, 16px gap
- **Social Container**: `flex items-center gap-4 text-white/80` - Flex row, centered, 16px gap, 80% opacity white
- **Social Links**: `hover:text-white` - White text on hover
- **Social Icons**: `Twitter`, `Instagram`, `Facebook`, `Youtube` with `w-4 h-4` - 16px icons
- **Social Labels**: `aria-label="X"`, `aria-label="Instagram"`, `aria-label="Facebook"`, `aria-label="YouTube"` - EXACT labels
- **Copyright**: `text-sm text-white/70` - 14px text, 70% opacity white
- **Copyright Text**: "© {currentYear} HeySpender. All rights reserved." - EXACT text with dynamic year

---

## 7. EXACT COLOR SPECIFICATIONS

### **7.1 MANDATORY BRAND COLORS**
```css
:root {
  --brand-purple: #7c3bed;        /* EXACT - Footer background */
  --brand-green: #86E589;         /* EXACT - System theme button */
  --black: #161B47;               /* EXACT - Borders and shadows */
  --white: #ffffff;               /* EXACT - Text and borders */
  --pink-500: #ec4899;            /* EXACT - Heart icon */
}
```

### **7.2 EXACT TEXT COLOR SPECIFICATIONS**
```css
/* EXACT text colors - NO MODIFICATIONS */
.footer-heading {
  color: #ffffff;                 /* Pure white - EXACT */
}

.footer-text {
  color: rgba(255, 255, 255, 0.8); /* 80% opacity white - EXACT */
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.7); /* 70% opacity white - EXACT */
}

.footer-border {
  border-color: rgba(255, 255, 255, 0.2); /* 20% opacity white - EXACT */
}
```

---

## 8. EXACT SHADOW SPECIFICATIONS

### **8.1 MANDATORY SHADOW VALUES**
```css
/* EXACT shadow values - NO MODIFICATIONS */
.theme-button-shadow {
  box-shadow: -2px 2px 0px #161B47;  /* EXACT default shadow */
}

.theme-button-hover {
  box-shadow: -1px 1px 0px #161B47;  /* EXACT hover shadow */
}

.theme-button-active {
  box-shadow: 0px 0px 0px #161B47;   /* EXACT active shadow */
}
```

---

## 9. EXACT TYPOGRAPHY SPECIFICATIONS

### **9.1 MANDATORY FONT FAMILY**
```css
/* EXACT font family - NO SUBSTITUTIONS */
footer {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}
```

### **9.2 EXACT FONT SIZES**
```css
/* EXACT font sizes - NO MODIFICATIONS */
.footer-heading {
  font-size: 0.875rem;  /* 14px - EXACT */
  font-weight: 600;     /* Semibold - EXACT */
  line-height: 1.4;     /* EXACT */
}

.footer-text {
  font-size: 0.875rem;  /* 14px - EXACT */
  font-weight: 400;     /* Regular - EXACT */
  line-height: 1.5;     /* EXACT */
}

.footer-copyright {
  font-size: 0.875rem;  /* 14px - EXACT */
  font-weight: 400;     /* Regular - EXACT */
  line-height: 1.5;     /* EXACT */
}
```

---

## 10. EXACT SPACING SPECIFICATIONS

### **10.1 MANDATORY SPACING VALUES**
```css
/* EXACT spacing - NO MODIFICATIONS */
.footer-container {
  padding: 3rem 1rem;   /* 48px vertical, 16px horizontal - EXACT */
}

.footer-grid {
  gap: 2.5rem;          /* 40px - EXACT */
}

.footer-section {
  margin-left: 2rem;    /* 32px - EXACT */
}

.footer-section-large {
  margin-left: 3rem;    /* 48px - EXACT */
}

.footer-heading {
  margin-bottom: 0.75rem; /* 12px - EXACT */
}

.footer-list {
  gap: 0.5rem;          /* 8px - EXACT */
}

.footer-bottom {
  margin-top: 2.5rem;   /* 40px - EXACT */
  padding-top: 1.5rem;  /* 24px - EXACT */
}

.footer-social {
  gap: 1rem;            /* 16px - EXACT */
}

.footer-theme-buttons {
  gap: 0.75rem;         /* 12px - EXACT */
}
```

---

## 11. EXACT RESPONSIVE SPECIFICATIONS

### **11.1 MANDATORY BREAKPOINTS**
```css
/* EXACT breakpoints - NO MODIFICATIONS */
@media (max-width: 640px) {
  .footer-container {
    padding: 3rem 1rem;  /* 48px vertical, 16px horizontal - EXACT */
  }
  
  .footer-grid {
    grid-template-columns: 1fr;  /* Single column - EXACT */
  }
  
  .footer-section {
    margin-left: 2rem;   /* 32px - EXACT */
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .footer-container {
    padding: 3rem 1.5rem; /* 48px vertical, 24px horizontal - EXACT */
  }
  
  .footer-grid {
    grid-template-columns: repeat(2, 1fr); /* Two columns - EXACT */
  }
  
  .footer-section {
    margin-left: 2rem;   /* 32px - EXACT */
  }
}

@media (min-width: 1025px) {
  .footer-container {
    padding: 3rem 2rem;  /* 48px vertical, 32px horizontal - EXACT */
  }
  
  .footer-grid {
    grid-template-columns: repeat(5, 1fr); /* Five columns - EXACT */
  }
  
  .footer-section {
    margin-left: 2rem;   /* 32px - EXACT */
  }
  
  .footer-section-large {
    margin-left: 3rem;   /* 48px - EXACT */
  }
}
```

---

## 12. EXACT ICON SPECIFICATIONS

### **12.1 MANDATORY ICON SIZES**
```tsx
// EXACT icon sizes - NO MODIFICATIONS
<Heart className="w-4 h-4 text-pink-500 fill-pink-500" />     // 16px pink filled heart
<Monitor className="w-4 h-4" />                              // 16px monitor
<Sun className="w-4 h-4" />                                  // 16px sun
<Moon className="w-4 h-4" />                                 // 16px moon
<Twitter className="w-4 h-4" />                              // 16px twitter
<Instagram className="w-4 h-4" />                            // 16px instagram
<Facebook className="w-4 h-4" />                             // 16px facebook
<Youtube className="w-4 h-4" />                              // 16px youtube
```

### **12.2 EXACT ICON COLORS**
```css
/* EXACT icon colors - NO MODIFICATIONS */
.heart-icon {
  color: #ec4899;        /* Pink - EXACT */
  fill: #ec4899;         /* Pink fill - EXACT */
}

.theme-icons {
  color: #000000;        /* Black for system button - EXACT */
  color: #ffffff;        /* White for sun/moon buttons - EXACT */
}

.social-icons {
  color: rgba(255, 255, 255, 0.8); /* 80% opacity white - EXACT */
}
```

---

## 13. EXACT ANIMATION SPECIFICATIONS

### **13.1 MANDATORY TRANSITION VALUES**
```css
/* EXACT transitions - NO MODIFICATIONS */
.theme-button {
  transition: all 0.15s ease;  /* 150ms - EXACT */
}

.theme-button:hover {
  transform: translate(0, 0);   /* No transform - EXACT */
}

.theme-button:active {
  filter: brightness(0.9);      /* 90% brightness - EXACT */
}
```

---

## 14. EXACT ACCESSIBILITY SPECIFICATIONS

### **14.1 MANDATORY ARIA LABELS**
```tsx
// EXACT aria labels - NO MODIFICATIONS
<a href="#" aria-label="X" className="hover:text-white">
<a href="#" aria-label="Instagram" className="hover:text-white">
<a href="#" aria-label="Facebook" className="hover:text-white">
<a href="#" aria-label="YouTube" className="hover:text-white">
```

### **14.2 EXACT ALT TEXT**
```tsx
// EXACT alt text - NO MODIFICATIONS
<img src="/HeySpenderMedia/General/HeySpender Logoo.webp" alt="HeySpender" className="h-18 sm:h-20" />
```

---

## 15. EXACT CONTENT SPECIFICATIONS

### **15.1 MANDATORY TEXT CONTENT**
```tsx
// EXACT text content - NO MODIFICATIONS
const footerContent = {
  description: "Build thoughtful wishlists, accept contributions securely, and celebrate with the people you love.",
  madeWith: "Made with",
  madeBy: "by ExpressCreo",
  productHeading: "Product",
  companyHeading: "Company",
  themeHeading: "Theme",
  copyright: "© {currentYear} HeySpender. All rights reserved.",
  productLinks: ["Explore", "Dashboard", "Pricing", "FAQ"],
  companyLinks: ["About Us", "Contact", "Privacy Policy", "Terms of Service"]
};
```

### **15.2 MANDATORY LINK PATHS**
```tsx
// EXACT link paths - NO MODIFICATIONS
const footerLinks = {
  product: ["/explore", "/dashboard", "/pricing", "/faq"],
  company: ["/about-us", "/contact", "/privacy-policy", "/terms-of-service"],
  social: ["#", "#", "#", "#"] // Placeholder links
};
```

---

## 🚨 FINAL CRITICAL INSTRUCTIONS

### **ABSOLUTE REQUIREMENTS:**
1. **ZERO BORDER RADIUS** - Every single element must have sharp corners
2. **EXACT COLORS** - Use only the specified brand colors (#7c3bed, #86E589, #ec4899, #161B47)
3. **EXACT LAYOUT** - Follow the precise structure shown in the ASCII diagram
4. **EXACT SPACING** - Use only the specified measurements (48px, 40px, 32px, 24px, 16px, 12px, 8px)
5. **EXACT TYPOGRAPHY** - Space Grotesk font family only
6. **EXACT SHADOWS** - Use only the specified shadow values (-2px 2px 0px #161B47)
7. **EXACT ICONS** - Use only the specified Lucide React icons with exact sizes
8. **EXACT CONTENT** - Use only the specified text content and link paths

### **FORBIDDEN MODIFICATIONS:**
- ❌ NO border radius anywhere
- ❌ NO color changes
- ❌ NO spacing modifications
- ❌ NO font substitutions
- ❌ NO shadow modifications
- ❌ NO layout changes
- ❌ NO icon substitutions
- ❌ NO content changes
- ❌ NO link path changes

### **MANDATORY IMPLEMENTATION:**
- ✅ Use EXACT class names provided
- ✅ Use EXACT color values provided
- ✅ Use EXACT spacing values provided
- ✅ Use EXACT shadow values provided
- ✅ Use EXACT icon specifications provided
- ✅ Use EXACT content provided
- ✅ Follow EXACT layout structure provided
- ✅ Use EXACT responsive breakpoints provided

**IMPLEMENT EXACTLY AS SPECIFIED. NO DEVIATIONS. NO "IMPROVEMENTS". NO "MODERNIZATIONS".**
