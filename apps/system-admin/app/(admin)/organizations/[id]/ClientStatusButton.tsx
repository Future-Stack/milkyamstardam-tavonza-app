"use client";

import { useState, useTransition } from "react";
import { Loader2, Power } from "lucide-react";

import { toggleClientStatusAction } from "../../../actions/admins";

/**
 * `PATCH /admins/:id/status` — how a super admin suspends or restores a client's
 * admin account without deleting it.
 */
export function ClientStatusButton({
  adminId,
  isActive,
}: {
  adminId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleClientStatusAction(adminId);
      if (!result.success) setError(result.message);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors border disabled:opacity-70 ${
          isActive
            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
            : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Power className="w-4 h-4" />
        )}
        {isActive ? "Suspend client" : "Restore client"}
      </button>
      {error && <p className="text-xs text-red-400 leading-snug">{error}</p>}
    </div>
  );
}
