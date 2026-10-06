import React from 'react';
import { Magnetic } from '../ui/Magnetic';
import { scrollToProgress } from '../scroll/lenis';
import { useStudio } from '../state/studioState';
import { useScrollStore } from '../scroll/scrollStore';
import { useLevels } from '../audio/useLevels';
import { ArrowDown, Sparkles, Volume2, Radio } from 'lucide-react';

export const S01Intro: React.FC = () => {
  const { speakHeroGreeting, isGenerating, isPlaying, status } = useStudio();
  const progress = useScrollStore((s) => s.progress);
  const levels = useLevels(isPlaying);

  // Opacity fade as scroll advances towards S2 (0.0 to 0.14)
  const opacity = progress > 0.12 ? Math.max(0, 1 - (progress - 0.12) / 0.06) : 1;
  const isPointerEvents = opacity > 0.2;

  // Audio peak dynamic bounce
  const pulseFactor = isPlaying ? 1 + levels.peak * 0.3 : 1;

  return (
    <section
      id="scene-01"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1, // S1 text layer sits directly above FluidBackground (z: 0) and behind Canvas (z: 2)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(80px, 11vw, 130px) clamp(24px, 6vw, 80px) 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        left: 0,
        right: 0,
        opacity,
        pointerEvents: isPointerEvents ? 'auto' : 'none',
        transition: 'opacity 0.2s ease',
        userSelect: 'none',
      }}
    >
      {/* Top Bar / Meta info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="font-mono"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(0, 245, 255, 0.4)',
                color: 'var(--c-cyan)',
                padding: '4px 12px',
                borderRadius: 'var(--r-pill)',
                fontSize: '11px',
                fontWeight: 700,
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Radio size={12} className="spin" />
              <span>AURA INSTRUMENT // 047</span>
            </span>
          </div>
          <span
            className="font-mono"
            style={{
              color: 'var(--c-smoke)',
              fontSize: '11px',
              letterSpacing: '0.08em',
            }}
          >
            PHYSICAL NEURAL ACOUSTIC SYNTHESIS
          </span>
        </div>

        {/* Circular Holographic Badge: 29 LANGUAGES / 10 VOICES */}
        <div
          style={{
            position: 'relative',
            width: '116px',
            height: '116px',
            borderRadius: '50%',
            background: 'rgba(13, 16, 27, 0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transform: `rotate(-6deg) scale(${pulseFactor})`,
            transition: 'transform 0.15s ease-out',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 255, 0.35)',
            border: '2px solid rgba(0, 245, 255, 0.5)',
          }}
          data-cursor="press"
          onClick={speakHeroGreeting}
        >
          {/* Animated Rainbow Conic Rim */}
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #00F5FF, #A855F7, #FF007A, #FFB800, #00FF88, #00F5FF)',
              zIndex: -1,
              animation: 'spin 12s linear infinite',
              opacity: 0.8,
              filter: 'blur(4px)',
            }}
          />

          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              animation: 'spin 22s linear infinite',
            }}
          >
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text fill="#FFFFFF" fontSize="8" letterSpacing="0.16em" fontWeight="700">
              <textPath href="#circlePath">
                29 LANGUAGES • 10 VOICES • ELEVENLABS •
              </textPath>
            </text>
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #00F5FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            PLAY
            <br />
            HERO
          </div>
        </div>
      </div>

      {/* Main Massive Headline Behind Canvas */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          marginTop: 'auto',
          marginBottom: 'auto',
          padding: '24px 0',
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(52px, 9.5vw, 126px)',
            color: '#FFFFFF',
            textTransform: 'none',
            margin: 0,
            textShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}
        >
          Give words a{' '}
          <span
            className="font-serif-italic text-fluid-gradient"
            style={{
              display: 'inline-block',
              transition: 'transform 0.15s ease',
              filter: 'drop-shadow(0 0 25px rgba(0, 245, 255, 0.45))',
            }}
          >
            voice.
          </span>
        </h1>

        <p
          className="font-body"
          style={{
            color: 'rgba(235, 240, 255, 0.85)',
            marginTop: '24px',
            maxWidth: '44ch',
            margin: '24px auto 0',
            fontWeight: 500,
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
          }}
        >
          A physical voice instrument sculpted from tactile matte plastic and driven by neural acoustic synthesis.
        </p>
      </div>

      {/* Bottom Controls / CTAs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        {/* Play Hero Button Prompt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={speakHeroGreeting}
            className="font-btn glass-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 26px',
              borderRadius: 'var(--r-pill)',
              cursor: 'pointer',
              color: 'var(--c-cyan)',
              border: '1.5px solid rgba(0, 245, 255, 0.4)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 255, 0.25)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.06em',
            }}
            data-cursor="press"
          >
            <Volume2 size={16} color="var(--c-cyan)" />
            <span>{isGenerating ? 'SYNTHESIZING...' : isPlaying ? 'PLAYING AURA...' : 'PRESS HERO TO SPEAK'}</span>
          </button>
          <span
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'var(--c-smoke)',
              background: 'rgba(13, 16, 27, 0.6)',
              padding: '6px 12px',
              borderRadius: 'var(--r-sm)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {status}
          </span>
        </div>

        {/* Magnetic CTA to Open Studio - Glowing Fluid Gradient */}
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
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
            data-cursor="press"
          >
            <span>OPEN THE STUDIO</span>
            <ArrowDown size={18} />
          </button>
        </Magnetic>
      </div>
    </section>
  );
};
