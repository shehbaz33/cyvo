import { SECTION_BG } from '../data/content';
import { AnimatePresence, motion, useMotionValueEvent } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { Scene, useIsNarrow, useScene } from '../components/Scene';
import { Backdrop, Bubble, Drift, Swap, ThreadItem, ease, spring } from '../components/ui';

type Mem = { title: string; kind: string; ic: string; c: string };
type Beat = { h: ReactNode; sub: string; items: ReactNode[]; mem?: Mem };

const BEATS: Beat[] = [
  {
    h: <>Tell it once. <em>It remembers.</em></>, sub: 'Type it the way you’d tell your receptionist. Hindi, English, or both.',
    items: [
      <Bubble key="a" from="us" who="You" tr="Clinic is closed tomorrow"><span lang="hi-Latn">Kal clinic band hai</span></Bubble>,
      <Bubble key="b" from="them" who="Cyvo">Noted. 3 patients are booked tomorrow. Move them to Saturday and let them know?</Bubble>,
      <Bubble key="c" from="us" who="You"><span lang="hi-Latn">Haan</span></Bubble>,
      <Bubble key="d" from="them" who="Cyvo">Done. All 3 moved and informed.</Bubble>,
    ],
    mem: { title: 'Closed tomorrow', kind: 'One-off · all four follow it', ic: 'Once', c: 'var(--color-peri)' },
  },
  {
    h: 'Rules, not reminders.', sub: 'Set it once. It holds until you change it.',
    items: [
      <Bubble key="e" from="us" who="You" tr="Don’t take bookings on Saturday between 12 and 3"><span lang="hi-Latn">Saturday ko 12 se 3 booking mat lena</span></Bubble>,
      <Bubble key="f" from="them" who="Cyvo">Got it. No bookings Saturday 12–3 pm.</Bubble>,
    ],
    mem: { title: 'No bookings Sat 12–3 pm', kind: 'Rule', ic: 'Rule', c: 'var(--color-butter)' },
  },
  {
    h: 'It keeps your clinic’s way of working.', sub: 'Slot lengths, fees, which doctor sees what.',
    items: [
      <Bubble key="g" from="us" who="You" tr="Keep 60-minute slots for root canals"><span lang="hi-Latn">Root canal ke liye 60 minute ka slot rakho</span></Bubble>,
      <Bubble key="h" from="them" who="Cyvo">Done. Root canals now get 60 minutes.</Bubble>,
    ],
    mem: { title: 'Root canal = 60 min', kind: 'Standing rule', ic: 'Rule', c: 'var(--color-butter)' },
  },
  {
    h: 'Plan ahead, once.', sub: 'Leave, conferences, festival closures.',
    items: [
      <Bubble key="i" from="us" who="You" tr="I’m on leave 20–24 Dec"><span lang="hi-Latn">20 se 24 Dec main chhutti pe hoon</span></Bubble>,
      <Bubble key="j" from="them" who="Cyvo">Noted. No bookings 20–24 Dec. Patients who ask will be offered the 26th onwards.</Bubble>,
    ],
    mem: { title: 'Leave 20–24 Dec', kind: 'Dated rule', ic: 'Dates', c: 'var(--color-blush)' },
  },
  {
    h: <>Set routines. <em>It runs them for you.</em></>, sub: 'Plain language, any schedule.',
    items: [
      <Bubble key="k" from="us" who="You" tr="Every night at 10, send me tomorrow’s bookings"><span lang="hi-Latn">Roz raat 10 baje kal ki bookings bhejo</span></Bubble>,
      <Bubble key="l" from="them" who="Cyvo">Done. Every night at 10 pm.</Bubble>,
    ],
    mem: { title: 'Every night 10 pm · tomorrow’s bookings', kind: 'Routine', ic: 'Daily', c: 'var(--color-peri-soft)' },
  },
  {
    h: '10 pm. Right on time.', sub: 'Your routine, delivered while you’re at home.',
    items: [
      <ThreadItem key="m" className="divider">10:00 pm</ThreadItem>,
      <Bubble key="n" from="them" who="Cyvo · nightly routine">Tomorrow, Saturday: 14 bookings. First at 10:00 am. 2 new patients. 12–3 pm blocked, as you asked.</Bubble>,
    ],
  },
  {
    h: 'Every Sunday, your report card.', sub: 'A routine that’s on from day one.',
    items: [
      <ThreadItem key="o" className="divider">Sun 9:00 am</ThreadItem>,
      <ThreadItem key="p" className="msg us report">
        <small>Cyvo · weekly report · sample</small>
        <span className="line"><span>Appointments booked</span><b>46</b></span>
        <span className="line"><span>Of them after hours</span><b>17</b></span>
        <span className="line"><span>Reminders confirmed</span><b>41</b></span>
        <span className="line"><span>Review requests sent</span><b>38</b></span>
        <span className="line" style={{ border: 0 }}><span>Follow-ups booked</span><b>8</b></span>
      </ThreadItem>,
    ],
    mem: { title: 'Every Sunday 9 am · report card', kind: 'Routine · on by default', ic: 'Weekly', c: 'var(--color-peri-soft)' },
  },
];
const STEPS = BEATS.length + 1; // last beat: the receptionist
/* One soft tint per beat, matching the colour of the memory card it adds. */
const TINTS = ['#eeeffd', '#fcf3d6', '#fcf3d6', '#fcebef', '#f1f2fe', '#f1f2fe', '#f1f2fe', SECTION_BG.rules];
const STRIP = ['Tell it once', 'Rules', 'Your way', 'Plan ahead', 'Routines', '10 pm', 'Sunday', 'Your receptionist'];
const ROUTINES = ['Every Monday 9 am: last week’s no-shows', 'Every evening: patients who asked for a call back', '1st of the month: follow-ups due'];

