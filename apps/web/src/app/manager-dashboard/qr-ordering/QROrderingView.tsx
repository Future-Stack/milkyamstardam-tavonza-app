'use client';

import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { toast } from 'sonner';
import {
  initialQRStats,
  initialTableQRCodes,
  initialQRHourlyScans,
  initialQRSettings,
} from '../data';
import { TableQRItem, QRSettingsState } from '../types';
import {
  QRStatsKPIs,
  TableQRGrid,
  QRScanActivityChart,
  QRSettingsCard,
  GenerateQRModal,
  QRPreviewModal,
} from './components';

export const QROrderingView: React.FC = () => {
  const [stats] = useState(initialQRStats);
  const [tables] = useState<TableQRItem[]>(initialTableQRCodes);
  const [hourlyScans] = useState(initialQRHourlyScans);
  const [settings, setSettings] = useState<QRSettingsState>(initialQRSettings);

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activePreviewTable, setActivePreviewTable] = useState<{
    tableNumber: string;
    language: string;
    style: string;
  }>({
    tableNumber: 'T-01',
    language: 'English',
    style: 'Standard',
  });

  const handleSelectTable = (table: TableQRItem) => {
    setActivePreviewTable({
      tableNumber: table.tableNumber,
      language: table.language,
      style: 'Standard',
    });
    setIsPreviewModalOpen(true);
  };

  const handlePrintTableQR = (table: TableQRItem) => {
    toast.success(`Printing QR table stand for ${table.tableNumber}...`);
  };

  const handleGenerateQR = (
    selectedTable: string,
    language: string,
    qrStyle: string
  ) => {
    setIsGenerateModalOpen(false);
    setActivePreviewTable({
      tableNumber: selectedTable === 'ALL' ? 'T-01' : selectedTable,
      language: language === 'ALL' ? 'English' : language,
      style: qrStyle === 'ALL' ? 'Standard' : qrStyle,
    });
    setIsPreviewModalOpen(true);
    toast.success(
      `Generated new QR code for ${
        selectedTable === 'ALL' ? 'All Tables' : selectedTable
      }!`
    );
  };

  const handleRegenerate = () => {
    toast.info(`Regenerated cryptographic token for ${activePreviewTable.tableNumber}`);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header Section (Matching Figma: Title, Subtitle, and Action Button) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            QR Ordering
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Manage QR codes for contactless table ordering
          </p>
        </div>

        {/* Action Button: Generate QR Code */}
        <button
          type="button"
          onClick={() => setIsGenerateModalOpen(true)}
          className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-white text-sm sm:text-base font-semibold font-['Plus_Jakarta_Sans'] rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 active:scale-[0.99] self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4" />
          <span>Generate QR Code</span>
        </button>
      </div>

      {/* Row 1: KPI Stats Cards (Active QR Codes, Scans Today, Orders via QR, Avg. Order Value) */}
      <QRStatsKPIs stats={stats} />

      {/* Row 2: Table QR Status Grid */}
      <TableQRGrid
        tables={tables}
        onSelectTable={handleSelectTable}
        onPrintTableQR={handlePrintTableQR}
      />

      {/* Row 3: Scan Activity Chart & Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-stretch">
        {/* Left 2 Cols: Hourly Scan Chart */}
        <div className="xl:col-span-2 flex">
          <QRScanActivityChart data={hourlyScans} />
        </div>

        {/* Right 1 Col: Live Settings Card */}
        <div className="flex">
          <QRSettingsCard
            settings={settings}
            onUpdateSettings={setSettings}
          />
        </div>
      </div>

      {/* Generate QR Modal (Screenshot 3) */}
      <GenerateQRModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        tables={tables}
        onGenerate={handleGenerateQR}
      />

      {/* QR Preview & Download Modal (Screenshot 4) */}
      <QRPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        tableNumber={activePreviewTable.tableNumber}
        language={activePreviewTable.language}
        style={activePreviewTable.style}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
};

export const ManagerQROrderingView = QROrderingView;
export default QROrderingView;
