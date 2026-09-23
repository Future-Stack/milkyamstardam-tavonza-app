import { cache } from "react";

import { apiGet, ApiError } from "./api";
import type { GuestTab } from "./types";

/**
 * The current guest's view of their table, or `null` when they have not verified
 * an OTP (or their session has since closed).
 *
 * Memoized per request so a page and its actions share one call.
 */
export const getGuestTab = cache(async (): Promise<GuestTab | null> => {
  try {
    const { data } = await apiGet<GuestTab>("/guest/tab");
    return data ?? null;
  } catch (error) {
    // No cookie, expired token, or a session the waiter has already closed —
    // all mean "not seated right now", not "something broke".
    if (error instanceof ApiError && [0, 401, 403, 404, 409].includes(error.status)) {
      return null;
    }
    throw error;
  }
});

/**
 * Resolves a table from the token in a scanned QR.
 *
 * Public — the guest has no token yet at this point.
 */
export async function getTableByToken(token: string) {
  const { data } = await apiGet<import("./types").GuestTableContext>(
    `/guest/table/${encodeURIComponent(token)}`,
  );
  return data;
}

export async function getMenuByToken(token: string) {
  const { data } = await apiGet<import("./types").GuestMenu>(
    `/guest/menu/${encodeURIComponent(token)}`,
  );
  return data;
}
