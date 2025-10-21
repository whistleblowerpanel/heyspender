# 🚀 COMPREHENSIVE PAYSTACK PAYMENT GATEWAY IMPLEMENTATION PROMPT

## **Context & Objective**
I need you to implement a complete Paystack payment gateway integration for my Next.js HeySpender application. The current setup has basic Paystack integration but is missing the **critical local development CORS workaround** that we successfully implemented in the React version. 

## **Current State Analysis**
- ✅ Basic Paystack service exists (`src/lib/paystackService.js`)
- ✅ Webhook function exists (`supabase/functions/process-payment-webhook/index.ts`)
- ✅ Environment variables configured for Next.js
- ❌ **MISSING**: Local development CORS workaround
- ❌ **MISSING**: Development environment detection
- ❌ **MISSING**: Payment simulation for localhost
- ❌ **MISSING**: Comprehensive error handling

## **CRITICAL REQUIREMENT: Local Development CORS Solution**

The most important missing piece is the **local development CORS workaround** that we had in the React version. This is essential because:

1. **CORS Issues**: Paystack script loading fails on localhost due to CORS restrictions
2. **Development Testing**: We need to test payment flows locally before production
3. **Fallback System**: Must gracefully handle script loading failures

## **Implementation Requirements**

### **1. Enhanced Paystack Service (`src/lib/paystackService.js`)**

**CRITICAL**: Add environment detection and CORS workaround:

```javascript
// Add this logic to detect development environment
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname === '0.0.0.0');

// For development/localhost, use hosted payment page due to CORS issues
if (isDevelopment) {
  console.log('Development environment detected, using hosted payment page...');
  useHostedPaymentPage(paymentData);
  return;
}
```

**Add these functions**:
- `useHostedPaymentPage()` - Redirects to Paystack hosted page
- `showPaymentInstructions()` - Shows payment details modal for development
- `simulatePayment()` - Simulates successful payment for testing

### **2. Development Payment Modal**

Create a modal that shows:
- Payment amount (converted from kobo to Naira)
- Payment reference
- User email
- Item/goal details
- **"Simulate Payment" button** for testing
- **"Cancel" button**

### **3. Environment Variables Setup**

Ensure these are properly configured:
```env
# Development (Test Keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key_here
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# Production (Live Keys) - Set in deployment platform
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key_here
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_your_live_key_here
```

### **4. Payment Components Integration**

Update these components to use the enhanced Paystack service:
- `ContributeModal.jsx` - For wishlist contributions
- `SpenderListCard.jsx` - For cash contributions
- Any other payment-related components

### **5. Error Handling & Fallbacks**

Implement comprehensive error handling:
- Script loading failures → Fallback to hosted page
- Network errors → Show user-friendly messages
- Invalid configurations → Clear error messages
- Payment simulation → Mock successful responses

### **6. Testing & Debugging**

Add extensive logging:
- Environment detection logs
- Payment initialization logs
- Script loading status
- Fallback activation logs
- Payment simulation logs

## **Specific Implementation Steps**

### **Step 1: Update Paystack Service**
1. Add environment detection logic
2. Implement `useHostedPaymentPage()` function
3. Add `showPaymentInstructions()` for development
4. Add `simulatePayment()` for testing
5. Enhance error handling and logging

### **Step 2: Create Payment Modal Component**
1. Create reusable payment instructions modal
2. Include payment details display
3. Add simulation and cancel buttons
4. Style with Tailwind CSS to match design system

### **Step 3: Update Payment Components**
1. Integrate enhanced Paystack service
2. Add proper error handling
3. Update UI feedback for users
4. Test payment flows

### **Step 4: Environment Configuration**
1. Set up test keys for development
2. Configure production keys for deployment
3. Ensure webhook secrets are properly set
4. Test environment variable loading

### **Step 5: Testing & Validation**
1. Test local development flow
2. Verify payment simulation works
3. Test hosted page fallback
4. Validate production deployment

## **Expected Behavior**

### **Local Development (localhost)**
1. Detect development environment
2. Show payment instructions modal
3. Allow payment simulation for testing
4. Log all payment details to console
5. Fallback to hosted page if needed

### **Production**
1. Load Paystack script normally
2. Use inline payment popup
3. Handle real payments
4. Process webhooks correctly
5. Fallback to hosted page if script fails

## **Key Success Criteria**

