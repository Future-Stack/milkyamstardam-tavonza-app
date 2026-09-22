"use server";

import { revalidatePath } from "next/cache";

import { apiPatch, apiPatchMultipart, apiPost, ApiError } from "@/app/lib/api";
import { requireSuperAdmin } from "@/app/lib/dal";
import type { Admin, ActionResult } from "@/app/lib/types";

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.displayMessage;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export interface CreateClientInput {
  adminName: string;
  adminEmail: string;
  organizationName: string;
  password?: string;
  contactNo?: string;
}

/**
 * `POST /admins` — creates the ADMIN and, in the same transaction on the
 * backend, exactly one organization owned by and named after them.
 *
 * `organizationName` is what the onboarding form collects as the client name;
 * the backend falls back to the admin's own name when it is omitted.
 */
export async function onboardClientAction(input: CreateClientInput): Promise<ActionResult> {
  await requireSuperAdmin();

  try {
    const { data } = await apiPost<Admin>("/admins", {
      name: input.adminName,
      email: input.adminEmail,
      organizationName: input.organizationName,
      ...(input.password ? { password: input.password } : {}),
      ...(input.contactNo ? { contactNo: input.contactNo } : {}),
    });

    revalidatePath("/organizations");
    revalidatePath("/");

    const organization = data?.ownedOrganizations?.[0]?.name ?? input.organizationName;
    return {
      success: true,
      message: `Created "${organization}" with owner ${data?.email ?? input.adminEmail}.`,
    };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/** `PATCH /admins/:id` — suspends or restores a client's admin account. */
export async function toggleClientStatusAction(adminId: string): Promise<ActionResult> {
  await requireSuperAdmin();

  try {
    const { data } = await apiPatch<Admin>(`/admins/${adminId}/status`);
    revalidatePath("/organizations");
    revalidatePath(`/organizations/${adminId}`);

    return {
      success: true,
      message: `${data?.name ?? "Account"} is now ${data?.status?.toLowerCase() ?? "updated"}.`,
    };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/**
 * `PATCH /users/me` — updates the signed-in super admin's own profile.
 *
 * Takes FormData (rather than a plain object) so the avatar file survives the
 * server-action boundary; the backend reads the JSON fields from a `data` part,
 * matching the convention ParseFormDataInterceptor expects.
 */
export async function updateMyProfileAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // Outside the try — requireSuperAdmin() redirects by throwing.
  await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const contactNo = String(formData.get("contactNo") ?? "").trim();
  const avatar = formData.get("avatar");

  if (!name) {
    return { success: false, message: "Name cannot be empty." };
  }

  try {
    const body = new FormData();
    body.set("data", JSON.stringify({ name, contactNo }));

    if (avatar instanceof File && avatar.size > 0) {
      body.set("avatar", avatar, avatar.name);
    }

    await apiPatchMultipart("/users/me", body);

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true, message: "Profile updated." };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}
