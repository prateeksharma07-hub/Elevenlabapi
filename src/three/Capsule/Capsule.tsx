import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Body } from './Body';
import { Screen } from './Screen';
import { Grille } from './Grille';
import { Knobs } from './Knobs';
import { Button } from './Button';
import { LedRing } from './LedRing';
import { useScrollStore } from '../../scroll/scrollStore';
import { sampleTimeline } from '../../scroll/timeline';
import { useStudio } from '../../state/studioState';

export const Capsule: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { isPlaying } = useStudio();

  // Damped smooth scroll progress
  const smoothP = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Read progress without React state re-renders!
    const targetP = useScrollStore.getState().progress;
    // Damping: smooth transition
    smoothP.current = THREE.MathUtils.damp(smoothP.current, targetP, 6, delta);
    const p = smoothP.current;

    const sample = sampleTimeline(p);
    
    // In S2 Studio (0.185 to 0.375): Screen has match-cut into DOM Studio.
    // Pause/sleep 3D capsule visibility to save GPU and prevent occlusion of 2D product
    const inStudioMatchCut = p >= 0.185 && p <= 0.375;
    const isMobile = state.size.width < 768 || state.viewport.aspect < 1.05;
    
    // In S5 Finale on mobile (p >= 0.81): Art direction requires minimal editorial coda with no floating objects
    const hideOnMobileFinale = isMobile && p >= 0.81;

    groupRef.current.visible = !inStudioMatchCut && !hideOnMobileFinale;

    if (inStudioMatchCut || hideOnMobileFinale) return;

    const targetScale = isMobile ? sample.capsuleScale * 0.78 : sample.capsuleScale;

    // 1. Position & Scale
    const targetPos = sample.capsulePos.clone();
    if (isMobile && p < 0.14) {
      targetPos.y = -0.18; // centered below mobile headline and above bottom CTA
    }
    groupRef.current.position.lerp(targetPos, 0.12);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12));

    // 2. Rotation & Idle Float
    let targetRotX = sample.capsuleRot.x;
    let targetRotY = sample.capsuleRot.y;
    let targetRotZ = sample.capsuleRot.z;

    // In S1 Intro (0 - 14%): Idle organic float (subtle on mobile, full on desktop)
    if (p < 0.14) {
      const time = state.clock.elapsedTime;
      const idleMultiplier = isMobile ? 0.5 : 1.0;
      targetRotY += Math.sin(time * 0.7) * THREE.MathUtils.degToRad(12 * idleMultiplier);
      targetRotX += Math.cos(time * 0.5) * THREE.MathUtils.degToRad(8 * idleMultiplier);
      // Gentle floating bob
      groupRef.current.position.y += Math.sin(time * 1.1) * (0.035 * idleMultiplier);
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
  });

  const p = useScrollStore((s) => s.progress);
  const sample = sampleTimeline(p);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Matte Orange Rounded Housing */}
      <Body explode={sample.explodeAmount} isPlaying={isPlaying} />

      {/* 2. 60-Column Dot Matrix Screen */}
      <Screen explode={sample.explodeAmount} isPlaying={isPlaying} />

      {/* 3. 168-Dot Treble Speaker Grille */}
      <Grille explode={sample.explodeAmount} isPlaying={isPlaying} />

      {/* 4. Three Tactile Rotary Knobs */}
      <Knobs explode={sample.explodeAmount} />

      {/* 5. Acid Lime Hero Interactive Speaking Button */}
      <Button explode={sample.explodeAmount} />

      {/* 6. Lime Emissive LED Ring */}
      <LedRing explode={sample.explodeAmount} ledGain={sample.ledGain} isPlaying={isPlaying} />
    </group>
  );
};
