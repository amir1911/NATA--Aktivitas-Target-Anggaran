import { supabaseAdmin } from './supabase-admin';
import {
  INITIAL_COURSES,
  INITIAL_SCHEDULES,
  INITIAL_TASKS,
  INITIAL_DRIVE_LINKS,
} from './mockData';

export interface ScheduleItemData {
  id: string;
  course_id?: string | null;
  course_name: string;
  course_code: string;
  color?: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  room?: string | null;
}

export interface CourseItemData {
  id: string;
  code: string;
  name: string;
  lecturer?: string | null;
  room?: string | null;
  color?: string;
  semester?: number;
  sks?: number;
  target_grade?: string;
  capaian_pembelajaran?: string | null;
}

export interface TaskItemData {
  id: string;
  course_id?: string | null;
  course_name?: string | null;
  title: string;
  description?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
  due_date: string;
  drive_url?: string | null;
}

export interface DriveLinkItemData {
  id: string;
  course_name?: string | null;
  title: string;
  url: string;
  category: string;
  description?: string | null;
}

/**
 * Ambil daftar jadwal kuliah dari Supabase (dengan fallback mockData)
 */
export async function getAcademicSchedules(): Promise<ScheduleItemData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('schedules')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback ke mock data
      return INITIAL_SCHEDULES.map((s) => ({
        id: s.id,
        course_id: s.courseId,
        course_name: s.courseName,
        course_code: s.courseCode,
        color: s.color,
        day_of_week: s.dayOfWeek,
        day_name: s.dayName,
        start_time: s.startTime,
        end_time: s.endTime,
        room: s.room,
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching academic schedules:', err);
    return [];
  }
}

/**
 * Ambil daftar mata kuliah dari Supabase (dengan fallback mockData)
 */
export async function getAcademicCourses(): Promise<CourseItemData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .order('code', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_COURSES.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        lecturer: c.lecturer,
        room: c.room,
        color: c.color,
        semester: c.semester,
        sks: c.sks,
        target_grade: c.targetGrade,
        capaian_pembelajaran: c.capaianPembelajaran,
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching academic courses:', err);
    return [];
  }
}

/**
 * Ambil daftar tugas kuliah dari Supabase (dengan fallback mockData)
 */
