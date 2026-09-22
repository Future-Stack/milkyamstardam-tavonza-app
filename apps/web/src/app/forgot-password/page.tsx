"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  Receipt,
  Wine,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your staff email address");
      return;
    }

    setIsLoading(true);
    toast.info("Sending OTP verification code...");

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Verification code sent! Please check your email inbox.");
      // Pass email via search params or state
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    }, 700);
  };

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
            <span>Staff Account Recovery</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-['Inter']">
            Secure Staff Authentication & Credential Reset
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Quickly recover access to your line terminal, cashier register, or floor station with real-time OTP multi-factor verification.
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
            <span>End-to-End Encrypted Verification</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">Zero-Trust Node</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          RIGHT SIDE: Forgot Password Form
      ─────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10 my-auto">
        <div className="w-full max-w-md flex flex-col gap-7">
          {/* Back Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white font-['Inter']">
              Forgot Password
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your registered staff email address and we will send a 5-digit OTP verification code to reset your terminal password.
            </p>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-300">Staff Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 active:scale-[0.99] mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Help */}
          <div className="pt-2 text-center">
            <span className="text-xs text-neutral-500">
              Remember your password?{" "}
              <Link href="/" className="text-amber-400 hover:underline font-medium">
                Sign in now
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
