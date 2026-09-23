'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { TavonzaLogo } from '@/components/TavonzaLogo';
import AuthFlow, { AuthScreen } from '@/components/auth/AuthFlow';

import CustomerDashboardView from '@/components/dashboard/CustomerDashboardView';

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
  const router = useRouter();
  // Step state: 0 = Splash Screen, 1 = Slide 1, 2 = Slide 2, 3 = Slide 3
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
      router.push('/login');
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const handleOpenAuthScreen = (screen: AuthScreen) => {
    if (screen === 'create-account') {
      router.push('/register');
    } else if (screen === 'forgot-password') {
      router.push('/forgot-password');
    } else {
      router.push('/login');
    }
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

  // If in Dashboard View (Step 5)
  if (currentStep === 5) {
    return <CustomerDashboardView />;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center relative overflow-x-hidden font-sans">
      {/* Top Floating Dashboard Switcher Button for Instant Preview */}
      {/* <div className="fixed top-3 right-3 z-50">
        <button
          onClick={() => setCurrentStep(5)}
          className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 text-yellow-300 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg transition flex items-center gap-1.5"
        >
          <span>View Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div> */}

      {/* Main Full Page Content Container */}
      <main
        className="w-full max-w-md md:max-w-xl lg:max-w-6xl min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-10 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* STEP 0: SPLASH LOGO SCREEN */}
        {currentStep === 0 && (
          <div
            onClick={() => setCurrentStep(1)}
            className="w-full flex-1 flex flex-col items-center justify-between py-12 md:py-20 cursor-pointer animate-in fade-in duration-300"
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
                      ? 'w-3.5 h-3.5 bg-yellow-400 shadow-md shadow-yellow-400/60 scale-110'
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
            {/* Top Bar Skip Link */}
            <div className="w-full flex items-center justify-end pt-2">
              <button
                onClick={handleSkip}
                className="text-white hover:text-yellow-400 text-xs md:text-sm font-semibold font-['Inter'] transition px-2 py-1"
              >
                Skip
              </button>
            </div>

            {/* Banner Image Container */}
            <div className="w-full h-72 md:h-96 my-4 md:my-6 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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
            <div className="flex flex-col gap-2.5 my-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-snug font-['Inter']">
                {slide.title}
              </h2>
              <p className="text-white/70 text-xs md:text-sm font-normal leading-relaxed font-['Inter']">
                {slide.description}
              </p>
            </div>

            {/* Progress Bars */}
            <div className="flex items-center gap-2.5 my-4 md:my-6">
              <div
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  currentStep === 1 ? 'w-8 md:w-12 bg-yellow-400' : 'w-6 md:w-8 bg-neutral-700'
                }`}
              />
              <div
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  currentStep === 2 ? 'w-8 md:w-12 bg-yellow-400' : 'w-6 md:w-8 bg-neutral-700'
                }`}
              />
              <div
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                  currentStep === 3 ? 'w-8 md:w-12 bg-yellow-400' : 'w-6 md:w-8 bg-neutral-700'
                }`}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3.5 pb-4 md:pb-8">
              <button
                onClick={handleNext}
                className="w-full h-11 md:h-13 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99] text-black font-semibold text-sm md:text-base font-['Inter'] rounded-[100px] flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
              >
                <span>{slide.actionText}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => handleOpenAuthScreen('login')}
                  className="text-xs md:text-sm text-slate-400 hover:text-white transition font-['Inter']"
                >
                  Already have an account?{' '}
                  <span className="text-yellow-400 font-medium underline">Sign in</span>
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
              onAuthComplete={() => setCurrentStep(5)}
              onBackToLanding={() => setCurrentStep(1)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

