/* Clinic Vitals: questions, scoring and loss maths (Clinic Vitals brief v3, §2–4).
   Pure functions with no browser APIs: the page uses this file directly, and
   scripts/build-apps-script.mjs bundles the same file into the Apps Script backend,
   so the score a doctor sees and the report he receives can never disagree. */

import { FOUNDING, SOURCES, TEAM, type SourceId, type Specialist } from '../data/content';
export { SOURCES, TEAM, FOUNDING };

export type Specialty = 'dentist' | 'derm' | 'physio' | 'gp' | 'other';
export type Answers = {
  specialty: Specialty;          // Q1
  visits: number;                // Q2: V
  fee: number;                   // Q3: F
  night: 'fast' | 'hour' | 'morning' | 'never' | 'self';             // Q4
  enquiry: 'always' | 'sometimes' | 'never';                // Q5
  reminders: 'none' | 'some' | 'every' | 'confirm';         // Q6
  recall: 'never' | 'sometimes' | 'manual' | 'auto';        // Q7
  reviews: 'none' | 'verbal' | 'qr' | 'every';              // Q8
};
export type AnswerKey = keyof Answers;

type Option = { label: string; value: string | number };
export type Question = { key: AnswerKey; group: string; text: string; helper?: string; options: Option[] };

export const QUESTIONS: Question[] = [
  { key: 'specialty', group: 'About your clinic', text: 'What kind of clinic do you run?', options: [
    { label: 'Dental', value: 'dentist' }, { label: 'Skin and hair', value: 'derm' }, { label: 'Physiotherapy', value: 'physio' },
    { label: 'General practice', value: 'gp' }, { label: 'Something else', value: 'other' }] },
  { key: 'visits', group: 'About your clinic', text: 'Roughly how many patient visits in a month?', helper: 'A rough guess is fine. 30 patients a day is about 750 a month.', options: [
    { label: 'Under 200', value: 120 }, { label: '200 to 500', value: 350 }, { label: '500 to 1,000', value: 750 }, { label: 'More than 1,000', value: 1300 }] },
  { key: 'fee', group: 'About your clinic', text: 'What does a patient spend on an average visit?', helper: 'Consultation plus any treatment, roughly.', options: [
    { label: 'Under ₹500', value: 400 }, { label: '₹500 to ₹1,000', value: 750 }, { label: '₹1,000 to ₹2,000', value: 1500 }, { label: 'More than ₹2,000', value: 2500 }] },
  { key: 'night', group: 'How your clinic handles things', text: 'A patient WhatsApps or calls at 10:30 pm asking for an appointment. When do they usually hear back?', options: [
    { label: 'Within 15 minutes', value: 'fast' }, { label: 'Within an hour', value: 'hour' }, { label: 'Next morning', value: 'morning' }, { label: 'Sometimes never', value: 'never' },
    { label: 'I reply myself, from my phone', value: 'self' }] },
  { key: 'enquiry', group: 'How your clinic handles things', text: 'Someone asks about fees or timings but doesn’t book. Does anyone follow up later?', options: [
    { label: 'Always', value: 'always' }, { label: 'Sometimes', value: 'sometimes' }, { label: 'Never', value: 'never' }] },
  { key: 'reminders', group: 'How your clinic handles things', text: 'How do patients get reminded about their appointment?', options: [
    { label: 'We don’t send reminders', value: 'none' }, { label: 'Some patients, by hand', value: 'some' },
    { label: 'Every patient, the day before', value: 'every' }, { label: 'Day before and same day, and they can confirm or reschedule', value: 'confirm' }] },
  { key: 'recall', group: 'How your clinic handles things', text: 'After a visit, does anyone remind patients when their next visit is due?', options: [
    { label: 'Never', value: 'never' }, { label: 'Sometimes', value: 'sometimes' }, { label: 'Always, by hand', value: 'manual' }, { label: 'Yes, automatically', value: 'auto' }] },
  { key: 'reviews', group: 'How your clinic handles things', text: 'How do you ask patients for Google reviews?', options: [
    { label: 'We don’t ask', value: 'none' }, { label: 'Sometimes, verbally', value: 'verbal' },
    { label: 'A QR code at the desk', value: 'qr' }, { label: 'A message to every patient after the visit', value: 'every' }] },
];

