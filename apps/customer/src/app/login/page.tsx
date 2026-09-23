'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/auth/LoginView';
import AuthDesktopLayout from '@/components/auth/AuthDesktopLayout';

export default function LoginPage() {
  const router = useRouter();

  return (
    <AuthDesktopLayout>
      <LoginView
        onLoginSuccess={() => router.push('/home')}
        onForgotPassword={() => router.push('/forgot-password')}
        onCreateAccount={() => router.push('/register')}
      />
    </AuthDesktopLayout>
  );
}

