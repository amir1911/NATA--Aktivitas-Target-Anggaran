import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const time = new Date().toISOString();
    // 1. Test insert
    const insertRes = await supabase
      .from('transactions')
      .insert([{
        type: 'PEMASUKAN',
        category: 'UANG_SAKU',
        amount: 500000,
        title: `Tes Koneksi Supabase ${time}`,
        date: time,
        notes: 'Dibuat otomatis oleh NATA untuk tes koneksi',
      }])
      .select();

    // 2. Test select all
    const selectRes = await supabase.from('transactions').select('*');

    return NextResponse.json({
      status: 'SUCCESS! Supabase Connected and Insert Tested!',
      insertResult: insertRes,
      allTransactions: selectRes.data,
      count: selectRes.data ? selectRes.data.length : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
