import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_BUDGETS } from '@/lib/mockData';

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany();
    if (budgets.length > 0) {
      return NextResponse.json(budgets);
    }
  } catch (error) {
    console.warn('Prisma error, falling back to mock budgets:', error);
  }

  return NextResponse.json(INITIAL_BUDGETS);
}
