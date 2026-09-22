"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, User, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import { logoutAction } from "../actions/auth";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  // Create simple breadcrumb from pathname
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumb = paths.length === 0 ? 'Platform Health' : paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  return (
    <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#090B10]/70 backdrop-blur-2xl sticky top-0 z-20 w-full shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Logo (Sidebar handles desktop logo) */}
        <div className="md:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src={logo} alt="Logo" width={32} height={32} className="rounded-full" />
        </div>
        
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <span className="hidden sm:inline">Super Admin</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-gray-200 font-medium tracking-wide">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search platform..."
            className="bg-white/[0.03] text-sm text-gray-200 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 w-48 lg:w-64 border border-white/5 placeholder:text-gray-600 transition-shadow hover:bg-white/[0.05]"
          />
        </div>
        <button className="relative text-gray-400 hover:text-white transition-colors p-2 md:p-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 md:top-0 right-1.5 md:right-0 w-2 h-2 bg-[#00F2FE] rounded-full shadow-[0_0_8px_#00F2FE]"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 md:border-l border-white/10 md:pl-6 cursor-pointer group"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-200 leading-tight">Support Team</p>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Super Admin</p>
            </div>
            <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : 'group-hover:text-gray-300'}`} />
          </div>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#11141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/5 sm:hidden">
                <p className="text-sm font-medium text-gray-200 leading-tight">Support Team</p>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Super Admin</p>
              </div>
              <div className="p-2 space-y-1">
                <Link 
                  href="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profile & Security
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400/80" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
