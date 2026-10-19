import { motion } from 'motion/react';
import { MESSAGES, TEAM, waLink } from '../data/content';
import { ease, spring } from '../components/ui';

const NOTES: Record<string, [string, string]> = {
  front: ['10:41 pm', 'Booked: Sat, 11:00 am'],
  reminder: ['7:00 pm', 'Reminder sent'],
  reviews: ['1:15 pm', 'Review request sent'],
  recall: ['6 months later', 'Follow-up booked'],
};
const STICKERS = ['s-butter', 's-peri', 's-butter', 's-blush'];

/* Hero animations play on load. Elements carry data-anim so the <noscript> style shows them without JS. */
export function Hero() {
  const line = (i: number) => ({
    initial: { y: '105%' },
    animate: { y: '0%' },
    transition: { duration: 0.8, ease, delay: 0.1 + i * 0.09 },
  });
  return (
    <div className="wrap">
      <nav className="nav" aria-label="Main">
        <a className="wordmark D" href="/" aria-label="Cyvo home">cyvo<span>.</span></a>
        <a className="nav-btn" href={waLink(MESSAGES.hero)}>Message us</a>
      </nav>

      <header className="hero">
        <div className="hero-head">
          <motion.span className="sticker s-tomato" data-anim initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ ...spring, delay: 0.5 }}>
            Open at 11 pm
          </motion.span>
          <h1 className="D">
            <span className="line"><motion.span data-anim {...line(0)}>Your clinic answers</motion.span></span>
            <span className="line"><motion.span data-anim {...line(1)}>WhatsApp at 11 pm.</motion.span></span>
            <span className="line"><motion.span data-anim {...line(2)}><em>Even when you don’t.</em></motion.span></span>
          </h1>
        </div>

        <motion.div className="hero-copy" data-anim initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.45 }}>
          <p className="sub">A team of four front desk specialists on your clinic’s own WhatsApp number. Tell them once, they remember. Set up in person in Mumbai.</p>
          <a className="btn" href={waLink(MESSAGES.hero)}>Message us on WhatsApp</a>
          <div className="founder">
            {/* Founder photo: replace the S with <img src="/images/shehbaz.webp" alt="Shehbaz" width="96" height="96" /> */}
            <div className="avatar" aria-hidden="true">S</div>
            <p><b>Shehbaz</b> comes to your clinic for a 5-minute demo.</p>
          </div>
        </motion.div>

        <div className="hero-team" aria-label="Your front desk team">
          <div className="tiles">
            {TEAM.map((s, i) => (
              <motion.figure key={s.id} className="tile" style={{ ['--tile' as string]: s.colour }} data-anim
                initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 0.35 + i * 0.12 }}>
                <img src={s.thumb} width={400} height={410} alt={`Illustration: the ${s.title.toLowerCase()}`} {...(i === 0 ? { fetchpriority: 'high' } : {})} decoding="async" />
                <span className={`sticker ${STICKERS[i]}`}>Live</span>
                <figcaption className="D">{s.short}</figcaption>
                <motion.p className="note-pop" data-anim initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: 1.1 + i * 0.55 }}>
                  <small>{NOTES[s.id][0]}</small>{NOTES[s.id][1]}
                </motion.p>
              </motion.figure>
            ))}
          </div>
          <motion.div className="leak-chips" data-anim initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}>
            {TEAM.map((s) => <span key={s.id} className="leak-chip" style={{ ['--c' as string]: s.colour }}><i />{s.leak}</span>)}
          </motion.div>
          <p className="small" style={{ marginTop: 8 }}>One specialist for each place a clinic loses patients. Sample notifications.</p>
        </div>
      </header>
      <p className="hint">Scroll: see where clinics lose patients <motion.span style={{ display: 'inline-block' }} animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span></p>
    </div>
  );
}
