import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE_POSITIONS, EXPLODE_VECTORS } from './parts';
import { sampleAudioLevels } from '../../audio/audioContext';

interface LedRingProps {
  explode: number;
  ledGain: number;
  isPlaying: boolean;
}

export const LedRing: React.FC<LedRingProps> = ({ explode, ledGain, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    // Explosion position
    const targetPos = BASE_POSITIONS.ledRing.clone().add(
      EXPLODE_VECTORS.ledRing.clone().multiplyScalar(explode)
    );
    meshRef.current.position.lerp(targetPos, 0.15);

    // Audio peak modulation + scroll finale blinks
    const levels = sampleAudioLevels(isPlaying);
    const audioPeak = isPlaying ? levels.peak * 1.5 : 0.3;
    const intensity = Math.max(0.1, audioPeak * ledGain);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, intensity, 0.2);
    }
  });

  return (
    <mesh ref={meshRef} position={BASE_POSITIONS.ledRing.toArray()}>
      <torusGeometry args={[0.24, 0.012, 16, 64]} />
      <meshStandardMaterial
        color="#D4FF3A"
        emissive="#D4FF3A"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
};
