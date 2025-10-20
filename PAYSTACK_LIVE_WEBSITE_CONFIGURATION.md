# PAYSTACK LIVE WEBSITE CONFIGURATION GUIDE

## 🚨 CRITICAL: Complete Paystack Integration Setup for Live Website

This guide provides the **EXACT** configuration needed to make Paystack work on your live website, replicating the working local setup.

---

## 1. ENVIRONMENT VARIABLES CONFIGURATION

### **1.1 Required Environment Variables**

Your live website needs these **EXACT** environment variables:

```env
# Paystack Configuration (LIVE KEYS for production)
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_live_key_here
VITE_PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_live_key_here
VITE_PAYSTACK_WEBHOOK_SECRET=your_random_webhook_secret_string

# Supabase Configuration
VITE_SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmRzbGNwbmRtaW1hdHZsaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzA2NjksImV4cCI6MjA3NTAwNjY2OX0.1d-UszrAW-_rUemrmBEbHRoa1r8zOrbo-wtKaXMPW9k

# SMTP Configuration (for emails)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=your_resend_api_key
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

### **1.2 Where to Set Environment Variables**

**For Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the exact names above

**For Netlify:**
1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add each variable with the exact names above

**For Supabase Edge Functions:**
1. Go to your Supabase dashboard
2. Go to Settings → Configuration → Secrets
3. Add the secret keys (NOT the VITE_ prefixed ones)

---

## 2. PAYSTACK DASHBOARD CONFIGURATION

### **2.1 Get Your Live Keys**

1. **Login to Paystack Dashboard**: https://dashboard.paystack.com
2. **Switch to Live Mode**: Toggle from "Test" to "Live" mode
3. **Get Your Keys**:
   - Go to Settings → API Keys & Webhooks
   - Copy your **Public Key** (starts with `pk_live_`)
   - Copy your **Secret Key** (starts with `sk_live_`)

### **2.2 Configure Webhook URL**

1. **In Paystack Dashboard**:
   - Go to Settings → API Keys & Webhooks
   - In the "Webhook URL" field, enter: `https://hgvdslcpndmimatvliyu.supabase.co/functions/v1/process-payment-webhook`
   - In the "Secret Hash" field, enter the same random string you used for `VITE_PAYSTACK_WEBHOOK_SECRET`
   - **Enable these events**:
     - `charge.success`
     - `charge.failed`
     - `transfer.success`
     - `transfer.failed`

### **2.3 Enable Transfers (for Payouts)**

1. **In Paystack Dashboard**:
   - Go to Settings → Transfers
   - Enable transfers if not already enabled
   - Add your bank account details for sending transfers

---

## 3. SUPABASE EDGE FUNCTIONS SETUP

### **3.1 Create Payment Webhook Function**

Create a new Supabase Edge Function called `process-payment-webhook`:

```typescript
// supabase/functions/process-payment-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify Paystack signature
    const signature = req.headers.get('x-paystack-signature')
    const payload = await req.text()
    const secret = Deno.env.get('VITE_PAYSTACK_WEBHOOK_SECRET')

    if (!signature || !secret) {
      return new Response('Missing signature or secret', { status: 401 })
    }

    // Verify signature
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('Received Paystack webhook:', event.event)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { data: charge } = event
      const reference = charge.reference
      const amount = charge.amount / 100 // Convert from kobo to naira
      const transactionId = charge.id

      console.log(`Processing successful payment: ${reference}, Amount: ₦${amount}`)

      // Check if this payment has already been processed
      const { data: existingTransaction } = await supabaseClient
        .from('wallet_transactions')
        .select('id')
        .eq('transaction_id', transactionId)
        .single()

      if (existingTransaction) {
        console.log('Payment already processed, skipping')
        return new Response('Payment already processed', { status: 200 })
      }

      // Find the claim by payment reference
      const { data: claim, error: claimError } = await supabaseClient
        .from('claims')
        .select(`
          *,
          wishlist_items!inner(
            *,
            wishlists!inner(
              *,
              users!inner(*)
            )
          )
        `)
        .eq('payment_reference', reference)
        .single()

      if (claimError || !claim) {
        console.error('Claim not found for reference:', reference)
        return new Response('Claim not found', { status: 404 })
      }

      const wishlistOwner = claim.wishlist_items.wishlists.users

      // Update claim amount_paid
      const newAmountPaid = (claim.amount_paid || 0) + amount
      const { error: updateError } = await supabaseClient
        .from('claims')
        .update({ amount_paid: newAmountPaid })
        .eq('id', claim.id)

      if (updateError) {
        console.error('Error updating claim:', updateError)
        return new Response('Error updating claim', { status: 500 })
      }

      // Credit recipient's wallet
      const { error: walletError } = await supabaseClient
        .from('wallets')
        .upsert({
          user_id: wishlistOwner.id,
          balance: amount,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (walletError) {
        console.error('Wallet credit error:', walletError)
      }

      // Create wallet transaction record
      const { error: transactionError } = await supabaseClient
        .from('wallet_transactions')
        .insert({
          user_id: wishlistOwner.id,
          claim_id: claim.id,
          amount: amount,
          type: 'credit',
          description: `Payment received for "${claim.wishlist_items.name}"`,
          reference: reference,
          transaction_id: transactionId,
          created_at: new Date().toISOString()
        })

      if (transactionError) {
        console.error('Transaction record error:', transactionError)
      }

      // Create notification
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: wishlistOwner.id,
          type: 'payment_received',
          title: 'Payment Received',
          message: `You received ₦${amount.toLocaleString()} for "${claim.wishlist_items.name}"`,
          data: {
            claim_id: claim.id,
            amount: amount,
            payment_ref: reference,
            transaction_id: transactionId
          }
        })

      if (notificationError) {
        console.error('Notification error:', notificationError)
      }

      console.log('Payment processed successfully')
    }

    return new Response('Webhook processed', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
```

