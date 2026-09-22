'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TavonzaLogo } from '../TavonzaLogo';

interface OtpVerificationViewProps {
  onVerifySuccess: () => void;
  onBack: () => void;
}

export default function OtpVerificationView({
  onVerifySuccess,
  onBack,
}: OtpVerificationViewProps) {
  const [otp, setOtp] = useState<string[]>(['0', '0', '0', '0', '0']);
  const [seconds, setSeconds] = useState(105); // 01.85 (1 min 45 secs)
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
    return `${mins.toString().padStart(2, '0')}.${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Focus next input box automatically
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifySuccess();
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-between min-h-[760px] p-4 text-white relative font-sans">
      {/* Back Button */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-white text-xs font-['Poppins'] hover:text-yellow-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3">
        <TavonzaLogo size="lg" />
      </div>

      {/* OTP Form Content */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 my-auto">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-white font-['Inter']">Verification Code</h2>
          <p className="text-xs text-neutral-400 font-['Inter']">
            A verification code has been sent to your mail.
          </p>
        </div>

        {/* 5 OTP Digit Input Boxes */}
        <div className="flex items-center justify-between gap-2.5">
          {otp.map((digit, idx) => (
            <div
              key={idx}
              className="w-14 h-12 rounded-md outline outline-1 outline-offset-[-1px] outline-white bg-black flex items-center justify-center"
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
                className="w-full h-full text-center bg-transparent text-white text-base font-medium font-['Poppins'] focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Resend Code Timer */}
        <div>
          <button
            type="button"
            onClick={() => setSeconds(105)}
            className="text-yellow-400 text-xs font-['Inter'] hover:underline"
          >
            Resend ( {formatTimer(seconds)} )
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium font-['Inter'] rounded-[100px] flex items-center justify-center transition shadow-lg shadow-yellow-500/10 active:scale-[0.99] mt-4"
        >
          Verify
        </button>
      </form>

      <div className="pb-6" />
    </div>
  );
}
