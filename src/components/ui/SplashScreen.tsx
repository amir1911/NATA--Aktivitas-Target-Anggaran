'use client';

import { useEffect, useState } from 'react';

const NATA_LETTERS = ['N', 'A', 'T', 'A'];
const TAGLINE = 'Nata Aktivitas, Target, dan Anggaran';
const PILLARS = [
  { label: 'Aktivitas', color: '#4EA5D9', delay: 0.9 },
  { label: 'Target', color: '#8B5CF6', delay: 1.1 },
  { label: 'Anggaran', color: '#22C55E', delay: 1.3 },
];

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 1600);
    const t2 = setTimeout(() => setPhase('out'), 2800);
    const t3 = setTimeout(() => {
      setPhase('done');
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.65s cubic-bezier(0.4,0,0.2,1)' : 'none',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Inter:wght@400;600&display=swap');

        @keyframes nataLetterIn {
          0%   { opacity: 0; transform: translateY(28px) scale(0.8); }
          60%  { opacity: 1; transform: translateY(-4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nataDotPulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.4); opacity: 1; }
        }
        @keyframes nataLineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes nataTaglineIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nataPillarIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes nataDotsFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .nata-letter { animation: nataLetterIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .nata-line-grow { animation: nataLineGrow 0.5s cubic-bezier(0.22,1,0.36,1) 0.75s both; transform-origin: left; }
        .nata-tagline { animation: nataTaglineIn 0.5s ease 0.85s both; }
        .nata-pillar { animation: nataPillarIn 0.4s ease both; }
        .nata-float { animation: nataDotsFloat 2.5s ease-in-out infinite; }
      `}</style>

      {/* Dot grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#D9CFB6 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
        }}
      />

      {/* Floating decorative dots */}
      {[
        { size: 80, top: '10%', left: '8%', color: '#E8A33D', animDelay: '0s' },
        { size: 50, top: '75%', left: '12%', color: '#2F6F5E', animDelay: '0.4s' },
        { size: 100, top: '15%', right: '10%', color: '#1F2A44', animDelay: '0.8s' },
        { size: 60, top: '70%', right: '8%', color: '#E8A33D', animDelay: '0.2s' },
        { size: 35, top: '45%', left: '4%', color: '#D9CFB6', animDelay: '0.6s' },
      ].map((dot, i) => (
        <div
          key={i}
          className="nata-float"
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            background: dot.color,
            opacity: 0.12,
            animationDelay: dot.animDelay,
          }}
        />
      ))}

      {/* Main content */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* NATA letters */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
          {NATA_LETTERS.map((letter, i) => (
            <span
              key={i}
              className="nata-letter"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(72px, 16vw, 108px)',
                fontWeight: 900,
                color: '#091540',
                lineHeight: 1,
                animationDelay: `${i * 0.1}s`,
                letterSpacing: '-2px',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Highlight underline bar */}
        <div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
        >
          <div
            className="nata-line-grow"
            style={{
              height: '5px',
              width: '80%',
              background: 'linear-gradient(90deg, #4EA5D9 0%, #8B5CF6 50%, #091540 100%)',
              borderRadius: '999px',
            }}
          />
        </div>

        {/* Tagline */}
        <p
          className="nata-tagline"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(13px, 3vw, 16px)',
            color: '#5B6472',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          {TAGLINE}
        </p>

        {/* Three pillars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {PILLARS.map(({ label, color, delay }) => (
            <div
              key={label}
              className="nata-pillar"
              style={{
                animationDelay: `${delay}s`,
                background: color,
                color: '#F1ECDE',
                borderRadius: '999px',
                padding: '6px 18px',
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#1F2A44',
                animation: `nataDotPulse 1.2s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
