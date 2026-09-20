import React from 'react';
import CustomerScannerMenu from '@/src/components/CustomerScannerMenu';
import Link from 'next/link';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Customer QR Menu & Sofia AI | Tavonza',
  description: 'Interactive table-side QR digital menu, dish customization, and Sofia AI Sommelier.',
};

export default function CustomerPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Portals</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-zinc-300">Table #04 • Live Session</span>
        </div>

        <Link
          href="/owner-dashboard"
          className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Owner OS</span>
        </Link>
      </div>

      {/* Customer Mobile Menu Flow Container */}
      <div className="max-w-md mx-auto min-h-[calc(100vh-53px)] pb-12">
        <CustomerScannerMenu />
      </div>
    </main>
  );
}
