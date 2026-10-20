import { MotionConfig } from 'motion/react';
import { Hero } from './acts/Hero';
import { Leak } from './acts/Leak';
import { Team } from './acts/Team';
import { Rules } from './acts/Rules';
import { Patient } from './acts/Patient';
import { Close, Impact } from './acts/Impact';
import { Guide } from './components/ui';
import { SmoothScroll } from './components/SmoothScroll';
import { MESSAGES, SECTION_BG as BG, WHATSAPP_DISPLAY, waLink } from './data/content';

/* Story order (design/STORY-SCRIPT.md): hero → the leak → the team → your rules → one patient → the impact → close. */
export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Guide />
      <Hero />
      <main>
        <Leak />
        <Team />
        <Rules />
        <Patient />
        <Impact />
        <section style={{ background: BG.close }}><Close /></section>
      </main>
      <footer>
        <div className="wrap">
          <span>Cyvo · Mumbai</span>
          <a href="/data.html">How we handle data</a>
          <a href="https://instagram.com/cyvowork" rel="noopener">Instagram</a>
          <a href={waLink(MESSAGES.end)}>WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
      </footer>
    </MotionConfig>
  );
}
