import { create } from 'zustand';

interface ScrollState {
  y: number;
  progress: number;
  smoothProgress: number;
  velocity: number;
  direction: number;
  activeSection: number;
  setScroll: (data: { y: number; progress: number; velocity: number; direction: number }) => void;
  setSmoothProgress: (p: number) => void;
  setActiveSection: (sec: number) => void;
}

// Vanilla Zustand store so R3F useFrame can read directly via getState() without re-rendering components!
export const useScrollStore = create<ScrollState>((set) => ({
  y: 0,
  progress: 0,
  smoothProgress: 0,
  velocity: 0,
  direction: 1,
  activeSection: 1,
  setScroll: (data) => set(data),
  setSmoothProgress: (p) => set({ smoothProgress: p }),
  setActiveSection: (sec) => set({ activeSection: sec }),
}));
