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
        padding: 'clamp(10px, 1.8vw, 18px) clamp(12px, 2.5vw, 32px)',
        pointerEvents: 'none',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Brand Logo with Iridescent Aura */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          flexShrink: 0,
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
            padding: '5px 12px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 0 16px rgba(0, 245, 255, 0.35)',
            letterSpacing: '0.06em',
            fontSize: 'clamp(12px, 1.3vw, 14px)',
          }}
        >
          AURA ONE
        </span>
        <span
          className="font-mono hide-on-mobile"
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
        className="nav-pills"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(2px, 0.5vw, 6px)',
          background: 'rgba(13, 16, 27, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          padding: '4px clamp(5px, 0.8vw, 10px)',
          borderRadius: 'var(--r-pill)',
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          flexShrink: 0,
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
                padding: '5px clamp(6px, 1vw, 16px)',
                borderRadius: 'var(--r-pill)',
                cursor: 'pointer',
                fontWeight: isActive ? 800 : 600,
                fontSize: 'clamp(9.5px, 0.9vw, 11px)',
                letterSpacing: '0.04em',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? `0 0 18px ${sec.glow}` : 'none',
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                whiteSpace: 'nowrap',
              }}
              data-cursor="press"
            >
              <span>0{sec.num}</span>
              <span className="hide-on-mobile"> {sec.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Controls & Sound Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1vw, 12px)',
          pointerEvents: 'auto',
          flexShrink: 0,
        }}
      >
        {/* Backend API status - hidden on small mobile */}
        <div
          className="font-mono hide-on-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(13, 16, 27, 0.8)',
            backdropFilter: 'blur(16px)',
            color: 'var(--c-emerald)',
            padding: '6px 12px',
            borderRadius: 'var(--r-pill)',
            fontSize: '10px',
            border: '1px solid rgba(0, 255, 136, 0.3)',
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
            }}
          />
          <ShieldCheck size={12} color="#00FF88" />
          <span style={{ fontWeight: 700 }}>SECURE</span>
        </div>

        {/* Sound Toggle (Icon-only on mobile, full label on desktop) */}
        <button
          type="button"
          onClick={toggleSoundMuted}
          className="font-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: soundMuted ? 'rgba(26, 32, 50, 0.8)' : 'linear-gradient(135deg, #00F5FF, #A855F7)',
            color: soundMuted ? 'var(--c-smoke)' : '#FFFFFF',
            border: soundMuted ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.3)',
            padding: '6px clamp(10px, 1.3vw, 16px)',
            borderRadius: 'var(--r-pill)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            boxShadow: soundMuted ? 'none' : '0 0 18px rgba(0, 245, 255, 0.35)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          data-cursor="press"
          title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span className="hide-on-mobile">{soundMuted ? 'OFF' : 'ON'}</span>
        </button>
      </div>
    </header>
  );
};
