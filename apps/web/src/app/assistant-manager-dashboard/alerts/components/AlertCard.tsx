'use client';

import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { EscalationTicket } from '../../types';

export interface AlertCardProps {
  ticket: EscalationTicket;
  onReviewDetails: (ticket: EscalationTicket) => void;
  onApprove: (id: string, amount: string) => void;
  onDismiss: (id: string) => void;
  onViewTicket: (ticket: EscalationTicket) => void;
}

export function AlertCard({
  ticket,
  onReviewDetails,
  onApprove,
  onDismiss,
  onViewTicket,
}: AlertCardProps) {
  return (
    <div className="w-full p-4 sm:p-5 bg-neutral-900 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-stone-500/60 flex flex-col justify-between gap-5 transition-colors hover:outline-stone-400">
      {/* Top Header Row */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-2.5 py-1 bg-white/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
              <span className="text-stone-300 text-xs font-normal font-['Inter'] leading-[10px]">
                {ticket.sourceType}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white text-sm font-normal font-['Inter'] leading-4">
              <Clock className="size-3.5 text-neutral-400" />
              <span>{ticket.timeAgo}</span>
            </div>

            <span className="text-white text-base font-semibold font-['Inter']">
              {ticket.title}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewTicket(ticket)}
            className="flex items-center gap-1 text-stone-300 hover:text-white text-xs sm:text-sm font-medium font-['Inter'] underline leading-[10px] cursor-pointer"
          >
            <FileText className="size-3.5" />
            <span>View Ticket</span>
          </button>
        </div>

        {/* Narrative Description */}
        <p className="text-stone-300 text-sm font-normal font-['Inter'] leading-relaxed max-w-4xl">
          {ticket.description}
        </p>

        {/* Meta Flagged & Amount Row */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-normal font-['Inter'] flex-wrap pt-1">
          <div>
            <span className="text-neutral-400">Flagged: </span>
            <span className="text-stone-300">{ticket.flaggedBy}</span>
          </div>
          {ticket.amount && (
            <div>
              <span className="text-neutral-400">Amount: </span>
              <span className="text-amber-400 font-semibold">{ticket.amount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-800/80" />

      {/* Action Buttons Row */}
      <div className="w-full flex items-center justify-end gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={() => onReviewDetails(ticket)}
          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex justify-center items-center cursor-pointer transition-colors border border-white/5"
        >
          <span className="text-center text-zinc-300 text-xs sm:text-sm font-medium font-['Inter']">
            Review Details
          </span>
        </button>

        {ticket.amount && (
          <button
            type="button"
            onClick={() => onApprove(ticket.id, ticket.amount || '$18.00')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-white rounded-lg flex justify-center items-center cursor-pointer transition-colors font-medium shadow-sm"
          >
            <span className="text-center text-white text-xs sm:text-sm font-semibold font-['Inter']">
              Approve ({ticket.amount})
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDismiss(ticket.id)}
          className="px-3.5 py-2 bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-lg flex justify-center items-center cursor-pointer transition-colors border border-white/5"
        >
          <span className="text-center text-xs sm:text-sm font-medium font-['Inter']">
            Dismiss
          </span>
        </button>
      </div>
    </div>
  );
}

export default AlertCard;