/* One place for every assumption, so they can be updated from real clinic data later. */
export const ASSUME = {
  afterHoursPer100Visits: 15,
  enquiriesPer100Visits: 8,
  baseNoShowRate: 0.21,         // BMJ Open 2016 (R12): no-reminder control groups
  googleFindShare: 0.1,
  reviewRate: 0.1,
  reviewBookingEffect: 0.05,
  recallLift: 0.08,             // Cochrane 2018 (R11): reminders when due bring back ~8 more patients in 100
  dueToReturn: { dentist: 0.4, derm: 0.35, physio: 0.5, gp: 0.2, other: 0.3 } as Record<Specialty, number>,
};

const SEVERITY = {
  night: { fast: 0, hour: 0.25, morning: 0.6, never: 0.9, self: 0.3 },
  enquiry: { always: 0, sometimes: 0.4, never: 0.8 },
  reminders: { confirm: 0, every: 0.2, some: 0.5, none: 0.9 },
  recall: { auto: 0, manual: 0.2, sometimes: 0.45, never: 0.8 },
  reviews: { every: 0, qr: 0.3, verbal: 0.6, none: 0.9 },
};
const WEIGHT = { night: 25, enquiry: 20, reminders: 20, recall: 20, reviews: 15 };

const LOST_SHARE = { fast: 0.05, hour: 0.15, morning: 0.3, never: 0.5, self: 0.05 };
const RECOVERABLE = { always: 0.02, sometimes: 0.08, never: 0.15 };
const REMINDER_GAP = { none: 0.25, some: 0.15, every: 0.05, confirm: 0 };
/* Share of due patients who miss out on a reminder today (our estimate of how well each habit covers them). */
const RECALL_GAP = { never: 1, sometimes: 0.6, manual: 0.3, auto: 0 };
const ASK_GAP = { none: 1, verbal: 0.8, qr: 0.6, every: 0 };

export type Flag = 'Normal' | 'Borderline' | 'Needs attention';
/* How sure we are, in plain words. Shown on every vital so the doctor can judge each number himself. */
export type Confidence = 'Backed by research' | 'Research + our estimate' | 'Our estimate';
export type Evidence = { text: string; src: SourceId };
export type VitalId = 1 | 2 | 3 | 4 | 5;
export type Vital = {
  id: VitalId; name: string; severity: number; flag: Flag; confidence: Confidence;
  patients: number; loss: number; result: string; working: string;
  specialist: Specialist; fixName: string; fix: string; evidence: Evidence[];
};
export type Band = { name: string; line: string };
export type Result = {
  score: number; band: Band; vitals: Vital[]; // vitals in id order
  totalLoss: number; totalPatients: number; weakest: Vital; reviewsMissed: number;
  assumed: { afterHoursPerMonth: number; enquiriesPerMonth: number; noShowRate: number };
};

/* "Adjust for your clinic" (web report only): replaces the three counts we otherwise assume. */
export type Overrides = { afterHoursPerDay?: number; enquiriesPerWeek?: number; noShowsOutOf10?: number };

export const VITAL_NAMES: Record<VitalId, string> = { 1: 'Night replies', 2: 'Enquiry follow-up', 3: 'Show-up rate', 4: 'Return visits', 5: 'Google reviews' };

