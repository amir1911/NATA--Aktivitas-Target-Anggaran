'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Moon, Sun, Menu } from 'lucide-react';
import { FaCloud, FaCloudSun, FaCloudMoon } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useNataStore } from '@/lib/store';

export function Header({
  title = 'Ikhtisar Utama',
  onQuickTask,
  onQuickExpense,
  onMenuToggle,
}: {
  title?: string;
  onQuickTask?: () => void;
  onQuickExpense?: () => void;
  onMenuToggle?: () => void;
}) {
  const { user } = useNataStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState<{
    text: string;
    weather: 'pagi' | 'siang' | 'malam';
  }>({
    text: 'Selamat Datang',
    weather: 'siang',
  });

  useEffect(() => {
    // Sinkronisasi status awal dari DOM / localStorage
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDark();

    window.addEventListener('theme-changed', checkDark);
    return () => window.removeEventListener('theme-changed', checkDark);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting({ text: 'Selamat Pagi', weather: 'pagi' });
    } else if (hour >= 11 && hour < 15) {
      setGreeting({ text: 'Selamat Siang', weather: 'siang' });
    } else if (hour >= 15 && hour < 18) {
      setGreeting({ text: 'Selamat Sore', weather: 'siang' });
    } else {
      setGreeting({ text: 'Selamat Malam', weather: 'malam' });
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains('dark');
    if (isCurrentlyDark) {
      html.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch (_) {}
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch (_) {}
      setIsDarkMode(true);
    }
    window.dispatchEvent(new Event('theme-changed'));
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-6 py-4 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger button — only on mobile */}
          <button
            id="hamburger-btn"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4EA5D9]/10 text-[#4EA5D9] border border-[#4EA5D9]/20 whitespace-nowrap">
                {greeting.weather === 'pagi' && <FaCloud className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                {greeting.weather === 'siang' && <FaCloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                {greeting.weather === 'malam' && <FaCloudMoon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                <span>{greeting.text}{user?.name && user.name.trim() && user.name.trim() !== 'Mahasiswa Kos' ? `, ${user.name.trim().split(/\s+/)[0]}` : ''}! 👋</span>
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline truncate">| {user?.university || 'NATA App'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#091540] dark:text-white tracking-tight mt-0.5 truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Action Widgets */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Quick Expense Logger */}
          {onQuickExpense && (
            <Button variant="outline" size="sm" onClick={onQuickExpense} className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 hidden sm:flex">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Catat Pengeluaran</span>
            </Button>
          )}

          {/* Quick Task Logger */}
          {onQuickTask && (
            <Button variant="primary" size="sm" onClick={onQuickTask} className="text-xs hidden sm:flex">
              <Plus className="w-4 h-4" />
              <span>Tugas Baru</span>
            </Button>
          )}

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
          >
            {isDarkMode
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            }
          </button>
        </div>
      </div>
    </header>
  );
}
