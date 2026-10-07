import React, { useEffect, useRef } from 'react';
import { useStudio } from '../state/studioState';
import { useScrollStore } from '../scroll/scrollStore';
import { VOICES, MODELS, DEMO_SCRIPTS } from '../services/elevenlabs';
import { Knob2D } from '../ui/Knob2D';
import { DotMatrix } from '../ui/DotMatrix';
import { Play, Pause, Square, Download, Sparkles, Sliders, Volume2, Mic, RefreshCw, Cpu, Zap } from 'lucide-react';
import { useIsMobile } from '../state/useIsMobile';
import { MobileStudio } from './MobileStudio';

// Persona color themes for vibrant multi-color identity
const PERSONA_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  'pNInz6obpgDQGcFmaJgB': { bg: 'rgba(0, 245, 255, 0.15)', border: '#00F5FF', glow: 'rgba(0, 245, 255, 0.4)', text: '#00F5FF' }, // Adam (Cyan)
  'IKne3meq5aSn9XLyUdCD': { bg: 'rgba(168, 85, 247, 0.15)', border: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', text: '#A855F7' }, // Charlie (Violet)
  'EXAVITQu4vr4xnSDxMaL': { bg: 'rgba(255, 184, 0, 0.15)', border: '#FFB800', glow: 'rgba(255, 184, 0, 0.4)', text: '#FFB800' }, // Sarah (Amber)
  'JBFqnCBsd6RMkjVDRZzb': { bg: 'rgba(0, 255, 136, 0.15)', border: '#00FF88', glow: 'rgba(0, 255, 136, 0.4)', text: '#00FF88' }, // George (Emerald)
  'Xb7hH8MSUJpSbSDYk0k2': { bg: 'rgba(14, 165, 233, 0.15)', border: '#0EA5E9', glow: 'rgba(14, 165, 233, 0.4)', text: '#0EA5E9' }, // Alice (Azure)
  'nPczCjzI2devNBz1zQrb': { bg: 'rgba(255, 94, 58, 0.15)', border: '#FF5E3A', glow: 'rgba(255, 94, 58, 0.4)', text: '#FF5E3A' }, // Brian (Coral)
  'onwK4e9ZLuTAKqWW03F9': { bg: 'rgba(212, 255, 58, 0.15)', border: '#D4FF3A', glow: 'rgba(212, 255, 58, 0.4)', text: '#D4FF3A' }, // Daniel (Lime)
  'pFZP5JQG7iQjIQuC4Bku': { bg: 'rgba(255, 0, 122, 0.15)', border: '#FF007A', glow: 'rgba(255, 0, 122, 0.4)', text: '#FF007A' }, // Lily (Pink)
  'SAz9YHcvj6GT2YYXdXww': { bg: 'rgba(121, 40, 202, 0.15)', border: '#7928CA', glow: 'rgba(121, 40, 202, 0.4)', text: '#A855F7' }, // River (Purple)
  'N2lVS1w4EtoT3dr4eOWO': { bg: 'rgba(255, 200, 55, 0.15)', border: '#FFC837', glow: 'rgba(255, 200, 55, 0.4)', text: '#FFC837' }, // Callum (Gold)
};

