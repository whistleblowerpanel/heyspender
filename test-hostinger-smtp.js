// Test script to verify Hostinger SMTP email sending
// This script tests the email service with your actual Hostinger SMTP configuration

const testEmailSending = async () => {
  console.log('🧪 Testing Hostinger SMTP email sending...');
  
  try {
    // Test data matching your configuration
    const testEmailData = {
      to: 'expresscreo@gmail.com',
      subject: 'Test Email from HeySpender Admin Panel - Hostinger SMTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email - HeySpender</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #161B47;">📧 Test Email - Hostinger SMTP</h1>
            <p>This is a test email from HeySpender Admin Panel using Hostinger SMTP</p>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #161B47;">Configuration Details:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>SMTP Host:</strong> smtp.hostinger.com</li>
              <li><strong>SMTP Port:</strong> 587 (TLS)</li>
              <li><strong>Sender Email:</strong> noreply@heyspender.com</li>
              <li><strong>Security:</strong> TLS</li>
              <li><strong>Provider:</strong> Hostinger SMTP</li>
            </ul>
          </div>

          <div style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #161B47;">Test Data:</h3>
            <p><strong>Recipient:</strong> expresscreo@gmail.com</p>
            <p><strong>Template:</strong> Claim Payment Reminder - 2 Days</p>
            <p><strong>Item:</strong> Get Together Party</p>
            <p><strong>Wishlist Owner:</strong> Ogundipe Birthday</p>
            <p><strong>Days Left:</strong> 2</p>
          </div>

          <div style="background-color: #d4edda; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #155724;">✅ Success Indicators:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Email sent via Hostinger SMTP</li>
              <li>Professional HTML formatting</li>
              <li>Template variables replaced</li>
              <li>Proper sender information</li>
              <li>Email delivered to inbox</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This is a test email sent from the HeySpender Admin Panel using Hostinger SMTP.<br>
              If you received this email, the notification system is working correctly!<br>
              <strong>Sent at:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
TEST EMAIL - HeySpender Admin Panel (Hostinger SMTP)

This is a test email from HeySpender Admin Panel using Hostinger SMTP.

Configuration Details:
- SMTP Host: smtp.hostinger.com
- SMTP Port: 587 (TLS)
- Sender Email: noreply@heyspender.com
- Security: TLS
- Provider: Hostinger SMTP

Test Data:
- Recipient: expresscreo@gmail.com
- Template: Claim Payment Reminder - 2 Days
- Item: Get Together Party
- Wishlist Owner: Ogundipe Birthday
- Days Left: 2

Success Indicators:
✅ Email sent via Hostinger SMTP
✅ Professional HTML formatting
✅ Template variables replaced
✅ Proper sender information
✅ Email delivered to inbox

This is a test email sent from the HeySpender Admin Panel using Hostinger SMTP.
If you received this email, the notification system is working correctly!

Sent at: ${new Date().toLocaleString()}
      `,
      templateKey: 'hostinger_test_notification',
      metadata: {
        testEmail: true,
        source: 'admin_panel_test',
        smtpProvider: 'hostinger',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📧 Sending test email via Hostinger SMTP...');
    console.log('📋 Email details:', {
      to: testEmailData.to,
      subject: testEmailData.subject,
      smtpHost: 'smtp.hostinger.com',
      smtpPort: '587',
      senderEmail: 'noreply@heyspender.com'
    });

    // Call the Edge Function directly
    const response = await fetch('https://hgvdslcpndmimatvliyu.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmRzbGNwbmRtaW1hdHZsaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzA2NjksImV4cCI6MjA3NTAwNjY2OX0.1d-UszrAW-_rUemrmBEbHRoa1r8zOrbo-wtKaXMPW9k',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmailData)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Email sent successfully via Hostinger SMTP!');
      console.log('📋 Result:', result);
      console.log('📧 Check expresscreo@gmail.com inbox for the test email');
      console.log('🎯 Provider:', result.provider);
      console.log('🆔 Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send email');
      console.log('📋 Error:', result);
      console.log('🔍 Status:', response.status);
    }

  } catch (error) {
    console.error('❌ Error testing email:', error);
  }
};

// Run the test
testEmailSending();
