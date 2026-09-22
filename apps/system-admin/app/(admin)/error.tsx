"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * Catches render-time failures from the data layer — most often the API being
 * unreachable or a token that expired mid-session.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Super admin console error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="bg-white/[0.02] p-8 rounded-3xl border border-red-500/20 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-red-500 opacity-10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        <h1 className="text-xl font-bold text-white mb-2 tracking-tight">
          Could not load this page
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">{error.message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            Try again
          </button>
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 px-6 py-3 rounded-xl font-semibold text-sm transition-colors border border-white/5"
          >
            Sign in again
          </a>
        </div>
      </div>
    </div>
  );
}
