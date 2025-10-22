import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration - try environment variables first, fallback to hardcoded for static export
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://hgvdslcpndmimatvliyu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmRzbGNwbmRtaW1hdHZsaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzA2NjksImV4cCI6MjA3NTAwNjY2OX0.1d-UszrAW-_rUemrmBEbHRoa1r8zOrbo-wtKaXMPW9k';

// Check if we have valid configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    multiTab: false,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    // PKCE flow settings for better security and mobile support
    flowType: 'pkce',
    debug: false, // Set to false for production
    // Additional PKCE settings
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token'
  }
});

// Test connection and log status
supabase.from('users').select('count').limit(1).then(
  () => console.log('✅ Supabase connection successful'),
  (error) => console.error('❌ Supabase connection failed:', error.message)
);

// Test auth connection
supabase.auth.getSession().then(
  ({ data, error }) => {
    if (error) {
      console.error('❌ Supabase auth connection failed:', error.message);
    } else {
      console.log('✅ Supabase auth connection successful');
    }
  }
);