### **3.2 Deploy the Webhook Function**

```bash
# Deploy the webhook function to Supabase
supabase functions deploy process-payment-webhook
```

---

## 4. FRONTEND PAYSTACK INTEGRATION

### **4.1 Update Payment Initialization**

Your frontend should use this **EXACT** payment initialization code:

```typescript
// src/lib/paystackService.ts
export const initializePaystackPayment = async (paymentData: {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  metadata: any;
  callback: (response: any) => void;
  onClose: () => void;
}) => {
  return new Promise((resolve) => {
    console.log('Initializing Paystack payment with data:', paymentData);
    
    // Check if Paystack public key is available
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Paystack public key not found in environment variables');
      resolve({ error: { message: 'Paystack configuration missing. Please check your environment variables.' } });
      return;
    }

    console.log('Paystack public key found:', publicKey.substring(0, 20) + '...');

    // Load Paystack script
    const loadPaystackScript = () => {
      return new Promise((scriptResolve, scriptReject) => {
        if (window.PaystackPop) {
          console.log('Paystack script already loaded');
          scriptResolve();
          return;
        }

        console.log('Loading Paystack script...');
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          scriptReject(new Error('Paystack script loading timeout'));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log('Paystack script loaded successfully');
          scriptResolve();
        };
        
        script.onerror = (error) => {
          clearTimeout(timeout);
          console.error('Failed to load Paystack script:', error);
          scriptReject(new Error('Failed to load Paystack script'));
        };
        
        document.head.appendChild(script);
      });
    };

    // Load script and initialize payment
    loadPaystackScript()
      .then(() => {
        initPayment();
      })
      .catch((error) => {
        console.error('Script loading failed:', error);
        console.log('Falling back to hosted payment page...');
        useHostedPaymentPage(paymentData);
        resolve({ error: { message: 'Using hosted payment page due to script loading error' } });
      });

    function initPayment() {
      try {
        console.log('Setting up Paystack payment...');
        
        // Add a small delay to ensure script is fully loaded
        setTimeout(() => {
          try {
            const handler = window.PaystackPop.setup({
              key: publicKey,
              email: paymentData.email,
              amount: paymentData.amount,
              currency: paymentData.currency,
              ref: paymentData.reference,
              metadata: paymentData.metadata,
              callback: (response) => {
                console.log('Paystack callback received:', response);
                paymentData.callback(response);
              },
              onClose: () => {
                console.log('Paystack modal closed');
                paymentData.onClose();
              }
            });

            console.log('Opening Paystack iframe...');
            handler.openIframe();
            resolve({ success: true });
          } catch (error) {
            console.error('Error in Paystack setup:', error);
            console.log('Falling back to hosted payment page...');
            useHostedPaymentPage(paymentData);
            resolve({ error: { message: 'Using hosted payment page due to inline setup error' } });
          }
        }, 500);
        
      } catch (error) {
        console.error('Error setting up Paystack payment:', error);
        console.log('Falling back to hosted payment page...');
        useHostedPaymentPage(paymentData);
        resolve({ error: { message: 'Using hosted payment page due to setup error' } });
      }
    }
  });
};

// Fallback to hosted payment page
const useHostedPaymentPage = (paymentData: any) => {
  try {
    console.log('Using hosted payment page...');
    
    // Store payment data for callback processing
    localStorage.setItem('pending_payment_ref', paymentData.reference);
    localStorage.setItem('pending_payment_amount', (paymentData.amount / 100).toString());
    localStorage.setItem('pending_payment_claim_id', paymentData.metadata.claim_id);
    
    // Redirect to Paystack hosted page
    const hostedUrl = `https://checkout.paystack.com/${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}?email=${encodeURIComponent(paymentData.email)}&amount=${paymentData.amount}&currency=${paymentData.currency}&reference=${paymentData.reference}&callback_url=${encodeURIComponent(window.location.origin + '/payment-callback')}`;
    
    window.location.href = hostedUrl;
    
  } catch (error) {
    console.error('Hosted payment page failed:', error);
    throw error;
  }
};
```

### **4.2 Update Environment Variables for Next.js**

In your Next.js project, use these environment variable names:

```env
# Next.js Environment Variables
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_live_key_here
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_live_key_here
NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET=your_random_webhook_secret_string

