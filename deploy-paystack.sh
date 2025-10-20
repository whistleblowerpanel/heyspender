#!/bin/bash

# Paystack Integration Deployment Script
# This script deploys the Supabase Edge Function and sets up the database schema

echo "🚀 Starting Paystack Integration Deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Deploy the Edge Function
echo "📦 Deploying Paystack webhook Edge Function..."
supabase functions deploy process-payment-webhook

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully"
else
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

# Get the project URL for the webhook
echo "🔗 Getting project URL..."
PROJECT_URL=$(supabase status | grep "API URL" | awk '{print $3}' | sed 's/\/$//')
WEBHOOK_URL="${PROJECT_URL}/functions/v1/process-payment-webhook"

echo "📋 Next steps:"
echo "1. Set your environment variables in your hosting platform:"
echo "   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_live_key_here"
echo "   - NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_live_key_here"
echo "   - NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET=your_random_webhook_secret_string"
echo ""
echo "2. Configure your Paystack webhook URL:"
echo "   ${WEBHOOK_URL}"
echo ""
echo "3. Run the database migration in your Supabase SQL editor:"
echo "   Copy and paste the contents of supabase/migrations/001_paystack_integration.sql"
echo ""
echo "4. Test your payment flow on the live website"
echo ""
echo "🎉 Paystack integration setup complete!"
