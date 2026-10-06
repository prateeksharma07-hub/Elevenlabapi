import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { BASE_POSITIONS, EXPLODE_VECTORS } from './parts';
import { sampleAudioLevels } from '../../audio/audioContext';

interface ScreenProps {
  explode: number;
  isPlaying: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ explode, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // 256 x 64 Canvas Texture for 60-column dot matrix
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.NearestFilter;
    return { canvas: c, texture: tex };
  }, []);

  useEffect(() => {
    canvasRef.current = canvas;
    textureRef.current = texture;
  }, [canvas, texture]);

  useFrame((state) => {
    // 1. Position with explosion
    if (meshRef.current) {
      const targetPos = BASE_POSITIONS.screen.clone().add(
        EXPLODE_VECTORS.screen.clone().multiplyScalar(explode)
      );
      meshRef.current.position.lerp(targetPos, 0.1);
    }

    // 2. 30 FPS Cap for Canvas Texture Updates per specification!
    const now = state.clock.elapsedTime * 1000;
    if (now - lastUpdateRef.current < 33.3) return; // ~30 fps cap
    lastUpdateRef.current = now;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !textureRef.current) return;

    // Clear background to dark ink screen
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 256, 64);

    const levels = sampleAudioLevels(isPlaying);
    const midEnergy = isPlaying ? levels.mid : 0;
    const time = state.clock.elapsedTime;

    // Draw 60-column tactile dot matrix
    const cols = 48;
    const rows = 12;
    const colSpacing = 256 / cols;
    const rowSpacing = 64 / rows;

    for (let c = 0; c < cols; c++) {
      // Calculate dot height per column
      let colHeight = 0;
      if (isPlaying) {
        // Real FFT response
        const binIdx = Math.min(levels.raw.length - 1, Math.floor((c / cols) * 64));
        const binVal = (levels.raw[binIdx] || 0) / 255;
        colHeight = (binVal * 0.85) + (Math.sin(time * 6 + c * 0.3) * 0.1);
      } else {
        // Idle subtle sine wave breathing
        colHeight = 0.2 + (Math.sin(time * 2.5 + c * 0.25) * 0.18);
      }

      const activeRows = Math.round(colHeight * rows);

      for (let r = 0; r < rows; r++) {
        const x = c * colSpacing + colSpacing / 2;
        const y = 64 - (r * rowSpacing + rowSpacing / 2);

        if (r < activeRows) {
          // Dynamic Multi-Color Spectrum: Cyber Cyan -> Electric Violet -> Hot Magenta
          const ratio = c / cols;
          if (ratio < 0.35) {
            ctx.fillStyle = '#00F5FF';
          } else if (ratio < 0.70) {
            ctx.fillStyle = '#A855F7';
          } else {
            ctx.fillStyle = '#FF007A';
          }
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dim faint unlit dot grid
          ctx.fillStyle = '#222222';
          ctx.beginPath();
          ctx.arc(x, y, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    textureRef.current.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} position={BASE_POSITIONS.screen.toArray()}>
        <RoundedBox args={[0.96, 0.5, 0.04]} radius={0.06} smoothness={4}>
          <meshBasicMaterial map={texture} toneMapped={false} />
        </RoundedBox>
      </mesh>
    </group>
  );
};
