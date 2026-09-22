'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TavonzaLogo } from '../TavonzaLogo';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export default function LoginView({
  onLoginSuccess,
  onForgotPassword,
  onCreateAccount,
}: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-between min-h-[760px] p-4 text-white relative font-sans">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 pt-6">
        <TavonzaLogo size="lg" />
      </div>

      {/* Main Login Form Box */}
      <div className="w-full flex flex-col items-center gap-6 mt-6">
        <div className="text-center flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold text-white font-['Inter']">Welcome</h2>
          <p className="text-sm text-white/80 font-['Inter']">
            Please choose your login option below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white font-['Inter']">Email</label>
            <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center gap-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent text-xs text-white placeholder:text-zinc-100/50 font-['Inter'] focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-white font-['Inter']">Password</label>
            </div>
            <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center justify-between gap-2.5">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-xs text-white placeholder:text-zinc-100/50 font-['Inter'] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-yellow-400 text-xs font-['Inter'] underline hover:text-yellow-300 transition"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-medium font-['Inter'] rounded-[100px] flex items-center justify-center transition shadow-lg shadow-yellow-500/10 active:scale-[0.99] mt-2"
          >
            Login
          </button>
        </form>

        {/* Or Login With Divider */}
        <div className="w-full flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/60" />
          <span className="text-xs text-white font-['Poppins']">Or login with</span>
          <div className="flex-1 h-px bg-white/60" />
        </div>

        {/* Social Logins */}
        <div className="w-full grid grid-cols-3 gap-2">
          {/* Facebook */}
          <button
            type="button"
            onClick={onLoginSuccess}
            className="h-12 bg-white/10 hover:bg-white/15 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/10 flex items-center justify-center gap-1.5 transition"
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              f
            </div>
            <span className="text-white text-xs font-['Poppins']">Facebook</span>
          </button>

          {/* Gmail */}
          <button
            type="button"
            onClick={onLoginSuccess}
            className="h-12 bg-white/10 hover:bg-white/15 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/10 flex items-center justify-center gap-1.5 transition"
          >
            <span className="text-red-500 font-bold text-xs">G</span>
            <span className="text-white text-xs font-['Poppins']">Gmail</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={onLoginSuccess}
            className="h-12 bg-white/10 hover:bg-white/15 rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/10 flex items-center justify-center gap-1.5 transition"
          >
            <span className="text-white font-bold text-xs"></span>
            <span className="text-white text-xs font-['Poppins']">Apple</span>
          </button>
        </div>
      </div>

      {/* Bottom Sign Up Link */}
      <div className="pt-6 pb-2 text-center">
        <span className="text-slate-400 text-sm font-['Inter']">Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={onCreateAccount}
          className="text-yellow-400 text-sm font-['Inter'] font-semibold underline hover:text-yellow-300 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
