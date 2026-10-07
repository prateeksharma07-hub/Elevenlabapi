import React, { useState, useRef } from 'react';
import { useStudio } from '../state/studioState';
import { VOICES, MODELS, DEMO_SCRIPTS } from '../services/elevenlabs';
import { Play, Pause, Square, Download, Volume2, VolumeX, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';

export const MobileStudio: React.FC = () => {
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
  } = useStudio();

  const [showExamples, setShowExamples] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Subordinate status indicator
  const getStatusLine = () => {
    if (isGenerating) {
      return { text: 'SYNTHESIZING', dotColor: '#D4FF3A' };
    }
    if (isPlaying) {
      return { text: 'PLAYING', dotColor: '#FF4B14' };
    }
    return { text: 'SYSTEM READY', dotColor: '#6F6A60' };
  };

  const statusLine = getStatusLine();

  // Format mm:ss helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentVoice = VOICES.find((v) => v.id === voiceId) || VOICES[0];
  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className="mobile-studio-container"
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
      {/* 1. Header: AURA STUDIO + small status line */}
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
          AURA STUDIO
        </span>

        {/* Small subordinate status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            fontWeight: 600,
            color: '#6F6A60',
            letterSpacing: '0.06em',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: statusLine.dotColor,
            }}
          />
          <span>{statusLine.text}</span>
        </div>
      </div>

      {/* 2. Compact "Try an example" button */}
      <div>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          style={{
            background: 'rgba(241, 238, 230, 0.05)',
            border: '1px solid rgba(241, 238, 230, 0.15)',
            borderRadius: '999px',
            padding: '7px 14px',
            color: '#F1EEE6',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <span>Try an example</span>
          <ChevronDown
            size={13}
            style={{
              transform: showExamples ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {/* Compact sheet/list for examples */}
        {showExamples && (
          <div
            style={{
              marginTop: '8px',
              backgroundColor: '#181818',
              border: '1px solid rgba(241, 238, 230, 0.14)',
              borderRadius: '16px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {Object.entries(DEMO_SCRIPTS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  loadDemoScript(key);
                  setShowExamples(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F1EEE6',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: '#D4FF3A',
                    }}
                  >
                    {key}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#6F6A60',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '260px',
                    }}
                  >
                    {item.text.slice(0, 48)}...
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: "'DM Mono', monospace",
                    color: '#6F6A60',
                  }}
                >
                  LOAD
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Large comfortable textarea (180–220px) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste words to give them voice..."
          rows={6}
          style={{
            width: '100%',
            minHeight: '190px',
            backgroundColor: '#181818',
            color: '#F1EEE6',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '16px', // 16px avoids iOS viewport zoom on focus
            lineHeight: '1.55',
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1.5px solid rgba(241, 238, 230, 0.16)',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#D4FF3A';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(241, 238, 230, 0.16)';
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 4px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6F6A60',
          }}
        >
          <span>{charCount} chars • {wordCount} words</span>
          <span>Eleven Multilingual v2</span>
        </div>
      </div>

      {/* 4. Full Width Voice Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="mobile-voice-select"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6F6A60',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Voice Persona
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="mobile-voice-select"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            style={{
              width: '100%',
              minHeight: '48px',
              backgroundColor: '#181818',
              color: '#F1EEE6',
              border: '1.5px solid rgba(241, 238, 230, 0.16)',
              borderRadius: '14px',
              padding: '0 40px 0 14px',
              fontSize: '14px',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 600,
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id} style={{ backgroundColor: '#181818', color: '#F1EEE6' }}>
                {v.name} — {v.desc}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#6F6A60"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 5. Full Width Model Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="mobile-model-select"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6F6A60',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Neural Model Engine
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="mobile-model-select"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            style={{
              width: '100%',
              minHeight: '48px',
              backgroundColor: '#181818',
              color: '#F1EEE6',
              border: '1.5px solid rgba(241, 238, 230, 0.16)',
              borderRadius: '14px',
              padding: '0 40px 0 14px',
              fontSize: '13px',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id} style={{ backgroundColor: '#181818', color: '#F1EEE6' }}>
                {m.name} ({m.badge})
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#6F6A60"
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 6. Advanced Settings (Collapsed by default) */}
      <div
        style={{
          border: '1px solid rgba(241, 238, 230, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#151515',
        }}
      >
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            width: '100%',
            minHeight: '46px',
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#F1EEE6',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          <span>Advanced settings {showAdvanced ? '−' : '+'}</span>
          <span style={{ fontSize: '11px', color: '#6F6A60' }}>
            {showAdvanced ? 'Collapse' : 'Stability • Similarity • Style'}
          </span>
        </button>

        {showAdvanced && (
          <div
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid rgba(241, 238, 230, 0.08)',
            }}
          >
            {/* Stability */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#6F6A60' }}>
                  Stability
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#D4FF3A' }}>
                  {Math.round(stability * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={stability}
                onChange={(e) => setStability(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#D4FF3A',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              />
            </div>

            {/* Similarity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#6F6A60' }}>
                  Similarity
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#D4FF3A' }}>
                  {Math.round(similarity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={similarity}
                onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#D4FF3A',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              />
            </div>

            {/* Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#6F6A60' }}>
                  Style Exaggeration
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#D4FF3A' }}>
                  {Math.round(style * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={style}
                onChange={(e) => setStyle(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#D4FF3A',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 7. Full Width Single Dominant Generate Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={() => {
            if (isGenerating) return;
            if (audioUrl && !isPlaying) {
              togglePlayPause();
            } else {
              handleGenerate();
            }
          }}
          disabled={isGenerating}
          style={{
            width: '100%',
            minHeight: '52px',
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
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.85 : 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          {isGenerating ? (
            <>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #121212',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span>GENERATING...</span>
            </>
          ) : audioUrl ? (
            isPlaying ? (
              <>
                <Pause size={16} color="#121212" />
                <span>PAUSE VOICE</span>
              </>
            ) : (
              <>
                <Play size={16} color="#121212" fill="#121212" />
                <span>PLAY VOICE</span>
              </>
            )
          ) : (
            <>
              <span>GENERATE VOICE</span>
            </>
          )}
        </button>

        {/* Subordinate Stop button during generation */}
        {isGenerating && (
          <button
            type="button"
            onClick={stopAudio}
            style={{
              width: '100%',
              minHeight: '40px',
              background: 'transparent',
              color: '#6F6A60',
              border: '1px solid rgba(241, 238, 230, 0.15)',
              borderRadius: '999px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Square size={12} color="#6F6A60" />
            <span>STOP SYNTHESIS</span>
          </button>
        )}

        {/* Small "Re-generate" action if audio is ready */}
        {audioUrl && !isGenerating && (
          <button
            type="button"
            onClick={handleGenerate}
            style={{
              background: 'transparent',
              color: '#6F6A60',
              border: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px',
              cursor: 'pointer',
              textDecoration: 'underline',
              textAlign: 'center',
            }}
          >
            Re-generate audio with current settings
          </button>
        )}
      </div>

      {/* 8. Compact Player (Full Width, Subordinate) */}
      {audioUrl && (
        <div
          style={{
            backgroundColor: '#181818',
            borderRadius: '16px',
            border: '1px solid rgba(241, 238, 230, 0.14)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          {/* Controls line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={togglePlayPause}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#D4FF3A',
                  color: '#121212',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} color="#121212" /> : <Play size={18} color="#121212" fill="#121212" />}
              </button>

              <button
                type="button"
                onClick={stopAudio}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(241, 238, 230, 0.08)',
                  color: '#F1EEE6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Stop"
              >
                <Square size={14} />
              </button>
            </div>

            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: '#6F6A60',
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={downloadAudio}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(241, 238, 230, 0.08)',
                color: '#F1EEE6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Download Audio"
              aria-label="Download Audio"
            >
              <Download size={15} />
            </button>
          </div>

          {/* Progress bar scrub slider */}
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => seekAudio(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#D4FF3A',
              cursor: 'pointer',
              height: '6px',
            }}
          />
        </div>
      )}
    </div>
  );
};