function MemCard({ m, enter }: { m: Mem; enter: boolean }) {
  return (
    <motion.div className="mem" style={{ ['--c' as string]: m.c }} layout={enter ? 'position' : false}
      initial={enter ? { opacity: 0, x: 40, scale: 0.9 } : false} animate={{ opacity: 1, x: 0, scale: 1 }} transition={spring}>
      <span className="ic" style={{ font: '700 9.5px/1 var(--font-text)', textTransform: 'uppercase' }}>{m.ic}</span>
      <span><b>{m.title}</b><small>{m.kind}</small></span>
    </motion.div>
  );
}

function Words({ text }: { text: string }) {
  const { progress, steps } = useScene();
  const words = text.split(' ');
  const [lit, setLit] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => {
    const local = Math.min(1, Math.max(0, v * steps - (steps - 1)));
    setLit(Math.round(Math.min(1, local * 1.4) * words.length));
  });
  return (
    <p className="big-line D words" style={{ maxWidth: '18ch', marginTop: 16 }} aria-label={text}>
      {words.map((w, i) => (
        <motion.span key={i} className="w" aria-hidden="true" animate={{ opacity: i < lit ? 1 : 0.15 }} transition={{ duration: 0.2 }}>{w}&nbsp;</motion.span>
      ))}
    </p>
  );
}

function Receptionist({ animated }: { animated: boolean }) {
  return (
    <div className="split">
      <div>
        <h2 className="big-line D">Your receptionist gets a team, <em>not a replacement.</em></h2>
        {animated ? <Words text="She handles the people. The team handles everything else." /> : <p className="big-line D" style={{ marginTop: 16 }}>She handles the people. The team handles everything else.</p>}
      </div>
      <motion.div className="needs" initial={animated ? { opacity: 0, y: 30 } : false} animate={{ opacity: 1, y: 0 }} transition={spring}>
        <header>Needs you <span className="count">2</span></header>
        <ul>
          <li><p>Asks about treatment cost<small>Patient · 10:52 pm</small></p><span className="take">Take over</span></li>
          <li><p>Wants to speak to the doctor<small>Patient · 7:40 am</small></p><span className="take">Take over</span></li>
        </ul>
        <p className="small" style={{ marginTop: 8 }}>Everything routine is done. What needs a person waits for her. Sample.</p>
      </motion.div>
    </div>
  );
}

export function Rules() {
  return (
    <Scene id="rules" chapter={2} steps={STEPS} label="Your rules: it remembers what you tell it and runs routines" base={SECTION_BG.rules}>
      <RulesStage />
    </Scene>
  );
}

function RulesStage() {
  const { step, animated } = useScene();
  const narrow = useIsNarrow();

  if (!animated) {
    return (
      <div className="wrap">
        <p className="eyebrow">Your rules</p>
        <div className="split" style={{ marginTop: 14, alignItems: 'start' }}>
          <div>
            <h2 className="big-line D">Tell it once. <em>It remembers.</em> Set routines. <em>It runs them.</em></h2>
            <div className="phone" style={{ marginTop: 20 }}><div className="phone-top">Your WhatsApp <span className="D">Cyvo</span></div><div className="thread">{BEATS.flatMap((b) => b.items)}</div></div>
          </div>
          <div className="memory"><header>What the team remembers</header><div className="mem-list">{BEATS.filter((b) => b.mem).map((b) => <MemCard key={b.mem!.title} m={b.mem!} enter={false} />)}</div>
            <p className="small" style={{ marginTop: 10 }}>More routines: {ROUTINES.join(' · ')}</p></div>
        </div>
        <div className="static-beat"><Receptionist animated={false} /></div>
      </div>
    );
  }

  const backdrop = <Backdrop colors={TINTS} words={STRIP} />;
  if (step === STEPS - 1) {
    return <>{backdrop}<div className="wrap"><p className="eyebrow">Your rules</p><div style={{ marginTop: 14 }}><Receptionist animated /></div></div></>;
  }

  const shown = BEATS.slice(0, step + 1);
  const items = shown.flatMap((b) => b.items);
  const mems = shown.filter((b) => b.mem).map((b) => b.mem!);
  const b = BEATS[step];

  return (
    <>
    {backdrop}
    <div className="wrap">
      <p className="eyebrow">Your rules</p>
      <div className="split" style={{ marginTop: 14 }}>
        <div>
          <AnimatePresence mode="wait">
            <Swap k={step}>
              <h2 className="big-line D">{b.h}</h2>
              <p className="muted" style={{ marginTop: 10 }}>{b.sub}</p>
            </Swap>
          </AnimatePresence>
          <div className="phone" style={{ marginTop: 18, ['--thread-h' as string]: narrow ? 'clamp(190px, 33vh, 300px)' : 'clamp(260px, 40vh, 400px)' }}>
            <div className="phone-top">Your WhatsApp <span className="D">Cyvo</span></div>
            <div className="thread">{items}</div>
          </div>
          {narrow && <div className="mem-strip">{mems.slice(-2).reverse().map((m) => <MemCard key={m.title} m={m} enter />)}</div>}
        </div>
        {!narrow && (
          <Drift className="memory" by={30}>
            <header>What the team remembers <span>{mems.length} saved</span></header>
            <div className="mem-list">{mems.map((m) => <MemCard key={m.title} m={m} enter />)}</div>
            <motion.p className="small" style={{ marginTop: 10 }} initial={false} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: 0.4, ease }}>
              More routines: {ROUTINES.join(' · ')}
            </motion.p>
          </Drift>
        )}
      </div>
    </div>
    </>
  );
}
