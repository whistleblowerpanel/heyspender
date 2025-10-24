# 🖼️ AVIF Image Storage Implementation Guide

## 📋 Overview

This guide explains the new AVIF image conversion feature that provides **60-80% smaller file sizes** and proper cloud storage using Supabase Storage.

---

## ✨ What's New?

### Before (Data URL Approach)
- ❌ Images stored as base64 strings in database
- ❌ Large database size
- ❌ Slow page loads
- ❌ No image optimization

### After (AVIF + Supabase Storage)
- ✅ Images converted to AVIF format (60-80% smaller)
- ✅ Stored in Supabase Storage bucket
- ✅ Fast page loads
- ✅ Organized by folders: `wishlist-covers`, `wishlist-items`, `item-images`
- ✅ Proper cloud storage with CDN

---

## 🚀 Setup Instructions

### Step 1: Environment Variable

Add this to your `.env.local` file:

```env
# Toggle AVIF Storage Feature
NEXT_PUBLIC_USE_AVIF_STORAGE=false  # Set to 'true' to enable AVIF storage
```

### Step 2: Supabase Storage Bucket Setup

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Storage** → **Buckets**
3. Find or create the bucket named: **`HeySpender Media`**
4. Set bucket to **Public** (or configure RLS policies as needed)
5. Create these folders in the bucket:
   - `wishlist-covers`
   - `wishlist-items`
   - `item-images`
   - `General` (fallback)

### Step 3: Get Supabase Service Role Key (If not already set)

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy the **`service_role`** key (secret key)
3. Add to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ Important:** Keep this key secret! Never commit it to Git.

### Step 4: Restart Development Server

```bash
npm run dev
```

---

## 🔄 How to Enable/Disable

### Enable AVIF Storage (New Approach)
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=true
```

### Disable AVIF Storage (Revert to Old Approach)
```env
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

Then restart your server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

**That's it!** No code changes needed. Just toggle the env variable.

---

## 📁 Folder Structure

Images are organized in Supabase Storage:

```
HeySpender Media/
├── wishlist-covers/
│   └── userId-timestamp-random.avif
├── wishlist-items/
│   └── userId-timestamp-random.avif
├── item-images/
│   └── userId-timestamp-random.avif
└── General/
    └── userId-timestamp-random.avif
```

---

## 🛡️ Rollback Safety Features

### Instant Rollback
Change environment variable and restart:
```bash
NEXT_PUBLIC_USE_AVIF_STORAGE=false
```

### Automatic Fallback
If AVIF upload fails, the system automatically falls back to Data URL approach.

### Git Rollback
If needed, revert to backup branch:
```bash
git checkout backup-before-avif-implementation
```

---

## 📊 Expected Improvements

### File Size Reduction
- **JPEG (1MB)** → **AVIF (200-400KB)** = 60-80% savings
- **PNG (2MB)** → **AVIF (300-600KB)** = 70-85% savings

### Performance
- ⚡ Faster page loads (smaller downloads)
- ⚡ Less bandwidth usage
- ⚡ Better user experience

### Storage Costs
- 💰 Smaller database (no base64 strings)
- 💰 Efficient Supabase Storage usage
- 💰 Better scalability

---

## 🧪 Testing Checklist

- [ ] Upload a wishlist cover image
- [ ] Upload a wishlist item image
- [ ] Check that images appear correctly on the page
- [ ] Verify image URL starts with your Supabase URL
- [ ] Check browser console for success logs
- [ ] Test with different image formats (JPG, PNG, WebP)
- [ ] Verify images are in correct Supabase Storage folders

---

## 📝 API Endpoints

### Upload Image
**POST** `/api/upload-image`

**Body** (multipart/form-data):
- `file`: Image file
- `userId`: User ID
- `folder`: Folder name (`wishlist-covers`, `wishlist-items`, `item-images`)

**Response**:
```json
{
  "success": true,
  "url": "https://your-supabase-url.com/storage/v1/object/public/HeySpender%20Media/wishlist-covers/user-123-1234567890-abc123.avif",
  "originalSize": 1048576,
  "compressedSize": 262144,
  "savings": 75,
  "format": "avif",
  "folder": "wishlist-covers"
}
```

### Health Check
**GET** `/api/upload-image`

Returns API status and configuration.

---

## 🔍 Monitoring

### Console Logs

When AVIF is enabled, you'll see:
```
📸 Uploading image: example.jpg (1024.00 KB)
   Storage mode: AVIF + Supabase Storage
   Folder: wishlist-covers
📸 Converting image to AVIF: example.jpg (1048576 bytes)
📤 Uploading to Supabase Storage: wishlist-covers/user-123-1234567890-abc123.avif
✅ Upload successful!
   Original: 1024.00 KB
   AVIF: 256.00 KB
   Savings: 75%
```

When AVIF is disabled (fallback):
```
📸 Uploading image: example.jpg (1024.00 KB)
   Storage mode: Data URL (Legacy)
   Folder: wishlist-covers
✅ Upload successful (Data URL): user-123-1234567890-abc123.jpg
```

---

## 🐛 Troubleshooting

### Issue: Images not uploading
**Solution:** Check that:
- Supabase bucket "HeySpender Media" exists
- Bucket is set to Public
- `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Environment variable is spelled correctly

### Issue: "Upload failed" error
**Solution:** 
- Check browser console for detailed error
- Verify Supabase Storage bucket permissions
- System will auto-fallback to Data URL approach

### Issue: Images too large
**Solution:**
- Increase max file size in `/src/app/api/upload-image/route.js`
- Current limit: 10MB

### Issue: Want to adjust AVIF quality
**Solution:**
Edit in `/src/app/api/upload-image/route.js`:
```javascript
const AVIF_QUALITY = 80; // Change to 60-90 (higher = better quality, larger size)
const AVIF_EFFORT = 4;    // Change to 0-9 (higher = smaller size, slower conversion)
```

---

## 📦 Files Modified

- ✅ `src/app/api/upload-image/route.js` (NEW) - AVIF conversion API
- ✅ `src/lib/supabaseStorageService.js` (UPDATED) - Feature flag support
- ✅ `package.json` (UPDATED) - Added Sharp dependency

---

## 🎯 Next Steps

1. **Test in Development**
   - Set `NEXT_PUBLIC_USE_AVIF_STORAGE=true`
   - Upload some test images
   - Verify everything works

2. **Monitor Performance**
   - Check file sizes in Supabase Storage
   - Compare page load times
   - Monitor storage costs

3. **Deploy to Production** (when ready)
   - Add environment variable to Vercel
   - Deploy and test
   - Monitor for any issues

4. **Optional: Migrate Old Images**
   - Can keep old Data URLs working indefinitely
   - Or migrate gradually to AVIF storage

---

## 💡 Tips

- Start with `NEXT_PUBLIC_USE_AVIF_STORAGE=false` to test safely
- Test thoroughly before enabling in production
- Monitor Supabase Storage usage (free tier: 1GB)
- AVIF is supported in all modern browsers (Chrome, Firefox, Safari 16+)
- Keep the backup branch for easy rollback

---

## 🆘 Need Help?

If something goes wrong:
1. Set `NEXT_PUBLIC_USE_AVIF_STORAGE=false`
2. Restart server
3. Check console logs
4. Revert to backup branch if needed: `git checkout backup-before-avif-implementation`

---

## 📄 License & Credits

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Supabase Storage](https://supabase.com/docs/guides/storage) - Cloud object storage
- [AVIF](https://avif.io/) - Modern image format

---

**Last Updated:** October 23, 2025


