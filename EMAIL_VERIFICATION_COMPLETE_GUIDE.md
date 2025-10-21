# EMAIL VERIFICATION & SUPABASE CONFIGURATION - COMPLETE GUIDE

## 🚨 CRITICAL: Complete Email Account Verification System

This guide provides the **EXACT** specifications for implementing email account verification after signup, including Supabase configuration, email templates, Edge Functions, and complete implementation details.

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### **1.1 Email Verification Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                EMAIL VERIFICATION FLOW                          │
│                                                                 │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌────────┐│
│  │ REGISTER │ -> │ VERIFY EMAIL │ -> │  CONFIRM │ -> │DASHBOARD││
│  │   PAGE   │    │     PAGE     │    │   PAGE   │    │        ││
│  └──────────┘    └──────────────┘    └──────────┘    └────────┘│
│       │                  │                  │              │     │
│       │                  │                  │              │     │
│   User fills         Supabase          User clicks     Email    │
│   registration       sends email       verify link     verified │
│   form               automatically                      in DB    │
│       │                  │                  │              │     │
│       v                  v                  v              v     │
│   Create user       Send welcome      Set verified     Update   │
│   in Supabase       email via         timestamp        user     │
│   Auth              Edge Function                       record   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **1.2 Email Types System**

```typescript
// EXACT email types - NO MODIFICATIONS
const emailTypes = {
  SIGNUP_CONFIRMATION: 'signup_confirmation',   // Supabase auto-sends
  WELCOME: 'welcome',                           // Custom welcome after registration
  PASSWORD_RESET: 'password_reset',             // Custom password reset
  EMAIL_CHANGE: 'email_change',                 // Supabase auto-sends
  PAYMENT_THANK_YOU: 'payment_thank_you',       // Custom thank you
  WITHDRAWAL_NOTIFICATION: 'withdrawal_notification', // Custom admin notification
  WITHDRAWAL_STATUS: 'withdrawal_status',       // Custom status update
  PAYMENT_REMINDER: 'payment_reminder'          // Custom payment reminder
};
```

---

## 2. SUPABASE AUTH CONFIGURATION

### **2.1 Email Templates Setup (Supabase Dashboard)**

**Step 1: Navigate to Email Templates**
1. Go to Supabase Dashboard
2. Click on "Authentication" in the left sidebar
3. Click on "Email Templates"

**Step 2: Configure Confirm Signup Template**

```html
<!-- EXACT Supabase Confirm Signup Template - NO MODIFICATIONS -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email - HeySpender</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 2px solid #161B47;
        }
        .header {
            background: linear-gradient(135deg, #7c3bed 0%, #5b21b6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .title-section {
            font-size: 24px;
            font-weight: 700;
            color: #161B47;
            margin-bottom: 20px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 25px;
            line-height: 1.7;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .confirm-button {
            display: inline-block;
            background-color: #86E589;
            color: #161B47;
            text-decoration: none;
            padding: 16px 40px;
            font-size: 18px;
            font-weight: 700;
            border: 2px solid #161B47;
            box-shadow: -4px 4px 0px 0px rgba(22, 27, 71, 1);
            transition: all 0.2s;
        }
        .confirm-button:hover {
            box-shadow: -6px 6px 0px 0px rgba(22, 27, 71, 1);
            transform: translate(-1px, -1px);
        }
        .alternative-link {
            background-color: #f3f4f6;
            padding: 20px;
            margin: 25px 0;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .alternative-link a {
            color: #7c3bed;
            word-break: break-all;
        }
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #FFA500;
            padding: 20px;
            margin: 25px 0;
        }
        .security-notice h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #161B47;
        }
        .security-notice p {
            margin: 0;
            font-size: 14px;
            color: #4b5563;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 2px solid #e5e7eb;
        }
        .footer a {
            color: #7c3bed;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Welcome to HeySpender!</h1>
            <p>One last step to get started...</p>
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
                <h3>🔒 Security Notice</h3>
                <p>This confirmation link will expire in <strong>24 hours</strong> for your security. If you didn't create this account, please ignore this email.</p>
            </div>
            
            <div class="message">
                Once confirmed, you'll be able to create wishlists, contribute to others' celebrations, and start making meaningful connections through giving!
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Need help?</strong> <a href="mailto:support@heyspender.com">Contact Support</a></p>
            <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
                © HeySpender • Made with ❤️ by ExpressCreo<br>
                Do not share this link with anyone.
            </p>
        </div>
    </div>
</body>
</html>
```

