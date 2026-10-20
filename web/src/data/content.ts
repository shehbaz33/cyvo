/* ============ CONFIG: change the WhatsApp number and messages here ============ */
export const WHATSAPP_NUMBER = '919920805299';
export const WHATSAPP_DISPLAY = '+91 99208 05299';
export const MESSAGES = {
  hero: "Hi, I'd like a 5-minute demo for my clinic",
  impact: "Hi, I'd like to see Cyvo's numbers for my clinic",
  end: "Hi, I'd like a demo for my clinic (end)",
  vitals: "Hi, I just checked my clinic's vitals. I'd like a demo.",
};
/* Clinic Vitals backend (backend/apps-script, see its README). Empty = not deployed yet:
   the page still works end to end, and the gate offers to send the details to us on WhatsApp instead. */
export const VITALS_ENDPOINT = '';
/* 'manual' until Meta approves the report template: you get an alert with a one-tap link and send it yourself.
   'api' once the template is approved and the WhatsApp Cloud API keys are in the script properties. */
export const VITALS_WHATSAPP_MODE: 'manual' | 'api' = 'manual';
/* Founding-clinic offer shown after the report. Lines left empty are not shown: fill them in once decided.
   Never show a price, deposit or guarantee here that you are not ready to honour. */
export const FOUNDING = {
  places: 10,
  setupLine: '',        // e.g. 'The setup fee waived' or 'The setup fee reduced to ₹X'
  guaranteeLine: '',    // e.g. 'If it doesn’t bring back at least X appointments in the first 60 days, your setup fee is refunded'
  depositRupees: 0,     // e.g. 2000 → "Reserve a place with a refundable ₹2,000 deposit…"
};
/* Bump when the consent wording on the details form changes; it is stored with every lead. */
export const CONSENT_VERSION = 'v2-2026-10-20';
/* One base colour per section, so each act reads as a new section. Acts start and end on their base colour;
   the wave dividers in App.tsx sit on the edge between two of them. All light enough for navy text. */
export const SECTION_BG = {
  hero: '#fbf6f4',    // cream (page)
  gaps: '#fbf6f4',    // cream, continuing from the hero so the first screen stays clean
  team: '#fcf1d2',    // butter wash
  rules: '#e7f2ea',   // mint wash
  patient: '#fbe9ee', // blush wash
  impact: '#f1e8de',  // sand
  close: '#fbf6f4',   // cream (page)
};
export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* The four gaps and their specialists. Order and colours are fixed across the page (STORY-SCRIPT.md §3). */
export type Specialist = {
  id: 'front' | 'reminder' | 'reviews' | 'recall';
  title: string;
  short: string;
  gap: string;
  colour: string;
  img: string;
  thumb: string;
  job: string;
  research: string;
  source: SourceId;
};

export const TEAM: Specialist[] = [
  {
    id: 'front', title: 'Front desk specialist', short: 'Front desk', gap: 'Missed enquiries', colour: 'var(--color-peri)',
    img: '/images/front-desk.webp', thumb: '/images/th-front-desk.webp',
    job: 'Replies in seconds, day and night, on your number. Books, reschedules, answers questions.',
    research: 'Replying within the hour: about 7× more real conversations (US sales study).', source: 'R2',
  },
  {
    id: 'reminder', title: 'Reminder specialist', short: 'Reminders', gap: 'No-shows', colour: 'var(--color-butter)',
    img: '/images/reminder.webp', thumb: '/images/th-reminder.webp',
    job: 'Two reminders: 3 days before and the day before. Patients confirm with one tap.',
    research: 'Across 21 trials, reminders cut no-shows from about 21 to 15 in 100.', source: 'R12',
  },
  {
    id: 'reviews', title: 'Reviews specialist', short: 'Reviews', gap: 'Reviews nobody asked for', colour: 'var(--color-blush)',
    img: '/images/reviews.webp', thumb: '/images/th-reviews.webp',
    job: 'Asks every patient after their visit, with one gentle follow-up. Never only the happy ones, never with incentives.',
    research: 'In a US survey, about 2 in 3 people said they review when asked.', source: 'R7',
  },
  {
    id: 'recall', title: 'Recall specialist', short: 'Recall', gap: 'Patients who never come back', colour: 'var(--color-peri-soft)',
    img: '/images/recall.webp', thumb: '/images/th-recall.webp',
    job: 'Messages patients when their follow-up is due and books them back in.',
    research: 'For vaccinations, reminders when due brought back about 8 more in 100.', source: 'R11',
  },
];

