'use client';

import React, { useState, useContext } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  PieChart as PieChartIcon,
  Trash2,
  Pencil,
} from 'lucide-react';
import { FaChromecast } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNataStore, TransactionItem } from '@/lib/store';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function FinancePage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useNataStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PEMASUKAN' | 'PENGELUARAN'>('ALL');
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);

  // Edit State
  const [editingTrxId, setEditingTrxId] = useState<string | null>(null);

  // Trx form state
  const [trxType, setTrxType] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PENGELUARAN');
  const [trxTitle, setTrxTitle] = useState('');
  const [trxAmount, setTrxAmount] = useState('');

  const totalIncome = transactions
    .filter((t) => t.type === 'PEMASUKAN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'PENGELUARAN')
    .reduce((sum, t) => sum + t.amount, 0);

  const walletBalance = totalIncome - totalExpense;

  const openNewTrxModal = (type: 'PEMASUKAN' | 'PENGELUARAN' = 'PENGELUARAN') => {
    setEditingTrxId(null);
    setTrxType(type);
    setTrxTitle('');
    setTrxAmount('');
    setIsTrxModalOpen(true);
  };

  const openEditTrxModal = (trx: TransactionItem) => {
    setEditingTrxId(trx.id);
    setTrxType(trx.type);
    setTrxTitle(trx.title);
    setTrxAmount(String(trx.amount));
    setIsTrxModalOpen(true);
  };

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxTitle || !trxAmount) return;

    if (editingTrxId) {
      updateTransaction(editingTrxId, {
        type: trxType,
        title: trxTitle,
        amount: Number(trxAmount),
      });
    } else {
      addTransaction({
        type: trxType,
        category: 'LAINNYA',
        amount: Number(trxAmount),
        title: trxTitle,
        date: new Date().toISOString(),
      });
    }

    setEditingTrxId(null);
    setTrxTitle('');
    setTrxAmount('');
    setIsTrxModalOpen(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === 'ALL') return true;
    return t.type === activeFilter;
  });

  const cashFlowChartData = [
    { name: 'Total Pemasukan', total: totalIncome, fill: '#10b981' },
    { name: 'Total Pengeluaran', total: totalExpense, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Pencatatan Keuangan Kos"
        onQuickExpense={() => openNewTrxModal('PENGELUARAN')}
        onMenuToggle={onMenuToggle}
      />

      <div className="px-6 space-y-6">
        {/* Cash Flow Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Pemasukan"
            value={`Rp ${totalIncome.toLocaleString('id-ID')}`}
            subtitle="Uang Saku Ortu + Side Hustle"
            icon={<ArrowDownLeft className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="Total Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString('id-ID')}`}
            subtitle="Pengeluaran Kos & Harian"
            icon={<ArrowUpRight className="w-6 h-6" />}
            color="rose"
          />
          <StatCard
            title="Sisa Dompet Bersih"
            value={`Rp ${walletBalance.toLocaleString('id-ID')}`}
            subtitle="Pemasukan - Pengeluaran"
            icon={<Wallet className="w-6 h-6" />}
            color="sky"
          />
        </div>

        {/* Telegram Bot Integration Banner */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 font-bold">
              <FaChromecast className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Input Cepat via Telegram Bot
                </h4>
                <Badge variant="sky">Aktif (@NataAmir_bot)</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketik langsung di Telegram (misal: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono">keluar 25000 Nasi Padang</code> atau <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono">masuk 500k Uang Saku</code>) & otomatis masuk ke sini!
              </p>
            </div>
          </div>

          <a
            href="https://t.me/NataAmir_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <FaChromecast className="w-3.5 h-3.5" />
            <span>Buka Bot Telegram</span>
            <span>↗</span>
          </a>
        </div>

        {/* Section 1: Chart Ringkasan Arus Kas */}
        <Card>
          <CardHeader>
            <CardTitle>
              <PieChartIcon className="w-5 h-5 text-[#8B5CF6]" />
              <span>Ringkasan Arus Kas (Pemasukan vs Pengeluaran)</span>
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openNewTrxModal('PEMASUKAN')}
                className="text-xs"
              >
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Pemasukan Baru</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openNewTrxModal('PENGELUARAN')}
                className="text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Pengeluaran</span>
              </Button>
            </div>
          </CardHeader>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `Rp${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Jumlah']}
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

        {/* Section 2: Log Transaksi Keuangan */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Receipt className="w-5 h-5 text-[#4EA5D9]" />
              <span>Riwayat Transaksi Keuangan</span>
            </CardTitle>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(['ALL', 'PEMASUKAN', 'PENGELUARAN'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === filter
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {filter === 'ALL' ? 'Semua' : filter}
                </button>
              ))}
            </div>
          </CardHeader>

          <div className="space-y-3 mt-4">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada transaksi</p>
                <p className="text-xs text-slate-400 mb-4">Catat transaksi pemasukan atau pengeluaran harian Anda.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openNewTrxModal('PENGELUARAN')}
                >
                  <Plus className="w-4 h-4" />
                  <span>Catat Transaksi Pertama</span>
                </Button>
              </div>
            ) : (
              filteredTransactions.map((trx) => {
                const isIncome = trx.type === 'PEMASUKAN';

                return (
                  <div
                    key={trx.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${isIncome
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                      >
                        {isIncome ? '↓' : '↑'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isIncome ? 'emerald' : 'rose'}>{trx.type}</Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(trx.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{trx.title}</h4>
                        {trx.notes && <p className="text-xs text-slate-400">{trx.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-sm font-extrabold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                          }`}
                      >
                        {isIncome ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                      </span>
                      <button
                        onClick={() => openEditTrxModal(trx)}
                        className="text-slate-400 hover:text-[#4EA5D9] p-1 cursor-pointer"
                        title="Edit Transaksi"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(trx.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Transaction Modal (With Edit Capability) */}
      <Modal isOpen={isTrxModalOpen} onClose={() => setIsTrxModalOpen(false)} title={editingTrxId ? 'Edit Transaksi Keuangan' : 'Tambah Transaksi Keuangan'}>
        <form onSubmit={handleAddTransactionSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setTrxType('PENGELUARAN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${trxType === 'PENGELUARAN' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500'
                }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setTrxType('PEMASUKAN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${trxType === 'PEMASUKAN' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'
                }`}
            >
              Pemasukan
            </button>
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
    </div>
  );
}
