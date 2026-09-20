'use client';

import React, { useState } from 'react';
import { X, RefreshCw, Download, Check } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeGraphic } from './TableQRGrid';

interface QRPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  language: string;
  style: string;
  onRegenerate: () => void;
}

export const QRPreviewModal: React.FC<QRPreviewModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
  language,
  style,
  onRegenerate,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    toast.success(`Downloaded QR Code stand for ${tableNumber} (${language})`);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 lg:left-72 top-20 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-xs sm:max-w-sm bg-black border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screenshot 4 */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Generate QR Code
            </h3>
            <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Create a QR code for contactless table ordering
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center QR Code Container matching Screenshot 4 */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="w-48 h-48 bg-neutral-800/80 rounded-2xl p-5 flex items-center justify-center border border-white/5 shadow-inner">
            <QRCodeGraphic size={140} />
          </div>

          <h4 className="text-white text-lg font-bold font-['Plus_Jakarta_Sans'] mt-3.5">
            {tableNumber} · {language}
          </h4>
          <p className="text-slate-400 text-sm font-normal font-['Plus_Jakarta_Sans'] mt-0.5">
            {style === 'ALL' ? 'Standard' : style} style · Ready to print
          </p>
        </div>

        {/* Action Buttons: Regenerate & Download PNG */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onRegenerate}
            className="h-9 px-3 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-slate-200 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-9 px-3 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
