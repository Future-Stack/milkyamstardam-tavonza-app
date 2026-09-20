"use client";

import React from "react";
import { ThumbsUp } from "lucide-react";

interface FeedbackSuccessStepProps {
  onBackToHome: () => void;
}

export default function FeedbackSuccessStep({
  onBackToHome
}: FeedbackSuccessStepProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans text-white bg-black">
      {/* Center Thank You Content */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 space-y-4">
        {/* Thumbs Up Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-2">
          <ThumbsUp className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-medium font-['Poppins'] leading-6 tracking-wide text-white">
          Thank You
        </h1>

        {/* Subtitle */}
        <p className="text-stone-200 text-sm font-normal font-['Montserrat'] leading-6">
          Your feedback was Successfully .
        </p>
      </div>

      {/* Footer Back To Home Button */}
      <div className="relative z-10 pb-6 pt-2">
        <button
          onClick={onBackToHome}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Back To Home
        </button>
      </div>
    </div>
  );
}
