"use client";

import React, { useState } from "react";
import { ChevronLeft, Star } from "lucide-react";

interface FeedbackStepProps {
  onBack: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
  onSkip: () => void;
}

export default function FeedbackStep({
  onBack,
  onSubmit,
  onSkip
}: FeedbackStepProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans text-white bg-black">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-[20px] bg-amber-500/40 text-white flex items-center justify-center hover:bg-amber-500/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold font-['Montserrat'] leading-7 tracking-wide text-white">
          FeedBack
        </h1>
      </div>

      {/* Center Body */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold font-['Montserrat'] text-white mb-1">
            How Was Your Experience?
          </h2>
          <p className="text-stone-300 text-sm font-normal font-['Montserrat'] leading-5">
            We&apos;d love to hear your feedback.
          </p>
        </div>

        {/* 5-Star Rating Selector */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-115"
                >
                  <Star
                    className={`w-8 h-8 ${
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "text-stone-600 fill-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs text-amber-500 font-medium tracking-wide">
            Rate
          </span>
        </div>

        {/* Feedback Textarea */}
        <div className="w-full max-w-[320px] text-left">
          <label className="text-sm font-semibold font-['Montserrat'] text-white block mb-2">
            Your Feedback
          </label>
          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share your experience........."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-400 resize-none transition"
          />
        </div>
      </div>

      {/* Bottom Submit & Skip Buttons */}
      <div className="relative z-10 pb-4 pt-2 space-y-3 text-center">
        <button
          onClick={() => onSubmit(rating, feedbackText)}
          className="w-full py-4 bg-orange-400 hover:bg-amber-400 rounded-2xl shadow-[0px_8px_20px_0px_rgba(227,172,56,0.35)] text-white text-lg font-semibold font-['Montserrat'] leading-5 transition active:scale-98"
        >
          Submit Review
        </button>

        <button
          onClick={onSkip}
          className="text-stone-300 hover:text-white text-sm font-medium font-['Montserrat'] transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
