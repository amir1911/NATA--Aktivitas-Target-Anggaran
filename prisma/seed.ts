import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  INITIAL_USER,
  INITIAL_COURSES,
  INITIAL_SCHEDULES,
  INITIAL_TASKS,
  INITIAL_DRIVE_LINKS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BILL_REMINDERS,
  INITIAL_NOTES,
} from '../src/lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database Supabase PostgreSQL dengan data demo NATA...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create or Update Demo User
  const user = await prisma.user.upsert({
    where: { email: INITIAL_USER.email },
    update: {
      name: INITIAL_USER.name,
      university: INITIAL_USER.university,
      major: INITIAL_USER.major,
      monthlyAllowance: INITIAL_USER.monthlyAllowance,
    },
    create: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      email: INITIAL_USER.email,
      passwordHash: hashedPassword,
      university: INITIAL_USER.university,
      major: INITIAL_USER.major,
      monthlyAllowance: INITIAL_USER.monthlyAllowance,
    },
  });

  console.log(`✅ User berhasil dibuat: ${user.name} (${user.email})`);

  // 2. Create Courses & Schedules
  for (const c of INITIAL_COURSES) {
    const course = await prisma.course.upsert({
      where: { id: c.id },
      update: {
        code: c.code,
        name: c.name,
        lecturer: c.lecturer,
        room: c.room,
        color: c.color,
        semester: c.semester,
        sks: c.sks,
        targetGrade: c.targetGrade,
      },
      create: {
        id: c.id,
        userId: user.id,
        code: c.code,
        name: c.name,
        lecturer: c.lecturer,
        room: c.room,
        color: c.color,
        semester: c.semester,
        sks: c.sks,
        targetGrade: c.targetGrade,
      },
    });

    const scheds = INITIAL_SCHEDULES.filter((s) => s.courseId === c.id);
    for (const s of scheds) {
      await prisma.classSchedule.upsert({
        where: { id: s.id },
        update: {
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        },
        create: {
          id: s.id,
          courseId: course.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        },
      });
    }
  }

  // 3. Create Tasks
  for (const t of INITIAL_TASKS) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: new Date(t.dueDate),
        driveUrl: t.driveUrl,
        tags: t.tags,
      },
      create: {
        id: t.id,
        userId: user.id,
        courseId: t.courseId,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: new Date(t.dueDate),
        driveUrl: t.driveUrl,
        tags: t.tags,
      },
    });
  }

  // 4. Create Drive Links
  for (const d of INITIAL_DRIVE_LINKS) {
    await prisma.driveLink.upsert({
      where: { id: d.id },
      update: {
        title: d.title,
        url: d.url,
        category: d.category,
        description: d.description,
      },
      create: {
        id: d.id,
        userId: user.id,
        courseId: d.courseId,
        title: d.title,
        url: d.url,
        category: d.category,
        description: d.description,
      },
    });
  }

  // 5. Create Transactions
  for (const tr of INITIAL_TRANSACTIONS) {
    await prisma.transaction.upsert({
      where: { id: tr.id },
      update: {
        type: tr.type,
        category: tr.category,
        amount: tr.amount,
        title: tr.title,
        date: new Date(tr.date),
        notes: tr.notes,
      },
      create: {
        id: tr.id,
        userId: user.id,
        type: tr.type,
        category: tr.category,
        amount: tr.amount,
        title: tr.title,
        date: new Date(tr.date),
        notes: tr.notes,
      },
    });
  }

  // 6. Create Budgets
  for (const b of INITIAL_BUDGETS) {
    await prisma.budget.upsert({
      where: {
        userId_category_monthYear: {
          userId: user.id,
          category: b.category,
          monthYear: '2026-09',
        },
      },
      update: {
        amountLimit: b.amountLimit,
      },
      create: {
        id: b.id,
        userId: user.id,
        category: b.category,
        amountLimit: b.amountLimit,
        monthYear: '2026-09',
      },
    });
  }

  // 7. Create Savings Goals
  for (const sg of INITIAL_SAVINGS_GOALS) {
    await prisma.savingsGoal.upsert({
      where: { id: sg.id },
      update: {
        title: sg.title,
        targetAmount: sg.targetAmount,
        currentAmount: sg.currentAmount,
        deadline: new Date(sg.deadline),
        color: sg.color,
        icon: sg.icon,
      },
      create: {
        id: sg.id,
        userId: user.id,
        title: sg.title,
        targetAmount: sg.targetAmount,
        currentAmount: sg.currentAmount,
        deadline: new Date(sg.deadline),
        color: sg.color,
        icon: sg.icon,
      },
    });
  }

  // 8. Create Bill Reminders
  for (const br of INITIAL_BILL_REMINDERS) {
    await prisma.billReminder.upsert({
      where: { id: br.id },
      update: {
        title: br.title,
        amount: br.amount,
        dueDate: new Date(br.dueDate),
        isPaid: br.isPaid,
        recurringPeriod: br.recurringPeriod,
      },
      create: {
        id: br.id,
        userId: user.id,
        title: br.title,
        amount: br.amount,
        dueDate: new Date(br.dueDate),
        isPaid: br.isPaid,
        recurringPeriod: br.recurringPeriod,
      },
    });
  }

  // 9. Create Notes
  for (const n of INITIAL_NOTES) {
    await prisma.note.upsert({
      where: { id: n.id },
      update: {
        title: n.title,
        content: n.content,
        category: n.category,
        isPinned: n.isPinned,
        tags: n.tags,
      },
      create: {
        id: n.id,
        userId: user.id,
        title: n.title,
        content: n.content,
        category: n.category,
        isPinned: n.isPinned,
        tags: n.tags,
      },
    });
  }

  console.log('🎉 Seeding Supabase PostgreSQL selesai dengan sukses!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('⚠️ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
