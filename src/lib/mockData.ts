// Complete Mock Data Store for NATA (Nata Aktivitas, Target, dan Anggaran)
// Provides instant full interactivity and fallback data for Indonesian University Boarding Students

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  monthlyAllowance: number;
}

export interface CourseItem {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  room: string;
  color: string;
  semester: number;
  sks: number;
  targetGrade: string;
  capaianPembelajaran?: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  color: string;
  dayOfWeek: number; // 1=Senin, 7=Minggu
  dayName: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface TaskItem {
  id: string;
  courseId?: string;
  courseName?: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
  dueDate: string; // ISO string
  driveUrl?: string;
  tags?: string;
}

export interface DriveLinkItem {
  id: string;
  courseId?: string;
  courseName?: string;
  title: string;
  url: string;
  category: 'TUGAS' | 'MATERI' | 'CATATAN' | 'PROYEK' | 'LAINNYA';
  description?: string;
}

export interface TransactionItem {
  id: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  category: 'MAKAN' | 'KOS' | 'LAUNDRY' | 'KUOTA' | 'TRANSPORT' | 'HIBURAN' | 'BEASISWA' | 'UANG_SAKU' | 'SIDE_HUSTLE' | 'KESEHATAN' | 'ALAT_TULIS' | 'LAINNYA';
  amount: number;
  title: string;
  date: string;
  notes?: string;
}

export interface BudgetItem {
  id: string;
  category: 'MAKAN' | 'KOS' | 'LAUNDRY' | 'KUOTA' | 'HIBURAN' | 'ALAT_TULIS' | 'TRANSPORT' | 'LAINNYA';
  amountLimit: number;
  spentAmount: number;
}

export interface SavingsGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  icon: string;
}

export interface BillReminderItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  recurringPeriod: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  tags?: string;
  updatedAt: string;
}

