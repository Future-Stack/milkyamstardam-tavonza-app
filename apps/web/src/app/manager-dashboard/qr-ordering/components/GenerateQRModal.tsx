'use client';

import React, { useState } from 'react';
import { X, QrCode, Sparkles, ChevronDown } from 'lucide-react';
import { TableQRItem } from '../../types';

interface GenerateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableQRItem[];
  onGenerate: (selectedTable: string, language: string, style: string) => void;
}

export const GenerateQRModal: React.FC<GenerateQRModalProps> = ({
  isOpen,
  onClose,
  tables,
  onGenerate,
}) => {
  const [selectedTable, setSelectedTable] = useState('ALL');
  const [language, setLanguage] = useState('ALL');
  const [qrStyle, setQrStyle] = useState('ALL');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(selectedTable, language, qrStyle);
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
        {/* Header matching Screenshot 3 */}
        <div className="flex items-start justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-slate-200 text-base font-bold font-['Plus_Jakarta_Sans'] leading-5">
              Generate QR Code
            </h3>
            <p className="text-slate-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4 mt-0.5">
              Create a QR code for contactless table ordering
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-500 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Table Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Table
            </label>
            <div className="relative">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-xs font-normal uppercase tracking-wide appearance-none focus:outline-yellow-500 cursor-pointer"
              >
                <option value="ALL">ALL TABLES</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    {t.tableNumber} · {t.area}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Menu Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              Menu Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-xs font-normal uppercase tracking-wide appearance-none focus:outline-yellow-500 cursor-pointer"
              >
                <option value="ALL">ALL (MULTI-LANGUAGE AUTO)</option>
                <option value="English">English</option>
                <option value="Dutch">Dutch (Nederlands)</option>
                <option value="German">German (Deutsch)</option>
                <option value="French">French (Français)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* QR Style */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] uppercase tracking-wide">
              QR Style
            </label>
            <div className="relative">
              <select
                value={qrStyle}
                onChange={(e) => setQrStyle(e.target.value)}
                className="w-full h-8 px-2.5 bg-black/40 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-white/20 text-white text-xs font-normal uppercase tracking-wide appearance-none focus:outline-yellow-500 cursor-pointer"
              >
                <option value="ALL">STANDARD STYLE</option>
                <option value="Gold Accent">BRAND GOLD ACCENT</option>
                <option value="Minimalist Dark">MINIMALIST DARK</option>
                <option value="Table Stand Framed">TABLE STAND FRAMED</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* AI Auto-Translate Notice matching Screenshot 3 */}
          <div className="p-2.5 bg-blue-500/10 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-blue-500/25 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <p className="text-white text-sm font-normal font-['Plus_Jakarta_Sans'] leading-4">
              AI will auto-translate the menu to{' '}
              <strong className="text-white font-bold">
                {language === 'ALL' ? 'English' : language}
              </strong>{' '}
              for this table.
            </p>
          </div>

          {/* Action Button: Generate QR Code */}
          <button
            type="submit"
            className="w-full h-9 mt-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] rounded-[5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99]"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generate QR Code</span>
          </button>
        </form>
      </div>
    </div>
  );
};
