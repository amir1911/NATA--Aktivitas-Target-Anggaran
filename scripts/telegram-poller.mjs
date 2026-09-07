import fs from 'fs';
import path from 'path';

// Baca file .env untuk mengambil BOT_TOKEN
const envPath = path.resolve(process.cwd(), '.env');
let botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/TELEGRAM_BOT_TOKEN\s*=\s*["']?([^"'\r\n]+)["']?/);
  if (match) {
    botToken = match[1];
  }
}

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

const LOCAL_WEBHOOK_URL = 'http://localhost:3000/api/webhook/telegram';

console.log('🤖 Menghubungkan ke Telegram Bot (@NataAmir_bot)...');

// Hapus webhook lama agar polling bisa berjalan lancar
async function init() {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const me = await meRes.json();

    if (!me.ok) {
      console.error('❌ Gagal memvalidasi token bot Telegram:', me);
      process.exit(1);
    }

    console.log(`\n=================================================`);
    console.log(`✅ BOT AKTIF: @${me.result.username} (${me.result.first_name})`);
    console.log(`🚀 Siap menerima pertanyaan akademik, transaksi, target & catatan!`);
    console.log(`💬 Buka Telegram Anda, chat ke @${me.result.username}`);
    console.log(`📝 Coba tanyakan atau ketik:`);
    console.log(`   • "/jadwal" / "jadwal hari ini" / "/matkul" / "/tugas"`);
    console.log(`   • "/target" / "+target IPK 3.80 [Akademik]" / "/selesaitarget 1"`);
    console.log(`   • "/catatan" / "catat: Password Wifi Kos 12345" / "/catatan wifi"`);
    console.log(`   • "keluar 25000 Nasi Padang" / "/saldo"`);
    console.log(`=================================================\n`);

    pollUpdates(0);
  } catch (err) {
    console.error('Error inisialisasi bot:', err);
  }
}

// Polling loop
async function pollUpdates(offset) {
  try {
    const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=25`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        offset = update.update_id + 1;

        if (update.message && update.message.text) {
          const sender = update.message.from?.first_name || 'User';
          const chatId = update.message.chat.id;
          const text = update.message.text;

          console.log(`📩 [Pesan Masuk] ChatID: ${chatId} | Dari: ${sender} | Pesan: "${text}"`);

          // Forward pesan ke Next.js Webhook endpoint lokal
          try {
            const webhookRes = await fetch(LOCAL_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: update.message }),
            });
            const webhookData = await webhookRes.json();
            console.log(`⚡ [Hasil Proses]:`, webhookData.status || webhookData);
          } catch (whErr) {
            console.error('⚠️ Gagal menghubungi Next.js webhook lokal (pastikan localhost:3000 aktif):', whErr.message);
          }
        }
      }
    }
  } catch (e) {
    // Error jaringan/timeout polling biasa, lanjutkan loop
  }

  // Lanjutkan polling berikutnya
  setTimeout(() => pollUpdates(offset), 500);
}

init();
