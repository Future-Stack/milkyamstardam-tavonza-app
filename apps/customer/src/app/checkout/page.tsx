'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CartFlowModal from '@/components/dashboard/CartFlowModal';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative font-sans">
      <CartFlowModal
        initialStep="payment"
        onClose={() => router.push('/home')}
        onGoHome={() => router.push('/home')}
      />
    </div>
  );
}
