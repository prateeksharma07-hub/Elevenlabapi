import * as THREE from 'three';

// Explosion vectors for Scene 3 (Audio exploded view: 38% - 60%)
// Refined schematic spacing: clean gaps between parts without colliding into viewport boundaries
export const EXPLODE_VECTORS = {
  frontShell: new THREE.Vector3(0, 0, 0.45),
  backShell: new THREE.Vector3(0, 0, -0.55),
  screen: new THREE.Vector3(0, 0.32, 0.35),
  grille: new THREE.Vector3(0, -0.22, 0.22),
  knobs: new THREE.Vector3(0.35, 0, 0.42),
  button: new THREE.Vector3(0, -0.28, 0.48),
  ledRing: new THREE.Vector3(0, -0.28, 0.46),
};

// Base positions in assembled state
export const BASE_POSITIONS = {
  screen: new THREE.Vector3(0, 0.48, 0.28),
  grille: new THREE.Vector3(0, -0.12, 0.28),
  knob1: new THREE.Vector3(-0.32, -0.52, 0.28), // Stability
  knob2: new THREE.Vector3(0.0, -0.52, 0.28),   // Similarity
  knob3: new THREE.Vector3(0.32, -0.52, 0.28),  // Style
  button: new THREE.Vector3(0, 0.05, 0.28),
  ledRing: new THREE.Vector3(0, 0.05, 0.29),
};
