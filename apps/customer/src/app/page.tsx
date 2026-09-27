'use client';

import React, { Suspense } from 'react';
import RegisterPage from './register/page';
import HomePage from './home/page';

export default function CustomerLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-black flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {/* <HomePage /> */}
      <RegisterPage />
    </Suspense>
  );
}
