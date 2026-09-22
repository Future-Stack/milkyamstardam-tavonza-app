import { cache } from "react";
import { redirect } from "next/navigation";

import { apiGet, ApiError } from "./api";
import type { SessionUser } from "./types";

/** Shape actually returned by GET /auth/get-me — the raw Prisma user row. */
type RawCurrentUser = SessionUser & { password?: string | null; passwordHash?: string | null };

/**
 * Resolves the signed-in user, or `null` when there is no usable session.
 *
 * Memoized per request so a page, its layout and its actions make one call.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const { data } = await apiGet<RawCurrentUser>("/auth/get-me");
    if (!data?.id) return null;

    // `get-me` returns the raw user row, which includes the bcrypt hash on
    // `password`. Narrow to the fields we render so it can never reach a component.
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      avatar: data.avatar ?? null,
      contactNo: data.contactNo ?? null,
      createdAt: data.createdAt,
    };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
      return null;
    }
    throw error;
  }
});

/**
 * The console is SUPER_ADMIN-only. Anyone else — including a signed-in ADMIN —
 * is sent back to the login page.
 *
 * Called by the admin layout and by every mutating server action: server actions
 * are reachable by direct POST, so a layout check alone is not sufficient.
 */
export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return user;
}
