# PASSWORD RESET & EMAIL VERIFICATION - TESTING GUIDE

## 🧪 Comprehensive Testing Checklist

---

## 📋 TEST PREPARATION

### Prerequisites:
- [ ] Dev server running on http://localhost:3001
- [ ] Supabase configured properly
- [ ] Email service working
- [ ] Test email account accessible

---

## 🔐 PASSWORD RESET FLOW

### Test Suite 1: Forgot Password Page

#### Test 1.1: Valid Email
**Steps:**
1. Navigate to http://localhost:3001/auth/forgot-password
2. Enter valid email: `your-test-email@example.com`
3. Click "Send Reset Link"

**Expected:**
- ✅ Button shows loading spinner
- ✅ Success toast: "Password reset link sent to your email!"
- ✅ Page shows "Check Your Email" confirmation
- ✅ Email address displayed correctly
- ✅ "Back to Login" button visible
- ✅ Email received in inbox

**Console Logs:**
```
✅ Supabase auth connection successful
✅ Supabase connection successful
```

---

#### Test 1.2: Invalid Email Format
**Steps:**
1. Navigate to http://localhost:3001/auth/forgot-password
2. Try these invalid emails:
   - `notanemail`
   - `test@`
   - `test@example`
   - `@example.com`

**Expected:**
- ✅ Error toast: "Invalid Email: Please enter a valid email address."
- ✅ Form stays on page
- ✅ Loading state clears immediately
- ✅ No backend request made

---

#### Test 1.3: Email with Whitespace
**Steps:**
1. Navigate to http://localhost:3001/auth/forgot-password
2. Enter email with spaces: ` test@example.com `
3. Click "Send Reset Link"

**Expected:**
- ✅ Email trimmed automatically
- ✅ Request sent successfully
- ✅ Success confirmation shown

---

#### Test 1.4: Nonexistent Email
**Steps:**
1. Navigate to http://localhost:3001/auth/forgot-password
2. Enter email that doesn't exist: `nonexistent@example.com`
3. Click "Send Reset Link"

**Expected:**
- ✅ Error toast shows appropriate message
- ✅ Form stays on page
- ✅ Loading state clears

---

### Test Suite 2: Reset Password Page

#### Test 2.1: Valid Reset Link
**Steps:**
1. Check email for reset link
2. Click the reset link
3. Should navigate to http://localhost:3001/auth/reset-password?...

**Expected:**
- ✅ Page shows loading: "Verifying reset link..."
- ✅ Console log: "🔄 Using PKCE code for password reset..." OR "🔄 Using traditional token..."
- ✅ Console log: "✅ PKCE code exchange successful" OR "✅ Token verification successful"
- ✅ Shows reset password form with:
  - Lock icon
  - "Reset Password" heading
  - New Password field
  - Confirm New Password field
  - Show/hide password toggles
  - "Reset Password" button

---

#### Test 2.2: Password Validation - Too Short
**Steps:**
1. On reset password page
2. Enter password: `pass12` (6 characters)
3. Enter confirm: `pass12`
4. Click "Reset Password"

**Expected:**
- ✅ Error toast: "Password must be at least 8 characters long"
- ✅ Form stays on page
- ✅ Loading state clears

**Test Again:**
- Try `pass123` (7 characters) → Should also show same error ✅

---

#### Test 2.3: Password Validation - Mismatch
**Steps:**
1. On reset password page
2. Enter password: `password123`
3. Enter confirm: `password456`
4. Click "Reset Password"

**Expected:**
- ✅ Error toast: "Passwords do not match"
- ✅ Form stays on page
- ✅ Loading state clears

---

#### Test 2.4: Valid Password Reset
**Steps:**
1. On reset password page
2. Enter password: `newpassword123` (8+ characters)
3. Enter confirm: `newpassword123`
4. Click "Reset Password"

**Expected:**
- ✅ Button shows loading spinner
- ✅ Console log: "🔄 Reset password attempt: {...}"
- ✅ Console log: "Current session: exists"
- ✅ Console log: "Attempting to update password..."
- ✅ Console log: "Password updated successfully"
- ✅ Success toast: "Password reset successfully! You can now log in with your new password."
- ✅ Redirects to /auth/login
- ✅ Can log in with new password

---

#### Test 2.5: Expired/Invalid Reset Link
**Steps:**
1. Use an old/invalid/expired reset link
2. Navigate to reset password page

**Expected:**
- ✅ Page shows loading briefly
- ✅ Console log: "❌ PKCE code exchange failed" OR "❌ Token verification error"
- ✅ Shows "Invalid Link" error page
- ✅ Alert icon displayed
- ✅ Message: "This password reset link is invalid or has expired"
- ✅ "Request New Link" button visible
- ✅ Clicking button goes to /auth/forgot-password

---

#### Test 2.6: Show/Hide Password Toggle
**Steps:**
1. On reset password page
2. Enter password in "New Password" field
3. Click eye icon

**Expected:**
- ✅ Password becomes visible
- ✅ Eye icon changes to EyeOff icon
- ✅ Click again → Password hidden again

**Repeat for Confirm Password field:**
- ✅ Works independently

---

### Test Suite 3: PKCE Flow Validation

#### Test 3.1: PKCE Code Parameter
**Steps:**
1. Check reset link URL format
2. If URL contains `?code=xxx...` parameter

**Expected:**
- ✅ Console log: "🔄 Using PKCE code for password reset..."
- ✅ Console log: "✅ PKCE code exchange successful for password reset"
- ✅ Form shows correctly

---

#### Test 3.2: PKCE Token Parameter
**Steps:**
1. Check reset link URL format
2. If URL contains `?token=pkce_xxx...` parameter

