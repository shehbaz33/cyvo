import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { FOUNDING, MESSAGES, SOURCES, VITALS_WHATSAPP_MODE, WHATSAPP_DISPLAY, waLink, type SourceId } from '../data/content';
import { SourceTag } from '../components/ui';
import { loadReport, prefill, submit, track, type SubmitResult } from './api';
import {
  QUESTIONS, adjustDefaults, compute, decodeAnswers, encodeAnswers, inr, money, sortedByLoss,
  type Answers, type Flag, type Overrides, type Result,
} from './logic';

const ease = [0.2, 0.7, 0.2, 1] as const;
const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
const SRC = params.get('src') || 'direct';
const CLINIC_ID = params.get('c') || '';
const REF = params.get('ref') || '';
const DEMO = SRC === 'demo';

const today = () => new Date().toISOString().slice(0, 10);
const longDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
/* Fallback link when the backend can't store the report: answers only, no name or clinic. */
const anonymousReportUrl = (a: Answers) => `${window.location.origin}/vitals.html?${new URLSearchParams({ r: encodeAnswers(a), d: today() })}`;
const forwardUrl = (leadId: string) => `${window.location.origin}/vitals.html?src=fwd${leadId ? `&ref=${encodeURIComponent(leadId)}` : ''}`;

type Screen = { kind: 'entry' } | { kind: 'q'; i: number } | { kind: 'score' } | { kind: 'gate' }
  | { kind: 'sent'; channel: 'whatsapp' | 'email'; contact: string; result: SubmitResult; url: string; score: number; clinic: string; weakest: string }
  | { kind: 'report' };

/* ---------- App ---------- */
export function VitalsApp() {
  const shared = useMemo(() => decodeAnswers(params.get('r')), []);
  const reportId = params.get('report');
  if (reportId) return <Shell><StoredReportView id={reportId} /></Shell>;
  if (shared) return <Shell><Report a={shared} name="" clinic="" date={params.get('d') || today()} leadId="" /></Shell>;
  return <Shell><Flow /></Shell>;
}

/* A report link from WhatsApp or email: only a random ID, the rest is fetched from the sheet. */
function StoredReportView({ id }: { id: string }) {
  const [state, setState] = useState<'loading' | 'missing' | { a: Answers; name: string; clinic: string; date: string; leadId: string }>('loading');
  useEffect(() => {
    loadReport(id).then((r) => {
      const a = r && decodeAnswers(r.answers);
      setState(r && a ? { a, name: r.name, clinic: r.clinic, date: r.date, leadId: r.leadId } : 'missing');
    });
  }, [id]);
  if (state === 'loading') return <section className="v-screen"><p className="v-body">Loading your report…</p></section>;
  if (state === 'missing') return (
    <section className="v-screen">
      <h1 className="v-h1 D">We couldn’t open this report</h1>
      <p className="v-body">The link may be old or mistyped. Message us and Shehbaz will send it again, or take the checkup again in a minute.</p>
      <div className="btn-row">
        <a className="btn" href={waLink('Hi, my Clinic Vitals report link is not opening. Please send it again.')}>Message us on WhatsApp</a>
        <a className="btn ghost" href="/vitals.html">Take the checkup</a>
      </div>
    </section>
  );
  return <Report a={state.a} name={state.name} clinic={state.clinic} date={state.date} leadId={state.leadId} />;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="wrap v-wrap">
        <nav className="nav" aria-label="Main">
          <a className="wordmark D" href="/" aria-label="Cyvo home">cyvo<span>.</span></a>
          <a className="nav-btn" href={waLink(MESSAGES.vitals)}>Message us</a>
        </nav>
      </div>
      <main className="wrap v-wrap">{children}</main>
      <footer>
        <div className="wrap v-wrap">
          <span>Cyvo · Mumbai</span>
          <a href="/data.html">How we handle data</a>
          <a href={waLink(MESSAGES.vitals)}>WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
      </footer>
    </MotionConfig>
  );
}

