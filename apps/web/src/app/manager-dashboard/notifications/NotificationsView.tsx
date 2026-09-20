'use client';

import React, { useState } from 'react';
import {
  NotificationsHeader,
  NotificationCard,
  NotificationSettingsModal,
} from './components';
import { initialManagerNotifications } from '../data';
import { ManagerNotificationItem } from '../types';
import { toast } from 'sonner';
import { BellOff, Search } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<ManagerNotificationItem[]>(
    initialManagerNotifications
  );
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'unread' | 'urgent' | 'table' | 'kitchen' | 'inventory' | 'staff'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false, isNew: false }))
    );
    toast.success('All operational notifications marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isUnread: !n.isUnread, isNew: false } : n
      )
    );
  };

  const handleDelete = (id: string) => {
    const item = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success(`Notification removed: "${item?.title || ''}"`);
  };

  const filteredNotifications = notifications.filter((item) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'unread'
        ? item.isUnread
        : activeFilter === 'urgent'
        ? item.severity === 'urgent' || item.severity === 'warning'
        : item.category === activeFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Notifications Header matching Figma */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-white/5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'urgent', label: 'Urgent' },
              { id: 'table', label: 'Tables' },
              { id: 'kitchen', label: 'Kitchen' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'staff', label: 'Staff' },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium font-['Inter'] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Filter Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-zinc-950/80 border border-white/10 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 font-['Inter']"
          />
        </div>
      </div>

      {/* 3. Notifications List matching Figma cards layout */}
      {filteredNotifications.length === 0 ? (
        <div className="w-full py-16 px-6 bg-white/5 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BellOff className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white text-base font-semibold font-['Inter']">No notifications</h3>
            <p className="text-zinc-500 text-sm max-w-sm font-['Inter']">
              You are all caught up! No active system alerts match your current filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 w-full">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 4. Settings Preferences Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export const ManagerNotificationsView = NotificationsView;
export default NotificationsView;
