import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE_POSITIONS, EXPLODE_VECTORS } from './parts';
import { sampleAudioLevels } from '../../audio/audioContext';

interface GrilleProps {
  explode: number;
  isPlaying: boolean;
}

const COLS = 14;
const ROWS = 12;
const TOTAL_DOTS = COLS * ROWS; // 168 dots

export const Grille: React.FC<GrilleProps> = ({ explode, isPlaying }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute 12 x 14 grid coordinates
  const dotCoords = useMemo(() => {
    const coords: [number, number][] = [];
    const spacingX = 0.048;
    const spacingY = 0.048;
    const startX = -((COLS - 1) * spacingX) / 2;
    const startY = ((ROWS - 1) * spacingY) / 2;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        coords.push([startX + c * spacingX, startY - r * spacingY]);
      }
    }
    return coords;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < TOTAL_DOTS; i++) {
      const [x, y] = dotCoords[i];
      dummy.position.set(x, y, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dotCoords, dummy]);

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;

    // Explosion position
    const targetPos = BASE_POSITIONS.grille.clone().add(
      EXPLODE_VECTORS.grille.clone().multiplyScalar(explode)
    );
    groupRef.current.position.lerp(targetPos, 0.1);

    // Scale dots dynamically driven by Treble frequencies!
    const levels = sampleAudioLevels(isPlaying);
    const trebleScale = 1.0 + (isPlaying ? levels.treble * 0.9 : 0);

    for (let i = 0; i < TOTAL_DOTS; i++) {
      const [x, y] = dotCoords[i];
      dummy.position.set(x, y, 0);
      dummy.scale.set(trebleScale, trebleScale, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={BASE_POSITIONS.grille.toArray()}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, TOTAL_DOTS]}
      >
        <circleGeometry args={[0.018, 12]} />
        <meshBasicMaterial color="#121212" />
      </instancedMesh>
    </group>
  );
};
