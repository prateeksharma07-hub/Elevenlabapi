import React from 'react';
import { useScrollStore } from '../scroll/scrollStore';
import { scrollToProgress } from '../scroll/lenis';
import { useStudio } from '../state/studioState';
import { Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';

export const Nav: React.FC = () => {
  const activeSection = useScrollStore((s) => s.activeSection);
  const { soundMuted, toggleSoundMuted } = useStudio();

  const sections = [
    { num: 1, label: 'INTRO', p: 0.0, grad: 'linear-gradient(135deg, #00F5FF, #3B82F6)', glow: 'rgba(0, 245, 255, 0.5)' },
    { num: 2, label: 'STUDIO', p: 0.22, grad: 'linear-gradient(135deg, #A855F7, #EC4899)', glow: 'rgba(168, 85, 247, 0.5)' },
    { num: 3, label: 'AUDIO', p: 0.48, grad: 'linear-gradient(135deg, #00FF88, #00F5FF)', glow: 'rgba(0, 255, 136, 0.5)' },
    { num: 4, label: 'TRANSLATE', p: 0.70, grad: 'linear-gradient(135deg, #FF5E3A, #FF007A)', glow: 'rgba(255, 0, 122, 0.5)' },
    { num: 5, label: 'END', p: 0.92, grad: 'linear-gradient(135deg, #FFB800, #FF5E3A)', glow: 'rgba(255, 184, 0, 0.5)' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        pointerEvents: 'none',
      }}
    >
      {/* Brand Logo with Iridescent Aura */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={() => scrollToProgress(0)}
      >
        <span
          className="font-mono-large"
          style={{
            fontWeight: 900,
            color: '#FFFFFF',
            background: 'linear-gradient(135deg, #FF007A 0%, #A855F7 50%, #00F5FF 100%)',
            backgroundSize: '200% 200%',
            animation: 'rainbowBorder 5s ease infinite',
            padding: '6px 14px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
            letterSpacing: '0.08em',
          }}
        >
          AURA ONE
        </span>
        <span
          className="font-mono"
          style={{
            color: 'var(--c-bone)',
            opacity: 0.85,
            fontSize: '11px',
            letterSpacing: '0.1em',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        >
          NEURAL // 047
        </span>
      </div>

      {/* Five-Section Frosted Floating Pill Navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(13, 16, 27, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          padding: '6px 10px',
          borderRadius: 'var(--r-pill)',
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 245, 255, 0.1)',
        }}
      >
        {sections.map((sec) => {
          const isActive = activeSection === sec.num;
          return (
            <button
              key={sec.num}
              type="button"
              className="font-btn"
              onClick={() => scrollToProgress(sec.p)}
              style={{
                background: isActive ? sec.grad : 'transparent',
                color: isActive ? '#FFFFFF' : 'rgba(235, 240, 255, 0.75)',
                border: 'none',
                padding: '7px 16px',
                borderRadius: 'var(--r-pill)',
                cursor: 'pointer',
                fontWeight: isActive ? 800 : 600,
                fontSize: '11px',
                letterSpacing: '0.04em',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? `0 0 20px ${sec.glow}` : 'none',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
              }}
              data-cursor="press"
            >
              0{sec.num} {sec.label}
            </button>
          );
        })}
      </nav>

      {/* Controls & Sound Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
        }}
      >
        {/* Backend API status */}
        <div
          className="font-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(13, 16, 27, 0.8)',
            backdropFilter: 'blur(16px)',
            color: 'var(--c-emerald)',
            padding: '7px 14px',
            borderRadius: 'var(--r-pill)',
            fontSize: '10px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.15)',
          }}
          title="ElevenLabs API Key secured on backend proxy"
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#00FF88',
              boxShadow: '0 0 8px #00FF88',
              animation: 'spin 3s ease infinite',
            }}
          />
          <ShieldCheck size={13} color="#00FF88" />
          <span style={{ fontWeight: 700 }}>PROXY SECURE</span>
        </div>

        {/* Sound Toggle (with dynamic color glow) */}
        <button
          type="button"
          onClick={toggleSoundMuted}
          className="font-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: soundMuted ? 'rgba(26, 32, 50, 0.8)' : 'linear-gradient(135deg, #00F5FF, #A855F7)',
            color: soundMuted ? 'var(--c-smoke)' : '#FFFFFF',
            border: soundMuted ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.3)',
            padding: '7px 16px',
            borderRadius: 'var(--r-pill)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            boxShadow: soundMuted ? 'none' : '0 0 20px rgba(0, 245, 255, 0.4)',
            transition: 'all 0.25s ease',
          }}
          data-cursor="press"
        >
          {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{soundMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
        </button>
      </div>
    </header>
  );
};
