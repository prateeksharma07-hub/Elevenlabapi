import * as THREE from 'three';

// Explosion vectors for Scene 3 (Audio exploded view: 38% - 60%)
// shell: +/-0.9, screen: 0.4, knobs: 0.6, grille: 0.2, button: 0.7
export const EXPLODE_VECTORS = {
  frontShell: new THREE.Vector3(0, 0, 0.9),
  backShell: new THREE.Vector3(0, 0, -0.9),
  screen: new THREE.Vector3(0, 0.4, 0.4),
  grille: new THREE.Vector3(0, -0.3, 0.2),
  knobs: new THREE.Vector3(0.5, 0, 0.6),
  button: new THREE.Vector3(0, -0.4, 0.7),
  ledRing: new THREE.Vector3(0, -0.4, 0.65),
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
