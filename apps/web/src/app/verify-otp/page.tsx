"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  ChefHat,
  UtensilsCrossed,
  Receipt,
  Wine,
} from "lucide-react";
import { toast } from "sonner";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "staff@restaurant.com";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [seconds, setSeconds] = useState<number>(120);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setSeconds(120);
    toast.success(`New verification code sent to ${emailParam}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 5) {
      toast.error("Please enter the complete 5-digit verification code");
      return;
    }

    setIsLoading(true);
    toast.info("Verifying OTP code...");

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Code verified successfully! Please set your new password.");
      router.push(`/reset-password?email=${encodeURIComponent(emailParam)}&otp=${encodeURIComponent(fullOtp)}`);
    }, 600);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-7">
      {/* Back Button */}
      <div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Email Address</span>
        </Link>
      </div>

      {/* Form Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Inter']">
          Enter Verification Code
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          We have sent a 5-digit code to <span className="text-amber-400 font-semibold">{emailParam}</span>. Enter the code below to verify your identity.
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 5 Digit Input Boxes */}
        <div className="flex items-center justify-between gap-2.5">
          {otp.map((digit, idx) => (
            <div
              key={idx}
              className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 focus-within:border-amber-400 flex items-center justify-center transition shadow-inner"
            >
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                placeholder="•"
                className="w-full h-full text-center bg-transparent text-white text-xl font-bold font-mono focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Resend Code Timer */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Didn&apos;t receive code?</span>
          {seconds > 0 ? (
            <span className="text-neutral-400 font-mono">
              Resend in <span className="text-amber-400 font-semibold">{formatTimer(seconds)}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              Resend Code Now
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 active:scale-[0.99] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Help */}
      <div className="pt-2 text-center">
        <span className="text-xs text-neutral-500">
          Need assistance? Contact your restaurant shift supervisor.
        </span>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
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
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Two-Factor Terminal Security</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-['Inter']">
            Verify Your Operational Access
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Multi-factor verification prevents unauthorized station takeovers and preserves restaurant security across all digital order terminals.
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
              <span className="text-xs text-neutral-200 font-medium">Cashier Stations</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <Wine className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-neutral-200 font-medium">Bar Display Logs</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-neutral-800/60 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Session Verification</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">TLS 1.3 Active</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          RIGHT SIDE: Verification Code Input
      ─────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10 my-auto">
        <Suspense fallback={<div className="text-neutral-400 text-xs">Loading verification form...</div>}>
          <VerifyOtpContent />
        </Suspense>
      </div>
    </div>
  );
}
