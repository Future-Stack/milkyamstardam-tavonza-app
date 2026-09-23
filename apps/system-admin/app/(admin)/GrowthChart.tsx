"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Table2 } from "lucide-react";

import type { GrowthPoint } from "../lib/types";

const HEIGHT = 240;
const PADDING = { top: 26, right: 16, bottom: 28, left: 34 };

/** The single onboarding hue — the app's primary accent. */
const SERIES = "#D4AF37";
const GRID = "rgba(255,255,255,0.06)";
const AXIS_TEXT = "rgba(156,163,175,1)";
/** Card background composited over the page — the ring/dot colour must match it. */
const SURFACE = "#0e0f15";
const LABEL_TEXT = "rgba(229,231,235,1)";

function shortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Round the axis top to a clean number so ticks read 0 / 2 / 4, not 0 / 2.3 / 4.6. */
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  if (value <= 5) return Math.ceil(value);
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

export function GrowthChart({ series }: { series: GrowthPoint[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  // Measured rather than scaled: an SVG that stretches to fit would shrink the
  // stroke and end-markers on narrow screens below their legible minimum.
  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const points = series.map((point) => point.organizations);
  const yMax = niceCeil(Math.max(1, ...points));
  const total = points.reduce((sum, value) => sum + value, 0);

  const geometry = useMemo(() => {
    const plotWidth = Math.max(0, width - PADDING.left - PADDING.right);
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const lastIndex = Math.max(1, series.length - 1);

    const x = (index: number) => PADDING.left + (index / lastIndex) * plotWidth;
    const y = (value: number) =>
      PADDING.top + plotHeight - (value / yMax) * plotHeight;

    const line = series.map((point, index) => `${x(index)},${y(point.organizations)}`).join(" ");
    const area =
      series.length > 0
        ? `${PADDING.left},${PADDING.top + plotHeight} ${line} ${x(series.length - 1)},${
            PADDING.top + plotHeight
          }`
        : "";

    // Five x-ticks at most, evenly spaced, always including the last day.
    const tickStep = Math.max(1, Math.ceil(series.length / 5));
    const xTicks = series
      .map((point, index) => ({ index, point }))
      .filter(({ index }) => index % tickStep === 0 || index === series.length - 1);

    return { plotWidth, plotHeight, x, y, line, area, xTicks };
  }, [series, width, yMax]);

  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - PADDING.left;
    const ratio = geometry.plotWidth > 0 ? offsetX / geometry.plotWidth : 0;
    const index = Math.round(ratio * Math.max(1, series.length - 1));
    setHoverIndex(Math.min(series.length - 1, Math.max(0, index)));
  };

  const hovered = hoverIndex !== null ? series[hoverIndex] : null;
  const lastPoint = series[series.length - 1];

  return (
    <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Client onboarding
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            New organizations created per day, last {series.length} days · {total} total
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((value) => !value)}
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
        >
          {showTable ? <BarChart3 className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
          {showTable ? "Show chart" : "Show table"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-72 overflow-y-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-[#0b0e14]">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold text-right">New organizations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {series.map((point) => (
                <tr key={point.date}>
                  <td className="px-4 py-2.5 text-gray-400">{longDate(point.date)}</td>
                  <td className="px-4 py-2.5 text-gray-200 text-right tabular-nums">
                    {point.organizations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={container} className="relative">
          {width > 0 && (
            <>
              <svg
                width={width}
                height={HEIGHT}
                className="block touch-none"
                onPointerMove={handlePointer}
                onPointerLeave={() => setHoverIndex(null)}
                onPointerDown={handlePointer}
              >
                <defs>
                  <linearGradient id="onboarding-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Recessive gridlines + y ticks */}
                {[0, 0.5, 1].map((fraction) => {
                  const value = yMax * (1 - fraction);
                  const y = PADDING.top + geometry.plotHeight * fraction;
                  return (
                    <g key={fraction}>
                      <line
                        x1={PADDING.left}
                        x2={PADDING.left + geometry.plotWidth}
                        y1={y}
                        y2={y}
                        stroke={GRID}
                        strokeWidth={1}
                      />
                      <text
                        x={PADDING.left - 8}
                        y={y + 4}
                        textAnchor="end"
                        fill={AXIS_TEXT}
                        fontSize={11}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {Math.round(value)}
                      </text>
                    </g>
                  );
                })}

                {/* x ticks */}
                {geometry.xTicks.map(({ index, point }) => (
                  <text
                    key={point.date}
                    x={geometry.x(index)}
                    y={HEIGHT - 8}
                    textAnchor={index === 0 ? "start" : index === series.length - 1 ? "end" : "middle"}
                    fill={AXIS_TEXT}
                    fontSize={11}
                  >
                    {shortDate(point.date)}
                  </text>
                ))}

                {series.length > 1 && (
                  <>
                    <polygon points={geometry.area} fill="url(#onboarding-fill)" />
                    <polyline
                      points={geometry.line}
                      fill="none"
                      stroke={SERIES}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Direct label on the endpoint only — the axis and tooltip
                        carry every other value. */}
                    {lastPoint && (
                      <text
                        x={geometry.x(series.length - 1)}
                        y={geometry.y(lastPoint.organizations) - 12}
                        textAnchor="end"
                        fill={LABEL_TEXT}
                        fontSize={12}
                        fontWeight={600}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {lastPoint.organizations}
                      </text>
                    )}
                  </>
                )}

                {/* Crosshair */}
                {hoverIndex !== null && (
                  <line
                    x1={geometry.x(hoverIndex)}
                    x2={geometry.x(hoverIndex)}
                    y1={PADDING.top}
                    y2={PADDING.top + geometry.plotHeight}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth={1}
                  />
                )}

                {/* Every point gets a ringed dot when hovered; only the end point otherwise. */}
                {series.map((point, index) => {
                  const isEnd = index === series.length - 1;
                  if (hoverIndex !== index && !isEnd) return null;
                  return (
                    <circle
                      key={point.date}
                      cx={geometry.x(index)}
                      cy={geometry.y(point.organizations)}
                      r={4}
                      fill={SERIES}
                      stroke={SURFACE}
                      strokeWidth={2}
                    />
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hovered && (
                <div
                  className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-white/10 bg-[#11141D] px-3.5 py-2.5 shadow-2xl"
                  style={{
                    left: Math.min(Math.max(geometry.x(hoverIndex!), 70), width - 70),
                    top: 0,
                  }}
                >
                  <p className="text-xs text-gray-500 mb-1">{longDate(hovered.date)}</p>
                  <p className="text-sm text-gray-200 flex items-center gap-2 whitespace-nowrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: SERIES }}
                    />
                    <span className="tabular-nums font-semibold">{hovered.organizations}</span>
                    <span className="text-gray-500">
                      new organization{hovered.organizations === 1 ? "" : "s"}
                    </span>
                  </p>
                </div>
              )}

              {lastPoint && total > 0 && (
                <p className="sr-only">
                  {total} organizations created over {series.length} days.
                </p>
              )}

              {total === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                  No clients onboarded in this period.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
