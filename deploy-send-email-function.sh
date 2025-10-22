#!/bin/bash

# Deploy send-email Edge Function to Supabase
# This script deploys the missing Edge Function that handles all email sending

echo "🚀 Deploying send-email Edge Function to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/functions/send-email/index.ts" ]; then
    echo "❌ send-email Edge Function not found. Please run this script from the project root."
    exit 1
fi

# Deploy the function
echo "📧 Deploying send-email function..."
supabase functions deploy send-email --project-ref hgvdslcpndmimatvliyu

if [ $? -eq 0 ]; then
    echo "✅ send-email Edge Function deployed successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Configure Resend API key in Supabase Dashboard → Settings → Secrets"
    echo "2. Set up SMTP settings in Supabase Dashboard → Authentication → SMTP"
    echo "3. Test email sending by registering a new user"
    echo ""
    echo "📋 Required Supabase Secrets:"
    echo "- RESEND_API_KEY=re_your_resend_api_key_here"
    echo "- SMTP_HOST=smtp.resend.com"
    echo "- SMTP_PORT=465"
    echo "- SMTP_USER=resend"
    echo "- SMTP_PASSWORD=re_your_resend_api_key_here"
    echo "- SMTP_SENDER_EMAIL=noreply@heyspender.com"
    echo "- SMTP_SENDER_NAME=HeySpender"
else
    echo "❌ Failed to deploy send-email Edge Function"
    echo "Please check your Supabase CLI configuration and try again"
    exit 1
fi
