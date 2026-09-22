'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { registerCustomer, loginUser } from '@/redux/features/authApi';
import { clearAuthError } from '@/redux/slices/authSlice';

interface CreateAccountViewProps {
  onAccountCreated: () => void;
  onGoBackToLogin: () => void;
}

export default function CreateAccountView({
  onAccountCreated,
  onGoBackToLogin,
}: CreateAccountViewProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+855');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }
    dispatch(clearAuthError());
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const contactNo = `${countryCode}${phone.trim()}`;

    const regResult = await dispatch(
      registerCustomer({
        name: fullName   ,
        email,
        password,
        contactNo,
      })
    );

    if (registerCustomer.fulfilled.match(regResult)) {
      // Auto-login after successful registration
      const loginResult = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(loginResult)) {
        onAccountCreated();
      } else {
        onAccountCreated();
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-between min-h-[760px] p-4 text-white relative font-sans">
      {/* Back Button Header */}
      <div className="w-full flex items-center justify-between pt-2 pb-4">
        <button
          type="button"
          onClick={onGoBackToLogin}
          className="flex items-center gap-1.5 text-white text-xs font-['Poppins'] hover:text-yellow-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Title Header */}
      <div className="w-full flex flex-col gap-1.5 mb-4">
        <h2 className="text-xl font-semibold text-white font-['Inter']">Create Account</h2>
        <p className="text-xs text-white/50 font-['Poppins'] leading-relaxed">
          Get the best out of Tavonza AI by creating an account
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 my-auto">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 font-['Inter']">
            {error}
          </div>
        )}

        {/* First Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white font-['Inter']">First Name</label>
          <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center">
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-100/50 font-['Inter'] focus:outline-none"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white font-['Inter']">Last Name</label>
          <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center">
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-100/50 font-['Inter'] focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white font-['Inter']">Email</label>
          <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@gmail.com"
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-100/50 font-['Inter'] focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white font-['Inter']">Password</label>
          <div className="w-full h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center justify-between">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
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
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white font-['Inter']">Phone</label>
          <div className="w-full flex items-center gap-2">
            {/* Country Code Select */}
            <div className="w-24 h-12 px-3 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center justify-between">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-xs text-white/70 font-['Inter'] focus:outline-none cursor-pointer"
              >
                <option value="+855" className="bg-neutral-900 text-white">
                  +855
                </option>
                <option value="+1" className="bg-neutral-900 text-white">
                  +1
                </option>
                <option value="+880" className="bg-neutral-900 text-white">
                  +880
                </option>
                <option value="+44" className="bg-neutral-900 text-white">
                  +44
                </option>
              </select>
            </div>

            {/* Phone Number Input */}
            <div className="flex-1 h-12 px-3.5 bg-neutral-950 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex items-center">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123 456 789"
                className="w-full bg-transparent text-xs text-white/80 placeholder:text-white/40 font-['Inter'] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Terms and Condition Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setAcceptedTerms(!acceptedTerms)}
            className={`w-5 h-5 rounded-[4px] outline outline-1 outline-offset-[-1px] outline-white/90 flex items-center justify-center transition ${
              acceptedTerms ? 'bg-yellow-400 text-black' : 'bg-neutral-950 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={() => setAcceptedTerms(!acceptedTerms)}
            className="text-yellow-400 text-xs font-['Poppins'] underline hover:text-yellow-300 transition"
          >
            I accept terms and conditions
          </button>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={!acceptedTerms || loading}
          className={`w-full h-11 text-sm font-medium font-['Inter'] rounded-[100px] flex items-center justify-center gap-2 transition shadow-lg mt-3 ${
            !acceptedTerms || loading
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60'
              : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-500/10 cursor-pointer active:scale-[0.99]'
          }`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
        </button>
      </form>

      {/* Bottom Go Back link */}
      <div className="pt-4 pb-2 text-center">
        <span className="text-slate-400 text-sm font-['Inter']">Already have an account? </span>
        <button
          type="button"
          onClick={onGoBackToLogin}
          className="text-yellow-400 text-sm font-['Inter'] font-semibold hover:text-yellow-300 underline transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
