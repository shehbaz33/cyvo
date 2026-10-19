import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { TEAM, type SourceId } from '../data/content';
import { Scene, useIsNarrow, useScene } from '../components/Scene';
import { Counter, SourceTag, Swap, ease, spring } from '../components/ui';

/* ---------- Beats ----------
   Each beat leads with ONE big number (the research finding) and one visual. */
type Visual = 'clock-open' | 'clock-msgs' | 'clock-leave' | 'appts' | 'reviews' | 'calendar' | 'end';
type Beat = {
  leak: number | null;          // which of the four leaks this beat reveals (index into TEAM)
  frame: ReactNode;             // framing headline
  stat?: { to: number; prefix?: string; suffix?: string };
  meaning: ReactNode;           // what the number means, in big dark text
  src?: SourceId[];
  visual: Visual;
  tint: string;
};
const BEATS: Beat[] = [
  { leak: null, frame: 'Your clinic is open', stat: { to: 10, suffix: ' hours' }, meaning: <>a day. Patients message for all <b>24</b>.</>, visual: 'clock-open', tint: '#fbf6f4' },
  { leak: 0, frame: 'Patients don’t keep your hours.', stat: { to: 4, suffix: ' in 10' }, meaning: 'doctor appointments are booked between 5 pm and 9 am, when most clinics are closed.', src: ['R1'], visual: 'clock-msgs', tint: '#eeeffd' },
  { leak: 0, frame: 'And they don’t wait.', stat: { to: 7, suffix: '×' }, meaning: 'more likely to reach a customer if you reply within the hour, compared with an hour later.', src: ['R2'], visual: 'clock-leave', tint: '#eeeffd' },
  { leak: 1, frame: 'The ones who book still forget.', stat: { to: 39, suffix: ' in 100' }, meaning: 'patients missed their appointment in one Indian dental hospital study.', src: ['R3'], visual: 'appts', tint: '#fcf3d6' },
  { leak: 2, frame: 'Happy patients stay quiet.', stat: { to: 2, suffix: ' in 3' }, meaning: 'people leave a review when they’re asked. Most never are. And most patients read reviews before choosing a doctor.', src: ['R7', 'R9'], visual: 'reviews', tint: '#fcebef' },
  { leak: 3, frame: 'Patients who are due back drift away.', stat: { to: 6, suffix: ' months' }, meaning: 'go by, and the follow-up nobody reminded them about never happens.', visual: 'calendar', tint: '#f1f2fe' },
  { leak: null, frame: <>Four leaks. <em>Every clinic has them.</em></>, meaning: 'Most clinics don’t have the hands to fix them. Yours doesn’t need more hands.', visual: 'end', tint: '#fbf6f4' },
];
const TRACK_LABELS = ['Missed enquiries', 'No-shows', 'Reviews', 'Follow-ups'];

