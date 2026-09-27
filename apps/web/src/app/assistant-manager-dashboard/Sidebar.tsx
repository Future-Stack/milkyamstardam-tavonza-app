'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  Bell,
  Sparkles,
  Users,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/hooks/useLogout';

export interface AssistantManagerSidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const assistantManagerNavItems = [
  { name: 'Floor', icon: LayoutGrid, count: '16' },
  { name: 'Alerts', icon: Bell, count: '6', badgeColor: 'bg-red-500/20 text-red-400' },
  { name: 'Jarvis', icon: Sparkles, isAI: true },
  // { name: 'Staff', icon: Users, count: '8' },
  { name: 'Profile', icon: User },
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  sidebarOpen,
  setSidebarOpen,
}: AssistantManagerSidebarProps) {
  const { handleLogout } = useLogout();
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-backdrop fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-black border-r border-white/20 shadow-[0px_0px_10.8px_0px_rgba(255,255,255,0.40)] flex flex-col lg:sticky lg:top-0 lg:translate-x-0 flex-shrink-0 select-none transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-white/20 flex items-center justify-between shrink-0 bg-black">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0 group-hover:border-amber-500/50 transition-colors shadow-inner">
              <img
                src="/assets/costomerpages/customer-page-icon.svg"
                alt="Tavonza Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/icon.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] uppercase font-normal font-['Inter'] tracking-wider leading-3">
                AI Hospitality
              </span>
              <span className="text-white text-base font-bold font-['Inter'] leading-5">
                Tavonza
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {assistantManagerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setActiveNav(item.name);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full h-9 px-3 py-2 rounded-lg flex items-center justify-between text-base font-['Inter'] transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.count && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-zinc-700 text-zinc-300'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.isAI && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded">
                      AI
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer: Settings & Logout */}
        <div className="p-4 border-t border-white/20 space-y-1 bg-black shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveNav('Settings');
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
            className={`w-full h-10 px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-['Inter'] transition-colors cursor-pointer ${
              activeNav === 'Settings'
                ? 'bg-zinc-800 text-white font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-10 px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-['Inter'] text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
