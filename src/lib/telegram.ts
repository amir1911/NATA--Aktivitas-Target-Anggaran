import { supabaseAdmin } from './supabase-admin';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export type TransactionType = 'PEMASUKAN' | 'PENGELUARAN';
export type TransactionCategory =
  | 'MAKAN'
  | 'KOS'
  | 'LAUNDRY'
  | 'KUOTA'
  | 'TRANSPORT'
  | 'HIBURAN'
  | 'BEASISWA'
  | 'UANG_SAKU'
  | 'SIDE_HUSTLE'
  | 'KESEHATAN'
  | 'ALAT_TULIS'
  | 'LAINNYA';

export interface ParsedTransaction {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  title: string;
  notes?: string;
}

// Ekspor modul asisten akademik & jadwal kuliah
export * from './telegram-academic';

// Ekspor modul target & catatan
export * from './telegram-goals-notes';

/**
 * Kirim pesan teks ke Telegram Chat
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  parseMode: 'Markdown' | 'HTML' = 'Markdown'
) {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN belum diset di .env');
    return false;
  }

  try {
    const payload: any = {
      chat_id: chatId,
      text,
    };
    if (parseMode) {
      payload.parse_mode = parseMode;
    }

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Jika gagal karena format parse_mode (Markdown/HTML entity error), kirim ulang sebagai plain text!
    if (!data.ok && parseMode) {
      console.warn('⚠️ Gagal kirim dengan parse_mode, mencoba kirim ulang sebagai plain text...');
      // Buang markdown formatting sederhana (*, _, `) untuk plain text
      const plainText = text.replace(/[*_`]/g, '');
      const retryRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
        }),
      });
      const retryData = await retryRes.json();
      if (!retryData.ok) {
        console.error('❌ Gagal kirim pesan plain text ke Telegram:', retryData);
        return false;
      }
      return true;
    }

    if (!data.ok) {
      console.error('❌ Gagal kirim pesan Telegram:', data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception sendTelegramMessage:', error);
    return false;
  }
}

/**
 * Parser cerdas untuk membaca pesan teks transaksi dari Telegram
 * Contoh input:
 * - "keluar 25000 Makan Nasi Padang"
 * - "-25k Nasi Goreng"
 * - "masuk 500000 Uang Saku Ortu"
 * - "+100k Gaji Part Time"
 * - "Bensin motor 30k"
 * - "Bayar laundry 15.000"
 */
export function parseTransactionMessage(rawText: string): ParsedTransaction | null {
  const text = rawText.trim();
  if (!text) return null;

  // 1. Tentukan Tipe: Pemasukan vs Pengeluaran
  let type: TransactionType = 'PENGELUARAN'; // Default adalah pengeluaran
  const lowerText = text.toLowerCase();

  const isExplicitIncome =
    lowerText.startsWith('+') ||
    /\b(masuk|pemasukan|terima|dapat|gaji|saku|beasiswa|transferan|penjualan)\b/i.test(lowerText) ||
    lowerText.includes('uang masuk') ||
    lowerText.includes('uang saku');

  const isExplicitExpense =
    lowerText.startsWith('-') ||
    /\b(keluar|pengeluaran|beli|bayar|ongkir|belanja)\b/i.test(lowerText);

  if (isExplicitIncome && !isExplicitExpense) {
    type = 'PEMASUKAN';
  }

  // 2. Ekstrak Nominal Uang
  // Mendukung: 25k, 25000, 25.000, 25rb, 1.5jt, 100k
  const amountRegex = /(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)?\b/i;
  const amountMatch = text.match(amountRegex);

  if (!amountMatch) {
    return null; // Tidak ditemukan angka/nominal
  }

  const rawNumber = amountMatch[1].replace(/\./g, '').replace(/,/g, '.');
  let amount = parseFloat(rawNumber);
  const unit = (amountMatch[2] || '').toLowerCase();

  if (unit === 'k' || unit === 'rb' || unit === 'ribu') {
    amount = amount * 1000;
  } else if (unit === 'jt' || unit === 'juta') {
    amount = amount * 1000000;
  }

  if (isNaN(amount) || amount <= 0) {
    return null;
  }

  // 3. Bersihkan judul (buang kata kunci perintah dan nominal)
  let title = text
    .replace(amountMatch[0], '') // Hapus bagian nominal
    .replace(/^(keluar|masuk|pemasukan|pengeluaran|\+|\-)\s*/i, '') // Hapus awalan keluar/masuk/+/-
    .trim();

  if (!title) {
    title = type === 'PEMASUKAN' ? 'Pemasukan Lainnya' : 'Pengeluaran Lainnya';
  }

  // 4. Deteksi Kategori berdasarkan kata kunci
  const titleLower = title.toLowerCase();
  let category: TransactionCategory = 'LAINNYA';

  if (type === 'PEMASUKAN') {
    if (titleLower.includes('saku') || titleLower.includes('ortu') || titleLower.includes('transfer') || titleLower.includes('uang masuk') || titleLower.includes('minggu ini')) {
      category = 'UANG_SAKU';
    } else if (titleLower.includes('beasiswa') || titleLower.includes('kip')) {
      category = 'BEASISWA';
    } else if (titleLower.includes('gaji') || titleLower.includes('freelance') || titleLower.includes('joki') || titleLower.includes('proyek')) {
      category = 'SIDE_HUSTLE';
    }
  } else {
    // Pengeluaran
    if (/makan|nasi|bakso|mie|ayam|sate|kopi|cafe|jajan|indomaret|alfamart|es\s*teh|sarapan|lunch|dinner|warteg/i.test(titleLower)) {
      category = 'MAKAN';
    } else if (/kos|kost|kamar|kontrakan|listrik\s*kos/i.test(titleLower)) {
      category = 'KOS';
    } else if (/laundry|cuci|setrika/i.test(titleLower)) {
      category = 'LAUNDRY';
    } else if (/kuota|pulsa|paket\s*data|wifi|indihome|telkomsel|indosat|xl|tri/i.test(titleLower)) {
      category = 'KUOTA';
    } else if (/bensin|pertalite|pertamax|gojek|grab|maxim|ojol|krl|angkot|parkir|toll/i.test(titleLower)) {
      category = 'TRANSPORT';
    } else if (/nonton|bioskop|game|steam|netflix|spotify|hangout|jalan/i.test(titleLower)) {
      category = 'HIBURAN';
    } else if (/obat|dokter|klinik|apotek|vitamin|sakit/i.test(titleLower)) {
      category = 'KESEHATAN';
    } else if (/buku|pulpen|fotokopi|print|jilid|binder|alat\s*tulis/i.test(titleLower)) {
      category = 'ALAT_TULIS';
    }
  }

  return {
    type,
    category,
    amount,
    title,
    notes: 'Dicatat otomatis melalui Telegram Bot',
  };
}

/**
 * Ambil Ringkasan Saldo dan Pengeluaran Bulan Ini
 */
export async function getMonthlySummary() {
  try {
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error || !transactions) {
      return { totalIncome: 0, totalExpense: 0, balance: 0, count: 0 };
    }

    const totalIncome = transactions
      .filter((t: any) => t.type === 'PEMASUKAN')
      .reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter((t: any) => t.type === 'PENGELUARAN')
      .reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);

    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      count: transactions.length,
      recent: transactions.slice(0, 5),
    };
  } catch (e) {
    console.error('Error fetching monthly summary:', e);
    return { totalIncome: 0, totalExpense: 0, balance: 0, count: 0 };
  }
}