/* ---------- 24-hour clock ---------- */
const OPEN: [number, number] = [10, 20];
const MSGS = [7.2, 8.6, 9.4, 10.5, 11.8, 13.2, 15, 16.4, 17.6, 18.9, 19.7, 20.4, 21.1, 21.8, 22.5, 23.3, 0.6, 6.4];
const isOut = (h: number) => h < OPEN[0] || h >= OPEN[1];
const OUT_COUNT = MSGS.filter(isOut).length;
const C = 160, R = 120;
const pt = (h: number, r = R) => {
  const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const arc = (h1: number, h2: number, r = R) => {
  const [x1, y1] = pt(h1, r), [x2, y2] = pt(h2, r);
  const large = ((h2 - h1 + 24) % 24) > 12 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

function Clock({ mode }: { mode: 'open' | 'msgs' | 'leave' }) {
  const { animated } = useScene();
  const center =
    mode === 'open' ? { big: '10 hrs', small: 'open' } :
    mode === 'msgs' ? { big: `${OUT_COUNT} of ${MSGS.length}`, small: 'messages after hours' } :
                      { big: `${OUT_COUNT}`, small: 'unanswered · gone elsewhere' };
  return (
    <div className="clock" role="img" aria-label="A 24-hour clock: the clinic is open 10 am to 8 pm; many patient messages arrive after hours and go unanswered.">
      <svg viewBox="0 0 320 320">
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="26" />
        <motion.path d={arc(OPEN[1], OPEN[0])} fill="none" stroke="var(--color-accent-bright)" strokeWidth="26" strokeOpacity="0.25"
          initial={false} animate={{ opacity: mode === 'open' ? 0 : 1 }} transition={{ duration: 0.5 }} />
        <motion.path d={arc(OPEN[0], OPEN[1])} fill="none" stroke="var(--color-text)" strokeWidth="26"
          initial={animated ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
        {[0, 6, 12, 18].map((h, i) => {
          const [x, y] = pt(h, R + 32);
          return <text key={h} x={x} y={y + 4} textAnchor="middle" className="clock-tick">{['12 am', '6 am', '12 pm', '6 pm'][i]}</text>;
        })}
        {mode !== 'open' && MSGS.map((h, i) => {
          const out = isOut(h);
          const [x, y] = pt(h);
          const [ox, oy] = pt(h, R + 64);
          const leaving = mode === 'leave' && out;
          return (
            <motion.circle key={h} r="8" fill={out ? 'var(--color-accent-bright)' : 'var(--color-peri)'} stroke="#fff" strokeWidth="3"
              initial={animated ? { cx: ox, cy: oy, opacity: 0 } : false}
              animate={leaving ? { cx: ox, cy: oy, opacity: 0 } : { cx: x, cy: y, opacity: 1 }}
              transition={{ ...spring, delay: animated ? i * (leaving ? 0.04 : 0.06) : 0 }} />
          );
        })}
      </svg>
      <div className="clock-center">
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={animated ? { opacity: 0, scale: 0.8 } : false} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={spring}>
            <b className="D">{center.big}</b><span>{center.small}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="clock-legend">
        <span><i style={{ background: 'var(--color-text)' }} />Clinic open</span>
        {mode !== 'open' && <span><i style={{ background: 'var(--color-accent-bright)' }} />After hours</span>}
      </div>
    </div>
  );
}

/* ---------- Other leak visuals ---------- */
const MISSED = [1, 4, 6, 9];
function Appts() {
  const { animated } = useScene();
  return (
    <div className="appts" role="img" aria-label="Ten appointments; four are no-shows">
      {Array.from({ length: 10 }, (_, i) => {
        const m = MISSED.includes(i);
        const d = MISSED.indexOf(i);
        return (
          <motion.div key={i} className={`appt-card ${m ? 'missed' : ''}`} initial={animated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: animated ? i * 0.05 : 0 }}>
            <span className="appt-time D">{`${9 + i}:00`}</span>
            <span className="appt-who">Patient</span>
            {m && <motion.span className="appt-x" initial={animated ? { scaleX: 0 } : false} animate={{ scaleX: 1 }} transition={{ duration: 0.4, ease, delay: animated ? 0.6 + d * 0.18 : 0 }} />}
            {m && <motion.span className="appt-tag" initial={animated ? { opacity: 0, scale: 0.6 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: animated ? 0.8 + d * 0.18 : 0 }}>No-show</motion.span>}
          </motion.div>
        );
      })}
    </div>
  );
}

function Reviews() {
  const { animated } = useScene();
  return (
    <div className="reviewers" role="img" aria-label="Three patients are asked for a review; two leave one">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="reviewer" initial={animated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: animated ? i * 0.12 : 0 }}>
          <svg viewBox="0 0 64 64" className="person" aria-hidden="true"><circle cx="32" cy="22" r="11" /><path d="M12 58c2-12 10-18 20-18s18 6 20 18" /></svg>
          <motion.span className="ask" initial={animated ? { opacity: 0, scale: 0.6 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: animated ? 0.5 + i * 0.15 : 0 }}>Asked</motion.span>
          {i < 2 ? (
            <motion.span className="did" initial={animated ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: animated ? 1 + i * 0.2 : 0 }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" /></svg>Reviewed
            </motion.span>
          ) : <motion.span className="did no" initial={animated ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: animated ? 1.4 : 0 }}>Not this time</motion.span>}
        </motion.div>
      ))}
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
function Calendar() {
  const { animated } = useScene();
  const [m, setM] = useState(6);
  useEffect(() => {
    if (!animated) return;
    setM(0);
    const t = setInterval(() => setM((v) => (v < 6 ? v + 1 : v)), 340);
    return () => clearInterval(t);
  }, [animated]);
  return (
    <div className="cal-wrap" role="img" aria-label="Six months pass and the follow-up is missed">
      <div className="calendar big">
        <b>Follow-up due</b>
        <AnimatePresence mode="popLayout">
          <motion.span key={m} className="D" style={{ transformPerspective: 500 }} initial={animated ? { rotateX: -90, opacity: 0 } : false} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.22 }}>
            {MONTHS[m]}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.p className="cal-note" initial={false} animate={{ opacity: m === 6 ? 1 : 0, y: m === 6 ? 0 : 8 }}>No reminder. No visit.</motion.p>
    </div>
  );
}

