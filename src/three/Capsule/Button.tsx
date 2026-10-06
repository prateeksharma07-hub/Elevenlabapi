import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE_POSITIONS, EXPLODE_VECTORS } from './parts';
import { useStudio } from '../../state/studioState';
import { sampleAudioLevels } from '../../audio/audioContext';

interface ButtonProps {
  explode: number;
}

export const Button: React.FC<ButtonProps> = ({ explode }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { speakHeroGreeting, isPlaying } = useStudio();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 140);
    speakHeroGreeting();
  };

  useFrame(() => {
    if (!meshRef.current) return;

    // Explosion position
    const targetPos = BASE_POSITIONS.button.clone().add(
      EXPLODE_VECTORS.button.clone().multiplyScalar(explode)
    );

    // Press depth animation (0.04 depression on press)
    const pressOffset = isPressed ? -0.04 : 0;
    targetPos.z += pressOffset;

    meshRef.current.position.lerp(targetPos, 0.18);

    // Audio peak glow
    const levels = sampleAudioLevels(isPlaying);
    const peakGlow = isPlaying ? levels.peak * 0.65 : 0.25;

    const btnMesh = meshRef.current.children[0] as THREE.Mesh;
    if (btnMesh && btnMesh.material) {
      const mat = btnMesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, peakGlow, 0.15);
    }
  });

  return (
    <group
      ref={meshRef}
      position={BASE_POSITIONS.button.toArray()}
      onClick={handleClick}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 48]} />
        <meshStandardMaterial
          color="#D4FF3A"
          emissive="#D4FF3A"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
};
