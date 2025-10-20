import React from 'react';
import { Mail, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailVerificationBanner = ({ onDismiss }) => {
  return (
    <div className="bg-[#E94B29] text-white px-4 py-4 border-b-2 border-black shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-white" />
          <div className="flex-1">
            <p className="text-base font-semibold">
              ⚠️ Please verify your email address
            </p>
            <p className="text-sm opacity-95 mt-1">
              Check your inbox for a verification link. You can still use the app, but some features may be limited until you verify your email.
            </p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-white hover:bg-white/20 flex-shrink-0 ml-4 border border-white/30"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