const END_STATS = ['4 in 10 bookings after hours', '39 in 100 missed', '2 in 3 review, if asked', 'Follow-ups slip'];
function EndCards() {
  const { animated } = useScene();
  return (
    <div className="leak-cards">
      {TEAM.map((s, i) => (
        <motion.div key={s.id} className="leak-card" style={{ ['--c' as string]: s.colour }} initial={animated ? { opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 } : false} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ ...spring, delay: animated ? i * 0.1 : 0 }}>
          <span className="leak-num D">{i + 1}</span>
          <b>{s.leak}</b>
          <span>{END_STATS[i]}</span>
          <motion.i className="drip" animate={animated ? { y: [0, 8, 0], opacity: [1, 0.35, 1] } : undefined} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }} />
        </motion.div>
      ))}
    </div>
  );
}

function VisualFor({ v }: { v: Visual }) {
  if (v === 'clock-open') return <Clock mode="open" />;
  if (v === 'clock-msgs') return <Clock mode="msgs" />;
  if (v === 'clock-leave') return <Clock mode="leave" />;
  if (v === 'appts') return <Appts />;
  if (v === 'reviews') return <Reviews />;
  if (v === 'calendar') return <Calendar />;
  return <EndCards />;
}
const visualKey = (v: Visual) => (v.startsWith('clock') ? 'clock' : v);

/* ---------- Left column ---------- */
function BeatText({ b }: { b: Beat }) {
  const s = b.leak !== null ? TEAM[b.leak] : null;
  return (
    <>
      {s ? <span className="leak-badge" style={{ ['--c' as string]: s.colour }}><i />Leak {b.leak! + 1} of 4 · {TRACK_LABELS[b.leak!]}</span>
         : <span className="leak-badge plain">Where clinics lose patients</span>}
      <h2 className={`leak-frame D ${b.visual === 'end' ? 'xl' : ''}`}>{b.frame}</h2>
      {b.stat && <p className="leak-stat D"><Counter to={b.stat.to} prefix={b.stat.prefix} suffix={b.stat.suffix} /></p>}
      <p className="leak-meaning">{b.meaning}</p>
      {b.src?.map((id) => <SourceTag key={id} id={id} />)}
    </>
  );
}

function Tracker({ step }: { step: number }) {
  const found = (i: number) => step === BEATS.length - 1 || BEATS.slice(0, step + 1).some((b) => b.leak === i);
  return (
    <div className="tracker" aria-hidden="true">
      {TEAM.map((s, i) => (
        <div key={s.id} className={`tseg ${found(i) ? 'on' : ''} ${BEATS[step].leak === i ? 'cur' : ''}`} style={{ ['--c' as string]: s.colour }}>
          <span className="tbar"><motion.i initial={false} animate={{ scaleX: found(i) ? 1 : 0 }} transition={{ duration: 0.6, ease }} /></span>
          <span className="tlabel">{i + 1} · {TRACK_LABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Leak() {
  return (
    <Scene id="leak" chapter={0} steps={BEATS.length} label="The leak: where clinics lose patients">
      <LeakStage />
    </Scene>
  );
}

function LeakStage() {
  const { step, animated } = useScene();
  const narrow = useIsNarrow();

  if (!animated) {
    return (
      <div className="wrap">
        {BEATS.map((b, i) => (
          <div className="static-beat split leak-split" key={i}>
            <div><BeatText b={b} /></div>
            <div className="leak-visual"><VisualFor v={b.visual} /></div>
          </div>
        ))}
      </div>
    );
  }

  const b = BEATS[step];
  return (
    <>
      <motion.div className="stage-bg" initial={false} animate={{ backgroundColor: b.tint }} transition={{ duration: 0.6 }} />
      <div className="wrap">
        <div className="split leak-split">
          <div className="leak-text">
            <AnimatePresence mode="wait"><Swap k={step}><BeatText b={b} /></Swap></AnimatePresence>
          </div>
          <div className="leak-visual">
            <AnimatePresence mode="wait">
              <motion.div key={visualKey(b.visual)} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.4, ease }}>
                <VisualFor v={b.visual} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {!(narrow && b.visual === 'end') && <Tracker step={step} />}
      </div>
    </>
  );
}
