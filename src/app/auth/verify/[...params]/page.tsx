"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyCatchAllContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract the token and other parameters from the URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const redirectTo = searchParams.get('redirect_to');

    // Redirect to the correct verification page with the parameters
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (type) params.set('type', type);
    if (redirectTo) params.set('redirectTo', redirectTo);

    const queryString = params.toString();
    const redirectUrl = `/auth/verify${queryString ? `?${queryString}` : ''}`;
    
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to verification page...</p>
      </div>
    </div>
  );
};

export default function VerifyCatchAll() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyCatchAllContent />
    </Suspense>
  );
}
