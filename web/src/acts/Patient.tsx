import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { SECTION_BG, TEAM } from '../data/content';
import { Scene, useIsNarrow, useScene } from '../components/Scene';
import { Backdrop, Bubble, Swap, ThreadItem, spring } from '../components/ui';

const STOPS = [
  { name: 'Enquiry', spec: 0, bg: '#e8e9fc', time: 'Sun · 10:41 pm', h: 'She messages at night. Cyvo answers.' },
  { name: 'Reminders', spec: 1, bg: '#fbf0c9', time: 'Wed & Fri · 7 pm', h: 'Two reminders. She confirms with one tap.' },
  { name: 'Visit', spec: -1, bg: '#fbf6f4', time: 'Sat · 11:00 am', h: 'She comes in. Your receptionist greets her.' },
  { name: 'Review', spec: 2, bg: '#fbe4ea', time: 'Sat · 1:15 pm', h: 'After the visit, she’s asked for a review.' },
  { name: 'Recall', spec: 3, bg: '#eef0fd', time: '6 months later', h: 'Her follow-up is due. She comes back.' },
];
const STOP_OF = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4];
const TINTS = [...STOP_OF.slice(0, -1).map((i) => STOPS[i].bg), SECTION_BG.patient];
const STRIP = [...STOPS.map((s) => s.name), 'Every time'];
const FD = 'Front desk specialist', RM = 'Reminder specialist', RV = 'Reviews specialist', RC = 'Recall specialist';

const ITEMS: ReactNode[][] = [
  [<ThreadItem key="d0" className="divider">Sun 10:41 pm</ThreadItem>, <Bubble key="p0" from="them" who="Priya">Hi, can I come in this week?</Bubble>],
  [<Bubble key="f1" from="us" who={FD}>Of course. Saturday has:<span className="chips"><span>11:00 am</span><span>3:30 pm</span><span>5:00 pm</span></span></Bubble>,
   <ThreadItem key="r1" className="rule-chip">Skipped 12–3 pm: your rule</ThreadItem>],
  [<Bubble key="p2" from="them" who="Priya">11 please</Bubble>, <Bubble key="f2" from="us" who={FD}>Booked: Saturday, 11:00 am.</Bubble>],
  [<ThreadItem key="d3" className="divider">Wed 7:00 pm · 3 days before</ThreadItem>,
   <Bubble key="m3" from="us" who={RM}>Reminder: Saturday 11:00 am at Sample Clinic. Reply 1 to confirm, 2 to change.</Bubble>, <Bubble key="p3" from="them" who="Priya">1</Bubble>],
  [<ThreadItem key="d4" className="divider">Fri 7:00 pm · day before</ThreadItem>, <Bubble key="m4" from="us" who={RM}>See you tomorrow at 11:00 am.</Bubble>],
  [<ThreadItem key="d5" className="divider">Sat 11:00 am</ThreadItem>, <ThreadItem key="v5" className="visit-stamp">Visited ✓</ThreadItem>],
  [<ThreadItem key="d6" className="divider">Sat 1:15 pm</ThreadItem>,
   <Bubble key="v6" from="us" who={RV}>Thank you for visiting today, Priya. If you have a minute, please share your experience on Google.<span className="chips"><span className="on">Write a review on Google</span></span></Bubble>],
  [<ThreadItem key="d7" className="divider">Mon 11:00 am · one gentle follow-up</ThreadItem>, <Bubble key="v7" from="us" who={RV}>Just a gentle reminder, only if you’d like to.</Bubble>],
  [<Bubble key="p8" from="them" who="Priya">Done. Thank you!</Bubble>, <ThreadItem key="n8" className="note">Every patient is asked, not only the happy ones. No incentives, ever.</ThreadItem>],
  [<ThreadItem key="d9" className="divider">6 months later</ThreadItem>,
   <Bubble key="c9" from="us" who={RC}>Hi Priya, your follow-up is due. Would next week work?<span className="chips"><span>Tue 11:00 am</span><span>Thu 5:00 pm</span></span></Bubble>],
  [<Bubble key="p10" from="them" who="Priya">Thursday 5 pm</Bubble>, <Bubble key="c10" from="us" who={RC}>Booked: Thursday, 5:00 pm. We’ll remind you the day before.</Bubble>],
  [],
];

