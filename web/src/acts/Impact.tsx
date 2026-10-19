import { AnimatePresence, motion } from 'motion/react';
import { MESSAGES, SOURCES, SOURCE_ORDER, TEAM, waLink, type SourceId } from '../data/content';
import { Scene, useScene } from '../components/Scene';
import { Counter, SourceTag, Swap, ease, spring } from '../components/ui';

/* Sample-clinic arithmetic built on the research (STORY-SCRIPT.md Act 5). Estimates, not results. */
type Stat = { leak: string; bg: string; to: number; prefix?: string; suffix?: string; what: string; how: string; src: SourceId[]; specs: number[] };
const STATS: Stat[] = [
  { leak: 'Missed enquiries', bg: '#e8e9fc', to: 22500, prefix: '₹', what: 'From new patients who would have gone elsewhere', how: '300 after-hours messages a month. If 1 in 5 is a new patient wanting to book, and a reply within minutes keeps 1 in 4 of them: 15 new patients × ₹1,500.', src: ['R1', 'R2'], specs: [0] },
  { leak: 'No-shows', bg: '#fbf0c9', to: 63000, prefix: '₹', what: 'From patients who actually turn up', how: '520 booked visits a month, 1 in 5 missed. Reminders lift attendance about 10% (from 80% to 88%), and a second reminder helps more: about 42 more visits × ₹1,500.', src: ['R4', 'R5'], specs: [1] },
  { leak: 'Reviews', bg: '#fbe4ea', to: 50, suffix: '+', what: 'New Google reviews every month', how: 'All 520 patients asked after their visit. Even if only 1 in 10 posts a review (surveys say up to 2 in 3 will when asked). Google says more reviews can help your local ranking.', src: ['R7', 'R8'], specs: [2] },
  { leak: 'Follow-ups', bg: '#eef0fd', to: 18000, prefix: '₹', what: 'From patients brought back for their check-up', how: '150 patients due for a check-up each month × about 8 in 100 more coming back when reminded = 12 visits × ₹1,500.', src: ['R11'], specs: [3] },
  { leak: 'Your receptionist', bg: '#fbf6f4', to: 50, suffix: ' hrs', what: 'Of your receptionist’s time back every month', how: '750 WhatsApp messages at about 3 minutes each, plus 520 reminder calls at about 2 minutes each. Assumption.', src: [], specs: [0, 1, 2, 3] },
  { leak: 'All together', bg: '#fbf6f4', to: 103500, prefix: '₹', what: 'A month. About ₹12 lakh a year.', how: '₹22,500 from missed enquiries + ₹63,000 from fewer no-shows + ₹18,000 from follow-ups. Plus 50+ new reviews and 50 hours of your receptionist’s time.', src: [], specs: [0, 1, 2, 3] },
];
const ART = ['/images/front-desk.webp', '/images/reminder.webp', '/images/reviews.webp', '/images/recall.webp', '/images/team-720.webp', '/images/team-720.webp'];

function StatBlock({ s, i }: { s: Stat; i: number }) {
  return (
    <div className="split">
      <div>
        <p className="eyebrow" style={{ color: 'var(--color-text-soft)' }}>{s.leak}</p>
        <p className={`impact-num D ${s.to >= 100000 ? 'long' : ''}`}><Counter to={s.to} prefix={s.prefix} suffix={s.suffix} /></p>
        <p className="impact-what D">{s.what}</p>
        <p className="impact-how">{s.how}</p>
        {s.src.map((id) => <SourceTag key={id} id={id} />)}
        <div className="who" style={{ marginTop: 14 }}>
          {s.specs.map((k) => <img key={k} src={TEAM[k].thumb} alt="" />)}
          <p>{s.specs.length === 4 ? 'The whole team' : TEAM[s.specs[0]].title}<br /><span className="live">Live</span></p>
        </div>
      </div>
      <img className="impact-art" src={ART[i]} alt="" loading="lazy" decoding="async" style={i >= 4 ? { aspectRatio: '720 / 402' } : undefined} />
    </div>
  );
}

