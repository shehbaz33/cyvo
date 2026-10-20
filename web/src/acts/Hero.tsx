import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { MESSAGES, TEAM, waLink } from '../data/content';
import { track } from '../vitals/api';
import { useAnimated } from '../components/Scene';
import { SAMPLE } from './Impact';

const inr = (n: number) => Math.round(n).toLocaleString('en-IN');

/* The clinic's recurring to-dos (every day, so monthly values make sense): one per specialist, in the page's fixed gap order and colours.
   Values are the sample clinic's monthly estimates from the Impact act; the rupee ones add up to the total. */
const TODOS = [
  { team: 0, task: 'Answer night enquiries and book', rupees: SAMPLE.enquiries },
  { team: 1, task: 'Remind every patient, twice', rupees: SAMPLE.noShows },
  { team: 2, task: 'Ask every patient for a review', rupees: 0, label: `+${SAMPLE.reviews} reviews` },
  { team: 3, task: 'Bring back patients who are due', rupees: SAMPLE.followUps },
];

/* First screen: one idea (the clinic runs itself), one action, and the to-do list doing itself on the right.
   Copy entrances are plain CSS (hero-rise / hero-in with a delay), so they appear before the scripts load. */
export function Hero() {
  const at = (delay: number) => ({ style: { animationDelay: `${delay}s` } });
  // Highlighter colour per phrase: the four specialists, then the accent for "remembers your rules"
  // (the recall colour is too pale to show on cream, so its highlight uses a deeper lavender)
  const hl = (i: number, delay: number) => ({ ['--c' as string]: i === 3 ? '#b9bdf4' : i < 4 ? TEAM[i].colour : 'var(--color-accent-bright)', animationDelay: `${delay}s` });
  return (
    <div className="wrap">
      <nav className="nav" aria-label="Main">
        <a className="wordmark D" href="/" aria-label="Cyvo home">cyvo<span>.</span></a>
        <a className="nav-btn" href={waLink(MESSAGES.hero)}>Message us</a>
      </nav>

      <header className="hero">
        <div className="hero-copy">
          <h1 className="D">
            <span className="line"><span className="hero-rise" {...at(0.1)}>The clinic that</span></span>
            <span className="line"><span className="hero-rise" {...at(0.2)}><mark className="hero-mark">runs itself.</mark></span></span>
          </h1>
          {/* The five things it does, highlighted one after another in each specialist's colour, so a skimmer reads them */}
          <p className="sub hero-in" {...at(0.35)}>
            Cyvo is your clinic’s personal assistant on WhatsApp. It{' '}
            <mark className="hl" style={hl(0, 0.9)}>answers patients at 11 pm</mark>,{' '}
            <mark className="hl" style={hl(1, 1.3)}>cuts no‑shows</mark>,{' '}
            <mark className="hl" style={hl(2, 1.7)}>collects reviews</mark>,{' '}
            <mark className="hl" style={hl(3, 2.1)}>brings patients back</mark> and{' '}
            <mark className="hl" style={hl(4, 2.5)}>remembers your rules</mark>. You just watch.
          </p>
          <div className="hero-cta hero-in" {...at(0.45)}>
            <a className="btn" href={waLink(MESSAGES.hero)} onClick={() => track('hero_demo', 'home')}>Book a 5-minute demo</a>
            <a className="hero-link" href="/vitals.html?src=lp" onClick={() => track('hero_check', 'home')}>or see how many patients you’re losing →</a>
          </div>
          <p className="hero-trust hero-in" {...at(0.55)}>
            <span className="avatar" aria-hidden="true">S</span>
            <span>Set up in person by <b>Shehbaz</b>, Mumbai. 7+ years building AI systems; scaled software past $1M a year.</span>
          </p>
        </div>

        <div className="hero-visual hero-in" {...at(0.4)}>
          <TodoCard />
        </div>
      </header>
      <p className="hint"><span className="hint-dot" aria-hidden="true" /><span className="hint-text">Scroll: see where clinics lose&nbsp;patients&nbsp;<span className="hint-arrow" aria-hidden="true">↓</span></span></p>
    </div>
  );
}

