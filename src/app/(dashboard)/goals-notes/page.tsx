'use client';

import React, { useState, useContext } from 'react';
import { FileText, Plus, Pin, Trash2, Pencil } from 'lucide-react';
import { MdGpsFixed } from 'react-icons/md';
import { FaChromecast } from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNataStore, NoteItem, PersonalGoalItem } from '@/lib/store';

export default function GoalsNotesPage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const {
    notes,
    addNote,
    updateNote,
    togglePinNote,
    deleteNote,
    personalGoals,
    addPersonalGoal,
    updatePersonalGoal,
    togglePersonalGoal,
    deletePersonalGoal,
  } = useNataStore();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Kuliah');

  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Akademik');

  const openNewNoteModal = () => {
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('Kuliah');
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setIsNoteModalOpen(true);
  };

  const openNewGoalModal = () => {
    setEditingGoalId(null);
    setGoalTitle('');
    setGoalCategory('Akademik');
    setIsGoalModalOpen(true);
  };

  const openEditGoalModal = (goal: PersonalGoalItem) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalCategory(goal.category);
    setIsGoalModalOpen(true);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
      });
    } else {
      addNote({
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        isPinned: false,
      });
    }

    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle) return;

    if (editingGoalId) {
      updatePersonalGoal(editingGoalId, {
        title: goalTitle,
        category: goalCategory,
      });
    } else {
      addPersonalGoal(goalTitle, goalCategory);
    }

    setEditingGoalId(null);
    setGoalTitle('');
    setIsGoalModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <Header title="Target & Catatan Anak Kos" onMenuToggle={onMenuToggle} />

      <div className="px-6 space-y-6">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#091540] via-[#0D1E56] to-[#13286F] p-6 text-white shadow-xl shadow-[#091540]/10 border border-[#091540]">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#4EA5D9]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-[#8B5CF6]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200">
                <MdGpsFixed className="w-3.5 h-3.5 text-[#4EA5D9]" />
                <span>Milestone & Jurnal Pribadi</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Kelola Target & Catatan Penting
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                Catat IPK impian, sertifikasi, Wi-Fi kos, ringkasan kuliah, dan hal penting lainnya agar ritme kos kamu tetap terorganisir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={openNewGoalModal}
                className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Target Baru</span>
              </button>
              <button
                onClick={openNewNoteModal}
                className="px-4 py-2.5 rounded-xl bg-[#4EA5D9] hover:bg-[#3B82F6] text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Catatan Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Bot Sync Card */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
              <FaChromecast className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Terhubung ke Bot Telegram</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 text-[10px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif (@NataAmir_bot)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Kelola target & catatan langsung lewat Telegram! Ketik <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px] text-sky-700 dark:text-sky-300 font-bold border border-slate-300 dark:border-slate-700">/target</code> untuk lihat milestone, atau <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px] text-sky-700 dark:text-sky-300 font-bold border border-slate-300 dark:border-slate-700">catat: ...</code> untuk simpan catatan cepat.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="https://t.me/NataAmir_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <FaChromecast className="w-3.5 h-3.5" />
              <span>Buka Bot Telegram</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Section 1: Target Milestone Semester Ini */}
        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-[#091540]">
              <div className="p-2 rounded-xl bg-purple-50 text-[#8B5CF6]">
                <MdGpsFixed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base">Target Milestone Semester Ini</span>
                <p className="text-xs font-normal text-slate-500">Lacak pencapaian akademik, skill, dan finansial kamu</p>
              </div>
            </CardTitle>
            <Badge variant="purple" className="px-3 py-1 text-xs">
              {personalGoals.filter((g) => g.completed).length} dari {personalGoals.length} Selesai
            </Badge>
          </CardHeader>

          {personalGoals.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl mt-4 bg-slate-50/50">
              <MdGpsFixed className="w-10 h-10 text-[#8B5CF6]/50 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#091540]">Belum Ada Target</p>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Tambahkan target seperti IPK ≥ 3.80, sertifikasi skill, atau tabungan kos semester ini.</p>
              <Button variant="sky" size="sm" onClick={openNewGoalModal}>
                <Plus className="w-4 h-4" />
                <span>Tambah Target Pertama</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {personalGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${goal.completed
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                    }`}
                >
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => togglePersonalGoal(goal.id)}>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs transition-colors ${goal.completed ? 'bg-emerald-500 text-white shadow-xs' : 'border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-[#8B5CF6]'
                        }`}
                    >
                      ✓
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold ${goal.completed ? 'line-through opacity-75 text-emerald-800 dark:text-emerald-300' : 'text-[#091540] dark:text-white'}`}>
                        {goal.title}
                      </h4>
                      <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-[10px] font-bold text-[#8B5CF6] dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditGoalModal(goal)}
                      className="text-slate-400 hover:text-[#4EA5D9] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Target"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePersonalGoal(goal.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Target"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Section 2: Catatan Kuliah & Info Kos */}
        <Card className="border border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-[#091540]">
              <div className="p-2 rounded-xl bg-sky-50 text-[#4EA5D9]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base">Catatan Cepat Kuliah & Info Kos</span>
                <p className="text-xs font-normal text-slate-500">Simpan informasi penting yang sering diakses</p>
              </div>
            </CardTitle>

            <Button variant="sky" size="sm" onClick={openNewNoteModal} className="text-xs">
              <Plus className="w-4 h-4" />
              <span>Buat Catatan</span>
            </Button>
          </CardHeader>

          {notes.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl mt-4 bg-slate-50/50">
              <FileText className="w-10 h-10 text-[#4EA5D9]/50 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#091540]">Belum Ada Catatan</p>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">Simpan ringkasan kuliah, Wi-Fi kos, jadwal piket, atau daftar belanjaan Anda.</p>
              <Button variant="sky" size="sm" onClick={openNewNoteModal}>
                <Plus className="w-4 h-4" />
                <span>Buat Catatan Pertama</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 relative ${note.isPinned
                    ? 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-300 dark:border-amber-700/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={note.category === 'Kos' ? 'rose' : note.category === 'Kuliah' ? 'sky' : 'purple'}>
                      {note.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditNoteModal(note)}
                        className="text-slate-400 hover:text-[#4EA5D9] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Catatan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => togglePinNote(note.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${note.isPinned ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        title={note.isPinned ? 'Lepas Pin' : 'Sematkan Catatan'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#091540] dark:text-white leading-snug">{note.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {note.content}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>{note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Goal Modal */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingGoalId ? 'Edit Target' : 'Tambah Target Baru'}>
        <form onSubmit={handleAddGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#091540] mb-1.5">Target / Milestone</label>
            <input
              type="text"
              required
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Contoh: Target IPK ≥ 3.80 / Sertifikasi Skill"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#091540] focus:outline-none focus:border-[#091540] focus:ring-2 focus:ring-[#091540]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#091540] mb-1.5">Kategori Target</label>
            <select
              value={goalCategory}
              onChange={(e) => setGoalCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#091540] focus:outline-none focus:border-[#091540]"
            >
              <option value="Akademik">Akademik & IPK</option>
              <option value="Skill">Skill & Sertifikasi</option>
              <option value="Finansial">Finansial & Tabungan</option>
              <option value="Pribadi">Pribadi / Kesehatan</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsGoalModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingGoalId ? 'Simpan Perubahan Target' : 'Simpan Target'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title={editingNoteId ? 'Edit Catatan' : 'Buat Catatan Baru'}>
        <form onSubmit={handleAddNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#091540] mb-1.5">Judul Catatan</label>
            <input
              type="text"
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Contoh: Informasi Wi-Fi Kos / Catatan Kuliah"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#091540] focus:outline-none focus:border-[#091540] focus:ring-2 focus:ring-[#091540]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#091540] mb-1.5">Kategori</label>
            <select
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#091540] focus:outline-none focus:border-[#091540]"
            >
              <option value="Kuliah">Kuliah & Tugas</option>
              <option value="Kos">Kos & Rumah</option>
              <option value="Belanja">Belanjaan & Kebutuhan</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#091540] mb-1.5">Isi Catatan</label>
            <textarea
              required
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Tulis ringkasan atau catatan penting di sini..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#091540] focus:outline-none focus:border-[#091540] focus:ring-2 focus:ring-[#091540]/10 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNoteModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingNoteId ? 'Simpan Perubahan Catatan' : 'Simpan Catatan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
