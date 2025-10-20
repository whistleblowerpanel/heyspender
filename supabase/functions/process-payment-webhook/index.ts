import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify Paystack signature
    const signature = req.headers.get('x-paystack-signature')
    const payload = await req.text()
    const secret = Deno.env.get('VITE_PAYSTACK_WEBHOOK_SECRET')

    if (!signature || !secret) {
      return new Response('Missing signature or secret', { status: 401 })
    }

    // Verify signature
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const event = JSON.parse(payload)
    console.log('Received Paystack webhook:', event.event)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { data: charge } = event
      const reference = charge.reference
      const amount = charge.amount / 100 // Convert from kobo to naira
      const transactionId = charge.id

      console.log(`Processing successful payment: ${reference}, Amount: ₦${amount}`)

      // Check if this payment has already been processed
      const { data: existingTransaction } = await supabaseClient
        .from('wallet_transactions')
        .select('id')
        .eq('transaction_id', transactionId)
        .single()

      if (existingTransaction) {
        console.log('Payment already processed, skipping')
        return new Response('Payment already processed', { status: 200 })
      }

      // Find the claim by payment reference
      const { data: claim, error: claimError } = await supabaseClient
        .from('claims')
        .select(`
          *,
          wishlist_items!inner(
            *,
            wishlists!inner(
              *,
              users!inner(*)
            )
          )
        `)
        .eq('payment_reference', reference)
        .single()

      if (claimError || !claim) {
        console.error('Claim not found for reference:', reference)
        return new Response('Claim not found', { status: 404 })
      }

      const wishlistOwner = claim.wishlist_items.wishlists.users

      // Execute all database operations in parallel to reduce execution time
      const newAmountPaid = (claim.amount_paid || 0) + amount
      
      const [updateResult, walletResult, transactionResult, notificationResult] = await Promise.allSettled([
        // Update claim amount_paid
        supabaseClient
          .from('claims')
          .update({ amount_paid: newAmountPaid })
          .eq('id', claim.id),
        
        // Credit recipient's wallet
        supabaseClient
          .from('wallets')
          .upsert({
            user_id: wishlistOwner.id,
            balance: amount,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          }),
        
        // Create wallet transaction record
        supabaseClient
          .from('wallet_transactions')
          .insert({
            user_id: wishlistOwner.id,
            claim_id: claim.id,
            amount: amount,
            type: 'credit',
            description: `Payment received for "${claim.wishlist_items.name}"`,
            reference: reference,
            transaction_id: transactionId,
            created_at: new Date().toISOString()
          }),
        
        // Create notification
        supabaseClient
          .from('notifications')
          .insert({
            user_id: wishlistOwner.id,
            type: 'payment_received',
            title: 'Payment Received',
            message: `You received ₦${amount.toLocaleString()} for "${claim.wishlist_items.name}"`,
            data: {
              claim_id: claim.id,
              amount: amount,
              payment_ref: reference,
              transaction_id: transactionId
            }
          })
      ])

      // Log any errors but don't fail the entire operation
      if (updateResult.status === 'rejected' || updateResult.value.error) {
        console.error('Error updating claim:', updateResult.value?.error || updateResult.reason)
      }
      if (walletResult.status === 'rejected' || walletResult.value.error) {
        console.error('Wallet credit error:', walletResult.value?.error || walletResult.reason)
      }
      if (transactionResult.status === 'rejected' || transactionResult.value.error) {
        console.error('Transaction record error:', transactionResult.value?.error || transactionResult.reason)
      }
      if (notificationResult.status === 'rejected' || notificationResult.value.error) {
        console.error('Notification error:', notificationResult.value?.error || notificationResult.reason)
      }

      console.log('Payment processed successfully')
    }

    return new Response('Webhook processed', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
