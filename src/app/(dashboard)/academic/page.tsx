'use client';

import React, { useState, useContext } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckSquare,
  FolderOpen,
  Plus,
  Copy,
  Check,
  Search,
  ExternalLink,
  User,
  MapPin,
  Trash2,
  BookOpen,
  Award,
  FileText,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { FaUserGraduate, FaChromecast } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { Header } from '@/components/layout/Header';
import { MobileMenuContext } from '@/lib/mobile-menu-context';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useNataStore, DriveLinkItem, CourseItem, TaskItem } from '@/lib/store';

export default function AcademicPage() {
  const onMenuToggle = useContext(MobileMenuContext);
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    schedules,
    addSchedule,
    updateSchedule,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    driveLinks,
    addDriveLink,
    updateDriveLink,
    deleteDriveLink,
  } = useNataStore();

  const [activeTab, setActiveTab] = useState<'jadwal' | 'tugas' | 'drive'>('jadwal');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchDrive, setSearchDrive] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedRpsCourse, setSelectedRpsCourse] = useState<CourseItem | null>(null);

  // Edit tracking states
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingDriveId, setEditingDriveId] = useState<string | null>(null);

  // Course Form State
  const [cCode, setCCode] = useState('');
  const [cName, setCName] = useState('');
  const [cLecturer, setCLecturer] = useState('');
  const [cRoom, setCRoom] = useState('');
  const [cSks, setCSks] = useState('3');
  const [cColor, setCColor] = useState('#4EA5D9');
  const [cDay, setCDay] = useState('1');
  const [cStartTime, setCStartTime] = useState('08:00');
  const [cEndTime, setCEndTime] = useState('10:00');
  const [cCapaian, setCCapaian] = useState('');
  const [cEditSchedule, setCEditSchedule] = useState(true); // apakah jadwal ikut diupdate

  // Task Form State
  const [tTitle, setTTitle] = useState('');
  const [tCourse, setTCourse] = useState('');
  const [tPriority, setTPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [tDueDate, setTDueDate] = useState('');
  const [tDriveUrl, setTDriveUrl] = useState('');
  const [tDescription, setTDescription] = useState('');

  // Drive Link Form State
  const [dTitle, setDTitle] = useState('');
  const [dUrl, setDUrl] = useState('');
  const [dCategory, setDCategory] = useState<DriveLinkItem['category']>('TUGAS');
  const [dCourse, setDCourse] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Course Modal for Add
  const openNewCourseModal = () => {
    setEditingCourseId(null);
    setCCode('');
    setCName('');
    setCLecturer('');
    setCRoom('');
    setCSks('3');
    setCColor('#4EA5D9');
    setCDay('1');
    setCStartTime('08:00');
    setCEndTime('10:00');
    setCCapaian('');
    setCEditSchedule(true); // tambah baru, jadwal selalu dibuat
    setIsCourseModalOpen(true);
  };

  // Open Course Modal for Edit
  const openEditCourseModal = (course: CourseItem) => {
    // Cari jadwal dengan pencocokan fleksibel
    const sched = schedules.find(
      (s) => s.courseId === course.id || s.courseCode === course.code || s.courseName === course.name
    );
    setEditingCourseId(course.id);
    setCCode(course.code);
    setCName(course.name);
    setCLecturer(course.lecturer || '');
    setCRoom(course.room || '');
    setCSks(String(course.sks));
    setCColor(course.color || '#4EA5D9');
    setCCapaian(course.capaianPembelajaran || '');
    setCEditSchedule(false); // default: edit RPS saja, tidak mengubah jadwal
    if (sched) {
      setCDay(String(sched.dayOfWeek));
      setCStartTime(sched.startTime);
      setCEndTime(sched.endTime);
    }
    setIsCourseModalOpen(true);
  };

  // Open Task Modal for Add
  const openNewTaskModal = () => {
    setEditingTaskId(null);
    setTTitle('');
    setTCourse('');
    setTPriority('MEDIUM');
    setTDueDate('');
    setTDriveUrl('');
    setTDescription('');
    setIsTaskModalOpen(true);
  };

  // Open Task Modal for Edit
  const openEditTaskModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setTTitle(task.title);
    setTCourse(task.courseName || '');
    setTPriority(task.priority);
    setTDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setTDriveUrl(task.driveUrl || '');
    setTDescription(task.description || '');
    setIsTaskModalOpen(true);
  };

  // Open Drive Link Modal for Add
  const openNewDriveModal = () => {
    setEditingDriveId(null);
    setDTitle('');
    setDUrl('');
    setDCategory('TUGAS');
    setDCourse('');
    setIsDriveModalOpen(true);
  };

  // Open Drive Link Modal for Edit
  const openEditDriveModal = (link: DriveLinkItem) => {
    setEditingDriveId(link.id);
    setDTitle(link.title);
    setDUrl(link.url);
    setDCategory(link.category);
    setDCourse(link.courseName || '');
    setIsDriveModalOpen(true);
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cCode) return;

    const dayNames = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    if (editingCourseId) {
      // Edit: selalu update data course/RPS
      updateCourse(editingCourseId, {
        code: cCode,
        name: cName,
        lecturer: cLecturer,
        room: cRoom,
        color: cColor,
        sks: Number(cSks) || 3,
        capaianPembelajaran: cCapaian,
      });

      // Update jadwal HANYA jika user mencentang opsi ubah jadwal
      if (cEditSchedule) {
        const existingSched = schedules.find(
          (s) => s.courseId === editingCourseId || s.courseCode === cCode || s.courseName === cName
        );
        if (existingSched) {
          updateSchedule(existingSched.id, {
            courseName: cName,
            courseCode: cCode,
            color: cColor,
            dayOfWeek: Number(cDay),
            dayName: dayNames[Number(cDay)] || 'Senin',
            startTime: cStartTime,
            endTime: cEndTime,
            room: cRoom,
          });
        }
        // Jika tidak ada jadwal sama sekali, baru buat jadwal baru
        else {
          addSchedule({
            courseId: editingCourseId,
            courseName: cName,
            courseCode: cCode,
            color: cColor,
            dayOfWeek: Number(cDay),
            dayName: dayNames[Number(cDay)] || 'Senin',
            startTime: cStartTime,
            endTime: cEndTime,
            room: cRoom,
          });
        }
      }
    } else {
      // Tambah baru: selalu buat course + jadwal
      const courseId = `course-${Date.now()}`;
      addCourse({
        code: cCode,
        name: cName,
        lecturer: cLecturer,
        room: cRoom,
        color: cColor,
        semester: 5,
        sks: Number(cSks) || 3,
        targetGrade: 'A',
        capaianPembelajaran: cCapaian || 'Mahasiswa mampu memahami dan menguasai materi mata kuliah secara komprehensif.',
      });

      addSchedule({
        courseId,
        courseName: cName,
        courseCode: cCode,
        color: cColor,
        dayOfWeek: Number(cDay),
        dayName: dayNames[Number(cDay)] || 'Senin',
        startTime: cStartTime,
        endTime: cEndTime,
        room: cRoom,
      });
    }

    setEditingCourseId(null);
    setIsCourseModalOpen(false);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle) return;

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: tTitle,
        courseName: tCourse || 'Umum',
        priority: tPriority,
        dueDate: tDueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        driveUrl: tDriveUrl || undefined,
        description: tDescription,
      });
    } else {
      addTask({
        courseName: tCourse || 'Umum',
        title: tTitle,
        description: tDescription,
        priority: tPriority,
        status: 'TODO',
        dueDate: tDueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        driveUrl: tDriveUrl || undefined,
      });
    }

    setEditingTaskId(null);
    setIsTaskModalOpen(false);
  };

  const handleAddDriveLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dTitle || !dUrl) return;

    if (editingDriveId) {
      updateDriveLink(editingDriveId, {
        title: dTitle,
        url: dUrl,
        category: dCategory,
        courseName: dCourse || 'Umum',
      });
    } else {
      addDriveLink({
        courseName: dCourse || 'Umum',
        title: dTitle,
        url: dUrl,
        category: dCategory,
        description: 'Diinput oleh pengguna',
      });
    }

    setEditingDriveId(null);
    setIsDriveModalOpen(false);
  };

  const filteredDriveLinks = driveLinks.filter((link) => {
    const matchSearch =
      link.title.toLowerCase().includes(searchDrive.toLowerCase()) ||
      (link.courseName && link.courseName.toLowerCase().includes(searchDrive.toLowerCase()));
    const matchCategory = categoryFilter === 'ALL' || link.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalSKS = courses.reduce((sum, c) => sum + c.sks, 0);

  const getTasksForCourse = (courseName: string, courseCode?: string) => {
    return tasks.filter((t) => {
      if (!t.courseName) return false;
      const target = t.courseName.toLowerCase().trim();
      return (
        target === courseName.toLowerCase().trim() ||
        (courseCode && target === courseCode.toLowerCase().trim())
      );
    });
  };

  return (
    <div className="space-y-6">
      <Header title="Akademik, Jadwal & RPS Kuliah" onMenuToggle={onMenuToggle} />

      <div className="px-6 space-y-6">
        {/* Academic Overview Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091540 0%, #132060 60%, #1A2B7C 100%)',
          }}
          className="p-5 sm:p-6 rounded-3xl text-white shadow-xl shadow-navy-950/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#4EA5D9] shrink-0 border border-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{courses.length} Mata Kuliah Aktif</h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Total SKS: <span className="font-bold text-white">{totalSKS} SKS</span> | Jadwal Terjadwal: <span className="font-bold text-[#F59E0B]">{schedules.length} Kelas</span>
              </p>
            </div>
          </div>

          {/* Integrated Tab Navigation Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl flex-wrap">
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'jadwal'
                ? 'bg-white text-[#091540] shadow-md font-extrabold scale-105'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'jadwal' ? 'text-[#4EA5D9]' : 'text-sky-300'}`} />
              <span>Jadwal &amp; RPS Kuliah ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tugas')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'tugas'
                ? 'bg-white text-[#091540] shadow-md font-extrabold scale-105'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
            >
              <CheckSquare className={`w-4 h-4 ${activeTab === 'tugas' ? 'text-[#F59E0B]' : 'text-amber-300'}`} />
              <span>Tugas ({tasks.filter((t) => t.status !== 'COMPLETED').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'drive'
                ? 'bg-white text-[#091540] shadow-md font-extrabold scale-105'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
            >
              <FolderOpen className={`w-4 h-4 ${activeTab === 'drive' ? 'text-[#22C55E]' : 'text-green-300'}`} />
              <span>Google Drive ({driveLinks.length})</span>
            </button>
          </div>
        </div>

        {/* Telegram Bot Academic Integration Banner */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <FaChromecast className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tanya Jadwal &amp; Akademik via Telegram Bot
                </h4>
                <Badge variant="blue">Aktif (@NataAmir_bot)</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketik langsung di Telegram: <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono text-[11px]">jadwal hari ini</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">jadwal besok</code>, <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 font-mono text-[11px]">/matkul</code>, atau <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">/tugas</code>!
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

        {/* TAB 1: UNIFIED JADWAL KULIAH & RENCANA PEMBELAJARAN SEMESTER (RPS) */}
        {activeTab === 'jadwal' && (
          <div className="space-y-8">
            {/* SECTION 1: WEEKLY TIMETABLE GRID */}
            <Card glass={false} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle>
                  <Calendar className="w-5 h-5 text-[#4EA5D9]" />
                  <span className="text-[#091540] dark:text-white">Jadwal Kuliah</span>
                </CardTitle>
                <Button variant="primary" size="sm" onClick={openNewCourseModal} className="text-xs">
                  <Plus className="w-4 h-4" />
                  <span>Input Jadwal &amp; Matkul</span>
                </Button>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                {[
                  { day: 1, name: 'Senin' },
                  { day: 2, name: 'Selasa' },
                  { day: 3, name: 'Rabu' },
                  { day: 4, name: 'Kamis' },
                  { day: 5, name: 'Jumat' },
                ].map(({ day, name }) => {
                  const dayScheds = schedules.filter((s) => s.dayOfWeek === day);

                  return (
                    <div key={day} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="text-xs font-extrabold text-[#091540] dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <span>{name}</span>
                        <span className="text-[10px] font-semibold text-slate-400">{dayScheds.length} Kelas</span>
                      </div>

                      <div className="space-y-2.5">
                        {dayScheds.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-6">Tidak ada perkuliahan</p>
                        ) : (
                          dayScheds.map((s) => {
                            const courseInfo = courses.find((c) => c.code === s.courseCode || c.name === s.courseName);
                            const linkedTasks = getTasksForCourse(s.courseName, s.courseCode);
                            const activeLinkedTasks = linkedTasks.filter((t) => t.status !== 'COMPLETED');

                            return (
                              <div
                                key={s.id}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative overflow-hidden shadow-xs hover:border-[#4EA5D9] transition-all group"
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: s.color || '#4EA5D9' }} />

                                <div className="flex items-center justify-between text-[10px] font-bold text-[#4EA5D9]">
                                  <span>{s.startTime} - {s.endTime}</span>
                                  <div className="flex items-center gap-1">
                                    <Badge variant="blue">{s.courseCode}</Badge>
                                    {courseInfo && (
                                      <button
                                        onClick={() => openEditCourseModal(courseInfo)}
                                        className="text-slate-400 hover:text-[#4EA5D9] p-0.5 cursor-pointer"
                                        title="Edit Jadwal / Matkul"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-xs font-extrabold text-[#091540] dark:text-white leading-tight">{s.courseName}</h5>
                                  {courseInfo?.lecturer && (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                                      <FaUserGraduate className="w-4 h-4 text-[#4EA5D9] shrink-0" />
                                      <span>{courseInfo.lecturer}</span>
                                    </p>
                                  )}
                                  <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                                    <SiGoogleclassroom className="w-4 h-4 text-[#4EA5D9] shrink-0" />
                                    <span>Ruang: <strong className="text-slate-700 dark:text-slate-200">{s.room || 'R. Kelas'}</strong></span>
                                  </p>
                                </div>

                                {linkedTasks.length > 0 && (
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                      onClick={() => {
                                        if (courseInfo) setSelectedRpsCourse(courseInfo);
                                      }}
                                      className="text-[10px] font-bold text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>📝 {activeLinkedTasks.length} Tugas Aktif</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* SECTION 2: RENCANA PEMBELAJARAN SEMESTER (RPS) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#091540] dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#8B5CF6]" />
                    <span>Rencana Pembelajaran Semester (RPS) &amp; Detail Mata Kuliah</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi utama mata kuliah, Dosen pengampu, SKS, Capaian Pembelajaran, dan tugas terhubung.
                  </p>
                </div>

                <Button variant="primary" size="sm" onClick={openNewCourseModal} className="text-xs shrink-0">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Matkul / RPS</span>
                </Button>
              </div>

              {courses.length === 0 ? (
                <Card glass={false} className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#091540] dark:text-white">Belum Ada RPS &amp; Mata Kuliah</p>
                  <p className="text-xs text-slate-400 mb-4">Input mata kuliah semester Anda untuk mengelola RPS dan tugas terkait.</p>
                  <Button variant="primary" size="sm" onClick={openNewCourseModal}>
                    <Plus className="w-4 h-4" />
                    <span>Tambah Mata Kuliah Pertama</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.map((course) => {
                    const courseTasks = getTasksForCourse(course.name, course.code);
                    const activeTasks = courseTasks.filter((t) => t.status !== 'COMPLETED');

                    return (
                      <Card
                        key={course.id}
                        glass={false}
                        className="relative overflow-hidden flex flex-col justify-between space-y-4 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#8B5CF6]/50 transition-all shadow-xs"
                      >
                        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: course.color }} />

                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Badge variant="blue">{course.code}</Badge>
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                {course.sks} SKS
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditCourseModal(course)}
                                className="text-slate-400 hover:text-[#4EA5D9] p-1 cursor-pointer"
                                title="Edit Mata Kuliah & RPS"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteCourse(course.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                                title="Hapus Mata Kuliah"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-base font-extrabold text-[#091540] dark:text-white">{course.name}</h4>
                            {course.lecturer && (
                              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
                                <FaUserGraduate className="w-5 h-5 text-[#4EA5D9] shrink-0" />
                                <span>{course.lecturer}</span>
                              </p>
                            )}
                          </div>

                          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8B5CF6]">
                              <Award className="w-3.5 h-3.5" />
                              <span>Capaian Pembelajaran (RPS)</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {course.capaianPembelajaran || 'Mahasiswa mampu memahami konsep dasar dan penerapan praktis mata kuliah ini secara komprehensif.'}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                                <span>Tugas Terkait ({courseTasks.length})</span>
                              </span>
                              {activeTasks.length > 0 && (
                                <span className="text-[10px] text-amber-600 font-extrabold bg-amber-100 px-1.5 py-0.5 rounded-full">
                                  {activeTasks.length} Pending
                                </span>
                              )}
                            </div>

                            {courseTasks.length === 0 ? (
                              <p className="text-[11px] text-slate-400 italic">Belum ada tugas terhubung</p>
                            ) : (
                              <div className="space-y-1">
                                {courseTasks.slice(0, 2).map((t) => (
                                  <div
                                    key={t.id}
                                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2"
                                  >
                                    <span className="font-semibold text-[#091540] truncate">{t.title}</span>
                                    <div className="flex items-center gap-1">
                                      <Badge variant={t.priority === 'URGENT' ? 'rose' : 'amber'}>{t.priority}</Badge>
                                      <button
                                        onClick={() => openEditTaskModal(t)}
                                        className="text-slate-400 hover:text-[#4EA5D9] p-0.5 cursor-pointer"
                                        title="Edit Tugas"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-medium flex items-center gap-2">
                            <SiGoogleclassroom className="w-5 h-5 text-[#4EA5D9] shrink-0" />
                            <span>{course.room || 'Ruang Kelas'}</span>
                          </span>

                          <button
                            onClick={() => setSelectedRpsCourse(course)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#091540] text-white hover:bg-[#132060] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Detail RPS &amp; Tugas</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TUGAS & DEADLINE TRACKER */}
        {activeTab === 'tugas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#091540] flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#4EA5D9]" />
                <span>Manajemen Tugas &amp; Deadline</span>
              </h3>

              <Button variant="primary" size="sm" onClick={openNewTaskModal} className="text-xs">
                <Plus className="w-4 h-4" />
                <span>Tambah Tugas Baru</span>
              </Button>
            </div>

            {/* Filter mata kuliah di tab tugas */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter Matkul:</span>
              <button
                onClick={() => setCourseFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${courseFilter === 'ALL'
                  ? 'bg-[#091540] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                Semua
              </button>
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCourseFilter(c.name)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${courseFilter === c.name
                    ? 'text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  style={courseFilter === c.name ? { backgroundColor: c.color || '#4EA5D9' } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.color || '#4EA5D9' }}
                  />
                  {c.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['TODO', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED'] as const).map((statusKey) => {
                const statusLabels = {
                  TODO: 'Belum Dikerjakan',
                  IN_PROGRESS: 'Sedang Dikerjakan',
                  SUBMITTED: 'Sudah Dikumpul',
                  COMPLETED: 'Selesai ✓',
                };

                const columnTasks = tasks.filter((t) => {
                  const matchStatus = t.status === statusKey;
                  const matchCourse = courseFilter === 'ALL' || t.courseName === courseFilter;
                  return matchStatus && matchCourse;
                });

                return (
                  <div key={statusKey} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-extrabold text-[#091540]">
                        {statusLabels[statusKey]}
                      </span>
                      <Badge variant="blue">{columnTasks.length}</Badge>
                    </div>

                    <div className="space-y-3">
                      {columnTasks.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">Tidak ada tugas</p>
                      ) : (
                        columnTasks.map((t) => (
                          <Card key={t.id} glass={false} className="p-3.5 space-y-2 border border-slate-200 bg-white hover:border-[#4EA5D9]/40 transition-colors overflow-hidden relative">
                            {/* course color strip */}
                            {(() => {
                              const linkedCourse = courses.find(
                                (c) => c.name === t.courseName || c.code === t.courseName
                              );
                              return linkedCourse ? (
                                <div
                                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                                  style={{ backgroundColor: linkedCourse.color || '#4EA5D9' }}
                                />
                              ) : null;
                            })()}
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span
                                className="font-bold text-xs px-2 py-0.5 rounded-full"
                                style={(() => {
                                  const lc = courses.find((c) => c.name === t.courseName || c.code === t.courseName);
                                  return lc
                                    ? { backgroundColor: (lc.color || '#4EA5D9') + '22', color: lc.color || '#4EA5D9' }
                                    : { color: '#4EA5D9' };
                                })()}
                              >
                                {t.courseName}
                              </span>
                              <div className="flex items-center gap-1">
                                <Badge variant={t.priority === 'URGENT' ? 'rose' : 'amber'}>{t.priority}</Badge>
                                <button
                                  onClick={() => openEditTaskModal(t)}
                                  className="text-slate-400 hover:text-[#4EA5D9] p-0.5 cursor-pointer"
                                  title="Edit Tugas"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteTask(t.id)}
                                  className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                                  title="Hapus Tugas"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h4 className="text-xs font-bold text-[#091540] leading-snug">{t.title}</h4>
                            {t.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
                            )}

                            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                              <span className="text-slate-400 font-medium">
                                📅 {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                              {t.driveUrl && (
                                <a
                                  href={t.driveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#4EA5D9] font-bold hover:underline flex items-center gap-1"
                                >
                                  GDrive <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: HUB LINK GOOGLE DRIVE */}
        {activeTab === 'drive' && (
          <div className="space-y-4">
            <Card glass={false} className="border border-slate-200/80 bg-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchDrive}
                    onChange={(e) => setSearchDrive(e.target.value)}
                    placeholder="Cari link Drive..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="TUGAS">Tugas</option>
                    <option value="MATERI">Materi Kuliah</option>
                    <option value="PROYEK">Proyek</option>
                  </select>

                  <Button variant="primary" size="sm" onClick={openNewDriveModal} className="text-xs shrink-0">
                    <Plus className="w-4 h-4" />
                    <span>Simpan Link Drive</span>
                  </Button>
                </div>
              </div>
            </Card>

            {filteredDriveLinks.length === 0 ? (
              <Card glass={false} className="p-8 text-center border-2 border-dashed border-slate-200 bg-slate-50/50">
                <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#091540]">Belum Ada Tautan Google Drive</p>
                <p className="text-xs text-slate-400 mb-4">Simpan link folder GDrive tugas atau materi kuliah Anda di sini.</p>
                <Button variant="primary" size="sm" onClick={openNewDriveModal}>
                  <Plus className="w-4 h-4" />
                  <span>Simpan Link Drive Pertama</span>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDriveLinks.map((link) => (
                  <Card key={link.id} glass={false} className="flex flex-col justify-between space-y-3 border border-slate-200/80 bg-white hover:border-[#4EA5D9]/40 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={link.category === 'TUGAS' ? 'rose' : 'blue'}>{link.category}</Badge>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditDriveModal(link)}
                            className="text-slate-400 hover:text-[#4EA5D9] p-0.5 cursor-pointer"
                            title="Edit Link Drive"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDriveLink(link.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                            title="Hapus Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#091540] flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-[#F59E0B] shrink-0" />
                        <span>{link.title}</span>
                      </h4>
                      {link.description && <p className="text-xs text-slate-500">{link.description}</p>}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className="text-xs font-bold text-slate-600 hover:text-[#091540] flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === link.id ? 'Tersalin!' : 'Salin Tautan'}</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#091540] text-white hover:bg-[#132060] flex items-center gap-1.5 transition-colors"
                      >
                        <span>Buka Folder Drive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail RPS & Tugas */}
      <Modal
        isOpen={!!selectedRpsCourse}
        onClose={() => setSelectedRpsCourse(null)}
        title={`RPS & Detail: ${selectedRpsCourse?.name || ''}`}
      >
        {selectedRpsCourse && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#091540] to-[#132060] text-white space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="blue">{selectedRpsCourse.code}</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#4EA5D9] bg-white/10 px-2.5 py-1 rounded-lg">
                    {selectedRpsCourse.sks} SKS
                  </span>
                  <button
                    onClick={() => {
                      const courseToEdit = selectedRpsCourse;
                      setSelectedRpsCourse(null);
                      openEditCourseModal(courseToEdit);
                    }}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                    title="Edit Mata Kuliah Ini"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-extrabold">{selectedRpsCourse.name}</h3>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 flex-wrap">
                <FaUserGraduate className="w-5 h-5 text-[#4EA5D9] shrink-0" />
                <span>Dosen:</span>
                <span className="font-bold text-white mr-2">{selectedRpsCourse.lecturer || 'Belum diisi'}</span>
                <span>|</span>
                <SiGoogleclassroom className="w-5 h-5 text-[#4EA5D9] shrink-0 ml-1" />
                <span>Ruang:</span>
                <span className="font-bold text-white">{selectedRpsCourse.room || 'R. Kelas'}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <h4 className="text-xs font-extrabold text-[#8B5CF6] flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Capaian Pembelajaran (RPS)</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedRpsCourse.capaianPembelajaran || 'Mahasiswa mampu memahami konsep utama dan mengaplikasikan teori ke dalam praktek nyata.'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#091540] flex items-center gap-1.5 uppercase tracking-wider">
                <CheckSquare className="w-4 h-4 text-[#4EA5D9]" />
                <span>Tugas &amp; Deadline Terhubung</span>
              </h4>

              {getTasksForCourse(selectedRpsCourse.name, selectedRpsCourse.code).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3 bg-slate-50 rounded-xl">
                  Tidak ada tugas terhubung untuk mata kuliah ini.
                </p>
              ) : (
                <div className="space-y-2">
                  {getTasksForCourse(selectedRpsCourse.name, selectedRpsCourse.code).map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={t.priority === 'URGENT' ? 'rose' : 'amber'}>{t.priority}</Badge>
                          <span className="font-bold text-[#091540]">{t.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          📅 Deadline: {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRpsCourse(null);
                            openEditTaskModal(t);
                          }}
                          className="p-1 text-slate-400 hover:text-[#4EA5D9] cursor-pointer"
                          title="Edit Tugas"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateTaskStatus(t.id, t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          {t.status === 'COMPLETED' ? 'Selesai ✓' : 'Tandai Selesai'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedRpsCourse(null)}>
                Tutup Detail RPS
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Course & RPS Modal */}
      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={editingCourseId ? 'Edit Mata Kuliah & RPS' : 'Tambah Mata Kuliah & RPS Baru'}>
        <form onSubmit={handleAddCourseSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kode Matkul</label>
              <input
                type="text"
                required
                value={cCode}
                onChange={(e) => setCCode(e.target.value)}
                placeholder="TIF301"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Matkul</label>
              <input
                type="text"
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Pemrograman Web"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FaUserGraduate className="w-5 h-5 text-[#4EA5D9]" />
                <span>Dosen Pengampu</span>
              </label>
              <input
                type="text"
                value={cLecturer}
                onChange={(e) => setCLecturer(e.target.value)}
                placeholder="Dr. Hendra"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <SiGoogleclassroom className="w-5 h-5 text-[#4EA5D9]" />
                <span>Ruang Kelas</span>
              </label>
              <input
                type="text"
                value={cRoom}
                onChange={(e) => setCRoom(e.target.value)}
                placeholder="Lab 302 / Zoom"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Capaian Pembelajaran (RPS)</label>
            <textarea
              rows={3}
              value={cCapaian}
              onChange={(e) => setCCapaian(e.target.value)}
              placeholder="Tuliskan ringkasan capaian pembelajaran semester untuk mata kuliah ini..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SKS</label>
              <input
                type="number"
                value={cSks}
                onChange={(e) => setCSks(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Warna Badge</label>
              <input
                type="color"
                value={cColor}
                onChange={(e) => setCColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-300 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Toggle ubah jadwal — hanya tampil saat mode edit */}
          {editingCourseId && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <input
                id="cEditScheduleCheck"
                type="checkbox"
                checked={cEditSchedule}
                onChange={(e) => setCEditSchedule(e.target.checked)}
                className="w-4 h-4 rounded accent-[#4EA5D9] cursor-pointer"
              />
              <label htmlFor="cEditScheduleCheck" className="text-xs font-semibold text-blue-700 cursor-pointer select-none">
                Ubah jadwal kuliah juga (hari &amp; jam)
              </label>
            </div>
          )}

          {/* Input jadwal — selalu tampil saat tambah baru, atau saat edit + cEditSchedule=true */}
          {(!editingCourseId || cEditSchedule) && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hari Kuliah</label>
                <select
                  value={cDay}
                  onChange={(e) => setCDay(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                >
                  <option value="1">Senin</option>
                  <option value="2">Selasa</option>
                  <option value="3">Rabu</option>
                  <option value="4">Kamis</option>
                  <option value="5">Jumat</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={cStartTime}
                    onChange={(e) => setCStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={cEndTime}
                    onChange={(e) => setCEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-3 pt-2">
            <div className="text-xs text-slate-400">
              {editingCourseId
                ? cEditSchedule
                  ? '⚠️ Jadwal kuliah akan ikut diperbarui'
                  : '✏️ Hanya data RPS yang akan diubah'
                : '📅 Matkul & jadwal baru akan dibuat'}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCourseModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {editingCourseId ? 'Simpan Perubahan' : 'Simpan Matkul & RPS'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTaskId ? 'Edit Tugas / Deadline' : 'Tambah Tugas / Deadline Baru'}>
        <form onSubmit={handleAddTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas</label>
            <input
              type="text"
              required
              value={tTitle}
              onChange={(e) => setTTitle(e.target.value)}
              placeholder="Contoh: Laporan Praktikum Web App"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#4EA5D9]" />
                <span>Mata Kuliah</span>
              </label>
              {courses.length > 0 ? (
                <select
                  value={tCourse}
                  onChange={(e) => setTCourse(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4EA5D9] cursor-pointer"
                >
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.code} – {c.name}
                    </option>
                  ))}
                  <option value="Umum">Umum / Lainnya</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={tCourse}
                  onChange={(e) => setTCourse(e.target.value)}
                  placeholder="Ketik nama mata kuliah"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prioritas</label>
              <select
                value={tPriority}
                onChange={(e) => setTPriority(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              >
                <option value="LOW">Rendah (LOW)</option>
                <option value="MEDIUM">Sedang (MEDIUM)</option>
                <option value="HIGH">Tinggi (HIGH)</option>
                <option value="URGENT">Mendesak (URGENT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Deadline</label>
            <input
              type="date"
              required
              value={tDueDate}
              onChange={(e) => setTDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tautan Google Drive Submission (Opsional)</label>
            <input
              type="url"
              value={tDriveUrl}
              onChange={(e) => setTDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsTaskModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTaskId ? 'Simpan Perubahan Tugas' : 'Simpan Tugas'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Drive Link Modal */}
      <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title={editingDriveId ? 'Edit Tautan Google Drive' : 'Simpan Tautan Google Drive Baru'}>
        <form onSubmit={handleAddDriveLinkSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tautan / Folder</label>
            <input
              type="text"
              required
              value={dTitle}
              onChange={(e) => setDTitle(e.target.value)}
              placeholder="Folder Pengumpulan Tugas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL Google Drive</label>
            <input
              type="url"
              required
              value={dUrl}
              onChange={(e) => setDUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4EA5D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={dCategory}
                onChange={(e) => setDCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              >
                <option value="TUGAS">Tugas Pengumpulan</option>
                <option value="MATERI">Materi &amp; Slide</option>
                <option value="CATATAN">Catatan Kuliah</option>
                <option value="PROYEK">Proyek Tugas Akhir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Kuliah</label>
              <input
                type="text"
                value={dCourse}
                onChange={(e) => setDCourse(e.target.value)}
                placeholder="Nama Matkul"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDriveModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingDriveId ? 'Simpan Perubahan Link' : 'Simpan Link GDrive'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
