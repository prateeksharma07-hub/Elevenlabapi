import React from 'react';
import { useScrollStore } from '../scroll/scrollStore';

interface MarqueeProps {
  text?: string;
  speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text = 'WORDS ARE ONLY THE BEGINNING — WORDS ARE ONLY THE BEGINNING — ',
  speed = 1.0,
}) => {
  const progress = useScrollStore((s) => s.progress);
  // In S5 (82% to 100%), marquee translates across
  const translateX = -(progress * 180 * speed) % 50;

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          transform: `translate3d(${translateX}%, 0, 0)`,
          willChange: 'transform',
        }}
      >
        <span
          className="font-display text-fluid-gradient"
          style={{
            fontSize: 'clamp(54px, 12vw, 160px)',
            letterSpacing: '-0.04em',
            lineHeight: 0.88,
            display: 'inline-block',
            filter: 'drop-shadow(0 10px 30px rgba(0, 245, 255, 0.35))',
          }}
        >
          {text} {text}
        </span>
      </div>
    </div>
  );
};
