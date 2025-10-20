import React, { memo, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { paystackTransferService } from '@/lib/paystackTransferService';

const BankDetailsForm = memo(({ 
  bankDetails, 
  onSave,
  bankDetailsSaving 
}) => {
  // Local state for inputs to prevent cursor loss
  const [localBankDetails, setLocalBankDetails] = useState(bankDetails);
  
  // Verification state
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'verifying', 'verified', 'failed'
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

  // Update local state when props change
  useEffect(() => {
    setLocalBankDetails(bankDetails);
  }, [bankDetails]);

  const handleAccountNameChange = useCallback((e) => {
    const value = e.target.value;
    setLocalBankDetails(prev => ({ ...prev, accountName: value }));
  }, []);

  const handleAccountNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setLocalBankDetails(prev => ({ ...prev, accountNumber: value }));
      // Reset verification when account number changes
      setVerificationStatus(null);
      setVerificationResult(null);
      setVerificationError(null);
    }
  }, []);

  const handleBankNameChange = useCallback((value) => {
    const bankCodes = {
      'access': '044',
      'citibank': '023',
      'diamond': '063',
      'ecobank': '050',
      'fidelity': '070',
      'first': '011',
      'fcmb': '214',
      'gtb': '058',
      'heritage': '030',
      'keystone': '082',
      'kuda': '50211',
      'opay': '100022',
      'palmpay': '999991',
      'polaris': '076',
      'providus': '101',
      'stanbic': '221',
      'standard_chartered': '068',
      'sterling': '232',
      'suntrust': '100',
      'uba': '033',
      'union': '032',
      'unity': '215',
      'vfd': '566',
      'wema': '035',
      'zenith': '057'
    };
    setLocalBankDetails(prev => ({
      ...prev,
      bankName: value,
      bankCode: bankCodes[value] || ''
    }));
    // Reset verification when bank changes
    setVerificationStatus(null);
    setVerificationResult(null);
    setVerificationError(null);
  }, []);

  const handleVerifyAccount = useCallback(async () => {
    if (!localBankDetails.accountNumber || !localBankDetails.bankCode) {
      setVerificationError('Please enter account number and select a bank first');
      return;
    }

    setVerificationStatus('verifying');
    setVerificationError(null);
    setVerificationResult(null);

    try {
      const result = await paystackTransferService.verifyAccount(
        localBankDetails.accountNumber,
        localBankDetails.bankCode
      );

      if (result.success) {
        setVerificationStatus('verified');
        setVerificationResult(result);
        // Auto-update the account name if verification is successful
        setLocalBankDetails(prev => ({
          ...prev,
          accountName: result.account_name
        }));
      } else {
        setVerificationStatus('failed');
        setVerificationError(result.error || 'Account verification failed');
      }
    } catch (error) {
      setVerificationStatus('failed');
      setVerificationError('Failed to verify account. Please try again.');
      console.error('Verification error:', error);
    }
  }, [localBankDetails.accountNumber, localBankDetails.bankCode]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    // Pass the local state to the parent's save handler
    onSave(e, localBankDetails);
  }, [onSave, localBankDetails]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account-name">Account Name</Label>
        <Input
          id="account-name"
          placeholder="Full name on account"
          value={localBankDetails.accountName}
          onChange={handleAccountNameChange}
          className="rounded-none"
          disabled={bankDetailsSaving}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="account-number">Account Number</Label>
        <Input
          id="account-number"
          placeholder="10-digit account number"
          value={localBankDetails.accountNumber}
          onChange={handleAccountNumberChange}
          maxLength={10}
          className="rounded-none"
          disabled={bankDetailsSaving}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bank-name">Bank Name</Label>
        <Select 
          value={localBankDetails.bankName} 
          onValueChange={handleBankNameChange}
          disabled={bankDetailsSaving}
        >
          <SelectTrigger id="bank-name" className="rounded-none">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="access">Access Bank</SelectItem>
            <SelectItem value="citibank">Citibank Nigeria</SelectItem>
            <SelectItem value="diamond">Diamond Bank</SelectItem>
            <SelectItem value="ecobank">Ecobank Nigeria</SelectItem>
            <SelectItem value="fidelity">Fidelity Bank</SelectItem>
            <SelectItem value="first">First Bank of Nigeria</SelectItem>
            <SelectItem value="fcmb">First City Monument Bank (FCMB)</SelectItem>
            <SelectItem value="gtb">Guaranty Trust Bank (GTBank)</SelectItem>
            <SelectItem value="heritage">Heritage Bank</SelectItem>
            <SelectItem value="keystone">Keystone Bank</SelectItem>
            <SelectItem value="kuda">Kuda Bank</SelectItem>
            <SelectItem value="opay">OPay</SelectItem>
            <SelectItem value="palmpay">PalmPay</SelectItem>
            <SelectItem value="polaris">Polaris Bank</SelectItem>
            <SelectItem value="providus">Providus Bank</SelectItem>
            <SelectItem value="stanbic">Stanbic IBTC Bank</SelectItem>
            <SelectItem value="standard_chartered">Standard Chartered Bank</SelectItem>
            <SelectItem value="sterling">Sterling Bank</SelectItem>
            <SelectItem value="suntrust">Suntrust Bank</SelectItem>
            <SelectItem value="uba">United Bank for Africa (UBA)</SelectItem>
            <SelectItem value="union">Union Bank of Nigeria</SelectItem>
            <SelectItem value="unity">Unity Bank</SelectItem>
            <SelectItem value="vfd">VFD Microfinance Bank</SelectItem>
            <SelectItem value="wema">Wema Bank</SelectItem>
            <SelectItem value="zenith">Zenith Bank</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">For payout withdrawals</p>
      </div>

      {/* Account Verification Section */}
      {localBankDetails.accountNumber && localBankDetails.bankCode && (
        <div className="space-y-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-medium">Account Verification</Label>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerifyAccount}
              disabled={verificationStatus === 'verifying' || bankDetailsSaving}
              className="flex items-center gap-2"
            >
              {verificationStatus === 'verifying' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Verify Account
                </>
              )}
            </Button>

            {verificationStatus === 'verified' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}

            {verificationStatus === 'failed' && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verification Failed</span>
              </div>
            )}
          </div>

          {verificationResult && (
            <div className="text-sm text-gray-600">
              <p><strong>Account Name:</strong> {verificationResult.account_name}</p>
              <p><strong>Account Number:</strong> {verificationResult.account_number}</p>
            </div>
          )}

          {verificationError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {verificationError}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end pt-2">
        <Button 
          type="submit"
          variant="custom"
          className="bg-brand-salmon text-black"
          disabled={bankDetailsSaving}
        >
          {bankDetailsSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Bank Details
            </>
          )}
        </Button>
      </div>
    </form>
  );
});

BankDetailsForm.displayName = 'BankDetailsForm';

export default BankDetailsForm;