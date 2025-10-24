#!/bin/bash

# Password Reset Testing Script
# This script helps test the password reset flow locally

echo "🔧 HeySpender Password Reset Testing Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Found project directory"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "   Make sure you have Supabase environment variables set"
    echo "   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
else
    echo "✅ Environment file found"
fi

echo ""
echo "🚀 Starting local development server..."
echo "   Server will be available at: http://localhost:3000"
echo ""
echo "📋 Testing Checklist:"
echo "   1. Go to: http://localhost:3000/auth/forgot-password"
echo "   2. Enter a test email address"
echo "   3. Click 'Send Reset Link'"
echo "   4. Check browser console for errors"
echo "   5. Check email inbox (and spam folder)"
echo "   6. Click the reset link from email"
echo "   7. Verify it redirects to reset password page"
echo ""
echo "🔍 Debugging Tips:"
echo "   - Open browser Developer Tools (F12)"
echo "   - Check Console tab for JavaScript errors"
echo "   - Check Network tab for failed requests"
echo "   - Check Supabase Dashboard → Authentication → Users"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
