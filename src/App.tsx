import React, { useEffect, useState, Suspense, lazy } from 'react';
import { StudioProvider, useStudio } from './state/studioState';
import { initLenis } from './scroll/lenis';
import { Nav } from './ui/Nav';
import { Cursor } from './ui/Cursor';
import { FluidBackground } from './ui/FluidBackground';
import { S01Intro } from './sections/S01Intro';
import { S02Studio } from './sections/S02Studio';
import { S03Audio } from './sections/S03Audio';
import { S04Translate } from './sections/S04Translate';
import { S05Finale } from './sections/S05Finale';
import './styles/app.css';

// Lazy-load 3D chunk per performance specification (keeps initial JS < 180 KB gz)
const Stage = lazy(() =>
  import('./three/Stage').then((mod) => ({ default: mod.Stage }))
);

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[AURA WebGL] Graceful fallback triggered:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div
            className="font-mono"
            style={{
              background: '#161616',
              color: '#D4FF3A',
              padding: '12px 24px',
              borderRadius: '99px',
              border: '1px solid #333',
            }}
          >
            AURA ONE // HARDWARE ACCELERATED FALLBACK ACTIVE
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { toast } = useStudio();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderDismissed, setLoaderDismissed] = useState(false);

  useEffect(() => {
    // Initialize Lenis single scroll driver
    const cleanupLenis = initLenis();

    // First paint logic:
    // If 3D takes > 600ms, show "LOADING VOICE 047" for ~1s with 5s failsafe
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    const dismissTimer = setTimeout(() => {
      setLoaderDismissed(true);
    }, 1800);

    const failsafeTimer = setTimeout(() => {
      setLoaderDismissed(true);
    }, 5000);

    return () => {
      cleanupLenis();
      clearTimeout(timer);
      clearTimeout(dismissTimer);
      clearTimeout(failsafeTimer);
    };
  }, []);

  return (
    <>
      {/* Living Fluid Moving Background Mesh */}
      <FluidBackground />

      {/* Custom Context Cursor (DRAG / PRESS) */}
      <Cursor />

      {/* Global Tactile Navigation */}
      <Nav />

      {/* S1: Intro Headline behind Canvas (Z-0) per specification! */}
      <S01Intro />

      {/* Fixed 3D Stage (Z-Index 1) */}
      <WebGLErrorBoundary>
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      </WebGLErrorBoundary>

      {/* DOM Storytelling & Product Sections on top of Canvas (Z-Index 10) */}
      <div className="app-viewport" style={{ zIndex: 10, pointerEvents: 'auto' }}>
        {/* S2: Studio 2D Flat Product */}
        <S02Studio />

        {/* S3: Audio Disassembly & Telemetry */}
        <S03Audio />

        {/* S4: 29-Language Polyglot Deck */}
        <S04Translate />

        {/* S5: Finale & Coda */}
        <S05Finale />
      </div>

      {/* 700vh Scroll Document Track for Lenis */}
      <div className="scroll-track" />

      {/* Toast Notification */}
      {toast && <div className="aura-toast">{toast}</div>}

      {/* First Paint Voice Loader Indicator */}
      {showLoader && !loaderDismissed && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--c-ink)',
            color: 'var(--c-lime)',
            padding: '8px 16px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--c-bone)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--c-orange)',
            }}
            className="spin"
          />
          <span>LOADING VOICE 047</span>
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
};

export default App;
