'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordView from '@/components/auth/ForgotPasswordView';

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md md:max-w-xl">
        <ForgotPasswordView
          onRequestCode={() => router.push('/verify-otp')}
          onBackToLogin={() => router.push('/login')}
        />
      </div>
    </div>
  );
}
