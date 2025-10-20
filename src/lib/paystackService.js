// src/lib/paystackService.js
export const initializePaystackPayment = async (paymentData) => {
  return new Promise((resolve) => {
    console.log('Initializing Paystack payment with data:', paymentData);
    
    // Check if Paystack public key is available
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Paystack public key not found in environment variables');
      resolve({ error: { message: 'Paystack configuration missing. Please check your environment variables.' } });
      return;
    }

    console.log('Paystack public key found:', publicKey.substring(0, 20) + '...');

    // Load Paystack script
    const loadPaystackScript = () => {
      return new Promise((scriptResolve, scriptReject) => {
        if (window.PaystackPop) {
          console.log('Paystack script already loaded');
          scriptResolve();
          return;
        }

        console.log('Loading Paystack script...');
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          scriptReject(new Error('Paystack script loading timeout'));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeout);
          console.log('Paystack script loaded successfully');
          scriptResolve();
        };
        
        script.onerror = (error) => {
          clearTimeout(timeout);
          console.error('Failed to load Paystack script:', error);
          scriptReject(new Error('Failed to load Paystack script'));
        };
        
        document.head.appendChild(script);
      });
    };

    // Load script and initialize payment
    loadPaystackScript()
      .then(() => {
        initPayment();
      })
      .catch((error) => {
        console.error('Script loading failed:', error);
        console.log('Falling back to hosted payment page...');
        useHostedPaymentPage(paymentData);
        resolve({ error: { message: 'Using hosted payment page due to script loading error' } });
      });

    function initPayment() {
      try {
        console.log('Setting up Paystack payment...');
        
        // Add a small delay to ensure script is fully loaded
        setTimeout(() => {
          try {
            const handler = window.PaystackPop.setup({
              key: publicKey,
              email: paymentData.email,
              amount: paymentData.amount,
              currency: paymentData.currency,
              ref: paymentData.reference,
              metadata: paymentData.metadata,
              callback: (response) => {
                console.log('Paystack callback received:', response);
                paymentData.callback(response);
              },
              onClose: () => {
                console.log('Paystack modal closed');
                paymentData.onClose();
              }
            });

            console.log('Opening Paystack iframe...');
            handler.openIframe();
            resolve({ success: true });
          } catch (error) {
            console.error('Error in Paystack setup:', error);
            console.log('Falling back to hosted payment page...');
            useHostedPaymentPage(paymentData);
            resolve({ error: { message: 'Using hosted payment page due to inline setup error' } });
          }
        }, 500);
        
      } catch (error) {
        console.error('Error setting up Paystack payment:', error);
        console.log('Falling back to hosted payment page...');
        useHostedPaymentPage(paymentData);
        resolve({ error: { message: 'Using hosted payment page due to setup error' } });
      }
    }
  });
};

// Fallback to hosted payment page
const useHostedPaymentPage = (paymentData) => {
  try {
    console.log('Using hosted payment page...');
    
    // Store payment data for callback processing
    localStorage.setItem('pending_payment_ref', paymentData.reference);
    localStorage.setItem('pending_payment_amount', (paymentData.amount / 100).toString());
    localStorage.setItem('pending_payment_claim_id', paymentData.metadata.claim_id);
    
    // Redirect to Paystack hosted page
    const hostedUrl = `https://checkout.paystack.com/${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}?email=${encodeURIComponent(paymentData.email)}&amount=${paymentData.amount}&currency=${paymentData.currency}&reference=${paymentData.reference}&callback_url=${encodeURIComponent(window.location.origin + '/payment-callback')}`;
    
    window.location.href = hostedUrl;
    
  } catch (error) {
    console.error('Hosted payment page failed:', error);
    throw error;
  }
};

// Verify payment with Paystack API
export const verifyPayment = async (reference) => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
