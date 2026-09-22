"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  Mail,
  Phone,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Lock,
  X,
  RefreshCw,
  ShieldCheck
} from "lucide-react";

const customerPageIcon = "/assets/costomerpages/customer-page-icon.svg";
const restaurantTableSpread = "/assets/costomerpages/restaurant-table-spread.jpg";

interface WelcomeStepProps {
  onContinue: (email?: string, phone?: string) => void;
  tableNumber?: string;
  branchName?: string;
}

export default function WelcomeStep({
  onContinue,
  tableNumber = "Table 08",
  branchName = "Tavonza Downtown"
}: WelcomeStepProps) {
  const [logoState, setLogoState] = useState<'initial' | 'zooming' | 'vanished'>('initial');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP Verification Modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    // Phase 1: Start zoom out animation after 600ms
    const zoomTimer = setTimeout(() => {
      setLogoState('zooming');
    }, 600);

    // Phase 2: Logo vanishes completely after 1300ms, revealing form
    const vanishTimer = setTimeout(() => {
      setLogoState('vanished');
    }, 1300);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(vanishTimer);
    };
  }, []);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpModalOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, resendTimer]);

  const activeContact = authMethod === 'email' ? email : phone;
  const isInputProvided = activeContact.trim().length > 0;

  const handleOpenOtpModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputProvided) {
      return;
    }
    setIsOtpModalOpen(true);
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Focus next input box
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFillCode = () => {
    setOtpDigits(['4', '8', '2', '9']);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);

      // After 1.2s of verified checkmark animation, close modal and show main menu
      setTimeout(() => {
        setIsOtpModalOpen(false);
        onContinue(email, phone);
      }, 1200);
    }, 800);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-12 overflow-hidden animate-in fade-in duration-500 text-white font-sans h-full">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={restaurantTableSpread}
          alt="Restaurant Feast Table"
          fill
          priority
          className="object-cover object-center filter brightness-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/95" />
        <div className="absolute top-[250px] left-[20px] w-96 h-96 bg-black/95 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 md:px-8 w-full">
        {/* Animated Project Logo (Zoom Out & Vanish) */}
        {logoState !== 'vanished' && (
          <div
            className={`relative w-24 h-24 md:w-32 md:h-32 mb-6 transition-all duration-700 ease-out ${
              logoState === 'zooming'
                ? 'scale-[2.8] opacity-0 filter blur-md'
                : 'scale-100 opacity-100'
            }`}
          >
            <Image
              src={customerPageIcon}
              alt="Tavonza Logo"
              fill
              className="object-contain drop-shadow-[0_0_25px_rgba(251,146,60,0.8)]"
            />
          </div>
        )}

        {/* Form & Pre-loaded Context (Revealed after Logo Vanishes) */}
        {logoState === 'vanished' && (
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Small Brand Emblem */}
            <div className="flex items-center justify-center gap-2 text-orange-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span>Tavonza Digital Ordering</span>
            </div>

            <h1 className="text-center text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal font-['Poppins'] leading-tight tracking-wide">
              Welcome to <br /> <span className="text-orange-400 font-semibold">{branchName}</span>
            </h1>

            {/* Pre-loaded Branch & Table Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <div className="px-3.5 py-1.5 md:px-4 md:py-2 bg-orange-500/15 border border-orange-400/30 rounded-full flex items-center gap-1.5 text-xs sm:text-sm text-orange-300 font-semibold shadow-sm">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
                <span>{branchName} • {tableNumber}</span>
              </div>

              <div className="px-3 py-1 md:px-4 md:py-1.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 font-mono">
                <ShieldAlert className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" />
                <span>Pre-loaded via QR • Not yet authenticated</span>
              </div>
            </div>

            <p className="text-stone-300 text-xs sm:text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed max-w-[320px] sm:max-w-[400px] mx-auto pt-1">
              Enter your {authMethod === 'email' ? 'Gmail address' : 'Phone number'} to get a verification code and authenticate your session.
            </p>

            {/* Single Input Form with Phone/Gmail Toggle */}
            <form onSubmit={handleOpenOtpModal} className="space-y-3 sm:space-y-4 pt-2">
              {authMethod === 'email' ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-orange-400 absolute left-4 md:left-5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Gmail address"
                      className="w-full h-12 sm:h-14 pl-11 md:pl-13 pr-4 bg-zinc-900/90 border border-zinc-700 focus:border-orange-400 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none shadow-xl transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setEmail('');
                    }}
                    className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Use Phone Number instead</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-orange-400 absolute left-4 md:left-5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full h-12 sm:h-14 pl-11 md:pl-13 pr-4 bg-zinc-900/90 border border-zinc-700 focus:border-orange-400 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none shadow-xl transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setPhone('');
                    }}
                    className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Use Gmail address instead</span>
                  </button>
                </div>
              )}

              {/* Get Verification Code Button (Disabled until Gmail/Phone is entered) */}
              <button
                type="submit"
                disabled={!isInputProvided}
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl flex justify-center items-center gap-2 font-bold text-sm sm:text-base tracking-wide transition-all mt-3 ${
                  isInputProvided
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-lg shadow-orange-400/25 active:scale-98 cursor-pointer"
                    : "bg-zinc-800/80 border border-zinc-700/60 text-zinc-500 cursor-not-allowed opacity-60 shadow-none"
                }`}
              >
                <span>Get Verification Code</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Verification Code Modal */}
      {isOtpModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center">
            {/* Close Modal */}
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {isVerified ? (
              /* Success State */
              <div className="py-6 flex flex-col items-center space-y-3 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 stroke-[2.5]" />
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-bold font-['Poppins']">
                  Verified Successfully!
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm font-['Montserrat']">
                  Identity authenticated. Opening menu...
                </p>
              </div>
            ) : (
              /* OTP Input Form */
              <div className="w-full space-y-4 sm:space-y-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto text-orange-400">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div>
                  <h3 className="text-white text-lg sm:text-xl font-bold font-['Poppins']">
                    Enter Verification Code
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-['Montserrat']">
                    We sent a 4-digit code to <br />
                    <span className="text-orange-400 font-medium">
                      {activeContact || "your account"}
                    </span>
                  </p>
                </div>

                {/* 4-Digit Inputs */}
                <div className="flex justify-center gap-3 sm:gap-4 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-13 sm:w-14 sm:h-15 text-center text-xl sm:text-2xl font-bold bg-zinc-950 border border-zinc-700 focus:border-orange-400 rounded-xl sm:rounded-2xl text-orange-400 focus:outline-none shadow-inner"
                    />
                  ))}
                </div>

                {/* Demo Code Helper */}
                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="px-3.5 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 rounded-full text-xs font-mono flex items-center gap-1.5 mx-auto transition-colors cursor-pointer text-orange-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Auto-fill code (4829)</span>
                </button>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full h-11 sm:h-13 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>

                {/* Resend Code Timer */}
                <div className="text-xs text-zinc-400 font-mono">
                  {resendTimer > 0 ? (
                    <span>Resend code in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={() => setResendTimer(30)}
                      className="text-orange-400 hover:underline cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="relative z-10 text-center py-2 text-neutral-400 text-xs sm:text-sm font-normal font-['Montserrat'] leading-4">
        Powered by Tavonza Digital Ordering
      </div>
    </div>
  );
}
