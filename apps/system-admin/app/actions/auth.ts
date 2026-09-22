"use server";

import { apiGet, apiPost, ApiError } from "@/app/lib/api";
import { createSession, deleteSession } from "@/app/lib/session";
import { requireSuperAdmin } from "@/app/lib/dal";
import type { ActionResult, GlobalRole } from "@/app/lib/types";

/** Turn any thrown value into something worth showing a user. */
function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.displayMessage;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: GlobalRole;
}

/**
 * Signs in against `POST /auth/login`, then confirms the account is a
 * SUPER_ADMIN before a session cookie is issued — the console is super-admin only,
 * so an ADMIN or CUSTOMER token must not be allowed to establish one.
 */
export async function loginAction(email: string, password: string): Promise<ActionResult> {
  try {
    const { data } = await apiPost<LoginResponse>("/auth/login", { email, password });

    if (!data?.access_token) {
      return { success: false, message: "Login failed: the API returned no token." };
    }

    // Pass the token explicitly — the cookie is not set yet at this point.
    const me = await apiGet<MeResponse>("/auth/get-me", undefined, { token: data.access_token });

    if (me.data?.role !== "SUPER_ADMIN") {
      return {
        success: false,
        message: "This account does not have super admin access to the console.",
      };
    }

    await createSession(data.access_token);
    return { success: true, message: `Welcome back, ${me.data.name}.` };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/** Clears the backend session (best effort) and our own cookie. */
export async function logoutAction(): Promise<void> {
  try {
    await apiPost("/auth/logout");
  } catch {
    // The local session is what matters; a failed API logout must not block sign-out.
  }
  await deleteSession();
}

/** `POST /auth/forgot-password` — emails a 6-digit OTP. */
export async function forgotPasswordAction(email: string): Promise<ActionResult> {
  try {
    await apiPost("/auth/forgot-password", { email });
    return { success: true, message: "A 6-digit verification code has been sent to your email." };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/**
 * `POST /auth/reset-password` — the backend takes the email, OTP and new password
 * together in one call, so the OTP is only really checked here.
 */
export async function resetPasswordAction(input: {
  email: string;
  otp: string;
  password: string;
}): Promise<ActionResult> {
  try {
    await apiPost("/auth/reset-password", input);
    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/** `POST /auth/change-password` — requires the current password. */
export async function changePasswordAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // Kept outside the try: requireSuperAdmin() redirects, and redirect() works by
  // throwing — catching it here would turn a logout into an error message.
  await requireSuperAdmin();

  const prevPass = String(formData.get("currentPassword") ?? "");
  const newPass = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!prevPass || !newPass) {
    return { success: false, message: "All password fields are required." };
  }

  if (newPass !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  try {
    await apiPost("/auth/change-password", { prevPass, newPass });
    return { success: true, message: "Password updated." };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/**
 * `POST /auth/change-email-request` — the address only changes once the user
 * clicks the confirmation link sent to the new address.
 */
export async function requestEmailChangeAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireSuperAdmin();

  const newEmail = String(formData.get("newEmail") ?? "").trim();

  if (!newEmail) {
    return { success: false, message: "Enter the new email address." };
  }

  try {
    await apiPost("/auth/change-email-request", { newEmail });
    return {
      success: true,
      message: `Confirmation link sent to ${newEmail}. Your current email stays active until you confirm it.`,
    };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}
