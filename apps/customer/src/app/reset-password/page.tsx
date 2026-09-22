'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ResetPasswordView from '@/components/auth/ResetPasswordView';

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md md:max-w-xl">
        <ResetPasswordView
          onComplete={() => router.push('/home')}
          onBack={() => router.push('/verify-otp')}
        />
      </div>
    </div>
  );
}
