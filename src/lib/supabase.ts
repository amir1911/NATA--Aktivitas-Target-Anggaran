import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase Client (Anon Key)
 * - Aman digunakan di browser (Client Components)
 * - Mengikuti Row Level Security (RLS) Supabase
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
