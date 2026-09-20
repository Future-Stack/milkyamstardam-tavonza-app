'use client';

import React, { useState } from 'react';
import { X, Send, Radio, Sparkles } from 'lucide-react';
import { ShiftNoteData } from '../types';
import { toast } from 'sonner';

export interface PostShiftNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNote: ShiftNoteData;
  onSaveNote: (updatedNote: ShiftNoteData) => void;
}

export function PostShiftNoteModal({
  isOpen,
  onClose,
  currentNote,
  onSaveNote,
}: PostShiftNoteModalProps) {
  const [content, setContent] = useState(currentNote.content);
  const [selectedZones, setSelectedZones] = useState<string[]>(currentNote.targetZones);
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>(currentNote.priority);

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

  if (!isOpen) return null;

  const availableZones = ['All Zones', 'Main Dining', 'Patio', 'Bar & High Tops', 'Private Room'];

  const toggleZone = (zone: string) => {
    if (zone === 'All Zones') {
      setSelectedZones(['All Zones']);
      return;
    }
    const filtered = selectedZones.filter((z) => z !== 'All Zones');
    if (filtered.includes(zone)) {
      setSelectedZones(filtered.filter((z) => z !== zone));
    } else {
      setSelectedZones([...filtered, zone]);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const updated: ShiftNoteData = {
      ...currentNote,
      content: content.trim(),
      priority,
      targetZones: selectedZones.length === 0 ? ['Main Dining'] : selectedZones,
      timestamp: 'Just now',
    };

    onSaveNote(updated);
    toast.success('Shift note broadcasted to all active server & bar handhelds!');
    onClose();
  };

  return (
    <div
      className="assistant-manager-modal-backdrop fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <Radio className="size-5" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold font-['Inter']">
                Broadcast Shift Note
              </h2>
              <p className="text-zinc-400 text-xs font-['Inter']">
                Instant heads-up push to all active servers, bussers, and bartenders.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Note Message
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type floor briefing note..."
              className="w-full p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 resize-none font-['Inter']"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Target Zones
            </label>
            <div className="flex flex-wrap gap-2">
              {availableZones.map((zone) => {
                const isSelected = selectedZones.includes(zone);
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {zone}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Alert Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'high', 'urgent'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                    priority === lvl
                      ? lvl === 'urgent'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setContent(
                  'VIP corporate guests seated at Table 04 (Apex Capital) & PR-1. Please prioritize beverage check-backs and keep course timing strictly under 15m between plates.'
                );
              }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="size-3" /> Reset to VIP default
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Send className="size-4" />
                <span>Broadcast Now</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostShiftNoteModal;
