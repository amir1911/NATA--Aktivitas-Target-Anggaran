import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isValidKey = rawKey && !rawKey.includes('GANTI_DENGAN');
const supabaseKey = isValidKey ? rawKey : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

/**
 * Supabase Admin Client
 * - Digunakan di server-side (API routes, Server Components, Webhook)
 * - Fallback ke Anon Key bila Service Role Key belum diganti
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