export async function getAcademicTasks(): Promise<TaskItemData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_TASKS.map((t) => ({
        id: t.id,
        course_id: t.courseId,
        course_name: t.courseName,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        due_date: t.dueDate,
        drive_url: t.driveUrl,
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching academic tasks:', err);
    return [];
  }
}

/**
 * Ambil link drive & materi dari Supabase (dengan fallback mockData)
 */
export async function getAcademicDriveLinks(): Promise<DriveLinkItemData[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('drive_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_DRIVE_LINKS.map((d) => ({
        id: d.id,
        course_name: d.courseName,
        title: d.title,
        url: d.url,
        category: d.category,
        description: d.description,
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching academic drive links:', err);
    return [];
  }
}

/**
 * Helper untuk mendapatkan waktu saat ini dalam zona waktu WIB (Asia/Jakarta)
 */
export function getWibInfo(offsetDays = 0): {
  dayOfWeek: number;
  dayName: string;
  formattedDate: string;
} {
  const now = new Date();
  const targetDate = new Date(now.getTime() + offsetDays * 86400000);

  // Format ke bahasa Indonesia dengan zona waktu Asia/Jakarta
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('id-ID', options);
  const parts = formatter.formatToParts(targetDate);

  const weekdayVal = parts.find((p) => p.type === 'weekday')?.value || '';
  const dayNameLower = weekdayVal.toLowerCase().replace(/['’]/g, '');

  const dayMap: Record<string, number> = {
    senin: 1,
    selasa: 2,
    rabu: 3,
    kamis: 4,
    jumat: 5,
    sabtu: 6,
    minggu: 7,
  };

  const dayOfWeek = dayMap[dayNameLower] || 1;
  const dayNameCapitalized =
    weekdayVal.charAt(0).toUpperCase() + weekdayVal.slice(1);
  const formattedDate = formatter.format(targetDate);

  return { dayOfWeek, dayName: dayNameCapitalized, formattedDate };
}

/**
 * Format pesan jadwal untuk 1 hari tertentu
 */
export function formatDaySchedule(
  dayName: string,
  dayOfWeek: number,
  formattedDate: string,
  schedules: ScheduleItemData[],
  courses: CourseItemData[],
  titlePrefix = 'Jadwal Kuliah'
): string {
  const daySchedules = schedules
    .filter((s) => s.day_of_week === dayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  let reply = `📅 *${titlePrefix} — ${dayName}*\n`;
  reply += `🗓️ _${formattedDate}_\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (daySchedules.length === 0) {
    reply += `🎉 *Tidak ada perkuliahan untuk hari ${dayName}!* 🏖️\n\n`;
    reply += `_Selamat beristirahat, nugas santai, atau belajar mandiri!_\n\n`;
    reply += `💡 *Perintah cepat:*\n`;
    reply += `• \`/jadwal besok\` — Cek kelas esok hari\n`;
    reply += `• \`/jadwal senin\` — Cek kelas hari Senin\n`;
    reply += `• \`/semuajadwal\` — Lihat jadwal lengkap seminggu`;
    return reply;
  }

  reply += `Ditemukan *${daySchedules.length} mata kuliah* hari ini:\n\n`;

  daySchedules.forEach((s, idx) => {
    // Cari data course pendukung (dosen & sks)
    const course = courses.find(
      (c) =>
        (s.course_id && c.id === s.course_id) ||
        (s.course_code && c.code.toLowerCase() === s.course_code.toLowerCase()) ||
        (s.course_name && c.name.toLowerCase() === s.course_name.toLowerCase())
    );

    const time = `🕒 *${s.start_time} - ${s.end_time} WIB*`;
    const room = s.room || course?.room || 'Ruang Kelas';
    const lecturer = course?.lecturer ? `👨‍🏫 ${course.lecturer}` : '';
    const sks = course?.sks ? `(${course.sks} SKS)` : '';

    reply += `*${idx + 1}. ${s.course_name}* ${sks}\n`;
    reply += `   🔖 Kode: \`${s.course_code}\`\n`;
    reply += `   ${time}\n`;
    reply += `   📍 Ruang: *${room}*\n`;
    if (lecturer) {
      reply += `   ${lecturer}\n`;
    }
    reply += `\n`;
  });

  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `💡 *Tips:* Ketik \`/tugas\` untuk cek deadline terdekat atau \`/matkul\` untuk info dosen.`;

  return reply;
}

/**
 * Format pesan seluruh jadwal kuliah mingguan (Senin - Jumat)
 */
export function formatWeeklySchedule(
  schedules: ScheduleItemData[],
  courses: CourseItemData[]
): string {
  const days = [
    { num: 1, name: 'Senin' },
    { num: 2, name: 'Selasa' },
    { num: 3, name: 'Rabu' },
    { num: 4, name: 'Kamis' },
    { num: 5, name: 'Jumat' },
  ];

  let reply = `🗓️ *JADWAL KULIAH MINGGUAN (NATA)*\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let totalClasses = 0;

  for (const day of days) {
    const dayScheds = schedules
      .filter((s) => s.day_of_week === day.num)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    totalClasses += dayScheds.length;

    reply += `📌 *${day.name.toUpperCase()}* (${dayScheds.length} Kelas)\n`;

    if (dayScheds.length === 0) {
      reply += `   _Tidak ada kelas / Libur_\n\n`;
    } else {
      dayScheds.forEach((s) => {
        const course = courses.find(
          (c) =>
            (s.course_id && c.id === s.course_id) ||
            (s.course_code && c.code.toLowerCase() === s.course_code.toLowerCase()) ||
            (s.course_name && c.name.toLowerCase() === s.course_name.toLowerCase())
        );

        const room = s.room || course?.room || 'R. Kelas';
        reply += `   • *${s.start_time}-${s.end_time}* | ${s.course_name}\n`;
        reply += `     📍 ${room} | 🔖 \`${s.course_code}\`\n`;
      });
      reply += `\n`;
    }
  }

  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `📊 *Total Perkuliahan:* ${totalClasses} kelas terjadwal\n`;
  reply += `💡 Ketik nama hari seperti \`/jadwal rabu\` untuk melihat detail dosen & ruang.`;

  return reply;
}

