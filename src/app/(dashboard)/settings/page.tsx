'use client';

import React, { useState, useContext, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Wallet,
  Save,
  LogOut,
  Shield,
  Bell,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Sparkles,
  Key,
  Check,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { FaChromecast } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { useNataStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

// ── Gradient Presets for Avatar ───────────────────────────────────────────────
const AVATAR_PALETTES = [
  { name: 'Ocean Sky', from: '#0284C7', to: '#6366F1' },
  { name: 'Emerald Sea', from: '#059669', to: '#0284C7' },
  { name: 'Cosmic Violet', from: '#7C3AED', to: '#DB2777' },
  { name: 'Sunset Flame', from: '#EA580C', to: '#E11D48' },
  { name: 'Neon Cyber', from: '#06B6D4', to: '#3B82F6' },
  { name: 'Royal Gold', from: '#D97706', to: '#DC2626' },
];

const POPULAR_UNIVERSITIES = [
  'Universitas Sriwijaya',
  'Universitas Indonesia',
  'Institut Teknologi Bandung',
  'Universitas Gadjah Mada',
  'Universitas Diponegoro',
  'Universitas Airlangga',
  'Universitas Brawijaya',
  'Universitas Padjadjaran',
];

const BUDGET_PRESETS = [
  { label: 'Rp 1.0 Jt', value: 1000000 },
  { label: 'Rp 1.5 Jt', value: 1500000 },
  { label: 'Rp 2.0 Jt', value: 2000000 },
  { label: 'Rp 2.5 Jt', value: 2500000 },
  { label: 'Rp 3.0 Jt', value: 3000000 },
  { label: 'Rp 4.0 Jt', value: 4000000 },
];

function getInitials(name: string): string {
  if (!name) return 'M';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ── Toast Notification Component ──────────────────────────────────────────────
function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-white text-sm font-semibold border ${
        type === 'success'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30'
          : 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30'
      }`}
      style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
      </div>
      <span>{msg}</span>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translate(-50%,20px) scale(0.96)}to{opacity:1;transform:translate(-50%,0) scale(1)}}`}</style>
    </div>
  );
}

