import { supabaseAdmin } from './supabase-admin';
import {
  INITIAL_PERSONAL_GOALS,
  INITIAL_NOTES,
  INITIAL_SAVINGS_GOALS,
  PersonalGoalItem,
  NoteItem,
  SavingsGoalItem,
} from './mockData';

export interface TelegramGoalItem {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  created_at?: string;
}

export interface TelegramNoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  tags?: string | null;
  updated_at?: string;
  created_at?: string;
}

/**
 * Mengambil daftar target pribadi dari Supabase (fallback ke mock data)
 */
export async function getPersonalGoals(): Promise<TelegramGoalItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('personal_goals')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((g) => ({
        id: g.id,
        title: g.title,
        completed: Boolean(g.completed),
        category: g.category || 'Akademik',
        created_at: g.created_at,
      }));
    }
  } catch (err) {
    console.warn('Gagal ambil personal_goals dari Supabase, menggunakan mock data:', err);
  }

  return INITIAL_PERSONAL_GOALS.map((g) => ({
    id: g.id,
    title: g.title,
    completed: g.completed,
    category: g.category,
  }));
}

/**
 * Mengambil daftar catatan dari Supabase (fallback ke mock data)
 */
export async function getNotes(): Promise<TelegramNoteItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        category: n.category || 'Umum',
        is_pinned: Boolean(n.is_pinned),
        tags: n.tags,
        updated_at: n.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Gagal ambil notes dari Supabase, menggunakan mock data:', err);
  }

  return INITIAL_NOTES.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    category: n.category,
    is_pinned: n.isPinned,
    tags: n.tags,
    updated_at: n.updatedAt,
  }));
}

/**
 * Format progress bar teks sederhana
 */
