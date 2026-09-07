'use client';

import React, { useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileMenuContext } from '@/lib/mobile-menu-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors">

      {/* ── Mobile Overlay Backdrop ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* ── Desktop Sidebar (always visible ≥ md) ── */}
      <Sidebar className="hidden md:flex" />

      {/* ── Mobile Drawer Sidebar ── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={closeMenu} />
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Pages inject their own <Header onMenuToggle={openMenu} /> */}
        {/* We pass openMenu via context or prop drilling per page */}
        <main className="flex-1 pb-12">
          {/* Pass the openMenu handler to pages via a React context */}
          <MobileMenuContext.Provider value={openMenu}>
            {children}
          </MobileMenuContext.Provider>
        </main>
      </div>
    </div>
  );
}

