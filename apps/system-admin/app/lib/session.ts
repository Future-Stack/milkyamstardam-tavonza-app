import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./constants";

export { SESSION_COOKIE };

/** Matches the backend's 7d access-token lifetime (JWT_EXPIRES_IN). */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function createSession(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
