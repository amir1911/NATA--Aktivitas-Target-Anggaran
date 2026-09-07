'use client';

import React, { useState, useContext, useMemo } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  PieChart as PieChartIcon,
  Trash2,
  Pencil,
  Search,
  X,
  Target,
  Utensils,
  Home,
  Shirt,
  Wifi,
  Car,
  Gamepad2,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Filter,
} from 'lucide-react';
import { FaChromecast } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useNataStore, TransactionItem, BudgetItem } from '@/lib/store';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const CATEGORY_MAP: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    colorScheme: 'amber' | 'blue' | 'sky' | 'indigo' | 'emerald' | 'rose';
    defaultLimit: number;
  }
> = {
  MAKAN: {
    label: 'Makanan & Minuman',
    icon: Utensils,
    color: '#F59E0B',
    colorScheme: 'amber',
    defaultLimit: 900000,
  },
  KOS: {
    label: 'Sewa Kos & Kamar',
    icon: Home,
    color: '#3B82F6',
    colorScheme: 'blue',
    defaultLimit: 850000,
  },
  LAUNDRY: {
    label: 'Laundry & Pakaian',
    icon: Shirt,
    color: '#06B6D4',
    colorScheme: 'sky',
    defaultLimit: 150000,
  },
  KUOTA: {
    label: 'Paket Data & WiFi',
    icon: Wifi,
    color: '#8B5CF6',
    colorScheme: 'indigo',
    defaultLimit: 120000,
  },
  TRANSPORT: {
    label: 'Transportasi & Bensin',
    icon: Car,
    color: '#10B981',
    colorScheme: 'emerald',
    defaultLimit: 150000,
  },
  HIBURAN: {
    label: 'Hiburan & Nongkrong',
    icon: Gamepad2,
    color: '#EC4899',
    colorScheme: 'rose',
    defaultLimit: 300000,
  },
  ALAT_TULIS: {
    label: 'Alat Tulis & Kuliah',
    icon: BookOpen,
    color: '#6366F1',
    colorScheme: 'indigo',
    defaultLimit: 100000,
  },
  LAINNYA: {
    label: 'Lainnya / Umum',
    icon: HelpCircle,
    color: '#64748B',
    colorScheme: 'blue',
    defaultLimit: 200000,
  },
};

const ALL_CATEGORIES: BudgetItem['category'][] = [
  'MAKAN',
  'KOS',
  'LAUNDRY',
  'KUOTA',
  'TRANSPORT',
  'HIBURAN',
  'ALAT_TULIS',
  'LAINNYA',
];

