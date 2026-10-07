import React, { useState } from 'react';
import { useStudio } from '../state/studioState';
import { LANGUAGES_29 } from '../services/translation';
import { ArrowLeftRight, Send, Check, Copy, Sparkles, ArrowRight } from 'lucide-react';

export const MobileTranslate: React.FC = () => {
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

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = transTarget || transSource;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const temp = transSourceLang;
    setTransSourceLang(transTargetLang);
    setTransTargetLang(temp);
  };

  return (
    <div
      className="mobile-translate-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '16px 18px',
        backgroundColor: '#121212',
        color: '#F1EEE6',
        borderRadius: '24px',
        border: '1px solid rgba(241, 238, 230, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        maxHeight: 'calc(100dvh - 80px)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header: TRANSLATE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(241, 238, 230, 0.08)',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: '#F1EEE6',
            textTransform: 'uppercase',
          }}
        >
          TRANSLATE
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6F6A60',
            letterSpacing: '0.06em',
          }}
        >
          29 LANGUAGES
        </span>
      </div>

      {/* 2. [ FROM ] [ SWAP ] [ TO ] Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* FROM Selector */}
        <div style={{ flex: 1 }}>
          <label
            htmlFor="mobile-source-lang"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              color: '#6F6A60',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            FROM
          </label>
          <select
            id="mobile-source-lang"
            value={transSourceLang}
            onChange={(e) => setTransSourceLang(e.target.value)}
            style={{
              width: '100%',
              minHeight: '44px',
              backgroundColor: '#181818',
              color: '#F1EEE6',
              border: '1.5px solid rgba(241, 238, 230, 0.16)',
              borderRadius: '12px',
              padding: '0 10px',
              fontSize: '13px',
              fontFamily: "'DM Mono', monospace",
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {LANGUAGES_29.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ backgroundColor: '#181818', color: '#F1EEE6' }}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* SWAP Button */}
        <button
          type="button"
          onClick={handleSwap}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#181818',
            color: '#F1EEE6',
            border: '1.5px solid rgba(241, 238, 230, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '16px',
            flexShrink: 0,
          }}
          aria-label="Swap languages"
          title="Swap languages"
        >
          <ArrowLeftRight size={15} />
        </button>

        {/* TO Selector */}
        <div style={{ flex: 1 }}>
          <label
            htmlFor="mobile-target-lang"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              color: '#6F6A60',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            TO
          </label>
          <select
            id="mobile-target-lang"
            value={transTargetLang}
            onChange={(e) => setTransTargetLang(e.target.value)}
            style={{
              width: '100%',
              minHeight: '44px',
              backgroundColor: '#181818',
              color: '#F1EEE6',
              border: '1.5px solid rgba(241, 238, 230, 0.16)',
              borderRadius: '12px',
              padding: '0 10px',
              fontSize: '13px',
              fontFamily: "'DM Mono', monospace",
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {LANGUAGES_29.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ backgroundColor: '#181818', color: '#F1EEE6' }}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Original Text block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#6F6A60' }}>
            ORIGINAL TEXT
          </span>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating || !transSource.trim()}
            style={{
              background: 'transparent',
              color: '#D4FF3A',
              border: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              cursor: isTranslating ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
            }}
          >
            <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
            <ArrowRight size={12} />
          </button>
        </div>
        <textarea
          value={transSource}
          onChange={(e) => setTransSource(e.target.value)}
          placeholder="Enter text to translate..."
          rows={3}
          style={{
            width: '100%',
            minHeight: '90px',
            backgroundColor: '#181818',
            color: '#F1EEE6',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '15px',
            lineHeight: '1.5',
            padding: '12px 14px',
            borderRadius: '14px',
            border: '1.5px solid rgba(241, 238, 230, 0.14)',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#D4FF3A';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(241, 238, 230, 0.14)';
          }}
        />
      </div>

      {/* 4. Translated Text block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#6F6A60' }}>
            TRANSLATED TEXT
          </span>
          {transTarget && (
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: 'transparent',
                color: '#6F6A60',
                border: 'none',
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {copied ? <Check size={12} color="#D4FF3A" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
        <div
          style={{
            width: '100%',
            minHeight: '90px',
            backgroundColor: '#181818',
            color: '#F1EEE6',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '15px',
            lineHeight: '1.5',
            padding: '12px 14px',
            borderRadius: '14px',
            border: '1.5px solid rgba(241, 238, 230, 0.14)',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {isTranslating ? (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#D4FF3A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} className="spin" />
              <span>Translating neural speech...</span>
            </span>
          ) : transTarget ? (
            transTarget
          ) : (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#6F6A60' }}>
              Translated words will appear here...
            </span>
          )}
        </div>
      </div>

      {/* 5. Single Dominant CTA: Send to Studio */}
      <div style={{ marginTop: '4px' }}>
        <button
          type="button"
          onClick={sendToStudio}
          style={{
            width: '100%',
            minHeight: '48px',
            borderRadius: '999px',
            backgroundColor: '#D4FF3A',
            color: '#121212',
            border: 'none',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Send size={15} color="#121212" />
          <span>SEND TO STUDIO</span>
        </button>
      </div>
    </div>
  );
};
