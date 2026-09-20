'use client';

import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { ManagerNotificationItem } from '../../types';

interface NotificationCardProps {
  notification: ManagerNotificationItem;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onToggleRead,
  onDelete,
}) => {
  const isUnread = notification.isUnread;

  // Dot styling based on severity and read status
  const renderDot = () => {
    if (!isUnread) {
      return <div className="w-2 h-2 rounded-full border border-zinc-600 shrink-0" />;
    }
    switch (notification.severity) {
      case 'urgent':
        return <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.7)] shrink-0" />;
      case 'warning':
        return <div className="w-2 h-2 bg-amber-600 rounded-full shadow-[0_0_6px_rgba(217,119,6,0.7)] shrink-0" />;
      case 'caution':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_6px_rgba(234,179,8,0.7)] shrink-0" />;
      case 'info':
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.7)] shrink-0" />;
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-800 backdrop-blur-[10.20px] flex items-start justify-between gap-4 transition-all duration-200 group ${
        isUnread ? 'bg-white/5 hover:bg-white/[0.08]' : 'bg-zinc-500/5 hover:bg-white/[0.04]'
      }`}
    >
      {/* Content Column */}
      <div className="flex-1 flex flex-col justify-start items-start">
        {/* Header Line: Dot + Title + NEW Badge */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="pt-0.5 flex items-center justify-center">
              {renderDot()}
            </div>
            <h3
              onClick={() => onToggleRead(notification.id)}
              className={`text-sm font-bold font-['Inter'] leading-5 cursor-pointer ${
                isUnread ? 'text-neutral-50' : 'text-neutral-300'
              }`}
            >
              {notification.title}
            </h3>
            {isUnread && (
              <div className="px-1.5 py-0.5 bg-amber-500/20 rounded-sm">
                <span className="text-amber-500 text-[10px] font-medium font-sans leading-3">
                  NEW
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description Line */}
        <div className="pt-1">
          <p className="text-zinc-500 text-sm font-normal font-['Inter'] leading-5">
            {notification.description}
          </p>
        </div>

        {/* Timestamp */}
        <div className="pt-2 flex items-center gap-3">
          <span className="text-zinc-600 text-sm font-normal font-mono leading-4">
            {notification.timestamp}
          </span>
        </div>
      </div>

      {/* Hover Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => onToggleRead(notification.id)}
          title={isUnread ? 'Mark as read' : 'Mark as unread'}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isUnread ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Circle className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          title="Dismiss notification"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