function renderProgressBar(percent: number, totalBlocks = 10): string {
  const filled = Math.round((percent / 100) * totalBlocks);
  const empty = totalBlocks - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Format daftar target untuk Telegram
 */
export function formatGoalsList(goals: TelegramGoalItem[]): string {
  if (goals.length === 0) {
    return `🎯 *TARGET & MILESTONE SEMESTER*

Belum ada target yang tersimpan.

💡 *Cara Tambah Target Baru:*
• Ketik: \`+target Raih IPK 3.80 [Akademik]\`
• Atau: \`/targetbaru Lulus Sertifikasi Dicoding\``;
  }

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const bar = renderProgressBar(percentage);

  let text = `🎯 *TARGET & MILESTONE SEMESTER*\n\n`;
  text += `📊 *Progres:* ${completedCount} dari ${totalCount} Tercapai (${percentage}%)\n`;
  text += `\`[${bar}]\` ${percentage}%\n\n`;

  goals.forEach((g, index) => {
    const statusIcon = g.completed ? '✅' : '⏳';
    const num = index + 1;
    const catBadge = `[${g.category}]`;
    const titleText = g.completed ? `~${g.title}~` : `*${g.title}*`;
    text += `${num}. ${statusIcon} ${catBadge} ${titleText}\n`;
  });

  text += `\n──────────────────────\n`;
  text += `💡 *Perintah Cepat Target:*\n`;
  text += `• \`/selesaitarget [nomor]\` — Contoh: \`/selesaitarget 1\`\n`;
  text += `• \`+target [nama target] [kategori]\` — Tambah baru\n`;
  text += `• \`/targettabungan\` — Cek target tabungan kos\n`;
  text += `🌐 _Tersinkron langsung dengan website dashboard!_`;

  return text;
}

/**
 * Format daftar catatan untuk Telegram
 */
export function formatNotesList(notes: TelegramNoteItem[]): string {
  if (notes.length === 0) {
    return `📝 *CATATAN KULIAH & INFO KOS*

Belum ada catatan yang tersimpan.

💡 *Cara Buat Catatan Baru:*
• Ketik: \`catat: Password Wifi Kos adalah 123456\`
• Atau: \`/catat Info Kos | Jam malam gerbang 23.00 WIB\``;
  }

  let text = `📝 *DAFTAR CATATAN TERSIMPAN*\n`;
  text += `Total: *${notes.length} Catatan*\n\n`;

  notes.forEach((n, index) => {
    const num = index + 1;
    const pinBadge = n.is_pinned ? '📌 ' : '📝 ';
    const cleanContent = n.content.replace(/\n/g, ' ');
    const snippet = cleanContent.length > 55 ? cleanContent.substring(0, 55) + '...' : cleanContent;

    text += `${num}. ${pinBadge}*${n.title}* \`[${n.category}]\`\n`;
    text += `   _${snippet}_\n\n`;
  });

  text += `──────────────────────\n`;
  text += `💡 *Perintah Catatan:*\n`;
  text += `• \`/catatan [nomor/kata kunci]\` — Buka isi lengkap (cth: \`/catatan wifi\` atau \`/catatan 1\`)\n`;
  text += `• \`catat: [isi catatan]\` — Simpan catatan baru cepat\n`;
  text += `• \`/catat [Judul] | [Isi Catatan]\` — Simpan dengan judul rapi\n`;
  text += `• \`/pincatatan [nomor]\` — Sematkan catatan penting\n`;

  return text;
}

/**
 * Format detail isi sebuah catatan
 */
export function formatNoteDetail(note: TelegramNoteItem, indexNumber?: number): string {
  const pinText = note.is_pinned ? '📌 Disematkan' : '📝 Catatan';
  const prefix = indexNumber ? `#${indexNumber} ` : '';

  let text = `📋 *DETAIL CATATAN ${prefix}*\n\n`;
  text += `*${note.title}*\n`;
  text += `📂 Kategori: *${note.category}* (${pinText})\n`;
  if (note.tags) {
    text += `🏷️ Tags: \`${note.tags}\`\n`;
  }
  text += `\n──────────────────────\n`;
  text += `${note.content}\n`;
  text += `──────────────────────\n`;
  text += `🌐 _Tersimpan di dashboard website NATA._`;

  return text;
}

/**
 * Format daftar target tabungan (Savings)
 */
export function formatSavingsList(savings: SavingsGoalItem[]): string {
  if (savings.length === 0) {
    return `💰 *TARGET TABUNGAN KOS*\n\nBelum ada target tabungan yang dibuat di website.`;
  }

  const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  let text = `💰 *TARGET TABUNGAN & FINANSIAL*\n\n`;

  savings.forEach((s, i) => {
    const num = i + 1;
    const percent = Math.min(100, Math.round((s.currentAmount / s.targetAmount) * 100));
    const bar = renderProgressBar(percent, 8);

    text += `${num}. *${s.title}*\n`;
    text += `   💵 ${formatRp(s.currentAmount)} / ${formatRp(s.targetAmount)}\n`;
    text += `   \`[${bar}]\` ${percent}%\n`;
    if (s.deadline) {
      text += `   📅 Deadline: ${s.deadline}\n`;
    }
    text += `\n`;
  });

  text += `──────────────────────\n`;
  text += `🌐 _Kelola target tabungan lengkap di menu Keuangan website NATA._`;

  return text;
}

/**
 * Auto-detect kategori target berdasarkan kata kunci
 */
function detectGoalCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/ipk|kuliah|matkul|lulus|skripsi|sidang|uts|uas|tugas|semester/i.test(lower)) {
    return 'Akademik';
  }
  if (/tabung|uang|dana|hemat|rupiah|rp|invest|saldo|kas/i.test(lower)) {
    return 'Finansial';
  }
  if (/sertifikasi|belajar|coding|nextjs|python|aws|dicoding|skill|bahasa|toefl|kursus/i.test(lower)) {
    return 'Skill';
  }
  if (/kos|kamar|piket|kasur|meja|lemari|sapu|laundry/i.test(lower)) {
    return 'Kos';
  }
  return 'Pribadi';
}

/**
 * Auto-detect kategori catatan berdasarkan kata kunci
 */
function detectNoteCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/wifi|wi-fi|password|ibu kos|kosan|kamar|gerbang|piket|kontrak|kunci/i.test(lower)) {
    return 'Kos';
  }
  if (/matkul|kuliah|dosen|tugas|kelompok|praktikum|materi|ujian|kampus/i.test(lower)) {
    return 'Kuliah';
  }
  return 'Umum';
}

/**
 * Tambah target baru via Telegram ke Supabase
 */
