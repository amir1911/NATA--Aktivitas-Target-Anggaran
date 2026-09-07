import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/personal-goals
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('personal_goals')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/personal-goals error:', error);
    return NextResponse.json({ error: 'Gagal mengambil target pribadi' }, { status: 500 });
  }
}

// POST /api/personal-goals
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, completed } = body;

    if (!title) {
      return NextResponse.json({ error: 'Judul target wajib diisi' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('personal_goals')
      .insert([{
        title,
        category: category || 'Akademik',
        completed: Boolean(completed) || false,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/personal-goals error:', error);
    return NextResponse.json({ error: 'Gagal menambah target pribadi', details: String(error) }, { status: 500 });
  }
}

// PATCH /api/personal-goals?id=xxx
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'ID target tidak ditemukan' }, { status: 400 });

    const payload: any = {};
    if (body.title !== undefined) payload.title = body.title;
    if (body.category !== undefined) payload.category = body.category;
    if (body.completed !== undefined) payload.completed = body.completed;

    const { data, error } = await supabaseAdmin
      .from('personal_goals')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PATCH /api/personal-goals error:', error);
    return NextResponse.json({ error: 'Gagal update target pribadi' }, { status: 500 });
  }
}

// DELETE /api/personal-goals?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID target tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('personal_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Target berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/personal-goals error:', error);
    return NextResponse.json({ error: 'Gagal menghapus target pribadi' }, { status: 500 });
  }
}
