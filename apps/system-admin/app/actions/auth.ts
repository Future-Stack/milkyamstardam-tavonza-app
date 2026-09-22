"use server";

import { cookies } from "next/headers";

export async function loginAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin-session", "mock-auth-token-12345", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
}