NEXT_PUBLIC_SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmRzbGNwbmRtaW1hdHZsaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzA2NjksImV4cCI6MjA3NTAwNjY2OX0.1d-UszrAW-_rUemrmBEbHRoa1r8zOrbo-wtKaXMPW9k
```

---

## 5. DATABASE SCHEMA REQUIREMENTS

### **5.1 Required Tables**

Ensure these tables exist in your Supabase database:

```sql
-- Claims table (should already exist)
ALTER TABLE claims ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0;

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT,
  reference TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6. TESTING THE INTEGRATION

### **6.1 Test Payment Flow**

1. **Create a test payment**:
   - Go to your live website
   - Try to make a contribution
   - Check browser console for Paystack logs

2. **Verify webhook**:
   - Check Supabase Edge Function logs
   - Verify payment is processed in database
   - Check wallet balance is updated

3. **Test hosted payment page fallback**:
   - If inline payment fails, it should redirect to hosted page
   - Verify callback URL works correctly

### **6.2 Debug Common Issues**

**Issue: "Paystack configuration missing"**
- Check environment variables are set correctly
- Verify variable names match exactly
- Ensure variables are deployed to your hosting platform

**Issue: "Invalid signature"**
- Verify webhook secret matches in Paystack dashboard
- Check webhook URL is correct
- Ensure webhook function is deployed

**Issue: "Script loading timeout"**
- Check if `https://js.paystack.co/v1/inline.js` is accessible
- Verify no ad blockers are interfering
- Check browser console for CORS errors

---

## 7. PRODUCTION CHECKLIST

### **7.1 Before Going Live**

- [ ] **Environment Variables**: All required variables set in production
- [ ] **Paystack Keys**: Using live keys (not test keys)
- [ ] **Webhook URL**: Correctly configured in Paystack dashboard
- [ ] **Edge Function**: Deployed and accessible
- [ ] **Database**: All required tables exist
- [ ] **SSL Certificate**: Website has valid SSL certificate
- [ ] **Domain**: Webhook URL uses your production domain

### **7.2 Monitoring**

- [ ] **Logs**: Monitor Supabase Edge Function logs
- [ ] **Payments**: Check Paystack dashboard for successful transactions
- [ ] **Database**: Monitor wallet_transactions table
- [ ] **Errors**: Set up error tracking (Sentry, etc.)

---

## 8. SECURITY CONSIDERATIONS

### **8.1 API Key Security**

- **Never expose secret keys** in client-side code
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** for security
- **Monitor API usage** in Paystack dashboard

### **8.2 Webhook Security**

- **Always verify signatures** before processing webhooks
- **Use HTTPS** for all webhook URLs
- **Implement idempotency** to prevent duplicate processing
- **Log all webhook events** for debugging

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **EXACT Environment Variables**: Use the exact variable names and values
2. **LIVE Paystack Keys**: Switch from test to live keys in production
3. **Correct Webhook URL**: Must match your Supabase Edge Function URL
4. **Deployed Edge Function**: The webhook function must be deployed and accessible
5. **Database Schema**: All required tables must exist with correct structure
6. **SSL Certificate**: Your website must have a valid SSL certificate
7. **Domain Configuration**: Webhook URL must use your production domain

**Follow this guide EXACTLY and your Paystack integration will work on the live website just like it does locally!** 🎉

