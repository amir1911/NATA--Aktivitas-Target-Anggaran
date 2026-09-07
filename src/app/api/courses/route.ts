import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/courses - Ambil semua mata kuliah
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*, schedules(*)')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data mata kuliah' }, { status: 500 });
  }
}

// POST /api/courses - Tambah mata kuliah baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, lecturer, room, color, semester, sks, targetGrade } = body;

    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([{
        code,
        name,
        lecturer,
        room,
        color: color || '#3b82f6',
        semester: Number(semester) || 1,
        sks: Number(sks) || 3,
        target_grade: targetGrade || 'A',
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/courses error:', error);
    return NextResponse.json({ error: 'Gagal menambah mata kuliah', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/courses?id=xxx - Hapus mata kuliah
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Mata kuliah berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/courses error:', error);
    return NextResponse.json({ error: 'Gagal menghapus mata kuliah' }, { status: 500 });
  }
}
