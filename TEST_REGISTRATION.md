# QUICK REGISTRATION TEST GUIDE

## 🚀 Quick Test Steps

### 1. Test Valid Registration
```bash
# Open in browser: http://localhost:3000/auth/register

# Fill in:
Username: testuser123
Email: your-test-email@example.com
Password: testpass123
Full Name: Test User

# Expected: Success toast → Redirect to verification page
```

### 2. Test Duplicate Username
```bash
# Try registering again with same username
Username: testuser123 (same)
Email: different@example.com (different)

# Expected: Error - "Username is already taken"
```

### 3. Test Invalid Username
```bash
# Try: "test user" (with space)
# Expected: Error - "Username must be 3-20 characters..."

# Try: "ab" (too short)
# Expected: Error - "Username must be 3-20 characters..."

# Try: "test@user" (special char)
# Expected: Error - "Username must be 3-20 characters..."
```

### 4. Test Weak Password
```bash
# Try: "pass123" (7 chars)
# Expected: Error - "Password must be at least 8 characters"
```

### 5. Test Resend Email
```bash
# After successful registration
# On verification page, click "Resend Verification Email"
# Expected: Success toast + new email
```

## ✅ Success Indicators

Look for these in browser console:
- `✅ User record created successfully`
- `✅ User record verified in database`
- `✅ Verification email resent successfully`

## ❌ Error Indicators

If you see these, fixes are working:
- Clear error messages in toasts
- No silent failures
- Form stays on page after error
- Loading state clears properly

## 🔍 Check Database

After successful registration:
```sql
-- In Supabase SQL Editor
SELECT id, email, username, full_name, is_active, email_verified_at, role
FROM users
WHERE username = 'testuser123';

-- Expected:
-- id: [UUID]
-- email: your-test-email@example.com
-- username: testuser123
-- full_name: Test User
-- is_active: false
-- email_verified_at: NULL
-- role: user
```

After email verification:
```sql
SELECT id, email, is_active, email_verified_at
FROM users
WHERE username = 'testuser123';

-- Expected:
-- is_active: true
-- email_verified_at: [timestamp]
```

## 🐛 If Something Fails

1. Check browser console for error messages
2. Check Network tab for failed requests
3. Check Supabase logs
4. Verify environment variables are set
5. Verify database schema matches expected structure

---

**Quick Start:**
```bash
npm run dev
# Open http://localhost:3000/auth/register
# Follow test steps above
```
