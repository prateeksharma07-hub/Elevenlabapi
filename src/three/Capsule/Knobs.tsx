import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE_POSITIONS, EXPLODE_VECTORS } from './parts';
import { useStudio } from '../../state/studioState';
import { playKnobTick } from '../../audio/uiSounds';

interface KnobsProps {
  explode: number;
}

interface SingleKnobProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  basePos: THREE.Vector3;
  explode: number;
}

const SingleKnob: React.FC<SingleKnobProps> = ({ value, onChange, basePos, explode }) => {
  const meshRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(value);

  // Five-unit detents & haptics
  const lastDetent = useRef(Math.round(value * 20));

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const deltaY = startY.current - e.clientY;
    const newVal = Math.max(0, Math.min(1, startVal.current + deltaY * 0.005));

    // 5-unit detent check (steps of 0.05)
    const currentDetent = Math.round(newVal * 20);
    if (currentDetent !== lastDetent.current) {
      lastDetent.current = currentDetent;
      playKnobTick();
      if ('vibrate' in navigator) {
        try { navigator.vibrate(6); } catch (e) {}
      }
    }

    onChange(parseFloat(newVal.toFixed(2)));
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = false;
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // Position with explosion offset
    const targetPos = basePos.clone().add(
      EXPLODE_VECTORS.knobs.clone().multiplyScalar(explode)
    );
    meshRef.current.position.lerp(targetPos, 0.1);

    // Rotation maps value (0.0 to 1.0) -> (-135 deg to +135 deg)
    const targetRotZ = THREE.MathUtils.lerp(
      THREE.MathUtils.degToRad(135),
      THREE.MathUtils.degToRad(-135),
      value
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.15);
  });

  return (
    <group
      ref={meshRef}
      position={basePos.toArray()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Rubber Knob Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.11, 48]} />
        <meshStandardMaterial
          color="#161616"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Acid Lime Indicator Notch */}
      <mesh position={[0, 0.075, 0.056]}>
        <boxGeometry args={[0.016, 0.055, 0.01]} />
        <meshBasicMaterial color="#D4FF3A" />
      </mesh>
    </group>
  );
};

export const Knobs: React.FC<KnobsProps> = ({ explode }) => {
  const { stability, setStability, similarity, setSimilarity, style, setStyle } = useStudio();

  return (
    <group>
      {/* 1. Stability Knob */}
      <SingleKnob
        label="Stability"
        value={stability}
        onChange={setStability}
        basePos={BASE_POSITIONS.knob1}
        explode={explode}
      />

      {/* 2. Similarity Knob */}
      <SingleKnob
        label="Similarity"
        value={similarity}
        onChange={setSimilarity}
        basePos={BASE_POSITIONS.knob2}
        explode={explode}
      />

      {/* 3. Style Knob */}
      <SingleKnob
        label="Style"
        value={style}
        onChange={setStyle}
        basePos={BASE_POSITIONS.knob3}
        explode={explode}
      />
    </group>
  );
};
