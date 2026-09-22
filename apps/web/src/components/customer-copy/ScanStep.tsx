"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Lock, QrCode, Camera, ExternalLink, Copy, Check, ArrowRight } from "lucide-react";
const customerPageIcon = "/assets/costomerpages/customer-page-icon.svg";
const fineDiningWineTable = "/assets/costomerpages/fine-dining-wine-table.jpg";

interface ScanStepProps {
  onScanComplete: () => void;
}

export default function ScanStep({ onScanComplete }: ScanStepProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [scannedLink, setScannedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize WebRTC Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function enableCamera() {
      try {
        if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });

          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setHasCamera(true);
          }
        }
      } catch (err) {
        console.warn("WebRTC Camera stream error:", err);
        setHasCamera(false);
      }
    }

    enableCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Continuous Native BarcodeDetector QR Code Scanner Loop
  useEffect(() => {
    if (!hasCamera) return;

    let animFrameId: number;
    let detector: any = null;

    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        // @ts-ignore
        detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      } catch (e) {
        console.warn("BarcodeDetector format error:", e);
      }
    }

    async function scanFrame() {
      if (videoRef.current && videoRef.current.readyState === 4 && detector) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue && rawValue !== scannedLink) {
              setScannedLink(rawValue);
              setIsScanning(true);
            }
          }
        } catch (e) {
          // Frame error or detection bypass
        }
      }
      animFrameId = requestAnimationFrame(scanFrame);
    }

    if (detector) {
      scanFrame();
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [hasCamera, scannedLink]);

  const handleScan = () => {
    if (isScanning && scannedLink) {
      onScanComplete();
      return;
    }
    setIsScanning(true);
    if (!scannedLink) {
      setScannedLink("https://tavonza.com/table/08");
    }
  };

  const handleCopyLink = () => {
    if (scannedLink) {
      navigator.clipboard.writeText(scannedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 overflow-hidden animate-in fade-in duration-300 font-sans h-full">
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
      <div className="relative z-10 flex flex-col items-center text-center mt-4 sm:mt-6">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 transition-transform hover:scale-105 duration-300">
          <Image
            src={customerPageIcon}
            alt="Logo"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-normal font-['Poppins'] leading-tight tracking-wide mb-1.5">
          <span className="text-orange-400">SCAN</span>{" "}
          <span className="text-white">TO BEGIN</span>
        </h1>

        <p className="text-stone-200 text-xs sm:text-sm font-normal font-['Montserrat'] leading-relaxed tracking-wide max-w-[270px]">
          Scan the QR code available on your table to continue
        </p>
      </div>

      {/* Camera Viewfinder Box & Scanned QR Result Display */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 w-full max-w-xs mx-auto">
        <div
          onClick={handleScan}
          className="group relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-black/90 border-2 border-orange-400 flex items-center justify-center p-0 transition-all duration-300 hover:shadow-[0_0_35px_rgba(251,146,60,0.5)] overflow-hidden cursor-pointer shadow-2xl"
        >
          {/* Live WebRTC Camera Video Stream */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hasCamera ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Clean Camera Loading State */}
          {!hasCamera && (
            <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-400/40 flex items-center justify-center text-orange-400 shadow-inner">
                <Camera className="w-7 h-7 animate-pulse" />
              </div>
              <span className="text-xs text-stone-300 font-medium tracking-wide">
                Accessing Camera Feed...
              </span>
            </div>
          )}

          {/* Viewfinder Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl-lg z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr-lg z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl-lg z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br-lg z-20 pointer-events-none" />

          {/* Animated Scanning Beam Line */}
          <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_14px_#fb923c] animate-pulse top-1/2 z-20 pointer-events-none" />

          {/* Live Status Badge */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-orange-400/50 flex items-center gap-1.5 text-[11px] text-orange-400 font-medium tracking-wide z-20 whitespace-nowrap shadow-md">
            <Camera className="w-3.5 h-3.5 animate-pulse" />
            <span>{scannedLink ? "QR Code Detected!" : hasCamera ? "Camera Active — Point at Table QR" : "Tap Frame to Scan"}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCANNED LINK RESULT POPUP CARD (Matching Image 2 Format) */}
        {/* ========================================================================= */}
        {scannedLink ? (
          <div className="mt-4 w-full bg-zinc-900/95 border-2 border-orange-400/90 rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                  QR Code Detected
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Scanned URL Box */}
            <div className="bg-black/80 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-200 truncate flex items-center justify-between gap-2">
              <span className="truncate text-amber-300">{scannedLink}</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            </div>

            {/* Open Link / Continue Action Button */}
            <button
              onClick={() => onScanComplete()}
              className="w-full h-11 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-black font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-400/20 active:scale-95"
            >
              <span>Open Link & Enter Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="mt-5 px-7 py-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-400/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer z-10"
          >
            <QrCode className="w-4 h-4" />
            <span>{isScanning ? "Scanning Table #08..." : "Simulate Table Scan"}</span>
          </button>
        )}
      </div>

      {/* Footer Lock Security Note */}
      <div className="relative z-10 flex flex-col items-center text-center mb-1">
        <div className="w-5 h-5 mb-1.5 text-orange-400">
          <Lock className="w-4 h-4 mx-auto" />
        </div>
        <p className="text-stone-300 text-xs font-normal font-['Montserrat'] leading-relaxed tracking-wide">
          Secure. Private. Seamless.
          <br />
          Your dining experience starts here.
        </p>
      </div>
    </div>
  );
}