export interface PersonalGoalItem {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export const INITIAL_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'Budi Pratama',
  email: 'budi@mahasiswa.ac.id',
  university: 'Universitas Sriwijaya',
  major: 'Teknik Informatika (Semester 5)',
  monthlyAllowance: 2500000,
};

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'course-1',
    code: 'TIF301',
    name: 'Pemrograman Web Lanjut',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    room: 'Lab Komputer 302',
    color: '#3b82f6',
    semester: 5,
    sks: 4,
    targetGrade: 'A',
    capaianPembelajaran: 'Mahasiswa mampu merancang dan mengimplementasikan aplikasi web full-stack modern berbasis Next.js App Router, Prisma ORM, REST API, dan cloud storage.',
  },
  {
    id: 'course-2',
    code: 'TIF302',
    name: 'Basis Data Terdistribusi',
    lecturer: 'Prof. Retno Rahayu, M.T.',
    room: 'Gedung Ruang 204',
    color: '#8b5cf6',
    semester: 5,
    sks: 3,
    targetGrade: 'A',
    capaianPembelajaran: 'Mahasiswa mampu menguasai konsep fragmentasi data, replikasi sharding, optimasi query terdistribusi, dan konsistensi transaksi database.',
  },
  {
    id: 'course-3',
    code: 'TIF303',
    name: 'Algoritma & Struktur Data',
    lecturer: 'Eko Prasetyo, M.Kom',
    room: 'Lab Komputer 101',
    color: '#10b981',
    semester: 5,
    sks: 3,
    targetGrade: 'A-',
    capaianPembelajaran: 'Mahasiswa mampu menganalisis kompleksitas algoritma (Big-O), serta mengimplementasikan struktur data Tree, Graph, dan Shortest Path.',
  },
  {
    id: 'course-4',
    code: 'TIF304',
    name: 'Kecerdasan Buatan',
    lecturer: 'Dr. Anita Kusuma, S.T.',
    room: 'Gedung Ruang 301',
    color: '#f59e0b',
    semester: 5,
    sks: 3,
    targetGrade: 'A',
    capaianPembelajaran: 'Mahasiswa memahami prinsip machine learning, supervised & unsupervised learning, Neural Networks (CNN/RNN), dan evaluasi performa model AI.',
  },
  {
    id: 'course-5',
    code: 'UNI201',
    name: 'Etika Profesi & Kewarganegaraan',
    lecturer: 'Dra. Maya Sary, M.Si.',
    room: 'Gedung Ruang 102',
    color: '#ec4899',
    semester: 5,
    sks: 2,
    targetGrade: 'A',
    capaianPembelajaran: 'Mahasiswa memiliki kesadaran hukum, etika profesionalitas di bidang teknologi informasi, serta hak cipta dan kewarganegaraan digital.',
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sched-1',
    courseId: 'course-1',
    courseName: 'Pemrograman Web Lanjut',
    courseCode: 'TIF301',
    color: '#3b82f6',
    dayOfWeek: 1, // Senin
    dayName: 'Senin',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab Komputer 302',
  },
  {
    id: 'sched-2',
    courseId: 'course-2',
    courseName: 'Basis Data Terdistribusi',
    courseCode: 'TIF302',
    color: '#8b5cf6',
    dayOfWeek: 1, // Senin
    dayName: 'Senin',
    startTime: '13:00',
    endTime: '15:30',
    room: 'Gedung Ruang 204',
  },
  {
    id: 'sched-3',
    courseId: 'course-3',
    courseName: 'Algoritma & Struktur Data',
    courseCode: 'TIF303',
    color: '#10b981',
    dayOfWeek: 2, // Selasa
    dayName: 'Selasa',
    startTime: '09:30',
    endTime: '12:00',
    room: 'Lab Komputer 101',
  },
  {
    id: 'sched-4',
    courseId: 'course-4',
    courseName: 'Kecerdasan Buatan',
    courseCode: 'TIF304',
    color: '#f59e0b',
    dayOfWeek: 3, // Rabu
    dayName: 'Rabu',
    startTime: '10:00',
    endTime: '12:30',
    room: 'Gedung Ruang 301',
  },
  {
    id: 'sched-5',
    courseId: 'course-5',
    courseName: 'Etika Profesi & Kewarganegaraan',
    courseCode: 'UNI201',
    color: '#ec4899',
    dayOfWeek: 4, // Kamis
    dayName: 'Kamis',
    startTime: '08:00',
    endTime: '09:40',
    room: 'Gedung Ruang 102',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    courseId: 'course-1',
    courseName: 'Pemrograman Web Lanjut',
    title: 'Laporan Praktikum 4 - Implementation Next.js App Router & Prisma',
    description: 'Buat aplikasi CRUD sederhana menggunakan Next.js App Router, Prisma ORM, dan upload tautan GDrive pengumpulan.',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // Besok
    driveUrl: 'https://drive.google.com/drive/folders/1nata-demo-web-dev',
    tags: 'Praktikum, NextJS, Prisma',
  },
  {
    id: 'task-2',
    courseId: 'course-2',
    courseName: 'Basis Data Terdistribusi',
    title: 'Tugas Kelompok ERD & Replika Sharding Database',
    description: 'Desain diagram ERD terdistribusi dengan 3 node replikasi dan analisis performa.',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 Hari lagi
    driveUrl: 'https://drive.google.com/drive/folders/1nata-demo-db-dist',
    tags: 'Kelompok, Database, ERD',
  },
  {
    id: 'task-3',
    courseId: 'course-3',
    courseName: 'Algoritma & Struktur Data',
    title: 'Implementasi Algoritma Dijkstra & Graph Shortest Path',
    description: 'Koding dalam C++/Python untuk mencari rute terpendek antar kampus.',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 hari lalu
    driveUrl: 'https://drive.google.com/drive/folders/1nata-demo-algo',
    tags: 'C++, Graph, Algoritma',
  },
  {
    id: 'task-4',
    courseId: 'course-4',
    courseName: 'Kecerdasan Buatan',
    title: 'Review Jurnal Ilmiah Machine Learning & Neural Network',
    description: 'Rangkum 2 jurnal IEEE terkemuka mengenai Convolutional Neural Network (CNN).',
    priority: 'LOW',
    status: 'TODO',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    driveUrl: 'https://drive.google.com/drive/folders/1nata-demo-ai',
    tags: 'Review, AI, IEEE',
  },
];

