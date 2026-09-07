'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  semester?: number;
  monthlyAllowance?: number;
  phone?: string;
  bio?: string;
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
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
  dueDate: string;
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
}

export interface SavingsGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
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

interface NataStoreContextType {
  user: UserProfile;
  updateUser: (u: Partial<UserProfile>) => void;

  courses: CourseItem[];
  addCourse: (c: Omit<CourseItem, 'id'>) => Promise<void>;
  updateCourse: (id: string, c: Partial<CourseItem>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  schedules: ScheduleItem[];
  addSchedule: (s: Omit<ScheduleItem, 'id'>) => Promise<void>;
  updateSchedule: (id: string, s: Partial<ScheduleItem>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;

  tasks: TaskItem[];
  addTask: (t: Omit<TaskItem, 'id'>) => Promise<void>;
  updateTask: (id: string, t: Partial<TaskItem>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskItem['status']) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  driveLinks: DriveLinkItem[];
  addDriveLink: (d: Omit<DriveLinkItem, 'id'>) => Promise<void>;
  updateDriveLink: (id: string, d: Partial<DriveLinkItem>) => Promise<void>;
  deleteDriveLink: (id: string) => Promise<void>;

  transactions: TransactionItem[];
  addTransaction: (t: Omit<TransactionItem, 'id'>) => Promise<void>;
  updateTransaction: (id: string, tr: Partial<TransactionItem>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  budgets: BudgetItem[];
  setBudgetLimit: (category: BudgetItem['category'], limit: number) => void;

  savings: SavingsGoalItem[];
  addSavingsGoal: (s: Omit<SavingsGoalItem, 'id' | 'currentAmount'>) => void;
  updateSavingsGoal: (id: string, s: Partial<SavingsGoalItem>) => void;
  depositSavings: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;

  bills: BillReminderItem[];
  addBill: (b: Omit<BillReminderItem, 'id' | 'isPaid'>) => void;
  updateBill: (id: string, b: Partial<BillReminderItem>) => void;
  toggleBillPaid: (id: string) => void;
  deleteBill: (id: string) => void;

  notes: NoteItem[];
  addNote: (n: Omit<NoteItem, 'id' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, n: Partial<NoteItem>) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  personalGoals: PersonalGoalItem[];
  addPersonalGoal: (title: string, category: string) => Promise<void>;
  updatePersonalGoal: (id: string, g: Partial<PersonalGoalItem>) => Promise<void>;
  togglePersonalGoal: (id: string) => Promise<void>;
  deletePersonalGoal: (id: string) => Promise<void>;

  isConnectedToSupabase: boolean;
}

const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Mahasiswa Kos',
  email: 'mahasiswa@nata.app',
  university: '',
  major: '',
  semester: 1,
  monthlyAllowance: 0,
  phone: '',
  bio: '',
};

const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const NataContext = createContext<NataStoreContextType | undefined>(undefined);

export function NataProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);

  const [user, setUserState] = useState<UserProfile>(defaultUser);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [driveLinks, setDriveLinks] = useState<DriveLinkItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([
    { id: 'b-makan', category: 'MAKAN', amountLimit: 0 },
    { id: 'b-kos', category: 'KOS', amountLimit: 0 },
    { id: 'b-laundry', category: 'LAUNDRY', amountLimit: 0 },
    { id: 'b-kuota', category: 'KUOTA', amountLimit: 0 },
    { id: 'b-hiburan', category: 'HIBURAN', amountLimit: 0 },
    { id: 'b-atp', category: 'ALAT_TULIS', amountLimit: 0 },
  ]);
  const [savings, setSavings] = useState<SavingsGoalItem[]>([]);
  const [bills, setBills] = useState<BillReminderItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [personalGoals, setPersonalGoals] = useState<PersonalGoalItem[]>([]);

