"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  KeyRound,
  ChefHat,
  UtensilsCrossed,
  Receipt,
  Wine,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store";
import { resetPassword } from "@/redux/features/authApi";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const emailParam = searchParams.get("email") || "";
  const initialOtp = searchParams.get("otp") || "";

  const [otp, setOtp] = useState<string>(initialOtp);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailParam) {
      toast.error("Missing staff email address. Please restart from Forgot Password.");
      router.push("/forgot-password");
      return;
    }

    if (!otp || otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating your password on database...");

    try {
      const resultAction = await dispatch(
        resetPassword({
          email: emailParam.trim().toLowerCase(),
          otp: otp.trim(),
          password,
        })
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success("Password reset successfully! Please sign in with your new credentials.", {
          id: toastId,
        });
        router.push("/signin");
      } else {
        const errorMsg =
          (resultAction.payload as string) ||
          "Password reset failed. Please ensure the OTP is correct and unexpired.";
        toast.error(errorMsg, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-7">
      {/* Back Button */}
      <div>
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      {/* Form Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Inter']">
          Create New Password
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Set a secure new password for staff account{" "}
          <span className="text-amber-400 font-semibold">{emailParam || "account"}</span>.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* OTP Input (Shown only if not in URL) */}
        {!initialOtp && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">6-Digit OTP Code</label>
            <div className="relative flex items-center">
              <Hash className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full h-11 pl-10 pr-3.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition font-mono tracking-widest"
              />
            </div>
          </div>
        )}

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-300">New Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min. 6 chars)"
              className="w-full h-11 pl-10 pr-10 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-neutral-500 hover:text-neutral-300 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-300">Confirm New Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-11 pl-10 pr-10 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-neutral-500 hover:text-neutral-300 p-1 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Note */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl text-[11px] text-neutral-400">
          • Must be at least 6 characters long
          <br />• Recommended: use numbers and letters for extra terminal security
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 active:scale-[0.99] mt-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Save Password & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex font-sans overflow-hidden">
      {/* ───────────────────────────────────────────────────────────
          LEFT SIDE: Restaurant Showcase Hero (Hidden on Mobile)
      ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-neutral-800/80">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/90" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-neutral-950 font-bold" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-['Inter']">
              TAVONZA AI
            </span>
            <span className="block text-[10px] tracking-widest text-amber-400 font-semibold uppercase">
              Hospitality Intelligence
            </span>
          </div>
        </div>

        {/* Center Content: Restaurant Feature Showcase */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium w-fit">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Staff Password Overwrite</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-['Inter']">
            Secure Credential Provisioning
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Re-encrypt your terminal access key with zero downtime across POS terminals, kitchen display monitors, and management portals.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <ChefHat className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Kitchen Terminals</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <UtensilsCrossed className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Service Staff POS</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Cashier Register</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <Wine className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Bar Station Routing</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-neutral-800/60 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Branch Cloud Node Online</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">v2.4 — Enterprise RBAC</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          RIGHT SIDE: Form
      ─────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10 my-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
