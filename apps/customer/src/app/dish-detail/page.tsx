'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DishDetailModal from '@/components/dashboard/DishDetailModal';

export default function DishDetailPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative font-sans">
      <DishDetailModal
        onClose={() => router.push('/home')}
        onAddToCart={() => router.push('/cart')}
        onAskAI={() => router.push('/jarvis')}
      />
    </div>
  );
}
