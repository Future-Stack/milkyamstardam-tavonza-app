'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateAccountView from '@/components/auth/CreateAccountView';
import AuthDesktopLayout from '@/components/auth/AuthDesktopLayout';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const table = searchParams.get('table');

  const forwardParam = table ? `?table=${encodeURIComponent(table)}` : '';

  return (
    <AuthDesktopLayout>
      <CreateAccountView
        onAccountCreated={() => router.push(`/verify-otp${forwardParam}`)}
        onGoBackToLogin={() => router.push('/login')}
      /> 
    </AuthDesktopLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
