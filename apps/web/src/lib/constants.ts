/**
 * Shared constants with no server-only imports, so both the session helper
 * (which uses `next/headers`) and any middleware can read them.
 */

/**
 * Cookie holding the guest's JWT.
 *
 * Distinct from the backend's own `access_token` (and from the admin console's
 * `sa_session`) so tokens from different apps on the same host can never be
 * mistaken for each other.
 */
export const GUEST_COOKIE = "guest_session";
