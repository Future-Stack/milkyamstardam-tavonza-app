'use client';

import React, { useState } from 'react';
import LoginView from './LoginView';
import ForgotPasswordView from './ForgotPasswordView';
import OtpVerificationView from './OtpVerificationView';
import ResetPasswordView from './ResetPasswordView';
import CreateAccountView from './CreateAccountView';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export type AuthScreen =
  | 'login'
  | 'forgot-password'
  | 'verify-otp'
  | 'reset-password'
  | 'create-account'
  | 'success';

interface AuthFlowProps {
  initialScreen?: AuthScreen;
  onAuthComplete: () => void;
  onBackToLanding?: () => void;
}

export default function AuthFlow({
  initialScreen = 'login',
  onAuthComplete,
  onBackToLanding,
}: AuthFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(initialScreen);
  const [userEmail, setUserEmail] = useState('info@gmail.com');

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">

      {/* Screen Router */}
      <div className="w-full flex-1 flex items-center justify-center">
        {currentScreen === 'login' && (
          <LoginView
            onLoginSuccess={() => setCurrentScreen('success')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onCreateAccount={() => setCurrentScreen('create-account')}
          />
        )}

        {currentScreen === 'forgot-password' && (
          <ForgotPasswordView
            onRequestCode={(email) => {
              setUserEmail(email);
              setCurrentScreen('verify-otp');
            }}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'verify-otp' && (
          <OtpVerificationView
            onVerifySuccess={() => setCurrentScreen('reset-password')}
            onBack={() => setCurrentScreen('forgot-password')}
          />
        )}

        {currentScreen === 'reset-password' && (
          <ResetPasswordView
            onComplete={() => setCurrentScreen('success')}
            onBack={() => setCurrentScreen('verify-otp')}
          />
        )}

        {currentScreen === 'create-account' && (
          <CreateAccountView
            onAccountCreated={() => setCurrentScreen('success')}
            onGoBackToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'success' && (
          <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center min-h-[760px] p-6 text-center text-white gap-6 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shadow-xl shadow-yellow-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold font-['Outfit'] text-white">Authenticated!</h2>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Welcome to <span className="text-yellow-400 font-semibold">Tavonza AI</span>. Your dining preferences and table sessions are ready.
              </p>
            </div>

            <button
              onClick={onAuthComplete}
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition active:scale-[0.99]"
            >
              <span>Explore Menu & Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