export async function addPersonalGoalFromTelegram(rawInput: string): Promise<{ success: boolean; goal?: TelegramGoalItem; error?: string }> {
  let title = rawInput.trim();
  let category = 'Akademik';

  const tagMatch = title.match(/\[(.*?)\]|\((.*?)\)/);
  if (tagMatch) {
    const rawCat = (tagMatch[1] || tagMatch[2] || '').trim();
    if (rawCat) {
      if (/akademik/i.test(rawCat)) category = 'Akademik';
      else if (/skill/i.test(rawCat)) category = 'Skill';
      else if (/finansial|keuangan/i.test(rawCat)) category = 'Finansial';
      else if (/kos/i.test(rawCat)) category = 'Kos';
      else category = rawCat;
    }
    title = title.replace(tagMatch[0], '').trim();
  } else {
    category = detectGoalCategory(title);
  }

  if (!title) {
    return { success: false, error: 'Judul target tidak boleh kosong.' };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('personal_goals')
      .insert([{
        title,
        category,
        completed: false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase addPersonalGoalFromTelegram error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      goal: {
        id: data.id,
        title: data.title,
        completed: data.completed,
        category: data.category,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Tandai target sebagai selesai dari Telegram
 */
export async function completePersonalGoalFromTelegram(identifier: string): Promise<{ success: boolean; goal?: TelegramGoalItem; error?: string }> {
  const goals = await getPersonalGoals();
  if (goals.length === 0) {
    return { success: false, error: 'Belum ada target yang tersimpan.' };
  }

  let targetGoal: TelegramGoalItem | undefined;

  const numIndex = parseInt(identifier.trim(), 10);
  if (!isNaN(numIndex) && numIndex >= 1 && numIndex <= goals.length) {
    targetGoal = goals[numIndex - 1];
  } else {
    const lowerId = identifier.toLowerCase().trim();
    targetGoal = goals.find((g) => g.title.toLowerCase().includes(lowerId) || g.id === identifier);
  }

  if (!targetGoal) {
    return { success: false, error: `Target "${identifier}" tidak ditemukan. Silakan cek nomor target dengan perintah \`/target\`.` };
  }

  try {
    const { error } = await supabaseAdmin
      .from('personal_goals')
      .update({ completed: true })
      .eq('id', targetGoal.id);

    if (error) {
      return { success: false, error: error.message };
    }

    targetGoal.completed = true;
    return { success: true, goal: targetGoal };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Tambah catatan baru via Telegram ke Supabase
 */
export async function addNoteFromTelegram(rawInput: string): Promise<{ success: boolean; note?: TelegramNoteItem; error?: string }> {
  let title = '';
  let content = '';
  let category = 'Umum';

  const cleanInput = rawInput.trim();

  if (cleanInput.includes('|')) {
    const parts = cleanInput.split('|');
    title = parts[0].trim();
    content = parts.slice(1).join('|').trim();
  } else if (cleanInput.includes('\n')) {
    const lines = cleanInput.split('\n');
    title = lines[0].trim();
    content = lines.slice(1).join('\n').trim();
  } else {
    const words = cleanInput.split(/\s+/);
    if (words.length <= 6) {
      title = cleanInput;
      content = cleanInput;
    } else {
      title = words.slice(0, 5).join(' ') + '...';
      content = cleanInput;
    }
  }

  category = detectNoteCategory(`${title} ${content}`);

  if (!title || !content) {
    return { success: false, error: 'Format catatan tidak valid.' };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .insert([{
        title,
        content,
        category,
        is_pinned: false,
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase addNoteFromTelegram error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      note: {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        is_pinned: data.is_pinned,
        tags: data.tags,
        updated_at: data.updated_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Toggle pin catatan via Telegram
 */
export async function togglePinNoteFromTelegram(identifier: string): Promise<{ success: boolean; note?: TelegramNoteItem; error?: string }> {
  const notes = await getNotes();
  if (notes.length === 0) return { success: false, error: 'Belum ada catatan tersimpan.' };

  let targetNote: TelegramNoteItem | undefined;
  const num = parseInt(identifier.trim(), 10);

  if (!isNaN(num) && num >= 1 && num <= notes.length) {
    targetNote = notes[num - 1];
  } else {
    const q = identifier.toLowerCase().trim();
    targetNote = notes.find((n) => n.title.toLowerCase().includes(q) || n.id === identifier);
  }

  if (!targetNote) {
    return { success: false, error: `Catatan "${identifier}" tidak ditemukan.` };
  }

  const newPin = !targetNote.is_pinned;

  try {
    const { error } = await supabaseAdmin
      .from('notes')
      .update({ is_pinned: newPin, updated_at: new Date().toISOString() })
      .eq('id', targetNote.id);

    if (error) return { success: false, error: error.message };

    targetNote.is_pinned = newPin;
    return { success: true, note: targetNote };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Handler utama untuk seluruh query bot seputar Target & Catatan
 */
export async function handleGoalsNotesBotQuery(rawText: string): Promise<string | null> {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // ==========================================
  // A. FITUR TARGET (MILESTONE & TABUNGAN)
  // ==========================================

  // 1. Tambah Target Baru (cth: "+target Belajar Next.js [Skill]", "/targetbaru IPK 3.8", "target baru: ...")
  const isAddTargetCommand =
    lower.startsWith('+target') ||
    lower.startsWith('/targetbaru') ||
    lower.startsWith('/tambahtarget') ||
    lower.startsWith('target baru:') ||
    lower.startsWith('target:');

  if (isAddTargetCommand) {
    let payload = text
      .replace(/^(\+target|\/targetbaru|\/tambahtarget|target baru:|target:)\s*/i, '')
      .trim();

    if (!payload) {
      return `⚠️ *Format Tambah Target Belum Lengkap*

Silakan tuliskan targetmu, contoh:
• \`+target Raih IPK ≥ 3.80 [Akademik]\`
• \`/targetbaru Lulus Ujian Sertifikasi [Skill]\`
• \`target: Beli Kasur Busa Kos [Kos]\``;
    }

    const result = await addPersonalGoalFromTelegram(payload);
    if (!result.success || !result.goal) {
      return `❌ *Gagal Menyimpan Target*\n\nTerjadi kesalahan: \`${result.error}\``;
    }

    return `🎯 *Target Berhasil Ditambahkan!*

📌 *Target:* *${result.goal.title}*
📂 *Kategori:* ${result.goal.category}
Status: ⏳ Sedang Berjalan

🌐 _Target otomatis muncul di halaman Target & Catatan dashboard website!_
Ketik \`/target\` untuk melihat semua milestone.`;
  }

  // 2. Tandai Target Selesai (cth: "/selesaitarget 1", "selesai target 1", "/cektarget 2")
  const isCompleteTargetCommand =
    lower.startsWith('/selesaitarget') ||
    lower.startsWith('/cektarget') ||
    lower.startsWith('selesai target') ||
    lower.startsWith('/selesai target');

  if (isCompleteTargetCommand) {
    const payload = text
      .replace(/^(\/selesaitarget|\/cektarget|\/selesai target|selesai target)\s*/i, '')
      .trim();

    if (!payload) {
      return `⚠️ *Tentukan Nomor Target*

Ketik nomor target yang sudah selesai, contoh:
• \`/selesaitarget 1\`
• \`selesai target 2\`

Ketik \`/target\` untuk melihat nomor urut targetmu.`;
    }

    const result = await completePersonalGoalFromTelegram(payload);
    if (!result.success || !result.goal) {
      return `⚠️ ${result.error || 'Gagal menandai target selesai.'}`;
    }

    return `🎉 *SELAMAT! TARGET TERCAPAI!* 🏆

✅ *Target:* *${result.goal.title}*
📂 *Kategori:* ${result.goal.category}
Status: ✅ Selesai

Luar biasa! Satu langkah lebih dekat menuju impianmu. 🚀
Ketik \`/target\` untuk melihat progres terbaru.`;
  }

  // 3. Target Tabungan (cth: "/tabungan", "/targettabungan", "target tabungan")
  const isSavingsQuery =
    lower === '/tabungan' ||
    lower === '/targettabungan' ||
    lower === '/savings' ||
    lower === 'tabungan' ||
    lower === 'target tabungan' ||
    lower === 'daftar tabungan';

  if (isSavingsQuery) {
    return formatSavingsList(INITIAL_SAVINGS_GOALS);
  }

  // 4. Lihat Daftar Target (cth: "/target", "/goals", "target", "daftar target", "target saya")
  const isListTargetQuery =
    lower === '/target' ||
    lower === '/goals' ||
    lower === '/milestone' ||
    lower === '/targets' ||
    lower === 'target' ||
    lower === 'daftar target' ||
    lower === 'target saya' ||
    lower === 'lihat target' ||
    lower === 'target semester' ||
    lower === 'list target';

  if (isListTargetQuery) {
    const goals = await getPersonalGoals();
    return formatGoalsList(goals);
  }

  // ==========================================
  // B. FITUR CATATAN (NOTES & INFO KOS)
  // ==========================================

  // 1. Tambah Catatan Baru (cth: "catat: wifi kos 123", "/catat Judul | Isi", "note: ...", "catatan: ...")
  const isAddNoteCommand =
    lower.startsWith('/catat ') ||
    lower.startsWith('/catatbaru ') ||
    lower.startsWith('catat:') ||
    lower.startsWith('catatan:') ||
    lower.startsWith('note:');

  if (isAddNoteCommand) {
    const payload = text
      .replace(/^(\/catatbaru|\/catat|catat:|catatan:|note:)\s*/i, '')
      .trim();

    if (!payload) {
      return `⚠️ *Catatan Masih Kosong*

Contoh cara mencatat:
• \`catat: Password wifi kos adalah AnakKos2026\`
• \`/catat Jadwal Piket | Senin Andi & Budi, Rabu Siti\``;
    }

    const result = await addNoteFromTelegram(payload);
    if (!result.success || !result.note) {
      return `❌ *Gagal Menyimpan Catatan*\n\nTerjadi kesalahan: \`${result.error}\``;
    }

    return `✅ *Catatan Berhasil Disimpan!* 📝

📌 *Judul:* *${result.note.title}*
📂 *Kategori:* ${result.note.category}
📝 *Isi:*
_${result.note.content}_

🌐 _Catatan langsung tersinkron di dashboard website NATA!_
Ketik \`/catatan\` untuk melihat semua catatan.`;
  }

  // 2. Sematkan / Pin Catatan (cth: "/pincatatan 1")
  const isPinNoteCommand = lower.startsWith('/pincatatan') || lower.startsWith('/pinnote');
  if (isPinNoteCommand) {
    const payload = text.replace(/^(\/pincatatan|\/pinnote)\s*/i, '').trim();
    if (!payload) {
      return `⚠️ Ketikkan nomor catatan yang ingin disematkan, contoh: \`/pincatatan 1\``;
    }

    const result = await togglePinNoteFromTelegram(payload);
    if (!result.success || !result.note) {
      return `⚠️ ${result.error || 'Gagal mengubah status pin catatan.'}`;
    }

    const statusStr = result.note.is_pinned ? '📌 berhasil disematkan di atas' : 'dilepas dari pin';
    return `✅ Catatan *${result.note.title}* ${statusStr}!`;
  }

  // 3. Cari / Buka Catatan Spesifik (cth: "/catatan wifi", "/catatan 1", "catatan kos")
  if (lower.startsWith('/catatan ') || lower.startsWith('/note ') || lower.startsWith('cari catatan ')) {
    const query = text.replace(/^(\/catatan|\/note|cari catatan)\s*/i, '').trim();
    const notes = await getNotes();

    if (notes.length === 0) {
      return `📝 Belum ada catatan yang tersimpan.`;
    }

    const num = parseInt(query, 10);
    if (!isNaN(num) && num >= 1 && num <= notes.length) {
      return formatNoteDetail(notes[num - 1], num);
    }

    const qLower = query.toLowerCase();
    const matches = notes.filter(
      (n) => n.title.toLowerCase().includes(qLower) || n.content.toLowerCase().includes(qLower) || (n.tags && n.tags.toLowerCase().includes(qLower))
    );

    if (matches.length === 1) {
      return formatNoteDetail(matches[0]);
    } else if (matches.length > 1) {
      let reply = `🔍 *Ditemukan ${matches.length} Catatan untuk "${query}":*\n\n`;
      matches.forEach((m, idx) => {
        reply += `${idx + 1}. 📝 *${m.title}* \`[${m.category}]\`\n`;
        const snippet = m.content.replace(/\n/g, ' ').substring(0, 50);
        reply += `   _${snippet}..._\n\n`;
      });
      reply += `💡 Ketik \`/catatan [nomor]\` untuk membaca isi lengkap.`;
      return reply;
    } else {
      return `⚠️ Tidak ditemukan catatan dengan kata kunci "*${query}*".\n\nKetik \`/catatan\` untuk melihat semua catatan.`;
    }
  }

  // 4. Lihat Semua Catatan (cth: "/catatan", "/notes", "/note", "catatan", "daftar catatan")
  const isListNotesQuery =
    lower === '/catatan' ||
    lower === '/notes' ||
    lower === '/note' ||
    lower === 'catatan' ||
    lower === 'daftar catatan' ||
    lower === 'lihat catatan' ||
    lower === 'semua catatan' ||
    lower === 'list catatan';

  if (isListNotesQuery) {
    const notes = await getNotes();
    return formatNotesList(notes);
  }

  return null;
}