### **2.2 Email Settings Configuration**

**In Supabase Dashboard → Authentication → Email Settings:**

```
Enable Email Confirmations: ON
Confirm Email: ON
Secure Email Change: ON
Double Confirm Email Change: ON

Email Confirmation Template: [Use template above]
Magic Link Template: [Optional]
Change Email Template: [Optional]
Reset Password Template: [Configure separately]
```

### **2.3 SMTP Configuration**

**In Supabase Dashboard → Authentication → SMTP Settings:**

```
Enable Custom SMTP: ON

SMTP Settings:
- Host: smtp.resend.com
- Port: 465
- Username: resend
- Password: [Your Resend API Key]
- Sender Email: noreply@heyspender.com
- Sender Name: HeySpender

Enable TLS: ON
```

---

## 3. SUPABASE EDGE FUNCTION SETUP

### **3.1 Send Email Edge Function**

**File: `supabase/functions/send-email/index.ts`**

```typescript
// EXACT send-email Edge Function - NO MODIFICATIONS
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { to, subject, html, text, templateKey, metadata } = await req.json()

    // Validate required fields
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get SMTP configuration from environment variables
    const smtpConfig = {
      host: Deno.env.get('SMTP_HOST') || 'smtp.resend.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '465'),
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER') || 'resend',
        pass: Deno.env.get('SMTP_PASSWORD') || Deno.env.get('RESEND_API_KEY')
      }
    }

    // Get sender information
    const senderEmail = Deno.env.get('SMTP_SENDER_EMAIL') || 'noreply@heyspender.com'
    const senderName = Deno.env.get('SMTP_SENDER_NAME') || 'HeySpender'

    // Prepare email data
    const emailData = {
      from: `${senderName} <${senderEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html || text,
      text: text || html?.replace(/<[^>]*>/g, '')
    }

    console.log('📧 Sending email via SMTP:', {
      to: emailData.to,
      subject: emailData.subject,
      templateKey,
      metadata
    })

    // Use Resend API (recommended)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text()
        console.error('Resend API error:', errorData)
        throw new Error(`Resend API error: ${resendResponse.status} ${errorData}`)
      }

      const resendData = await resendResponse.json()
      console.log('✅ Email sent successfully via Resend:', resendData)

      // Log email in database
      await logEmailSent(supabaseClient, {
        to: emailData.to,
        subject: emailData.subject,
        templateKey,
        metadata,
        provider: 'resend',
        providerId: resendData.id,
        status: 'sent'
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: resendData.id,
          provider: 'resend'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      throw new Error('Resend API key not configured')
    }

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to log email sending
async function logEmailSent(supabaseClient, emailLog) {
  try {
    const { error } = await supabaseClient
      .from('email_logs')
      .insert({
        recipient_email: emailLog.to,
        subject: emailLog.subject,
        template_key: emailLog.templateKey,
        metadata: emailLog.metadata,
        provider: emailLog.provider,
        provider_message_id: emailLog.providerId,
        status: emailLog.status,
        sent_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging email:', error)
    }
  } catch (error) {
    console.error('Error in logEmailSent:', error)
  }
}
```

### **3.2 Deploy Edge Function**

```bash
# EXACT deployment command - NO MODIFICATIONS
supabase functions deploy send-email

# Or using Supabase CLI
supabase functions deploy send-email --project-ref hgvdslcpndmimatvliyu
```

---

## 4. DATABASE SCHEMA

### **4.1 Email Logs Table**

```sql
-- EXACT email_logs table schema - NO MODIFICATIONS
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

### **4.2 Users Table Email Fields**

```sql
-- EXACT users table email fields - NO MODIFICATIONS
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

---

## 5. FRONTEND IMPLEMENTATION

### **5.1 Registration Page Email Handling**

```tsx
// EXACT registration email handling - NO MODIFICATIONS
const handleSignUp = async (e) => {
  e.preventDefault();
  setLoading(true);

  const { username, full_name, email, password } = formData;

  // Validate fields
  if (!username || !full_name || !password || !email) {
    toast({ 
      variant: 'destructive', 
      title: 'Missing Fields', 
      description: 'Please fill in all required fields.' 
    });
    setLoading(false);
    return;
  }

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    toast({ 
      variant: 'destructive', 
      title: 'Username taken', 
      description: 'This username is already in use. Please choose another.' 
    });
    setLoading(false);
    return;
  }
  
  // Sign up with Supabase Auth
  const signUpPayload = {
    email,
    password,
    options: {
      data: {
        username,
        full_name,
        role: 'user',
      },
      emailRedirectTo: 'https://heyspender.com/auth/confirm'
    },
  };
  
  const { data, error } = await signUpWithEmailPassword(signUpPayload);

  if (error) {
    const friendlyMessage = getUserFriendlyError(error, 'creating your account');
    
    if (error.message && error.message.includes('rate limit')) {
      toast({ 
        variant: 'destructive', 
        title: 'Email Rate Limit Exceeded', 
        description: 'Too many registration attempts. Please wait a few minutes and try again.' 
      });
    } else {
      toast({ 
        variant: 'destructive', 
        title: 'Sign Up Error', 
        description: friendlyMessage 
      });
    }
  } else if (data.user) {
    // Handle existing unverified email
    if (data.user.identities && data.user.identities.length === 0) {
      const { error: resendError } = await supabase.auth.resend({ 
        type: 'signup', 
        email 
      });
      
      if (resendError) {
        toast({ 
          variant: 'destructive', 
          title: 'Resend Verification Failed', 
          description: 'Unable to resend verification email.' 
        });
      } else {
        toast({ 
          title: 'Verification email resent', 
          description: 'Please check your inbox.' 
        });
        navigate('/verify');
      }
    } else {
      // Create user record in database
      try {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username: username,
            full_name: full_name,
            email: email,
            role: 'user',
            is_admin: false,
            is_active: true,
            email_verified_at: null
          });

        if (userError) {
          console.error('Error creating user record:', userError);
        }
      } catch (err) {
        console.error('Exception creating user record:', err);
      }

      // Send welcome email
      try {
        const welcomeEmailResult = await EmailService.sendWelcomeEmail({
          userEmail: email,
          username: username,
          fullName: full_name
        });
        
        if (welcomeEmailResult.success) {
          console.log('✅ Welcome email sent successfully to:', email);
        } else {
          console.error('❌ Failed to send welcome email:', welcomeEmailResult.error);
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      toast({ 
        title: 'Account Created!', 
        description: 'Welcome to HeySpender! Please check your email to verify your account.' 
      });
      navigate('/verify');
    }
  }
  
  setLoading(false);
};
```

### **5.2 Email Verification Page**

```tsx
// EXACT verification page - NO MODIFICATIONS
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const VerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { user } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  const handleContinueContributing = async () => {
    setIsCheckingSession(true);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        navigate(returnTo);
      } else {
        if (returnTo) {
          navigate(returnTo);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      if (returnTo) {
        navigate(returnTo);
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleClose = async () => {
    setIsCheckingSession(true);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        const isAdmin = session.user.user_metadata?.role === 'admin';
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      navigate('/dashboard');
    } finally {
      setIsCheckingSession(false);
    }
  };
  
  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-6 bg-brand-purple-dark text-white border-2 border-black text-center"
        >
          <MailCheck className="w-16 h-16 mx-auto text-brand-green" />
          <h1 className="text-3xl font-bold text-white">Check Your Inbox!</h1>
          <p className="text-white/90">
            We've sent a verification link to your email address. Please click the link to confirm your account.
          </p>
          <p className="text-sm text-white/80">
            You can make contributions while waiting for verification, but you'll need to verify your email to access your dashboard.
          </p>
          <p className="text-xs text-white/60 bg-white/5 p-2 rounded border border-white/10">
            💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
          </p>
          
          <div className="flex flex-col gap-3">
            {returnTo && (
              <Button 
                variant="custom" 
                className="bg-brand-green text-black" 
                onClick={handleContinueContributing}
                disabled={isCheckingSession}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isCheckingSession ? 'Checking session...' : 'Continue Contributing'}
              </Button>
            )}
            <Button 
              variant="custom" 
              className="bg-brand-accent-red text-white" 
              onClick={handleClose} 
              disabled={isCheckingSession}
            >
              <X className="mr-2 h-4 w-4" />
              {isCheckingSession ? 'Checking session...' : 'Go to Dashboard'}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyPage;
```

### **5.3 Email Confirmation Handler Page**

```tsx
// EXACT confirmation handler page - NO MODIFICATIONS
'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EmailService } from '@/lib/emailService';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthConfirmPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔐 Processing email confirmation...');

        // Get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error('❌ No valid session found:', sessionError);
          setVerificationStatus('error');
          toast({
            variant: 'destructive',
            title: 'Verification Failed',
            description: 'Unable to verify your email. Please try clicking the link again.'
          });
          return;
        }

        console.log('✅ Valid session found for user:', session.user.email);

        // Update user record to mark email as verified
        try {
          console.log('📝 Updating user verification status...');
          await supabase
            .from('users')
            .update({ 
              email_verified_at: new Date().toISOString(),
              is_active: true 
            })
            .eq('id', session.user.id);
          console.log('✅ User verification status updated');
        } catch (err) {
          console.error('❌ Error updating user verification status:', err);
        }

        // Check for pending claims
        const { data: claim, error: claimError } = await supabase
          .from('claims')
          .select('*, wishlist_items(*, wishlists(*, users(*)))')
          .eq('supporter_user_id', session.user.id)
          .eq('status', 'pending')
          .single();

        if (claim && !claimError) {
          // User has a pending claim - send thank you email
          console.log('🎁 User has pending claim, sending thank you email...');
          
          try {
            const item = claim.wishlist_items;
            const wishlistOwner = item.wishlists.users;
            
            await EmailService.sendThankYouEmail({
              spenderEmail: session.user.email,
              spenderUsername: session.user.user_metadata?.username || 'Valued Spender',
              itemName: item.name,
              amountPaid: 0,
              recipientUsername: wishlistOwner.username,
              claimId: claim.id
            });
            
            console.log('✅ Thank you email sent');
          } catch (emailError) {
            console.error('❌ Error sending thank you email:', emailError);
          }
          
          // Success - redirect to spender list
          setVerificationStatus('success');
          toast({ 
            title: 'Contribution Confirmed!', 
            description: 'Your contribution has been confirmed successfully.' 
          });
          
          setTimeout(() => {
            const isAdmin = session.user.user_metadata?.role === 'admin';
            navigate(isAdmin ? '/admin/dashboard' : '/dashboard/spender-list');
          }, 2000);

        } else {
          // New user without claim - send welcome email
          console.log('👤 New user verification, sending welcome email...');
          
          try {
            const welcomeEmailResult = await EmailService.sendWelcomeEmail({
              userEmail: session.user.email,
              username: session.user.user_metadata?.username || 'User',
              fullName: session.user.user_metadata?.full_name || 'User'
            });
            
            if (welcomeEmailResult.success) {
              console.log('✅ Welcome email sent successfully');
            } else {
              console.error('❌ Failed to send welcome email:', welcomeEmailResult.error);
            }
          } catch (emailError) {
            console.error('❌ Error sending welcome email:', emailError);
          }
          
          // Success - redirect to dashboard
          setVerificationStatus('success');
          toast({ 
            title: 'Email Verified!', 
            description: 'Your email has been verified successfully. Welcome to HeySpender!' 
          });
          
          setTimeout(() => {
            const isAdmin = session.user.user_metadata?.role === 'admin';
            navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
          }, 2000);
        }

      } catch (error) {
        console.error('❌ Verification error:', error);
        setVerificationStatus('error');
        toast({
          variant: 'destructive',
          title: 'Verification Error',
          description: 'An error occurred during verification. Please try again.'
        });
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, toast]);

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-brand-purple-dark mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email...</h2>
          <p className="text-gray-600">Please wait while we confirm your email address.</p>
        </motion.div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">
            We couldn't verify your email. The link may have expired or already been used.
          </p>
          <Button
            variant="custom"
            className="bg-brand-orange text-black"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default AuthConfirmPage;