export const BANDS: [number, Band][] = [
  [40, { name: 'Needs urgent attention', line: 'Patients are slipping away at several points. Most of it is fixable.' }],
  [65, { name: 'Needs attention', line: 'Some things work well. A few gaps are costing you patients every week.' }],
  [85, { name: 'Stable', line: 'Your front desk is ahead of most clinics. One or two vitals need a look.' }],
  [100, { name: 'Healthy', line: 'Very few patients slip through. You are doing this well.' }],
];

export const flagFor = (severity: number): Flag => (severity >= 0.6 ? 'Needs attention' : severity >= 0.2 ? 'Borderline' : 'Normal');
export const bandFor = (score: number): Band => BANDS.find(([max]) => score <= max)![1];

/* Indian digit grouping (1,03,500) without relying on Intl, which Apps Script may lack. */
export function inr(n: number): string {
  const s = String(floorSafe(Math.abs(n)));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' : '') + last3;
}
export const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
/* Floor with a tiny tolerance so 43,199.999… (float noise for 43,200) still counts as 43,200. */
const floorSafe = (x: number) => Math.floor(x + 1e-6);
const down1000 = (x: number) => floorSafe(x / 1000) * 1000;
/* Rupee figure as shown everywhere: rounded down, "Under ₹1,000" for small losses. */
export const money = (x: number) => (x < 1000 ? 'Under ₹1,000' : `₹${inr(down1000(x))}`);

export function score(a: Answers): number {
  const keys = Object.keys(WEIGHT) as (keyof typeof WEIGHT)[];
  return Math.round(keys.reduce((sum, k) => sum + WEIGHT[k] * (1 - (SEVERITY[k] as Record<string, number>)[a[k]]), 0));
}

/* Published findings behind each vital (sources in data/content.ts, the same ones the story page cites). */
const EVIDENCE: Record<VitalId, Evidence[]> = {
  1: [
    { text: 'In US online bookings, about 4 in 10 doctor appointments were made between 5 pm and 9 am.', src: 'R1' },
    { text: 'In a study of US sales enquiries, replying within an hour made firms about 7 times more likely to get a real conversation.', src: 'R2' },
  ],
  2: [{ text: 'In a study of US sales enquiries, replying within an hour made firms about 7 times more likely to get a real conversation.', src: 'R2' }],
  3: [
    { text: 'Across 21 trials, reminders cut no-shows from about 21 in 100 to 15 in 100.', src: 'R12' },
    { text: 'Two reminders work better than one.', src: 'R5' },
    { text: 'In one Indian children’s dental OPD, 39 in 100 appointments were missed.', src: 'R3' },
  ],
  4: [{ text: 'For vaccinations, reminding patients when they were due brought back about 8 more in every 100 (75 studies).', src: 'R11' }],
  5: [
    { text: 'In a US survey across local businesses, about 2 in 3 people said they leave a review when asked.', src: 'R7' },
    { text: 'Most US patients surveyed read reviews before choosing a doctor.', src: 'R9' },
    { text: 'Google says more reviews can help your local ranking.', src: 'R8' },
  ],
};
const BY_ID = (id: Specialist['id']) => TEAM.find((t) => t.id === id)!;

const SPECIALTY_WORD: Record<Specialty, string> = { dentist: 'dental clinics', derm: 'skin and hair clinics', physio: 'physiotherapy clinics', gp: 'general practices', other: 'clinics like yours' };

