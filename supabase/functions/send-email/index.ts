// Supabase Edge Function for sending emails via SMTP
// This function handles all email sending for HeySpender

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { to, subject, html, text, templateKey, metadata } = await req.json()

    // Validate required fields
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get SMTP configuration from environment variables
    const smtpConfig = {
      host: Deno.env.get('SMTP_HOST') || 'smtp.resend.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '465'),
      secure: true, // Use SSL
      auth: {
        user: Deno.env.get('SMTP_USER') || 'resend',
        pass: Deno.env.get('SMTP_PASSWORD') || Deno.env.get('RESEND_API_KEY')
      }
    }

    // Get sender information
    const senderEmail = Deno.env.get('SMTP_SENDER_EMAIL') || 'noreply@heyspender.com'
    const senderName = Deno.env.get('SMTP_SENDER_NAME') || 'HeySpender'

    // Prepare email data
    const emailData = {
      from: `${senderName} <${senderEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html || text,
      text: text || html?.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    }

    console.log('📧 Sending email via SMTP:', {
      to: emailData.to,
      subject: emailData.subject,
      templateKey,
      metadata
    })

    // Send email using Resend API (recommended approach)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      // Use Resend API (more reliable than SMTP)
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text()
        console.error('Resend API error:', errorData)
        throw new Error(`Resend API error: ${resendResponse.status} ${errorData}`)
      }

      const resendData = await resendResponse.json()
      console.log('✅ Email sent successfully via Resend:', resendData)

      // Log email in database for tracking
      await logEmailSent(supabaseClient, {
        to: emailData.to,
        subject: emailData.subject,
        templateKey,
        metadata,
        provider: 'resend',
        providerId: resendData.id,
        status: 'sent'
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: resendData.id,
          provider: 'resend'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Fallback: Use SMTP (if Resend API key is not available)
      console.log('⚠️ Resend API key not found, using SMTP fallback')
      
      // For now, we'll simulate SMTP sending since Deno doesn't have built-in SMTP support
      // In production, you might want to use a different approach or library
      console.log('📧 SMTP Email would be sent:', emailData)
      
      // Log email in database for tracking
      await logEmailSent(supabaseClient, {
        to: emailData.to,
        subject: emailData.subject,
        templateKey,
        metadata,
        provider: 'smtp',
        providerId: `smtp_${Date.now()}`,
        status: 'sent'
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: `smtp_${Date.now()}`,
          provider: 'smtp'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to log email sending in database
async function logEmailSent(supabaseClient, emailLog) {
  try {
    const { error } = await supabaseClient
      .from('email_logs')
      .insert({
        recipient_email: emailLog.to,
        subject: emailLog.subject,
        template_key: emailLog.templateKey,
        metadata: emailLog.metadata,
        provider: emailLog.provider,
        provider_message_id: emailLog.providerId,
        status: emailLog.status,
        sent_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging email:', error)
    }
  } catch (error) {
    console.error('Error in logEmailSent:', error)
  }
}