  // Load from Supabase on mount (with LocalStorage fallback)
  useEffect(() => {
    async function loadData() {
      let supabaseActive = false;

      try {
        // Try fetching from Supabase
        const [
          coursesRes,
          schedulesRes,
          tasksRes,
          driveRes,
          transRes,
          notesRes,
          goalsRes,
        ] = await Promise.all([
          supabase.from('courses').select('*'),
          supabase.from('schedules').select('*'),
          supabase.from('tasks').select('*'),
          supabase.from('drive_links').select('*'),
          supabase.from('transactions').select('*'),
          supabase.from('notes').select('*'),
          supabase.from('personal_goals').select('*'),
        ]);

        if (!coursesRes.error || !schedulesRes.error || !transRes.error) {
          supabaseActive = true;
          setIsConnectedToSupabase(true);

          if (coursesRes.data) {
            setCourses(coursesRes.data.map((c: any) => ({
              id: c.id,
              code: c.code,
              name: c.name,
              lecturer: c.lecturer,
              room: c.room,
              color: c.color,
              semester: c.semester,
              sks: c.sks,
              targetGrade: c.target_grade,
              capaianPembelajaran: c.capaian_pembelajaran || c.capaianPembelajaran,
            })));
          }

          if (schedulesRes.data) {
            setSchedules(schedulesRes.data.map((s: any) => ({
              id: s.id,
              courseId: s.course_id,
              courseName: s.course_name,
              courseCode: s.course_code,
              color: s.color,
              dayOfWeek: s.day_of_week,
              dayName: s.day_name,
              startTime: s.start_time,
              endTime: s.end_time,
              room: s.room,
            })));
          }

          if (tasksRes.data) {
            setTasks(tasksRes.data.map((t: any) => ({
              id: t.id,
              courseId: t.course_id,
              courseName: t.course_name,
              title: t.title,
              description: t.description,
              priority: t.priority,
              status: t.status,
              dueDate: t.due_date,
              driveUrl: t.drive_url,
              tags: t.tags,
            })));
          }

          if (driveRes.data) {
            setDriveLinks(driveRes.data.map((d: any) => ({
              id: d.id,
              courseId: d.course_id,
              courseName: d.course_name,
              title: d.title,
              url: d.url,
              category: d.category,
              description: d.description,
            })));
          }

          if (transRes.data) {
            setTransactions(transRes.data.map((tr: any) => ({
              id: tr.id,
              type: tr.type,
              category: tr.category,
              amount: Number(tr.amount),
              title: tr.title,
              date: tr.date,
              notes: tr.notes,
            })));
          }

          if (notesRes.data) {
            setNotes(notesRes.data.map((n: any) => ({
              id: n.id,
              title: n.title,
              content: n.content,
              category: n.category,
              isPinned: n.is_pinned,
              tags: n.tags,
              updatedAt: n.updated_at,
            })));
          }

          if (goalsRes.data) {
            setPersonalGoals(goalsRes.data.map((g: any) => ({
              id: g.id,
              title: g.title,
              completed: g.completed,
              category: g.category,
            })));
          }
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to LocalStorage:', e);
      }

      // If Supabase was not accessible or empty, load from LocalStorage
      if (!supabaseActive) {
        try {
          const savedUser = localStorage.getItem('nata_user');
          const savedCourses = localStorage.getItem('nata_courses');
          const savedSchedules = localStorage.getItem('nata_schedules');
          const savedTasks = localStorage.getItem('nata_tasks');
          const savedDriveLinks = localStorage.getItem('nata_drive_links');
          const savedTransactions = localStorage.getItem('nata_transactions');
          const savedBudgets = localStorage.getItem('nata_budgets');
          const savedSavings = localStorage.getItem('nata_savings');
          const savedBills = localStorage.getItem('nata_bills');
          const savedNotes = localStorage.getItem('nata_notes');
          const savedPersonalGoals = localStorage.getItem('nata_personal_goals');

          if (savedUser) setUserState(JSON.parse(savedUser));
          if (savedCourses) setCourses(JSON.parse(savedCourses));
          if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
          if (savedTasks) setTasks(JSON.parse(savedTasks));
          if (savedDriveLinks) setDriveLinks(JSON.parse(savedDriveLinks));
          if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
          if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
          if (savedSavings) setSavings(JSON.parse(savedSavings));
          if (savedBills) setBills(JSON.parse(savedBills));
          if (savedNotes) setNotes(JSON.parse(savedNotes));
          if (savedPersonalGoals) setPersonalGoals(JSON.parse(savedPersonalGoals));
        } catch (e) {
          console.warn('Error reading from localStorage:', e);
        }
      }

      setIsLoaded(true);
    }

    loadData();
  }, []);

  // Save changes to LocalStorage as cache
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('nata_user', JSON.stringify(user));
      localStorage.setItem('nata_courses', JSON.stringify(courses));
      localStorage.setItem('nata_schedules', JSON.stringify(schedules));
      localStorage.setItem('nata_tasks', JSON.stringify(tasks));
      localStorage.setItem('nata_drive_links', JSON.stringify(driveLinks));
      localStorage.setItem('nata_transactions', JSON.stringify(transactions));
      localStorage.setItem('nata_budgets', JSON.stringify(budgets));
      localStorage.setItem('nata_savings', JSON.stringify(savings));
      localStorage.setItem('nata_bills', JSON.stringify(bills));
      localStorage.setItem('nata_notes', JSON.stringify(notes));
      localStorage.setItem('nata_personal_goals', JSON.stringify(personalGoals));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }, [user, courses, schedules, tasks, driveLinks, transactions, budgets, savings, bills, notes, personalGoals, isLoaded]);

  const updateUser = (u: Partial<UserProfile>) => {
    setUserState((prev) => ({ ...prev, ...u }));
  };

  const addCourse = async (c: Omit<CourseItem, 'id'>) => {
    let newId = `course-${Date.now()}`;
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          code: c.code,
          name: c.name,
          lecturer: c.lecturer,
          room: c.room,
          color: c.color,
          semester: c.semester,
          sks: c.sks,
          target_grade: c.targetGrade,
          capaian_pembelajaran: c.capaianPembelajaran || null,
        }])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      }
    } catch (e) {
      console.warn('Supabase addCourse error:', e);
    }

    const newItem: CourseItem = { ...c, id: newId };
    setCourses((prev) => [...prev, newItem]);
  };

  const deleteCourse = async (id: string) => {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteCourse error:', e);
    }
    setCourses((prev) => prev.filter((item) => item.id !== id));
    setSchedules((prev) => prev.filter((s) => s.courseId !== id));
  };

  const updateCourse = async (id: string, c: Partial<CourseItem>) => {
    try {
      const payload: any = {};
      if (c.code !== undefined) payload.code = c.code;
      if (c.name !== undefined) payload.name = c.name;
      if (c.lecturer !== undefined) payload.lecturer = c.lecturer;
      if (c.room !== undefined) payload.room = c.room;
      if (c.color !== undefined) payload.color = c.color;
      if (c.semester !== undefined) payload.semester = c.semester;
      if (c.sks !== undefined) payload.sks = c.sks;
      if (c.targetGrade !== undefined) payload.target_grade = c.targetGrade;
      if (c.capaianPembelajaran !== undefined) payload.capaian_pembelajaran = c.capaianPembelajaran;
      await supabase.from('courses').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateCourse error:', e);
    }
    setCourses((prev) => prev.map((item) => (item.id === id ? { ...item, ...c } : item)));
  };

  const addSchedule = async (s: Omit<ScheduleItem, 'id'>) => {
    let newId = `sched-${Date.now()}`;
    try {
      const payload: any = {
        course_name: s.courseName,
        course_code: s.courseCode,
        color: s.color,
        day_of_week: s.dayOfWeek,
        day_name: s.dayName,
        start_time: s.startTime,
        end_time: s.endTime,
        room: s.room,
      };
      if (s.courseId && isValidUUID(s.courseId)) {
        payload.course_id = s.courseId;
      }
      const { data, error } = await supabase
        .from('schedules')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      } else if (error) {
        console.warn('Supabase addSchedule warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase addSchedule error:', e);
    }

    const newItem: ScheduleItem = { ...s, id: newId };
    setSchedules((prev) => [...prev, newItem]);
  };

  const deleteSchedule = async (id: string) => {
    if (isValidUUID(id)) {
      try {
        await supabase.from('schedules').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteSchedule error:', e);
      }
    }
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSchedule = async (id: string, s: Partial<ScheduleItem>) => {
    if (isValidUUID(id)) {
      try {
        const payload: any = {};
        if (s.courseId !== undefined && isValidUUID(s.courseId)) payload.course_id = s.courseId;
        if (s.courseName !== undefined) payload.course_name = s.courseName;
        if (s.courseCode !== undefined) payload.course_code = s.courseCode;
        if (s.color !== undefined) payload.color = s.color;
        if (s.dayOfWeek !== undefined) payload.day_of_week = s.dayOfWeek;
        if (s.dayName !== undefined) payload.day_name = s.dayName;
        if (s.startTime !== undefined) payload.start_time = s.startTime;
        if (s.endTime !== undefined) payload.end_time = s.endTime;
        if (s.room !== undefined) payload.room = s.room;
        await supabase.from('schedules').update(payload).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateSchedule error:', e);
      }
    }
    setSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  };

  const addTask = async (t: Omit<TaskItem, 'id'>) => {
    let newId = `task-${Date.now()}`;
    try {
      const payload: any = {
        course_name: t.courseName || null,
        title: t.title,
        description: t.description || null,
        priority: t.priority,
        status: t.status,
        due_date: t.dueDate,
        drive_url: t.driveUrl || null,
        tags: t.tags || null,
      };
      if (t.courseId && isValidUUID(t.courseId)) {
        payload.course_id = t.courseId;
      }
      const { data, error } = await supabase
        .from('tasks')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      } else if (error) {
        console.warn('Supabase addTask warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase addTask error:', e);
    }

    const newItem: TaskItem = { ...t, id: newId };
    setTasks((prev) => [newItem, ...prev]);

    if (t.driveUrl) {
      addDriveLink({
        courseId: t.courseId,
        courseName: t.courseName,
        title: `Pengumpulan: ${t.title}`,
        url: t.driveUrl,
        category: 'TUGAS',
        description: `Link pengumpulan tugas ${t.title}`,
      });
    }
  };

  const updateTaskStatus = async (id: string, status: TaskItem['status']) => {
    if (isValidUUID(id)) {
      try {
        await supabase.from('tasks').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateTaskStatus error:', e);
      }
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const updateTask = async (id: string, t: Partial<TaskItem>) => {
    if (isValidUUID(id)) {
      try {
        const payload: any = {};
        if (t.title !== undefined) payload.title = t.title;
        if (t.courseName !== undefined) payload.course_name = t.courseName;
        if (t.description !== undefined) payload.description = t.description;
        if (t.priority !== undefined) payload.priority = t.priority;
        if (t.status !== undefined) payload.status = t.status;
        if (t.dueDate !== undefined) payload.due_date = t.dueDate;
        if (t.driveUrl !== undefined) payload.drive_url = t.driveUrl;

        await supabase.from('tasks').update(payload).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateTask error:', e);
      }
    }
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, ...t } : item)));
  };

  const deleteTask = async (id: string) => {
    if (isValidUUID(id)) {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteTask error:', e);
      }
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addDriveLink = async (d: Omit<DriveLinkItem, 'id'>) => {
    let newId = `drive-${Date.now()}`;
    try {
      const payload: any = {
        course_name: d.courseName || null,
        title: d.title,
        url: d.url,
        category: d.category,
        description: d.description || null,
      };
      if (d.courseId && isValidUUID(d.courseId)) {
        payload.course_id = d.courseId;
      }
      const { data, error } = await supabase
        .from('drive_links')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      } else if (error) {
        console.warn('Supabase addDriveLink warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase addDriveLink error:', e);
    }

    const newItem: DriveLinkItem = { ...d, id: newId };
    setDriveLinks((prev) => [newItem, ...prev]);
  };

  const deleteDriveLink = async (id: string) => {
    try {
      await supabase.from('drive_links').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteDriveLink error:', e);
    }
    setDriveLinks((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDriveLink = async (id: string, d: Partial<DriveLinkItem>) => {
    try {
      const payload: any = {};
      if (d.title !== undefined) payload.title = d.title;
      if (d.url !== undefined) payload.url = d.url;
      if (d.category !== undefined) payload.category = d.category;
      if (d.courseName !== undefined) payload.course_name = d.courseName;
      if (d.description !== undefined) payload.description = d.description;
      await supabase.from('drive_links').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateDriveLink error:', e);
    }
    setDriveLinks((prev) => prev.map((item) => (item.id === id ? { ...item, ...d } : item)));
  };

  const addTransaction = async (t: Omit<TransactionItem, 'id'>) => {
    let newId = `trx-${Date.now()}`;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: t.type,
          category: t.category,
          amount: t.amount,
          title: t.title,
          date: t.date,
          notes: t.notes || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase insert transaction error:', error.message, error.details, error.hint);
      } else if (data) {
        newId = data.id;
        console.log('✅ Success insert transaction to Supabase:', data);
      }
    } catch (e) {
      console.warn('Supabase addTransaction exception:', e);
    }

    const newItem: TransactionItem = { ...t, id: newId };
    setTransactions((prev) => [newItem, ...prev]);
  };

  const updateTransaction = async (id: string, tr: Partial<TransactionItem>) => {
    try {
      const payload: any = {};
      if (tr.type !== undefined) payload.type = tr.type;
      if (tr.category !== undefined) payload.category = tr.category;
      if (tr.amount !== undefined) payload.amount = tr.amount;
      if (tr.title !== undefined) payload.title = tr.title;
      if (tr.date !== undefined) payload.date = tr.date;
      if (tr.notes !== undefined) payload.notes = tr.notes;
      await supabase.from('transactions').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateTransaction error:', e);
    }
    setTransactions((prev) => prev.map((item) => (item.id === id ? { ...item, ...tr } : item)));
  };

  const deleteTransaction = async (id: string) => {
    try {
      await supabase.from('transactions').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteTransaction error:', e);
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const setBudgetLimit = (category: BudgetItem['category'], limit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, amountLimit: limit } : b))
    );
  };

  const addSavingsGoal = (s: Omit<SavingsGoalItem, 'id' | 'currentAmount'>) => {
    const newItem: SavingsGoalItem = { ...s, id: `save-${Date.now()}`, currentAmount: 0 };
    setSavings((prev) => [...prev, newItem]);
  };

  const updateSavingsGoal = (id: string, s: Partial<SavingsGoalItem>) => {
    setSavings((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  };

  const depositSavings = (id: string, amount: number) => {
    setSavings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentAmount: s.currentAmount + amount } : s))
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavings((prev) => prev.filter((s) => s.id !== id));
  };

  const addBill = (b: Omit<BillReminderItem, 'id' | 'isPaid'>) => {
    const newItem: BillReminderItem = { ...b, id: `bill-${Date.now()}`, isPaid: false };
    setBills((prev) => [...prev, newItem]);
  };

  const updateBill = (id: string, b: Partial<BillReminderItem>) => {
    setBills((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
  };

  const toggleBillPaid = (id: string) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b)));
  };

  const deleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const addNote = async (n: Omit<NoteItem, 'id' | 'updatedAt'>) => {
    let newId = `note-${Date.now()}`;
    const updatedAt = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: n.title,
          content: n.content,
          category: n.category,
          is_pinned: n.isPinned,
          tags: n.tags || null,
          updated_at: updatedAt,
        }])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      }
    } catch (e) {
      console.warn('Supabase addNote error:', e);
    }

    const newItem: NoteItem = {
      ...n,
      id: newId,
      updatedAt,
    };
    setNotes((prev) => [newItem, ...prev]);
  };

  const updateNote = async (id: string, n: Partial<NoteItem>) => {
    const updatedAt = new Date().toISOString();
    try {
      const payload: any = { updated_at: updatedAt };
      if (n.title !== undefined) payload.title = n.title;
      if (n.content !== undefined) payload.content = n.content;
      if (n.category !== undefined) payload.category = n.category;
      if (n.isPinned !== undefined) payload.is_pinned = n.isPinned;
      if (n.tags !== undefined) payload.tags = n.tags;
      await supabase.from('notes').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateNote error:', e);
    }
    setNotes((prev) => prev.map((item) => (item.id === id ? { ...item, ...n, updatedAt } : item)));
  };

  const togglePinNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const newPinned = !note.isPinned;
    try {
      await supabase.from('notes').update({ is_pinned: newPinned }).eq('id', id);
    } catch (e) {
      console.warn('Supabase togglePinNote error:', e);
    }
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: newPinned } : n)));
  };

  const deleteNote = async (id: string) => {
    try {
      await supabase.from('notes').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteNote error:', e);
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addPersonalGoal = async (title: string, category: string) => {
    let newId = `g-${Date.now()}`;
    try {
      const { data, error } = await supabase
        .from('personal_goals')
        .insert([{
          title,
          category,
          completed: false,
        }])
        .select()
        .single();

      if (!error && data) {
        newId = data.id;
      }
    } catch (e) {
      console.warn('Supabase addPersonalGoal error:', e);
    }

    const newItem: PersonalGoalItem = { id: newId, title, completed: false, category };
    setPersonalGoals((prev) => [...prev, newItem]);
  };

  const updatePersonalGoal = async (id: string, g: Partial<PersonalGoalItem>) => {
    try {
      const payload: any = {};
      if (g.title !== undefined) payload.title = g.title;
      if (g.category !== undefined) payload.category = g.category;
      if (g.completed !== undefined) payload.completed = g.completed;
      await supabase.from('personal_goals').update(payload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updatePersonalGoal error:', e);
    }
    setPersonalGoals((prev) => prev.map((item) => (item.id === id ? { ...item, ...g } : item)));
  };

  const togglePersonalGoal = async (id: string) => {
    const goal = personalGoals.find((g) => g.id === id);
    if (!goal) return;
    const newComp = !goal.completed;
    try {
      await supabase.from('personal_goals').update({ completed: newComp }).eq('id', id);
    } catch (e) {
      console.warn('Supabase togglePersonalGoal error:', e);
    }
    setPersonalGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: newComp } : g))
    );
  };

  const deletePersonalGoal = async (id: string) => {
    try {
      await supabase.from('personal_goals').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deletePersonalGoal error:', e);
    }
    setPersonalGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <NataContext.Provider
      value={{
        user,
        updateUser,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        driveLinks,
        addDriveLink,
        updateDriveLink,
        deleteDriveLink,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets,
        setBudgetLimit,
        savings,
        addSavingsGoal,
        updateSavingsGoal,
        depositSavings,
        deleteSavingsGoal,
        bills,
        addBill,
        updateBill,
        toggleBillPaid,
        deleteBill,
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
        isConnectedToSupabase,
      }}
    >
      {children}
    </NataContext.Provider>
  );
}

export function useNataStore() {
  const context = useContext(NataContext);
  if (!context) {
    throw new Error('useNataStore must be used within NataProvider');
  }
  return context;
}
