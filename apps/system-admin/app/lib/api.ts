import { cookies } from "next/headers";

import { SESSION_COOKIE } from "./session";
import type { Meta } from "./types";

/**
 * Server-side client for the Tavonza API (NestJS, `/api/v1`).
 *
 * Every call runs on the Next server — the browser never talks to the backend
 * directly, so the JWT stays in an httpOnly cookie and no CORS is involved.
 *
 * Importing `next/headers` makes this module server-only by construction: a
 * client component that pulls it in fails to build rather than leaking the token.
 */

const API_BASE_URL =  "http://0000:7777/api/v1";

export interface BackendFieldError {
  path: string;
  message: string;
}

/** A non-2xx response from the backend, whose `message` the API already writes for humans. */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: BackendFieldError[];

  constructor(status: number, message: string, fieldErrors: BackendFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /**
   * On a DTO rejection the backend sends the generic `"Validation failed"` and
   * puts the useful text in `errorMessages`, so prefer those when present.
   */
  get displayMessage(): string {
    const details = this.fieldErrors.map((entry) => entry.message).filter(Boolean);
    if (details.length > 0 && (!this.message || this.message === "Validation failed")) {
      return details.join(". ");
    }
    return this.message || "Something went wrong. Please try again.";
  }
}

/** The `{ message, success, meta, data }` envelope ResponseService produces. */
interface Envelope<T> {
  success: boolean;
  message: string;
  meta?: Meta | null;
  data?: T | null;
  errorMessages?: BackendFieldError[];
}

export interface ApiResult<T> {
  data: T;
  meta: Meta | null;
  message: string;
}

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  /**
   * Use this token instead of the session cookie. Needed right after login,
   * where the cookie has been set on the response but is not yet authoritative.
   */
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const { token: explicitToken, headers, ...init } = options;

  const token =
    explicitToken !== undefined ? explicitToken : (await cookies()).get(SESSION_COOKIE)?.value;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Fetch failed for URL:", `${API_BASE_URL}${path}`, error);
    throw new ApiError(0, `Cannot reach the Tavonza API. URL: ${API_BASE_URL}. Error: ${(error as Error).message}`);
  }

  const body = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !body?.success) {
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed with status ${response.status}`,
      body?.errorMessages ?? [],
    );
  }

  return { data: body.data as T, meta: body.meta ?? null, message: body.message };
}

type QueryValue = string | number | boolean | undefined | null;

function toQueryString(params?: Record<string, QueryValue>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function apiGet<T>(
  path: string,
  params?: Record<string, QueryValue>,
  options?: RequestOptions,
): Promise<ApiResult<T>> {
  return request<T>(`${path}${toQueryString(params)}`, options);
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResult<T>> {
  return request<T>(path, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResult<T>> {
  return request<T>(path, {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(body ?? {}),
  });
}

/** Multipart variant — `PATCH /admins/:id` takes `avatar` plus a JSON `data` part. */
export function apiPatchMultipart<T>(
  path: string,
  form: FormData,
  options?: RequestOptions,
): Promise<ApiResult<T>> {
  return request<T>(path, { ...options, method: "PATCH", body: form });
}
