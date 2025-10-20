// Reminder Service for HeySpender
// This service handles automatic reminder creation and management for claims

import { supabase } from './customSupabaseClient';
import { EmailService } from './emailService';

export class ReminderService {
  // Create automatic reminder when a claim is made
  static async createAutomaticReminder({ claimId, spenderEmail, spenderUsername, itemName, itemPrice, quantity = 1 }) {
    try {
      console.log('🔔 [ReminderService] Creating automatic reminder for claim:', claimId);
      console.log('🔔 [ReminderService] Input data:', {
        claimId,
        spenderEmail,
        spenderUsername,
        itemName,
        itemPrice,
        quantity
      });

      // Calculate the first reminder date (2 days from now)
      const firstReminderDate = new Date();
      firstReminderDate.setDate(firstReminderDate.getDate() + 2);
      console.log('🔔 [ReminderService] First reminder date:', firstReminderDate.toISOString());

      // Create reminder record in database
      const reminderInsertData = {
        claim_id: claimId,
        contact: spenderEmail,
        schedule_at: firstReminderDate.toISOString(),
        channel: 'email',
        status: 'sent'
      };
      
      console.log('🔔 [ReminderService] Inserting reminder data:', reminderInsertData);
      
      const { data: reminderData, error: reminderError } = await supabase
        .from('reminders')
        .insert(reminderInsertData)
        .select()
        .single();

      console.log('🔔 [ReminderService] Database insert result:', { data: reminderData, error: reminderError });

      if (reminderError) {
        console.error('❌ [ReminderService] Error creating reminder:', reminderError);
        return { success: false, error: reminderError.message };
      }

      console.log('✅ [ReminderService] Automatic reminder created:', reminderData);

      // Send initial confirmation email
      try {
        await this.sendReminderConfirmationEmail({
          spenderEmail,
          spenderUsername,
          itemName,
          itemPrice,
          quantity,
          reminderDate: firstReminderDate
        });
        console.log('✅ [ReminderService] Confirmation email sent');
      } catch (emailError) {
        console.error('⚠️ [ReminderService] Error sending confirmation email:', emailError);
        // Don't fail the whole operation if email fails
      }

      return { success: true, data: reminderData };
    } catch (error) {
      console.error('❌ [ReminderService] Error in createAutomaticReminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Update reminder schedule (called when spender updates their reminder)
  static async updateReminderSchedule({ claimId, newScheduleDate, spenderEmail, spenderUsername, itemName }) {
    try {
      console.log('🔄 Updating reminder schedule for claim:', claimId);

      // Update existing reminder or create new one
      const { data: reminderData, error: reminderError } = await supabase
        .from('reminders')
        .upsert({
          claim_id: claimId,
          contact: spenderEmail,
          schedule_at: newScheduleDate.toISOString(),
          channel: 'email',
          status: 'sent'
        })
        .select()
        .single();

      if (reminderError) {
        console.error('Error updating reminder:', reminderError);
        return { success: false, error: reminderError.message };
      }

      console.log('✅ Reminder schedule updated:', reminderData);

      // Send update confirmation email
      await this.sendReminderUpdateEmail({
        spenderEmail,
        spenderUsername,
        itemName,
        newReminderDate: newScheduleDate
      });

      return { success: true, data: reminderData };
    } catch (error) {
      console.error('Error in updateReminderSchedule:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel reminder (when item is fully paid or claim is cancelled)
  static async cancelReminder({ claimId, reason = 'item_fulfilled' }) {
    try {
      console.log('❌ Cancelling reminder for claim:', claimId, 'Reason:', reason);

      const { error } = await supabase
        .from('reminders')
        .update({ status: 'failed' })
        .eq('claim_id', claimId)
        .eq('status', 'sent');

      if (error) {
        console.error('Error cancelling reminder:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Reminder cancelled successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in cancelReminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Get reminder for a specific claim
  static async getReminderForClaim({ claimId }) {
    try {
      console.log('🔍 [ReminderService] Getting reminder for claim:', claimId);
      
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('claim_id', claimId)
        .eq('status', 'sent')
        .single();

      console.log('🔍 [ReminderService] Database query result:', { data, error });

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ [ReminderService] Error fetching reminder:', error);
        return { success: false, error: error.message };
      }

      if (data) {
        console.log('✅ [ReminderService] Found reminder:', data);
      } else {
        console.log('ℹ️ [ReminderService] No reminder found for claim:', claimId);
      }

      return { success: true, data: data || null };
    } catch (error) {
      console.error('❌ [ReminderService] Error in getReminderForClaim:', error);
      return { success: false, error: error.message };
    }
  }

  // Send reminder confirmation email
  static async sendReminderConfirmationEmail({ spenderEmail, spenderUsername, itemName, itemPrice, quantity, reminderDate }) {
    const subject = '🔔 Reminder Set - HeySpender';
    const html = this.generateReminderConfirmationHTML({ 
      spenderUsername, 
      itemName, 
      itemPrice, 
      quantity, 
      reminderDate 
    });
    const text = this.generateReminderConfirmationText({ 
      spenderUsername, 
      itemName, 
      itemPrice, 
      quantity, 
      reminderDate 
    });

    return await EmailService.sendEmail({
      to: spenderEmail,
      subject,
      html,
      text,
      templateKey: 'reminder_confirmation',
      metadata: { 
        spenderUsername, 
        itemName, 
        itemPrice, 
        quantity, 
        reminderDate: reminderDate.toISOString() 
      }
    });
  }

  // Send reminder update email
  static async sendReminderUpdateEmail({ spenderEmail, spenderUsername, itemName, newReminderDate }) {
    const subject = '🔄 Reminder Updated - HeySpender';
    const html = this.generateReminderUpdateHTML({ 
      spenderUsername, 
      itemName, 
      newReminderDate 
    });
    const text = this.generateReminderUpdateText({ 
      spenderUsername, 
      itemName, 
      newReminderDate 
    });

    return await EmailService.sendEmail({
      to: spenderEmail,
      subject,
      html,
      text,
      templateKey: 'reminder_update',
      metadata: { 
        spenderUsername, 
        itemName, 
        newReminderDate: newReminderDate.toISOString() 
      }
    });
  }

  // Send payment reminder email (called by cron job)
  static async sendPaymentReminder({ spenderEmail, spenderUsername, itemName, itemPrice, quantity, remainingAmount, claimId }) {
    const subject = '💰 Payment Reminder - HeySpender';
    const html = this.generatePaymentReminderHTML({ 
      spenderUsername, 
      itemName, 
      itemPrice, 
      quantity, 
      remainingAmount 
    });
    const text = this.generatePaymentReminderText({ 
      spenderUsername, 
      itemName, 
      itemPrice, 
      quantity, 
      remainingAmount 
    });

    const result = await EmailService.sendEmail({
      to: spenderEmail,
      subject,
      html,
      text,
      templateKey: 'payment_reminder',
      metadata: { 
        claimId,
        spenderUsername, 
        itemName, 
        itemPrice, 
        quantity, 
        remainingAmount 
      }
    });

    // If email sent successfully, schedule next reminder (2 days from now)
    if (result.success) {
      const nextReminderDate = new Date();
      nextReminderDate.setDate(nextReminderDate.getDate() + 2);

      await supabase
        .from('reminders')
        .update({ schedule_at: nextReminderDate.toISOString() })
        .eq('claim_id', claimId)
        .eq('status', 'pending');
    }

    return result;
  }

  // Email Template Generators
  static generateReminderConfirmationHTML({ spenderUsername, itemName, itemPrice, quantity, reminderDate }) {
    const totalPrice = itemPrice * quantity;
    const formattedDate = reminderDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder Set - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">🔔 Reminder Set!</h1>
    <p style="color: #666; font-size: 16px;">We'll remind you to complete your payment</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${spenderUsername},</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Great! You've added <strong>${itemName}</strong> to your spender list. We've automatically set up a reminder system to help you stay on track with your payment.
    </p>
    
    <div style="background-color: white; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Item Details:</p>
      <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #161B47;">${itemName}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Quantity: ${quantity}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Total Amount: ₦${totalPrice.toLocaleString()}</p>
    </div>
    
    <div style="background-color: #e8f5e8; border-radius: 4px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #2d5a2d; font-weight: bold;">📅 Next Reminder:</p>
      <p style="margin: 5px 0; font-size: 16px; color: #2d5a2d;">${formattedDate}</p>
      <p style="margin: 10px 0 0; font-size: 12px; color: #2d5a2d;">We'll send you a friendly reminder every 2 days until the item is fully paid.</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      You can update or cancel your reminder anytime from your spender list dashboard.
    </p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/spender-list" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        View My Spender List
      </a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      Happy giving!<br>
      <strong>The HeySpender Team</strong>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateReminderConfirmationText({ spenderUsername, itemName, itemPrice, quantity, reminderDate }) {
    const totalPrice = itemPrice * quantity;
    const formattedDate = reminderDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
Reminder Set - HeySpender

Hi ${spenderUsername},

Great! You've added ${itemName} to your spender list. We've automatically set up a reminder system to help you stay on track with your payment.

Item Details:
- Item: ${itemName}
- Quantity: ${quantity}
- Total Amount: ₦${totalPrice.toLocaleString()}

Next Reminder: ${formattedDate}
We'll send you a friendly reminder every 2 days until the item is fully paid.

You can update or cancel your reminder anytime from your spender list dashboard.

View My Spender List: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/spender-list

Happy giving!
The HeySpender Team
    `.trim();
  }

  static generateReminderUpdateHTML({ spenderUsername, itemName, newReminderDate }) {
    const formattedDate = newReminderDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder Updated - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">🔄 Reminder Updated!</h1>
    <p style="color: #666; font-size: 16px;">Your reminder schedule has been updated</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${spenderUsername},</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Your reminder for <strong>${itemName}</strong> has been successfully updated.
    </p>
    
    <div style="background-color: #e8f5e8; border-radius: 4px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #2d5a2d; font-weight: bold;">📅 New Reminder Date:</p>
      <p style="margin: 5px 0; font-size: 16px; color: #2d5a2d;">${formattedDate}</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 0;">
      We'll continue sending you reminders every 2 days until the item is fully paid.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      The HeySpender Team
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateReminderUpdateText({ spenderUsername, itemName, newReminderDate }) {
    const formattedDate = newReminderDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
Reminder Updated - HeySpender

Hi ${spenderUsername},

Your reminder for ${itemName} has been successfully updated.

New Reminder Date: ${formattedDate}

We'll continue sending you reminders every 2 days until the item is fully paid.

The HeySpender Team
    `.trim();
  }

  static generatePaymentReminderHTML({ spenderUsername, itemName, itemPrice, quantity, remainingAmount }) {
    const totalPrice = itemPrice * quantity;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">💰 Payment Reminder</h1>
    <p style="color: #666; font-size: 16px;">Don't forget to complete your payment</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${spenderUsername},</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      This is a friendly reminder that you still have an outstanding payment for <strong>${itemName}</strong>.
    </p>
    
    <div style="background-color: white; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Payment Details:</p>
      <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #161B47;">${itemName}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Quantity: ${quantity}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Total Amount: ₦${totalPrice.toLocaleString()}</p>
      <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #e74c3c;">Remaining: ₦${remainingAmount.toLocaleString()}</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Complete your payment to help make someone's celebration special! 🎉
    </p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/spender-list" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        Complete Payment
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin: 20px 0 0;">
      You can update your reminder preferences or cancel this reminder from your dashboard.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      Thank you for your generosity!<br>
      <strong>The HeySpender Team</strong>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generatePaymentReminderText({ spenderUsername, itemName, itemPrice, quantity, remainingAmount }) {
    const totalPrice = itemPrice * quantity;

    return `
Payment Reminder - HeySpender

Hi ${spenderUsername},

This is a friendly reminder that you still have an outstanding payment for ${itemName}.

Payment Details:
- Item: ${itemName}
- Quantity: ${quantity}
- Total Amount: ₦${totalPrice.toLocaleString()}
- Remaining: ₦${remainingAmount.toLocaleString()}

Complete your payment to help make someone's celebration special!

Complete Payment: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/spender-list

You can update your reminder preferences or cancel this reminder from your dashboard.

Thank you for your generosity!
The HeySpender Team
    `.trim();
  }
}

// Export helper functions for backward compatibility
export const createAutomaticReminder = ReminderService.createAutomaticReminder.bind(ReminderService);
export const updateReminderSchedule = ReminderService.updateReminderSchedule.bind(ReminderService);
export const cancelReminder = ReminderService.cancelReminder.bind(ReminderService);
export const getReminderForClaim = ReminderService.getReminderForClaim.bind(ReminderService);
export const sendPaymentReminder = ReminderService.sendPaymentReminder.bind(ReminderService);
