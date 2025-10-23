/**
 * Email Verification Utilities
 * 
 * This file contains utilities for managing email verification in the future
 * when we re-enable email confirmation in Supabase.
 */

import { supabase } from './customSupabaseClient';

/**
 * Get all users who haven't verified their email
 * This will be used for broadcasting verification reminders
 */
export const getUnverifiedUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at')
      .is('email_verified_at', null)
      .eq('is_active', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unverified users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching unverified users:', error);
    return [];
  }
};

/**
 * Send verification reminder to a specific user
 */
export const sendVerificationReminder = async (userId) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return { success: false, error: 'User not found' };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    });

    if (error) {
      console.error('Error sending verification reminder:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending verification reminder:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

/**
 * Send verification reminders to all unverified users
 * This will be used for the broadcast feature
 */
export const sendBroadcastVerificationReminders = async () => {
  try {
    const unverifiedUsers = await getUnverifiedUsers();
    
    if (unverifiedUsers.length === 0) {
      return { success: true, message: 'No unverified users found' };
    }

    const results = [];
    
    // Send reminders to all unverified users
    for (const user of unverifiedUsers) {
      const result = await sendVerificationReminder(user.id);
      results.push({
        userId: user.id,
        email: user.email,
        success: result.success,
        error: result.error
      });
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: true,
      message: `Sent verification reminders to ${successful} users. ${failed} failed.`,
      results
    };
  } catch (error) {
    console.error('Error sending broadcast verification reminders:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

/**
 * Check if a user needs email verification
 * This will be used to determine if the banner should show
 */
export const userNeedsEmailVerification = (user) => {
  // For now, return false since email verification is disabled
  // In the future, this will check user.email_verified_at
  return false;
  
  // Future implementation:
  // return user && !user.email_verified_at;
};

/**
 * Mark a user as email verified
 * This will be used when email verification is re-enabled
 */
export const markUserAsEmailVerified = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        email_verified_at: new Date().toISOString(),
        is_active: true 
      })
      .eq('id', userId);

    if (error) {
      console.error('Error marking user as verified:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking user as verified:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};