function Flow() {
  const [screen, setScreenRaw] = useState<Screen>({ kind: 'entry' });
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [who, setWho] = useState({ name: '', clinic: '' });

  // Each screen is a history entry, so the phone's back button steps back through the questions.
  const setScreen = (s: Screen) => {
    window.history.pushState({ s }, '');
    setScreenRaw(s);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    window.history.replaceState({ s: { kind: 'entry' } }, '');
    const onPop = (e: PopStateEvent) => setScreenRaw((e.state && e.state.s) || { kind: 'entry' });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => { prefill(CLINIC_ID).then((p) => p && setWho(p)); }, []);

  const complete = QUESTIONS.every((q) => answers[q.key] !== undefined);
  const result = useMemo(() => (complete ? compute(answers as Answers) : null), [answers, complete]);

  const answer = (i: number, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[i].key]: value }));
    if (i < QUESTIONS.length - 1) { track('q_reached', SRC, i + 2); setScreen({ kind: 'q', i: i + 1 }); }
    else setScreen(DEMO ? { kind: 'report' } : { kind: 'score' });
  };

  let body: ReactNode;
  const start = () => { track('start', SRC); track('q_reached', SRC, 1); setScreen({ kind: 'q', i: 0 }); };
  if (screen.kind === 'entry') body = <Entry onStart={start} />;
  else if (screen.kind === 'q') body = <QuestionScreen i={screen.i} value={answers[QUESTIONS[screen.i].key]} onAnswer={(v) => answer(screen.i, v)} onBack={() => window.history.back()} />;
  else if (!result) body = <Entry onStart={start} />; // answers lost (e.g. page reloaded mid-flow)
  else if (screen.kind === 'score') body = <ScoreScreen r={result} onNext={() => setScreen({ kind: 'gate' })} />;
  else if (screen.kind === 'gate') body = <Gate a={answers as Answers} r={result} who={who} onSent={(s) => setScreen(s)} />;
  else if (screen.kind === 'sent') body = <Sent s={screen} />;
  else body = <><Report a={answers as Answers} name={who.name} clinic={who.clinic} date={today()} leadId="" /><DemoSend a={answers as Answers} who={who} /></>;

  const key = screen.kind === 'q' ? `q${screen.i}` : screen.kind;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }}>
        {body}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- 1. Entry ---------- */
function Entry({ onStart }: { onStart: () => void }) {
  return (
    <section className="v-screen">
      <span className="sticker s-butter">Free · 1 minute</span>
      <h1 className="v-h1 D">How many patients does your clinic lose each year without knowing?</h1>
      <p className="v-sub">A 1-minute checkup of your front desk. You get an estimate in rupees, where patients slip away, and how to fix each gap.</p>
      <blockquote className="v-story">A patient WhatsApps at 10:30 pm. Nobody replies until morning. By then they have booked somewhere else, and the clinic never finds out.</blockquote>
      <p className="v-body">8 taps. No sign-up. Your score shows straight away.</p>
      <button className="btn" onClick={onStart}>Start my checkup</button>
      <ul className="v-ticks">
        <li>Free, and nothing to install</li>
        <li>Uses published research from BMJ Open and Cochrane, and marks clearly which numbers are our estimates</li>
        <li>Made in Mumbai by Shehbaz, who has built AI systems for 7+ years</li>
      </ul>
    </section>
  );
}

