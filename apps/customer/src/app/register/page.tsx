'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateAccountView from '@/components/auth/CreateAccountView';
import AuthDesktopLayout from '@/components/auth/AuthDesktopLayout';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthDesktopLayout>
      <CreateAccountView
        onAccountCreated={() => router.push('/home')}
        onGoBackToLogin={() => router.push('/login')}
      />
    </AuthDesktopLayout>
  );
}

