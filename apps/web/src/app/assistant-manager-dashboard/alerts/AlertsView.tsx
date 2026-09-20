'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { mockEscalationTickets } from '../data';
import { EscalationTicket, EscalationQueueTab, EscalationDepartment } from '../types';
import { AlertCard } from './components/AlertCard';
import { ReviewEscalationModal } from './components/ReviewEscalationModal';
import { toast } from 'sonner';

const queueTabs: EscalationQueueTab[] = ['Pending Action', 'Forwarded to RM', 'Resolved'];
const departmentPills: EscalationDepartment[] = [
  'All',
  'Waiters',
  'Kitchen & KDS',
  'Cashier',
  'Host',
  'Ready',
];

export function AlertsView() {
  const [tickets, setTickets] = useState<EscalationTicket[]>(mockEscalationTickets);
  const [activeQueueTab, setActiveQueueTab] = useState<EscalationQueueTab>('Pending Action');
  const [activeDepartment, setActiveDepartment] = useState<EscalationDepartment>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketForReview, setSelectedTicketForReview] = useState<EscalationTicket | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Tab matching
      if (t.status !== activeQueueTab) {
        return false;
      }

      // Department matching
      if (activeDepartment !== 'All' && t.department !== activeDepartment) {
        return false;
      }

      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesFlagged = t.flaggedBy.toLowerCase().includes(q);
        const matchesTable = t.tableNumber?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesDesc && !matchesFlagged && !matchesTable) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, activeQueueTab, activeDepartment, searchQuery]);

  const handleApprove = (id: string, amount: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    toast.success(`Approved ${amount} courtesy adjustment (Authorized by AM Marcus).`);
  };

  const handleForwardRM = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Forwarded to RM' } : t))
    );
    toast.info('Ticket escalated and forwarded to Restaurant Manager Elena Vance.');
  };

  const handleDismiss = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    toast.success('Alert dismissed from escalations queue.');
  };

  const handleViewTicket = (ticket: EscalationTicket) => {
    setSelectedTicketForReview(ticket);
  };

  return (
    <div className="w-full space-y-5 font-['Inter']">
      {/* Title & Subtitle Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-xl font-medium font-['Inter']">
            Escalations Queue
          </h1>
          <div className="h-5 px-2.5 py-1 bg-green-500/5 rounded-[5px] outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-700 flex items-center">
            <span className="text-emerald-500 text-xs font-normal font-['Inter'] leading-[10px]">
              2 bussing
            </span>
          </div>
        </div>
        <p className="text-neutral-500 text-sm font-normal font-['Poppins'] leading-relaxed">
          Frontline floor tickets from Waiters, Kitchen, Cashiers, and Host staff at Downtown Promenade.
        </p>
      </div>

      {/* Top Tab Segmented Control */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex h-9 items-center border border-white/20 rounded-lg overflow-hidden flex-nowrap">
          {queueTabs.map((tab, idx) => {
            const isActive = activeQueueTab === tab;
            const isFirst = idx === 0;
            const isLast = idx === queueTabs.length - 1;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveQueueTab(tab)}
                className={`h-9 px-4 text-sm font-medium font-['Inter'] leading-6 transition-colors cursor-pointer whitespace-nowrap ${
                  idx !== 0 ? 'border-l border-white/20' : ''
                } ${
                  isActive
                    ? 'bg-yellow-500 text-white font-medium'
                    : 'bg-black text-neutral-400 hover:text-white hover:bg-zinc-900'
                } ${isFirst ? 'rounded-l-lg' : ''} ${isLast ? 'rounded-r-lg' : ''}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full h-10 px-4 bg-zinc-900/50 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-800 flex items-center gap-3.5">
        <Search className="size-4 text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Table,server..."
          className="w-full bg-transparent text-white placeholder-zinc-500 text-sm font-normal font-['Inter'] focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Department Filter Pills */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-nowrap py-1">
          {departmentPills.map((dep) => {
            const isActive = activeDepartment === dep;
            return (
              <button
                key={dep}
                type="button"
                onClick={() => setActiveDepartment(dep)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium font-['Inter'] leading-4 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white font-medium shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:text-zinc-200 hover:bg-neutral-700'
                }`}
              >
                {dep}
              </button>
            );
          })}
        </div>
      </div>

      {/* Escalation Cards List */}
      <div className="space-y-4 pt-1">
        {filteredTickets.map((ticket) => (
          <AlertCard
            key={ticket.id}
            ticket={ticket}
            onReviewDetails={(t) => setSelectedTicketForReview(t)}
            onApprove={handleApprove}
            onDismiss={handleDismiss}
            onViewTicket={handleViewTicket}
          />
        ))}

        {filteredTickets.length === 0 && (
          <div className="p-12 text-center bg-neutral-900/40 rounded-xl border border-zinc-800 text-neutral-500 text-sm">
            No tickets found in {activeQueueTab} for {activeDepartment}.
          </div>
        )}
      </div>

      {/* Escalation Review Details Modal */}
      <ReviewEscalationModal
        ticket={selectedTicketForReview}
        isOpen={Boolean(selectedTicketForReview)}
        onClose={() => setSelectedTicketForReview(null)}
        onApprove={handleApprove}
        onForwardRM={handleForwardRM}
        onDismiss={handleDismiss}
      />
    </div>
  );
}

export default AlertsView;
