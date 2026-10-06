import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Hide custom cursor on touch screens per specification!
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);

      // Check hovered interactive elements for custom context
      const target = e.target as HTMLElement;
      if (target?.closest('[data-cursor="press"]')) {
        setLabel('PRESS');
      } else if (target?.closest('[data-cursor="drag"]')) {
        setLabel('DRAG');
      } else {
        setLabel(null);
      }
    };

    const onMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (isTouch || !visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.04s linear',
      }}
    >
      {label ? (
        <div
          style={{
            transform: 'translate(-50%, -50%)',
            background: '#D4FF3A',
            color: '#121212',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            padding: '4px 10px',
            borderRadius: '99px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            border: '1px solid #121212',
          }}
        >
          {label}
        </div>
      ) : (
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#121212',
            border: '1.5px solid #F1EEE6',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};
