import React from 'react';

interface DotMatrixProps {
  cols?: number;
  rows?: number;
  activeCols?: number[];
  color?: string;
  dimColor?: string;
  size?: number;
  gap?: number;
}

export const DotMatrix: React.FC<DotMatrixProps> = ({
  cols = 24,
  rows = 6,
  activeCols = [],
  color = '#00F5FF',
  dimColor = '#161A29',
  size = 4,
  gap = 4,
}) => {
  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gap: `${gap}px`,
        padding: '10px 14px',
        background: 'rgba(10, 13, 22, 0.75)',
        borderRadius: 'var(--r-sm)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)',
      }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const isActive = activeCols.includes(c);
          // Multi-color column gradient: Cyan -> Violet -> Pink
          const colRatio = c / Math.max(1, cols - 1);
          let dotColor = color;
          if (isActive) {
            if (colRatio < 0.35) dotColor = '#00F5FF';
            else if (colRatio < 0.7) dotColor = '#A855F7';
            else dotColor = '#FF007A';
          }
          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: isActive ? dotColor : dimColor,
                boxShadow: isActive ? `0 0 6px ${dotColor}` : 'none',
                transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
              }}
            />
          );
        })
      )}
    </div>
  );
};
