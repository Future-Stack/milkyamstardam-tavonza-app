'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TavonzaLogo } from '../TavonzaLogo';

interface ForgotPasswordViewProps {
  onRequestCode: (email: string) => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordView({
  onRequestCode,
  onBackToLogin,
}: ForgotPasswordViewProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('info@gmail.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestCode(emailOrPhone);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-between min-h-[760px] p-4 text-white relative font-sans">
      {/* Back Button & Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToLogin}
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 my-auto">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-white font-['Inter']">Forget password</h2>
          <p className="text-xs text-white/60 font-['Inter'] leading-relaxed">
            Enter your email or phone we will send the verification code to reset your password
          </p>
        </div>

        <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center">
          <input
            type="text"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="info@gmail.com"
            className="w-full bg-transparent text-xs text-white/90 placeholder:text-white/40 font-['Inter'] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium font-['Inter'] rounded-[100px] flex items-center justify-center transition shadow-lg shadow-yellow-500/10 active:scale-[0.99] mt-4"
        >
          Request code
        </button>
      </form>

      {/* Footer Back link */}
      <div className="pb-6 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs text-slate-400 hover:text-white transition"
        >
          Remembered password?{' '}
          <span className="text-yellow-400 font-semibold underline">Sign in</span>
        </button>
      </div>
    </div>
  );
}
