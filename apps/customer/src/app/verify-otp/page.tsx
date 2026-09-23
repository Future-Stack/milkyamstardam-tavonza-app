'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OtpVerificationView from '@/components/auth/OtpVerificationView';
import AuthDesktopLayout from '@/components/auth/AuthDesktopLayout';

export default function VerifyOtpPage() {
  const router = useRouter();

  return (
    <AuthDesktopLayout>
      <OtpVerificationView
        onVerifySuccess={() => router.push('/reset-password')}
        onBack={() => router.push('/forgot-password')}
      />
    </AuthDesktopLayout>
  );
}