/**
 * Format pesan daftar mata kuliah & SKS
 */
export function formatCoursesList(courses: CourseItemData[]): string {
  if (courses.length === 0) {
    return `📚 *Belum ada mata kuliah yang terdaftar di database!*\n\nBuka dashboard website untuk menambahkan mata kuliah semester Anda.`;
  }

  const totalSks = courses.reduce((acc, c) => acc + (c.sks || 0), 0);

  let reply = `📚 *DAFTAR MATA KULIAH & RPS*\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `🎓 *Total Mata Kuliah:* ${courses.length} Matkul\n`;
  reply += `⭐ *Total Beban:* ${totalSks} SKS\n\n`;

  courses.forEach((c, idx) => {
    reply += `*${idx + 1}. ${c.name}*\n`;
    reply += `   🔖 Kode: \`${c.code}\` | ⚖️ ${c.sks || 3} SKS\n`;
    if (c.lecturer) reply += `   👨‍🏫 Dosen: ${c.lecturer}\n`;
    if (c.room) reply += `   📍 Ruang: ${c.room}\n`;
    reply += `\n`;
  });

  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `💡 Ketik \`/rps [nama_matkul]\` (contoh: \`/rps APBO\`) untuk melihat capaian pembelajaran lengkap!`;

  return reply;
}

/**
 * Format detail 1 mata kuliah beserta RPS & jadwalnya
 */
export function formatCourseDetail(
  course: CourseItemData,
  schedules: ScheduleItemData[]
): string {
  const linkedScheds = schedules.filter(
    (s) =>
      (s.course_id && s.course_id === course.id) ||
      (s.course_code && s.course_code.toLowerCase() === course.code.toLowerCase()) ||
      (s.course_name && s.course_name.toLowerCase() === course.name.toLowerCase())
  );

  let reply = `📖 *DETAIL MATA KULIAH & RPS*\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  reply += `📚 *${course.name}*\n`;
  reply += `🔖 Kode: \`${course.code}\`\n`;
  reply += `⚖️ Beban: *${course.sks || 3} SKS* (Semester ${course.semester || 5})\n`;
  if (course.lecturer) reply += `👨‍🏫 Dosen Pengampu: *${course.lecturer}*\n`;
  if (course.room) reply += `📍 Ruang Utama: *${course.room}*\n`;
  if (course.target_grade) reply += `🎯 Target Nilai: *${course.target_grade}*\n`;

  reply += `\n🕒 *Jadwal Kuliah:*\n`;
  if (linkedScheds.length === 0) {
    reply += `_Belum ada jadwal spesifik untuk matkul ini_\n`;
  } else {
    linkedScheds.forEach((s) => {
      reply += `• *Hari ${s.day_name}*, ${s.start_time} - ${s.end_time} WIB (Ruang ${s.room || 'Kelas'})\n`;
    });
  }

  reply += `\n📝 *Rencana Pembelajaran Semester (RPS):*\n`;
  if (course.capaian_pembelajaran) {
    reply += `${course.capaian_pembelajaran}\n`;
  } else {
    reply += `_Capaian pembelajaran belum diisi di dashboard._\n`;
  }

  return reply;
}

/**
 * Format pesan daftar tugas & deadline
 */
