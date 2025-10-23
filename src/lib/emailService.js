// Email Service for HeySpender
// This service handles sending emails via SMTP through Supabase Edge Functions

import { supabase } from './customSupabaseClient';

export class EmailService {
  // Send email using Supabase Edge Function
  static async sendEmail({ to, subject, html, text, templateKey, metadata = {} }) {
    try {
      console.log('📧 Sending email via SMTP:', {
        to,
        subject,
        templateKey,
        metadata
      });

      // Call Supabase Edge Function to send email
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

  // Send password reset email
  static async sendPasswordResetEmail({ userEmail, resetLink }) {
    const subject = 'Reset Your Password - HeySpender';
    const html = this.generatePasswordResetEmailHTML({ resetLink });
    const text = this.generatePasswordResetEmailText({ resetLink });

    return await this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
      templateKey: 'password_reset',
      metadata: { resetLink }
    });
  }

  // Send thank you email to spenders
  static async sendThankYouEmail({ spenderEmail, spenderUsername, itemName, amountPaid, recipientUsername, claimId }) {
    const subject = '🎁 Thank You for Your Generous Contribution!';
    const html = this.generateThankYouEmailHTML({ 
      spenderUsername: spenderUsername || 'Valued Spender', 
      itemName, 
      amountPaid, 
      recipientUsername 
    });
    const text = this.generateThankYouEmailText({ 
      spenderUsername: spenderUsername || 'Valued Spender', 
      itemName, 
      amountPaid, 
      recipientUsername 
    });

    return await this.sendEmail({
      to: spenderEmail,
      subject,
      html,
      text,
      templateKey: 'payment_thank_you',
      metadata: { 
        claimId, 
        spenderUsername, 
        itemName, 
        amountPaid, 
        recipientUsername 
      }
    });
  }

  // Send withdrawal notification to admins
  static async sendWithdrawalNotificationToAdmins({ adminEmails, payoutData }) {
    const subject = '💰 New Withdrawal Request - HeySpender';
    const html = this.generateWithdrawalNotificationHTML({ payoutData });
    const text = this.generateWithdrawalNotificationText({ payoutData });

    const results = [];
    for (const adminEmail of adminEmails) {
      const result = await this.sendEmail({
        to: adminEmail,
        subject,
        html,
        text,
        templateKey: 'admin_withdrawal_notification',
        metadata: { payoutId: payoutData.id, amount: payoutData.amount }
      });
      results.push(result);
    }

    return results;
  }

