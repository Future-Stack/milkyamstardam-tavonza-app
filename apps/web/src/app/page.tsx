'use client';

import React from 'react';
import CustomerScannerMenu from '@/src/components/CustomerScannerMenu';

export default function HomePage() {
  return (
    <main className="h-[100dvh] w-screen bg-black text-white flex flex-col overflow-hidden relative font-sans">
      {/* Main Container - Full screen customer flow without top bar */}
      <div className="flex-1 w-full overflow-hidden flex flex-col items-center justify-center">
        <CustomerScannerMenu />
      </div>
    </main>
  );
}
