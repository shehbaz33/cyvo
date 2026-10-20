import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { motionValue, useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from 'motion/react';

/* ---------- Animated or static? ----------
   Server render and first client render are always static (all content visible, nothing pinned),
   so the pre-rendered HTML works without JavaScript. After mount, the story switches to animated
   unless the visitor prefers reduced motion. */
export function useAnimated() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}

/* ---------- Guide store: which chapter is pinned, and how far through it ---------- */
export const CHAPTERS = ['The gaps', 'The team', 'Your rules', 'One patient', 'The impact'];
type GuideState = { active: number | null; done: number };
let guide: GuideState = { active: null, done: -1 };
const listeners = new Set<() => void>();
export const sceneProgress: MotionValue<number> = motionValue(0);
function setGuide(next: Partial<GuideState>) {
  const merged = { ...guide, ...next };
  if (merged.active === guide.active && merged.done === guide.done) return;
  guide = merged;
  listeners.forEach((l) => l());
}
export function useGuide() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => guide,
    () => guide,
  );
}

/* ---------- Scene ---------- */
type SceneCtx = { step: number; steps: number; progress: MotionValue<number>; animated: boolean };
const Ctx = createContext<SceneCtx>({ step: 0, steps: 1, progress: motionValue(1), animated: false });
export const useScene = () => useContext(Ctx);

type Props = {
  id: string;
  chapter: number;
  steps: number;
  label: string;
  stepLength?: string;
  base?: string; // the section's own background colour (shows without JS too)
  className?: string;
  children: ReactNode;
};

export function Scene({ id, chapter, steps, label, stepLength, base, className = '', children }: Props) {
  const animated = useAnimated();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!animated) return;
    setStep(Math.min(steps - 1, Math.max(0, Math.floor(v * steps))));
    const pinned = v > 0 && v < 1;
    if (pinned) {
      sceneProgress.set(v);
      setGuide({ active: chapter, done: Math.max(guide.done, chapter - 1) });
    } else if (guide.active === chapter) {
      setGuide({ active: null, done: v >= 1 ? Math.max(guide.done, chapter) : chapter - 1 });
    }
  });

  return (
    <section
      id={id}
      ref={ref}
      aria-label={label}
      className={`scene ${animated ? 'is-animated' : ''} ${className}`}
      style={{ ['--steps' as string]: steps, ...(stepLength ? { ['--step-len' as string]: stepLength } : {}), ...(base ? { background: base } : {}) }}
    >
      <div className="stage">
        <Ctx.Provider value={{ step: animated ? step : steps - 1, steps, progress: scrollYProgress, animated }}>
          {children}
        </Ctx.Provider>
      </div>
    </section>
  );
}

/* Small helper: true on phones (layout differs inside some scenes). SSR-safe. */
export function useIsNarrow(px = 900) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px - 1}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);
  return narrow;
}
