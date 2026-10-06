import React from 'react';
import { useScrollStore } from '../scroll/scrollStore';
import { useStudio } from '../state/studioState';
import { useLevels } from '../audio/useLevels';
import { Activity, Play, Volume2, Radio } from 'lucide-react';

export const S03Audio: React.FC = () => {
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
        padding: 'clamp(56px, 7vw, 100px) clamp(14px, 4vw, 64px) clamp(20px, 3vw, 48px)',
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
          gap: '20px',
        }}
      >
        <div>
          <span
            className="font-mono"
            style={{
              background: 'linear-gradient(135deg, #00FF88, #00F5FF)',
              color: '#07080E',
              padding: '5px 14px',
              borderRadius: 'var(--r-sm)',
              fontWeight: 900,
              fontSize: '11px',
              letterSpacing: '0.06em',
              boxShadow: '0 0 16px rgba(0, 255, 136, 0.4)',
            }}
          >
            SCENE 03 // DISASSEMBLY
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              color: '#FFFFFF',
              marginTop: '12px',
              marginBottom: '6px',
              textShadow: '0 10px 30px rgba(0,0,0,0.6)',
            }}
          >
            Exploded acoustic{' '}
            <span
              className="font-serif-italic text-fluid-gradient"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.4))' }}
            >
              resonance.
            </span>
          </h2>
          <p className="font-body" style={{ color: 'rgba(235, 240, 255, 0.8)', maxWidth: '40ch', fontSize: '15px' }}>
            A decoupled 5-part architecture modulated in real time by 512-point Fast Fourier Transform telemetry.
          </p>
        </div>

        {/* Real FFT Telemetry Meter Box - Frosted Cyber Glass */}
        <div
          style={{
            background: 'rgba(13, 16, 28, 0.85)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 'var(--r-screen)',
            padding: '18px 24px',
            minWidth: 'min(280px, 100%)',
            maxWidth: '340px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0, 255, 136, 0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={15} color="#00FF88" />
              <span className="font-mono" style={{ fontSize: '11px', color: '#00FF88', fontWeight: 800 }}>
                FFT 512 TELEMETRY
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: '10px', color: 'var(--c-smoke)' }}>
              44.1 kHz // 86Hz/BIN
            </span>
          </div>

          {/* 4 Multi-Color Telemetry Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Sub-Bass (Coral/Magenta) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(235, 240, 255, 0.8)' }}>SUB-BASS (0-2)</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#FF5E3A', fontWeight: 700 }}>{(levels.subBass * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.subBass * 100}%`, height: '100%', background: 'linear-gradient(90deg, #FF5E3A, #FF007A)', boxShadow: '0 0 10px #FF5E3A', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Mid (Cyan/Violet) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(235, 240, 255, 0.8)' }}>MID (3-23)</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#00F5FF', fontWeight: 700 }}>{(levels.mid * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.mid * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00F5FF, #A855F7)', boxShadow: '0 0 10px #00F5FF', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Treble (Emerald/Lime) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(235, 240, 255, 0.8)' }}>TREBLE (24-93)</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#00FF88', fontWeight: 700 }}>{(levels.treble * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.treble * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00FF88, #D4FF3A)', boxShadow: '0 0 10px #00FF88', transition: 'width 0.08s ease' }} />
              </div>
            </div>

            {/* Peak RMS (Prismatic Rainbow) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(235, 240, 255, 0.8)' }}>PEAK RMS</span>
                <span className="font-mono" style={{ fontSize: '10px', color: '#FFB800', fontWeight: 700 }}>{(levels.peak * 100).toFixed(0)}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${levels.peak * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00F5FF, #A855F7, #FF007A, #FFB800)', boxShadow: '0 0 10px #FFB800', transition: 'width 0.08s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Distinct Multi-Colored Callouts overlaying the 3D model */}
      <div
        className="hide-on-mobile"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: 'clamp(70px, 10vw, 120px) clamp(10px, 3vw, 80px)',
        }}
      >
        {/* Callout 1: Top-Left (Resonance Casing - Coral) */}
        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5E3A', boxShadow: '0 0 15px #FF5E3A', flexShrink: 0 }} />
          <div className="hide-on-mobile" style={{ width: 'clamp(30px, 5vw, 70px)', height: '1.5px', background: 'linear-gradient(90deg, #FF5E3A, rgba(255, 94, 58, 0.2))' }} />
          <div
            className="font-mono"
            style={{
              fontSize: 'clamp(9.5px, 1.1vw, 11px)',
              color: '#FF5E3A',
              background: 'rgba(13, 16, 28, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '5px clamp(8px, 1.2vw, 14px)',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(255, 94, 58, 0.4)',
              boxShadow: '0 0 15px rgba(255, 94, 58, 0.25)',
              fontWeight: 700,
            }}
          >
            [01] CASING // 0.28R MATTE ABS
          </div>
        </div>

        {/* Callout 2: Top-Right (Dot Matrix Screen - Cyan) */}
        <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: 'clamp(9.5px, 1.1vw, 11px)',
              color: '#00F5FF',
              background: 'rgba(13, 16, 28, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '5px clamp(8px, 1.2vw, 14px)',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(0, 245, 255, 0.4)',
              boxShadow: '0 0 15px rgba(0, 245, 255, 0.25)',
              fontWeight: 700,
            }}
          >
            [02] SCREEN // 60-COL DYNAMIC MATRIX
          </div>
          <div className="hide-on-mobile" style={{ width: 'clamp(30px, 5vw, 70px)', height: '1.5px', background: 'linear-gradient(90deg, rgba(0, 245, 255, 0.2), #00F5FF)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 15px #00F5FF', flexShrink: 0 }} />
        </div>

        {/* Callout 3: Center-Left (Acoustic Grille - Violet) */}
        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 15px #A855F7', flexShrink: 0 }} />
          <div className="hide-on-mobile" style={{ width: 'clamp(30px, 5vw, 80px)', height: '1.5px', background: 'linear-gradient(90deg, #A855F7, rgba(168, 85, 247, 0.2))' }} />
          <div
            className="font-mono"
            style={{
              fontSize: 'clamp(9.5px, 1.1vw, 11px)',
              color: '#A855F7',
              background: 'rgba(13, 16, 28, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '5px clamp(8px, 1.2vw, 14px)',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.25)',
              fontWeight: 700,
            }}
          >
            [03] GRILLE // 168 TREBLE APERTURES
          </div>
        </div>

        {/* Callout 4: Bottom-Right (Potentiometers - Emerald) */}
        <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: 'clamp(9.5px, 1.1vw, 11px)',
              color: '#00FF88',
              background: 'rgba(13, 16, 28, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '5px clamp(8px, 1.2vw, 14px)',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.25)',
              fontWeight: 700,
            }}
          >
            [04] POTENTIOMETERS // 3-AXIS DETENT
          </div>
          <div className="hide-on-mobile" style={{ width: 'clamp(30px, 5vw, 80px)', height: '1.5px', background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.2), #00FF88)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF88', boxShadow: '0 0 15px #00FF88', flexShrink: 0 }} />
        </div>
      </div>

      {/* Bottom Bar: Action & Status */}
      <div
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
    </section>
  );
};
