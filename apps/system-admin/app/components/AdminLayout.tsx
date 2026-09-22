"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export interface ShellUser {
  name: string;
  email: string;
  avatar: string | null;
}

export function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ShellUser;
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#090B10] text-gray-200 font-sans overflow-hidden w-full selection:bg-[#D4AF37]/30">

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Left on Desktop/Tablet, Bottom/Drawer on Mobile) */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 relative h-full">
        <Header user={user} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
