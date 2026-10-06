import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { Capsule } from './Capsule/Capsule';
import { LanguageRing } from './LanguageRing';

export const Stage: React.FC = () => {
  const dpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5)
    : 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2, // Canvas is z-2, in front of headline (z: 1) and behind product viewport (z: 10)
        pointerEvents: 'none', // Handled selectively by interactive meshes
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.NeutralToneMapping, // Neutral tone mapping rule!
        }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Procedural Lighting Architecture - Vibrant Cyber-Acoustic Palette */}
        {/* 1. Crisp Key Light */}
        <directionalLight
          position={[-2.5, 4.5, 4.0]}
          intensity={2.2}
          color="#FFFFFF"
        />

        {/* 2. Cyber Cyan Fill Light Left */}
        <pointLight
          position={[-4.5, 1.5, 2.0]}
          intensity={3.5}
          color="#00F5FF"
          distance={15}
        />

        {/* 3. Radiant Magenta/Violet Rim Light Right */}
        <pointLight
          position={[4.5, -1.0, 2.5]}
          intensity={3.0}
          color="#EC4899"
          distance={15}
        />

        {/* 4. Acid Lime Top-Back Hair Light */}
        <directionalLight
          position={[0, 4.0, -3.5]}
          intensity={1.8}
          color="#D4FF3A"
        />

        {/* 5. Deep Space Ambient Foundation */}
        <ambientLight intensity={0.7} color="#2A2F45" />

        <Suspense fallback={null}>
          <CameraRig />
          <Capsule />
          <LanguageRing />

          {/* Tactile Contact Shadow */}
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.65}
            scale={5.0}
            blur={2.4}
            far={3.0}
            color="#121212"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
