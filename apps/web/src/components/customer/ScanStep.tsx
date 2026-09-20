"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, QrCode, Maximize2 } from "lucide-react";
const customerPageIcon = "/assets/costomerpages/customer-page-icon.svg";
const fineDiningWineTable = "/assets/costomerpages/fine-dining-wine-table.jpg";

interface ScanStepProps {
  onScanComplete: () => void;
}

export default function ScanStep({ onScanComplete }: ScanStepProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanComplete();
    }, 1000);
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans">
      {/* Background Image & Ambient Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={fineDiningWineTable}
          alt="Dining Background"
          fill
          priority
          className="object-cover object-center filter brightness-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 backdrop-blur-xs" />
        <div className="absolute top-[69px] left-[29px] w-80 h-96 bg-black/95 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex flex-col items-center text-center mt-6">
        <div className="relative w-20 h-20 mb-4 transition-transform hover:scale-105 duration-300">
          <Image
            src={customerPageIcon}
            alt="Logo"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
          />
        </div>

        <h1 className="text-4xl font-normal font-['Poppins'] leading-10 tracking-wide mb-2">
          <span className="text-orange-400">SCAN</span>{" "}
          <span className="text-white">TO BEGIN</span>
        </h1>

        <p className="text-white text-base font-normal font-['Montserrat'] leading-5 tracking-wide max-w-[270px]">
          Scan the QR code available on your table to continue
        </p>
      </div>

      {/* QR Scanner Frame Box */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <button
          onClick={handleScan}
          className="group relative w-56 h-56 rounded-xl bg-neutral-900/70 backdrop-blur-md border-2 border-orange-400 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] active:scale-98"
        >
          {/* Corner Frame Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-400" />

          {/* Animated Scanning Line */}
          <div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_12px_#fb923c] animate-pulse top-1/2" />

          <div className="relative w-40 h-40 bg-black/90 rounded-lg p-3 flex items-center justify-center border border-stone-800">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-orange-400 fill-current"
            >
              <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="12" width="14" height="14" rx="2" />
              <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="74" y="12" width="14" height="14" rx="2" />
              <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="74" width="14" height="14" rx="2" />
              <rect x="42" y="10" width="16" height="8" rx="1" />
              <rect x="42" y="24" width="8" height="16" rx="1" />
              <rect x="10" y="42" width="16" height="8" rx="1" />
              <rect x="32" y="42" width="12" height="12" rx="2" />
              <rect x="52" y="42" width="16" height="8" rx="1" />
              <rect x="74" y="42" width="16" height="12" rx="1" />
              <rect x="42" y="60" width="10" height="10" rx="1" />
              <rect x="60" y="60" width="12" height="12" rx="1" />
              <rect x="80" y="60" width="10" height="20" rx="1" />
              <rect x="42" y="78" width="18" height="12" rx="1" />
              <rect x="66" y="78" width="10" height="12" rx="1" />
            </svg>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-400 font-medium tracking-wide">
            <Maximize2 className="w-3.5 h-3.5 animate-bounce" />
            <span>{isScanning ? "Scanning Table #08..." : "Tap to Scan Code"}</span>
          </div>
        </button>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-400/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>{isScanning ? "Scanning..." : "Simulate Table Scan"}</span>
        </button>
      </div>

      {/* Footer Lock Security Note */}
      <div className="relative z-10 flex flex-col items-center text-center mb-2">
        <div className="w-6 h-6 mb-2 text-orange-400">
          <Lock className="w-5 h-5 mx-auto" />
        </div>
        <p className="text-stone-200 text-base font-normal font-['Montserrat'] leading-5 tracking-wide">
          Secure. Private. Seamless.
          <br />
          Your experience starts here.
        </p>
      </div>
    </div>
  );
}
