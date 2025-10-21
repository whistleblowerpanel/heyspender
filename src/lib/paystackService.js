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

    // CRITICAL: Environment detection for CORS workaround
    const isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname === '0.0.0.0');

    console.log('Environment detection:', { 
      hostname: window.location.hostname, 
      isDevelopment 
    });

    // For development/localhost, use hosted payment page due to CORS issues
    if (isDevelopment) {
      console.log('Development environment detected, using hosted payment page...');
      useHostedPaymentPage(paymentData);
      resolve({ error: { message: 'Using hosted payment page for development' } });
      return;
    }

    // Production: Load Paystack script
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

// Fallback to hosted payment page (works around CORS issues)
const useHostedPaymentPage = (paymentData) => {
  try {
    console.log('Using hosted payment page...');
    
    // Check if we're in development environment
    const isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname === '0.0.0.0');
    
    if (isDevelopment) {
      // Show payment instructions for development
      showPaymentInstructions(paymentData);
    } else {
      // Production: Redirect to Paystack hosted page
      const hostedUrl = `https://checkout.paystack.com/${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}?email=${encodeURIComponent(paymentData.email)}&amount=${paymentData.amount}&currency=${paymentData.currency}&reference=${paymentData.reference}&callback_url=${encodeURIComponent(window.location.origin + '/payment-callback')}`;
      
      // Store payment data for callback processing
      localStorage.setItem('pending_payment_ref', paymentData.reference);
      localStorage.setItem('pending_payment_amount', (paymentData.amount / 100).toString());
      localStorage.setItem('pending_payment_claim_id', paymentData.metadata.claim_id);
      
      window.location.href = hostedUrl;
    }
    
  } catch (error) {
    console.error('Hosted payment page failed:', error);
    throw error;
  }
};

// Show payment instructions for development
const showPaymentInstructions = (paymentData) => {
  const amount = (paymentData.amount / 100).toLocaleString();
  const reference = paymentData.reference;
  const email = paymentData.email;
  const itemName = paymentData.metadata?.item_name || 
                   paymentData.metadata?.goal_title || 
                   paymentData.metadata?.wishlist_item_name ||
                   'Unknown item';
  
  // Show detailed payment instructions
  console.log('=== PAYMENT INSTRUCTIONS ===');
  console.log(`Item: ${itemName}`);
  console.log(`Amount: ₦${amount}`);
  console.log(`Reference: ${reference}`);
  console.log(`Email: ${email}`);
  console.log('============================');
  
  // Show a modal with payment details
  showPaymentModal(paymentData);
};

// Show payment modal with instructions
const showPaymentModal = (paymentData) => {
  const amount = (paymentData.amount / 100).toLocaleString();
  const reference = paymentData.reference;
  const email = paymentData.email;
  const itemName = paymentData.metadata?.item_name || 
                   paymentData.metadata?.goal_title || 
                   paymentData.metadata?.wishlist_item_name ||
                   'Unknown item';
  
  // Create a modal with payment instructions
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Payment Instructions</h3>
      <div class="space-y-2 text-sm">
        <p><strong>Item:</strong> ${itemName}</p>
        <p><strong>Amount:</strong> ₦${amount}</p>
        <p><strong>Reference:</strong> ${reference}</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
      <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-yellow-800">
          <strong>Note:</strong> This is a development environment. In production, you would be redirected to Paystack's secure payment page.
        </p>
      </div>
      <div class="mt-4 flex justify-end space-x-2">
        <button id="cancel-payment" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button id="simulate-payment" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Simulate Payment
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('#cancel-payment').addEventListener('click', () => {
    document.body.removeChild(modal);
    if (paymentData.onClose) {
      paymentData.onClose();
    }
  });
  
  modal.querySelector('#simulate-payment').addEventListener('click', () => {
    document.body.removeChild(modal);
    simulatePayment(paymentData);
  });
};

// Simulate successful payment for development
const simulatePayment = (paymentData) => {
  console.log('Simulating successful payment...');
  
  // Create mock successful response
  const mockResponse = {
    status: 'success',
    reference: paymentData.reference,
    trans: 'mock_transaction_id_' + Date.now(),
    message: 'Payment simulated successfully'
  };
  
  // Call the callback with mock response
  if (paymentData.callback) {
    paymentData.callback(mockResponse);
  }
  
  console.log('Payment simulation completed:', mockResponse);
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
