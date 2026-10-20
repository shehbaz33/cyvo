import { AnimatePresence, motion } from 'motion/react';
import { SECTION_BG, TEAM, type Specialist } from '../data/content';
import { Scene, useIsNarrow, useScene } from '../components/Scene';
import { Backdrop, Drift, SourceTag, Swap, ease, spring } from '../components/ui';

/* Each specialist's beat takes the soft tint of its colour (same tints as the gaps act). */
const TINTS = [SECTION_BG.team, '#eeeffd', '#fcf3d6', '#fcebef', '#f1f2fe', SECTION_BG.team];
const STRIP = ['A team', ...TEAM.map((s) => s.short), 'All covered'];
const STICKERS = ['s-butter', 's-peri', 's-butter', 's-blush'];

function Card({ s, i, enter }: { s: Specialist; i: number; enter: boolean }) {
  return (
    <motion.article className="spec" style={{ ['--tile' as string]: s.colour, transformPerspective: 900 }}
      initial={enter ? { opacity: 0, y: 50, rotateX: 18, scale: 0.92 } : false} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }} transition={spring}>
      <div className="art">
        <span className={`sticker ${STICKERS[i]}`}>Live</span>
        <motion.span className="covered" initial={enter ? { opacity: 0, scale: 0.5 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: enter ? 0.35 : 0 }}>✓ Covered</motion.span>
        <img src={s.img} width={720} height={738} alt={`Illustration: the ${s.title.toLowerCase()}`} loading="lazy" decoding="async" />
      </div>
      <div className="body">
        <h3 className="D">{s.title}</h3>
        <p>{s.job}</p>
        <p style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 600 }}>{s.research}</p>
        <SourceTag id={s.source} />
      </div>
    </motion.article>
  );
}

function Slot({ s }: { s: Specialist }) {
  return (
    <motion.div className="slot" style={{ ['--c' as string]: s.colour }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
      <span className="leak-chip" style={{ ['--c' as string]: s.colour }}><i />{s.gap}</span>
      <span className="leak-state">Not covered yet</span>
    </motion.div>
  );
}

export function Team() {
  return (
    <Scene id="team" chapter={1} steps={6} label="The team: one specialist for each gap" base={SECTION_BG.team}>
      <TeamStage />
    </Scene>
  );
}

function TeamStage() {
  const { step, animated } = useScene();
  const narrow = useIsNarrow(1000);
  const head = step === 0
    ? <h2 className="big-line xl D">Not one chatbot. <em>A team.</em></h2>
    : <h2 className="big-line D" style={{ maxWidth: '30ch' }}>One specialist for each gap.</h2>;

  if (!animated) {
    return (
      <div className="wrap">
        <h2 className="big-line xl D">Not one chatbot. <em>A team.</em></h2>
        <p className="muted" style={{ marginTop: 12 }}>One specialist for each gap, all working on your number.</p>
        <div className="team-row">{TEAM.map((s, i) => <Card key={s.id} s={s} i={i} enter={false} />)}</div>
      </div>
    );
  }

  if (narrow) {
    const cur = step >= 1 ? Math.min(step - 1, 3) : -1;
    return (
      <>
      <Backdrop colors={TINTS} words={STRIP} />
      <div className="wrap">
        <AnimatePresence mode="wait"><Swap k={step === 0 ? 'intro' : 'head'}>{head}</Swap></AnimatePresence>
        <div className="status-row">
          {TEAM.map((s, i) => (
            <motion.span key={s.id} className="leak-chip" style={{ ['--c' as string]: s.colour }} animate={{ borderColor: i < step ? 'var(--color-success)' : 'rgba(20,28,48,0.1)' }}>
              <i />{i < step ? '✓ ' : ''}{s.short}
            </motion.span>
          ))}
        </div>
        <div className="team-stage-mobile">
          <AnimatePresence mode="popLayout">
            {cur >= 0 && step < 5 && <Card key={TEAM[cur].id} s={TEAM[cur]} i={cur} enter />}
            {step === 5 && (
              <motion.div key="all" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring} style={{ position: 'absolute', inset: 0, display: 'grid', alignContent: 'center', gap: 12 }}>
                <img src="/images/team-720.webp" width={720} height={402} alt="" />
                <p className="muted" style={{ fontSize: 15 }}>All four gaps covered. Patients never see these titles. They just see your clinic.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Backdrop colors={TINTS} words={STRIP} />
    <div className="wrap">
      <AnimatePresence mode="wait"><Swap k={step === 0 ? 'intro' : 'head'}>{head}</Swap></AnimatePresence>
      <Drift className="team-row" by={10}>
        {TEAM.map((s, i) => (
          <AnimatePresence mode="wait" key={s.id}>
            {i < step ? <Card key="card" s={s} i={i} enter /> : <Slot key="slot" s={s} />}
          </AnimatePresence>
        ))}
      </Drift>
      <motion.p className="small" style={{ marginTop: 14 }} animate={{ opacity: step === 5 ? 1 : 0 }} transition={{ duration: 0.4, ease }}>
        All four gaps covered. Patients never see these titles. They just see your clinic.
      </motion.p>
    </div>
    </>
  );
}
