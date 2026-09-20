'use client';

import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { EscalationTicket } from '../../types';
import { toast } from 'sonner';

export interface ReviewEscalationModalProps {
  ticket: EscalationTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, amount: string) => void;
  onForwardRM: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function ReviewEscalationModal({
  ticket,
  isOpen,
  onClose,
  onApprove,
  onForwardRM,
  onDismiss,
}: ReviewEscalationModalProps) {
  const [compAmount, setCompAmount] = useState(ticket?.amount || '$18.00');
  const [resolutionMemo, setResolutionMemo] = useState('');

  React.useEffect(() => {
    if (ticket?.amount) {
      setCompAmount(ticket.amount);
    }
  }, [ticket]);

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

  if (!isOpen || !ticket) return null;

  const handleAuthorize = () => {
    onApprove(ticket.id, compAmount);
    if (resolutionMemo.trim()) {
      toast.info(`Memo recorded: "${resolutionMemo}"`);
    }
    onClose();
  };

  const handleForward = () => {
    onForwardRM(ticket.id);
    onClose();
  };

  const handleDismissTicket = () => {
    onDismiss(ticket.id);
    onClose();
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[590px] p-4 sm:p-5 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col justify-start items-start gap-3.5 shadow-2xl text-white font-['Inter'] max-h-[92vh] overflow-y-auto custom-scrollbar relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="px-2.5 py-1 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
                <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-[10px]">
                  {ticket.sourceType} Escalation
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-sm sm:text-base font-normal font-['Inter'] leading-4">
                <Clock className="size-3.5 text-neutral-400" />
                <span>{ticket.timeAgo}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-6 rounded-[3px] outline outline-1 outline-offset-[-1px] outline-white/10 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="text-white text-base font-normal font-['Inter']">
            {ticket.title}
          </div>
        </div>

        {/* 3 Meta Info Boxes */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="h-14 p-2.5 bg-stone-950 rounded-[10px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-500 flex flex-col justify-center items-start gap-0.5">
            <div className="text-white text-xs sm:text-sm font-normal font-['Inter'] leading-4">
              Originator
            </div>
            <div className="text-neutral-400 text-xs font-normal font-['Poppins'] leading-4 truncate w-full">
              {ticket.flaggedBy}
            </div>
          </div>

          <div className="h-14 p-2.5 bg-stone-950 rounded-[10px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-500 flex flex-col justify-center items-start gap-0.5">
            <div className="text-white text-xs sm:text-sm font-normal font-['Inter'] leading-4">
              Table / Zone
            </div>
            <div className="text-neutral-400 text-xs font-normal font-['Poppins'] leading-4 truncate w-full">
              {ticket.tableNumber || 'Table 14'} ({ticket.zone || 'Main Dining'})
            </div>
          </div>

          <div className="h-14 p-2.5 bg-stone-950 rounded-[10px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-500 flex flex-col justify-center items-start gap-0.5">
            <div className="text-white text-xs sm:text-sm font-normal font-['Inter'] leading-4">
              Current Status
            </div>
            <div className="text-yellow-400 text-xs font-normal font-['Poppins'] leading-4 truncate w-full">
              {ticket.status}
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="w-full flex flex-col justify-start items-start gap-1 py-1">
          <div className="text-white text-base font-medium font-['Inter'] leading-4">
            Narrative
          </div>
          <div className="text-neutral-400 text-sm sm:text-base font-normal font-['Poppins'] leading-relaxed">
            {ticket.description}
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleAuthorize}
            className="w-full sm:flex-1 px-3.5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-white text-sm sm:text-base font-normal font-['Inter'] rounded-lg transition-colors cursor-pointer text-center"
          >
            Approve ({compAmount})
          </button>
          <button
            type="button"
            onClick={handleForward}
            className="w-full sm:flex-1 px-3.5 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm sm:text-base font-normal font-['Inter'] rounded-lg transition-colors cursor-pointer text-center"
          >
            Forward to Elena Vance (RM)
          </button>
        </div>

        {/* Authorized Comp Amount Card */}
        <div className="w-full p-3 bg-neutral-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-white text-sm sm:text-base font-medium font-['Inter']">
              Authorized Comp Amount (&le; $25.00 limit):
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex items-center">
                <input
                  type="text"
                  value={compAmount}
                  onChange={(e) => setCompAmount(e.target.value)}
                  className="w-full bg-transparent text-neutral-300 text-sm sm:text-base font-normal font-['Inter'] focus:outline-none"
                  placeholder="$ 18.00"
                />
              </div>
              <button
                type="button"
                onClick={handleAuthorize}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-white text-sm sm:text-base font-normal font-['Inter'] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-500 cursor-pointer transition-colors"
              >
                Authorize
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-white text-sm sm:text-base font-medium font-['Inter']">
              Resolution Memo (Optional):
            </div>
            <div className="p-2 bg-black rounded-[10px] outline outline-1 outline-offset-[-1px] outline-neutral-700 flex items-center">
              <input
                type="text"
                value={resolutionMemo}
                onChange={(e) => setResolutionMemo(e.target.value)}
                placeholder="e.g. Visited table, authorized coffee pass.."
                className="w-full bg-transparent text-neutral-300 text-sm sm:text-base font-normal font-['Inter'] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Dismiss Banner */}
        <div className="w-full px-3 py-2 bg-neutral-700/40 rounded-[10px] flex justify-between items-center overflow-hidden">
          <button
            type="button"
            onClick={handleDismissTicket}
            className="text-neutral-400 hover:text-rose-400 text-sm sm:text-base font-medium font-['Inter'] transition-colors cursor-pointer"
          >
            Dismiss Alert
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-900 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-400 text-neutral-200 text-xs font-normal font-['Inter'] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewEscalationModal;
