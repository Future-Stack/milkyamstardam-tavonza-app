'use client';

import React, { useState } from 'react';
import { X, Send, UserCheck, ShieldAlert, Check } from 'lucide-react';
import { FloorTable } from '../types';
import { toast } from 'sonner';

export interface TableDetailModalProps {
  table: FloorTable | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkReady: (tableId: string) => void;
}

type ModalTab = 'Live Ticket' | 'Comp & Escalation' | 'Floor Assignment';

export function TableDetailModal({
  table,
  isOpen,
  onClose,
  onMarkReady,
}: TableDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('Live Ticket');
  const [expediteMessage, setExpediteMessage] = useState('');
  const [selectedComp, setSelectedComp] = useState<number | null>(null);
  const [assignedServer, setAssignedServer] = useState('');

  // Default table fallbacks
  const displayTableNumber = table ? table.tableNumber : 'Table T-01';
  const displayZone = table ? table.zone : 'Main Dining';

  React.useEffect(() => {
    if (table) {
      setExpediteMessage(`Please expedite mains for table ${table.tableNumber.replace('Table- ', 'T-')}`);
      setAssignedServer(table.serverName);
    } else {
      setExpediteMessage('Please expedite mains for table T-01');
    }
  }, [table]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !table) return null;

  const handlePingKitchen = () => {
    if (!expediteMessage.trim()) return;
    toast.success(`Expedite ping sent to Kitchen Pass: "${expediteMessage}"`);
  };

  const handleApplyComp = (percent: number) => {
    setSelectedComp(percent);
    toast.success(`${percent}% courtesy discount applied to ${displayTableNumber} (AM Authorized).`);
  };

  const handleReassignServer = (server: string) => {
    setAssignedServer(server);
    toast.success(`${displayTableNumber} reassigned to server ${server}.`);
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[660px] p-5 bg-zinc-900 rounded-[10px] flex flex-col justify-start items-start gap-4 shadow-2xl border border-zinc-800 text-white font-['Inter'] max-h-[92vh] overflow-y-auto custom-scrollbar relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Row */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-medium font-['Inter']">
                {table.tableNumber.replace('Table- 0', 'Table T-0')}
              </span>
              <div className="px-2.5 py-0.5 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
                <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-[10px]">
                  {displayZone}
                </span>
              </div>
            </div>

            {/* Close icon */}
            <button
              type="button"
              onClick={onClose}
              className="size-6 rounded-[3px] outline outline-1 outline-offset-[-1px] outline-white/10 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="w-full h-px bg-zinc-600/60" />

          {/* Modal Tab Switcher */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('Live Ticket')}
              className={`h-8 px-3 rounded-[5px] text-base font-normal font-['Inter'] leading-4 flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Live Ticket'
                  ? 'bg-yellow-400 text-white font-medium'
                  : 'bg-neutral-800 text-zinc-400 hover:text-white'
              }`}
            >
              Live Ticket
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Comp & Escalation')}
              className={`h-8 px-3 rounded-[5px] text-base font-normal font-['Inter'] leading-4 flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Comp & Escalation'
                  ? 'bg-yellow-400 text-white font-medium'
                  : 'bg-neutral-800 text-zinc-400 hover:text-white'
              }`}
            >
              Comp &amp; Escalation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Floor Assignment')}
              className={`h-8 px-3 rounded-[5px] text-base font-normal font-['Inter'] leading-4 flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Floor Assignment'
                  ? 'bg-yellow-400 text-white font-medium'
                  : 'bg-neutral-800 text-zinc-400 hover:text-white'
              }`}
            >
              Floor Assignment
            </button>
          </div>
        </div>

        {/* Tab 1: Live Ticket View */}
        {activeTab === 'Live Ticket' && (
          <div className="w-full flex flex-col gap-4">
            {/* Order Meta */}
            <div className="w-full flex justify-between items-center text-base font-medium font-['Inter'] leading-5 text-white">
              <span>Order ID: ORD-8901</span>
              <span>Course: Mains</span>
            </div>

            {/* Ticket Items Card */}
            <div className="w-full p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-500 flex flex-col gap-3">
              <div className="w-full flex justify-between items-center text-white text-base font-normal font-['Inter']">
                <span>1x Truffle Tagliatelle</span>
                <span>$32.00</span>
              </div>
              <div className="w-full flex justify-between items-center text-white text-base font-normal font-['Inter']">
                <span>1x Pan-Seared Sea Bass</span>
                <span>$38.50</span>
              </div>
              <div className="w-full flex justify-between items-center text-white text-base font-normal font-['Inter']">
                <span>1x San Pellegrino 750ml</span>
                <span>$8.00</span>
              </div>
            </div>

            {/* Subtotal & Tax Card */}
            <div className="w-full p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-500 flex flex-col gap-1.5">
              <div className="w-full flex justify-between items-center text-neutral-400 text-base font-normal font-['Inter']">
                <span>Subtotal</span>
                <span>Total with Tax</span>
              </div>
              <div className="w-full flex justify-between items-center text-white text-base font-medium font-['Inter']">
                <span>$78.50</span>
                <span>$92.63</span>
              </div>
            </div>

            {/* Expedite Ping to Kitchen Card */}
            <div className="w-full p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-500 flex flex-col gap-2">
              <div className="text-white text-base font-medium font-['Inter']">
                Expedite Ping to Kitchen
              </div>
              <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={expediteMessage}
                  onChange={(e) => setExpediteMessage(e.target.value)}
                  className="flex-1 p-2.5 bg-black rounded-[10px] outline outline-1 outline-neutral-700 text-neutral-300 text-base font-normal font-['Inter'] focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handlePingKitchen}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-white text-base font-normal font-['Inter'] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-500 flex items-center justify-center cursor-pointer transition-colors"
                >
                  Ping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Comp & Escalation View */}
        {activeTab === 'Comp & Escalation' && (
          <div className="w-full space-y-4 py-2">
            <div className="p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-neutral-500 space-y-3">
              <div className="text-white text-base font-medium font-['Inter'] flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-400" />
                Assistant Manager Courtesy Comp Authority
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed font-['Inter']">
                Apply courtesy discount for kitchen delays (18m behind ticket) on {displayTableNumber}. Void limit: up to $150.00 without RM secondary pin.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[10, 20, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyComp(pct)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                      selectedComp === pct
                        ? 'bg-amber-400 text-white border-amber-400 font-semibold'
                        : 'bg-black text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    Comp {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-neutral-500 flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium font-['Inter']">Manager Table Visit</div>
                <div className="text-zinc-400 text-xs font-['Inter']">Mark that Marcus has visited the table in person</div>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Table check-in logged by Marcus (AM).')}
                className="px-3 py-1.5 bg-amber-400 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Log Check-in
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Floor Assignment View */}
        {activeTab === 'Floor Assignment' && (
          <div className="w-full space-y-4 py-2">
            <div className="p-3.5 bg-stone-900 rounded-[10px] outline outline-1 outline-neutral-500 space-y-3">
              <div className="text-white text-base font-medium font-['Inter'] flex items-center gap-2">
                <UserCheck className="size-4 text-emerald-400" />
                Current Server: <span className="text-yellow-400">{assignedServer}</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed font-['Inter']">
                Reassign this table to balance floor load during rush peak.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {['Maya Patel', 'Liam Carter', 'Chloe Bennett', 'Julian Vance'].map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => handleReassignServer(srv)}
                    className={`p-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center justify-between ${
                      assignedServer === srv
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-black text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{srv}</span>
                    {assignedServer === srv && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableDetailModal;
