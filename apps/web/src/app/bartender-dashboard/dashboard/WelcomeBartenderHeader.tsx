'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function WelcomeBartenderHeader() {
  const [currentTime, setCurrentTime] = useState('15:50');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-['Inter'] leading-tight tracking-tight">
          Good Morning, James
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-normal font-['Inter'] leading-normal sm:leading-6">
          Tavonza AI has analyzed today&apos;s operations and prepared your priorities.
        </p>
      </div>

      <div className="h-9 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg inline-flex items-center gap-2 self-start sm:self-auto backdrop-blur-md shadow-sm">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-gray-300 text-sm font-medium font-mono">
          {currentTime}
        </span>
      </div>
    </div>
  );
}
