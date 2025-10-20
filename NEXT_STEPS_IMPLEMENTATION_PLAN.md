## HeySpender Next.js – Next Steps and Guard Plan

### Phase 1 — Core Navigation and Layout (Priority 1)
- Create/update `src/components/layout/Navbar.tsx`
- Create `src/components/layout/DashboardLayout.tsx`
- Wire public routes with `<Link />` and verify navigation:
  - `/`, `/about-us`, `/pricing`, `/faq`, `/contact`, `/explore`, `/privacy`, `/terms`

### Phase 2 — Authentication Guards (Priority 2)
- Add `src/components/AuthGuard.tsx` and wrap pages in order:
  - High priority: `/dashboard/*` (all children)
  - High priority: `/admin/*` (all children)
  - Medium priority: `/[username]/*` (profile, wishlists, wishlist items)
  - Low priority (reverse guard): `/auth/*` (redirect authenticated users to `/dashboard`)

Example usage (protected route):
```tsx
<AuthGuard>
  <DashboardLayout>
    {/* page content */}
  </DashboardLayout>
</AuthGuard>
```

Example usage (auth pages):
```tsx
<AuthGuard requireAuth={false}>
  {/* login/register content */}
</AuthGuard>
```

### Phase 3 — Dynamic Routes and Data (Priority 3)
- Ensure `useParams()` is used in:
  - `src/app/[username]/page.tsx` (profile)
  - `src/app/[username]/[slug]/page.tsx` (wishlist)
  - `src/app/[username]/[slug]/[itemId]/page.tsx` (wishlist item)
- Confirm all service calls use extracted params and handle 404 states gracefully.

### Phase 4 — Forms, Payments, and Redirects (Priority 4)
- Replace legacy navigation with Next.js router:
  - `const router = useRouter(); router.push('/dashboard');`
- Validate flows end-to-end:
  - Get Started wizard → created resources visible in dashboard
  - Payment callback `/payment-callback` (verifies, updates wallet, notifies, redirects)

### Pages to Guard First (strict order)
1) `/dashboard/page.tsx`
2) `/dashboard/my-wishlists/page.tsx`
3) `/dashboard/wallet/page.tsx`
4) `/dashboard/spender-list/page.tsx`
5) `/dashboard/analytics/page.tsx`
6) `/dashboard/settings/page.tsx`
7) `/admin/page.tsx`, `/admin/dashboard/page.tsx`
8) `/[username]/page.tsx`, `/[username]/[slug]/page.tsx`, `/[username]/[slug]/[itemId]/page.tsx`
9) Reverse guard `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`

### Mobile-first Priorities
- Bottom navigation inside `DashboardLayout` for mobile
- Mobile menu in `Navbar` (open/close state, focus trap optional)
- Verify interactive controls are finger-friendly (min 44px targets)

### Linking Patterns (do this everywhere)
- Internal links: `import Link from 'next/link'` then `<Link href="/dashboard">Dashboard</Link>`
- Programmatic navigation: `const router = useRouter(); router.push('/dashboard')`
- External/new tab: `window.open(url, '_blank')`

### SEO and Metadata
- Add `export const metadata` to static pages
- Use `generateMetadata` for dynamic profile/wishlist pages

### Testing Checklist (run in this order)
- Navigation
  - All navbar links work (desktop + mobile)
  - Bottom dashboard nav (mobile) works
  - Direct URL access works for each page
- Authentication
  - Unauthed → protected routes redirect to `/auth/login`
  - Authed users visiting `/auth/*` redirect to `/dashboard`
  - Sign-out returns to `/`
- Dynamic Routes
  - `/{username}` renders
  - `/{username}/{slug}` renders
  - `/{username}/{slug}/{itemId}` renders
- Forms & Flows
  - Login/Register/Reset/Verify flows
  - Get Started wizard creates data and redirects
  - Payment callback verifies, updates wallet, creates transaction, redirects
- UI/UX
  - No layout shifts; responsive across breakpoints
  - Buttons/links accessible and keyboard-friendly

### Success Criteria (must-pass before deploy)
- No broken links or 404s on intended routes
- All protected routes enforce auth correctly
- Mobile navigation and desktop sidebar both function
- Dynamic profile/wishlist routes work with real data
- Payment callback path works end-to-end (verify → credit → record → notify → redirect)
- No console errors in critical paths

### Commands & Config
- Start
```bash
npm run dev
```
- Build
```bash
npm run build && npm start
```
- Dependencies (already expected)
```bash
npm i next react react-dom @supabase/supabase-js framer-motion lucide-react
```

### Handover Notes
- If a page depends on contexts (`SupabaseAuthContext`, `WalletContext`, `ConfettiContext`), confirm providers wrap `app` in `src/app/layout.tsx` or a root provider component.
- Preserve visual style: borders `border-2 border-black`, brand colors, and hover shadows.
