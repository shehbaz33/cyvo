import { AnimatePresence, motion, useTransform } from 'motion/react';
import { MESSAGES, SECTION_BG, TEAM, WHATSAPP_DISPLAY, waLink, type SourceId } from '../data/content';
import { Scene, useScene } from '../components/Scene';
import { Backdrop, Counter, SourceTag, Swap, ease, spring } from '../components/ui';

/* Sample-clinic arithmetic built on the research (STORY-SCRIPT.md Act 5). Estimates, not results.
   Biggest number first: the monthly total, then each gap from largest to smallest. */
/* sure: the same "How sure" labels as the Clinic Vitals report, so every rupee says where it comes from. */
type Sure = 'Backed by research' | 'Research + our estimate' | 'Our estimate';
type Stat = { leak: string; bg: string; art: string; to: number; prefix?: string; suffix?: string; what: string; how: string; src: SourceId[]; specs: number[]; sure?: Sure };
const STATS: Stat[] = [
  { leak: 'All together', bg: SECTION_BG.impact, art: '/images/team-720.webp', to: 103500, prefix: '₹', what: 'A month. About ₹12 lakh a year.', how: '₹63,000 from fewer no-shows + ₹22,500 from missed enquiries + ₹18,000 from follow-ups. Plus 50+ new reviews and 50 hours of your receptionist’s time. Here is how each one adds up.', src: [], specs: [0, 1, 2, 3], sure: 'Research + our estimate' },
  { leak: 'No-shows', bg: '#fbf0c9', art: '/images/reminder.webp', to: 63000, prefix: '₹', what: 'From patients who actually turn up', how: '520 booked visits a month, 1 in 5 missed. Reminders lift attendance about 10% (from 80% to 88%), and a second reminder helps more: about 42 more visits × ₹1,500.', src: ['R4', 'R5'], specs: [1], sure: 'Backed by research' },
  { leak: 'Missed enquiries', bg: '#e8e9fc', art: '/images/front-desk.webp', to: 22500, prefix: '₹', what: 'From new patients who would have gone elsewhere', how: '300 after-hours messages a month. If 1 in 5 is a new patient wanting to book, and a reply within minutes keeps 1 in 4 of them (both our estimates): 15 new patients × ₹1,500. US studies show many bookings happen after hours and fast replies win.', src: ['R1', 'R2'], specs: [0], sure: 'Our estimate' },
  { leak: 'Follow-ups', bg: '#eef0fd', art: '/images/recall.webp', to: 18000, prefix: '₹', what: 'From patients brought back for their check-up', how: '150 patients due for a check-up each month × about 8 in 100 more coming back when reminded (the figure from vaccination reminder studies) = 12 visits × ₹1,500.', src: ['R11'], specs: [3], sure: 'Research + our estimate' },
  { leak: 'Reviews', bg: '#fbe4ea', art: '/images/reviews.webp', to: 50, suffix: '+', what: 'New Google reviews every month', how: 'All 520 patients asked after their visit. Even if only 1 in 10 posts a review (a US survey says up to 2 in 3 will when asked). Google says more reviews can help your local ranking.', src: ['R7', 'R8'], specs: [2], sure: 'Research + our estimate' },
  { leak: 'Your receptionist', bg: SECTION_BG.impact, art: '/images/team-720.webp', to: 50, suffix: ' hrs', what: 'Of your receptionist’s time back every month', how: '750 WhatsApp messages at about 3 minutes each, plus 520 reminder calls at about 2 minutes each.', src: [], specs: [0, 1, 2, 3], sure: 'Our estimate' },
];
const BEATS = STATS.length + 1; // + the closing CTA

/* Sample-clinic figures for the hero, read from the same STATS so the two can never disagree. */
const figure = (leak: string) => STATS.find((s) => s.leak === leak)!.to;
export const SAMPLE = {
  total: figure('All together'), noShows: figure('No-shows'), enquiries: figure('Missed enquiries'),
  followUps: figure('Follow-ups'), reviews: figure('Reviews'), hours: figure('Your receptionist'),
};

/* Art drifts up through its own beat, tied to scroll (not time), so it moves exactly as far as you scroll. */
function Art({ s, i }: { s: Stat; i: number }) {
  const { progress, animated } = useScene();
  const local = useTransform(progress, (v) => Math.min(1, Math.max(0, v * BEATS - i)));
  const y = useTransform(local, [0, 1], [70, -70]);
  const scale = useTransform(local, [0, 1], [1.08, 1]);
  const team = s.art.includes('team');
  return (
    <motion.img className="impact-art" src={s.art} alt="" loading="lazy" decoding="async"
      style={{ ...(team ? { aspectRatio: '720 / 402' } : {}), ...(animated ? { y, scale } : {}) }} />
  );
}

function StatBlock({ s, i }: { s: Stat; i: number }) {
  return (
    <div className="split">
      <div>
        <p className="eyebrow" style={{ color: 'var(--color-text-soft)' }}>{s.leak}</p>
        <p className={`impact-num D ${s.to >= 100000 ? 'long' : ''}`}><Counter to={s.to} prefix={s.prefix} suffix={s.suffix} /></p>
        <p className="impact-what D">{s.what}</p>
        <p className="impact-how">{s.how}</p>
        {s.sure && <p className="impact-sure"><span>How sure</span>{s.sure}</p>}
        {s.src.map((id) => <SourceTag key={id} id={id} />)}
        <div className="who" style={{ marginTop: 14 }}>
          {s.specs.map((k) => <img key={k} src={TEAM[k].thumb} alt="" />)}
          <p>{s.specs.length === 4 ? 'The whole team' : TEAM[s.specs[0]].title}<br /><span className="live">Live</span></p>
        </div>
      </div>
      <Art s={s} i={i} />
    </div>
  );
}

function Cta() {
  return (
    <div>
      <h2 className="big-line xl D">Get these numbers <em>for your clinic.</em></h2>
      <p className="muted" style={{ margin: '14px 0 24px', maxWidth: '44ch' }}>A 1-minute checkup of your front desk. 8 quick questions, and you see your score straight away.</p>
      <div className="btn-row">
        <a className="btn" href="/vitals.html?src=lp">Check your clinic’s vitals</a>
        <a className="btn ghost" href={waLink(MESSAGES.impact)}>Message us on WhatsApp</a>
      </div>
    </div>
  );
}

export function Impact() {
  return (
    <Scene id="impact" chapter={4} steps={BEATS} label="The impact for a sample clinic" base={SECTION_BG.impact}>
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

  return <AnimatedStage step={step} head={head} />;
}

function AnimatedStage({ step, head }: { step: number; head: JSX.Element }) {
  const end = step === STATS.length;
  return (
    <>
      <Backdrop colors={[...STATS.map((s) => s.bg), SECTION_BG.impact]} words={[...STATS.map((s) => s.leak), 'Your clinic']} />
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
      <p className="contact">Or WhatsApp Shehbaz directly: <a href={waLink(MESSAGES.end)}>{WHATSAPP_DISPLAY}</a></p>
      <p className="contact">Not sure yet? <a href="/vitals.html?src=lp">Check your clinic’s vitals in 1 minute →</a></p>

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

      <p className="small" style={{ marginTop: 28 }}>Research figures describe published studies, not Cyvo results. Tap any source tag to read the study. All chats, clinics and patients on this page are invented samples.</p>
    </div>
  );
}
