# HOSTINGER SMTP CONFIGURATION FOR SUPABASE

## 🎯 Goal
Configure Hostinger SMTP for Supabase to replace Resend SMTP and ensure reliable password reset emails.

---

## 📋 Information Needed

To configure Hostinger SMTP, I need the following details from you:

### 1. **Hostinger Email Account Details**
- **Email Address**: `your-email@heyspender.com` (or whatever domain you're using)
- **Email Password**: The password for this email account
- **Domain**: `heyspender.com` (or your actual domain)

### 2. **Hostinger SMTP Settings**
I'll need you to check your Hostinger control panel for these settings:

**Option A: If you have a Hostinger hosting plan:**
- SMTP Host: Usually `smtp.hostinger.com` or `mail.yourdomain.com`
- SMTP Port: Usually `587` or `465`
- Authentication: Required
- Security: TLS/SSL

**Option B: If you're using Hostinger Email Hosting:**
- SMTP Host: `smtp.hostinger.com`
- SMTP Port: `587` (TLS) or `465` (SSL)
- Authentication: Required

### 3. **Current Hostinger Setup**
- Do you already have an email account set up with Hostinger?
- What's your Hostinger plan? (Shared hosting, VPS, Email hosting, etc.)
- Is your domain `heyspender.com` hosted with Hostinger?

---

## 🔍 How to Find Your Hostinger SMTP Settings

### Method 1: Hostinger Control Panel
1. Log into your Hostinger account
2. Go to **Email Accounts** or **Email** section
3. Look for **SMTP Settings** or **Email Client Configuration**
4. Note down the SMTP details

### Method 2: Hostinger Documentation
- Go to Hostinger's help center
- Search for "SMTP settings" or "email configuration"
- Look for your specific hosting plan

### Method 3: Contact Hostinger Support
- If you can't find the settings, contact Hostinger support
- Ask for SMTP configuration details for your domain

---

## 🛠️ Expected Configuration

Based on typical Hostinger setups, the configuration will likely be:

### **Supabase Secrets Configuration**
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=your-email@heyspender.com
SMTP_PASSWORD=your-email-password
SMTP_SENDER_EMAIL=your-email@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

### **Supabase Auth SMTP Settings**
```
✅ Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.hostinger.com
- Port: 587
- Username: your-email@heyspender.com
- Password: your-email-password
- Sender Email: your-email@heyspender.com
- Sender Name: HeySpender
- Enable TLS: ON
- Enable SSL: OFF
```

---

## 📝 What I Need From You

Please provide:

1. **Your Hostinger email address** (e.g., `noreply@heyspender.com`)
2. **The password for that email account**
3. **Your Hostinger SMTP settings** (host, port, security)
4. **Your domain name** (if different from heyspender.com)

---

## 🔒 Security Note

**Important**: The email password will be stored in Supabase secrets, which is secure. However, consider:

1. **Create a dedicated email account** for sending emails (e.g., `noreply@heyspender.com`)
2. **Use a strong password** for this email account
3. **Don't use your main email account** for SMTP

---

## 🚀 Next Steps

Once you provide the information:

1. **I'll create the exact configuration** for your Hostinger SMTP
2. **Update your Supabase settings** with the correct values
3. **Test the password reset flow** to ensure it works
4. **Provide troubleshooting steps** if needed

---

## 💡 Benefits of Hostinger SMTP

- ✅ **More reliable** than third-party services
- ✅ **Better deliverability** (emails less likely to go to spam)
- ✅ **Cost-effective** (usually included with hosting)
- ✅ **Full control** over email settings
- ✅ **Better reputation** for your domain

---

**🎯 Ready to configure? Please provide the Hostinger SMTP details and I'll set everything up for you!**
