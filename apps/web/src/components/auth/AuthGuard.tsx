"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { getDestinationRoute } from "@/app/signin/signin";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (user && allowedRoles && allowedRoles.length > 0) {
      const primaryStaffRole = user.assignments?.[0]?.role;
      const userGlobalRole = user.role;

      // Platform admins have universal access
      const isPlatformAdmin =
        userGlobalRole === "SUPER_ADMIN" || userGlobalRole === "ADMIN";

      const hasRequiredRole =
        isPlatformAdmin ||
        allowedRoles.includes(userGlobalRole) ||
        (primaryStaffRole && allowedRoles.includes(primaryStaffRole));

      if (!hasRequiredRole) {
        // Redirect to their assigned workspace
        const properDestination = getDestinationRoute(user);
        router.replace(properDestination);
      }
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  // Loading state while verifying token/session
  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center font-sans text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
            <Sparkles className="w-6 h-6 text-neutral-950 font-bold" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="text-sm font-semibold tracking-wide">
                Verifying Tavonza Terminal Session
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              Synchronizing permissions and node credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
