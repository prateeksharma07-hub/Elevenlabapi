import React from 'react';
import { useScrollStore } from '../scroll/scrollStore';
import { useStudio } from '../state/studioState';
import { useLevels } from '../audio/useLevels';
import { useIsMobile } from '../state/useIsMobile';
import { Activity, Play, Volume2, Radio } from 'lucide-react';

export const S03Audio: React.FC = () => {
  const isMobile = useIsMobile();
  const progress = useScrollStore((s) => s.progress);
  const { isPlaying, audioUrl, playAudio } = useStudio();
  const levels = useLevels(isPlaying);

  // Active in 38% - 60% scroll range
  let opacity = 0;
  if (progress >= 0.38 && progress <= 0.62) {
    if (progress < 0.44) {
      opacity = (progress - 0.38) / 0.06;
    } else if (progress <= 0.56) {
      opacity = 1;
    } else {
      opacity = Math.max(0, 1 - (progress - 0.56) / 0.06);
    }
  }

  const isInteractive = opacity > 0.3;

  // Fallback audio trigger for Scene 3 so it's never empty
  const handleTriggerFallback = () => {
    const audio = new Audio('/sample.mp3');
    audio.play().catch(() => {});
  };

  return (
    <section
      id="scene-03"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(50px, 5.5vh, 76px) clamp(20px, 3.5vw, 60px) clamp(16px, 2.5vh, 36px)',
        opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
        userSelect: 'none',
      }}
    >
      {/* Top Header & Telemetry */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          flexWrap: 'wrap',
          gap: '16px',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 'min(580px, 60%)' }}>
          <span
            className="font-mono hide-on-mobile"
            style={{
              background: 'linear-gradient(135deg, #00FF88, #00F5FF)',
              color: '#07080E',
              padding: '4px 12px',
              borderRadius: 'var(--r-sm)',
              fontWeight: 900,
              fontSize: '10.5px',
              letterSpacing: '0.06em',
              boxShadow: '0 0 16px rgba(0, 255, 136, 0.4)',
              display: 'inline-block',
            }}
          >
            SCENE 03 // DISASSEMBLY
          </span>
          <span
            className="font-mono show-on-mobile"
            style={{
              color: '#6F6A60',
              fontSize: '11px',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            SCENE 03 // DISASSEMBLY
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(24px, min(3.8vw, 5.2vh), 46px)',
              color: '#FFFFFF',
              marginTop: '8px',
              marginBottom: '4px',
              textShadow: '0 8px 24px rgba(0,0,0,0.6)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            Exploded acoustic{' '}
            <span
              className="font-serif-italic serif-accent"
              style={{ color: '#FF4B14' }}
            >
              resonance.
            </span>
          </h2>
          <p
            className="font-body hide-on-mobile"
            style={{
              color: 'rgba(235, 240, 255, 0.8)',
              maxWidth: '38ch',
              fontSize: 'clamp(12px, 1.1vw, 13.5px)',
              lineHeight: 1.4,
              margin: '4px 0 0',
            }}
          >
            A decoupled 5-part architecture modulated in real time by 512-point Fast Fourier Transform telemetry.
          </p>
        </div>

        {/* Real FFT Telemetry Meter Box - DESKTOP ONLY */}
        <div
          className="hide-on-mobile"
          style={{
            background: 'rgba(13, 16, 28, 0.85)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            minWidth: '220px',
            maxWidth: '280px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(0, 255, 136, 0.12)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={13} color="#00FF88" />
              <span className="font-mono" style={{ fontSize: '10px', color: '#00FF88', fontWeight: 800 }}>
                FFT 512 TELEMETRY
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: '9.5px', color: 'var(--c-smoke)' }}>
              44.1 kHz // 86Hz
            </span>
          </div>

          {/* 4 Multi-Color Telemetry Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {/* Sub-Bass (Coral/Magenta) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span className="font-mono" style={{ fontSize: '9.5px', color: 'rgba(235, 240, 255, 0.8)' }}>SUB-BASS</span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#FF5E3A', fontWeight: 700 }}>{(levels.subBass * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.subBass * 100}%`, height: '100%', background: 'linear-gradient(90deg, #FF5E3A, #FF007A)', boxShadow: '0 0 8px #FF5E3A', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Mid (Cyan/Violet) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span className="font-mono" style={{ fontSize: '9.5px', color: 'rgba(235, 240, 255, 0.8)' }}>MID</span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#00F5FF', fontWeight: 700 }}>{(levels.mid * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.mid * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00F5FF, #A855F7)', boxShadow: '0 0 8px #00F5FF', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Treble (Emerald/Lime) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span className="font-mono" style={{ fontSize: '9.5px', color: 'rgba(235, 240, 255, 0.8)' }}>TREBLE</span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#00FF88', fontWeight: 700 }}>{(levels.treble * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.treble * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00FF88, #D4FF3A)', boxShadow: '0 0 8px #00FF88', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Peak RMS (Prismatic Rainbow) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span className="font-mono" style={{ fontSize: '9.5px', color: 'rgba(235, 240, 255, 0.8)' }}>PEAK RMS</span>
                <span className="font-mono" style={{ fontSize: '9.5px', color: '#FFB800', fontWeight: 700 }}>{(levels.peak * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.peak * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00F5FF, #A855F7, #FF007A, #FFB800)', boxShadow: '0 0 8px #FFB800', transition: 'width 0.08s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Precision Blueprint Callouts Framing the 3D Exploded Capsule */}
      <div
        className="hide-on-mobile"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Callout 1: Mid-Left (Resonance Casing - Coral) */}
        <div
          style={{
            position: 'absolute',
            top: '44%',
            left: 'clamp(20px, 3.5vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FF5E3A', boxShadow: '0 0 12px #FF5E3A', flexShrink: 0 }} />
          <div style={{ width: 'clamp(20px, 3vw, 48px)', height: '1.5px', background: 'linear-gradient(90deg, #FF5E3A, rgba(255, 94, 58, 0.2))' }} />
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: '#FF5E3A',
              background: 'rgba(13, 16, 28, 0.88)',
              backdropFilter: 'blur(16px)',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(255, 94, 58, 0.4)',
              boxShadow: '0 0 14px rgba(255, 94, 58, 0.2)',
              fontWeight: 700,
            }}
          >
            [01] CASING // 0.28R MATTE ABS
          </div>
        </div>

        {/* Callout 2: Mid-Right (Dot Matrix Screen - Cyan) */}
        <div
          style={{
            position: 'absolute',
            top: '36%',
            right: 'clamp(20px, 3.5vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: '#00F5FF',
              background: 'rgba(13, 16, 28, 0.88)',
              backdropFilter: 'blur(16px)',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(0, 245, 255, 0.4)',
              boxShadow: '0 0 14px rgba(0, 245, 255, 0.2)',
              fontWeight: 700,
            }}
          >
            [02] SCREEN // 60-COL MATRIX
          </div>
          <div style={{ width: 'clamp(20px, 3vw, 48px)', height: '1.5px', background: 'linear-gradient(90deg, rgba(0, 245, 255, 0.2), #00F5FF)' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 12px #00F5FF', flexShrink: 0 }} />
        </div>

        {/* Callout 3: Lower-Left (Acoustic Grille - Violet) */}
        <div
          style={{
            position: 'absolute',
            top: '64%',
            left: 'clamp(20px, 3.5vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 12px #A855F7', flexShrink: 0 }} />
          <div style={{ width: 'clamp(20px, 3vw, 48px)', height: '1.5px', background: 'linear-gradient(90deg, #A855F7, rgba(168, 85, 247, 0.2))' }} />
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: '#A855F7',
              background: 'rgba(13, 16, 28, 0.88)',
              backdropFilter: 'blur(16px)',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.2)',
              fontWeight: 700,
            }}
          >
            [03] GRILLE // 168 TREBLE PORTS
          </div>
        </div>

        {/* Callout 4: Lower-Right (Potentiometers - Emerald) */}
        <div
          style={{
            position: 'absolute',
            top: '66%',
            right: 'clamp(20px, 3.5vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: '#00FF88',
              background: 'rgba(13, 16, 28, 0.88)',
              backdropFilter: 'blur(16px)',
              padding: '4px 10px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              boxShadow: '0 0 14px rgba(0, 255, 136, 0.2)',
              fontWeight: 700,
            }}
          >
            [04] POTENTIOMETERS // 3-AXIS
          </div>
          <div style={{ width: 'clamp(20px, 3vw, 48px)', height: '1.5px', background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.2), #00FF88)' }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00FF88', boxShadow: '0 0 12px #00FF88', flexShrink: 0 }} />
        </div>
      </div>

      {/* Bottom Bar: Action & Status */}
      {/* Footer Controls: Desktop */}
      <div
        className="hide-on-mobile"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {!isPlaying && (
            <button
              type="button"
              onClick={handleTriggerFallback}
              className="font-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #00FF88, #00F5FF)',
                color: '#07080E',
                padding: '12px 24px',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.04em',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
              }}
              data-cursor="press"
            >
              <Play size={14} />
              <span>TEST ACOUSTIC HARMONICS</span>
            </button>
          )}
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
            ORBIT YAW -110° • DECOUPLED HARMONICS
          </span>
        </div>

        <span
          className="font-mono"
          style={{
            fontSize: '12px',
            color: '#00F5FF',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
          }}
        >
          SCROLL TO TRANSLATION →
        </span>
      </div>

      {/* Footer Controls: Mobile Dedicated */}
      <div
        className="show-on-mobile"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '8px',
        }}
      >
        {!isPlaying ? (
          <button
            type="button"
            onClick={handleTriggerFallback}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D4FF3A',
              color: '#121212',
              padding: '10px 20px',
              borderRadius: '999px',
              border: 'none',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Play size={13} fill="#121212" />
            <span>TEST AUDIO</span>
          </button>
        ) : (
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              color: '#D4FF3A',
              fontWeight: 700,
            }}
          >
            ● PLAYING HARMONICS
          </span>
        )}

        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6F6A60',
            letterSpacing: '0.08em',
          }}
        >
          SCROLL ↓
        </span>
      </div>
    </section>
  );
};
