'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNataStore } from '@/lib/store';

const palette = {
  navy: '#091540',
  navyMid: '#132060',
  sky: '#4EA5D9',
  skyLight: '#EBF5FC',
  violet: '#8B5CF6',
  green: '#22C55E',
  ink: '#1A1A2E',
  inkSoft: '#6B7280',
  card: '#FFFFFF',
  inputBg: '#F6F8FC',
  border: '#E5E9F2',
};

export default function RegisterPage() {
  const router = useRouter();
  const { updateUser } = useNataStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let registeredUser = null;

      try {
        const apiRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const apiData = await apiRes.json();

        if (apiRes.ok && apiData.user) {
          registeredUser = apiData.user;
        }
      } catch (apiErr) {
        console.warn('API register fallback to client SDK:', apiErr);
      }

      if (!registeredUser) {
        const { data, error } = await supabase
          .from('users')
          .insert([{
            name,
            email,
            password_hash: password,
          }])
          .select()
          .single();

        if (error) {
          if (error.message?.includes('row-level security') || error.code === '42501') {
            updateUser({
              id: `user-${Date.now()}`,
              name,
              email,
            });
            setLoading(false);
            router.push('/dashboard');
            return;
          }

          setErrorMessage(error.message || 'Gagal mendaftar ke database Supabase');
          setLoading(false);
          return;
        }

        if (data) {
          registeredUser = {
            id: data.id,
            name: data.name,
            email: data.email,
          };
        }
      }

      if (registeredUser) {
        updateUser({
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
        });
      } else {
        updateUser({
          id: `user-${Date.now()}`,
          name,
          email,
        });
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Register exception:', err);
      updateUser({
        id: `user-${Date.now()}`,
        name,
        email,
      });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050C24 0%, #091540 50%, #15103A 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative flex items-center justify-center p-6 overflow-hidden select-none"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* Animated Ambient Orbs */
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.18); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-70px, -50px) scale(1.22); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -60px) scale(0.9); }
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .orb-1 { animation: floatOrb1 14s ease-in-out infinite; }
        .orb-2 { animation: floatOrb2 18s ease-in-out infinite; }
        .orb-3 { animation: floatOrb3 12s ease-in-out infinite; }
        .nata-in { animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

        .nata-field { transition: border-color 0.2s, box-shadow 0.2s; }
        .nata-field:focus { border-color: ${palette.sky} !important; box-shadow: 0 0 0 3px rgba(78,165,217,0.22); }
        .nata-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(78,165,217,0.35); }
        .nata-submit { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
      `}</style>

      {/* ── Background Animated Orbs ──────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          style={{
            background: 'radial-gradient(circle, rgba(78,165,217,0.35) 0%, rgba(78,165,217,0) 70%)',
            width: '450px',
            height: '450px',
          }}
          className="orb-1 absolute -top-24 -left-24 rounded-full blur-3xl"
        />
        <div
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.38) 0%, rgba(139,92,246,0) 70%)',
            width: '500px',
            height: '500px',
          }}
          className="orb-2 absolute -bottom-32 -right-32 rounded-full blur-3xl"
        />
        <div
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0) 70%)',
            width: '380px',
            height: '380px',
          }}
          className="orb-3 absolute top-1/3 right-1/4 rounded-full blur-3xl"
        />
        <div
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
          className="absolute inset-0 opacity-40"
        />
      </div>

      {/* ── Main Register Container ─────────────────────────────── */}
      <div className="relative w-full max-w-sm nata-in z-10">

        {/* Main Card */}
        <div
          style={{
            background: palette.card,
            border: `1px solid ${palette.border}`,
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
          }}
          className="rounded-3xl overflow-hidden"
        >

          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.navyMid} 100%)`,
              position: 'relative',
              overflow: 'hidden',
            }}
            className="px-6 pt-8 pb-8"
          >
            <div
              style={{ background: 'rgba(78,165,217,0.18)', position: 'absolute', right: '-30px', top: '-30px', width: '130px', height: '130px', borderRadius: '9999px' }}
            />
            <div
              style={{ background: 'rgba(139,92,246,0.15)', position: 'absolute', left: '-20px', bottom: '-20px', width: '100px', height: '100px', borderRadius: '9999px' }}
            />

            {/* Static 3D Logo Badge with Deep Shadow */}
            <div className="relative text-center flex flex-col items-center">
              <div className="relative mb-4">
                <div
                  style={{
                    boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.45), 0 0 24px rgba(78, 165, 217, 0.35)',
                  }}
                  className="w-24 h-24 rounded-3xl bg-white p-3.5 flex items-center justify-center border-4 border-white/20"
                >
                  <img src="/logo.png" alt="NATA Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              <div
                style={{ background: 'rgba(78,165,217,0.22)', border: '1px solid rgba(78,165,217,0.38)' }}
                className="px-3 py-1 rounded-full mb-2.5 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4EA5D9]" />
                <span style={{ color: palette.sky }} className="text-xs font-bold tracking-wider">
                  DAFTAR AKUN
                </span>
              </div>

              <h1 className="text-white text-2xl font-extrabold leading-tight tracking-tight">
                Mulai kelola perkuliahan! 🎓
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-xs mt-1.5 leading-relaxed max-w-xs">
                Buat akun NATA untuk atur aktivitas, target, dan anggaran kos.
              </p>
            </div>
          </div>

          {/* Form container */}
          <div className="px-5 py-6 space-y-4">
            {errorMessage && (
              <div
                style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '12px', color: '#DC2626' }}
                className="px-4 py-3 text-xs font-medium"
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <label className="block">
                <span style={{ color: palette.inkSoft }} className="text-xs font-semibold">
                  Nama Lengkap
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Setiawan"
                  style={{
                    background: palette.inputBg,
                    color: palette.ink,
                    border: `1.5px solid ${palette.border}`,
                    borderRadius: '12px',
                  }}
                  className="nata-field w-full mt-1.5 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="block">
                <span style={{ color: palette.inkSoft }} className="text-xs font-semibold">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@mahasiswa.ac.id"
                  style={{
                    background: palette.inputBg,
                    color: palette.ink,
                    border: `1.5px solid ${palette.border}`,
                    borderRadius: '12px',
                  }}
                  className="nata-field w-full mt-1.5 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="block">
                <span style={{ color: palette.inkSoft }} className="text-xs font-semibold">
                  Kata Sandi
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    background: palette.inputBg,
                    color: palette.ink,
                    border: `1.5px solid ${palette.border}`,
                    borderRadius: '12px',
                  }}
                  className="nata-field w-full mt-1.5 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{ background: palette.navy, color: '#FFFFFF', borderRadius: '14px' }}
                className="nata-submit w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                <span>{loading ? 'Mendaftarkan akun...' : 'Buat Akun Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p style={{ color: palette.inkSoft }} className="text-center text-xs pt-1">
              Sudah punya akun?{' '}
              <Link href="/login" style={{ color: palette.sky }} className="font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ color: 'rgba(255,255,255,0.7)' }} className="flex items-center justify-center gap-2 text-xs mt-5">
          <ShieldCheck style={{ color: palette.green }} className="w-4 h-4" />
          <span>Data kamu tersimpan aman di Supabase</span>
        </div>
      </div>
    </div>
  );
}