  // Send withdrawal status update to user
  static async sendWithdrawalStatusUpdate({ userEmail, payoutData, oldStatus, newStatus }) {
    const statusMessages = {
      'requested': 'Your withdrawal request has been submitted and is under review.',
      'processing': 'Your withdrawal has been approved and is now being processed.',
      'paid': 'Your withdrawal has been completed and funds have been transferred.',
      'failed': 'Your withdrawal request was not approved. Please contact support for more information.'
    };

    const message = statusMessages[newStatus] || 'Your withdrawal status has been updated.';
    const subject = `💰 Withdrawal Status Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    
    const html = this.generateWithdrawalStatusUpdateHTML({ 
      payoutData, 
      oldStatus, 
      newStatus, 
      message 
    });
    const text = this.generateWithdrawalStatusUpdateText({ 
      payoutData, 
      oldStatus, 
      newStatus, 
      message 
    });

    return await this.sendEmail({
      to: userEmail,
      subject,
      html,
      text,
      templateKey: 'withdrawal_status_update',
      metadata: { 
        payoutId: payoutData.id, 
        oldStatus, 
        newStatus, 
        amount: payoutData.amount 
      }
    });
  }

  // Email Template Generators
  static generateWelcomeEmailHTML({ username, fullName }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HeySpender!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">🎉 Welcome to HeySpender!</h1>
    <p style="color: #666; font-size: 16px;">Your journey to meaningful giving starts here</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${fullName || username},</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Welcome to HeySpender! We're thrilled to have you join our community of generous people who make celebrations special. 🎁
    </p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      With HeySpender, you can:
    </p>
    
    <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
      <li>Create wishlists for your special occasions</li>
      <li>Contribute to friends' and family's celebrations</li>
      <li>Track your contributions and see the impact you make</li>
      <li>Get notified when items are purchased</li>
    </ul>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/wishlist" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        Get Started
      </a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      Happy celebrating!<br>
      <strong>The HeySpender Team</strong>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateWelcomeEmailText({ username, fullName }) {
    return `
Welcome to HeySpender!

Hi ${fullName || username},

Welcome to HeySpender! We're thrilled to have you join our community of generous people who make celebrations special.

With HeySpender, you can:
- Create wishlists for your special occasions
- Contribute to friends' and family's celebrations
- Track your contributions and see the impact you make
- Get notified when items are purchased

Get started: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/wishlist

Happy celebrating!
The HeySpender Team
    `.trim();
  }

  static generatePasswordResetEmailHTML({ resetLink }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">🔐 Reset Your Password</h1>
    <p style="color: #666; font-size: 16px;">We received a request to reset your password</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi there,</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Someone requested a password reset for your HeySpender account. If this was you, click the button below to reset your password.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      This link will expire in 1 hour for security reasons.
    </p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${resetLink}" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    
    <div style="background-color: white; border-radius: 4px; padding: 15px; margin: 20px 0;">
      <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">Button not working? Copy and paste this link:</p>
      <p style="font-size: 14px; color: #161B47; margin: 0; word-break: break-all;">${resetLink}</p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin: 20px 0 0;">
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      Need help? <a href="mailto:support@heyspender.com" style="color: #FF6B35;">Contact Support</a>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generatePasswordResetEmailText({ resetLink }) {
    return `
Reset Your Password - HeySpender

Hi there,

Someone requested a password reset for your HeySpender account. If this was you, click the link below to reset your password.

Reset Password: ${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact Support: support@heyspender.com

The HeySpender Team
    `.trim();
  }

  static generateThankYouEmailHTML({ spenderUsername, itemName, amountPaid, recipientUsername }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">🎁 Thank You!</h1>
    <p style="color: #666; font-size: 16px;">Your Generosity Makes a Difference</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${spenderUsername},</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      We wanted to take a moment to say <strong>thank you</strong> for your generous contribution! 💝
    </p>
    
    <div style="background-color: white; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">You contributed:</p>
      <p style="margin: 5px 0 10px; font-size: 24px; font-weight: bold; color: #161B47;">₦${Number(amountPaid).toLocaleString()}</p>
      <p style="margin: 0; font-size: 14px; color: #666;">towards <strong>${itemName}</strong></p>
      <p style="margin: 10px 0 0; font-size: 14px; color: #666;">for <strong>@${recipientUsername}</strong></p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      Your kindness will surely bring a smile to ${recipientUsername}'s face! 😊
    </p>
    
    <p style="font-size: 16px; margin-bottom: 0;">
      Thank you for being part of the HeySpender community and making celebrations special!
    </p>
  </div>
  
  <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 30px;">
    <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
      Keep spreading joy! Check out more wishlists and help make someone else's day.
    </p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/explore" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        Explore More Wishlists
      </a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      With gratitude,<br>
      <strong>The HeySpender Team</strong>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateThankYouEmailText({ spenderUsername, itemName, amountPaid, recipientUsername }) {
    return `
Thank You for Your Generous Contribution!

Hi ${spenderUsername},

We wanted to take a moment to say thank you for your generous contribution!

You contributed: ₦${Number(amountPaid).toLocaleString()}
towards: ${itemName}
for: @${recipientUsername}

Your kindness will surely bring a smile to ${recipientUsername}'s face!

Thank you for being part of the HeySpender community and making celebrations special!

Keep spreading joy! Check out more wishlists: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/explore

With gratitude,
The HeySpender Team
    `.trim();
  }

  static generateWithdrawalNotificationHTML({ payoutData }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Withdrawal Request - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">💰 New Withdrawal Request</h1>
    <p style="color: #666; font-size: 16px;">Action Required</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hello Admin,</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      A new withdrawal request has been submitted and requires your review.
    </p>
    
    <div style="background-color: white; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Withdrawal Details:</p>
      <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #161B47;">₦${Number(payoutData.amount).toLocaleString()}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">User: ${payoutData.wallet?.user?.email || 'Unknown'}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Bank Code: ${payoutData.destination_bank_code || 'N/A'}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Account: ${payoutData.destination_account || 'N/A'}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Request ID: ${payoutData.id}</p>
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/admin" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        Review Request
      </a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      HeySpender Admin Dashboard
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateWithdrawalNotificationText({ payoutData }) {
    return `
New Withdrawal Request - HeySpender

Hello Admin,

A new withdrawal request has been submitted and requires your review.

Withdrawal Details:
Amount: ₦${Number(payoutData.amount).toLocaleString()}
User: ${payoutData.wallet?.user?.email || 'Unknown'}
Bank Code: ${payoutData.destination_bank_code || 'N/A'}
Account: ${payoutData.destination_account || 'N/A'}
Request ID: ${payoutData.id}

Review Request: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/admin

HeySpender Admin Dashboard
    `.trim();
  }

  static generateWithdrawalStatusUpdateHTML({ payoutData, oldStatus, newStatus, message }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Withdrawal Status Update - HeySpender</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #161B47; margin-bottom: 10px;">💰 Withdrawal Status Update</h1>
    <p style="color: #666; font-size: 16px;">Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <p style="font-size: 16px; margin-bottom: 15px;">Hello,</p>
    
    <p style="font-size: 16px; margin-bottom: 15px;">
      ${message}
    </p>
    
    <div style="background-color: white; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">Withdrawal Details:</p>
      <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #161B47;">₦${Number(payoutData.amount).toLocaleString()}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Status: ${oldStatus} → ${newStatus}</p>
      <p style="margin: 5px 0; font-size: 14px; color: #666;">Request ID: ${payoutData.id}</p>
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/wishlist" 
         style="display: inline-block; background-color: #FF6B35; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
        View Dashboard
      </a>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #999; margin: 5px 0;">
      Need help? <a href="mailto:support@heyspender.com" style="color: #FF6B35;">Contact Support</a>
    </p>
  </div>
</body>
</html>
    `.trim();
  }

  static generateWithdrawalStatusUpdateText({ payoutData, oldStatus, newStatus, message }) {
    return `
Withdrawal Status Update - HeySpender

Hello,

${message}

Withdrawal Details:
Amount: ₦${Number(payoutData.amount).toLocaleString()}
Status: ${oldStatus} → ${newStatus}
Request ID: ${payoutData.id}

View Dashboard: ${typeof window !== 'undefined' ? window.location.origin : 'https://heyspender.com'}/dashboard/wishlist

Need help? Contact Support: support@heyspender.com

The HeySpender Team
    `.trim();
  }
}

// Export helper functions for backward compatibility
export const sendEmail = EmailService.sendEmail.bind(EmailService);
export const sendWelcomeEmail = EmailService.sendWelcomeEmail.bind(EmailService);
export const sendPasswordResetEmail = EmailService.sendPasswordResetEmail.bind(EmailService);
export const sendThankYouEmail = EmailService.sendThankYouEmail.bind(EmailService);
export const sendWithdrawalNotificationToAdmins = EmailService.sendWithdrawalNotificationToAdmins.bind(EmailService);
export const sendWithdrawalStatusUpdate = EmailService.sendWithdrawalStatusUpdate.bind(EmailService);