export function formatTasksList(tasks: TaskItemData[]): string {
  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');

  if (activeTasks.length === 0) {
    return `🎉 *Hebat! Tidak ada tugas pending saat ini.* 🥳\n\nSemua tugas kuliah sudah selesai dikerjakan. Santai dulu atau belajar materi baru!\nKetik \`/jadwal besok\` untuk bersiap kelas esok.`;
  }

  let reply = `📝 *DAFTAR TUGAS & DEADLINE KULIAH*\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `Ada *${activeTasks.length} tugas aktif* yang perlu dikerjakan:\n\n`;

  activeTasks.forEach((t, idx) => {
    const priorityEmoji =
      t.priority === 'URGENT'
        ? '🔴 URGENT'
        : t.priority === 'HIGH'
        ? '🟠 HIGH'
        : t.priority === 'MEDIUM'
        ? '🟡 MEDIUM'
        : '🟢 LOW';

    const dueDateObj = new Date(t.due_date);
    const dateFormatted = !isNaN(dueDateObj.getTime())
      ? dueDateObj.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      : t.due_date;

    const statusText =
      t.status === 'IN_PROGRESS'
        ? '⏳ Sedang Dikerjakan'
        : t.status === 'SUBMITTED'
        ? '📤 Sudah Dikumpul'
        : '📋 Belum Dikerjakan';

    reply += `*${idx + 1}. ${t.title}*\n`;
    if (t.course_name) reply += `   📚 Matkul: *${t.course_name}*\n`;
    reply += `   ⏰ Deadline: *${dateFormatted}*\n`;
    reply += `   ⚡ Prioritas: ${priorityEmoji} | ${statusText}\n`;
    if (t.description) reply += `   📄 Catatan: _${t.description}_\n`;
    if (t.drive_url) reply += `   🔗 Link: ${t.drive_url}\n`;
    reply += `\n`;
  });

  reply += `━━━━━━━━━━━━━━━━━━━━━\n`;
  reply += `💪 Semangat menyelesaikan tugasmu!`;

  return reply;
}

/**
 * Format pesan tautan Google Drive / materi kuliah
 */
export function formatDriveList(links: DriveLinkItemData[]): string {
  if (links.length === 0) {
    return `📁 *Belum ada link materi atau folder Google Drive tersimpan.*`;
  }

  let reply = `📂 *LINK GOOGLE DRIVE & MATERI KULIAH*\n`;
  reply += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  links.forEach((link, idx) => {
    reply += `*${idx + 1}. ${link.title}*\n`;
    if (link.course_name) reply += `   📚 Matkul: *${link.course_name}*\n`;
    reply += `   🏷️ Kategori: \`${link.category}\`\n`;
    reply += `   🔗 [Buka Tautan Google Drive](${link.url})\n`;
    reply += `\n`;
  });

  return reply;
}

/**
 * Deteksi dan proses pertanyaan seputar Akademik & Jadwal Kuliah.
 * Mengembalikan string balasan Markdown jika pertanyaan cocok, atau null jika bukan pertanyaan akademik.
 */
