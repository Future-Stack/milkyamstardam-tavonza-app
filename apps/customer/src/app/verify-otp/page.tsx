'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OtpVerificationView from '@/components/auth/OtpVerificationView';

export default function VerifyOtpPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md md:max-w-xl">
        <OtpVerificationView
          onVerifySuccess={() => router.push('/reset-password')}
          onBack={() => router.push('/forgot-password')}
        />
      </div>
    </div>
  );
}
