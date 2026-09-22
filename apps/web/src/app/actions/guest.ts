"use server";

import { revalidatePath } from "next/cache";

import { apiPost, ApiError } from "@/src/lib/api";
import { createGuestSession, deleteGuestSession } from "@/src/lib/session";
import type { ActionResult, GuestVerification } from "@/src/lib/types";

const QR_ORDER_PATH = "/qr-order";

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.displayMessage;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

const qrPath = (token: string) => `/guest/table/${encodeURIComponent(token)}`;

/** Asks the API to send a 6-digit code to the guest's email or phone. */
export async function sendOtpAction(
  token: string,
  contact: string,
): Promise<ActionResult & { devOtp?: string }> {
  try {
    const { data } = await apiPost<{ delivery: string; devOtp?: string }>(
      `${qrPath(token)}/otp`,
      { contact },
    );

    // Phone contacts have no SMS provider behind them yet; outside production the
    // API hands the code back so the flow remains demoable.
    if (data.devOtp) {
      return {
        success: true,
        message: `SMS isn't configured yet — for this demo your code is ${data.devOtp}`,
        devOtp: data.devOtp,
      };
    }

    return { success: true, message: `We've sent a code to ${contact}.` };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/**
 * Verifies the code and seats the guest. The returned JWT is stored in an
 * httpOnly cookie — it carries the guest and table session ids, which every
 * later call relies on instead of trusting ids from the client.
 */
export async function verifyOtpAction(
  token: string,
  contact: string,
  otp: string,
): Promise<ActionResult> {
  try {
    const { data } = await apiPost<GuestVerification>(`${qrPath(token)}/otp/verify`, {
      contact,
      otp,
    });

    await createGuestSession(data.accessToken);
    revalidatePath(QR_ORDER_PATH);

    const name = data.guest.displayName ?? "there";
    return {
      success: true,
      message: data.guest.isHostGuest
        ? `Welcome, ${name} — you've opened ${data.table.label}.`
        : `Welcome, ${name} — you've joined ${data.table.label}.`,
    };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

export interface OrderLineInput {
  productId: string;
  quantity: number;
  modifierIds?: string[];
}

export async function placeOrderAction(input: {
  items: OrderLineInput[];
  tipAmount?: number;
  discountCode?: string;
  specialInstructions?: string;
}): Promise<ActionResult & { orderNumber?: string }> {
  try {
    const { data } = await apiPost<{ id: string; orderNumber: string }>("/guest/orders", {
      items: input.items,
      tipAmount: input.tipAmount,
      discountCode: input.discountCode || undefined,
      specialInstructions: input.specialInstructions || undefined,
    });

    revalidatePath(QR_ORDER_PATH);
    return {
      success: true,
      message:
        "Order placed. Your waiter will accept it shortly — you can keep ordering until the table is cleared.",
      orderNumber: data?.orderNumber,
    };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/**
 * Settles the bill. No amount is sent: the scope decides what is covered and the
 * server prices it — the whole table, chosen guests, chosen items, or your own.
 */
export async function payAction(input: {
  scope: "GUEST_SESSION" | "TABLE_SESSION" | "ORDER_ITEMS";
  targetGuestIds?: string[];
  itemIds?: string[];
  method: "CARD" | "CASH" | "MOBILE_WALLET" | "ONLINE_GATEWAY";
  tipAmount?: number;
}): Promise<ActionResult> {
  try {
    const { data } = await apiPost<{ amount: number }>("/guest/payments", input);
    revalidatePath(QR_ORDER_PATH);
    return { success: true, message: `Settled — thank you.` };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

export async function reviewOrderAction(
  orderId: string,
  rating: number,
  comment: string,
): Promise<ActionResult> {
  try {
    await apiPost(`/guest/orders/${encodeURIComponent(orderId)}/review`, {
      rating,
      comment: comment || undefined,
    });
    revalidatePath(QR_ORDER_PATH);
    return { success: true, message: "Thanks for the review." };
  } catch (error) {
    return { success: false, message: toMessage(error) };
  }
}

/** Drops the local session — the table itself stays open for the other guests. */
export async function leaveTableAction(): Promise<void> {
  await deleteGuestSession();
  revalidatePath(QR_ORDER_PATH);
}