export async function handleAcademicBotQuery(
  rawText: string
): Promise<string | null> {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Cek intent: JADWAL KULIAH
  const isScheduleQuery =
    lower.startsWith('/jadwal') ||
    lower.startsWith('/schedule') ||
    lower.startsWith('/kelas') ||
    lower.startsWith('/kuliah') ||
    lower === 'jadwal' ||
    lower.includes('jadwal') ||
    lower.includes('kuliah') ||
    lower.includes('kelas') ||
    lower.includes('ada kuliah') ||
    lower.includes('ada kelas');

  if (isScheduleQuery) {
    // Ambil data jadwal & courses
    const [schedules, courses] = await Promise.all([
      getAcademicSchedules(),
      getAcademicCourses(),
    ]);

    // Sub-intent A: Semua Jadwal / Seminggu / Lengkap
    if (
      lower.includes('semua') ||
      lower.includes('seminggu') ||
      lower.includes('lengkap') ||
      lower.includes('minggu ini') ||
      lower === '/semuajadwal' ||
      lower === '/jadwalkuliah' ||
      lower === '/jadwal_lengkap'
    ) {
      return formatWeeklySchedule(schedules, courses);
    }

    // Sub-intent B: Jadwal Hari Besok
    if (
      lower.includes('besok') ||
      lower.includes('tomorrow') ||
      lower === '/jadwal_besok'
    ) {
      const tomorrowInfo = getWibInfo(1);
      return formatDaySchedule(
        tomorrowInfo.dayName,
        tomorrowInfo.dayOfWeek,
        tomorrowInfo.formattedDate,
        schedules,
        courses,
        'Jadwal Kuliah Besok'
      );
    }

    // Sub-intent C: Hari Tertentu (Senin - Minggu)
    const dayKeywords: Record<string, { num: number; name: string }> = {
      senin: { num: 1, name: 'Senin' },
      monday: { num: 1, name: 'Senin' },
      selasa: { num: 2, name: 'Selasa' },
      tuesday: { num: 2, name: 'Selasa' },
      rabu: { num: 3, name: 'Rabu' },
      wednesday: { num: 3, name: 'Rabu' },
      kamis: { num: 4, name: 'Kamis' },
      thursday: { num: 4, name: 'Kamis' },
      jumat: { num: 5, name: 'Jumat' },
      "jum'at": { num: 5, name: 'Jumat' },
      friday: { num: 5, name: 'Jumat' },
      sabtu: { num: 6, name: 'Sabtu' },
      saturday: { num: 6, name: 'Sabtu' },
      minggu: { num: 7, name: 'Minggu' },
      ahad: { num: 7, name: 'Minggu' },
      sunday: { num: 7, name: 'Minggu' },
    };

    for (const [kw, dayData] of Object.entries(dayKeywords)) {
      if (lower.includes(kw)) {
        return formatDaySchedule(
          dayData.name,
          dayData.num,
          `Jadwal Perkuliahan Hari ${dayData.name}`,
          schedules,
          courses,
          `Jadwal Kuliah Hari ${dayData.name}`
        );
      }
    }

    // Sub-intent D: Jadwal spesifik mata kuliah tertentu (misal: "jadwal APBO", "jadwal multimedia")
    const matchedCourseSchedule = courses.find(
      (c) =>
        lower.includes(c.code.toLowerCase()) ||
        lower.includes(c.name.toLowerCase()) ||
        (c.code.toLowerCase().includes('apbo') && lower.includes('apbo')) ||
        (c.name.toLowerCase().includes('multimedia') && lower.includes('multimedia')) ||
        (c.name.toLowerCase().includes('layanan') && lower.includes('layanan')) ||
        (c.name.toLowerCase().includes('bergerak') && lower.includes('bergerak')) ||
        (c.name.toLowerCase().includes('proyek') && lower.includes('proyek')) ||
        (c.name.toLowerCase().includes('perusahaan') && (lower.includes('erp') || lower.includes('perusahaan')))
    );

    if (matchedCourseSchedule && !lower.includes('hari ini')) {
      return formatCourseDetail(matchedCourseSchedule, schedules);
    }

    // Sub-intent E: Default -> Hari Ini (Today)
    // Mencakup: "jadwal", "/jadwal", "jadwal hari ini", "kuliah hari ini", "ada kelas apa hari ini"
    const todayInfo = getWibInfo(0);
    return formatDaySchedule(
      todayInfo.dayName,
      todayInfo.dayOfWeek,
      todayInfo.formattedDate,
      schedules,
      courses,
      'Jadwal Kuliah Hari Ini'
    );
  }

  // 2. Cek intent: RPS / SILABUS / CAPAIAN PEMBELAJARAN
  const isRpsQuery =
    lower.startsWith('/rps') ||
    lower.includes('rps') ||
    lower.includes('silabus') ||
    lower.includes('capaian pembelajaran');

  if (isRpsQuery) {
    const [courses, schedules] = await Promise.all([
      getAcademicCourses(),
      getAcademicSchedules(),
    ]);

    // Cari apakah menyebutkan matkul tertentu
    const matched = courses.find((c) => {
      const codeL = c.code.toLowerCase();
      const nameL = c.name.toLowerCase();
      return (
        lower.includes(codeL) ||
        lower.includes(nameL) ||
        (lower.includes('apbo') && (codeL.includes('3104') || nameL.includes('apbo') || nameL.includes('objek'))) ||
        (lower.includes('multimedia') && nameL.includes('multimedia')) ||
        (lower.includes('erp') && nameL.includes('perusahaan')) ||
        (lower.includes('bergerak') && nameL.includes('bergerak')) ||
        (lower.includes('layanan') && nameL.includes('layanan')) ||
        (lower.includes('proyek') && nameL.includes('proyek')) ||
        (lower.includes('tren') && nameL.includes('tren'))
      );
    });

    if (matched) {
      return formatCourseDetail(matched, schedules);
    }

    // Jika RPS umum, tampilkan daftar matkul dengan petunjuk memilih matkul
    return formatCoursesList(courses);
  }

  // 3. Cek intent: MATA KULIAH / DOSEN / AKADEMIK UMUM
  const isCourseQuery =
    lower.startsWith('/matkul') ||
    lower.startsWith('/courses') ||
    lower.startsWith('/akademik') ||
    lower === 'matkul' ||
    lower === 'mata kuliah' ||
    lower === 'akademik' ||
    lower.includes('daftar matkul') ||
    lower.includes('list matkul') ||
    lower.includes('mata kuliah') ||
    lower.includes('dosen') ||
    lower.includes('berapa sks') ||
    lower.includes('total sks');

  if (isCourseQuery) {
    const [courses, schedules] = await Promise.all([
      getAcademicCourses(),
      getAcademicSchedules(),
    ]);

    // Jika menanyakan dosen spesifik atau matkul spesifik
    const matched = courses.find((c) => {
      const codeL = c.code.toLowerCase();
      const nameL = c.name.toLowerCase();
      return (
        lower.includes(codeL) ||
        lower.includes(nameL) ||
        (lower.includes('apbo') && (codeL.includes('3104') || nameL.includes('objek'))) ||
        (lower.includes('multimedia') && nameL.includes('multimedia')) ||
        (lower.includes('erp') && nameL.includes('perusahaan')) ||
        (lower.includes('bergerak') && nameL.includes('bergerak')) ||
        (lower.includes('layanan') && nameL.includes('layanan')) ||
        (lower.includes('proyek') && nameL.includes('proyek')) ||
        (lower.includes('tren') && nameL.includes('tren'))
      );
    });

    if (matched) {
      return formatCourseDetail(matched, schedules);
    }

    return formatCoursesList(courses);
  }

  // 4. Cek intent: TUGAS / DEADLINE KULIAH
  const isTaskQuery =
    lower.startsWith('/tugas') ||
    lower.startsWith('/task') ||
    lower.startsWith('/deadline') ||
    lower === 'tugas' ||
    lower === 'pr' ||
    lower.includes('ada tugas') ||
    lower.includes('deadline') ||
    lower.includes('tugas kuliah') ||
    lower.includes('daftar tugas');

  if (isTaskQuery) {
    const tasks = await getAcademicTasks();
    return formatTasksList(tasks);
  }

  // 5. Cek intent: GOOGLE DRIVE / LINK MATERI
  const isDriveQuery =
    lower.startsWith('/drive') ||
    lower.startsWith('/gdrive') ||
    lower === 'drive' ||
    lower === 'gdrive' ||
    lower.includes('google drive') ||
    lower.includes('link materi') ||
    lower.includes('link drive') ||
    lower.includes('materi kuliah');

  if (isDriveQuery) {
    const driveLinks = await getAcademicDriveLinks();
    return formatDriveList(driveLinks);
  }

  return null;
}
