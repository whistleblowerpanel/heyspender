# DISABLE SMTP FOR PASSWORD RESET TESTING

## 🎯 Goal
Disable custom SMTP configuration in Supabase to test password reset with built-in email service and isolate the issue.

---

## Step 1: Disable Custom SMTP in Supabase Dashboard

### 1.1 Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your HeySpender project (`hgvdslcpndmimatvliyu`)
3. Navigate to **Authentication** → **Email**

### 1.2 Disable Custom SMTP
1. Scroll down to **SMTP Settings**
2. **Turn OFF** "Enable Custom SMTP"
3. Click **Save**

### 1.3 Verify Configuration
- Custom SMTP should now be **DISABLED**
- Supabase will use its built-in email service
- This eliminates Resend/SMTP as a potential issue source

---

## Step 2: Update Email Templates (Optional)

### 2.1 Reset Password Template
1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Update with this simple template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7c3bed;">Reset Your Password</h2>
        <p>Hello!</p>
        <p>You requested a password reset for your HeySpender account.</p>
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background-color: #E98144; color: #000; padding: 12px 24px; text-decoration: none; border: 2px solid #000; font-weight: bold;">
                Reset Password
            </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border: 1px solid #ddd;">
            {{ .ConfirmationURL }}
        </p>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this password reset, please ignore this email.</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
            © HeySpender • <a href="mailto:support@heyspender.com">Contact Support</a>
        </p>
    </div>
</body>
</html>
```

---

## Step 3: Local Testing Setup

### 3.1 Start Local Development Server
```bash
cd /Users/gq/Projects/heyspender-nextjs
npm run dev
```

### 3.2 Test Password Reset Flow

#### Test 1: Request Password Reset
1. Open browser to `http://localhost:3000/auth/forgot-password`
2. Enter a test email address
3. Click "Send Reset Link"
4. Check browser console for any errors
5. Check Supabase Dashboard → **Authentication** → **Users** for the reset request

#### Test 2: Check Email Delivery
1. Check the email inbox for the reset email
2. If using Supabase built-in service, emails might go to spam
3. Check Supabase Dashboard → **Authentication** → **Email** → **Email Logs** (if available)

#### Test 3: Test Reset Link
1. Click the reset link from the email
2. Verify it redirects to `http://localhost:3000/auth/reset-password`
3. Check if the page shows "Invalid or Expired Link" or the reset form

---

## Step 4: Debugging Steps

### 4.1 Check Browser Console
- Open Developer Tools (F12)
- Look for any JavaScript errors
- Check Network tab for failed requests

### 4.2 Check Supabase Logs
1. Go to Supabase Dashboard → **Logs**
2. Look for authentication-related errors
3. Check for email sending errors

### 4.3 Test with Different Email Providers
Try testing with:
- Gmail
- Outlook
- Yahoo
- Different email providers to see if it's provider-specific

---

## Step 5: Expected Results

### ✅ If SMTP was the issue:
- Password reset emails will be delivered
- Reset links will work properly
- No more "Invalid or Expired Link" errors

### ❌ If issue persists:
- The problem is not with SMTP/Resend
- Issue is likely in the password reset flow implementation
- Need to investigate further

---

## Step 6: Re-enable SMTP (After Testing)

### 6.1 If Built-in Service Works:
1. The issue was with Resend/SMTP configuration
2. Fix the SMTP settings before re-enabling
3. Test again with custom SMTP

### 6.2 If Built-in Service Doesn't Work:
1. The issue is in the password reset implementation
2. Keep SMTP disabled until the core issue is fixed
3. Focus on debugging the reset flow

---

## Quick Test Commands

```bash
# Start local server
npm run dev

# Check if server is running
curl http://localhost:3000/auth/forgot-password

# Test password reset API (replace with actual email)
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 🚨 Important Notes

1. **Built-in emails might go to spam** - Check spam folder
2. **Rate limiting** - Supabase has email rate limits
3. **Email templates** - Built-in templates are basic but functional
4. **Local testing** - Use localhost URLs for testing

---

## Next Steps After Testing

Based on the results:
- **If it works**: Fix SMTP configuration and re-enable
- **If it doesn't work**: Debug the password reset implementation
- **Document findings**: Update this guide with results

---

**🎯 Ready to test? Follow these steps and let me know the results!**
