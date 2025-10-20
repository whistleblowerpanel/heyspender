# 🚨 CRITICAL: Paystack Live Website Setup Instructions

## Current Issue
Your Paystack integration is showing "Paystack configuration missing. Please check your environment variables." This guide will fix this issue completely.

## ✅ What I've Already Done

1. **Created centralized Paystack service** (`src/lib/paystackService.js`)
2. **Updated components** to use the new service
3. **Created API route** for payment verification (`src/app/api/verify-payment/route.js`)
4. **Created Supabase Edge Function** for webhook processing
5. **Created database migration** for required tables
6. **Created deployment script** (`deploy-paystack.sh`)

## 🔧 What You Need to Do

### Step 1: Set Environment Variables

**For Local Development:**
Create a `.env.local` file in your project root with:

```env
# Paystack Configuration (LIVE KEYS for production)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_live_key_here
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_live_key_here
NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET=your_random_webhook_secret_string

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmRzbGNwbmRtaW1hdHZsaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzA2NjksImV4cCI6MjA3NTAwNjY2OX0.1d-UszrAW-_rUemrmBEbHRoa1r8zOrbo-wtKaXMPW9k
```

**For Production (Vercel/Netlify):**
Add these same variables in your hosting platform's environment variables section.

### Step 2: Get Your Live Paystack Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. **Switch to Live Mode** (toggle from "Test" to "Live")
3. Go to Settings → API Keys & Webhooks
4. Copy your **Public Key** (starts with `pk_live_`)
5. Copy your **Secret Key** (starts with `sk_live_`)
6. Replace the placeholder values in your environment variables

### Step 3: Deploy Supabase Edge Function

Run the deployment script:

```bash
./deploy-paystack.sh
```

This will:
- Deploy the webhook function to Supabase
- Give you the webhook URL to configure in Paystack

### Step 4: Configure Paystack Webhook

1. In your Paystack Dashboard, go to Settings → API Keys & Webhooks
2. Set **Webhook URL** to: `https://hgvdslcpndmimatvliyu.supabase.co/functions/v1/process-payment-webhook`
3. Set **Secret Hash** to the same random string you used for `NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET`
4. Enable these events:
   - `charge.success`
   - `charge.failed`
   - `transfer.success`
   - `transfer.failed`

### Step 5: Update Database Schema

1. Go to your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_paystack_integration.sql`
4. Run the migration

### Step 6: Test the Integration

1. Restart your development server: `npm run dev`
2. Try making a payment
3. Check browser console for Paystack logs
4. Verify payment is processed in your database

## 🔍 Troubleshooting

### Issue: "Paystack configuration missing"
- ✅ **Solution**: Set the environment variables correctly
- Check that variable names match exactly: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

### Issue: "Invalid signature" in webhook
- ✅ **Solution**: Ensure webhook secret matches in both Paystack dashboard and environment variables

### Issue: Script loading timeout
- ✅ **Solution**: The system automatically falls back to hosted payment page
- This is normal behavior and will work correctly

### Issue: Payment not processed in database
- ✅ **Solution**: Check that the database migration was run successfully
- Verify the webhook function is deployed and accessible

## 🎯 Key Features of the New Implementation

1. **Automatic Fallback**: If inline payment fails, automatically redirects to hosted payment page
2. **Better Error Handling**: Clear error messages and proper logging
3. **Centralized Service**: All Paystack logic in one place for easier maintenance
4. **Webhook Processing**: Automatic payment processing via Supabase Edge Function
5. **Database Integration**: Proper wallet and transaction tracking

## 📋 Production Checklist

- [ ] Environment variables set in production
- [ ] Using live Paystack keys (not test keys)
- [ ] Webhook URL configured in Paystack dashboard
- [ ] Edge Function deployed and accessible
- [ ] Database migration completed
- [ ] SSL certificate valid
- [ ] Payment flow tested end-to-end

## 🚀 After Setup

Once everything is configured:

1. **Payments will work seamlessly** on your live website
2. **Automatic wallet crediting** when payments are received
3. **Real-time notifications** for payment events
4. **Proper transaction tracking** in your database
5. **Fallback to hosted payment page** if needed

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the webhook function is deployed and accessible
4. Check Paystack dashboard for successful transactions
5. Verify database tables exist and have correct structure

**The integration will work exactly like your local setup once these steps are completed!** 🎉