export function compute(a: Answers, o: Overrides = {}): Result {
  const V = a.visits, F = a.fee;
  const afterHoursPerMonth = o.afterHoursPerDay != null ? o.afterHoursPerDay * 30 : V * ASSUME.afterHoursPer100Visits / 100;
  const enquiriesPerMonth = o.enquiriesPerWeek != null ? o.enquiriesPerWeek * 52 / 12 : V * ASSUME.enquiriesPer100Visits / 100;
  const noShowRate = o.noShowsOutOf10 != null ? o.noShowsOutOf10 / 10 : ASSUME.baseNoShowRate;
  const rs = `₹${inr(F)}`;

  const lostShare = LOST_SHARE[a.night];
  const p1 = afterHoursPerMonth * lostShare * 12;
  const recoverable = RECOVERABLE[a.enquiry];
  const p2 = enquiriesPerMonth * recoverable * 12;
  const gap = REMINDER_GAP[a.reminders];
  const p3 = V * noShowRate * gap * 12;
  const due = ASSUME.dueToReturn[a.specialty];
  const recallGap = RECALL_GAP[a.recall];
  const p4 = V * due * ASSUME.recallLift * recallGap * 12;
  const askGap = ASK_GAP[a.reviews];
  const reviewsMissed = V * 12 * askGap * ASSUME.reviewRate;
  const p5 = V * ASSUME.googleFindShare * askGap * ASSUME.reviewBookingEffect * 12;

  const when = { fast: 'quickly', hour: 'within an hour', morning: 'the next morning', never: 'sometimes never', self: 'from you, on your own phone' }[a.night];
  const sev = (k: keyof typeof SEVERITY) => (SEVERITY[k] as Record<string, number>)[a[k]];
  const mk = (id: VitalId, k: keyof typeof SEVERITY, confidence: Confidence, patients: number, result: string, who: Specialist['id'], fixName: string, fix: string, working: string): Vital => ({
    id, name: VITAL_NAMES[id], severity: sev(k), flag: flagFor(sev(k)), confidence, patients, loss: patients * F, result, working,
    specialist: BY_ID(who), fixName, fix, evidence: EVIDENCE[id],
  });
  const ahLabel = o.afterHoursPerDay != null ? `${o.afterHoursPerDay} messages after closing a day × 30 days` : `${V} visits a month × 15 messages after closing for every 100 visits`;
  const enqLabel = o.enquiriesPerWeek != null ? `${o.enquiriesPerWeek} enquiries a week that don’t book (${round1(enquiriesPerMonth)} a month)` : `${V} visits a month × 8 enquiries that don’t book for every 100 visits`;
  const nsLabel = o.noShowsOutOf10 != null ? `${o.noShowsOutOf10} in 10 who don’t turn up without reminders` : '21 in 100 who don’t turn up without reminders (research)';

  const vitals: Vital[] = [
    mk(1, 'night', 'Our estimate', p1,
      a.night === 'self' ? 'You reply to late messages yourself. Patients get an answer, and you lose your evening.' : `Patients who message after closing hear back ${when}. Many book with whichever clinic replies first.`,
      'front', 'Cyvo night desk', 'Replies in seconds on your number and books the appointment.',
      `${ahLabel} × ${pct(lostShare)} who book elsewhere when the reply comes ${when} (our estimate) × ${rs} a visit × 12 months`),
    mk(2, 'enquiry', 'Our estimate', p2,
      `People who ask about fees or timings and don’t book are ${{ always: 'always', sometimes: 'only sometimes', never: 'never' }[a.enquiry]} followed up.`,
      'front', 'Cyvo follow-up', 'Messages people who asked about fees or timings but didn’t book.',
      `${enqLabel} × ${pct(recoverable)} a follow-up would win back (our estimate) × ${rs} a visit × 12 months`),
    mk(3, 'reminders', 'Backed by research', p3,
      `${{ none: 'No reminders go out', some: 'Only some patients get reminded', every: 'Reminders go out, but patients can’t confirm or reschedule by reply', confirm: 'Reminders with confirm are in place' }[a.reminders]}.`,
      'reminder', 'Cyvo reminders', 'Two reminders, and patients confirm or reschedule by reply.',
      `${V} visits a month × ${nsLabel} × ${pct(gap)} of those that reminders prevent (research: about 25%) × ${rs} a visit × 12 months`),
    mk(4, 'recall', 'Research + our estimate', p4,
      `Patients due for their next visit are ${{ never: 'not reminded', sometimes: 'only sometimes reminded', manual: 'reminded by hand', auto: 'reminded automatically' }[a.recall]}.`,
      'recall', 'Cyvo recall', 'Messages patients when their next visit is due, with open slots.',
      `${V} visits a month × ${pct(due)} due for a next visit at ${SPECIALTY_WORD[a.specialty]} (our estimate) × 8 in 100 more who come back when reminded (research) × ${pct(recallGap)} not reminded today × ${rs} a visit × 12 months`),
    mk(5, 'reviews', 'Research + our estimate', p5,
      `About ${inr(reviewsMissed)} patients a year leave without being asked for a Google review.`,
      'reviews', 'Cyvo reviews', 'Asks every patient for a Google review after the visit.',
      `${V} visits a month × 10% new patients who find you on Google × ${pct(askGap)} of patients not asked × 5% more Google patients with steady new reviews (our estimates) × ${rs} a visit × 12 months`),
  ];
  const totalLoss = vitals.reduce((s, v) => s + v.loss, 0);
  const totalPatients = vitals.reduce((s, v) => s + v.patients, 0);
  const weakest = vitals.reduce((w, v) => (v.loss > w.loss ? v : w), vitals[0]);
  const sc = score(a);
  return {
    score: sc, band: bandFor(sc), vitals, totalLoss, totalPatients: floorSafe(totalPatients), weakest, reviewsMissed: floorSafe(reviewsMissed),
    assumed: { afterHoursPerMonth, enquiriesPerMonth, noShowRate },
  };
}
const round1 = (x: number) => Math.round(x * 10) / 10;

