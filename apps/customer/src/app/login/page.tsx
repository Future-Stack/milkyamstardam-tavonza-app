'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '@/components/auth/LoginView';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md md:max-w-xl">
        <LoginView
          onLoginSuccess={() => router.push('/home')}
          onForgotPassword={() => router.push('/forgot-password')}
          onCreateAccount={() => router.push('/register')}
        />
      </div>
    </div>
  );
}
