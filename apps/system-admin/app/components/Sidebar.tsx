"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building, ShieldCheck, Settings, Menu, X } from "lucide-react";
import logo from "../../public/logo.png";
import Image from "next/image";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Health", href: "/", icon: Home, desktopName: "Platform Health" },
    { name: "Clients", href: "/organizations", icon: Building, desktopName: "Organizations" },
    { name: "Logs", href: "/audit-logs", icon: ShieldCheck, desktopName: "Global Audit Logs" },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col inset-y-0 left-0 z-30 bg-[#090B10] border-r border-white/5 transition-all duration-300 w-20 lg:w-64`}
      >
        <div className="h-20 p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-white/5 shrink-0">
          <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-white/5">
            <Image src={logo} alt="Logo" width={120} height={120} className="rounded-full" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xl font-bold text-white tracking-wide leading-tight">
              Tavonza
            </span>
            <span className="text-[9px] text-[#00F2FE] font-bold uppercase tracking-widest mt-0.5">
              AI Hospitality
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <p className="hidden lg:block px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Management
          </p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={item.desktopName}
              >
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#D4AF37] rounded-r-md hidden lg:block shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>}
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`} />
                <span className="hidden lg:block font-medium">{item.desktopName}</span>
                
                {/* Tooltip for tablet */}
                <div className="absolute left-14 bg-[#1a1a1f] text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible lg:hidden whitespace-nowrap z-50 border border-white/10 shadow-xl transition-all">
                  {item.desktopName}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto border-t border-white/5">
           <div className="hidden lg:block bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
             <p className="text-sm text-gray-300 font-medium mb-1">System Status</p>
             <p className="text-xs text-[#00F2FE] flex items-center justify-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] animate-pulse"></span>
               Operational
             </p>
           </div>
           <Link href="#" className="flex lg:hidden items-center justify-center p-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 group relative">
             <Settings className="w-5 h-5 shrink-0" />
             <div className="absolute left-14 bg-[#1a1a1f] text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible lg:hidden whitespace-nowrap z-50 border border-white/10 shadow-xl transition-all">
               Settings
             </div>
           </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090B10]/90 backdrop-blur-xl border-t border-white/10 z-30 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive ? "text-[#D4AF37]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer */}
      <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-[#090B10] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <span className="text-white font-bold tracking-wide">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Platform Settings</span>
          </Link>
        </div>
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
             <p className="text-sm text-gray-300 font-medium mb-1">System Status</p>
             <p className="text-xs text-[#00F2FE] flex items-center justify-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] animate-pulse"></span>
               Operational
             </p>
           </div>
        </div>
      </div>
    </>
  );
}
