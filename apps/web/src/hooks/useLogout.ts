"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { logoutUser } from "@/redux/features/authApi";

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const toastId = toast.loading("Ending shift session & signing out...");
    try {
      await dispatch(logoutUser());
      toast.success("Successfully signed out from Tavonza terminal.", { id: toastId });
      router.replace("/signin");
    } catch {
      toast.info("Session closed.", { id: toastId });
      router.replace("/signin");
    }
  };

  return { handleLogout };
}
