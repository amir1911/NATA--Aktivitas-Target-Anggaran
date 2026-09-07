'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  Target,
  LogOut,
  Sparkles,
  ChevronRight,
  Settings,
  X,
} from 'lucide-react';
import { useNataStore } from '@/lib/store';

export const NAVIGATION_ITEMS = [
  {
    name: 'Ikhtisar Utama',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Utama',
    accentColor: '#4EA5D9', // Sky Blue
  },
  {
    name: 'Akademik & Jadwal',
    href: '/academic',
    icon: GraduationCap,
    badge: 'Kuliah',
    accentColor: '#8B5CF6', // Violet
  },
  {
    name: 'Keuangan & Anggaran',
    href: '/finance',
    icon: Wallet,
    badge: 'Dompet',
    accentColor: '#22C55E', // Green
  },
  {
    name: 'Target & Catatan',
    href: '/goals-notes',
    icon: Target,
    badge: 'Catatan',
    accentColor: '#F59E0B', // Amber
  },
  {
    name: 'Pengaturan Akun',
    href: '/settings',
    icon: Settings,
    badge: 'Profil',
    accentColor: '#64748B', // Slate
  },
];

interface SidebarProps {
  className?: string;
  /** Mobile: show as overlay drawer */
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ className, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, courses, tasks } = useNataStore();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  const sidebarContent = (
    <aside
      style={{ background: '#091540' }}
      className={`w-72 border-r border-slate-800 text-white flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 ${className ?? ''}`}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onMobileClose}>
          <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <img src="/logo.png" alt="NATA Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">NATA</span>

            </div>
            <p className="text-[11px] text-slate-300/70 font-medium">Aktivitas, Target & Anggaran</p>
          </div>
        </Link>

        {/* Close button only visible on mobile */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3">
          Menu Aplikasi
        </p>

        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          let badgeText = item.badge;
          if (item.href === '/academic') badgeText = `${courses.length} Matkul`;
          if (item.href === '/goals-notes') badgeText = `${pendingTasksCount} Tasks`;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${isActive
                ? 'bg-white/15 text-white shadow-md border border-white/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4EA5D9]' : 'text-slate-400 group-hover:text-[#4EA5D9]'}`} />
                <span>{item.name}</span>
              </div>
              <span
                style={{ backgroundColor: isActive ? item.accentColor : 'rgba(255,255,255,0.1)' }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'text-white shadow-sm' : 'text-slate-300'}`}
              >
                {badgeText}
              </span>
            </Link>
          );
        })}

        {/* Status Hub Callout */}
        <div className="pt-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4EA5D9] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Pusat Kendali Kos</span>
            </div>
            <p className="text-xs text-slate-300 font-medium mb-3">
              {courses.length === 0 ? 'Mulai input data perkuliahan & keuangan Anda!' : `${courses.length} matkul & ${pendingTasksCount} tugas aktif.`}
            </p>
            <Link
              href="/academic"
              onClick={onMobileClose}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4EA5D9] hover:underline"
            >
              Kelola Akademik <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
          <Link href="/settings" onClick={onMobileClose} className="flex items-center gap-3 overflow-hidden flex-1 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4EA5D9] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name || 'Mahasiswa'}</p>
              <p className="text-[10px] text-slate-300/70 truncate">{user.email || 'mahasiswa@nata.app'}</p>
            </div>
          </Link>
          <Link
            href="/login"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
            title="Keluar / Ganti Akun"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );

  return sidebarContent;
}
