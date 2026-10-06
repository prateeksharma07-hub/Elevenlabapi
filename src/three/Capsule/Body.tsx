import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { EXPLODE_VECTORS } from './parts';
import { sampleAudioLevels } from '../../audio/audioContext';

interface BodyProps {
  explode: number;
  isPlaying: boolean;
}

export const Body: React.FC<BodyProps> = ({ explode, isPlaying }) => {
  const frontShellRef = useRef<THREE.Group>(null);
  const backShellRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const levels = sampleAudioLevels(isPlaying);
    const subJitter = isPlaying ? (levels.subBass * 0.012 * (Math.random() - 0.5)) : 0;

    if (frontShellRef.current) {
      const targetZ = EXPLODE_VECTORS.frontShell.z * explode;
      frontShellRef.current.position.z = THREE.MathUtils.lerp(frontShellRef.current.position.z, targetZ, 0.1) + subJitter;
    }

    if (backShellRef.current) {
      const targetZ = EXPLODE_VECTORS.backShell.z * explode;
      backShellRef.current.position.z = THREE.MathUtils.lerp(backShellRef.current.position.z, targetZ, 0.1);
    }
  });

  return (
    <group>
      {/* Front Matte Orange Housing */}
      <group ref={frontShellRef}>
        <RoundedBox
          args={[1.2, 2.0, 0.55]}
          radius={0.28}
          smoothness={6}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#FF4B14"
            roughness={0.55}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
            metalness={0.0}
            reflectivity={0.2}
          />
        </RoundedBox>
      </group>

      {/* Internal Back Chassis (visible when exploded) */}
      <group ref={backShellRef}>
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[1.05, 1.85, 0.18]} />
          <meshStandardMaterial
            color="#161616"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};
