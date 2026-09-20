'use client';

import React, { useState } from 'react';
import { QRHourlyScan } from '../../types';

interface QRScanActivityChartProps {
  data: QRHourlyScan[];
}

export const QRScanActivityChart: React.FC<QRScanActivityChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 650;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...data.map((d) => d.scans), 70);
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((d.scans - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG curve
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }

    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full bg-black rounded-xl border border-white/10 p-5 overflow-hidden flex flex-col justify-between">
      {/* Chart Title & Legend */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-white text-base sm:text-lg font-semibold font-['Inter'] leading-tight">
            Hourly QR Scan Activity
          </h3>
          <p className="text-zinc-400 text-sm font-normal font-['Inter'] mt-0.5">
            Peak dining engagement between 1:00 PM and 3:30 PM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50" />
          <span className="text-sm text-zinc-300 font-medium font-['Inter']">
            Scan Volume
          </span>
        </div>
      </div>

      {/* SVG Canvas Matching Screenshot 2 */}
      <div className="relative w-full pt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible select-none"
        >
          <defs>
            {/* Smooth gold gradient matching Figma snippet */}
            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#eab308" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines matching Screenshot 2 */}
          {[0.2, 0.45, 0.7, 0.95].map((factor, idx) => {
            const yPos = paddingY + factor * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={yPos}
                x2={width - paddingX}
                y2={yPos}
                stroke="#52525b"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#scanGradient)" />

          {/* Smooth Golden Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#eab308"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 4.5}
                  fill="#eab308"
                  fillOpacity={isHovered ? 0.3 : 0.15}
                  className="transition-all duration-150"
                />
                {/* Center dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3}
                  fill="#ffffff"
                  stroke="#eab308"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={pt.x - 36}
                      y={pt.y - 32}
                      width="72"
                      height="24"
                      rx="4"
                      fill="#18181b"
                      stroke="#eab308"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 16}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {pt.scans} scans
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels (10AM, 11AM, 12PM, 1PM, etc. matching Figma) */}
        <div className="flex justify-between px-6 pt-2 text-[10px] sm:text-sm font-normal font-['Inter'] text-zinc-400 border-t border-white/5">
          {data.map((d, i) => (
            <span
              key={i}
              className={`transition-colors ${
                hoveredIndex === i ? 'text-yellow-400 font-bold' : ''
              }`}
            >
              {d.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
