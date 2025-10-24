# SUPABASE EMAIL CONFIGURATION GUIDE

## 🚨 CRITICAL: Complete Supabase Email Setup

This guide provides the **EXACT** configuration needed to fix email verification issues in your Next.js project.

---

## 1. SUPABASE SECRETS CONFIGURATION

### **Step 1: Access Supabase Secrets**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your HeySpender project (`hgvdslcpndmimatvliyu`)
3. Navigate to **Settings** → **Configuration** → **Secrets**

### **Step 2: Add Required Secrets**
Add these **EXACT** secrets (replace `re_your_resend_api_key_here` with your actual Resend API key):

```
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

**⚠️ Important**: Use the same Resend API key for both `RESEND_API_KEY` and `SMTP_PASSWORD`

---

## 2. SUPABASE AUTH EMAIL SETTINGS

### **Step 1: Access Email Settings**
1. In Supabase Dashboard, go to **Authentication** → **Email**
2. Scroll down to **SMTP Settings**

### **Step 2: Configure SMTP Settings**
Enable and configure these settings:

```
✅ Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.resend.com
- Port: 465
- Username: resend
- Password: [Your Resend API Key]
- Sender Email: noreply@heyspender.com
- Sender Name: HeySpender
- Enable TLS: ON
```

### **Step 3: Email Templates Configuration**
1. Go to **Authentication** → **Email Templates**
2. Configure the **Confirm Signup** template with this exact HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email - HeySpender</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #161B47;
            background-color: #FDF4E8;
            margin: 0;
            padding: 20px;
        }
        
        .email-container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 2px solid #000000;
            padding: 0;
        }
        
        .header {
            text-align: right;
            margin-bottom: 0;
            background-color: #7c3bed;
            padding: 20px 32px 10px 32px;
            border-bottom: 2px solid #000000;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
        }
        
        .logo img {
            height: 40px;
            width: auto;
        }
        
        .title-section {
            color: #161B47;
            font-size: 36px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        
        .content {
            margin-bottom: 0;
            padding: 20px 32px 20px 32px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 500;
            color: #161B47;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        
        .confirm-button {
            display: inline-block;
            background-color: #E98144;
            color: #000000;
            text-decoration: none;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            border: 2px solid #000000;
            box-shadow: -4px 4px 0px #000000;
            transition: all 0.2s ease;
        }
        
        .confirm-button:hover {
            background-color: #d9733a;
            transform: translate(-2px, 2px);
            box-shadow: -2px 2px 0px #000000;
        }
        
        .security-notice {
            background-color: #E94B29;
            border: 2px solid #000000;
            padding: 20px;
            margin: 24px 0;
            box-shadow: -4px 4px 0px #000000;
        }
        
        .security-notice h3 {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .security-notice p {
            color: #ffffff;
            font-size: 14px;
            margin: 0;
        }
        
        .alternative-link {
            background-color: #FDF4E8;
            border: 2px solid #000000;
            padding: 20px;
            margin: 20px 0;
            box-shadow: -4px 4px 0px #000000;
        }
        
        .alternative-link p {
            color: #4a5568;
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .alternative-link a {
            color: #7c3bed;
            word-break: break-all;
            font-size: 14px;
            text-decoration: none;
        }
        
        .footer {
            text-align: center;
            border-top: 2px solid #000000;
            padding: 24px 32px;
        }
        
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin: 4px 0;
        }
        
        .footer a {
            color: #7c3bed;
            text-decoration: none;
            font-weight: 600;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .button-container {
            text-align: center;
            margin: 24px 0;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .confirm-button {
                display: block;
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <img src="https://heyspender.com/HeySpender%20Media/General/HeySpender%20Logoo.webp" alt="HeySpender" />
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="title-section">Confirm Your Email</div>
            <div class="greeting">Welcome to HeySpender!</div>
            
            <div class="message">
                Thank you for signing up! To complete your registration and start using HeySpender, please confirm your email address by clicking the button below.
            </div>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="confirm-button">Confirm My Email</a>
            </div>
            
            <div class="alternative-link">
                <p>Button not working? Copy and paste this link:</p>
                <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
            </div>
            
            <div class="security-notice">
                <h3>Security Notice</h3>
                <p>This confirmation link will expire in <strong>24 hours</strong> for your security. If you didn't create this account, please ignore this email.</p>
            </div>
            
            <div class="message">
                Once confirmed, you'll be able to create wishlists, contribute to others' celebrations, and start making meaningful connections through giving!
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Need help?</strong> <a href="mailto:support@heyspender.com">Contact Support</a></p>
            <p style="margin-top: 2px; font-size: 12px; color: #9ca3af;">
                © HeySpender • Do not share this link with anyone.
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 3. SUPABASE AUTH URL CONFIGURATION

### **Step 1: Access URL Configuration**
1. Go to **Authentication** → **URL Configuration**

### **Step 2: Configure URLs**
Set these **EXACT** URLs:

```
Site URL: https://heyspender.com

