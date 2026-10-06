import React, { useRef } from 'react';
import { playKnobTick } from '../audio/uiSounds';

interface Knob2DProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  subLabel?: string;
  accentColor?: string;
}

export const Knob2D: React.FC<Knob2DProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.05,
  onChange,
  subLabel,
  accentColor = '#00F5FF',
}) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(value);
  const lastDetent = useRef(Math.round(value / step));

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = startY.current - e.clientY;
    const range = max - min;
    const rawVal = startVal.current + (deltaY / 120) * range;
    const clamped = Math.max(min, Math.min(max, rawVal));
    const stepped = Math.round(clamped / step) * step;

    const currentDetent = Math.round(stepped / step);
    if (currentDetent !== lastDetent.current) {
      lastDetent.current = currentDetent;
      playKnobTick();
      if ('vibrate' in navigator) {
        try { navigator.vibrate(6); } catch (e) {}
      }
    }

    onChange(parseFloat(stepped.toFixed(2)));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Convert value to degrees (-135 to +135)
  const degrees = -135 + ((value - min) / (max - min)) * 270;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
      data-cursor="drag"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '8px',
        }}
      >
        <span className="font-mono" style={{ color: 'var(--c-smoke)', fontSize: '11px' }}>{label}</span>
        <span
          className="font-mono"
          style={{
            color: accentColor,
            fontWeight: 800,
            fontSize: '12px',
            textShadow: `0 0 10px ${accentColor}`,
          }}
        >
          {value.toFixed(2)}
        </span>
      </div>

      {/* Rotary Dial with Dynamic Glowing Notch */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: 'clamp(48px, 11vw, 64px)',
          height: 'clamp(48px, 11vw, 64px)',
          borderRadius: '50%',
          backgroundColor: '#0F121E',
          border: `1.5px solid rgba(255, 255, 255, 0.12)`,
          position: 'relative',
          cursor: 'ns-resize',
          boxShadow: `0 6px 16px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.08), 0 0 15px ${accentColor}33`,
          touchAction: 'none',
        }}
      >
        {/* Glowing Indicator Notch */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3.5px',
            height: 'clamp(16px, 3.8vw, 24px)',
            backgroundColor: accentColor,
            borderRadius: '2px',
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${degrees}deg)`,
            pointerEvents: 'none',
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
        {/* Center cap */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'clamp(14px, 3vw, 18px)',
            height: 'clamp(14px, 3vw, 18px)',
            borderRadius: '50%',
            backgroundColor: '#171B2B',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {subLabel && (
        <span
          className="font-mono"
          style={{
            fontSize: '9px',
            color: 'var(--c-smoke)',
            marginTop: '8px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
