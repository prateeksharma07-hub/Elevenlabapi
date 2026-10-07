import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LANGUAGES } from '../services/translation';
import { useScrollStore } from '../scroll/scrollStore';
import { useStudio } from '../state/studioState';

export const LanguageRing: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { setTransTargetLang } = useStudio();
  const orbitAngle = useRef(0);

  // Generate 29 canvas sprite textures for language tags without external font downloads!
  const sprites = useMemo(() => {
    return LANGUAGES.map((lang, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 180;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const colors = ['#00F5FF', '#A855F7', '#FF007A', '#00FF88', '#FFB800', '#FF5E3A'];
        const tagColor = colors[i % colors.length];

        ctx.fillStyle = 'rgba(13, 16, 28, 0.9)';
        ctx.roundRect ? ctx.roundRect(4, 4, 172, 56, 16) : ctx.fillRect(4, 4, 172, 56);
        ctx.fill();

        ctx.strokeStyle = tagColor;
        ctx.lineWidth = 3;
        ctx.roundRect ? ctx.stroke() : ctx.strokeRect(4, 4, 172, 56);

        ctx.fillStyle = tagColor;
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lang.code.toUpperCase(), 90, 32);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      const angle = (i / LANGUAGES.length) * Math.PI * 2;
      return { lang, texture: tex, baseAngle: angle };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const isMobile = state.size.width < 768 || state.viewport.aspect < 1.05;
    if (isMobile) {
      groupRef.current.visible = false;
      return;
    }

    const p = useScrollStore.getState().progress;
    const velocity = useScrollStore.getState().velocity;

    // Visibility window in S4 Translate (60% - 82%)
    let targetOpacity = 0;
    if (p >= 0.60 && p <= 0.82) {
      targetOpacity = 1.0;
    } else if (p > 0.54 && p < 0.60) {
      targetOpacity = (p - 0.54) / 0.06;
    } else if (p > 0.82 && p < 0.88) {
      targetOpacity = 1 - (p - 0.82) / 0.06;
    }

    groupRef.current.visible = targetOpacity > 0.01;

    // Orbit speed responds to scroll velocity per specification!
    const speed = 0.25 + Math.abs(velocity) * 0.003;
    orbitAngle.current += delta * speed;

    const radius = 1.6;
    sprites.forEach((item, idx) => {
      const child = groupRef.current?.children[idx] as THREE.Sprite;
      if (child) {
        const curAngle = item.baseAngle + orbitAngle.current;
        const x = Math.cos(curAngle) * radius;
        const z = Math.sin(curAngle) * radius;
        // Subtle wave around capsule at y=1.15
        const y = Math.sin(curAngle * 2) * 0.12;

        child.position.set(x, y, z);
        child.material.opacity = targetOpacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 1.45, 0]}>
      {sprites.map((item, idx) => (
        <sprite
          key={item.lang.code}
          scale={[0.28, 0.10, 1]}
          onClick={(e) => {
            e.stopPropagation();
            setTransTargetLang(item.lang.code);
          }}
        >
          <spriteMaterial map={item.texture} transparent={true} opacity={0} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
};
