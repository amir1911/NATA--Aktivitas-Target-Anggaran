import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/drive-links
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('drive_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/drive-links error:', error);
    return NextResponse.json({ error: 'Gagal mengambil tautan Drive' }, { status: 500 });
  }
}

// POST /api/drive-links
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseName, title, url, category, description } = body;

    const { data, error } = await supabaseAdmin
      .from('drive_links')
      .insert([{
        course_id: courseId || null,
        course_name: courseName || null,
        title,
        url,
        category: category || 'LAINNYA',
        description: description || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/drive-links error:', error);
    return NextResponse.json({ error: 'Gagal menambah tautan Drive', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/drive-links?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('drive_links')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Tautan Drive berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/drive-links error:', error);
    return NextResponse.json({ error: 'Gagal menghapus tautan Drive' }, { status: 500 });
  }
}
