# HOSTINGER SMTP COMPLETE SETUP FOR HEYSPENDER

## 🎯 Overview
This guide provides the complete setup for using Hostinger SMTP with HeySpender's notification system, replacing all Resend references.

---

## ✅ What's Already Done

### 1. **Edge Function Updated**
- ✅ Removed all Resend API references
- ✅ Configured for Hostinger SMTP
- ✅ Deployed to Supabase
- ✅ Email service integration complete

### 2. **Notification System Ready**
- ✅ Admin notification page fully functional
- ✅ Email templates with variable replacement
- ✅ Test email functionality implemented
- ✅ Professional HTML email formatting

---

## 🔧 Required Configuration

### **Step 1: Get Your Hostinger SMTP Details**

You need to provide these details from your Hostinger account:

1. **Email Address**: `noreply@heyspender.com` (or your preferred sender email)
2. **Email Password**: The password for this email account
3. **SMTP Host**: Usually `smtp.hostinger.com` or `mail.heyspender.com`
4. **SMTP Port**: Usually `587` (TLS) or `465` (SSL)
5. **Security**: TLS or SSL

### **Step 2: Configure Supabase Secrets**

In your Supabase Dashboard → Settings → Configuration → Secrets, add:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@heyspender.com
SMTP_PASSWORD=your_email_password_here
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

### **Step 3: Configure Supabase Auth SMTP**

In Supabase Dashboard → Authentication → SMTP Settings:

```
✅ Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.hostinger.com
- Port: 587
- Username: noreply@heyspender.com
- Password: your_email_password_here
- Sender Email: noreply@heyspender.com
- Sender Name: HeySpender
- Enable TLS: ON
- Enable SSL: OFF
```

---

## 📧 How to Find Your Hostinger SMTP Settings

### **Method 1: Hostinger Control Panel**
1. Log into your Hostinger account
2. Go to **Email Accounts** or **Email** section
3. Look for **SMTP Settings** or **Email Client Configuration**
4. Note down the SMTP details

### **Method 2: Hostinger Documentation**
- Go to Hostinger's help center
- Search for "SMTP settings" or "email configuration"
- Look for your specific hosting plan

### **Method 3: Contact Hostinger Support**
- If you can't find the settings, contact Hostinger support
- Ask for SMTP configuration details for your domain

---

## 🧪 Testing the Setup

### **Test 1: Admin Notification Test**
1. Go to admin notification page
2. Click **Send** button on any template
3. Check `expresscreo@gmail.com` for the test email

### **Test 2: Email Verification**
1. Try registering a new user
2. Check if verification email is sent
3. Verify the email arrives in inbox

### **Test 3: Password Reset**
1. Go to forgot password page
2. Enter an email address
3. Check if reset email is sent

---

## 📋 Expected Email Content

When you test the notification system, you'll receive emails like this:

**Subject**: "Reminder: Complete your payment for Get Together Party"

**Content**:
```
Hi Test User,

This is a friendly reminder that you claimed "Get Together Party" from Ogundipe Birthday's wishlist.

Days remaining: 2
Amount to pay: ₦{amount}

Please complete your payment soon to secure your claim.

View item: {item_link}

Thank you!
The HeySpender Team
```

---

## 🔍 Troubleshooting

### **If Emails Don't Send:**

1. **Check Supabase Secrets**:
   - Verify all SMTP settings are correct
   - Ensure email password is correct

2. **Check SMTP Settings**:
   - Verify SMTP is enabled in Supabase Auth
   - Check all SMTP configuration values

3. **Test Edge Function**:
   ```bash
   supabase functions logs send-email --project-ref hgvdslcpndmimatvliyu
   ```

4. **Check Email Logs**:
   ```sql
   SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 10;
   ```

### **Common Issues:**

- **Wrong SMTP Port**: Try 587 (TLS) or 465 (SSL)
- **Authentication Failed**: Check email password
- **Connection Timeout**: Verify SMTP host is correct
- **Emails in Spam**: Check sender reputation

---

## 🎯 Next Steps

1. **Provide Hostinger SMTP Details**: Send me your SMTP settings
2. **Configure Supabase**: I'll help you set up the secrets
3. **Test Email Sending**: Verify everything works
4. **Go Live**: Start sending real notifications

---

## 📞 What I Need From You

Please provide:

1. **Your Hostinger email address** (e.g., `noreply@heyspender.com`)
2. **The password for that email account**
3. **Your Hostinger SMTP settings** (host, port, security)
4. **Your domain name** (if different from heyspender.com)

---

## 🚀 Benefits of Hostinger SMTP

- ✅ **More reliable** than third-party services
- ✅ **Better deliverability** (emails less likely to go to spam)
- ✅ **Cost-effective** (usually included with hosting)
- ✅ **Full control** over email settings
- ✅ **Better reputation** for your domain
- ✅ **No API limits** like Resend

---

**🎯 Ready to configure? Please provide the Hostinger SMTP details and I'll set everything up for you!**
