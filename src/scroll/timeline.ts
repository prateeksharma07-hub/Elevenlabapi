import * as THREE from 'three';

// Smoothstep utility
export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Background color keyframes
// 0%: #FF4B14, 20%: #FF4B14, 40%: #F1EEE6, 60%: #121212, 80%: #D4FF3A, 100%: #FF4B14
const colorOrange = new THREE.Color('#FF4B14');
const colorBoneDay = new THREE.Color('#F1EEE6');
const colorBoneNight = new THREE.Color('#1D1B18');
const colorInk = new THREE.Color('#121212');
const colorLime = new THREE.Color('#D4FF3A');

export function getBackgroundColor(progress: number, isNightShift = false): THREE.Color {
  const p = Math.max(0, Math.min(1, progress));
  const bone = isNightShift ? colorBoneNight : colorBoneDay;
  const result = new THREE.Color();

  if (p <= 0.20) {
    result.copy(colorOrange);
  } else if (p <= 0.40) {
    const t = smoothstep(0.20, 0.40, p);
    result.lerpColors(colorOrange, bone, t);
  } else if (p <= 0.60) {
    const t = smoothstep(0.40, 0.60, p);
    result.lerpColors(bone, colorInk, t);
  } else if (p <= 0.80) {
    const t = smoothstep(0.60, 0.80, p);
    result.lerpColors(colorInk, colorLime, t);
  } else {
    const t = smoothstep(0.80, 1.00, p);
    result.lerpColors(colorLime, colorOrange, t);
  }

  return result;
}

// Catmull-Rom spline for Camera Position across 0.0 - 1.0
// S1: 0-14% (z 4.2)
// S2: 14-38% (z 4.2 -> 0.9 match cut)
// S3: 38-60% (orbit yaw -110 deg, pitch 8 deg, z 3.2)
// S4: 60-82% (z 5.5, slight top-down)
// S5: 82-100% (z 4.2 -> 7.0 wide pullback)
const cameraCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 4.2),        // 0.00: S1 Intro
  new THREE.Vector3(0, 0.15, 3.2),     // 0.12: approaching screen
  new THREE.Vector3(0, 0.44, 0.65),    // 0.18: S2 Studio match-cut point into screen center
  new THREE.Vector3(0, 0.44, 0.70),    // 0.35: Studio holding
  new THREE.Vector3(-0.85, 0.25, 3.3), // 0.48: S3 Audio exploded orbit
  new THREE.Vector3(-0.95, 0.20, 3.5), // 0.58: Audio climax
  new THREE.Vector3(0, 1.2, 5.5),      // 0.70: S4 Translate slight top-down
  new THREE.Vector3(0, 0.3, 4.2),      // 0.85: S5 Finale start
  new THREE.Vector3(0, 0, 7.0),        // 1.00: S5 Finale wide pullback
]);

export interface TimelineSample {
  cameraPos: THREE.Vector3;
  cameraFov: number;
  capsulePos: THREE.Vector3;
  capsuleRot: THREE.Euler;
  capsuleScale: number;
  explodeAmount: number;
  matchCutScreenOpacity: number;
  ledGain: number;
  bgHex: string;
}

export function sampleTimeline(p: number, isNightShift = false): TimelineSample {
  const clampP = Math.max(0, Math.min(1, p));

  // 1. Camera
  const cameraPos = cameraCurve.getPointAt(clampP);
  let cameraFov = 38;
  if (clampP > 0.14 && clampP <= 0.38) {
    cameraFov = 34; // Deep focus on screen during Studio
  } else if (clampP > 0.38 && clampP <= 0.60) {
    cameraFov = 42; // Expansive view of exploded parts
  } else if (clampP > 0.82) {
    cameraFov = 44; // Wide finale view
  }

  // 2. Capsule Position & Scale
  const capsulePos = new THREE.Vector3(0, 0, 0);
  let capsuleScale = 1.0;

  // S4 Translate: capsule reassembles, scale 0.45, parks top-center
  if (clampP >= 0.60 && clampP <= 0.82) {
    const tIn = smoothstep(0.60, 0.66, clampP);
    const tOut = smoothstep(0.78, 0.84, clampP);
    const parkAmount = tIn * (1 - tOut);
    capsulePos.y = THREE.MathUtils.lerp(0, 1.45, parkAmount);
    capsuleScale = THREE.MathUtils.lerp(1.0, 0.45, parkAmount);
  } else if (clampP > 0.82) {
    // S5: AURA One becomes small and centered
    const tFinale = smoothstep(0.82, 0.95, clampP);
    capsuleScale = THREE.MathUtils.lerp(1.0, 0.65, tFinale);
  }

  // 3. Capsule Rotation (Pitch, Yaw, Roll)
  const capsuleRot = new THREE.Euler(0, 0, 0);
  if (clampP < 0.14) {
    // S1 Intro: idle float yaw +/- 12 deg, pitch +/- 8 deg handled in useFrame
    capsuleRot.set(0, 0, 0);
  } else if (clampP <= 0.38) {
    // S2 Studio: perfectly facing screen
    capsuleRot.set(0, 0, 0);
  } else if (clampP <= 0.60) {
    // S3 Audio exploded view: dynamic 3/4 perspective yaw 0 -> -50 deg, pitch 12 deg
    const tOrbit = smoothstep(0.38, 0.52, clampP);
    capsuleRot.y = THREE.MathUtils.degToRad(-50 * tOrbit);
    capsuleRot.x = THREE.MathUtils.degToRad(12 * tOrbit);
  } else if (clampP <= 0.82) {
    // S4 Translate: upright top-down tilt
    capsuleRot.x = THREE.MathUtils.degToRad(12);
    capsuleRot.y = 0;
  } else {
    // S5 Finale
    capsuleRot.set(0, 0, 0);
  }

  // 4. Explode Amount (0.0 to 1.0 during S3: 38-60%)
  let explodeAmount = 0;
  if (clampP >= 0.38 && clampP <= 0.62) {
    const tExplode = smoothstep(0.38, 0.46, clampP);
    const tReassemble = smoothstep(0.56, 0.62, clampP);
    explodeAmount = tExplode * (1 - tReassemble);
  }

  // 5. Match-Cut Screen Factor (At ~17%, camera enters screen -> DOM Studio crossfades)
  let matchCutScreenOpacity = 0;
  if (clampP >= 0.16 && clampP <= 0.38) {
    matchCutScreenOpacity = smoothstep(0.16, 0.19, clampP);
  }

  // 6. LED Gain
  let ledGain = 0.5;
  if (clampP >= 0.85 && clampP <= 0.95) {
    // Finale 3 blinks at 95%
    ledGain = Math.sin((clampP - 0.85) * 40) > 0 ? 1.0 : 0.0;
  }

  // 7. Background Color
  const bgColor = getBackgroundColor(clampP, isNightShift);

  return {
    cameraPos,
    cameraFov,
    capsulePos,
    capsuleRot,
    capsuleScale,
    explodeAmount,
    matchCutScreenOpacity,
    ledGain,
    bgHex: `#${bgColor.getHexString()}`,
  };
}
