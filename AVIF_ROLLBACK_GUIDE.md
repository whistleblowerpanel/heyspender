# 🔄 AVIF Storage Rollback Guide

## 🚨 Quick Rollback (30 Seconds)

If you need to revert immediately:

### Method 1: Environment Variable Toggle (INSTANT)

1. Open your `.env.local` file
2. Change the value:
   ```env
   NEXT_PUBLIC_USE_AVIF_STORAGE=false
   ```
3. Restart your dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

**Done!** You're back to the old Data URL approach.

---

## 🔙 Complete Rollback Methods

### Method 2: Git Branch Rollback

If you want to completely remove all AVIF code:

```bash
# Switch to backup branch
git checkout backup-before-avif-implementation

# Restore dev server
npm run dev
```

### Method 3: Selective File Rollback

Revert specific files without losing other changes:

```bash
# Revert the storage service
git checkout backup-before-avif-implementation -- src/lib/supabaseStorageService.js

# Remove the API route
rm -rf src/app/api/upload-image

# Uninstall Sharp (optional)
npm uninstall sharp

# Restart
npm run dev
```

---

## 📊 Rollback Scenarios

### Scenario 1: "AVIF uploads are failing"

**Quick Fix:**
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

**Why it works:**
- System automatically falls back to Data URL
- No data loss
- Users can continue uploading

**Next steps:**
- Check Supabase Storage bucket exists
- Verify bucket permissions
- Check service role key in `.env.local`

---

### Scenario 2: "Images not displaying correctly"

**Quick Fix:**
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

**Why it works:**
- Old images (Data URLs) still work
- New uploads use Data URL
- Zero downtime

**Next steps:**
- Check browser AVIF support (should auto-fallback)
- Verify image URLs are accessible
- Check Supabase Storage public access

---

### Scenario 3: "Storage costs are too high"

**Quick Fix:**
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

**Why it works:**
- Stops new uploads to Supabase Storage
- Returns to free Data URL approach
- Can delete old files manually if needed

**Next steps:**
- Review Supabase Storage usage
- Calculate actual costs vs benefits
- Consider adjusting AVIF quality settings

---

### Scenario 4: "Need to completely remove AVIF feature"

**Complete Removal:**

```bash
# 1. Switch to backup branch
git checkout backup-before-avif-implementation

# 2. Create a clean branch from backup
git checkout -b revert-to-stable

# 3. Force push to main (be careful!)
git checkout main
git reset --hard backup-before-avif-implementation

# 4. Clean up dependencies
npm uninstall sharp
npm install

# 5. Restart
npm run dev
```

**⚠️ Warning:** This removes ALL changes made after the backup. Only use if absolutely necessary.

---

## 🧪 Testing After Rollback

After rolling back, verify these work:

- [ ] Can upload wishlist cover images
- [ ] Can upload wishlist item images
- [ ] Images display correctly on wishlists
- [ ] Image preview works in modals
- [ ] No console errors
- [ ] Existing images still load

---

## 📁 Files to Check After Rollback

### If using Method 1 (Env Variable):
- ✅ All files remain unchanged
- ✅ Code is still there but not active
- ✅ Can re-enable anytime

### If using Method 2 (Git Branch):
- ✅ All files restored to pre-AVIF state
- ✅ API route removed
- ✅ Original supabaseStorageService.js restored

### If using Method 3 (Selective):
- ⚠️ Some files may have AVIF code
- ⚠️ Ensure consistency across files
- ⚠️ Test thoroughly

---

## 🔍 Verifying Successful Rollback

### Console Logs

You should see:
```
📸 Uploading image: example.jpg (1024.00 KB)
   Storage mode: Data URL (Legacy)
   Folder: wishlist-covers
✅ Upload successful (Data URL): user-123-1234567890-abc123.jpg
```

**NOT:**
```
   Storage mode: AVIF + Supabase Storage
```

### Database Check

New images should be Data URLs:
```sql
SELECT cover_image_url FROM wishlists ORDER BY created_at DESC LIMIT 1;
```

Should return: `data:image/jpeg;base64,...`

**NOT:** `https://your-supabase-url.com/storage/...`

---

## 🛡️ Safety Features

### Automatic Fallback
Even with AVIF enabled, if upload fails:
- System automatically uses Data URL
- No user disruption
- Error logged in console

### Mixed Storage
- Old Data URLs continue to work
- New AVIF uploads work
- Both can coexist safely

### No Data Loss
- Rollback doesn't delete existing images
- Users can always view old content
- Zero downtime during switch

---

## 📞 Emergency Contacts

### If Rollback Doesn't Work

1. **Stop the server:** `Ctrl+C`
2. **Clear caches:** 
   ```bash
   rm -rf .next
   npm run dev
   ```
3. **Check environment variables:**
   ```bash
   echo $NEXT_PUBLIC_USE_AVIF_STORAGE
   ```
4. **Verify Git branch:**
   ```bash
   git branch --show-current
   ```

---

## 🔄 Re-enabling After Rollback

If you rolled back and want to try again:

```env
# In .env.local
NEXT_PUBLIC_USE_AVIF_STORAGE=true
```

```bash
# Restart server
npm run dev
```

That's it!

---

## 📊 Rollback Decision Matrix

| Issue | Severity | Recommended Action | Downtime |
|-------|----------|-------------------|----------|
| Upload failures | 🔴 High | Method 1 (Env toggle) | 0 min |
| Display issues | 🟡 Medium | Method 1 (Env toggle) | 0 min |
| High costs | 🟢 Low | Method 1 (Env toggle) | 0 min |
| Want clean slate | 🔴 High | Method 2 (Git branch) | 5 min |
| Performance issues | 🟡 Medium | Method 1 (Env toggle) | 0 min |
| Complete removal | 🔴 Critical | Method 4 (Complete removal) | 10 min |

---

## 💡 Best Practices

1. **Always test rollback in development first**
2. **Keep backup branch for at least 30 days**
3. **Document any issues encountered**
4. **Monitor logs after rollback**
5. **Test critical user flows**

---

## 📝 Rollback Checklist

Before rolling back:
- [ ] Identify the issue
- [ ] Check if it's AVIF-related
- [ ] Try simple fixes first
- [ ] Back up current state (if needed)
- [ ] Choose rollback method
- [ ] Execute rollback
- [ ] Verify functionality
- [ ] Monitor for 24 hours
- [ ] Document the issue
- [ ] Plan fix or permanent solution

---

## 🎯 Post-Rollback Actions

### Immediate (0-1 hour)
- [ ] Verify all upload flows work
- [ ] Check existing images display
- [ ] Monitor error logs
- [ ] Test critical user paths

### Short-term (1-24 hours)
- [ ] Analyze what went wrong
- [ ] Check if issue was configuration
- [ ] Consider partial re-enable
- [ ] Monitor user reports

### Long-term (1-7 days)
- [ ] Decide if AVIF is still desired
- [ ] Plan proper fix if needed
- [ ] Consider alternative approaches
- [ ] Update documentation

---

## 🆘 Last Resort

If everything fails:

```bash
# Nuclear option: Clean reinstall
rm -rf node_modules .next
npm install
npm run dev
```

Then set:
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

---

**Remember:** The beauty of the feature flag approach is that you can switch back and forth as many times as needed with zero risk!

**Last Updated:** October 23, 2025


