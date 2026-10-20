import { useEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useInView, useTransform } from 'motion/react';
import { SOURCES, type SourceId } from '../data/content';
import { CHAPTERS, sceneProgress, useAnimated, useGuide, useIsNarrow, useScene } from './Scene';
import { useScroll } from 'motion/react';

export const spring = { type: 'spring', stiffness: 260, damping: 26 } as const;
export const ease = [0.2, 0.7, 0.2, 1] as const;

/* A chat bubble that slides in and pushes older messages up (layout animation). */
export function Bubble({ from, who, children, tr }: { from: 'us' | 'them'; who: string; children: ReactNode; tr?: string }) {
  const { animated } = useScene();
  return (
    <motion.p
      layout={animated ? 'position' : false}
      initial={animated ? { opacity: 0, y: 18, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={spring}
      className={`msg ${from}`}
      style={{ transformOrigin: from === 'us' ? '100% 100%' : '0% 100%' }}
    >
      <small>{who}</small>
      {children}
      {tr && <span className="tr">{tr}</span>}
    </motion.p>
  );
}

/* Any element that enters the thread the same way as a bubble. */
export function ThreadItem({ className, children }: { className: string; children: ReactNode }) {
  const { animated } = useScene();
  return (
    <motion.div layout={animated ? 'position' : false} initial={animated ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={spring} className={className}>
      {children}
    </motion.div>
  );
}

export function SourceTag({ id }: { id: SourceId }) {
  return <a className="source" href={SOURCES[id].url} target="_blank" rel="noopener" title={SOURCES[id].full}>{SOURCES[id].short}</a>;
}

/* Counts up to `to` whenever it appears or `to` changes; lands exactly on the value. */
export function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const animated = useAnimated();
  const fmt = (n: number) => prefix + Math.round(n).toLocaleString('en-IN') + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!animated || !inView) { el.textContent = fmt(to); return; }
    const controls = animate(0, to, { duration: 0.9, ease, onUpdate: (v) => { el.textContent = fmt(v); } });
    return () => controls.stop();
  }, [to, inView, animated]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{fmt(to)}</span>;
}

/* Swaps content with a soft vertical fade (used for headlines that change per beat). */
export function Swap({ k, children, className }: { k: string | number; children: ReactNode; className?: string }) {
  const { animated } = useScene();
  return (
    <motion.div
      key={k}
      className={className}
      initial={animated ? { opacity: 0, y: 24, filter: 'blur(6px)' } : false}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Scroll-linked backdrop for pinned scenes ----------
   Everything here moves with scroll position (not on a timer), so it travels exactly as far as you scroll.
   - The stage colour sits at the middle of each beat and blends into the next one (one colour per step).
   - A strip of oversized words slides right to left across the whole scene, ending on its last word. */
export function Backdrop({ colors, words }: { colors: string[]; words: string[] }) {
  const { progress, steps } = useScene();
  const stops = [0, ...colors.map((_, i) => (i + 0.5) / steps), 1];
  const bg = useTransform(progress, stops, [colors[0], ...colors, colors[colors.length - 1]]);
  const ref = useRef<HTMLParagraphElement>(null);
  const travel = useRef(0);
  useEffect(() => {
    const measure = () => { if (ref.current) travel.current = Math.max(0, ref.current.scrollWidth - window.innerWidth * 0.85); };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const x = useTransform(progress, (v) => 40 - v * (travel.current + 40));
  return (
    <>
      <motion.div className="stage-bg" style={{ backgroundColor: bg }} />
      <motion.p ref={ref} className="scene-strip D" aria-hidden="true" style={{ x }}>{words.join(' · ')}</motion.p>
    </>
  );
}

/* Content layer that drifts up slowly through the whole scene, against the strip moving sideways. */
export function Drift({ children, className, by = 40 }: { children: ReactNode; className?: string; by?: number }) {
  const { progress, animated } = useScene();
  const narrow = useIsNarrow();
  const y = useTransform(progress, [0, 1], [by, -by]);
  return <motion.div className={className} style={animated && !narrow ? { y } : undefined}>{children}</motion.div>;
}

/* ---------- Scroll guidance: page progress bar, chapter rail, scroll cue ---------- */
export function Guide() {
  const animated = useAnimated();
  const { scrollYProgress, scrollY } = useScroll();
  const g = useGuide();
  const dash = useTransform(sceneProgress, (v) => 97.4 * (1 - v));
  const inHeroRef = useRef(true);
  const cueRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animated) return;
    const update = () => {
      const vh = window.innerHeight;
      const inHero = scrollY.get() < vh * 0.6;
      inHeroRef.current = inHero;
      const narrow = window.innerWidth < 760;
      const p = sceneProgress.get();
      // Only inside pinned acts: the hero has its own inline "Scroll ↓" line, and the pill would cover its founder line.
      const show = g.active !== null;
      if (cueRef.current) {
        cueRef.current.style.opacity = show ? '1' : '0';
        cueRef.current.style.transform = `translate(${narrow ? '-50%' : '0'}, ${show ? 0 : 20}px)`;
      }
      if (textRef.current) textRef.current.textContent = inHero && g.active === null ? 'Scroll: see where clinics lose patients' : p > 0.96 ? 'Next' : 'Keep scrolling';
    };
    update();
    const a = scrollY.on('change', update);
    const b = sceneProgress.on('change', update);
    window.addEventListener('resize', update);
    return () => { a(); b(); window.removeEventListener('resize', update); };
  }, [animated, g.active, scrollY]);

  if (!animated) return null;
  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <motion.nav className="chapters" aria-hidden="true" initial={false} animate={{ opacity: g.active !== null ? 1 : 0 }}>
        {CHAPTERS.map((c, i) => (
          <a key={c} className={`${g.active === i ? 'on' : ''} ${i <= g.done ? 'done' : ''}`}>{c}<i /></a>
        ))}
      </motion.nav>
      <div className="cue" ref={cueRef} aria-hidden="true" style={{ opacity: 0, transition: 'opacity 300ms, transform 300ms' }}>
        <motion.span className="cue-nudge" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="ring">
            <motion.span className="halo" animate={{ scale: [1, 1.7], opacity: [0.55, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }} />
            <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" className="track" /><motion.circle cx="18" cy="18" r="15.5" className="fill" strokeDasharray="97.4" style={{ strokeDashoffset: g.active !== null ? dash : 97.4 }} /></svg>
            {/* Two chevrons fall through the ring one after the other: "this way, keep going" */}
            {[0, 1].map((k) => (
              <motion.i key={k} className="chev" style={{ rotate: 45 }} animate={{ y: [-6, 8], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn', delay: k * 0.6, times: [0, 0.4, 1] }} />
            ))}
          </span>
        </motion.span>
        <span ref={textRef}>Scroll: see where clinics lose patients</span>
      </div>
    </>
  );
}
