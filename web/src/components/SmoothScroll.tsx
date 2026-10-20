import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useAnimated } from './Scene';

/* Eased wheel scrolling (same feel as crosswalk.cl: 1.2s, exponential ease-out).
   Touch stays native, and nothing runs without JS or with reduced motion. Lenis moves the real
   window scroll, so Motion's useScroll and the pinned scenes keep working unchanged. */
export function SmoothScroll() {
  const animated = useAnimated();
  useEffect(() => {
    if (!animated) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: true });
    let id = requestAnimationFrame(function raf(time) { lenis.raf(time); id = requestAnimationFrame(raf); });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, [animated]);
  return null;
}