Redirect URLs:
- https://heyspender.com/auth/confirm
- https://heyspender.com/auth/callback
- http://localhost:3000/auth/confirm (for development)
- http://localhost:3001/auth/confirm (for development)
```

---

## 4. RESEND SETUP

### **Step 1: Get Resend API Key**
1. Go to [Resend Dashboard](https://resend.com)
2. Sign up or log in
3. Go to **API Keys**
4. Create a new API key
5. Copy the key (starts with `re_`)

### **Step 2: Domain Setup (Optional)**
For production emails from `noreply@heyspender.com`:

1. In Resend Dashboard, go to **Domains**
2. Add `heyspender.com`
3. Add the required DNS records to your domain
4. Wait for verification

**Quick Test Option**: Use `onboarding@resend.dev` for immediate testing (no DNS changes needed)

---

## 5. DATABASE SETUP

### **Step 1: Create Email Logs Table**
Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_key TEXT,
  metadata JSONB,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON email_logs(template_key);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_provider ON email_logs(provider);

-- Add RLS (Row Level Security) policies
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all email logs
CREATE POLICY "Admins can view all email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- Allow users to view their own email logs
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (
    recipient_email = (
      SELECT email FROM users WHERE id = auth.uid()
    )
  );

-- Only service role can insert/update email logs
CREATE POLICY "Service role can insert email logs" ON email_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update email logs" ON email_logs
  FOR UPDATE USING (true);
```

---

## 6. TESTING PROCEDURE

### **Test 1: Deploy Edge Function**
```bash
cd /Users/gq/Projects/heyspender-nextjs
./deploy-send-email-function.sh
```

### **Test 2: Register New User**
1. Go to `https://heyspender.com/auth/register`
2. Fill out registration form
3. Submit registration
4. Check email inbox for verification email
5. Click verification link
6. Verify redirect to dashboard

### **Test 3: Check Email Logs**
```sql
SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 10;
```

### **Test 4: Password Reset**
1. Go to `https://heyspender.com/auth/forgot-password`
2. Enter email address
3. Submit request
4. Check email inbox for reset email

---

## 7. TROUBLESHOOTING

### **If Emails Still Don't Work:**

1. **Check Edge Function Logs:**
   ```bash
   supabase functions logs send-email --project-ref hgvdslcpndmimatvliyu
   ```

2. **Check Supabase Secrets:**
   - Verify all secrets are set correctly
   - Ensure Resend API key is valid

3. **Check SMTP Settings:**
   - Verify SMTP is enabled in Supabase Auth
   - Check all SMTP configuration values

4. **Test Edge Function Directly:**
   ```bash
   curl -X POST 'https://hgvdslcpndmimatvliyu.supabase.co/functions/v1/send-email' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"to":"test@example.com","subject":"Test","html":"<p>Test email</p>"}'
   ```

---

## 8. SUCCESS INDICATORS

### **✅ Configuration Complete When:**
- [ ] Edge Function deployed successfully
- [ ] All Supabase secrets configured
- [ ] SMTP settings enabled in Supabase Auth
- [ ] Email template configured
- [ ] URL configuration set
- [ ] Email logs table created
- [ ] Test registration sends verification email
- [ ] Test password reset sends email
- [ ] Email logs show successful sends

---

## 🎯 EXPECTED OUTCOME

After completing this configuration:

1. **✅ Email verification will work immediately**
2. **✅ Password reset will work**
3. **✅ Welcome emails will be sent**
4. **✅ All email functionality will be restored**
5. **✅ Mobile users can verify accounts**
6. **✅ Professional email branding**

---

**🚀 Ready to fix your email verification? Follow this guide step by step!**