export const S02Studio: React.FC = () => {
  const {
    text,
    setText,
    voiceId,
    setVoiceId,
    modelId,
    setModelId,
    stability,
    setStability,
    similarity,
    setSimilarity,
    style,
    setStyle,
    status,
    isGenerating,
    handleGenerate,
    loadDemoScript,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlayPause,
    stopAudio,
    seekAudio,
    downloadAudio,
    audioUrl,
    cyclePersona,
  } = useStudio();

  const progress = useScrollStore((s) => s.progress);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Match-cut crossfade visibility:
  let opacity = 0;
  if (progress >= 0.16 && progress <= 0.44) {
    if (progress < 0.20) {
      opacity = (progress - 0.16) / 0.04;
    } else if (progress <= 0.38) {
      opacity = 1;
    } else {
      opacity = Math.max(0, 1 - (progress - 0.38) / 0.06);
    }
  }

  const isInteractive = opacity > 0.4;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInteractive) return;

      const activeEl = document.activeElement;
      const isTyping = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;

      // Ctrl + Enter: Generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
        return;
      }

      // Outside typing context shortcuts
      if (!isTyping) {
        if (e.code === 'Space') {
          e.preventDefault();
          togglePlayPause();
        } else if (e.key === '[') {
          e.preventDefault();
          cyclePersona(-1);
        } else if (e.key === ']') {
          e.preventDefault();
          cyclePersona(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive, handleGenerate, togglePlayPause, cyclePersona]);

  // Format MM:SS helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status badge color mapping
  const getStatusBadge = () => {
    switch (status) {
      case 'SYNTHESIZING NEURAL AUDIO':
        return { bg: 'rgba(255, 0, 122, 0.2)', color: '#FF007A', border: '#FF007A', glow: 'rgba(255, 0, 122, 0.4)' };
      case 'PLAYING ACOUSTIC STREAM':
        return { bg: 'rgba(0, 245, 255, 0.2)', color: '#00F5FF', border: '#00F5FF', glow: 'rgba(0, 245, 255, 0.4)' };
      case 'TAKE A BREATH':
        return { bg: 'rgba(255, 94, 58, 0.2)', color: '#FF5E3A', border: '#FF5E3A', glow: 'rgba(255, 94, 58, 0.4)' };
      case 'CONNECTION LOST':
        return { bg: 'rgba(100, 100, 100, 0.2)', color: '#8892B0', border: '#8892B0', glow: 'none' };
      default:
        return { bg: 'rgba(0, 255, 136, 0.15)', color: '#00FF88', border: '#00FF88', glow: 'rgba(0, 255, 136, 0.3)' };
    }
  };

  const isMobile = useIsMobile();
  const statusBadge = getStatusBadge();
  const currentPersona = VOICES.find((v) => v.id === voiceId) || VOICES[0];
  const activeColor = PERSONA_COLORS[voiceId] || { bg: 'rgba(0, 245, 255, 0.15)', border: '#00F5FF', glow: 'rgba(0, 245, 255, 0.4)', text: '#00F5FF' };

  if (isMobile) {
    return (
      <section
        id="scene-02"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(52px, 8vh, 68px) 16px 16px',
          opacity,
          pointerEvents: isInteractive ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          boxSizing: 'border-box',
        }}
      >
        <MobileStudio />
      </section>
    );
  }

  return (
    <section
      id="scene-02"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(52px, 6vw, 84px) clamp(10px, 2.5vw, 48px) clamp(12px, 2vw, 32px)',
        opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Studio Workspace Container - Futuristic Frosted Glass Cyber-Console */}
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          background: 'rgba(13, 16, 28, 0.85)',
          backdropFilter: 'blur(36px) saturate(190%)',
          WebkitBackdropFilter: 'blur(36px) saturate(190%)',
          color: 'var(--c-bone)',
          borderRadius: 'var(--r-panel)',
          border: '1.5px solid rgba(0, 245, 255, 0.25)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7), 0 0 45px rgba(168, 85, 247, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          padding: 'clamp(14px, 2.5vw, 32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(12px, 2vw, 20px)',
          maxHeight: 'calc(100dvh - 74px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
        }}
      >
        {/* Top Iridescent Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '32px',
            right: '32px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #00F5FF, #A855F7, #FF007A, #00FF88, transparent)',
            borderRadius: '99px',
          }}
        />

        {/* Studio Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              className="font-mono"
              style={{
                background: 'linear-gradient(135deg, #00F5FF, #3B82F6)',
                color: '#07080E',
                padding: '5px 12px',
                borderRadius: 'var(--r-sm)',
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '0.06em',
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.4)',
              }}
            >
              STUDIO 02
            </span>
            <span
              className="font-mono-large"
              style={{
                fontWeight: 800,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                textShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
              }}
            >
              ACOUSTIC SYNTHESIS CONSOLE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              className="font-mono"
              style={{
                fontSize: '11px',
                padding: '6px 14px',
                borderRadius: 'var(--r-pill)',
                background: statusBadge.bg,
                color: statusBadge.color,
                border: `1px solid ${statusBadge.border}`,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: statusBadge.glow !== 'none' ? `0 0 15px ${statusBadge.glow}` : 'none',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: statusBadge.color,
                  boxShadow: `0 0 8px ${statusBadge.color}`,
                }}
              />
              <span>{status}</span>
            </div>

            <span className="font-mono hide-on-mobile" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
              CTRL+ENTER TO GENERATE • SPACE TO PLAY
            </span>
          </div>
        </div>

        {/* Main Split Grid: Left Text Workspace | Right Voice & Acoustic Parameters */}
        <div className="studio-grid">
          {/* LEFT: Text Narration & Quick Scripts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Demo Script Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-cyan)', fontWeight: 700 }}>
                SCRIPTS:
              </span>
              {Object.keys(DEMO_SCRIPTS).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="font-btn"
                  onClick={() => loadDemoScript(key)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--r-pill)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--c-bone)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--c-cyan)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 245, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  data-cursor="press"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Narration Textarea with Cyber Glow Focus */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to narrate with neural precision..."
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(8, 11, 20, 0.88)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(14px, 1.2vw, 16px)',
                  lineHeight: '1.6',
                  padding: 'clamp(12px, 1.8vw, 18px)',
                  borderRadius: 'var(--r-screen)',
                  border: '1.5px solid rgba(0, 245, 255, 0.35)',
                  resize: 'vertical',
                  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 245, 255, 0.1)',
                  outline: 'none',
                  minHeight: 'clamp(110px, 16vh, 170px)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00F5FF';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 245, 255, 0.35)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.35)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 245, 255, 0.1)';
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  padding: '0 4px',
                }}
              >
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
                  MEASURE: <strong style={{ color: 'var(--c-cyan)' }}>{text.length}</strong> CHARS • <strong style={{ color: 'var(--c-violet)' }}>{text.trim().split(/\s+/).filter(Boolean).length}</strong> WORDS
                </span>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-emerald)' }}>
                  ELEVENLABS MULTILINGUAL v2
                </span>
              </div>
            </div>

            {/* Dynamic Dot-Matrix Visualizer Telemetry */}
            <div
              style={{
                background: 'rgba(10, 13, 24, 0.7)',
                borderRadius: 'var(--r-screen)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mic size={15} color="#00F5FF" />
                <span className="font-mono" style={{ fontSize: '11px', color: '#00F5FF', fontWeight: 700 }}>
                  ACOUSTIC SPECTRUM
                </span>
              </div>
              <DotMatrix
                cols={24}
                rows={4}
                activeCols={isPlaying ? [1, 2, 4, 5, 7, 9, 12, 15, 17, 19, 21, 22] : [0, 1, 2, 3]}
                color="#00F5FF"
                dimColor="#131726"
                size={4}
                gap={3}
              />
            </div>
          </div>

          {/* RIGHT: Voice Personas, Engine, & 3 Knobs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Personas Carousel / Selector with Multi-Color Badges */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="font-mono" style={{ color: 'var(--c-smoke)', fontSize: '11px' }}>
                  VOICE PERSONA [ / ]
                </span>
                <span
                  className="font-mono"
                  style={{
                    color: activeColor.text,
                    fontWeight: 800,
                    fontSize: '12px',
                    textShadow: `0 0 10px ${activeColor.glow}`,
                  }}
                >
                  {currentPersona.name} • {currentPersona.desc}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 'clamp(3px, 0.8vw, 6px)',
                }}
              >
                {VOICES.map((v) => {
                  const isSel = v.id === voiceId;
                  const theme = PERSONA_COLORS[v.id] || { bg: 'rgba(0, 245, 255, 0.15)', border: '#00F5FF', glow: 'rgba(0, 245, 255, 0.4)', text: '#00F5FF' };
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoiceId(v.id)}
                      className="font-btn"
                      style={{
                        padding: 'clamp(6px, 1.2vw, 9px) 2px',
                        background: isSel ? theme.bg : 'rgba(20, 24, 38, 0.6)',
                        color: isSel ? '#FFFFFF' : 'rgba(235, 240, 255, 0.7)',
                        border: isSel ? `1.5px solid ${theme.border}` : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--r-sm)',
                        cursor: 'pointer',
                        fontSize: 'clamp(9.5px, 1.1vw, 11px)',
                        fontWeight: isSel ? 800 : 600,
                        textAlign: 'center',
                        transition: 'all 0.18s ease',
                        boxShadow: isSel ? `0 0 16px ${theme.glow}` : 'none',
                        transform: isSel ? 'scale(1.03)' : 'scale(1)',
                        letterSpacing: '-0.02em',
                      }}
                      data-cursor="press"
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Neural Model Engine Selector */}
            <div>
              <span className="font-mono" style={{ color: 'var(--c-smoke)', display: 'block', marginBottom: '6px', fontSize: '11px' }}>
                NEURAL ENGINE
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(4px, 0.8vw, 6px)' }}>
                {MODELS.slice(0, 3).map((m, idx) => {
                  const isSel = m.id === modelId;
                  const accents = ['#00F5FF', '#A855F7', '#00FF88'];
                  const accent = accents[idx % 3];
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModelId(m.id)}
                      className="font-btn"
                      style={{
                        padding: 'clamp(6px, 1vw, 8px)',
                        background: isSel ? `rgba(${idx === 0 ? '0, 245, 255' : idx === 1 ? '168, 85, 247' : '0, 255, 136'}, 0.2)` : 'rgba(20, 24, 38, 0.6)',
                        color: isSel ? '#FFFFFF' : 'rgba(235, 240, 255, 0.7)',
                        border: isSel ? `1.5px solid ${accent}` : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--r-sm)',
                        cursor: 'pointer',
                        fontSize: 'clamp(9.5px, 1.1vw, 11px)',
                        fontWeight: isSel ? 800 : 500,
                        textAlign: 'center',
                        boxShadow: isSel ? `0 0 15px ${accent}44` : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      data-cursor="press"
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Physical-Style 2D Knobs with Dynamic Accent Glows */}
            <div
              style={{
                background: 'rgba(10, 13, 24, 0.75)',
                borderRadius: 'var(--r-screen)',
                padding: 'clamp(10px, 1.5vw, 16px) clamp(6px, 1.5vw, 18px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(6px, 1.2vw, 12px)',
                boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Knob2D
                label="STABILITY"
                value={stability}
                min={0}
                max={1}
                step={0.05}
                onChange={setStability}
                subLabel="PRECISION"
                accentColor="#00F5FF"
              />
              <Knob2D
                label="SIMILARITY"
                value={similarity}
                min={0}
                max={1}
                step={0.05}
                onChange={setSimilarity}
                subLabel="CLARITY"
                accentColor="#A855F7"
              />
              <Knob2D
                label="STYLE"
                value={style}
                min={0}
                max={1}
                step={0.05}
                onChange={setStyle}
                subLabel="EXAGGERATION"
                accentColor="#FF5E3A"
              />
            </div>

            {/* Big Action: Generate Button - Dynamic Fluid Gradient */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="font-btn btn-fluid-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: 'clamp(13px, 1.8vw, 18px) clamp(16px, 2vw, 24px)',
                borderRadius: 'var(--r-pill)',
                cursor: isGenerating || !text.trim() ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(12px, 1.3vw, 14px)',
                fontWeight: 800,
                letterSpacing: '0.07em',
                opacity: !text.trim() ? 0.6 : 1,
              }}
              data-cursor="press"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>SYNTHESIZING ACOUSTICS...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>GENERATE NARRATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* BOTTOM: Integrated Acoustic Player with Luminous Controls */}
        <div
          style={{
            background: 'rgba(10, 13, 24, 0.85)',
            color: 'var(--c-bone)',
            borderRadius: 'var(--r-screen)',
            padding: 'clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 1.5vw, 20px)',
            flexWrap: 'wrap',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Transport buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={togglePlayPause}
              disabled={!audioUrl}
              className="font-btn"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isPlaying ? 'linear-gradient(135deg, #FF007A, #FF5E3A)' : 'linear-gradient(135deg, #00F5FF, #00FF88)',
                color: '#07080E',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: audioUrl ? 'pointer' : 'not-allowed',
                opacity: audioUrl ? 1 : 0.4,
                boxShadow: audioUrl ? (isPlaying ? '0 0 20px rgba(255, 0, 122, 0.5)' : '0 0 20px rgba(0, 245, 255, 0.5)') : 'none',
                transition: 'all 0.2s ease',
              }}
              data-cursor="press"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              type="button"
              onClick={stopAudio}
              disabled={!audioUrl}
              className="font-btn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--c-bone)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: audioUrl ? 'pointer' : 'not-allowed',
                opacity: audioUrl ? 1 : 0.4,
              }}
              data-cursor="press"
            >
              <Square size={14} />
            </button>
          </div>

          {/* Time & Scrubber */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'clamp(140px, 30vw, 220px)' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: '#00F5FF', fontWeight: 700 }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={(e) => seekAudio(parseFloat(e.target.value))}
              disabled={!audioUrl}
              style={{
                flex: 1,
                accentColor: '#00F5FF',
                cursor: audioUrl ? 'pointer' : 'default',
              }}
            />
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={16} color="#A855F7" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '70px', accentColor: '#A855F7' }}
            />
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={downloadAudio}
            disabled={!audioUrl}
            className="font-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--r-pill)',
              background: 'rgba(0, 255, 136, 0.1)',
              color: '#00FF88',
              border: '1.5px solid rgba(0, 255, 136, 0.4)',
              cursor: audioUrl ? 'pointer' : 'not-allowed',
              opacity: audioUrl ? 1 : 0.4,
              fontSize: '11px',
              fontWeight: 700,
              boxShadow: audioUrl ? '0 0 15px rgba(0, 255, 136, 0.25)' : 'none',
              transition: 'all 0.2s ease',
            }}
            data-cursor="press"
          >
            <Download size={14} />
            <span>EXPORT MP3</span>
          </button>
        </div>
      </div>
    </section>
  );
};
