import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/notes
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Gagal mengambil catatan' }, { status: 500 });
  }
}

// POST /api/notes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, isPinned, tags } = body;

    const { data, error } = await supabaseAdmin
      .from('notes')
      .insert([{
        title,
        content,
        category: category || 'Umum',
        is_pinned: isPinned || false,
        tags: tags || null,
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Gagal menambah catatan', details: String(error) }, { status: 500 });
  }
}

// PATCH /api/notes?id=xxx - Toggle pin
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('notes')
      .update({ is_pinned: body.isPinned, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PATCH /api/notes error:', error);
    return NextResponse.json({ error: 'Gagal update catatan' }, { status: 500 });
  }
}

// DELETE /api/notes?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Catatan berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/notes error:', error);
    return NextResponse.json({ error: 'Gagal menghapus catatan' }, { status: 500 });
  }
}
