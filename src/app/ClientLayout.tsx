'use client'

import { AuthProvider } from '@/contexts/SupabaseAuthContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { ConfettiProvider } from '@/contexts/ConfettiContext'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WalletProvider>
          <ConfettiProvider>
            {children}
            <Toaster />
          </ConfettiProvider>
        </WalletProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