/* Research we can stand behind (STORY-SCRIPT.md §4). Page wording must not go beyond these. */
export type SourceId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10' | 'R11' | 'R12';
export const SOURCES: Record<SourceId, { short: string; full: string; url: string }> = {
  R1: { short: 'Zocdoc', full: 'Zocdoc, "When do patients want to see the doctor?" (US online bookings)', url: 'https://www.zocdoc.com/resources/blog/article/when-do-patients-want-to-see-the-doctor/' },
  R2: { short: 'Harvard Business Review, 2011', full: 'Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads", Harvard Business Review, 2011 (1.25M leads, 42 US firms)', url: 'https://scholarsarchive.byu.edu/facpub/9711' },
  R3: { short: 'JCDR, 2016', full: 'Missed appointments in a paediatric dental OPD in India, Journal of Clinical and Diagnostic Research, 2016 (2,294 patients)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4948520' },
  R4: { short: 'Cochrane, 2013', full: 'Gurol-Urganci et al., "Mobile phone messaging reminders for attendance at healthcare appointments", Cochrane Review CD007458, 2013', url: 'https://www.cochrane.org/CD007458' },
  R5: { short: 'AJMC, 2018', full: '"Optimizing Number and Timing of Appointment Reminders: A Randomized Trial", American Journal of Managed Care, 2018 (54,066 patients)', url: 'https://www.ajmc.com/view/optimizing-number-and-timing-of-appointment-reminders-a-randomized-trial' },
  R6: { short: 'Int Dent J, 2012', full: 'SMS reminders and on-time attendance at an Indian paediatric dental centre, International Dental Journal, 2012 (206 patients)', url: 'https://www.nationalelfservice.net/publication-types/randomised-controlled-trial/text-messaging-to-reduce-failed-appointments/' },
  R7: { short: 'BrightLocal, 2017', full: 'BrightLocal, Local Consumer Review Survey 2017', url: 'https://brightlocal.com/research/local-consumer-review-survey-2017' },
  R8: { short: 'Google', full: 'Google Business Profile Help, "Tips to improve your local ranking on Google"', url: 'https://support.google.com/business/answer/7091' },
  R9: { short: 'Software Advice survey', full: 'Software Advice patient survey on online reviews, via HC Innovation Group (US)', url: 'https://www.hcinnovationgroup.com/population-health-management/patient-engagement/news/13027701/survey-most-patients-use-healthcare-review-sites-to-choose-docs' },
  R10: { short: 'Danish health survey', full: 'The effect of multiple reminders on response patterns in a Danish health survey', url: 'https://research.regionh.dk/en/publications/the-effect-of-multiple-reminders-on-response-patterns-in-a-danish/' },
  R12: { short: 'BMJ Open, 2016', full: 'Robotham et al., "Using digital notifications to improve attendance in clinic: systematic review and meta-analysis", BMJ Open, 2016 (21 trials, 16,076 patients)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5093388/' },
  R11: { short: 'Cochrane, 2018', full: 'Jacobson Vann et al., "Patient reminder and recall interventions to improve immunization rates", Cochrane Review CD003941, 2018 (75 studies)', url: 'https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003941.pub3' },
};
export const SOURCE_ORDER = Object.keys(SOURCES) as SourceId[];
