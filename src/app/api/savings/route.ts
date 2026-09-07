import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_SAVINGS_GOALS } from '@/lib/mockData';

export async function GET() {
  try {
    const savings = await prisma.savingsGoal.findMany();
    if (savings.length > 0) {
      return NextResponse.json(savings);
    }
  } catch (error) {
    console.warn('Prisma error, falling back to mock savings:', error);
  }

  return NextResponse.json(INITIAL_SAVINGS_GOALS);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, targetAmount, currentAmount, deadline, color, icon } = body;

    try {
      const newGoal = await prisma.savingsGoal.create({
        data: {
          userId: 'user-demo-1',
          title,
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount) || 0,
          deadline: new Date(deadline),
          color: color || '#10b981',
          icon: icon || 'target',
        },
      });
      return NextResponse.json(newGoal, { status: 201 });
    } catch {
      const mockGoal = {
        id: `save-${Date.now()}`,
        title,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        deadline: deadline || new Date().toISOString(),
        color: color || '#10b981',
        icon: icon || 'target',
      };
      return NextResponse.json(mockGoal, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah target tabungan', details: String(error) }, { status: 500 });
  }
}