function Cta() {
  return (
    <div>
      <h2 className="big-line xl D">Get these numbers <em>for your clinic.</em></h2>
      <p className="muted" style={{ margin: '14px 0 24px', maxWidth: '44ch' }}>Five questions about your clinic. A free front desk audit with your own estimate, built the same way.</p>
      <div className="btn-row">
        <a className="btn" href={waLink(MESSAGES.impact)}>Message us on WhatsApp</a>
        {/* savings.html is not built yet: point this at the calculator once it exists */}
        <a className="btn ghost" href="/savings.html">Check my clinic</a>
      </div>
    </div>
  );
}

export function Impact() {
  return (
    <Scene id="impact" chapter={4} steps={STATS.length + 1} label="The impact for a sample clinic">
      <ImpactStage />
    </Scene>
  );
}

function ImpactStage() {
  const { step, animated } = useScene();
  const head = (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'baseline' }}>
      <p className="eyebrow">What the research suggests for a clinic like yours</p>
      <p className="small" style={{ color: 'var(--color-text-soft)', maxWidth: '52ch' }}>Sample clinic: 25 messages a day, 20 patients a day, ₹1,500 average per visit, 150 check-ups due a month. Estimates, not results. Check your own numbers below.</p>
    </div>
  );

  if (!animated) {
    return (
      <div className="wrap">
        {head}
        {STATS.map((s, i) => <div key={s.leak} className="static-beat" style={{ background: s.bg, padding: '32px 20px', margin: '24px -20px 0' }}><StatBlock s={s} i={i} /></div>)}
        <div className="static-beat"><Cta /></div>
      </div>
    );
  }

  const end = step === STATS.length;
  return (
    <>
      <motion.div className="stage-bg" initial={false} animate={{ backgroundColor: end ? '#fbf6f4' : STATS[step].bg }} transition={{ duration: 0.6 }} />
      <div className="wrap">
        {head}
        <div style={{ marginTop: 20 }}>
          <AnimatePresence mode="wait">
            <Swap k={step}>{end ? <Cta /> : <StatBlock s={STATS[step]} i={step} />}</Swap>
          </AnimatePresence>
        </div>
        <div className="dots" aria-hidden="true">{STATS.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
      </div>
    </>
  );
}

export function Close() {
  return (
    <div className="wrap close">
      <motion.img src="/images/team-720.webp" srcSet="/images/team-720.webp 720w, /images/team-1200.webp 1200w" sizes="(min-width: 1080px) 1040px, 100vw"
        width={1200} height={670} alt="Illustration: the four front desk specialists standing together, each on their own colour tile" loading="lazy" decoding="async"
        initial={{ opacity: 0, y: 40, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease }} data-anim />
      <h2 className="D">See the team on your own number.</h2>
      <div className="founder" style={{ margin: '20px 0 24px', maxWidth: 440 }}>
        <div className="avatar lg" aria-hidden="true">S</div>
        <p><b>Shehbaz, Mumbai.</b> I come to your clinic for a 5-minute demo and set everything up in person.</p>
      </div>
      <motion.a className="btn" href={waLink(MESSAGES.end)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>Message us on WhatsApp</motion.a>

      <div className="plain">
        <section aria-labelledby="price-title">
          <h3 className="D" id="price-title">Pricing</h3>
          {/* When pricing is decided: Setup ₹{{setup}} · Monthly ₹{{monthly}} */}
          <p><b style={{ color: 'var(--color-text)' }}>One-time setup fee plus a monthly fee.</b> Cancel with one message. No lock-in.</p>
        </section>
        <section aria-labelledby="data-title">
          <h3 className="D" id="data-title">Your patients’ data</h3>
          <p>Patient phone numbers are encrypted. We never store diagnoses, prescriptions or medical records. <a href="/data.html">How we handle data →</a></p>
        </section>
      </div>

      <section className="sources" aria-labelledby="sources-title">
        <h3 id="sources-title">Sources</h3>
        <ol>
          {SOURCE_ORDER.map((id) => (
            <li key={id} id={`src-${id}`}><a href={SOURCES[id].url} rel="noopener">{SOURCES[id].full}</a></li>
          ))}
        </ol>
        <p className="small" style={{ marginTop: 10 }}>Research figures describe published studies, not Cyvo results. All chats, clinics and patients on this page are invented samples.</p>
      </section>
    </div>
  );
}