export default function FinancePage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    setBudgetLimit,
  } = useNataStore();

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'semua' | 'anggaran' | 'transaksi'>('semua');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PEMASUKAN' | 'PENGELUARAN'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTrx, setSearchTrx] = useState('');

  // Modals state
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Edit Trx state
  const [editingTrxId, setEditingTrxId] = useState<string | null>(null);
  const [trxType, setTrxType] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PENGELUARAN');
  const [trxCategory, setTrxCategory] = useState<TransactionItem['category']>('MAKAN');
  const [trxTitle, setTrxTitle] = useState('');
  const [trxAmount, setTrxAmount] = useState('');
  const [trxNotes, setTrxNotes] = useState('');

  // Edit Budget state
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState<BudgetItem['category']>('MAKAN');
  const [budgetLimitInput, setBudgetLimitInput] = useState('');

  // Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'PEMASUKAN')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'PENGELUARAN')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const walletBalance = totalIncome - totalExpense;

  // Category spending calculation
  const getCategorySpent = (cat: string) => {
    return transactions
      .filter((t) => t.type === 'PENGELUARAN' && (t.category === cat || (!t.category && cat === 'LAINNYA')))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryLimit = (cat: BudgetItem['category']) => {
    const found = budgets.find((b) => b.category === cat);
    if (found && found.amountLimit > 0) return found.amountLimit;
    return CATEGORY_MAP[cat]?.defaultLimit || 500000;
  };

  // Total budget metrics
  const totalBudgetLimit = useMemo(() => {
    return ALL_CATEGORIES.reduce((sum, cat) => sum + getCategoryLimit(cat), 0);
  }, [budgets]);

  const budgetUsagePercent = totalBudgetLimit > 0 ? Math.round((totalExpense / totalBudgetLimit) * 100) : 0;

  // Modal Handlers
  const openNewTrxModal = (type: 'PEMASUKAN' | 'PENGELUARAN' = 'PENGELUARAN') => {
    setEditingTrxId(null);
    setTrxType(type);
    setTrxCategory(type === 'PENGELUARAN' ? 'MAKAN' : 'UANG_SAKU');
    setTrxTitle('');
    setTrxAmount('');
    setTrxNotes('');
    setIsTrxModalOpen(true);
  };

  const openEditTrxModal = (trx: TransactionItem) => {
    setEditingTrxId(trx.id);
    setTrxType(trx.type);
    setTrxCategory(trx.category || 'MAKAN');
    setTrxTitle(trx.title);
    setTrxAmount(String(trx.amount));
    setTrxNotes(trx.notes || '');
    setIsTrxModalOpen(true);
  };

  const openBudgetModal = (cat: BudgetItem['category']) => {
    setSelectedBudgetCategory(cat);
    setBudgetLimitInput(String(getCategoryLimit(cat)));
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudgetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = Number(budgetLimitInput);
    if (!isNaN(limitNum) && limitNum >= 0) {
      setBudgetLimit(selectedBudgetCategory, limitNum);
    }
    setIsBudgetModalOpen(false);
  };

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxTitle || !trxAmount) return;

    if (editingTrxId) {
      updateTransaction(editingTrxId, {
        type: trxType,
        category: trxCategory,
        title: trxTitle,
        amount: Number(trxAmount),
        notes: trxNotes || undefined,
      });
    } else {
      addTransaction({
        type: trxType,
        category: trxCategory,
        amount: Number(trxAmount),
        title: trxTitle,
        notes: trxNotes || undefined,
        date: new Date().toISOString(),
      });
    }

    setEditingTrxId(null);
    setTrxTitle('');
    setTrxAmount('');
    setTrxNotes('');
    setIsTrxModalOpen(false);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchType = activeFilter === 'ALL' || t.type === activeFilter;
    const matchCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    const q = searchTrx.toLowerCase().trim();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      (t.category && CATEGORY_MAP[t.category]?.label.toLowerCase().includes(q));
    return matchType && matchCat && matchSearch;
  });

  const cashFlowChartData = [
    { name: 'Pemasukan', total: totalIncome, fill: '#10b981' },
    { name: 'Pengeluaran', total: totalExpense, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Pencatatan Keuangan & Anggaran Kos"
        onQuickExpense={() => openNewTrxModal('PENGELUARAN')}
        onMenuToggle={onMenuToggle}
      />

      <div className="px-3.5 sm:px-6 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'semua', label: 'Semua Ringkasan' },
              { id: 'anggaran', label: `Alokasi Anggaran (${ALL_CATEGORIES.length})` },
              { id: 'transaksi', label: `Riwayat Transaksi (${transactions.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-[#091540] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openNewTrxModal('PEMASUKAN')}
              className="text-xs flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Pemasukan</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openNewTrxModal('PENGELUARAN')}
              className="text-xs flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4" />
              <span>Pengeluaran</span>
            </Button>
          </div>
        </div>

        {/* Cash Flow & Budget Summary StatCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <StatCard
            title="Total Pemasukan"
            value={`Rp ${totalIncome.toLocaleString('id-ID')}`}
            subtitle="Uang Saku Ortu & Pemasukan"
            icon={<ArrowDownLeft className="w-5 sm:w-6 h-5 sm:h-6" />}
            color="emerald"
          />
          <StatCard
            title="Total Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString('id-ID')}`}
            subtitle="Pengeluaran Kos & Harian"
            icon={<ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6" />}
            color="rose"
          />
          <StatCard
            title="Sisa Dompet Bersih"
            value={`Rp ${walletBalance.toLocaleString('id-ID')}`}
            subtitle="Pemasukan - Pengeluaran"
            icon={<Wallet className="w-5 sm:w-6 h-5 sm:h-6" />}
            color={walletBalance >= 0 ? 'sky' : 'rose'}
          />
          <StatCard
            title="Plafon Anggaran Kos"
            value={`Rp ${totalBudgetLimit.toLocaleString('id-ID')}`}
            subtitle={`Terpakai: ${budgetUsagePercent}% (${totalExpense >= totalBudgetLimit ? 'Overbudget' : 'Terkendali'})`}
            icon={<Target className="w-5 sm:w-6 h-5 sm:h-6" />}
            color={budgetUsagePercent > 90 ? 'amber' : 'violet'}
          />
        </div>

        {/* Telegram Bot Integration Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 font-bold">
              <FaChromecast className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Input Cepat via Telegram Bot
                </h4>
                <Badge variant="blue">Aktif (@NataAmir_bot)</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketik langsung di Telegram (misal: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono text-[11px]">keluar 25000 Nasi Padang</code> atau <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">masuk 500k Uang Saku</code>) &amp; otomatis tersinkron ke sini!
              </p>
            </div>
          </div>

          <a
            href="https://t.me/NataAmir_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-xs shrink-0 w-full sm:w-auto"
          >
            <FaChromecast className="w-3.5 h-3.5" />
            <span>Buka Bot Telegram</span>
            <span>↗</span>
          </a>
        </div>

        {/* SECTION: RINGKASAN ARUS KAS (CHART) */}
        {(activeTab === 'semua' || activeTab === 'anggaran') && (
          <Card glass={false} className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-[#091540] dark:text-white">Ringkasan Arus Kas (Pemasukan vs Pengeluaran)</span>
              </CardTitle>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" /> Masuk: Rp {totalIncome.toLocaleString('id-ID')}
                  <span className="inline-block w-3 h-3 rounded-full bg-rose-500 ml-2" /> Keluar: Rp {totalExpense.toLocaleString('id-ID')}
                </div>
              </div>
            </CardHeader>

            <div className="h-60 sm:h-72 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `Rp${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Nominal']}
                    contentStyle={{
                      borderRadius: '12px',
                      background: '#091540',
                      border: '1px solid #1e293b',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                      padding: '10px 14px',
                    }}
                    labelStyle={{ color: '#ffffff', fontWeight: 700, marginBottom: '4px' }}
                    itemStyle={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {cashFlowChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* SECTION: ALOKASI & MONITOR ANGGARAN (BUDGET TRACKER) */}
        {(activeTab === 'semua' || activeTab === 'anggaran') && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#091540] dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#4EA5D9]" />
                  <span>Target &amp; Alokasi Anggaran Bulanan (Budget)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pantau batas limit pengeluaran per kategori kos untuk mencegah pemborosan sebelum akhir bulan.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Total Plafon: <span className="text-[#4EA5D9] font-black">Rp {totalBudgetLimit.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {ALL_CATEGORIES.map((cat) => {
                const meta = CATEGORY_MAP[cat];
                const Icon = meta.icon;
                const limit = getCategoryLimit(cat);
                const spent = getCategorySpent(cat);
                const remaining = limit - spent;
                const isOverbudget = spent > limit;
                const percentage = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

                let progressColor: 'emerald' | 'amber' | 'rose' = 'emerald';
                if (percentage >= 90 || isOverbudget) progressColor = 'rose';
                else if (percentage >= 70) progressColor = 'amber';

                return (
                  <Card
                    key={cat}
                    glass={false}
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-[#091540] dark:text-white leading-tight">
                              {meta.label}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{cat}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openBudgetModal(cat)}
                          className="text-slate-400 hover:text-[#4EA5D9] p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          title="Ubah Limit Anggaran"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-500 dark:text-slate-400">
                            Rp {spent.toLocaleString('id-ID')}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200">
                            / Rp {limit.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <ProgressBar value={percentage} color={progressColor} size="md" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {isOverbudget ? 'Lebih anggaran' : 'Sisa kuota'}
                      </span>
                      <span
                        className={`font-black ${
                          isOverbudget
                            ? 'text-rose-600 dark:text-rose-400'
                            : remaining < limit * 0.2
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOverbudget ? '-' : ''}Rp {Math.abs(remaining).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: RIWAYAT TRANSAKSI KEUANGAN */}
        {(activeTab === 'semua' || activeTab === 'transaksi') && (
          <Card glass={false} className="border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#4EA5D9]" />
                <span className="text-[#091540] dark:text-white">Riwayat Transaksi Keuangan</span>
              </CardTitle>

              {/* Type filter pill switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar self-stretch sm:self-auto">
                {(['ALL', 'PEMASUKAN', 'PENGELUARAN'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center ${
                      activeFilter === filter
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {filter === 'ALL' ? 'Semua' : filter}
                  </button>
                ))}
              </div>
            </CardHeader>

            {/* Filter and Search Bar for Transactions */}
            <div className="px-4 pb-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTrx}
                    onChange={(e) => setSearchTrx(e.target.value)}
                    placeholder="Cari transaksi (misal: nasi goreng, wifi, kos)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4EA5D9] transition-all"
                  />
                  {searchTrx && (
                    <button
                      onClick={() => setSearchTrx('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category filter dropdown */}
                <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">Kategori:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4EA5D9] cursor-pointer"
                  >
                    <option value="ALL">Semua Kategori</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_MAP[cat]?.label || cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(searchTrx || categoryFilter !== 'ALL' || activeFilter !== 'ALL') && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Menampilkan <strong>{filteredTransactions.length}</strong> dari {transactions.length} transaksi
                  </span>
                  <button
                    onClick={() => {
                      setSearchTrx('');
                      setCategoryFilter('ALL');
                      setActiveFilter('ALL');
                    }}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3 pt-2">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada transaksi cocok</p>
                  <p className="text-xs text-slate-400 mb-4">
                    {searchTrx ? 'Tidak ditemukan transaksi dengan kata kunci tersebut.' : 'Catat transaksi pemasukan atau pengeluaran harian Anda.'}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openNewTrxModal('PENGELUARAN')}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Catat Transaksi Baru</span>
                  </Button>
                </div>
              ) : (
                filteredTransactions.map((trx) => {
                  const isIncome = trx.type === 'PEMASUKAN';
                  const catMeta = trx.category ? CATEGORY_MAP[trx.category] : null;

                  return (
                    <div
                      key={trx.id}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 text-sm ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {isIncome ? '↓' : '↑'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={isIncome ? 'emerald' : 'rose'}>{trx.type}</Badge>
                            {catMeta && (
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                                {catMeta.label}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">
                              {new Date(trx.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 break-words">
                            {trx.title}
                          </h4>
                          {trx.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {trx.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                        <span
                          className={`text-sm sm:text-base font-black ${
                            isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {isIncome ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditTrxModal(trx)}
                            className="text-slate-400 hover:text-[#4EA5D9] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Transaksi"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(trx.id)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        )}
      </div>

      {/* TRANSACTION MODAL (ADD / EDIT) */}
      <Modal
        isOpen={isTrxModalOpen}
        onClose={() => setIsTrxModalOpen(false)}
        title={editingTrxId ? 'Edit Transaksi Keuangan' : 'Tambah Transaksi Keuangan'}
      >
        <form onSubmit={handleAddTransactionSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setTrxType('PENGELUARAN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                trxType === 'PENGELUARAN' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setTrxType('PEMASUKAN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                trxType === 'PEMASUKAN' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kategori Transaksi
            </label>
            <select
              value={trxCategory}
              onChange={(e) => setTrxCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_MAP[cat]?.label || cat}
                </option>
              ))}
              {trxType === 'PEMASUKAN' && (
                <>
                  <option value="UANG_SAKU">Uang Saku Ortu</option>
                  <option value="BEASISWA">Beasiswa</option>
                  <option value="SIDE_HUSTLE">Side Hustle / Kerja Sampingan</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan Transaksi
            </label>
            <input
              type="text"
              required
              value={trxTitle}
              onChange={(e) => setTrxTitle(e.target.value)}
              placeholder="Contoh: Makan Nasi Warteg / Uang Saku Ortu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              required
              value={trxAmount}
              onChange={(e) => setTrxAmount(e.target.value)}
              placeholder="25000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              value={trxNotes}
              onChange={(e) => setTrxNotes(e.target.value)}
              placeholder="Contoh: Dibayar patungan sama teman kos"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsTrxModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant={trxType === 'PEMASUKAN' ? 'success' : 'danger'} size="sm">
              {editingTrxId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* BUDGET LIMIT MODAL */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title={`Atur Limit Anggaran: ${CATEGORY_MAP[selectedBudgetCategory]?.label || selectedBudgetCategory}`}
      >
        <form onSubmit={handleSaveBudgetLimit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Tentukan batas maksimal pengeluaran bulanan untuk kategori ini. Anda akan menerima peringatan jika mendekati batas.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Batas Anggaran Bulanan (Rp)
            </label>
            <input
              type="number"
              required
              min={0}
              step={10000}
              value={budgetLimitInput}
              onChange={(e) => setBudgetLimitInput(e.target.value)}
              placeholder="Contoh: 850000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400">Pilihan Cepat:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[100000, 250000, 500000, 850000, 1000000, 1500000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudgetLimitInput(String(preset))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Rp {preset.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Limit Anggaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
