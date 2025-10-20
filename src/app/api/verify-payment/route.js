import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({
        success: false,
        message: 'Payment reference is required'
      }, { status: 400 });
    }

    // Verify payment with Paystack with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json({
        success: false,
        message: paystackData.message || 'Payment verification failed'
      }, { status: 400 });
    }

    const { data: transaction } = paystackData;

    // Check if payment was successful
    if (transaction.status !== 'success') {
      return NextResponse.json({
        success: false,
        message: 'Payment was not successful'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        gateway_response: transaction.gateway_response,
        paid_at: transaction.paid_at,
        created_at: transaction.created_at,
        metadata: transaction.metadata,
        customer: transaction.customer
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Handle timeout errors specifically
    if (error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        message: 'Payment verification timed out. Please try again.'
      }, { status: 408 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'An error occurred while verifying payment'
    }, { status: 500 });
  }
}
