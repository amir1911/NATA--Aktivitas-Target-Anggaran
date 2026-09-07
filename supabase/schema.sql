-- ================================================================
-- NATA App - SQL Script untuk Supabase (SIAP JALANKAN DI SUPABASE SQL EDITOR)
-- ================================================================

-- 1. Tabel: users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel: courses (Mata Kuliah)
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  lecturer TEXT,
  room TEXT,
  color TEXT DEFAULT '#3b82f6',
  semester INT DEFAULT 1,
  sks INT DEFAULT 3,
  target_grade TEXT DEFAULT 'A',
  capaian_pembelajaran TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom capaian_pembelajaran jika tabel sudah dibuat sebelumnya
ALTER TABLE courses ADD COLUMN IF NOT EXISTS capaian_pembelajaran TEXT;

-- 3. Tabel: schedules (Jadwal Kuliah)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  course_name TEXT,
  course_code TEXT,
  color TEXT DEFAULT '#3b82f6',
  day_of_week INT NOT NULL,  -- 1=Senin, 7=Minggu
  day_name TEXT NOT NULL,
  start_time TEXT NOT NULL,  -- Format: "08:00"
  end_time TEXT NOT NULL,    -- Format: "10:00"
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel: tasks (Tugas & Deadline)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
  status TEXT DEFAULT 'TODO',     -- TODO, IN_PROGRESS, SUBMITTED, COMPLETED
  due_date TIMESTAMPTZ,
  drive_url TEXT,
  tags TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel: drive_links (Tautan Google Drive)
CREATE TABLE IF NOT EXISTS drive_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_name TEXT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'LAINNYA', -- TUGAS, MATERI, CATATAN, PROYEK, LAINNYA
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel: transactions (Transaksi Keuangan)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,      -- PEMASUKAN, PENGELUARAN
  category TEXT NOT NULL,  -- MAKAN, KOS, LAUNDRY, KUOTA, HIBURAN, dll
  amount BIGINT NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel: notes (Catatan)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Umum',
  is_pinned BOOLEAN DEFAULT FALSE,
  tags TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel: personal_goals (Target Pribadi)
CREATE TABLE IF NOT EXISTS personal_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'Akademik',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- PERINTAH WAJIB: Disable Row Level Security (RLS) pada SELURUH tabel
-- Jalankan bagian ini di Supabase SQL Editor agar RLS tidak memblokir simpan/edit!
-- ================================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE drive_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE personal_goals DISABLE ROW LEVEL SECURITY;