/* The to-do list that does itself: each specialist takes a task ("on it…"), ticks it, a highlighter in their colour
   strikes it through, and its value joins the running total. It loops. The server render, no-JS and reduced motion
   show the finished list. */
const STEP = 1500; // ms per to-do
function TodoCard() {
  const animated = useAnimated();
  const reduce = useReducedMotion();
  const live = animated && !reduce;
  const [tick, setTick] = useState(-1); // -1 = finished list (server / no-JS / reduced motion)

  useEffect(() => {
    if (!live) { setTick(-1); return; }
    const cycle = TODOS.length * 2 + 4; // half-steps: working, done… then a pause on the full list
    let t = 0;
    setTick(0);
    const id = window.setInterval(() => { t = (t + 1) % cycle; setTick(t); }, STEP / 2);
    return () => window.clearInterval(id);
  }, [live]);

  // Each to-do: working at half-step 2i, done at 2i+1.
  const state = (i: number): 'todo' | 'working' | 'done' => {
    if (tick < 0) return 'done';
    if (tick >= 2 * i + 1) return 'done';
    if (tick === 2 * i) return 'working';
    return 'todo';
  };
  const total = TODOS.reduce((s, o, i) => s + (state(i) === 'done' ? o.rupees : 0), 0);

  return (
    <div className="td-wrap">
    {/* The four specialists as round portraits around the card: the one on a task grows with a pulsing ring,
        and a tick badge pops on when their task is done. Decorative: the card itself says who did what. */}
    {TODOS.map((o, i) => {
      const sp = TEAM[o.team];
      return (
        <span key={sp.id} className={`td-motif m${i} ${state(i)}`} style={{ ['--c' as string]: sp.colour, animationDelay: `${-i * 1.1}s` }} aria-hidden="true">
          <span className="td-motif-in"><img src={sp.thumb} alt="" width={72} height={72} /><i>✓</i></span>
        </span>
      );
    })}
    <div className="td" role="figure" aria-label={`Sample clinic: Cyvo's four specialists finish today's to-dos, worth about ₹${inr(SAMPLE.total)} a month`}>
      <div className="td-top">
        <div>
          <b>Your clinic’s to-do list</b>
          <small>Done every day, on their own</small>
        </div>
      </div>

      <ul className="td-list">
        {TODOS.map((o, i) => {
          const s = TEAM[o.team];
          const st = state(i);
          return (
            <li key={s.id} className={`td-item ${st}`} style={{ ['--c' as string]: s.colour }}>
              <span className="td-box" aria-hidden="true">✓</span>
              <div className="td-text">
                <p><span className="td-task">{o.task}</span></p>
                <small className="td-who">
                  <img src={s.thumb} alt="" width={18} height={18} />
                  {s.title}{st === 'working' ? ' is on it…' : st === 'done' ? ': done' : ''}
                </small>
              </div>
              <span className="td-val">{o.label ?? `+₹${inr(o.rupees)}`}<small>/mo</small></span>
            </li>
          );
        })}
      </ul>

      <div className="td-total">
        <span>Back every month</span>
        <Total value={total} />
      </div>
      <p className="td-note">Sample clinic: 20 patients a day, ₹1,500 a visit. Research-based estimate. <a href="#impact">See the maths ↓</a></p>
    </div>
    </div>
  );
}

/* Counts to the new sum whenever a to-do is done; lands exactly on the value. */
function Total({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const last = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(last.current, value, { duration: 0.35, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => { el.textContent = `₹${inr(v)}`; } });
    last.current = value;
    return () => c.stop();
  }, [value]);
  return <b className="D" ref={ref}>₹{inr(value)}</b>;
}
