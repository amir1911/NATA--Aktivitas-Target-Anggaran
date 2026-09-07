'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import {
  Wallet,
  GraduationCap,
  FolderOpen,
  Clock,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  ArrowDownLeft,
  Receipt,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNataStore } from '@/lib/store';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const {
    user,
    courses,
    schedules,
    tasks,
    addTask,
    updateTaskStatus,
    transactions,
    addTransaction,
  } = useNataStore();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDriveUrl, setNewDriveUrl] = useState('');

  // Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<'MAKAN' | 'KOS' | 'LAUNDRY' | 'KUOTA' | 'HIBURAN' | 'ALAT_TULIS' | 'LAINNYA'>('MAKAN');

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'PEMASUKAN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'PENGELUARAN')
    .reduce((sum, t) => sum + t.amount, 0);

  const walletBalance = totalIncome - totalExpense;

  const urgentTasksCount = tasks.filter(
    (t) => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'COMPLETED'
  ).length;

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addTask({
      courseName: newCourse || 'Umum',
      title: newTitle,
      description: 'Tugas baru ditambahkan dari Dashboard',
      priority: newPriority,
      status: 'TODO',
      dueDate: newDueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      driveUrl: newDriveUrl || undefined,
    });

    setNewTitle('');
    setNewDriveUrl('');
    setIsTaskModalOpen(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    addTransaction({
      type: 'PENGELUARAN',
      category: expCategory,
      amount: Number(expAmount),
      title: expTitle,
      date: new Date().toISOString(),
    });

    setExpTitle('');
    setExpAmount('');
    setIsExpenseModalOpen(false);
  };

  const categoryTotals: Record<string, number> = {
    Makan: 0,
    Kos: 0,
    Kuota: 0,
    Laundry: 0,
    Hiburan: 0,
    Lainnya: 0,
  };

  transactions.forEach((t) => {
    if (t.type === 'PENGELUARAN') {
      if (t.category === 'MAKAN') categoryTotals.Makan += t.amount;
      else if (t.category === 'KOS') categoryTotals.Kos += t.amount;
      else if (t.category === 'KUOTA') categoryTotals.Kuota += t.amount;
      else if (t.category === 'LAUNDRY') categoryTotals.Laundry += t.amount;
      else if (t.category === 'HIBURAN') categoryTotals.Hiburan += t.amount;
      else categoryTotals.Lainnya += t.amount;
    }
  });

  // Strict NATA Palette Colors for Charts
  const chartData = [
    { name: 'Makan', total: categoryTotals.Makan, fill: '#4EA5D9' },     // Sky Blue
    { name: 'Kos', total: categoryTotals.Kos, fill: '#8B5CF6' },       // Violet
    { name: 'Kuota', total: categoryTotals.Kuota, fill: '#22C55E' },     // Green
    { name: 'Laundry', total: categoryTotals.Laundry, fill: '#F59E0B' },   // Amber
    { name: 'Hiburan', total: categoryTotals.Hiburan, fill: '#EF4444' },   // Red
    { name: 'Lainnya', total: categoryTotals.Lainnya, fill: '#64748B' },   // Slate
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <Header
        title="Pusat Kendali NATA"
        onQuickTask={() => setIsTaskModalOpen(true)}
        onQuickExpense={() => setIsExpenseModalOpen(true)}
        onMenuToggle={onMenuToggle}
      />

      <div className="px-6 space-y-6">
        {/* Welcome Student Banner — Deep Navy Theme */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091540 0%, #132060 60%, #1A2B7C 100%)',
          }}
          className="p-6 rounded-3xl text-white shadow-xl shadow-navy-950/20 relative overflow-hidden"
        >
          {/* Ambient Decorative Orbs */}
          <div className="absolute -right-10 -top-10 w-80 h-80 bg-[#4EA5D9]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#4EA5D9]" />
                  Mahasiswa Anak Kos Mandiri
                </span>
                <span className="text-xs text-slate-300 font-medium">{user.email}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Halo, {user.name}! 👋
              </h2>
              <p className="text-sm text-slate-200 max-w-xl">
                💡 Kelola seluruh jadwal perkuliahan, tugas, link Google Drive, dan pencatatan keuangan kos Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/academic">
                <Button variant="secondary" size="sm" className="text-xs font-bold bg-white text-[#091540] hover:bg-slate-100 border-0 shadow-md">
                  <GraduationCap className="w-4 h-4 text-[#4EA5D9]" />
                  <span>Jadwal &amp; Tasks</span>
                </Button>
              </Link>
              <Link href="/finance">
                <Button variant="sky" size="sm" className="text-xs font-bold">
                  <Wallet className="w-4 h-4" />
                  <span>Cek Keuangan</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid Row — Strict Color Coding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Sisa Dompet Bersih"
            value={`Rp ${walletBalance.toLocaleString('id-ID')}`}
            subtitle="Pemasukan - Pengeluaran"
            icon={<Wallet className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="Total Pemasukan"
            value={`Rp ${totalIncome.toLocaleString('id-ID')}`}
            subtitle="Uang Saku + Side Hustle"
            icon={<ArrowDownLeft className="w-6 h-6" />}
            color="sky"
          />
          <StatCard
            title="Total Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString('id-ID')}`}
            subtitle="Pengeluaran Bulan Ini"
            icon={<ArrowUpRight className="w-6 h-6" />}
            color="rose"
          />
          <StatCard
            title="Tugas Aktif"
            value={`${tasks.filter((t) => t.status !== 'COMPLETED').length} Tugas`}
            subtitle={`${urgentTasksCount} Priority Urgent`}
            icon={<Clock className="w-6 h-6" />}
            color="violet"
          />
        </div>

        {/* Core 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Academic Tasks with Google Drive Link */}
            <Card className="border border-slate-200/80 bg-white">
              <CardHeader>
                <CardTitle>
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-[#091540]">Deadline Tugas &amp; Link Google Drive</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)} className="text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tugas Baru</span>
                  </Button>
                  <Link href="/academic" className="text-xs font-bold text-[#4EA5D9] hover:underline flex items-center gap-1">
                    Semua <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardHeader>

              <div className="space-y-3 mt-4">
                {tasks.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Belum ada tugas</p>
                    <p className="text-xs text-slate-400 mb-4">Klik tombol di bawah untuk menambahkan tugas kuliah Anda.</p>
                    <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
                      <Plus className="w-4 h-4" />
                      <span>Tambah Tugas Pertama</span>
                    </Button>
                  </div>
                ) : (
                  tasks.slice(0, 4).map((task) => {
                    const isUrgent = task.priority === 'URGENT' || task.priority === 'HIGH';
                    const isCompleted = task.status === 'COMPLETED';

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isCompleted
                            ? 'bg-slate-50 border-slate-200 opacity-75'
                            : isUrgent
                              ? 'bg-amber-50/60 border-amber-200'
                              : 'bg-white border-slate-200 hover:border-[#4EA5D9]/40'
                          }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={isUrgent ? 'rose' : 'blue'}>{task.priority}</Badge>
                            {task.courseName && (
                              <span className="text-xs font-bold text-[#4EA5D9]">
                                {task.courseName}
                              </span>
                            )}
                            <span className="text-xs text-slate-400">
                              • Deadline: {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#091540]">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {task.driveUrl && (
                            <a
                              href={task.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EBF5FC] text-[#4EA5D9] hover:bg-sky-100 transition-colors"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span>Link GDrive</span>
                            </a>
                          )}
                          <button
                            onClick={() => updateTaskStatus(task.id, isCompleted ? 'TODO' : 'COMPLETED')}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${isCompleted
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                            title="Tandai Selesai"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Today's Schedule Timeline */}
            <Card className="border border-slate-200/80 bg-white">
              <CardHeader>
                <CardTitle>
                  <Calendar className="w-5 h-5 text-[#4EA5D9]" />
                  <span className="text-[#091540]">Jadwal Kuliah</span>
                </CardTitle>
                <Link href="/academic" className="text-xs font-bold text-[#4EA5D9] hover:underline">
                  Kelola Jadwal
                </Link>
              </CardHeader>

              <div className="space-y-3 mt-4">
                {schedules.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-xs text-slate-400 mb-3">Belum ada jadwal kuliah yang dimasukkan.</p>
                    <Link href="/academic">
                      <Button variant="outline" size="sm">
                        + Input Jadwal Kuliah
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {schedules.slice(0, 4).map((sched) => (
                      <div
                        key={sched.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden hover:border-[#4EA5D9]/60 transition-all shadow-xs"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5"
                          style={{ backgroundColor: sched.color || '#4EA5D9' }}
                        />
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span>{sched.dayName} • {sched.startTime} - {sched.endTime}</span>
                          <Badge variant="blue">{sched.courseCode}</Badge>
                        </div>
                        <h4 className="text-sm font-extrabold text-[#091540] dark:text-white leading-snug">
                          {sched.courseName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          📍 Ruang: <span className="font-bold text-slate-800 dark:text-slate-100">{sched.room || 'R. Kelas'}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Analytics Chart Component */}
            <Card className="border border-slate-200/80 bg-white">
              <CardHeader>
                <CardTitle>
                  <Wallet className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-[#091540]">Distribusi Pengeluaran Kos</span>
                </CardTitle>
              </CardHeader>

              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `Rp${val / 1000}k`} />
                    <Tooltip
                      formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Pengeluaran']}
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
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column: Recent Transactions & Quick Actions (1 Col) */}
          <div className="space-y-6">
            <Card className="border border-slate-200/80 bg-white">
              <CardHeader>
                <CardTitle>
                  <Receipt className="w-5 h-5 text-[#4EA5D9]" />
                  <span className="text-[#091540]">Transaksi Terbaru</span>
                </CardTitle>
                <Link href="/finance" className="text-xs font-bold text-[#4EA5D9] hover:underline">
                  Kelola Keuangan
                </Link>
              </CardHeader>

              <div className="space-y-3 mt-4">
                {transactions.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-xs text-slate-400 mb-3">Belum ada catatan transaksi.</p>
                    <Button variant="primary" size="sm" onClick={() => setIsExpenseModalOpen(true)}>
                      <Plus className="w-4 h-4" />
                      <span>Catat Pengeluaran</span>
                    </Button>
                  </div>
                ) : (
                  transactions.slice(0, 5).map((trx) => {
                    const isIncome = trx.type === 'PEMASUKAN';
                    return (
                      <div
                        key={trx.id}
                        className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-[#4EA5D9]/50 flex items-center justify-between gap-3 text-xs transition-colors shadow-xs"
                      >
                        <div className="truncate space-y-0.5">
                          <p className="font-bold text-[#091540] dark:text-white truncate">{trx.title}</p>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{trx.category}</span>
                        </div>
                        <span className={`font-extrabold shrink-0 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {isIncome ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Tambah Tugas Kuliah Baru">
        <form onSubmit={handleAddTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Tugas / Praktikum
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Masukkan judul tugas..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mata Kuliah
              </label>
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Nama Mata Kuliah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prioritas
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              >
                <option value="LOW">Rendah (LOW)</option>
                <option value="MEDIUM">Sedang (MEDIUM)</option>
                <option value="HIGH">Tinggi (HIGH)</option>
                <option value="URGENT">Mendesak (URGENT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Deadline
            </label>
            <input
              type="date"
              required
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tautan Google Drive (Opsional)
            </label>
            <input
              type="url"
              value={newDriveUrl}
              onChange={(e) => setNewDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Tugas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Catat Pengeluaran Baru">
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keterangan Pengeluaran
            </label>
            <input
              type="text"
              required
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="Contoh: Makan Siang Nasi Padang"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nominal (Rp)
              </label>
              <input
                type="number"
                required
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              >
                <option value="MAKAN">Makan &amp; Minum</option>
                <option value="KOS">Uang Kos</option>
                <option value="LAUNDRY">Laundry</option>
                <option value="KUOTA">Kuota &amp; Wi-Fi</option>
                <option value="HIBURAN">Hiburan &amp; Nongkrong</option>
                <option value="ALAT_TULIS">Alat Tulis &amp; Kuliah</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsExpenseModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="success" size="sm">
              Simpan Pengeluaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
