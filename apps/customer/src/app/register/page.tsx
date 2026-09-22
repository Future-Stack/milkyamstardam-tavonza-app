'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateAccountView from '@/components/auth/CreateAccountView';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md md:max-w-xl">
        <CreateAccountView
          onAccountCreated={() => router.push('/home')}
          onGoBackToLogin={() => router.push('/login')}
        />
      </div>
    </div>
  );
}
