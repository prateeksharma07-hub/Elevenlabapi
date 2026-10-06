import React, { useState } from 'react';
import { useScrollStore } from '../scroll/scrollStore';
import { scrollToProgress } from '../scroll/lenis';
import { useStudio } from '../state/studioState';
import { Marquee } from '../ui/Marquee';
import { Magnetic } from '../ui/Magnetic';
import { ArrowUp, Volume2, Sparkles, ShieldCheck } from 'lucide-react';

export const S05Finale: React.FC = () => {
  const progress = useScrollStore((s) => s.progress);
  const { speakHeroGreeting, isGenerating, isPlaying } = useStudio();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Active in 82% - 100% scroll range
  const opacity = progress > 0.80 ? Math.min(1, (progress - 0.80) / 0.08) : 0;
  const isInteractive = opacity > 0.4;

  const handleHearTagline = () => {
    setHasInteracted(true);
    speakHeroGreeting();
  };

  return (
    <section
      id="scene-05"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(80px, 8vw, 120px) 0 clamp(32px, 4vw, 48px)',
        opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
        userSelect: 'none',
      }}
    >
      {/* Top Banner Tag */}
      <div
        style={{
          padding: '0 clamp(24px, 5vw, 64px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            className="font-mono"
            style={{
              background: 'linear-gradient(135deg, #FFB800, #FF007A)',
              color: '#FFFFFF',
              padding: '5px 14px',
              borderRadius: 'var(--r-sm)',
              fontWeight: 900,
              fontSize: '11px',
              letterSpacing: '0.06em',
              boxShadow: '0 0 16px rgba(255, 184, 0, 0.4)',
            }}
          >
            AURA // FINALE
          </span>
          <span className="font-mono" style={{ color: 'var(--c-smoke)', fontSize: '11px' }}>
            PHYSICAL ACOUSTIC CODA
          </span>
        </div>

        {/* Tap to Hear Prompt */}
        <button
          type="button"
          onClick={handleHearTagline}
          className="font-btn glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid rgba(0, 245, 255, 0.35)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.25)',
          }}
          data-cursor="press"
        >
          <Volume2 size={14} color="#00F5FF" />
          <span>{isPlaying ? 'PLAYING CODA...' : isGenerating ? 'SYNTHESIZING...' : 'TAP TO HEAR CODA'}</span>
        </button>
      </div>

      {/* Center Giant Scroll-Driven Marquee */}
      <div style={{ margin: 'auto 0', width: '100%' }}>
        <Marquee text="WORDS ARE ONLY THE BEGINNING — WORDS ARE ONLY THE BEGINNING — " speed={1.2} />
      </div>

      {/* Bottom Action Area */}
      <div
        style={{
          padding: '0 clamp(24px, 5vw, 64px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {/* Editorial Coda Description */}
        <div style={{ maxWidth: '42ch' }}>
          <p
            className="font-body"
            style={{
              color: 'rgba(235, 240, 255, 0.95)',
              fontSize: '18px',
              lineHeight: 1.5,
              fontWeight: 500,
              margin: 0,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            A physical voice instrument for creators, sound designers, and polyglot storytellers.
          </p>
          <div
            className="font-mono"
            style={{
              marginTop: '14px',
              fontSize: '11px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: '#00F5FF', background: 'rgba(0, 245, 255, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 245, 255, 0.3)' }}>
              ELEVENLABS API
            </span>
            <span style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              29 LANGUAGES
            </span>
            <span style={{ color: '#00FF88', background: 'rgba(0, 255, 136, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
              PROPRIETARY ABS
            </span>
          </div>
        </div>

        {/* Return to Studio CTA Button */}
        <Magnetic strength={0.4}>
          <button
            type="button"
            onClick={() => scrollToProgress(0.22)}
            className="font-btn btn-fluid-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 36px',
              borderRadius: 'var(--r-pill)',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
            data-cursor="press"
          >
            <span>CREATE A VOICE</span>
            <ArrowUp size={18} />
          </button>
        </Magnetic>
      </div>
    </section>
  );
};