function Journey({ stop, done }: { stop: number; done: boolean }) {
  const spec = STOPS[stop].spec;
  return (
    <div className="journey" aria-label={`Patient journey, now at: ${STOPS[stop].name}`}>
      <div className="journey-line"><motion.div className="journey-fill" initial={false} animate={{ scaleX: done ? 1 : stop / 4 }} transition={spring} /></div>
      <div className="stops">
        {STOPS.map((s, i) => (
          <div key={s.name} className={`stop ${i < stop || done ? 'done' : ''} ${i === stop && !done ? 'on' : ''}`} style={{ ['--c' as string]: s.spec >= 0 ? TEAM[s.spec].colour : 'var(--color-surface)' }}>
            <i>{i < stop || done ? '✓' : ''}</i><span>{s.name}</span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {spec >= 0 && !done && (
          <motion.span key="av" className="journey-avatar" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, left: `calc(12px + (100% - 24px) * ${stop / 4})` }} exit={{ opacity: 0, scale: 0.5 }} transition={spring}>
            <AnimatePresence mode="popLayout"><motion.img key={spec} src={TEAM[spec].thumb} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Patient() {
  return (
    <Scene id="patient" chapter={3} steps={ITEMS.length} label="One patient, four specialists" base={SECTION_BG.patient}>
      <PatientStage />
    </Scene>
  );
}

function PatientStage() {
  const { step, animated } = useScene();
  const narrow = useIsNarrow();
  const stop = STOP_OF[step];
  const done = step === ITEMS.length - 1;
  const s = STOPS[stop];
  const spec = s.spec >= 0 ? TEAM[s.spec] : null;

  if (!animated) {
    return (
      <div className="wrap">
        <p className="eyebrow">One patient · four specialists · Sample clinic, invented patient</p>
        <h2 className="big-line D" style={{ marginTop: 12 }}>One patient. Four specialists. <em>Your rules, every time.</em></h2>
        <div className="split" style={{ marginTop: 20, alignItems: 'start' }}>
          <ol style={{ paddingLeft: 20, display: 'grid', gap: 10 }}>{STOPS.map((st) => <li key={st.name}><b>{st.time}</b>: {st.h}</li>)}</ol>
          <div className="phone"><div className="phone-top">Sample clinic <span className="D">Priya</span></div><div className="thread">{ITEMS.flat()}</div></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Backdrop colors={TINTS} words={STRIP} />
      <div className="wrap fill">
        <p className="eyebrow">One patient · four specialists</p>
        <div style={{ marginTop: narrow ? 30 : 40 }}><Journey stop={stop} done={done} /></div>
        <div className="split grow">
          <div>
            <AnimatePresence mode="wait">
              <Swap k={done ? 'done' : stop}>
                {done ? (
                  <h2 className="big-line xl D">One patient. Four specialists. <em>Your rules, every time.</em></h2>
                ) : (
                  <>
                    {spec && !narrow && <div className="who"><img src={spec.thumb} alt="" /><p>{spec.title}<br /><span className="live">Live</span></p></div>}
                    <p className="time-big D" style={{ marginTop: spec && !narrow ? 12 : 0 }}>{s.time}</p>
                    <h2 className="big-line patient-h D" style={{ marginTop: 8, maxWidth: '18ch' }}>{s.h}</h2>
                  </>
                )}
              </Swap>
            </AnimatePresence>
          </div>
          <div className="phone grow" style={{ ['--thread-h' as string]: 'clamp(280px, 46vh, 460px)' }}>
            <div className="phone-top">Sample clinic <span className="D">Priya</span></div>
            <div className="thread">{ITEMS.slice(0, step + 1).flat()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
