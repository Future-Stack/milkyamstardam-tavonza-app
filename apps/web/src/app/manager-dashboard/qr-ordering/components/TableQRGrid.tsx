'use client';

import React from 'react';
import { ExternalLink, Printer } from 'lucide-react';
import { TableQRItem } from '../../types';

interface TableQRGridProps {
  tables: TableQRItem[];
  onSelectTable: (table: TableQRItem) => void;
  onPrintTableQR?: (table: TableQRItem) => void;
}

// Crisp reusable SVG QR Code representation matching Screenshot 1
export const QRCodeGraphic: React.FC<{ size?: number; className?: string }> = ({
  size = 80,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Background White Card */}
      <rect width="100" height="100" rx="6" fill="white" />

      {/* Top-Left Position Detection Marker */}
      <rect x="8" y="8" width="28" height="28" rx="3" fill="black" />
      <rect x="13" y="13" width="18" height="18" rx="2" fill="white" />
      <rect x="17" y="17" width="10" height="10" rx="1" fill="black" />

      {/* Top-Right Position Detection Marker */}
      <rect x="64" y="8" width="28" height="28" rx="3" fill="black" />
      <rect x="69" y="13" width="18" height="18" rx="2" fill="white" />
      <rect x="73" y="17" width="10" height="10" rx="1" fill="black" />

      {/* Bottom-Left Position Detection Marker */}
      <rect x="8" y="64" width="28" height="28" rx="3" fill="black" />
      <rect x="13" y="69" width="18" height="18" rx="2" fill="white" />
      <rect x="17" y="73" width="10" height="10" rx="1" fill="black" />

      {/* Timing Patterns & Data Modules */}
      <rect x="42" y="10" width="5" height="5" fill="black" />
      <rect x="52" y="10" width="5" height="5" fill="black" />
      <rect x="42" y="20" width="10" height="5" fill="black" />
      <rect x="10" y="42" width="5" height="5" fill="black" />
      <rect x="20" y="42" width="5" height="5" fill="black" />
      <rect x="30" y="42" width="5" height="5" fill="black" />

      {/* Center Data Matrix */}
      <rect x="40" y="38" width="8" height="8" fill="black" />
      <rect x="52" y="38" width="8" height="8" fill="black" />
      <rect x="44" y="50" width="12" height="6" fill="black" />
      <rect x="60" y="44" width="8" height="8" fill="black" />
      <rect x="72" y="44" width="6" height="12" fill="black" />
      <rect x="82" y="44" width="8" height="8" fill="black" />
      <rect x="38" y="64" width="8" height="8" fill="black" />
      <rect x="50" y="64" width="8" height="8" fill="black" />
      <rect x="64" y="64" width="12" height="6" fill="black" />
      <rect x="80" y="64" width="10" height="10" fill="black" />
      <rect x="42" y="76" width="6" height="14" fill="black" />
      <rect x="54" y="76" width="10" height="8" fill="black" />
      <rect x="68" y="76" width="8" height="14" fill="black" />
      <rect x="82" y="80" width="8" height="10" fill="black" />
      <rect x="60" y="88" width="6" height="6" fill="black" />
    </svg>
  );
};

export const TableQRGrid: React.FC<TableQRGridProps> = ({
  tables,
  onSelectTable,
  onPrintTableQR,
}) => {
  return (
    <div className="w-full bg-black rounded-xl border border-white/10 p-5 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div>
          <h2 className="text-white text-lg sm:text-xl font-semibold font-['Inter'] leading-6">
            Table QR Status
          </h2>
          <p className="text-zinc-500 text-sm font-normal font-['Inter'] mt-0.5">
            Click any table to preview, regenerate, or print its custom QR stand
          </p>
        </div>
        <span className="text-sm text-amber-500 font-medium px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          {tables.length} Tables Connected
        </span>
      </div>

      {/* Grid of Table Cards matching Figma */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => onSelectTable(table)}
            className="group relative bg-black rounded-xl border border-white/10 p-4 flex flex-col items-center justify-between text-center hover:border-amber-500/80 hover:bg-zinc-950 transition-all duration-200 cursor-pointer shadow-sm"
          >
            {/* QR Visual Box */}
            <div className="w-full max-w-[130px] aspect-square bg-zinc-950 rounded-md p-3 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-200 border border-white/5">
              <QRCodeGraphic size={76} />

              {/* Hover Quick Action Badge */}
              <div className="absolute inset-0 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> View
                </span>
              </div>
            </div>

            {/* Table Meta */}
            <div className="mt-3 flex flex-col items-center">
              <h3 className="text-white text-lg font-semibold font-['Inter'] leading-6 group-hover:text-yellow-400 transition-colors">
                {table.tableNumber}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm font-normal font-['Inter'] leading-4">
                {table.seats} seats · {table.area}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-zinc-400">
                  {table.language} · {table.scansToday} scans
                </span>
              </div>
            </div>

            {/* Print Action button */}
            {onPrintTableQR && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrintTableQR(table);
                }}
                className="mt-2.5 p-1 text-zinc-500 hover:text-white rounded transition-colors"
                title="Print table QR sticker"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
