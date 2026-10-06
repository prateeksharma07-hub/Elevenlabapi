import React, { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '../scroll/scrollStore';
import { useStudio } from '../state/studioState';
import { useLevels } from '../audio/useLevels';

export const FluidBackground: React.FC = () => {
  const progress = useScrollStore((s) => s.progress);
  const { isPlaying } = useStudio();
  const levels = useLevels(isPlaying);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Audio peak boost for fluid pulsation
  const audioPulse = isPlaying ? 1 + levels.peak * 0.45 : 1;

  // Determine section color palette shifts based on scroll progress
  // 0.0 - 0.18: Intro (Sunset Coral + Cyber Cyan + Violet)
  // 0.18 - 0.40: Studio (Deep Obsidian + Radiant Violet + Cyan)
  // 0.40 - 0.62: Audio (Electric Emerald + Laser Cyan + Lime)
  // 0.62 - 0.82: Translate (Neon Fuchsia + Royal Azure + Violet)
  // 0.82 - 1.00: Finale (Holographic Coral + Gold + Cyan)
  const getOrbHues = (p: number) => {
    if (p < 0.20) {
      // Scene 1: Ultra vibrant coral, electric violet, cyber cyan
      return {
        orb1: 'rgba(255, 75, 20, 0.75)',   // Neon Orange/Coral
        orb2: 'rgba(168, 85, 247, 0.70)',  // Electric Violet
        orb3: 'rgba(0, 245, 255, 0.65)',   // Cyber Cyan
        orb4: 'rgba(255, 0, 122, 0.60)',   // Neon Pink
      };
    } else if (p < 0.42) {
      // Scene 2 Studio: Violet, Cyan, Indigo, subtle Lime
      return {
        orb1: 'rgba(121, 40, 202, 0.70)',  // Deep Purple
        orb2: 'rgba(0, 245, 255, 0.65)',   // Cyber Cyan
        orb3: 'rgba(236, 72, 153, 0.55)',  // Magenta
        orb4: 'rgba(0, 255, 136, 0.45)',   // Emerald accent
      };
    } else if (p < 0.64) {
      // Scene 3 Audio: High-voltage Electric Emerald & Laser Cyan
      return {
        orb1: 'rgba(0, 255, 136, 0.70)',   // Emerald
        orb2: 'rgba(0, 245, 255, 0.75)',   // Laser Cyan
        orb3: 'rgba(212, 255, 58, 0.60)',  // Acid Lime
        orb4: 'rgba(168, 85, 247, 0.50)',  // Violet
      };
    } else if (p < 0.84) {
      // Scene 4 Translate: Global Polyglot Neon Fuchsia & Azure
      return {
        orb1: 'rgba(236, 72, 153, 0.70)',  // Neon Fuchsia
        orb2: 'rgba(14, 165, 233, 0.70)',  // Azure
        orb3: 'rgba(168, 85, 247, 0.65)',  // Violet
        orb4: 'rgba(255, 184, 0, 0.50)',   // Amber
      };
    } else {
      // Scene 5 Finale: Holographic Rainbow Gold, Coral, Cyan
      return {
        orb1: 'rgba(255, 184, 0, 0.70)',   // Liquid Gold
        orb2: 'rgba(255, 0, 122, 0.65)',   // Hot Pink
        orb3: 'rgba(0, 245, 255, 0.65)',   // Cyber Cyan
        orb4: 'rgba(168, 85, 247, 0.60)',  // Violet
      };
    }
  };

  const hues = getOrbHues(progress);
  const mx = (mousePos.x - 0.5) * 60;
  const my = (mousePos.y - 0.5) * 60;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0, // In front of base body background, behind S01Intro (z: 1)
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: '#07080E',
      }}
    >
      {/* Background Micro Grid for High-Tech Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.7,
        }}
      />

      {/* Fluid Orb 1 - Top Left */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '65vw',
          height: '65vw',
          maxWidth: '850px',
          maxHeight: '850px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hues.orb1} 0%, transparent 70%)`,
          filter: 'blur(90px)',
          transform: `translate(${mx * 1.2}px, ${my * 1.2}px) scale(${audioPulse})`,
          transition: 'background 0.8s ease, transform 0.25s ease-out',
          animation: 'floatOrb1 18s ease-in-out infinite',
        }}
      />

      {/* Fluid Orb 2 - Right Center */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-15%',
          width: '70vw',
          height: '70vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hues.orb2} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          transform: `translate(${-mx}px, ${-my}px) scale(${audioPulse * 1.05})`,
          transition: 'background 0.8s ease, transform 0.25s ease-out',
          animation: 'floatOrb2 22s ease-in-out infinite',
        }}
      />

      {/* Fluid Orb 3 - Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '15%',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hues.orb3} 0%, transparent 70%)`,
          filter: 'blur(95px)',
          transform: `translate(${mx * 0.8}px, ${-my * 0.8}px) scale(${audioPulse * 0.95})`,
          transition: 'background 0.8s ease, transform 0.25s ease-out',
          animation: 'floatOrb3 20s ease-in-out infinite',
        }}
      />

      {/* Fluid Orb 4 - Bottom Right / Center Core */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '50vw',
          height: '50vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hues.orb4} 0%, transparent 65%)`,
          filter: 'blur(110px)',
          transform: `translate(${-mx * 0.5}px, ${my * 0.5}px) scale(${audioPulse})`,
          transition: 'background 0.8s ease, transform 0.25s ease-out',
        }}
      />

      {/* Vignette & Contrast Polish */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 40%, rgba(7, 8, 14, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
