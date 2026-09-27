'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Monitor,
  QrCode,
  Grid,
  BookOpen,
  ChefHat,
  Wine,
  Package,
  Users,
  UserCheck,
  BarChart3,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLogout } from '@/hooks/useLogout';

export const managerNavItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Live Orders', icon: ShoppingBag },
  { name: 'POS', icon: Monitor },
  { name: 'QR Ordering', icon: QrCode },
  { name: 'Tables', icon: Grid },
  { name: 'Menu', icon: BookOpen },
  { name: 'Kitchen Display', icon: ChefHat },
  { name: 'Bar Display', icon: Wine },
  { name: 'Inventory', icon: Package },
  { name: 'Staff', icon: Users },
  { name: 'Customers', icon: UserCheck },
  { name: 'Reports', icon: BarChart3 },
  { name: 'AI Insights', icon: Sparkles },
  { name: 'Notifications', icon: Bell },
];

interface SidebarProps {
  activeNav?: string;
  setActiveNav?: (nav: string) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav = 'Dashboard',
  setActiveNav,
  sidebarOpen = false,
  setSidebarOpen,
}) => {
  const [internalActive, setInternalActive] = React.useState(activeNav);
  const [internalOpen, setInternalOpen] = React.useState(sidebarOpen);

  const currentNav = setActiveNav ? activeNav : internalActive;
  const isOpen = setSidebarOpen ? sidebarOpen : internalOpen;

  const handleNavClick = (name: string) => {
    if (setActiveNav) {
      setActiveNav(name);
    } else {
      setInternalActive(name);
    }
    if (setSidebarOpen) {
      setSidebarOpen(false);
    } else {
      setInternalOpen(false);
    }
  };

  const { handleLogout } = useLogout();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => (setSidebarOpen ? setSidebarOpen(false) : setInternalOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-black border-r border-white/10 shadow-[0px_0px_10.8px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 z-50 select-none font-['Inter'] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Bar & Navigation Links */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-20 px-6 border-b border-white/20 flex items-center justify-between shrink-0">
            <Link
              href="/manager-dashboard"
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('Dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-white/40 text-xs uppercase font-normal font-['Inter'] tracking-wider leading-3">
                  AI Hospitality
                </span>
                <span className="text-white text-lg font-bold font-['Inter'] leading-5">
                  Tavonza
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => (setSidebarOpen ? setSidebarOpen(false) : setInternalOpen(false))}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {managerNavItems.map((item) => {
              const isActive =
                currentNav.toLowerCase() === item.name.toLowerCase();
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleNavClick(item.name)}
                  className={`w-full h-9 px-3 py-2 rounded-lg flex items-center gap-3 text-base font-['Inter'] transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Settings & Logout */}
        <div className="p-4 border-t border-white/20 space-y-1 bg-black shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('Settings')}
            className={`w-full h-10 px-3 py-2.5 rounded-lg flex items-center gap-3 text-base font-['Inter'] transition-colors cursor-pointer ${
              currentNav.toLowerCase() === 'settings'
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
            className="w-full h-10 px-3 py-2.5 rounded-lg flex items-center gap-3 text-base font-['Inter'] text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
