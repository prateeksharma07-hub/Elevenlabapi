import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '../scroll/scrollStore';
import { sampleTimeline } from '../scroll/timeline';

export const CameraRig: React.FC = () => {
  const { camera, pointer, size, viewport } = useThree();
  const smoothP = useRef(0);
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const rawP = useScrollStore.getState().progress;
    smoothP.current = THREE.MathUtils.damp(smoothP.current, rawP, 6, delta);
    const p = smoothP.current;

    const sample = sampleTimeline(p);

    const isMobile = size.width < 768 || viewport.aspect < 1.05;
    // On mobile portrait, adjust camera distance so the 3D capsule fits comfortably
    const mobileZScale = isMobile ? (size.width < 450 ? 1.35 : 1.20) : 1.0;
    const mobileYOffset = 0;

    // Pointer parallax: strictly DISABLED on mobile, subtle on desktop S1 Intro (0 - 14%)
    const parallaxWeight = (!isMobile && p < 0.14) ? 1 - (p / 0.14) : 0;
    const parallaxX = pointer.x * 0.18 * parallaxWeight;
    const parallaxY = -pointer.y * 0.12 * parallaxWeight;

    // Mobile S1->S2 transition: calm, gentle approach rather than aggressive deep travel
    let sampleZ = sample.cameraPos.z;
    if (isMobile && p >= 0.14 && p <= 0.38) {
      sampleZ = Math.max(1.15, sample.cameraPos.z * 1.3);
    }
    // Laptop screens (height <= 850px): gentle pull back in Scene 3 to prevent congestion
    if (!isMobile && size.height <= 850 && p >= 0.38 && p <= 0.62) {
      sampleZ = sampleZ * 1.12;
    }

    const desiredX = sample.cameraPos.x + parallaxX;
    const desiredY = sample.cameraPos.y + parallaxY + mobileYOffset;
    const desiredZ = sampleZ * mobileZScale;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, 0.1);

    // Dynamic FOV adjustment: 50 FOV on mobile S1 per mobile art direction
    const persCamera = camera as THREE.PerspectiveCamera;
    if (persCamera.fov) {
      const targetFov = isMobile && p < 0.16 ? 50 : sample.cameraFov;
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, targetFov, 0.08);
      persCamera.updateProjectionMatrix();
    }

    // LookAt focus
    let lookTargetY = mobileYOffset;
    if (p >= 0.58 && p <= 0.80) {
      // S4 Translate: capsule is parked at top-center
      lookTargetY = isMobile ? 0.85 : 0.45;
    }
    targetLookAt.current.y = THREE.MathUtils.lerp(targetLookAt.current.y, lookTargetY, 0.1);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};
