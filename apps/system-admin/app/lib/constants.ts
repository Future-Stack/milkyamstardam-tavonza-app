/**
 * Shared constants with no server-only imports, so both the session helper
 * (which uses `next/headers`) and `proxy.ts` (which must not) can read them.
 */

/**
 * Name of the cookie holding the backend JWT.
 *
 * Deliberately not `access_token`: the backend uses that name for its own
 * cookie, and the web app on the same host may already have one. Keeping ours
 * distinct avoids a stale token from another app being mistaken for a session.
 */
export const SESSION_COOKIE = "sa_session";
