import React, { useState, useEffect } from 'react';
import { useStudio } from '../state/studioState';
import { useScrollStore } from '../scroll/scrollStore';
import { LANGUAGES_29 } from '../services/translation';
import { ArrowRight, Copy, Check, Send, Globe, ArrowLeftRight, Sparkles, Languages } from 'lucide-react';

const POPULAR_LANGS = ['EN-US', 'ES', 'FR', 'DE', 'JA', 'HI', 'ZH', 'IT', 'AR', 'KO'];

export const S04Translate: React.FC = () => {
  const {
    transSource,
    setTransSource,
    transTarget,
    transSourceLang,
    setTransSourceLang,
    transTargetLang,
    setTransTargetLang,
    isTranslating,
    handleTranslate,
    sendToStudio,
  } = useStudio();

  const progress = useScrollStore((s) => s.progress);
  const [copied, setCopied] = useState(false);
  const [detectedLang, setDetectedLang] = useState('EN-US');

  // Detect visitor language on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      setDetectedLang(navigator.language.toUpperCase());
    }
  }, []);

  // Section visibility in 58% - 80% range (strictly ends at 0.80 so zero overlap with S05)
  let opacity = 0;
  if (progress >= 0.58 && progress <= 0.80) {
    if (progress < 0.64) {
      opacity = (progress - 0.58) / 0.06;
    } else if (progress <= 0.74) {
      opacity = 1;
    } else {
      opacity = Math.max(0, 1 - (progress - 0.74) / 0.06);
    }
  }

  const isInteractive = opacity > 0.35;

  const handleCopy = () => {
    const textToCopy = transTarget || transSource;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const tempLang = transSourceLang;
    setTransSourceLang(transTargetLang);
    setTransTargetLang(tempLang);
  };

  return (
    <section
      id="scene-04"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(52px, 6vw, 80px) clamp(10px, 3vw, 48px) clamp(16px, 3vw, 48px)',
        opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* Translation Deck Card - Frosted Glass Cyber-Deck */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          background: 'rgba(13, 16, 28, 0.86)',
          backdropFilter: 'blur(36px) saturate(190%)',
          WebkitBackdropFilter: 'blur(36px) saturate(190%)',
          color: 'var(--c-bone)',
          borderRadius: 'var(--r-panel)',
          border: '1.5px solid rgba(236, 72, 153, 0.35)',
          padding: 'clamp(14px, 2.5vw, 32px)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(236, 72, 153, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
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
            background: 'linear-gradient(90deg, transparent, #FF007A, #A855F7, #00F5FF, transparent)',
            borderRadius: '99px',
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '14px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className="font-mono"
              style={{
                background: 'linear-gradient(135deg, #FF007A, #A855F7)',
                color: '#FFFFFF',
                padding: '5px 12px',
                borderRadius: 'var(--r-sm)',
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '0.06em',
                boxShadow: '0 0 16px rgba(255, 0, 122, 0.4)',
              }}
            >
              SCENE 04 // POLYGLOT
            </span>
            <span className="font-mono-large" style={{ color: '#FFFFFF', fontWeight: 800 }}>
              29-LANGUAGE GLOBAL VOICING
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              className="font-mono"
              style={{
                fontSize: '11px',
                color: '#00F5FF',
                background: 'rgba(0, 245, 255, 0.12)',
                padding: '5px 14px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid rgba(0, 245, 255, 0.35)',
                boxShadow: '0 0 12px rgba(0, 245, 255, 0.2)',
                fontWeight: 700,
              }}
            >
              DETECTED: {detectedLang}
            </div>
            <span className="font-mono hide-on-mobile" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
              PARKED 3D AURA ONE & RING ABOVE
            </span>
          </div>
        </div>

        {/* Quick Language Chips Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="font-mono" style={{ fontSize: '11px', color: '#EC4899', fontWeight: 700 }}>
            QUICK TARGET:
          </span>
          {POPULAR_LANGS.map((code) => {
            const isSel = transTargetLang === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setTransTargetLang(code)}
                className="font-btn"
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--r-pill)',
                  background: isSel ? 'linear-gradient(135deg, #FF007A, #A855F7)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSel ? '#FFFFFF' : 'rgba(235, 240, 255, 0.75)',
                  border: isSel ? '1px solid #FF007A' : '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: isSel ? 800 : 500,
                  boxShadow: isSel ? '0 0 12px rgba(255, 0, 122, 0.4)' : 'none',
                  transition: 'all 0.18s ease',
                }}
                data-cursor="press"
              >
                {code}
              </button>
            );
          })}
        </div>

        {/* Translation Split Grid: Source Box | Target Box */}
        <div className="translate-grid">
          {/* Source Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
                SOURCE LANGUAGE
              </span>
              <select
                value={transSourceLang}
                onChange={(e) => setTransSourceLang(e.target.value)}
                style={{
                  background: 'rgba(10, 13, 24, 0.85)',
                  color: '#00F5FF',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  padding: '5px 12px',
                  borderRadius: 'var(--r-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 0 10px rgba(0, 245, 255, 0.15)',
                }}
              >
                {LANGUAGES_29.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={transSource}
              onChange={(e) => setTransSource(e.target.value)}
              placeholder="Enter text to translate..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(8, 11, 20, 0.88)',
                color: '#FFFFFF',
                padding: '14px 16px',
                borderRadius: 'var(--r-screen)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: '1.5',
                resize: 'none',
                outline: 'none',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.6)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#A855F7';
                e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(168, 85, 247, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.6)';
              }}
            />
          </div>

          {/* Swap & Translate Action Column */}
          <div className="translate-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleSwap}
              className="font-btn"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(20, 24, 40, 0.8)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#A855F7';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              data-cursor="press"
              title="Swap languages"
            >
              <ArrowLeftRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleTranslate}
              disabled={isTranslating || !transSource.trim()}
              className="font-btn"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF007A, #00F5FF)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 20px rgba(255, 0, 122, 0.5)',
                transition: 'transform 0.2s ease',
              }}
              data-cursor="press"
              title="Translate text"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Target Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--c-smoke)' }}>
                TARGET LANGUAGE
              </span>
              <select
                value={transTargetLang}
                onChange={(e) => setTransTargetLang(e.target.value)}
                style={{
                  background: 'rgba(10, 13, 24, 0.85)',
                  color: '#FF007A',
                  border: '1px solid rgba(255, 0, 122, 0.3)',
                  padding: '5px 12px',
                  borderRadius: 'var(--r-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 0 10px rgba(255, 0, 122, 0.15)',
                }}
              >
                {LANGUAGES_29.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                width: '100%',
                minHeight: '110px',
                background: 'rgba(8, 11, 20, 0.88)',
                color: '#00F5FF',
                padding: '14px 16px',
                borderRadius: 'var(--r-screen)',
                border: '1.5px solid rgba(0, 245, 255, 0.3)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: '1.5',
                overflowY: 'auto',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 245, 255, 0.1)',
              }}
            >
              {isTranslating ? (
                <span className="font-mono" style={{ color: '#FF007A', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} className="spin" />
                  <span>TRANSLATING VIA NEURAL ENGINE...</span>
                </span>
              ) : transTarget ? (
                transTarget
              ) : (
                <span className="font-mono" style={{ color: 'var(--c-smoke)', fontSize: '12px' }}>
                  Awaiting translation request...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar: Copy & Send to Studio */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '8px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={handleCopy}
            className="font-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--c-bone)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: 'clamp(8px, 1.2vw, 10px) clamp(14px, 1.8vw, 20px)',
              borderRadius: 'var(--r-pill)',
              cursor: 'pointer',
              fontSize: 'clamp(11px, 1.1vw, 12px)',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            data-cursor="press"
          >
            {copied ? <Check size={14} color="#00FF88" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY TRANSLATION'}</span>
          </button>

          {/* SEND TO STUDIO AND NARRATE */}
          <button
            type="button"
            onClick={sendToStudio}
            className="font-btn btn-fluid-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: 'clamp(12px, 1.5vw, 14px) clamp(18px, 2.5vw, 28px)',
              borderRadius: 'var(--r-pill)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 'clamp(11px, 1.2vw, 13px)',
            }}
            data-cursor="press"
          >
            <Send size={15} />
            <span>SEND TO STUDIO AND NARRATE</span>
          </button>
        </div>
      </div>
    </section>
  );
};