/* ---------- 2. Questions ---------- */
const LETTERS = 'ABCDE';
function QuestionScreen({ i, value, onAnswer, onBack }: { i: number; value: unknown; onAnswer: (v: string | number) => void; onBack: () => void }) {
  const q = QUESTIONS[i];
  const [picked, setPicked] = useState<unknown>(value);
  const pick = (v: string | number) => {
    if (picked !== undefined && picked !== value) return; // already moving on
    setPicked(v);
    window.setTimeout(() => onAnswer(v), 260); // let the tap register before the next question slides in
  };
  // Like Typeform: press A, B, C… to answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = LETTERS.indexOf(e.key.toUpperCase());
      if (k >= 0 && k < q.options.length && !e.metaKey && !e.ctrlKey) pick(q.options[k].value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="v-screen" aria-labelledby={`q-${q.key}`}>
      <div className="v-progress">
        <button className="v-back" onClick={onBack} aria-label="Back">← Back</button>
        <span>{i + 1} of {QUESTIONS.length}</span>
      </div>
      <div className="v-bar" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: (i + 1) / QUESTIONS.length }} transition={{ duration: 0.4, ease }} /></div>
      <p className="eyebrow" style={{ marginTop: 28 }}>{q.group}</p>
      <h1 className="v-q" id={`q-${q.key}`}>{q.text}</h1>
      {q.helper && <p className="v-helper">{q.helper}</p>}
      <div className="v-options" role="group" aria-labelledby={`q-${q.key}`}>
        {q.options.map((o, k) => (
          <button key={String(o.value)} className={`v-option ${picked === o.value ? 'on' : ''}`} onClick={() => pick(o.value)}>
            <kbd aria-hidden="true">{LETTERS[k]}</kbd>{o.label}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- Shared pieces ---------- */
const bandTone = (score: number) => (score <= 40 ? 'urgent' : score <= 65 ? 'attention' : score <= 85 ? 'stable' : 'healthy');

function Dial({ score, size = 'lg' }: { score: number; size?: 'lg' | 'sm' }) {
  const len = Math.PI * 90; // half circle, r = 90
  return (
    <div className={`v-dial ${size} tone-${bandTone(score)}`} role="img" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 200 110" aria-hidden="true">
        <path d="M10 100 A90 90 0 0 1 190 100" className="track" />
        <motion.path d="M10 100 A90 90 0 0 1 190 100" className="fill" strokeDasharray={len}
          initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: len * (1 - score / 100) }} transition={{ duration: 1.1, ease }} />
      </svg>
      <p className="v-dial-num D">{score}<small>/100</small></p>
    </div>
  );
}

function FlagPill({ f }: { f: Flag }) {
  const cls = f === 'Normal' ? 'ok' : f === 'Borderline' ? 'mid' : 'bad';
  return <span className={`v-flag ${cls}`}><i aria-hidden="true" />{f}</span>;
}

/* ---------- 5. Score (free) ---------- */
function ScoreScreen({ r, onNext }: { r: Result; onNext: () => void }) {
  useEffect(() => track('score_view', SRC), []);
  return (
    <section className="v-screen">
      <p className="eyebrow">Your clinic’s vitals</p>
      <Dial score={r.score} />
      <h1 className="v-band D">{r.band.name}</h1>
      <p className="v-body">{r.band.line}</p>

      <div className="v-teaser">
        <p><span>Your weakest vital</span><b className="D">{r.weakest.name}</b></p>
        <p>About <b>{inr(r.totalPatients)} patients a year</b>, roughly <b>{money(r.totalLoss)}</b>.</p>
      </div>

      <div className="v-lab" role="table" aria-label="Your five vitals">
        <div className="v-lab-head" role="row"><span role="columnheader">Vital</span><span role="columnheader">Loss a year</span></div>
        {r.vitals.map((v) => (
          <div className="v-lab-row" role="row" key={v.id}>
            <span role="cell"><b>{v.name}</b><FlagPill f={v.flag} /></span>
            <span role="cell" className="v-locked" aria-label="Shown in your full report"><i aria-hidden="true">₹ 00,000</i></span>
          </div>
        ))}
      </div>
      <p className="v-body" style={{ marginTop: 0 }}>Your full report shows the loss for each vital, which numbers come from research and which are our estimates, and how to fix each one.</p>

      <button className="btn" onClick={onNext}>Get my free report</button>
      <p className="small v-fine">Takes 20 seconds. Sent on WhatsApp or email.</p>
    </section>
  );
}

/* ---------- 6. Gate ---------- */
const cleanPhone = (s: string) => {
  let d = s.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
};
const phoneOk = (d: string) => /^[6-9]\d{9}$/.test(d);
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

function Gate({ a, r, who, onSent }: { a: Answers; r: Result; who: { name: string; clinic: string }; onSent: (s: Screen) => void }) {
  const [step, setStep] = useState(who.name && who.clinic ? 2 : 0); // flow A prefill skips straight to the channel
  const [name, setName] = useState(who.name);
  const [clinic, setClinic] = useState(who.clinic);
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [busy, setBusy] = useState(false);
  const hp = useRef<HTMLInputElement>(null);
  useEffect(() => { setName((n) => n || who.name); setClinic((c) => c || who.clinic); }, [who]);
  useEffect(() => { setError(''); track('form_step', SRC, step + 1); }, [step]);
  const first = name.trim().split(/\s+/).slice(0, 2).join(' ');

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    if (step === 0 && !name.trim()) return setError('Please enter your name.');
    if (step === 1 && !clinic.trim()) return setError('Please enter your clinic’s name.');
    setStep(step + 1);
  };
  const send = async (e: FormEvent) => {
    e.preventDefault();
    const digits = cleanPhone(phone);
    const badContact = channel === 'whatsapp' ? !phoneOk(digits) : !emailOk(email);
    setError(badContact ? (channel === 'whatsapp' ? 'Please enter a 10-digit mobile number.' : 'Please check the email address.') : '');
    setConsentError(consent ? '' : 'Please tick the box so we can send your report.');
    if (badContact || !consent) return;
    setBusy(true);
    const contact = channel === 'whatsapp' ? `+91${digits}` : email.trim();
    const result = await submit({ src: SRC, c: CLINIC_ID, ref: REF, name: name.trim(), clinic: clinic.trim(), channel, contact, consent: 'checkbox', answers: a, website: hp.current?.value || '' });
    setBusy(false);
    if (result.ok) track('submit', SRC);
    onSent({ kind: 'sent', channel, contact, result, url: result.ok ? result.reportUrl : anonymousReportUrl(a), score: r.score, clinic: clinic.trim(), weakest: r.weakest.name });
  };

  const head = (
    <>
      <div className="v-progress">
        <button className="v-back" type="button" onClick={() => (step === 0 ? window.history.back() : setStep(step - 1))} aria-label="Back">← Back</button>
        <span>Your report · {Math.min(step, 2) + 1} of 3</span>
      </div>
      <div className="v-bar" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: (Math.min(step, 2) + 1) / 3 }} transition={{ duration: 0.4, ease }} /></div>
    </>
  );

  let body: ReactNode;
  if (step === 0) body = (
    <form className="v-form" onSubmit={next} noValidate>
      <p className="v-mini">Score {r.score}/100 · {r.band.name}</p>
      <h1 className="v-q">Your report is ready. Who should we make it out to?</h1>
      <Field label="Your name" error={error}><input autoFocus value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Dr. Mehta" autoComplete="name" enterKeyHint="next" /></Field>
      <OkButton />
    </form>
  );
  else if (step === 1) body = (
    <form className="v-form" onSubmit={next} noValidate>
      <h1 className="v-q">Thanks, {first}. What is your clinic called?</h1>
      <Field label="Clinic name" error={error}><input autoFocus value={clinic} onChange={(e) => { setClinic(e.target.value); setError(''); }} placeholder="Smile Studio Dental" autoComplete="organization" enterKeyHint="next" /></Field>
      <OkButton />
    </form>
  );
  else if (step === 2) body = (
    <div className="v-form">
      <h1 className="v-q">Where should we send your report?</h1>
      <div className="v-options">
        <button className="v-option" onClick={() => { setChannel('whatsapp'); setStep(3); }}>On WhatsApp<small>Fastest. Arrives as a PDF.</small></button>
        <button className="v-option" onClick={() => { setChannel('email'); setStep(3); }}>By email<small>PDF attached.</small></button>
      </div>
    </div>
  );
  else body = (
    <form className="v-form" onSubmit={send} noValidate>
      <h1 className="v-q">{channel === 'whatsapp' ? 'Your WhatsApp number?' : 'Your email address?'}</h1>
      {channel === 'whatsapp' ? (
        <Field label="WhatsApp number" error={error}>
          <div className="v-phone"><span>+91</span><input autoFocus value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" enterKeyHint="send" /></div>
        </Field>
      ) : (
        <Field label="Email address" error={error}>
          <input autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} type="email" inputMode="email" autoComplete="email" placeholder="you@clinic.com" enterKeyHint="send" />
        </Field>
      )}
      {/* Honeypot for bots: hidden from people and screen readers */}
      <input ref={hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="v-hp" />
      <label className={`v-check ${consentError ? 'err' : ''}`}>
        <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setConsentError(''); }} />
        <span>Yes, send me my report. Cyvo may message me about it, at most 3 times.</span>
      </label>
      {consentError && <p className="v-err" role="alert">{consentError}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send my report'}</button>
      {/* Specific promises beat a generic "no spam" line (see DESIGN.md decisions log) */}
      <ul className="v-promise">
        <li><span>{channel === 'whatsapp' ? <>It comes from Shehbaz’s number, <b className="nowrap">{WHATSAPP_DISPLAY}</b>.</> : 'It comes from Shehbaz at Cyvo.'}</span></li>
        <li><span>We only message you about this report and a founding place, at most 3 times.</span></li>
        <li><span>Reply STOP anytime and we stop.</span></li>
        <li><span>We never share or sell your details. <a href="/data.html">How we handle data</a></span></li>
      </ul>
    </form>
  );

  return (
    <section className="v-screen">
      {head}
      <AnimatePresence mode="wait">
        <motion.div key={step} style={{ width: '100%', marginTop: 24 }} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease }}>
          {body}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function OkButton() {
  return (
    <div className="v-ok">
      <button className="btn" type="submit">OK</button>
      <span className="small" aria-hidden="true">or press Enter ↵</span>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className={`v-field ${error ? 'err' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <span className="v-err" role="alert">{error}</span>}
    </label>
  );
}

/* ---------- 7. Confirmation ---------- */
function Sent({ s }: { s: Extract<Screen, { kind: 'sent' }> }) {
  const leadId = s.result.ok ? s.result.leadId : '';
  let head: ReactNode;
  if (!s.result.ok) {
    // Backend not deployed or unreachable: nothing was stored, so let the doctor send it to us himself.
    head = (
      <>
        <h1 className="v-h1 D">Your report is ready</h1>
        <p className="v-body">We couldn’t send it automatically just now. Open it below, or message us and Shehbaz will send it to you on WhatsApp.</p>
        <a className="btn ghost" href={waLink(`Hi, please send me my Clinic Vitals report: ${s.url}`)} style={{ marginTop: 8 }}>Get it on WhatsApp</a>
      </>
    );
  } else if (s.channel === 'whatsapp') {
    head = (
      <>
        <h1 className="v-h1 D">Sent.</h1>
        <p className="v-body">
          {VITALS_WHATSAPP_MODE === 'api'
            ? <>Check WhatsApp from {WHATSAPP_DISPLAY}. It should arrive in under a minute.</>
            : <>Shehbaz will WhatsApp it to you from {WHATSAPP_DISPLAY} today. You can open it right now below.</>}
        </p>
      </>
    );
  } else {
    head = (
      <>
        <h1 className="v-h1 D">Sent.</h1>
        <p className="v-body">Sent to {s.contact}. Check your inbox, and spam if it isn’t there in a few minutes.</p>
      </>
    );
  }
  return (
    <section className="v-screen">
      {head}
      <p style={{ marginTop: 20 }}><a className="v-link" href={s.url}>See your full report here →</a></p>
      <WhatCyvoIs />
      <Founding score={s.score} clinic={s.clinic} weakest={s.weakest} />
      <Forward leadId={leadId} score={s.score} />
    </section>
  );
}

function Forward({ leadId, score }: { leadId: string; score: number }) {
  const url = forwardUrl(leadId);
  const text = `I scored ${score}/100 on this 1-minute clinic checkup. Curious what you get: ${url}`;
  const share = (e: React.MouseEvent) => {
    track('share_click', SRC);
    if (navigator.share) { e.preventDefault(); navigator.share({ text }).catch(() => {}); }
  };
  return (
    <p className="small v-forward">
      <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} onClick={share}>Compare with a doctor friend: send them the checkup</a>
    </p>
  );
}

/* One line on what Cyvo actually is, so "night desk" or "reminders" doesn't read as hiring a person. */
function WhatCyvoIs() {
  return (
    <p className="v-what">Cyvo is an assistant that runs on your clinic’s own WhatsApp number. It replies to patients at any hour, books and reminds them, and asks for reviews, the way a good receptionist would. We are setting it up with a small group of Mumbai clinics first.</p>
  );
}

/* The offer after the report: honest about the stage (founding clinics), no demo of software that isn't live.
   Price, guarantee and deposit lines appear only once they are filled in FOUNDING (data/content.ts). */
function Founding({ score, clinic, weakest }: { score: number; clinic: string; weakest: string }) {
  const ask = `Hi Shehbaz, I’d like a founding place for ${clinic || 'my clinic'}. My score was ${score}/100.`;
  return (
    <div className="v-cta-box v-founding">
      <h3 className="v-h3" style={{ marginTop: 0 }}>Founding clinics: {FOUNDING.places} places in Mumbai</h3>
      <p>Cyvo is being set up with {FOUNDING.places} Mumbai clinics first. A founding clinic gets:</p>
      <ul className="v-list">
        <li>Setup on your own WhatsApp number, done in person by Shehbaz</li>
        <li>Your weakest vital ({weakest}) fixed first</li>
        {FOUNDING.setupLine && <li>{FOUNDING.setupLine}</li>}
        <li>The founding monthly price kept for as long as you stay</li>
        {FOUNDING.guaranteeLine && <li>{FOUNDING.guaranteeLine}</li>}
      </ul>
      {FOUNDING.depositRupees > 0 && <p>Reserve a place with a refundable ₹{inr(FOUNDING.depositRupees)} deposit. If you change your mind before setup, you get it back.</p>}
      <a className="btn no-print" href={waLink(ask)} onClick={() => track('founding_click', SRC)}>Ask for a founding place</a>
      <p className="print-only">Ask for a founding place on WhatsApp: {WHATSAPP_DISPLAY}</p>
    </div>
  );
}

/* ---------- Flow C: demo mode sends the report from the same screen ---------- */
function DemoSend({ a, who }: { a: Answers; who: { name: string; clinic: string } }) {
  const [name, setName] = useState(who.name);
  const [clinic, setClinic] = useState(who.clinic);
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'failed'>('idle');
  const [err, setErr] = useState('');
  useEffect(() => { setName((n) => n || who.name); setClinic((c) => c || who.clinic); }, [who]);
  const send = async (e: FormEvent) => {
    e.preventDefault();
    const d = cleanPhone(phone);
    if (!phoneOk(d)) { setErr('Please enter a 10-digit mobile number.'); return; }
    setErr(''); setState('busy');
    const r = await submit({ src: SRC, c: CLINIC_ID, ref: REF, name: name.trim(), clinic: clinic.trim(), channel: 'whatsapp', contact: `+91${d}`, consent: 'in_person', answers: a, website: '' });
    setState(r.ok ? 'sent' : 'failed');
    const url = r.ok ? r.reportUrl : anonymousReportUrl(a);
    if (!r.ok) window.location.href = `https://wa.me/91${d}?text=${encodeURIComponent(`Hi ${name}, here is your Clinic Vitals report: ${url}`)}`;
  };
  return (
    <section className="v-demo no-print" aria-label="Send this report">
      <p className="eyebrow">Demo mode</p>
      <h2 className="D">Shall I send this to your WhatsApp?</h2>
      {state === 'sent' ? <p className="v-body">Sent. Consent recorded as given in person.</p> : (
        <form className="v-form" onSubmit={send} noValidate>
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Mehta" /></Field>
          <Field label="Clinic name"><input value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Smile Studio Dental" /></Field>
          <Field label="WhatsApp number" error={err}><div className="v-phone"><span>+91</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></div></Field>
          <button className="btn" type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Send report on WhatsApp'}</button>
        </form>
      )}
    </section>
  );
}

/* ---------- 10. Full report (web version; "Save as PDF" prints the same page) ---------- */
function Report({ a, name, clinic, date, leadId }: { a: Answers; name: string; clinic: string; date: string; leadId: string }) {
  const defaults = adjustDefaults(a);
  const [adj, setAdj] = useState<Overrides>({});
  const r = useMemo(() => compute(a, adj), [a, adj]);
  const rows = sortedByLoss(r);
  const adjusted = Object.keys(adj).length > 0;
  const V = a.visits;

  return (
    <article className="v-report">
      <header className="v-r-head">
        <p className="eyebrow">Clinic Vitals report · {longDate(date)}</p>
        <h1 className="v-h1 D">{clinic ? `${clinic}: ` : ''}Clinic Vitals report</h1>
        {name && <p className="muted">Prepared for {name}</p>}
        <div className="v-r-score">
          <Dial score={r.score} size="sm" />
          <div>
            <p className="v-band D">{r.band.name}</p>
            <p className="v-body" style={{ marginTop: 4 }}>{r.band.line}</p>
          </div>
        </div>
        <div className="v-total">
          <p><span className="D">About {money(r.totalLoss)}</span> a year</p>
          <p>Roughly <b>{inr(r.totalPatients)} patients</b> a year</p>
          <small>Estimate based on your answers{adjusted ? ' and your adjusted numbers' : ''}. Rounded down.</small>
        </div>
        <div className="btn-row no-print" style={{ marginTop: 18 }}>
          <button className="btn ghost" onClick={() => window.print()}>Save as PDF</button>
        </div>
      </header>

      <section aria-labelledby="vitals-title">
        <h2 className="v-h2 D" id="vitals-title">Your five vitals</h2>
        <p className="small">Largest estimated loss first.</p>
        <WhatCyvoIs />
        <div className="v-vitals">
          {rows.map((v) => (
            <div className={`v-vital ${v.flag === 'Needs attention' ? 'bad' : v.flag === 'Borderline' ? 'mid' : 'ok'}`} key={v.id}>
              <div className="v-vital-top">
                <h3>{v.name}</h3>
                <FlagPill f={v.flag} />
              </div>
              <p className="v-result">{v.result}</p>
              <dl>
                <div><dt>Loss a year</dt><dd className="D">{money(v.loss)}</dd></div>
                <div><dt>Patients</dt><dd className="D">{inr(v.patients)}</dd></div>
                <div><dt>How sure</dt><dd>{v.confidence}</dd></div>
              </dl>
              {v.id === 5 && <p className="v-reviews"><b className="D">{inr(r.reviewsMissed)}</b> reviews missed a year</p>}
              <div className="v-evidence">
                <span>What the research says</span>
                <ul>{v.evidence.map((e) => <li key={e.text}>{e.text} <SourceTag id={e.src} /></li>)}</ul>
              </div>
              <div className="v-fix">
                <img src={v.specialist.thumb} alt="" width={44} height={44} />
                <p><span>Who fixes it · {v.fixName}</span>{v.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="v-adjust no-print">
        <summary>Adjust for your clinic</summary>
        <p className="small">If you know your real numbers, change them here. The report and the PDF update.</p>
        <Stepper label="After-hours messages a day" value={adj.afterHoursPerDay ?? defaults.afterHoursPerDay} min={0} max={100}
          onChange={(v) => setAdj({ ...adj, afterHoursPerDay: v })} />
        <Stepper label="Enquiries that don’t book, a week" value={adj.enquiriesPerWeek ?? defaults.enquiriesPerWeek} min={0} max={100}
          onChange={(v) => setAdj({ ...adj, enquiriesPerWeek: v })} />
        <Stepper label="No-shows out of 10 (without reminders)" value={adj.noShowsOutOf10 ?? defaults.noShowsOutOf10} min={0} max={10}
          onChange={(v) => setAdj({ ...adj, noShowsOutOf10: v })} />
        {adjusted && <button className="v-link" onClick={() => setAdj({})}>Reset to our estimates</button>}
      </details>

      <section className="v-page2" aria-labelledby="calc-title">
        <h2 className="v-h2 D" id="calc-title">How we calculated this</h2>
        <p className="v-body">These are estimates from your answers and the rates below. We round every number down.</p>
        <ol className="v-calc">
          {r.vitals.map((v) => (
            <li key={v.id}><b>{v.name}</b><span>{v.working} = {money(v.loss)}</span></li>
          ))}
        </ol>

        <h3 className="v-h3">What is our estimate, not research</h3>
        <p className="small">Where no study measures it, we use a careful estimate and say so. We will update these with real clinic data.</p>
        <ul className="v-list">
          <li>{adj.afterHoursPerDay != null ? `${adj.afterHoursPerDay} messages or calls after closing a day (your number).` : `About 15 messages or calls after closing for every 100 visits a month (${inr(Math.round(V * 0.15))} a month for you).`}</li>
          <li>{adj.enquiriesPerWeek != null ? `${adj.enquiriesPerWeek} daytime enquiries a week that don’t book (your number).` : `About 8 daytime enquiries that don’t book for every 100 visits (${inr(Math.round(V * 0.08))} a month for you).`}</li>
          {adj.noShowsOutOf10 != null && <li>{adj.noShowsOutOf10} in 10 patients don’t turn up without reminders (your number).</li>}
          <li>How many night-time patients book elsewhere, by how fast you reply.</li>
          <li>How many patients are due for a next visit at a clinic like yours.</li>
          <li>About 10% of visits are new patients who found you on Google, and 1 in 10 patients who are asked leave a review. That is far below the 2 in 3 the research finds, to stay on the safe side.</li>
        </ul>

        <h3 className="v-h3">Where the numbers come from</h3>
        <p className="small">The published studies behind this report. Tap any one to read it.</p>
        <ol className="v-sources">
          {REPORT_SOURCES.map((id) => (
            <li key={id}><a href={SOURCES[id].url} target="_blank" rel="noopener">{SOURCES[id].full}</a><span className="print-only"> {SOURCES[id].url}</span></li>
          ))}
        </ol>
        <p className="small">Some studies were done outside India or on sales enquiries rather than patients. We use them as a guide and keep our own numbers on the low side.</p>
        <p className="small no-print">If your numbers are different, use “Adjust for your clinic” above.</p>

        <Founding score={r.score} clinic={clinic} weakest={r.weakest.name} />
        <div className="no-print"><Forward leadId={leadId || REF} score={r.score} /></div>
        <p className="small v-r-foot">Cyvo, Mumbai · <a href="/data.html">How we handle data</a> · All figures are estimates.</p>
      </section>
    </article>
  );
}

/* Every source any vital cites, in the order they first appear. */
const REPORT_SOURCES: SourceId[] = ['R1', 'R2', 'R12', 'R5', 'R3', 'R11', 'R7', 'R9', 'R8'];

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="v-stepper">
      <span>{label}</span>
      <div>
        <button type="button" aria-label={`Less: ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" aria-label={`More: ${label}`} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}
