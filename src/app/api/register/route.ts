import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 });
    }

    // Insert user into Supabase users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{
        name,
        email,
        password_hash: password, // In production, hash with bcrypt
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase register user error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Pendaftaran berhasil',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    }, { status: 201 });
  } catch (err: any) {
    console.error('Register API exception:', err);
    return NextResponse.json({ error: err.message || 'Gagal mendaftar akun' }, { status: 500 });
  }
}