export const INITIAL_DRIVE_LINKS: DriveLinkItem[] = [
  {
    id: 'drive-1',
    courseId: 'course-1',
    courseName: 'Pemrograman Web Lanjut',
    title: 'Folder Pengumpulan Tugas & Praktikum Web Dev',
    url: 'https://drive.google.com/drive/folders/1nata-demo-web-dev',
    category: 'TUGAS',
    description: 'Folder resmi pengumpulan laporan praktikum mingguan ke Dosen.',
  },
  {
    id: 'drive-2',
    courseId: 'course-2',
    courseName: 'Basis Data Terdistribusi',
    title: 'Slide Presentations & Modul BDT 2026',
    url: 'https://drive.google.com/file/d/1nata-materi-db/view',
    category: 'MATERI',
    description: 'Kumpulan slide materi kuliah semester 5.',
  },
  {
    id: 'drive-3',
    courseId: 'course-3',
    courseName: 'Algoritma & Struktur Data',
    title: 'E-Book Data Structures & Algorithms in Java/C++',
    url: 'https://drive.google.com/file/d/1nata-ebook-algo/view',
    category: 'MATERI',
    description: 'Buku referensi utama mata kuliah Algoritma.',
  },
  {
    id: 'drive-4',
    courseId: undefined,
    courseName: 'Umum / Kemahasiswaan',
    title: 'Template Proposal Tugas Akhir & Skripsi',
    url: 'https://drive.google.com/drive/folders/1nata-template-ta',
    category: 'PROYEK',
    description: 'Template Word & LaTeX resmi fakultas.',
  },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'trx-1',
    type: 'PEMASUKAN',
    category: 'UANG_SAKU',
    amount: 2500000,
    title: 'Transfer Uang Saku Bulanan dari Orang Tua',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: 'Jatah awal bulan September',
  },
  {
    id: 'trx-2',
    type: 'PEMASUKAN',
    category: 'SIDE_HUSTLE',
    amount: 600000,
    title: 'Honor Freelance Pembuatan Landing Page Client',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Proyek website UMKM',
  },
  {
    id: 'trx-3',
    type: 'PENGELUARAN',
    category: 'KOS',
    amount: 850000,
    title: 'Pembayaran Uang Kos Bulan September',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: 'Kamar 12 (Free Wi-Fi & Listrik)',
  },
  {
    id: 'trx-4',
    type: 'PENGELUARAN',
    category: 'MAKAN',
    amount: 24000,
    title: 'Makan Siang Nasi Ayam Goreng + Es Teh',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: 'Warung Bu Sri dekat kampus',
  },
  {
    id: 'trx-5',
    type: 'PENGELUARAN',
    category: 'LAUNDRY',
    amount: 35000,
    title: 'Cuci Kiloan 5 kg (Cuci + Setrika)',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Laundry Express 1 Hari',
  },
  {
    id: 'trx-6',
    type: 'PENGELUARAN',
    category: 'KUOTA',
    amount: 95000,
    title: 'Paket Data Telkomsel 50GB Bulanan',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: 'Cadangan kalau Wi-Fi kos lemot',
  },
  {
    id: 'trx-7',
    type: 'PENGELUARAN',
    category: 'HIBURAN',
    amount: 32000,
    title: 'Kopi Milk Tea & French Fries (Nugas Kafe)',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: 'Belajar bareng teman kelompok',
  },
  {
    id: 'trx-8',
    type: 'PENGELUARAN',
    category: 'ALAT_TULIS',
    amount: 28000,
    title: 'Beli Buku Tulis Binder + Pulpen Gel 3 Pcs',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: 'Perlengkapan kuliah semester baru',
  },
];

