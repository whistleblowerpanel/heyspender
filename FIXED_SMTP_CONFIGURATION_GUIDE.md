# FIXED SMTP CONFIGURATION GUIDE

## 🎯 Problem Identified
✅ **Password reset implementation is working correctly**  
✅ **Issue was with Resend/SMTP configuration**  
✅ **Supabase built-in email service works perfectly**

---

## Step 1: Verify Resend API Key

### 1.1 Check Resend Dashboard
1. Go to [Resend Dashboard](https://resend.com)
2. Navigate to **API Keys**
3. Verify your API key is:
   - ✅ Active (not expired)
   - ✅ Has correct permissions
   - ✅ Not rate-limited
   - ✅ Starts with `re_`

### 1.2 Test API Key
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@heyspender.com",
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Test email from Resend</p>"
  }'
```

---

## Step 2: Correct SMTP Configuration

### 2.1 Supabase Secrets (Update These)
Go to Supabase Dashboard → **Settings** → **Configuration** → **Secrets**

```
RESEND_API_KEY=re_your_actual_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_your_actual_resend_api_key_here
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

**⚠️ Important Changes:**
- **Port changed from 465 to 587** (more reliable)
- **Use the same API key for both RESEND_API_KEY and SMTP_PASSWORD**
- **Verify the API key is correct**

### 2.2 Supabase Auth SMTP Settings
Go to **Authentication** → **Email** → **SMTP Settings**

```
✅ Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.resend.com
- Port: 587 (changed from 465)
- Username: resend
- Password: [Your Resend API Key]
- Sender Email: noreply@heyspender.com
- Sender Name: HeySpender
- Enable TLS: ON
- Enable SSL: OFF (for port 587)
```

---

## Step 3: Alternative SMTP Configuration

### 3.1 If Port 587 Doesn't Work, Try Port 465
```
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_your_api_key
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

**With SSL enabled:**
- Enable TLS: OFF
- Enable SSL: ON

### 3.2 Domain Verification
If using `noreply@heyspender.com`:
1. Go to Resend Dashboard → **Domains**
2. Add `heyspender.com`
3. Add the required DNS records
4. Wait for verification

**Quick Test Option:**
Use `onboarding@resend.dev` for immediate testing (no DNS changes needed)

---

## Step 4: Testing Procedure

### 4.1 Re-enable SMTP
1. Go to Supabase Dashboard → **Authentication** → **Email**
2. **Turn ON** "Enable Custom SMTP"
3. Enter the corrected settings
4. Click **Save**

### 4.2 Test Password Reset
1. Go to `http://localhost:3000/test-password-reset`
2. Enter a test email
3. Click "Test Password Reset"
4. Check email inbox

### 4.3 Verify Results
- ✅ Email should be delivered
- ✅ Reset link should work
- ✅ No "Invalid or Expired Link" errors

---

## Step 5: Common SMTP Issues & Solutions

### 5.1 Authentication Failed
**Problem:** Invalid API key or credentials
**Solution:** 
- Verify API key is correct
- Check Resend account status
- Ensure API key has email sending permissions

### 5.2 Connection Timeout
**Problem:** Wrong port or host
**Solution:**
- Try port 587 with TLS
- Try port 465 with SSL
- Verify smtp.resend.com is accessible

### 5.3 Email Not Delivered
**Problem:** Domain not verified or sender email issues
**Solution:**
- Use `onboarding@resend.dev` for testing
- Verify domain in Resend dashboard
- Check DNS records

### 5.4 Rate Limiting
**Problem:** Too many requests
**Solution:**
- Check Resend usage limits
- Wait before retrying
- Upgrade Resend plan if needed

---

## Step 6: Fallback Options

### 6.1 Keep Built-in Service
If SMTP continues to have issues:
- Keep Supabase built-in email service enabled
- It's reliable and works perfectly
- Consider upgrading later

### 6.2 Alternative Email Services
If Resend doesn't work:
- **SendGrid**: Reliable SMTP service
- **Mailgun**: Good for transactional emails
- **Amazon SES**: Cost-effective option

---

## 🎯 Expected Outcome

After fixing the SMTP configuration:
1. **✅ Password reset emails will be delivered**
2. **✅ Reset links will work properly**
3. **✅ Professional email branding**
4. **✅ No more "Invalid or Expired Link" errors**

---

## 🚀 Ready to Fix?

1. **Update your Resend API key**
2. **Change SMTP port to 587**
3. **Re-enable custom SMTP**
4. **Test the password reset flow**

Let me know the results and I'll help troubleshoot any remaining issues!
