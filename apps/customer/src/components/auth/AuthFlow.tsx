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
            onLoginSuccess={onAuthComplete}
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
            onComplete={onAuthComplete}
            onBack={() => setCurrentScreen('verify-otp')}
          />
        )}

        {currentScreen === 'create-account' && (
          <CreateAccountView
            onAccountCreated={onAuthComplete}
            onGoBackToLogin={() => setCurrentScreen('login')}
          />
        )}
      </div>
    </div>
  );
}
