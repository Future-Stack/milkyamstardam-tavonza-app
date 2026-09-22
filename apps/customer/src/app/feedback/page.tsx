'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FeedbackModal from '@/components/dashboard/FeedbackModal';

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative font-sans">
      <FeedbackModal
        onClose={() => router.push('/home')}
        onGoHome={() => router.push('/home')}
      />
    </div>
  );
}
