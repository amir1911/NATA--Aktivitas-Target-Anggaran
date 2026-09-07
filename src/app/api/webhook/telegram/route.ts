import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  sendTelegramMessage,
  parseTransactionMessage,
  getMonthlySummary,
  handleAcademicBotQuery,
  handleGoalsNotesBotQuery,
} from '@/lib/telegram';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// GET: Cek status bot & pasang webhook Telegram dengan mudah
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const webhookUrl = searchParams.get('url');

  if (!BOT_TOKEN) {
    return NextResponse.json({
      status: 'error',
      message: 'TELEGRAM_BOT_TOKEN belum disetel di file .env',
    }, { status: 400 });
  }

  // Jika ada parameter url, daftarkan webhook ke Telegram
  if (webhookUrl) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
      );
      const data = await res.json();
      return NextResponse.json({
        action: 'setWebhook',
        webhookUrl,
        telegramResponse: data,
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Cek info webhook saat ini
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const info = await res.json();
    return NextResponse.json({
      status: 'ok',
      bot: 'NataAmir_bot is configured',
      webhookInfo: info,
      howToSetWebhook: 'Panggil GET /api/webhook/telegram?url=https://DOMAIN_ANDA/api/webhook/telegram',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Menerima pesan masuk dari Telegram (Webhook)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: 'ignored_no_text' });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const senderName = message.from?.first_name || 'Teman';

    // 1. Perintah /start atau /help
    if (text === '/start' || text.startsWith('/help')) {
      const helpText = `👋 *Halo ${senderName}!* Selamat datang di *Bot NATA (Asisten Kuliah, Target & Keuangan)*. 🎓🎯💰

Saya siap membantumu mengelola perkuliahan, target milestone, catatan kos, dan keuangan harian secara realtime ke website!

🎓 *AKADEMIK & JADWAL KULIAH:*
• \`/jadwal\` atau \`jadwal hari ini\` — Cek kelas hari ini
• \`jadwal besok\` — Cek kelas esok hari
• \`jadwal senin\` / \`jadwal selasa\` / dst. — Cek jadwal hari tertentu
• \`/semuajadwal\` — Lihat jadwal lengkap seminggu (Senin - Jumat)
• \`/matkul\` — Daftar mata kuliah, SKS, dosen & ruang
• \`/rps APBO\` — Lihat RPS & capaian mata kuliah
• \`/tugas\` — Cek tugas aktif & deadline terdekat
• \`/drive\` — Buka tautan materi Google Drive

🎯 *TARGET & MILESTONE SEMESTER:*
• \`/target\` atau \`/goals\` — Lihat daftar target & progres tercapai
• \`+target Raih IPK 3.80 [Akademik]\` — Tambah target baru
• \`/targetbaru Sertifikasi Dicoding [Skill]\` — Tambah target baru
• \`/selesaitarget 1\` — Tandai target nomor 1 sudah tercapai 🎉
• \`/tabungan\` — Cek progres target tabungan kos

📝 *CATATAN PRIBADI & KOS:*
• \`/catatan\` — Lihat semua catatan kuliah & kos tersimpan
• \`/catatan wifi\` — Cari atau buka catatan spesifik
• \`catat: Password Wifi Kos adalah 123456\` — Buat catatan cepat
• \`/catat Info Kos | Jam malam gerbang 23.00 WIB\` — Catatan berformat
• \`/pincatatan 1\` — Sematkan catatan penting di atas

💰 *CATAT KEUANGAN:*
• \`keluar 25000 Nasi Padang\` atau \`-25k Es Teh\`
• \`masuk 500000 Uang Saku\` atau \`+150k Freelance\`
• \`/saldo\` atau \`/rekap\` — Lihat saldo & ringkasan kas

_Silakan ketik perintah atau pertanyaanmu sekarang!_ 🚀`;

      await sendTelegramMessage(chatId, helpText);
      return NextResponse.json({ status: 'ok', handled: 'help' });
    }

    // 2. Cek apakah ini seputar Target & Catatan (Milestone, Notes, Tabungan)
    const goalsNotesReply = await handleGoalsNotesBotQuery(text);
    if (goalsNotesReply) {
      await sendTelegramMessage(chatId, goalsNotesReply);
      return NextResponse.json({ status: 'ok', handled: 'goals_notes' });
    }

    // 3. Cek apakah ini pertanyaan seputar Akademik & Jadwal Kuliah
    const academicReply = await handleAcademicBotQuery(text);
    if (academicReply) {
      await sendTelegramMessage(chatId, academicReply);
      return NextResponse.json({ status: 'ok', handled: 'academic' });
    }

    // 4. Perintah /saldo atau /rekap
    if (text === '/saldo' || text === '/rekap') {
      const summary = await getMonthlySummary();
      const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

      let reply = `📊 *Ringkasan Keuangan Anda*\n\n`;
      reply += `💰 *Total Pemasukan:* ${formatRp(summary.totalIncome)}\n`;
      reply += `💸 *Total Pengeluaran:* ${formatRp(summary.totalExpense)}\n`;
      reply += `💳 *Sisa Saldo:* *${formatRp(summary.balance)}*\n\n`;
      reply += `📦 Total Transaksi: ${summary.count} data\n\n`;

      if (summary.recent && summary.recent.length > 0) {
        reply += `🕒 *5 Transaksi Terakhir:*\n`;
        summary.recent.forEach((t: any) => {
          const sign = t.type === 'PEMASUKAN' ? '🟢 +' : '🔴 -';
          reply += `${sign} ${formatRp(t.amount)} — ${t.title}\n`;
        });
      }

      reply += `\n🌐 _Buka website dashboard untuk grafik lengkap!_`;

      await sendTelegramMessage(chatId, reply);
      return NextResponse.json({ status: 'ok', handled: 'summary' });
    }

    // 5. Proses input transaksi keuangan
    const parsed = parseTransactionMessage(text);

    if (!parsed) {
      const errorReply = `⚠️ *Pesan Belum Dikenali*

Kamu bisa mengelola Target, Catatan, Akademik, atau Keuangan:

🎯 *Target & Catatan:*
• \`/target\` — Cek daftar milestone & progres
• \`+target Belajar Next.js [Skill]\` — Tambah target
• \`/catatan\` atau \`/catatan wifi\` — Cek catatan
• \`catat: Password Wifi Baru 12345\` — Tambah catatan

📅 *Akademik Kuliah:*
• \`jadwal hari ini\` atau \`jadwal besok\`
• \`/semuajadwal\`, \`/matkul\`, \`/tugas\`

💸 *Catat Keuangan:*
• \`keluar 25000 Nasi Padang\` atau \`-25k Kopi\`
• \`masuk 500k Uang Saku\` atau \`/saldo\`

Ketik \`/help\` untuk panduan lengkap! 😊`;

      await sendTelegramMessage(chatId, errorReply);
      return NextResponse.json({ status: 'unrecognized_format' });
    }

    // 5. Simpan transaksi ke Supabase
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([{
        type: parsed.type,
        category: parsed.category,
        amount: parsed.amount,
        title: parsed.title,
        date: new Date().toISOString(),
        notes: parsed.notes,
      }])
      .select()
      .single();

    if (error) {
      console.error('Gagal menyimpan transaksi dari Telegram ke Supabase:', error);
      await sendTelegramMessage(
        chatId,
        `❌ *Gagal Menyimpan Transaksi!*\n\nTerjadi kesalahan koneksi database: \`${error.message}\``
      );
      return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
    }

    // 5. Kirim balasan konfirmasi berhasil
    const isIncome = parsed.type === 'PEMASUKAN';
    const sign = isIncome ? '🟢 PEMASUKAN' : '🔴 PENGELUARAN';
    const amountFormatted = `Rp ${parsed.amount.toLocaleString('id-ID')}`;

    const successMessage = `✅ *Transaksi Berhasil Dicatat!*

${sign}
💵 *Nominal:* ${amountFormatted}
📂 *Kategori:* ${parsed.category}
📝 *Keterangan:* ${parsed.title}

🌐 _Data otomatis muncul di dashboard keuangan website!_
Ketik \`/saldo\` untuk melihat total kas.`;

    await sendTelegramMessage(chatId, successMessage);

    return NextResponse.json({
      status: 'success',
      transaction: data,
    });
  } catch (err: any) {
    console.error('Webhook Telegram Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
