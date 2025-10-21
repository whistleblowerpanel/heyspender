# 🧪 Admin Dashboard Refresh Bug - Manual Testing Guide

## 🎯 Test Objective
Verify that refreshing the browser while on any admin dashboard page does NOT redirect to login.

---

## 📋 **Test Checklist - DO THESE TESTS:**

### **Setup:**
1. Open browser
2. Navigate to: `http://localhost:3000`
3. Login with: `gq@whistleblower.ng` / `ILOVEwhistle`
4. Verify you're redirected to `/admin/dashboard/users`

---

### **Test 1: Users Tab Refresh**
- [  ] Current URL: `/admin/dashboard/users`
- [  ] Hit **Cmd+R** (Mac) or **F5** (Windows) or click browser refresh button
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/users`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 2: Wishlists Tab Refresh**
- [  ] Click **Wishlists** tab in bottom nav
- [  ] Current URL: `/admin/dashboard/wishlists`
- [  ] Hit **browser refresh**
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/wishlists`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 3: Payouts Tab Refresh**
- [  ] Click **Payouts** tab in bottom nav
- [  ] Current URL: `/admin/dashboard/payouts`
- [  ] Hit **browser refresh**
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/payouts`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 4: Transactions Tab Refresh**
- [  ] Click **Transactions** tab in bottom nav
- [  ] Current URL: `/admin/dashboard/transactions`
- [  ] Hit **browser refresh**
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/transactions`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 5: Notifications Tab Refresh**
- [  ] Click **Notifications** tab in bottom nav
- [  ] Current URL: `/admin/dashboard/notifications`
- [  ] Hit **browser refresh**
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/notifications`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 6: Settings Tab Refresh**
- [  ] Click **Settings** tab in bottom nav
- [  ] Current URL: `/admin/dashboard/settings`
- [  ] Hit **browser refresh**
- [  ] **Expected**: Page reloads, stays on `/admin/dashboard/settings`
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 7: Multiple Rapid Refreshes**
- [  ] On any admin page
- [  ] Hit **refresh 3-5 times quickly**
- [  ] **Expected**: Page reloads each time, stays on admin dashboard
- [  ] **Bug if**: Redirects to `/auth/login` at any point
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 8: Refresh After Data Load**
- [  ] Go to **Users** tab
- [  ] Wait for data to fully load (table shows users)
- [  ] Hit **refresh**
- [  ] **Expected**: Page reloads, data reloads, stays on users tab
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 9: Refresh Data Button**
- [  ] On any tab
- [  ] Click **"Refresh Data"** button in top right
- [  ] **Expected**: Data refreshes, stays on same tab
- [  ] **Bug if**: Redirects to `/auth/login` or changes tab
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

### **Test 10: Direct URL Access After Refresh**
- [  ] Copy URL from browser (e.g., `/admin/dashboard/payouts`)
- [  ] Paste in new tab
- [  ] Hit **refresh** on new tab
- [  ] **Expected**: Page loads, stays on payouts
- [  ] **Bug if**: Redirects to `/auth/login`
- [  ] **Status**: ✅ PASS / ❌ FAIL

---

## 🔍 **What to Look For:**

### **✅ PASSING (Good):**
- Brief loading spinner appears
- Page content reloads
- URL stays the same
- You remain logged in
- Active tab stays highlighted
- Stats cards reload
- Table data refreshes

### **❌ FAILING (Bug Still Present):**
- Redirects to `/auth/login`
- You have to log in again
- URL changes to login page
- Error toast appears
- Console shows errors

---

## 📊 **Test Results Summary:**

After completing all tests, count:
- **Passed**: _____ / 10
- **Failed**: _____ / 10

### **If ALL PASS (10/10):**
✅ Bug is fixed! Refresh works on all admin pages!

### **If ANY FAIL:**
❌ Bug still present. Report which test failed and I'll investigate further.

---

## 💡 **Console Monitoring (Optional)**

Open browser DevTools (F12) and watch for:

### **Good Logs (No Bug):**
```
Auth state change: INITIAL_SESSION [user-id]
Auth user updated: [user-id] gq@whistleblower.ng role: admin verified: true
```

### **Bad Logs (Bug Present):**
```
Redirecting non-admin user, role: undefined
User is not admin, redirecting. Role: undefined
```

---

## 🐛 **If Bug Still Occurs:**

Check these:
1. Is `roleLoaded` state being set to `true`?
2. Does console show "role: admin" before redirect?
3. Is there a timing issue with role fetch?
4. Are there any JavaScript errors in console?

---

## 📝 **Report Results:**

After testing, let me know:
1. Which tests passed ✅
2. Which tests failed ❌
3. Any console errors or warnings
4. Exact behavior when bug occurs

I'll fix any remaining issues immediately!

---

**Start Testing Now!** 🚀

