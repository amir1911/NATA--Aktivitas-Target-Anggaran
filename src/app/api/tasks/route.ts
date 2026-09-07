import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/tasks
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data tugas' }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, courseName, title, description, priority, status, dueDate, driveUrl, tags } = body;

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert([{
        course_id: courseId || null,
        course_name: courseName || null,
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        due_date: dueDate,
        drive_url: driveUrl || null,
        tags: tags || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Gagal menambah tugas', details: String(error) }, { status: 500 });
  }
}

// PATCH /api/tasks?id=xxx - Update status tugas
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PATCH /api/tasks error:', error);
    return NextResponse.json({ error: 'Gagal update status tugas' }, { status: 500 });
  }
}

// DELETE /api/tasks?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Tugas berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/tasks error:', error);
    return NextResponse.json({ error: 'Gagal menghapus tugas' }, { status: 500 });
  }
}