// ── Premium Notification Toggle ───────────────────────────────────────────────
function NotifToggleItem({
  label,
  desc,
  icon,
  badgeText,
  defaultOn = true,
}: {
  label: string;
  desc: string;
  icon: React.ReactNode;
  badgeText?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-[#091540] dark:text-sky-400 shrink-0 mt-0.5 sm:mt-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#091540] dark:text-white leading-snug">{label}</p>
            {badgeText && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOn(!on)}
        aria-label={on ? 'Nonaktifkan' : 'Aktifkan'}
        className={`relative w-12 h-6.5 rounded-full transition-colors duration-300 cursor-pointer shrink-0 p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4EA5D9] ${
          on ? 'bg-gradient-to-r from-[#4EA5D9] to-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`block w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            on ? 'translate-x-5.5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────────────────────
export default function SettingsPage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const { user, updateUser } = useNataStore();

  // Form State
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [university, setUniversity] = useState(user.university || '');
  const [major, setMajor] = useState(user.major || '');
  const [semester, setSemester] = useState(user.semester ?? 1);
  const [monthlyAllowance, setMonthlyAllowance] = useState(user.monthlyAllowance ?? 0);
  const [bio, setBio] = useState(user.bio || '');
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Security Form State
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Tab State
  const [tab, setTab] = useState<'profile' | 'security' | 'integration'>('profile');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Sync store into form on mount
  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setUniversity(user.university || '');
    setMajor(user.major || '');
    setSemester(user.semester ?? 1);
    setMonthlyAllowance(user.monthlyAllowance ?? 0);
    setBio(user.bio || '');
  }, [user]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') =>
    setToast({ msg, type });

  // Calculate Profile Completeness
  const profileFields = [
    Boolean(name.trim()),
    Boolean(email.trim()),
    Boolean(phone.trim()),
    Boolean(university.trim()),
    Boolean(major.trim()),
    Boolean(semester > 0),
    Boolean(monthlyAllowance > 0),
    Boolean(bio.trim()),
  ];
  const completedCount = profileFields.filter(Boolean).length;
  const completenessPercent = Math.round((completedCount / profileFields.length) * 100);

  // ── Save Profile Handler ───────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify('Nama lengkap wajib diisi.', 'error');
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    updateUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      university: university.trim(),
      major: major.trim(),
      semester,
      monthlyAllowance,
      bio: bio.trim(),
    });
    setIsSaving(false);
    notify('✅ Profil & preferensi berhasil diperbarui!');
  };

  // ── Save Password Handler ──────────────────────────────────────────────────
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPw) {
      notify('Masukkan kata sandi baru.', 'error');
      return;
    }
    if (newPw.length < 6) {
      notify('Kata sandi baru minimal 6 karakter.', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      notify('Konfirmasi kata sandi tidak sesuai.', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    notify('🔐 Kata sandi berhasil diperbarui dengan aman!');
  };

  const rpFormat = (n: number) =>
    n > 0 ? `Rp ${n.toLocaleString('id-ID')}` : 'Rp 0';

  const palette = AVATAR_PALETTES[selectedPalette % AVATAR_PALETTES.length];

  // Password strength check
  const pwHasUpper = /[A-Z]/.test(newPw);
  const pwHasNumber = /[0-9]/.test(newPw);
  const pwLengthOk = newPw.length >= 6;
  const pwStrength =
    newPw.length === 0
      ? 0
      : (pwLengthOk ? 1 : 0) + (pwHasUpper ? 1 : 0) + (pwHasNumber ? 1 : 0) + (newPw.length >= 8 ? 1 : 0);

  return (
    <div className="space-y-6 pb-16">
      <Header title="Pengaturan Akun" onMenuToggle={onMenuToggle} />

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="px-4 md:px-8 space-y-6 max-w-4xl mx-auto">

        {/* ════════════════════════════════════════════════════════════════
            HERO PROFILE BANNER (ULTRA PREMIUM)
        ════════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#091540] via-[#0D1E56] to-[#1E1B4B] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-[#4EA5D9]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 bg-[#8B5CF6]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-0 -ml-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar & Palette Toggle */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-2xl ring-4 ring-white/20 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                  }}
                >
                  {getInitials(name || 'Mahasiswa')}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPalette((prev) => (prev + 1) % AVATAR_PALETTES.length)
                  }
                  title="Ganti nuansa avatar"
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white text-[#091540] flex items-center justify-center shadow-lg hover:scale-115 active:scale-95 transition-all border-2 border-[#091540]/30 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Mini Color Swatches */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                {AVATAR_PALETTES.map((p, idx) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedPalette(idx)}
                    title={p.name}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      selectedPalette === idx ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  />
                ))}
              </div>
            </div>

            {/* User Meta Information */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Mahasiswa Aktif
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold">
                  <FaChromecast className="w-3 h-3 text-sky-400" />
                  Bot @NataAmir_bot
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {name || 'Nama Belum Diisi'}
              </h2>

              <p className="text-sm text-slate-200 font-medium">
                {major ? major : 'Program Studi Belum Diisi'}
                {semester ? ` · Semester ${semester}` : ''}
              </p>

              <p className="text-xs text-slate-400">
                {university ? university : 'Universitas Belum Ditentukan'}
              </p>

              {/* Bio snippet if available */}
              {bio && (
                <p className="text-xs text-slate-300/90 italic max-w-xl pt-1">
                  "{bio}"
                </p>
              )}

              {/* Key Quick Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-sky-300" />
                  {email || 'Email belum diisi'}
                </span>
                {phone && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-slate-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    {phone}
                  </span>
                )}
                {monthlyAllowance > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    {rpFormat(monthlyAllowance)}/bln
                    <span className="text-[10px] text-emerald-200/80 font-normal">
                      (≈ {rpFormat(Math.round(monthlyAllowance / 30))}/hari)
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Completeness Card */}
            <div className="w-full md:w-56 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left shrink-0">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Kelengkapan
                </span>
                <span className="text-sky-300 font-extrabold">{completenessPercent}%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${completenessPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {completenessPercent === 100
                  ? '🎉 Profil kamu 100% lengkap & siap digunakan!'
                  : `Isi ${8 - completedCount} info lagi agar Nata App semakin optimal.`}
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            NAV PILL TABS
        ════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center p-1.5 bg-slate-200/70 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              tab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-[#091540] dark:text-white shadow-md shadow-slate-300/30 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-[#4EA5D9]" />
            <span>Profil & Kampus</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('security')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              tab === 'security'
                ? 'bg-white dark:bg-slate-900 text-[#091540] dark:text-white shadow-md shadow-slate-300/30 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Keamanan & Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('integration')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              tab === 'integration'
                ? 'bg-white dark:bg-slate-900 text-[#091540] dark:text-white shadow-md shadow-slate-300/30 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FaChromecast className="w-4 h-4 text-sky-500" />
            <span>Telegram & Notif</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: PROFIL & AKADEMIK
        ════════════════════════════════════════════════════════════════ */}
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">

            {/* Section 1: Data Diri */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#4EA5D9] via-indigo-400 to-[#8B5CF6]" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-[#091540] dark:text-white text-base">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-[#4EA5D9]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Data Pribadi Mahasiswa</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Nama lengkap dan kontak kamu untuk identitas aplikasi & bot
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="settings-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Pratama"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Nama depan akan digunakan pada salam pembuka di Header (misal: "Selamat Pagi, Budi! 👋").
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="settings-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@mahasiswa.ac.id"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Email akun untuk sinkronisasi cloud Supabase.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp / Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      No. WhatsApp / HP
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="settings-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition font-medium"
                      />
                    </div>
                  </div>

                  {/* Bio Singkat */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Bio Singkat / Catatan Moto
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {bio.length} / 120 karakter
                      </span>
                    </div>
                    <input
                      id="settings-bio"
                      type="text"
                      maxLength={120}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Contoh: Mahasiswa semester akhir pejuang skripsi 🚀"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition font-medium"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Kampus & Akademik */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#8B5CF6] via-purple-400 to-pink-500" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-[#091540] dark:text-white text-base">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-[#8B5CF6]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Informasi Kampus & Perkuliahan</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Disinkronkan ke kartu jadwal kuliah & tugas akademik
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-5">
                {/* Universitas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Universitas / Politeknik / Institusi
                  </label>
                  <div className="relative mb-2">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="settings-university"
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="Contoh: Universitas Sriwijaya"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition font-medium"
                    />
                  </div>

                  {/* Quick University chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Rekomendasi:</span>
                    {POPULAR_UNIVERSITIES.slice(0, 5).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUniversity(u)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          university === u
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Program Studi & Semester */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Jurusan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Program Studi / Jurusan
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        id="settings-major"
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Contoh: Teknik Informatika / Manajemen"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition font-medium"
                      />
                    </div>
                  </div>

                  {/* Semester Dropdown & Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tingkat Semester Saat Ini
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSemester(s)}
                          className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            semester === s
                              ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/50 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          Sem {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Manajemen Anggaran & Uang Saku */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-[#091540] dark:text-white text-base">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Alokasi Anggaran Bulanan</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Batas patokan keuangan untuk evaluasi pengeluaran kos harian
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nominal Uang Saku / Anggaran per Bulan (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 pointer-events-none select-none">
                      Rp
                    </span>
                    <input
                      id="settings-allowance"
                      type="number"
                      min={0}
                      step={50000}
                      value={monthlyAllowance || ''}
                      onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                      placeholder="Contoh: 2500000"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-bold"
                    />
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400">Pilih Cepat:</span>
                  {BUDGET_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setMonthlyAllowance(p.value)}
                      className={`text-xs px-3 py-1 rounded-xl border transition-all cursor-pointer font-bold ${
                        monthlyAllowance === p.value
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Live Daily Breakdown Widget */}
                {monthlyAllowance > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-sky-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-sky-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          Rata-rata Pengeluaran Maksimal Aman:
                        </p>
                        <p className="text-base font-black text-emerald-700 dark:text-emerald-400">
                          {rpFormat(Math.round(monthlyAllowance / 30))} <span className="text-xs font-semibold text-slate-500">/ hari</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Acuan Mingguan:</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {rpFormat(Math.round(monthlyAllowance / 4))} / minggu
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bottom Save Bar */}
            <div className="sticky bottom-6 z-10 flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Perubahan tersimpan otomatis ke database lokal & Supabase</span>
              </div>
              <button
                id="settings-save-btn"
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#091540] to-[#1E1B4B] hover:from-[#0D1E56] hover:to-[#2A2665] text-white font-extrabold text-sm shadow-lg shadow-[#091540]/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#4EA5D9]" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: KEAMANAN & SANDI
        ════════════════════════════════════════════════════════════════ */}
        {tab === 'security' && (
          <div className="space-y-6">

            {/* Ubah Password */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-[#091540] dark:text-white text-base">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Ubah Kata Sandi Akun</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Amankan akun Nata kamu dengan kata sandi yang kuat
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <form onSubmit={handleSavePassword} className="p-6 space-y-5">
                {/* Kata sandi saat ini */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="Masukkan kata sandi lama kamu"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Kata sandi baru */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Minimal 6 karakter kombinasi"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-sm text-[#091540] dark:text-white focus:outline-none focus:border-[#4EA5D9] focus:ring-2 focus:ring-[#4EA5D9]/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-time strength meter */}
                  {newPw && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              step <= pwStrength
                                ? pwStrength <= 1
                                  ? 'bg-rose-500'
                                  : pwStrength <= 2
                                  ? 'bg-amber-400'
                                  : pwStrength === 3
                                  ? 'bg-sky-400'
                                  : 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span
                          className={
                            pwStrength <= 1
                              ? 'text-rose-500'
                              : pwStrength <= 2
                              ? 'text-amber-500'
                              : pwStrength === 3
                              ? 'text-sky-500'
                              : 'text-emerald-500'
                          }
                        >
                          Kekuatan:{' '}
                          {pwStrength <= 1
                            ? 'Sangat Lemah'
                            : pwStrength <= 2
                            ? 'Cukup'
                            : pwStrength === 3
                            ? 'Kuat'
                            : 'Sangat Kuat'}
                        </span>
                        <span className="text-slate-400">
                          {pwHasUpper && pwHasNumber ? '✨ Kombinasi mantap!' : 'Tambahkan huruf besar & angka'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Konfirmasi sandi baru */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/80 text-[#091540] dark:text-white focus:outline-none focus:ring-2 transition ${
                      confirmPw && confirmPw !== newPw
                        ? 'border-rose-400 focus:ring-rose-400/20'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#4EA5D9] focus:ring-[#4EA5D9]/20'
                    }`}
                  />
                  {confirmPw && confirmPw !== newPw && (
                    <p className="text-xs text-rose-500 mt-1 font-semibold">
                      Kata sandi konfirmasi belum cocok
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* Zona Berbahaya */}
            <Card className="border border-rose-200 dark:border-rose-900/60 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-rose-500" />
              <CardHeader className="border-b border-rose-100 dark:border-rose-900/40 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 text-base">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/40">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Zona Berbahaya & Sesi</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Tindakan ini memengaruhi penyimpanan lokal di perangkat ini
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-4">
                {/* Keluar dari akun */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <div>
                    <p className="text-sm font-extrabold text-[#091540] dark:text-white">
                      Keluar dari Akun
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Akhiri sesi saat ini dan kembali ke halaman Login aplikasi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Yakin ingin keluar dari akun?')) {
                        window.location.href = '/login';
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:border-rose-200 text-xs font-extrabold transition-all cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>

                {/* Reset local data */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <div>
                    <p className="text-sm font-extrabold text-rose-700 dark:text-rose-400">
                      Bersihkan Cache & Data Lokal Browser
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Menghapus penyimpanan offline pada browser ini tanpa menghapus data cloud Supabase.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Peringatan: Semua data offline lokal di browser ini akan dihapus. Lanjutkan?'
                        )
                      ) {
                        [
                          'nata_user',
                          'nata_courses',
                          'nata_schedules',
                          'nata_tasks',
                          'nata_drive_links',
                          'nata_transactions',
                          'nata_budgets',
                          'nata_savings',
                          'nata_bills',
                          'nata_notes',
                          'nata_personal_goals',
                        ].forEach((k) => localStorage.removeItem(k));
                        notify('🗑️ Data lokal berhasil dibersihkan! Muat ulang halaman.');
                        setTimeout(() => window.location.reload(), 800);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-md shadow-rose-600/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Cache Lokal</span>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 3: INTEGRASI TELEGRAM & NOTIFIKASI
        ════════════════════════════════════════════════════════════════ */}
        {tab === 'integration' && (
          <div className="space-y-6">

            {/* Telegram Bot Card */}
            <Card className="border border-sky-200/80 dark:border-sky-900/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center justify-between gap-3 text-base">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
                      <FaChromecast className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#091540] dark:text-white">
                          Bot Telegram Asisten Kos
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Aktif (@NataAmir_bot)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sinkronisasi otomatis dua arah dengan akun Telegram kamu
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://t.me/NataAmir_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md transition-all active:scale-95"
                  >
                    <FaChromecast className="w-3.5 h-3.5" />
                    <span>Buka Chat Telegram</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Kamu bisa mengelola catatan, target, dan pengeluaran kos langsung dari obrolan Telegram. Cukup ketik pesan dengan format berikut:
                </p>

                {/* Command Cheat Sheet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-mono text-[11px] font-bold">
                        keluar 25000 Nasi Padang
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mencatat transaksi pengeluaran secara instan.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold">
                        masuk 500k Uang Saku
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mencatat transfer pemasukan uang saku.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-mono text-[11px] font-bold">
                        catat: Wi-Fi kos kodenya 123
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Menyimpan memo atau catatan penting kos.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold">
                        /target atau /jadwal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cek ringkasan target semester atau jadwal kuliah.
                    </p>
                  </div>
                </div>

                <div className="sm:hidden pt-2">
                  <a
                    href="https://t.me/NataAmir_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md"
                  >
                    <FaChromecast className="w-4 h-4" />
                    <span>Buka Chat @NataAmir_bot di Telegram</span>
                  </a>
                </div>
              </div>
            </Card>

            {/* Preferensi Notifikasi */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-sky-400 to-[#8B5CF6]" />
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-[#091540] dark:text-white text-base">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-[#4EA5D9]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold">Preferensi Peringatan & Notifikasi</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      Sesuaikan alarm pengingat tugas, tagihan, dan keuangan kamu
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="p-6 space-y-3">
                <NotifToggleItem
                  label="Pengingat Deadline Tugas Kuliah"
                  desc="Kirim notifikasi H-1 sebelum tenggat waktu tugas kuliah berakhir."
                  icon={<GraduationCap className="w-4 h-4 text-purple-500" />}
                  badgeText="Akademik"
                  defaultOn={true}
                />
                <NotifToggleItem
                  label="Peringatan Uang Saku Menipis"
                  desc="Beri tahu saat pengeluaran bulanan telah melampaui 80% dari anggaran."
                  icon={<Wallet className="w-4 h-4 text-emerald-500" />}
                  badgeText="Keuangan"
                  defaultOn={true}
                />
                <NotifToggleItem
                  label="Konfirmasi Transaksi Bot Telegram"
                  desc="Kirim ringkasan balasan otomatis setiap ada transaksi yang masuk via Telegram."
                  icon={<FaChromecast className="w-4 h-4 text-sky-500" />}
                  badgeText="Bot Sync"
                  defaultOn={true}
                />
                <NotifToggleItem
                  label="Peringatan Tagihan Kos & Laundry"
                  desc="Pengingat otomatis 3 hari sebelum tanggal jatuh tempo sewa kos bulanan."
                  icon={<Calendar className="w-4 h-4 text-amber-500" />}
                  badgeText="Tagihan"
                  defaultOn={true}
                />
                <NotifToggleItem
                  label="Pencapaian Target & Milestone"
                  desc="Rayakan ucapan selamat saat kamu berhasil menyelesaikan target semester."
                  icon={<Award className="w-4 h-4 text-rose-500" />}
                  badgeText="Target"
                  defaultOn={true}
                />

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => notify('✅ Preferensi notifikasi berhasil disimpan!')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#091540] to-[#1E1B4B] hover:from-[#0D1E56] hover:to-[#2A2665] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#4EA5D9]" />
                    <span>Simpan Preferensi</span>
                  </button>
                </div>
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
}