✅ **Local Development**: Payment simulation works on localhost  
✅ **CORS Handling**: Graceful fallback when script loading fails  
✅ **Environment Detection**: Automatic detection of dev vs production  
✅ **Error Handling**: Comprehensive error messages and fallbacks  
✅ **Testing**: Easy payment flow testing without real transactions  
✅ **Production Ready**: Seamless transition to live payments  

## **Files to Modify/Create**

1. **Update**: `src/lib/paystackService.js` - Add CORS workaround
2. **Create**: `src/components/PaymentInstructionsModal.jsx` - Development modal
3. **Update**: `src/components/ContributeModal.jsx` - Integrate enhanced service
4. **Update**: Any other payment components
5. **Update**: Environment configuration files

## **Critical Notes**

- **DO NOT** break existing production functionality
- **DO** maintain backward compatibility
- **DO** add extensive logging for debugging
- **DO** test both development and production flows
- **DO** ensure graceful fallbacks in all scenarios

This implementation should replicate the successful local development experience we had in the React version while maintaining full production functionality. The key is the environment detection and CORS workaround that allows seamless local testing before production deployment.

---

## **Detailed Implementation Guide**

### **Enhanced Paystack Service Implementation**

Here's the complete enhanced `paystackService.js` that includes the CORS workaround:

```javascript
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
    
    // Show payment instructions for development
    showPaymentInstructions(paymentData);
    
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
  const itemName = paymentData.metadata?.item_name || paymentData.metadata?.goal_title || 'Unknown item';
  
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
  const itemName = paymentData.metadata?.item_name || paymentData.metadata?.goal_title || 'Unknown item';
  
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
```

### **Payment Instructions Modal Component**

Create a reusable React component for the payment modal:

```jsx
// src/components/PaymentInstructionsModal.jsx
import React from 'react';

const PaymentInstructionsModal = ({ 
  isOpen, 
  onClose, 
  onSimulate, 
  paymentData 
}) => {
  if (!isOpen || !paymentData) return null;

  const amount = (paymentData.amount / 100).toLocaleString();
  const reference = paymentData.reference;
  const email = paymentData.email;
  const itemName = paymentData.metadata?.item_name || 
                   paymentData.metadata?.goal_title || 
                   'Unknown item';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Payment Instructions</h3>
        
        <div className="space-y-2 text-sm mb-4">
          <p><strong>Item:</strong> {itemName}</p>
          <p><strong>Amount:</strong> ₦{amount}</p>
          <p><strong>Reference:</strong> {reference}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
        
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a development environment. 
            In production, you would be redirected to Paystack's secure payment page.
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
            onClick={onSimulate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simulate Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsModal;
```

### **Environment Configuration**

Create a `.env.local` file for development:

```env
# Development Environment Variables
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_key_here
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_test_your_actual_test_key_here
NEXT_PUBLIC_PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_string

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Integration Example**

Here's how to integrate the enhanced service in your components:

```jsx
// Example integration in ContributeModal.jsx
import { initializePaystackPayment } from '@/lib/paystackService';

const handlePayment = async () => {
  const paymentData = {
    email: user.email,
    amount: amountInKobo,
    currency: 'NGN',
    reference: paymentRef,
    metadata: {
      claim_id: claim.id,
      item_name: item.name,
      supporter_id: user.id,
      recipient_id: wishlistOwner.id
    },
    callback: (response) => {
      console.log('Payment successful:', response);
      // Handle successful payment
    },
    onClose: () => {
      console.log('Payment cancelled');
      // Handle payment cancellation
    }
  };

  const result = await initializePaystackPayment(paymentData);
  
  if (result.error) {
    console.log('Payment initialization result:', result.error.message);
    // The service will handle showing the modal or redirecting
  }
};
```

## **Testing Checklist**

### **Local Development Testing**
- [ ] Environment detection works correctly
- [ ] Payment modal shows with correct details
- [ ] Payment simulation works
- [ ] Console logging is comprehensive
- [ ] Fallback to hosted page works

### **Production Testing**
- [ ] Paystack script loads correctly
- [ ] Inline payment popup works
- [ ] Real payments process successfully
- [ ] Webhooks are received and processed
- [ ] Fallback to hosted page works if needed

### **Error Handling Testing**
- [ ] Missing environment variables show clear errors
- [ ] Script loading failures trigger fallbacks
- [ ] Network errors are handled gracefully
- [ ] Invalid payment data shows appropriate messages

---

**Please implement this step by step, starting with the enhanced Paystack service, then the payment modal, and finally integrating everything together. Test each step thoroughly before moving to the next.**
