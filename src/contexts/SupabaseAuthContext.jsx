'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SupabaseAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    // Return default values if context is not available
    return {
      user: null,
      loading: false,
      isVerified: true,
      signInWithEmailPassword: () => Promise.resolve({ error: null }),
      signUpWithEmailPassword: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true to prevent premature redirects
  const [isVerified, setIsVerified] = useState(true);
  const isInitialized = useRef(false);
  const lastUserRef = useRef(null);

  const updateUser = useCallback(async (newUser) => {
    // Only update if the user actually changed
    if (lastUserRef.current?.id !== newUser?.id) {
      lastUserRef.current = newUser;
      
      // Check if user is verified
      const userVerified = newUser?.email_confirmed_at !== null;
      setIsVerified(userVerified);
      
      // Fetch user role from database and merge with auth user
      if (newUser?.id) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('role, full_name, username, phone')
            .eq('id', newUser.id)
            .single();
          
          if (!error && userData) {
            // Merge database role and user data with auth user
            const enhancedUser = {
              ...newUser,
              user_metadata: {
                ...newUser.user_metadata,
                role: userData.role || 'user',
                full_name: userData.full_name || newUser.user_metadata?.full_name,
                username: userData.username || newUser.user_metadata?.username,
                phone: userData.phone || newUser.user_metadata?.phone
              }
            };
            setUser(enhancedUser);
            console.log('Auth user updated:', enhancedUser?.id, enhancedUser?.email, 'role:', userData.role, 'verified:', userVerified);
            return;
          } else if (error && error.code === 'PGRST116') {
            // User record doesn't exist yet (common during registration)
            console.log('User record not found in database yet, using auth user data');
            setUser(newUser);
            console.log('Auth user updated:', newUser?.id, newUser?.email, 'verified:', userVerified);
            return;
          }
        } catch (error) {
          console.warn('Error fetching user role from database:', error);
          // If there's an error fetching user data, still set the user
          setUser(newUser);
          console.log('Auth user updated (fallback):', newUser?.id, newUser?.email, 'verified:', userVerified);
          return;
        }
      }
      
      // If no additional data or error, just set the user as-is
      setUser(newUser);
      console.log('Auth user updated:', newUser?.id, newUser?.email, 'verified:', userVerified);
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Skip authentication initialization in static export
    if (typeof window === 'undefined') {
      setLoading(false);
      setUser(null);
      return;
    }

    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Session error (clearing user):", error.message);
          updateUser(null);
        } else {
          updateUser(session?.user ?? null);
        }
      } catch (error) {
        console.warn("Session error (clearing user):", error);
        updateUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        // Handle all auth events including token refresh, session expiry, and password recovery
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') {
          updateUser(session?.user ?? null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [updateUser]);

  const signUpWithEmailPassword = useCallback((payload) => {
    return supabase.auth.signUp(payload);
  }, []);

  // Supports either: (identifier, password) OR ({ email, password })
  const signInWithEmailPassword = useCallback(async (arg1, arg2) => {
    // If first arg is an object, assume it's the original credentials shape
    if (typeof arg1 === 'object' && arg1 !== null) {
      return supabase.auth.signInWithPassword(arg1);
    }

    const identifier = String(arg1 || '').trim();
    const password = String(arg2 || '');

    if (!identifier || !password) {
      return { error: new Error('Missing credentials') };
    }

    // If identifier looks like an email, sign in directly
    if (identifier.includes('@')) {
      return supabase.auth.signInWithPassword({ email: identifier, password });
    }

    // Otherwise, treat identifier as username → resolve to email
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .maybeSingle();

      if (error) {
        return { error };
      }

      if (!data?.email) {
        return { error: new Error('No account found for that username') };
      }

      return supabase.auth.signInWithPassword({ email: data.email, password });
    } catch (err) {
      return { error: err };
    }
  }, []);
  
  const signOut = useCallback(async () => {
    try {
      // Always clear local state first, regardless of server response
      setUser(null);
      setLoading(false);
      
      // Try to sign out from server, but don't fail if session doesn't exist
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Sign out server error (but proceeding with local logout):', error.message);
        // Don't throw error for session_not_found - user is already logged out locally
        if (error.message?.includes('session_not_found')) {
          console.log('Session already expired, local logout completed');
          return { error: null };
        }
        // For other errors, still return success since we cleared local state
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.warn('Sign out error (but proceeding with local logout):', error);
      // Even if there's an error, we've cleared the local state
      return { error: null };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    return supabase.auth.updateUser({ password: newPassword });
  }, []);

  const updateEmail = useCallback(async (newEmail) => {
    return supabase.auth.updateUser({ email: newEmail });
  }, []);

  const requestPasswordReset = useCallback(async (email, redirectTo) => {
    try {
      console.log('Requesting password reset for:', email);
      console.log('Redirect URL:', redirectTo || `${window.location.origin}/auth/reset-password`);
      
      // First, check if the user exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error checking user:', userError);
        return { error: { message: 'Unable to verify user account. Please try again.' } };
      }
      
      if (!userData) {
        return { error: { message: 'No account found with this email address.' } };
      }
      
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`
      });
      
      console.log('Password reset result:', result);
      return result;
    } catch (error) {
      console.error('Password reset request error:', error);
      return { error };
    }
  }, []);

  const resetPassword = useCallback(async (newPassword) => {
    return supabase.auth.updateUser({ 
      password: newPassword 
    });
  }, []);

  const value = {
    user,
    loading,
    isVerified,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signOut,
    updatePassword,
    updateEmail,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};