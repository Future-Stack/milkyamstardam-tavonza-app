'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { TavonzaLogo } from '../TavonzaLogo';

interface ResetPasswordViewProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function ResetPasswordView({ onComplete, onBack }: ResetPasswordViewProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 my-auto">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-white font-['Inter']">Create New Password</h2>
          <p className="text-xs text-white/60 font-['Poppins']">
            Keep your account secure by creating a strong password
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center justify-between">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-xs text-white placeholder:text-white/40 font-['Inter'] focus:outline-none tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/60 hover:text-white p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-white/50 font-['Poppins']">
            Your password should be at least contain upper character
          </p>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium font-['Inter'] rounded-[100px] flex items-center justify-center transition shadow-lg shadow-yellow-500/10 active:scale-[0.99] mt-4"
        >
          Create New Password
        </button>
      </form>

      <div className="pb-6" />
    </div>
  );
}
