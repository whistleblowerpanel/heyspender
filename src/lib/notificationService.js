// Notification Service for Withdrawal Management
// This service handles sending notifications for withdrawal status changes

import { supabase } from './customSupabaseClient';
import { EmailService } from './emailService';

export class NotificationService {
  // Send notification to admins about new withdrawal request
  static async notifyAdminsNewWithdrawal(payoutData) {
    try {
      // Get all admin users
      const { data: admins, error: adminError } = await supabase
        .from('users')
        .select('email, user_metadata')
        .eq('role', 'admin')
        .eq('is_active', true);

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        return;
      }

      if (!admins || admins.length === 0) {
        console.log('No admin users found for notification');
        return;
      }

      // Send email notifications to admins
      const adminEmails = admins.map(admin => admin.email).filter(Boolean);
      
      // Send email notifications to all admins
      if (adminEmails.length > 0) {
        const emailResult = await EmailService.sendWithdrawalNotificationToAdmins({
          adminEmails,
          payoutData
        });
        
        console.log('📧 ADMIN NOTIFICATION: New withdrawal request', {
          payoutId: payoutData.id,
          amount: payoutData.amount,
          userEmail: payoutData.wallet?.user?.email,
          bankCode: payoutData.destination_bank_code,
          accountNumber: payoutData.destination_account,
          adminEmails: adminEmails,
          emailResults: emailResult,
          timestamp: new Date().toISOString()
        });
      }

      // Store notification in database for admin dashboard
      await this.storeAdminNotification({
        type: 'new_withdrawal_request',
        title: 'New Withdrawal Request',
        message: `₦${Number(payoutData.amount).toLocaleString()} withdrawal requested by ${payoutData.wallet?.user?.email || 'Unknown user'}`,
        data: {
          payout_id: payoutData.id,
          amount: payoutData.amount,
          user_email: payoutData.wallet?.user?.email,
          bank_code: payoutData.destination_bank_code,
          account_number: payoutData.destination_account
        }
      });

      return { success: true, adminCount: adminEmails.length };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification to user about withdrawal status change
  static async notifyUserStatusChange(payoutData, oldStatus, newStatus) {
    try {
      const userEmail = payoutData.wallet?.user?.email;
      if (!userEmail) {
        console.log('No user email found for notification');
        return;
      }

      const statusMessages = {
        'requested': 'Your withdrawal request has been submitted and is under review.',
        'processing': 'Your withdrawal has been approved and is now being processed.',
        'paid': 'Your withdrawal has been completed and funds have been transferred.',
        'failed': 'Your withdrawal request was not approved. Please contact support for more information.'
      };

      const message = statusMessages[newStatus] || 'Your withdrawal status has been updated.';

      // Send email notification to user
      const emailResult = await EmailService.sendWithdrawalStatusUpdate({
        userEmail,
        payoutData,
        oldStatus,
        newStatus
      });

      // Log the notification
      console.log('📧 USER NOTIFICATION: Withdrawal status change', {
        payoutId: payoutData.id,
        userEmail: userEmail,
        oldStatus: oldStatus,
        newStatus: newStatus,
        amount: payoutData.amount,
        message: message,
        emailResult: emailResult,
        timestamp: new Date().toISOString()
      });

      // Store notification in database for user dashboard
      await this.storeUserNotification({
        user_id: payoutData.wallet.user_id,
        type: 'withdrawal_status_change',
        title: 'Withdrawal Status Update',
        message: message,
        data: {
          payout_id: payoutData.id,
          old_status: oldStatus,
          new_status: newStatus,
          amount: payoutData.amount
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending user notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Store admin notification in database
  static async storeAdminNotification(notification) {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .insert({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          is_read: false
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing admin notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Store user notification in database
  static async storeUserNotification(notification) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: notification.type,
          template_key: notification.type,
          payload: {
            title: notification.title,
            message: notification.message,
            data: notification.data
          },
          status: 'unread'
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing user notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Get unread notifications for admin
  static async getAdminNotifications() {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, notifications: data || [] };
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Get unread notifications for user
  static async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'unread')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, notifications: data || [] };
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId, type = 'user') {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Send thank you notification to spender when item is fully paid
  static async sendThankYouToSpender({ spenderId, spenderEmail, spenderUsername, itemName, amountPaid, recipientUsername, claimId }) {
    try {
      console.log('💌 Sending thank you notification to spender', {
        spenderId,
        spenderEmail,
        itemName,
        amountPaid,
        recipientUsername
      });

      const message = `Thank you for your generous contribution of ₦${Number(amountPaid).toLocaleString()} towards "${itemName}"! ${recipientUsername} will be delighted. Your kindness makes celebrations special! 🎉`;

      // Store notification in database for spender
      await this.storeUserNotification({
        user_id: spenderId,
        type: 'payment_thank_you',
        title: 'Thank You for Your Contribution! 🎁',
        message: message,
        data: {
          claim_id: claimId,
          item_name: itemName,
          amount_paid: amountPaid,
          recipient_username: recipientUsername
        }
      });

      // Send email notification to spender
      const emailResult = await EmailService.sendThankYouEmail({
        spenderEmail,
        spenderUsername,
        itemName,
        amountPaid,
        recipientUsername,
        claimId
      });

      console.log('📧 Thank you email sent:', {
        spenderEmail,
        spenderUsername,
        itemName,
        amountPaid,
        recipientUsername,
        emailResult
      });

      console.log('✅ Thank you notification sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending thank you notification:', error);
      return { success: false, error: error.message };
    }
  }

}

// Helper function to send withdrawal notifications
export const sendWithdrawalNotifications = {
  // Called when a new withdrawal is requested
  async onNewWithdrawal(payoutData) {
    return await NotificationService.notifyAdminsNewWithdrawal(payoutData);
  },

  // Called when withdrawal status changes
  async onStatusChange(payoutData, oldStatus, newStatus) {
    return await NotificationService.notifyUserStatusChange(payoutData, oldStatus, newStatus);
  }
};
