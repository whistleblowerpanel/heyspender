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
                   paymentData.metadata?.wishlist_item_name ||
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
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSimulate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Simulate Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsModal;