```

---

## 6. EMAIL SERVICE IMPLEMENTATION

### **6.1 EmailService Class**

```typescript
// EXACT EmailService class - NO MODIFICATIONS
// File: src/lib/emailService.ts

import { supabase } from './customSupabaseClient';

export class EmailService {
  // Send email using Supabase Edge Function
  static async sendEmail({ to, subject, html, text, templateKey, metadata = {} }) {
    try {
      console.log('📧 Sending email:', { to, subject, templateKey });

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html,
          text,
          templateKey,
          metadata
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error in email service:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email to new users
  static async sendWelcomeEmail({ userEmail, username, fullName }) {
    const subject = '🎉 Welcome to HeySpender!';
    const html = this.generateWelcomeEmailHTML({ username, fullName });
    const text = this.generateWelcomeEmailText({ username, fullName });

    return await this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
      templateKey: 'welcome',
      metadata: { username, fullName }
    });
  }

  // Generate welcome email HTML
  static generateWelcomeEmailHTML({ username, fullName }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HeySpender!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #7c3bed 0%, #5b21b6 100%); padding: 40px 20px; border: 2px solid #161B47;">
    <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700;">🎉 Welcome to HeySpender!</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0;">Your journey to meaningful giving starts here</p>
  </div>
  
  <!-- Main Content -->
  <div style="background-color: white; border: 2px solid #161B47; padding: 40px 30px; margin-bottom: 20px;">
    <p style="font-size: 18px; margin-bottom: 20px; color: #161B47;">
      Hi <strong>${fullName || username}</strong>,
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563;">
      Welcome to HeySpender! We're thrilled to have you join our community of generous people who make celebrations special. 🎁
    </p>
    
    <div style="background-color: #f3f4f6; padding: 25px; margin: 30px 0;">
      <p style="font-size: 16px; margin: 0 0 15px 0; color: #161B47; font-weight: 600;">
        What you can do with HeySpender:
      </p>
      <ul style="font-size: 16px; margin: 0; padding-left: 20px; color: #4b5563;">
        <li style="margin-bottom: 10px;">Create wishlists for your special occasions</li>
        <li style="margin-bottom: 10px;">Contribute to friends' and family's celebrations</li>
        <li style="margin-bottom: 10px;">Track your contributions and see the impact you make</li>
        <li style="margin-bottom: 10px;">Get notified when items are purchased</li>
        <li>Manage everything from your personalized dashboard</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://heyspender.com/dashboard" 
         style="display: inline-block; background-color: #86E589; color: #161B47; text-decoration: none; padding: 16px 40px; font-size: 18px; font-weight: 700; border: 2px solid #161B47; box-shadow: -4px 4px 0px 0px rgba(22, 27, 71, 1);">
        Get Started Now
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin: 25px 0 0 0; text-align: center;">
      Ready to create your first wishlist? Click the button above to start!
    </p>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding: 20px; font-size: 14px; color: #6b7280;">
    <p style="margin: 0 0 10px 0;">
      <strong>Need help?</strong> 
      <a href="mailto:support@heyspender.com" style="color: #7c3bed; text-decoration: none;">Contact Support</a>
    </p>
    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
      © HeySpender • Made with ❤️ by ExpressCreo
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  // Generate welcome email plain text
  static generateWelcomeEmailText({ username, fullName }) {
    return `
Welcome to HeySpender!

Hi ${fullName || username},

Welcome to HeySpender! We're thrilled to have you join our community of generous people who make celebrations special.

What you can do with HeySpender:
- Create wishlists for your special occasions
- Contribute to friends' and family's celebrations
- Track your contributions and see the impact you make
- Get notified when items are purchased
- Manage everything from your personalized dashboard

Get started: https://heyspender.com/dashboard

Ready to create your first wishlist? Click the link above to start!

Need help? Contact Support: support@heyspender.com

Happy celebrating!
The HeySpender Team

© HeySpender • Made with ❤️ by ExpressCreo
    `.trim();
  }
}
```

---

## 7. ENVIRONMENT VARIABLES

### **7.1 Required Environment Variables**

```env
# EXACT environment variables - NO MODIFICATIONS

# Supabase Configuration
SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender

# Frontend Configuration
VITE_SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Next.js Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hgvdslcpndmimatvliyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### **7.2 Supabase Secrets Setup**

**In Supabase Dashboard → Settings → Configuration → Secrets:**

```
RESEND_API_KEY=re_your_resend_api_key_here
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_your_resend_api_key_here
SMTP_SENDER_EMAIL=noreply@heyspender.com
SMTP_SENDER_NAME=HeySpender
```

---

## 8. RESEND SETUP GUIDE

### **8.1 Create Resend Account**

1. **Sign up**: Go to [resend.com](https://resend.com)
2. **Verify email**: Check your inbox and verify your account
3. **Get API key**: Dashboard → API Keys → Create API Key
4. **Copy key**: Save it securely (starts with `re_`)

### **8.2 Add Domain (Optional but Recommended)**

1. **Add domain**: Dashboard → Domains → Add Domain
2. **Enter domain**: `heyspender.com`
3. **Verify ownership**: Add DNS records
4. **Wait for verification**: Usually takes a few minutes

**DNS Records to Add:**
```
Type: TXT
Name: @
Value: [Provided by Resend]

Type: MX
Name: @
Value: [Provided by Resend]
Priority: 10
```

### **8.3 Configure Sender Email**

1. **Set sender**: In Resend dashboard
2. **Email address**: `noreply@heyspender.com`
3. **Display name**: `HeySpender`
4. **Verify domain**: Complete domain verification

---

## 9. TESTING THE SYSTEM

### **9.1 Test Email Verification Flow**

```bash
# EXACT testing procedure - NO MODIFICATIONS

# 1. Register a new user
- Go to /register
- Fill in: username, full_name, email, password
- Click "Register"

# 2. Check verification email
- Check email inbox
- Look for email from "HeySpender <noreply@heyspender.com>"
- Subject: "Confirm your signup"

# 3. Click verification link
- Click "Confirm My Email" button
- Should redirect to /auth/confirm
- Should see "Verifying Your Email..." loading screen

# 4. Verify completion
- Should redirect to /dashboard
- Should see "Email Verified!" toast notification
- Check email_logs table for sent emails

# 5. Check welcome email
- Check email inbox again
- Look for "🎉 Welcome to HeySpender!" email
- Verify branding and content
```

### **9.2 Test Scripts**

```javascript
// EXACT test script - NO MODIFICATIONS
// File: tools/test-email-verification.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailVerification() {
  console.log('🧪 Testing Email Verification System...\n');

  // Test 1: Check email_logs table exists
  console.log('1️⃣ Checking email_logs table...');
  const { data: logs, error: logsError } = await supabase
    .from('email_logs')
    .select('*')
    .limit(1);

  if (logsError) {
    console.error('❌ email_logs table not found:', logsError.message);
    console.log('   Run: database/create_email_logs_table.sql');
  } else {
    console.log('✅ email_logs table exists\n');
  }

  // Test 2: Check send-email Edge Function
  console.log('2️⃣ Testing send-email Edge Function...');
  const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
    body: {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test email from verification system</p>',
      text: 'Test email from verification system',
      templateKey: 'test',
      metadata: { test: true }
    }
  });

  if (emailError) {
    console.error('❌ send-email function failed:', emailError.message);
    console.log('   Deploy: supabase functions deploy send-email');
  } else {
    console.log('✅ send-email function working\n');
  }

  // Test 3: Check Resend API key
  console.log('3️⃣ Checking Resend configuration...');
  if (emailData?.provider === 'resend') {
    console.log('✅ Resend API configured correctly\n');
  } else {
    console.log('⚠️ Resend API not configured, check RESEND_API_KEY secret\n');
  }

  console.log('🎉 Email verification system test complete!');
}

testEmailVerification().catch(console.error);
```

---

## 10. TROUBLESHOOTING

### **10.1 Emails Not Received**

**Problem**: User doesn't receive verification email

**Solutions:**
1. Check spam/junk folder
2. Verify Resend API key is correct
3. Check email_logs table for errors
4. Verify domain is verified in Resend
5. Check Supabase Edge Function logs
6. Verify SMTP settings in Supabase Auth

### **10.2 Verification Link Doesn't Work**

**Problem**: Clicking verification link shows error

**Solutions:**
1. Check `emailRedirectTo` URL is correct
2. Verify `/auth/confirm` route exists
3. Check browser console for errors
4. Ensure session is being handled correctly
5. Check Supabase Auth settings

### **10.3 Mobile Users Can't Verify**

**Problem**: Mobile users have trouble with verification link

**Solutions:**
1. Show instructions for opening in default browser
2. Provide copy-paste link option in email template
3. Add mobile-specific instructions in VerifyPage
4. Test deep linking configuration
5. Ensure responsive design for confirmation page

---

## 🚨 CRITICAL IMPLEMENTATION REQUIREMENTS

### **ABSOLUTE REQUIREMENTS:**

1. **SUPABASE AUTH SETUP**: Configure email templates in Supabase dashboard
2. **SMTP CONFIGURATION**: Set up Resend with proper credentials
3. **EDGE FUNCTION**: Deploy send-email function to Supabase
4. **DATABASE SCHEMA**: Create email_logs table with RLS policies
5. **EMAIL SERVICE**: Implement EmailService class with all templates
6. **VERIFICATION PAGES**: Create VerifyPage and AuthConfirmPage
7. **ERROR HANDLING**: Graceful handling of all email failures
8. **MOBILE SUPPORT**: Special instructions for mobile users

### **FORBIDDEN MODIFICATIONS:**

- ❌ NO skipping email verification
- ❌ NO plaintext password emails
- ❌ NO sensitive data in email templates
- ❌ NO unlimited resend attempts
- ❌ NO verification bypasses
- ❌ NO insecure redirect URLs

### **MANDATORY IMPLEMENTATION:**

- ✅ Use EXACT Supabase email template provided
- ✅ Use EXACT SMTP configuration provided
- ✅ Use EXACT Edge Function code provided
- ✅ Use EXACT database schema provided
- ✅ Use EXACT EmailService class provided
- ✅ Use EXACT verification pages provided
- ✅ Use EXACT error handling provided
- ✅ Use EXACT environment variables provided

**IMPLEMENT EXACTLY AS SPECIFIED. This system ensures secure, reliable email verification with professional branding and excellent user experience!** 🎉