/* Defaults for the "Adjust for your clinic" steppers, from the same assumptions. */
export const adjustDefaults = (a: Answers) => ({
  afterHoursPerDay: Math.max(1, Math.round(a.visits * ASSUME.afterHoursPer100Visits / 100 / 30)),
  enquiriesPerWeek: Math.max(1, Math.round(a.visits * ASSUME.enquiriesPer100Visits / 100 * 12 / 52)),
  noShowsOutOf10: Math.round(ASSUME.baseNoShowRate * 10),
});

/* Answers travel in the report link as one short code: dentist.400.750.morning.never.some.never.verbal */
export function encodeAnswers(a: Answers): string {
  return QUESTIONS.map((q) => String(a[q.key])).join('.');
}
export function decodeAnswers(code: string | null | undefined): Answers | null {
  if (!code) return null;
  const parts = code.split('.');
  if (parts.length !== QUESTIONS.length) return null;
  const out: Record<string, string | number> = {};
  for (let i = 0; i < QUESTIONS.length; i++) {
    const opt = QUESTIONS[i].options.find((o) => String(o.value) === parts[i]);
    if (!opt) return null;
    out[QUESTIONS[i].key] = opt.value;
  }
  return out as Answers;
}

/* Founding-clinic offer size (the scarcity must be real: what Shehbaz can set up in person). */
export const FOUNDING_PLACES = FOUNDING.places;

export const sortedByLoss = (r: Result) => [...r.vitals].sort((x, y) => y.loss - x.loss);

/* §8.1 report message, used for the WhatsApp template body and the hand-sent fallback. */
export function whatsappReportText(name: string, clinic: string, r: Result, reportUrl: string): string {
  return [
    `Hi ${name}, here is the Clinic Vitals report for ${clinic}.`, '',
    `Score: ${r.score}/100`,
    `Estimated loss: about ${money(r.totalLoss)} a year, roughly ${inr(r.totalPatients)} patients.`,
    `Weakest vital: ${r.weakest.name}`, '',
    `The full breakdown and how we calculated it: ${reportUrl}`, '',
    `Cyvo is being set up with ${FOUNDING_PLACES} Mumbai clinics first. Reply FOUNDING and I’ll tell you how it would work at ${clinic}.`, '',
    'Shehbaz, Cyvo', 'Reply STOP to stop messages.',
  ].join('\n');
}
