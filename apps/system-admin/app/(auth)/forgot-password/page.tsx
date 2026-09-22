"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email");
  
  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("otp");
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;
    
    setIsSubmitting(true);
    // Simulate verifying OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("password");
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate resetting password
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden min-h-[400px]">
      
      {step !== "success" && (
        <button 
          onClick={() => {
             if (step === "otp") setStep("email");
             else if (step === "password") setStep("otp");
             else window.location.href = "/login";
          }}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "email" ? "Back to Login" : "Back"}
        </button>
      )}

      {/* Step 1: Email */}
      {step === "email" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Enter your email address and we'll send you a 6-digit verification code.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tavonza.com"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Sending Code...</>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: OTP */}
      {step === "otp" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Enter Verification Code</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              We've sent a 6-digit code to <span className="text-white font-medium">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  required
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                  className="w-12 h-14 bg-black/20 text-center text-xl font-bold text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00F2FE]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || otp.join("").length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#00F2FE] hover:bg-[#00d8e6] text-[#090B10] px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Verify Code</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Step 3: New Password */}
      {step === "password" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create New Password</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your identity has been verified. Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 border border-white/5 transition-colors hover:border-white/10"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 mt-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-3">Password Updated</h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Your password has been successfully reset. You can now use your new password to log in.
          </p>
          <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C4A45D] text-[#090B10] px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            Go to Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
