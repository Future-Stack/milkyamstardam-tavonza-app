import React from 'react';
import CustomerScannerMenu from '@/src/components/CustomerScannerMenu';

export const metadata = {
  title: 'Customer QR Menu & Sofia AI | Tavonza',
  description: 'Interactive table-side QR digital menu, dish customization, and Sofia AI Sommelier.',
};

export default function CustomerPage() {
  return (
    <main className="h-[100dvh] w-screen bg-black text-white flex flex-col overflow-hidden relative font-sans">
      <div className="flex-1 w-full overflow-hidden flex flex-col items-center justify-center">
        <CustomerScannerMenu />
      </div>
    </main>
  );
}
