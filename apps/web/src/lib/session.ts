import { cookies } from "next/headers";

import { GUEST_COOKIE } from "./constants";

export { GUEST_COOKIE };

/** The backend signs guest tokens for 12 hours — one service, comfortably. */
const MAX_AGE_SECONDS = 60 * 60 * 12;

export async function createGuestSession(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getGuestToken(): Promise<string | undefined> {
  return (await cookies()).get(GUEST_COOKIE)?.value;
}

export async function deleteGuestSession(): Promise<void> {
  (await cookies()).delete(GUEST_COOKIE);
}
