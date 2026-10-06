import Lenis from 'lenis';
import { useScrollStore } from './scrollStore';
import { sampleTimeline } from './timeline';

let lenisInstance: Lenis | null = null;

export function initLenis(): () => void {
  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.log('[AURA Scroll] Reduced motion active, disabling virtual inertia.');
    // Simple window scroll listener
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      useScrollStore.getState().setScroll({
        y,
        progress,
        velocity: 0,
        direction: 1,
      });

      // Update background color on DOM body directly
      // Keep body transparent so Fluid dynamic background shines through
      document.body.style.backgroundColor = 'transparent';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.1,
  });

  (window as any).lenis = lenisInstance;

  // Set initial background color and night shift immediately on init!
  const isNightInit = new Date().getHours() >= 19;
  if (isNightInit) {
    document.body.classList.add('night-shift');
  }
  // Ensure body remains transparent so FluidBackground mesh shines through
  document.body.style.backgroundColor = 'transparent';

  lenisInstance.on('scroll', ({ scroll, progress, velocity, direction }: any) => {
    useScrollStore.getState().setScroll({
      y: scroll,
      progress: Math.max(0, Math.min(1, progress)),
      velocity,
      direction: direction || 1,
    });

    // Check night shift (after 19:00 local time)
    const isNightShift = new Date().getHours() >= 19;
    if (isNightShift) {
      document.body.classList.add('night-shift');
    } else {
      document.body.classList.remove('night-shift');
    }

    // Keep body transparent so Fluid dynamic background shines through
    document.body.style.backgroundColor = 'transparent';

    // Detect active section
    if (progress < 0.14) {
      useScrollStore.getState().setActiveSection(1);
    } else if (progress < 0.38) {
      useScrollStore.getState().setActiveSection(2);
    } else if (progress < 0.60) {
      useScrollStore.getState().setActiveSection(3);
    } else if (progress < 0.82) {
      useScrollStore.getState().setActiveSection(4);
    } else {
      useScrollStore.getState().setActiveSection(5);
    }
  });

  let rafId: number;
  function raf(time: number) {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenisInstance?.destroy();
    lenisInstance = null;
    delete (window as any).lenis;
  };
}

export function scrollToProgress(progress: number, immediate = false) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = progress * max;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { immediate, duration: 1.4 });
  } else {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  }
}
