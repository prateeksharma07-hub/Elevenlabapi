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
    const mobileZScale = isMobile ? (size.width < 450 ? 1.48 : 1.25) : 1.0;
    const mobileYOffset = isMobile && p < 0.15 ? -0.18 : 0; // Lower slightly in S1 so headline is framed above

    // Subtle pointer parallax in S1 Intro (0 - 14%)
    const parallaxWeight = p < 0.14 ? 1 - (p / 0.14) : 0;
    const parallaxX = pointer.x * 0.18 * parallaxWeight;
    const parallaxY = -pointer.y * 0.12 * parallaxWeight;

    const desiredX = sample.cameraPos.x + parallaxX;
    const desiredY = sample.cameraPos.y + parallaxY + mobileYOffset;
    const desiredZ = sample.cameraPos.z * mobileZScale;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, 0.1);

    // Dynamic FOV adjustment
    const persCamera = camera as THREE.PerspectiveCamera;
    if (persCamera.fov) {
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, sample.cameraFov, 0.08);
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
