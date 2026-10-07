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

// Precise scene-keyed Camera Position across 0.0 - 1.0
// Guarantees zero lag and flawless framing for each scene regardless of curve arc-lengths
export function getCameraPosition(p: number): THREE.Vector3 {
  const pos = new THREE.Vector3();
  if (p <= 0.14) {
    // S1 Intro
    const t = smoothstep(0.0, 0.14, p);
    pos.lerpVectors(new THREE.Vector3(0, 0, 4.2), new THREE.Vector3(0, 0.15, 3.2), t);
  } else if (p <= 0.38) {
    // S2 Studio match-cut into screen
    const tIn = smoothstep(0.14, 0.19, p);
    const tHold = smoothstep(0.19, 0.38, p);
    const enterPos = new THREE.Vector3(0, 0.44, 0.65);
    const holdPos = new THREE.Vector3(0, 0.44, 0.70);
    pos.lerpVectors(new THREE.Vector3(0, 0.15, 3.2), enterPos, tIn);
    pos.lerp(holdPos, tHold);
  } else if (p <= 0.60) {
    // S3 Audio exploded orbit: pulls back smoothly to z = 4.8 for spacious blueprint framing
    const tPull = smoothstep(0.38, 0.44, p);
    const tDrift = smoothstep(0.44, 0.60, p);
    const s3Start = new THREE.Vector3(-0.35, 0.15, 4.8);
    const s3End = new THREE.Vector3(-0.50, 0.12, 5.0);
    pos.lerpVectors(new THREE.Vector3(0, 0.44, 0.70), s3Start, tPull);
    pos.lerp(s3End, tDrift);
  } else if (p <= 0.82) {
    // S4 Translate top-down
    const t = smoothstep(0.60, 0.70, p);
    pos.lerpVectors(new THREE.Vector3(-0.50, 0.12, 5.0), new THREE.Vector3(0, 1.2, 5.5), t);
  } else {
    // S5 Finale wide pullback
    const tIn = smoothstep(0.82, 0.88, p);
    const tOut = smoothstep(0.88, 1.00, p);
    pos.lerpVectors(new THREE.Vector3(0, 1.2, 5.5), new THREE.Vector3(0, 0.3, 4.2), tIn);
    pos.lerp(new THREE.Vector3(0, 0, 6.5), tOut);
  }
  return pos;
}

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
  const cameraPos = getCameraPosition(clampP);
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

  // S3 Audio: frame capsule in the center-right quadrant to give title & telemetry room
  if (clampP >= 0.38 && clampP <= 0.62) {
    const tIn = smoothstep(0.38, 0.45, clampP);
    const tOut = smoothstep(0.58, 0.62, clampP);
    const s3Weight = tIn * (1 - tOut);
    capsulePos.x = THREE.MathUtils.lerp(0, 0.40, s3Weight);
    capsulePos.y = THREE.MathUtils.lerp(0, -0.26, s3Weight);
    capsuleScale = THREE.MathUtils.lerp(1.0, 0.70, s3Weight);
  } else if (clampP >= 0.60 && clampP <= 0.82) {
    // S4 Translate: capsule reassembles, scale 0.45, parks top-center
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
    // S3 Audio exploded view: dynamic 3/4 perspective yaw 0 -> -35 deg, pitch 14 deg
    const tOrbit = smoothstep(0.38, 0.50, clampP);
    capsuleRot.y = THREE.MathUtils.degToRad(-35 * tOrbit);
    capsuleRot.x = THREE.MathUtils.degToRad(14 * tOrbit);
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