**Expected:**
- ✅ Console log: "🔄 Using PKCE code for password reset..."
- ✅ Console log: "✅ PKCE code exchange successful for password reset"
- ✅ Form shows correctly
- ✅ Handled same as code parameter

---

#### Test 3.3: Traditional Token
**Steps:**
1. Check reset link URL format
2. If URL contains `?token=xxx&type=recovery` (without pkce_ prefix)

**Expected:**
- ✅ Console log: "🔄 Using traditional token for password reset..."
- ✅ Console log: "✅ Token verification successful for password reset"
- ✅ Form shows correctly

---

## ✉️ EMAIL VERIFICATION FLOW

### Test Suite 4: Email Verification

#### Test 4.1: Verification from Registration
**Steps:**
1. Register new user
2. Check email for verification link
3. Click verification link

**Expected:**
- ✅ Navigates to /auth/verify?...
- ✅ Shows "Verifying Your Email..." OR "Email Verified!" 
- ✅ Console log: "🔍 VERIFICATION DEBUG - Full Details"
- ✅ Console log: "✅ User verification status updated in database"
- ✅ Redirects to dashboard after 2 seconds

---

#### Test 4.2: Resend Verification Email
**Steps:**
1. On verification page after registration
2. Click "Resend Verification Email"

**Expected:**
- ✅ Console log: "Resending verification email to: [correct email]"
- ✅ Success toast: "Verification Email Sent" OR Error toast with rate limit message
- ✅ No hardcoded fallback email used
- ✅ New email received (if not rate limited)

---

#### Test 4.3: Verification Link - Already Verified
**Steps:**
1. Click verification link for already-verified user
2. OR Navigate to /auth/verify with verified session

**Expected:**
- ✅ Shows "Email Verified!" success page
- ✅ Green checkmark icon
- ✅ "Go to Dashboard" button
- ✅ Clicking button goes to dashboard

---

#### Test 4.4: Expired Verification Link
**Steps:**
1. Use old/expired verification link
2. Click link

**Expected:**
- ✅ Shows "Verification Failed" error page
- ✅ Red alert icon
- ✅ Error message about expired link
- ✅ "Resend Verification Email" button
- ✅ "Go to Login" button

---

## 🔍 CONSOLE LOG CHECKLIST

### Successful Password Reset:
```
✅ "🔍 RESET PASSWORD DEBUG - Token Check: {token: ..., type: ..., code: ...}"
✅ "🔄 Using PKCE code for password reset..." OR "🔄 Using traditional token..."
✅ "✅ PKCE code exchange successful" OR "✅ Token verification successful"
✅ "🔍 RESET PASSWORD DEBUG - Form Data: {...}"
✅ "🔄 Reset password attempt: {...}"
✅ "Current session: exists"
✅ "Attempting to update password..."
✅ "Password updated successfully"
```

### Failed Token Validation:
```
❌ "❌ Missing required parameters: {hasAuthCode: false, hasTraditionalToken: false}"
❌ "❌ PKCE code exchange failed: [error]"
❌ "❌ Token verification error: [error]"
```

### Email Validation:
```
✅ Supabase auth connection successful
✅ Supabase connection successful
✅ "Resending verification email to: [email]"
```

---

## ✅ SUCCESS CRITERIA

### All Tests Pass If:
- ✅ Invalid email formats caught before submission
- ✅ Passwords under 8 characters rejected consistently
- ✅ Mismatched passwords caught
- ✅ Valid passwords reset successfully
- ✅ Can log in with new password
- ✅ PKCE flow works for all token formats
- ✅ Invalid/expired links show error page
- ✅ Email verification works
- ✅ Resend email uses correct address
- ✅ No hardcoded fallbacks
- ✅ All console logs show expected messages
- ✅ No errors in browser console

---

## 🐛 COMMON ISSUES

### Issue: "Invalid Email" not showing
**Cause:** Validation not working
**Check:** 
- Ensure fixes were applied to forgot-password/page.tsx
- Check `validateEmail` function exists
- Verify toast is called

### Issue: Can set 6-character password
**Cause:** Fix not applied
**Check:**
- Ensure reset-password/page.tsx line 146 checks `< 8` not `< 6`
- Refresh browser cache

### Issue: "Invalid Link" shown immediately
**Cause:** Token not being passed correctly
**Check:**
- URL parameters (token, code, type)
- Console logs for token check
- Supabase auth configuration

### Issue: Password reset fails silently
**Cause:** Session not established
**Check:**
- Token was validated successfully
- Session exists before update attempt
- Console logs show session check

---

## 📊 TESTING MATRIX

| Test Case | Password Reset | Email Verification | Status |
|-----------|---------------|-------------------|--------|
| Valid input | ✅ Must pass | ✅ Must pass | Required |
| Invalid format | ✅ Must catch | ✅ Must catch | Required |
| Expired link | ✅ Must show error | ✅ Must show error | Required |
| PKCE code | ✅ Must work | ✅ Must work | Required |
| PKCE token | ✅ Must work | ✅ Must work | Required |
| Traditional token | ✅ Must work | N/A | Required |
| Rate limiting | ⚠️ Supabase handles | ✅ Must show error | Required |
| Password < 8 chars | ✅ Must reject | N/A | Required |
| Password mismatch | ✅ Must reject | N/A | Required |
| Email trimming | ✅ Must work | N/A | Required |

---

## 🚀 READY TO TEST

1. ✅ All fixes applied
2. ✅ No linter errors
3. ✅ Documentation complete
4. ⏭️ Ready for manual testing

**Follow this guide systematically to ensure all flows work correctly!**

---

**Test Guide Created:** October 22, 2025
**Status:** ✅ READY
**Next Step:** Execute tests following this guide

