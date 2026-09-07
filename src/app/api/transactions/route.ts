import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/transactions
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data transaksi' }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, category, amount, title, date, notes } = body;

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([{
        type,
        category,
        amount: Number(amount),
        title,
        date: date || new Date().toISOString(),
        notes: notes || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Gagal menambah transaksi', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/transactions?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json({ error: 'Gagal menghapus transaksi' }, { status: 500 });
  }
}
