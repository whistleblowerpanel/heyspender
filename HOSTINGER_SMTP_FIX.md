# HOSTINGER SMTP CONFIGURATION FIX

## 🚨 Issues Found in Your Configuration

### ❌ Problems:
1. **Security Risk**: SMTP password in `.env.local` (exposed in local development)
2. **Wrong Method**: Supabase doesn't use `.env.local` for SMTP
3. **Port Mismatch**: Port 587 with SMTP_SECURE: 465
4. **Incorrect Format**: Wrong environment variable names

---

## ✅ Correct Configuration

### Step 1: Remove from .env.local
**Remove these lines from `.env.local`:**
```
SMTP_HOST: smtp.hostinger.com
SMTP_PORT: 587
SMTP_USER: noreply@heyspender.com
SMTP_PASS: @ILOVEgoke88
SMTP_SECURE: 465
```

### Step 2: Add to Supabase Secrets
**Go to Supabase Dashboard → Settings → Configuration → Secrets**

Add these secrets:
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@heyspender.com
SMTP_PASSWORD=@ILOVEgoke88
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

### Step 3: Configure Supabase Auth SMTP
**Go to Authentication → Email → SMTP Settings**

```
✅ Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.hostinger.com
- Port: 587
- Username: noreply@heyspender.com
- Password: @ILOVEgoke88
- Sender Email: noreply@heyspender.com
- Sender Name: HeySpender
- Enable TLS: ON
- Enable SSL: OFF
```

---

## 🔧 Port Configuration Options

### Option A: Port 587 with TLS (Recommended)
```
Port: 587
Enable TLS: ON
Enable SSL: OFF
```

### Option B: Port 465 with SSL (Alternative)
```
Port: 465
Enable TLS: OFF
Enable SSL: ON
```

---

## 🧪 Testing Steps

### 1. Save Configuration
- Save secrets in Supabase Dashboard
- Save SMTP settings in Supabase Auth
- Wait 1-2 minutes for changes to take effect

### 2. Test Password Reset
- Go to `http://localhost:3000/test-password-reset`
- Enter a test email
- Click "Test Password Reset"
- Check email inbox

### 3. Check Results
- ✅ Email delivered = Configuration correct
- ❌ Error = Need to troubleshoot

---

## 🔍 Troubleshooting

### If emails don't send:
1. **Check Hostinger email account**: Verify `noreply@heyspender.com` exists
2. **Verify password**: Make sure `@ILOVEgoke88` is correct
3. **Try port 465**: If 587 doesn't work, try 465 with SSL
4. **Check Hostinger limits**: Verify email sending limits

### Common Hostinger SMTP Issues:
- **Authentication failed**: Wrong username/password
- **Connection timeout**: Wrong port or host
- **Email not delivered**: Check spam folder, verify domain

---

## 🎯 Next Steps

1. **Remove SMTP from `.env.local`**
2. **Add secrets to Supabase Dashboard**
3. **Configure SMTP in Supabase Auth**
4. **Test password reset flow**
5. **Report results**

---

## 💡 Pro Tips

- **Keep Supabase built-in email as backup** (disable custom SMTP if issues persist)
- **Test with different email providers** (Gmail, Outlook, Yahoo)
- **Check email logs** in Supabase Dashboard if available
- **Use dedicated email account** for sending (not personal email)

---

**🚀 Ready to fix? Follow these steps and let me know the results!**
