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
    groupRef.current.visible = !inStudioMatchCut;

    if (inStudioMatchCut) return;

    // 1. Position & Scale
    groupRef.current.position.lerp(sample.capsulePos, 0.12);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, sample.capsuleScale, 0.12));

    // 2. Rotation & Idle Float
    let targetRotX = sample.capsuleRot.x;
    let targetRotY = sample.capsuleRot.y;
    let targetRotZ = sample.capsuleRot.z;

    // In S1 Intro (0 - 14%): Idle organic float (yaw +/- 12 deg, pitch +/- 8 deg)
    if (p < 0.14) {
      const time = state.clock.elapsedTime;
      targetRotY += Math.sin(time * 0.8) * THREE.MathUtils.degToRad(12);
      targetRotX += Math.cos(time * 0.6) * THREE.MathUtils.degToRad(8);
      // Gentle floating bob
      groupRef.current.position.y += Math.sin(time * 1.2) * 0.035;
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