export const INITIAL_BUDGETS: BudgetItem[] = [
  { id: 'b-1', category: 'KOS', amountLimit: 850000, spentAmount: 850000 },
  { id: 'b-2', category: 'MAKAN', amountLimit: 900000, spentAmount: 340000 },
  { id: 'b-3', category: 'LAUNDRY', amountLimit: 150000, spentAmount: 35000 },
  { id: 'b-4', category: 'KUOTA', amountLimit: 120000, spentAmount: 95000 },
  { id: 'b-5', category: 'HIBURAN', amountLimit: 300000, spentAmount: 110000 },
  { id: 'b-6', category: 'ALAT_TULIS', amountLimit: 100000, spentAmount: 28000 },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoalItem[] = [
  {
    id: 'save-1',
    title: 'Tabungan Laptop Baru (M3 / Core i7)',
    targetAmount: 12000000,
    currentAmount: 4800000,
    deadline: '2026-12-31',
    color: '#10b981',
    icon: 'laptop',
  },
  {
    id: 'save-2',
    title: 'Dana Mudik Liburan Semester',
    targetAmount: 1500000,
    currentAmount: 950000,
    deadline: '2026-11-20',
    color: '#3b82f6',
    icon: 'train',
  },
  {
    id: 'save-3',
    title: 'Dana Darurat Anak Kos',
    targetAmount: 2000000,
    currentAmount: 1350000,
    deadline: '2026-10-30',
    color: '#f59e0b',
    icon: 'shield',
  },
];

export const INITIAL_BILL_REMINDERS: BillReminderItem[] = [
  {
    id: 'bill-1',
    title: 'Pembayaran Uang Kos Kamar 12',
    amount: 850000,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    isPaid: true,
    recurringPeriod: 'BULANAN',
  },
  {
    id: 'bill-2',
    title: 'Iuran Wi-Fi Kos Tercepat',
    amount: 50000,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    isPaid: false,
    recurringPeriod: 'BULANAN',
  },
  {
    id: 'bill-3',
    title: 'Pembelian Token Listrik PLN Kamar',
    amount: 100000,
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    isPaid: false,
    recurringPeriod: 'BULANAN',
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Informasi Penting Rumah Kos',
    content: '1. Wi-Fi SSID: Kos_Joss_5G (Pass: AnakKosSemangat2026)\n2. Jam Malam Pagar Kos: 23:00 WIB (Kunci bawa sendiri)\n3. Ibu Kos Contact: 0812-3456-7890 (Ibu Retno)',
    category: 'Kos',
    isPinned: true,
    tags: 'Wifi, Kontrak, IbuKos',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Catatan Rapat Kelompok Web Dev',
    content: 'Pembagian Fitur:\n- Budi: Auth & Prisma Schema Supabase\n- Andi: UI Dashboard & Responsive Sidebar\n- Siti: Integration Google Drive API Links',
    category: 'Kuliah',
    isPinned: false,
    tags: 'WebDev, Kelompok',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_PERSONAL_GOALS: PersonalGoalItem[] = [
  {
    id: 'g-1',
    title: 'Raih IPK Semester 5 Minimal ≥ 3.80',
    completed: false,
    category: 'Akademik',
  },
  {
    id: 'g-2',
    title: 'Lulus Sertifikasi AWS Cloud Practitioner / Dicoding',
    completed: true,
    category: 'Skill',
  },
  {
    id: 'g-3',
    title: 'Terkumpul Dana Darurat Kos Rp 2.000.000',
    completed: false,
    category: 'Finansial',
  },
  {
    id: 'g-4',
    title: 'Beli Meja Belajar Lipat & Kursi Ergonomis Kos',
    completed: true,
    category: 'Kos',
  },
];

