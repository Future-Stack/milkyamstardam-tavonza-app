'use client';

import React, { useState } from 'react';
import { TrafficDataPoint } from '../../types';

interface HourlyTrafficChartProps {
  data: TrafficDataPoint[];
}

export const HourlyTrafficChart: React.FC<HourlyTrafficChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const yTicks = [8000, 6000, 4000, 2000, 0];
  const maxVal = 8000;

  return (
    <div className="w-full bg-neutral-900 rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-white/5 p-6 sm:p-7 flex flex-col justify-between h-[390px] select-none">
      {/* Header */}
      <div>
        <h2 className="text-white text-lg font-semibold font-['Inter'] leading-6">
          Hourly Traffic
        </h2>
        <p className="text-slate-400 text-sm font-normal font-['Inter'] leading-5 mt-0.5">
          Dine-in vs takeout guests by hour.
        </p>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative flex-1 mt-6 flex items-stretch gap-3 min-h-[220px]">
        {/* Y Axis Column */}
        <div className="flex flex-col justify-between text-right text-sm text-neutral-400 font-['Inter'] py-1 w-10 shrink-0 select-none">
          {yTicks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Chart Body with Grid & Bars */}
        <div className="relative flex-1 h-full flex flex-col justify-between">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
            {yTicks.map((tick, idx) => (
              <div
                key={idx}
                className={`w-full ${
                  tick === 0
                    ? 'border-b border-zinc-700/80'
                    : 'border-b border-zinc-800/80 border-dashed'
                } h-0`}
              />
            ))}
          </div>

          {/* Bars Column Container */}
          <div className="absolute inset-0 flex items-end justify-between px-3 sm:px-6 z-10">
            {data.map((item, idx) => {
              const heightPercent = Math.min((item.value / maxVal) * 100, 100);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 bg-neutral-950/95 border border-yellow-500/50 rounded-lg px-3 py-1.5 text-sm text-white shadow-2xl pointer-events-none z-30 font-['Inter'] whitespace-nowrap backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                      <div className="font-semibold text-yellow-400 text-sm">
                        {item.day}: {item.value.toLocaleString()} guests
                      </div>
                      <div className="text-xs text-zinc-300 flex items-center gap-2 mt-0.5">
                        <span className="text-orange-400">Dine-in: {item.dineIn.toLocaleString()}</span>
                        <span className="text-blue-400">Takeout: {item.takeout.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* The Yellow Bar */}
                  <div
                    className={`w-5 sm:w-6 bg-yellow-500 rounded-t-[5px] transition-all duration-300 ${
                      isHovered
                        ? 'brightness-125 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-y-[1.02]'
                        : 'hover:brightness-110'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X Axis Day Labels */}
      <div className="flex justify-between pl-14 pr-3 sm:pr-6 pt-3 text-sm text-white font-['Inter'] select-none">
        {data.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <span
              key={item.day}
              className={`text-center flex-1 transition-colors ${
                isHovered ? 'text-yellow-400 font-semibold' : 'text-neutral-300'
              }`}
            >
              {item.day}
            </span>
          );
        })}
      </div>
    </div>
  );
};
