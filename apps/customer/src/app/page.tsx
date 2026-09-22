'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { TavonzaLogo } from '@/components/TavonzaLogo';
import AuthFlow, { AuthScreen } from '@/components/auth/AuthFlow';

interface SlideData {
  id: number;
  title: string;
  description: string;
  image: string;
  actionText: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'Discover Restaurants around you.',
    description:
      'Explore hundreds of local restaurants, cuisines, and dishes all within your neighborhood.',
    image: '/images/slide1.jpg',
    actionText: 'Continue',
  },
  {
    id: 2,
    title: 'Order for Delivery, Pickup, or Dine-In.',
    description:
      'Get food delivered to your door, ready for pickup, or scan QR to order right at your table.',
    image: '/images/slide2.jpg',
    actionText: 'Continue',
  },
  {
    id: 3,
    title: 'Let Tavonza AI recommend the perfect meal.',
    description:
      'Our AI learns your taste preferences and curates personalized recommendations just for you.',
    image: '/images/slide3.jpg',
    actionText: 'Get Started',
  },
];

export default function CustomerLandingPage() {
  // Step state: 0 = Splash Screen, 1 = Slide 1, 2 = Slide 2, 3 = Slide 3, 4 = Auth Flow
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [splashDotIndex, setSplashDotIndex] = useState<number>(0);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);

  // Auto-advance Splash Screen (Step 0) over 3 seconds with moving dot loader
  useEffect(() => {
    if (currentStep === 0) {
      setSplashDotIndex(0);
      const interval = setInterval(() => {
        setSplashDotIndex((prev) => (prev < 2 ? prev + 1 : 0));
      }, 1000);

      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setAuthScreen('login');
      setCurrentStep(4);
    }
  };

  const handleSkip = () => {
    setAuthScreen('login');
    setCurrentStep(4);
  };

  const handleOpenAuthScreen = (screen: AuthScreen) => {
    setAuthScreen(screen);
    setCurrentStep(4);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50 && currentStep > 0 && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else if (diff < -50 && currentStep > 1 && currentStep <= 3) {
      setCurrentStep((prev) => prev - 1);
    }
    touchStartX.current = null;
  };

  const activeSlideIndex = currentStep > 0 && currentStep <= 3 ? currentStep - 1 : 0;
  const slide = SLIDES[activeSlideIndex];

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center relative overflow-x-hidden font-sans">
      {/* Main Full Page Content Container */}
      <main
        className="w-full max-w-md min-h-screen flex flex-col justify-between p-6 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* STEP 0: SPLASH LOGO SCREEN */}
        {currentStep === 0 && (
          <div
            onClick={() => setCurrentStep(1)}
            className="w-full flex-1 flex flex-col items-center justify-between py-12 cursor-pointer animate-in fade-in duration-300"
          >
            <div />
            {/* Center Logo */}
            <TavonzaLogo size="lg" />

            {/* Bottom 3 Animated Loader Dots (Moves across 3 seconds) */}
            <div className="flex items-center gap-2.5 pb-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    splashDotIndex === idx
                      ? 'w-3 h-3 bg-yellow-400 shadow-md shadow-yellow-400/60 scale-110'
                      : 'w-2.5 h-2.5 bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* STEPS 1, 2, 3: ONBOARDING SLIDE SCREENS */}
        {currentStep > 0 && currentStep <= 3 && (
          <div className="w-full flex-1 flex flex-col justify-between animate-in fade-in duration-300">
            {/* Top Bar Status / Skip Link */}
            <div className="w-full flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-['SF_Pro']">
                <span>9:41</span>
              </div>
              <button
                onClick={handleSkip}
                className="text-white hover:text-yellow-400 text-xs font-semibold font-['Inter'] transition px-2 py-1"
              >
                Skip
              </button>
            </div>

            {/* Banner Image Container */}
            <div className="w-full h-72 my-4 relative rounded-xl overflow-hidden border border-white/10 shadow-xl">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Content Titles */}
            <div className="flex flex-col gap-2 my-2">
              <h2 className="text-lg md:text-xl font-semibold text-white leading-snug font-['Inter']">
                {slide.title}
              </h2>
              <p className="text-white/60 text-xs font-normal leading-relaxed font-['Inter']">
                {slide.description}
              </p>
            </div>

            {/* Progress Bars */}
            <div className="flex items-center gap-2 my-4">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === 1 ? 'w-8 bg-yellow-400' : 'w-6 bg-neutral-700'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === 2 ? 'w-8 bg-yellow-400' : 'w-6 bg-neutral-700'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === 3 ? 'w-8 bg-yellow-400' : 'w-6 bg-neutral-700'
                }`}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 pb-4">
              <button
                onClick={handleNext}
                className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-black font-medium text-sm font-['Inter'] rounded-[100px] flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
              >
                <span>{slide.actionText}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => handleOpenAuthScreen('login')}
                  className="text-xs text-slate-400 hover:text-white transition font-['Inter']"
                >
                  Already have an account?{' '}
                  <span className="text-yellow-400 font-normal underline">Sign in</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AUTHENTICATION FLOW (LOGIN, FORGOT PASS, OTP, RESET, CREATE ACCOUNT) */}
        {currentStep === 4 && (
          <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in duration-300">
            <AuthFlow
              initialScreen={authScreen}
              onAuthComplete={() => setCurrentStep(1)}
              onBackToLanding={() => setCurrentStep(1)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
