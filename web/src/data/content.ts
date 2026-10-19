/* ============ CONFIG: change the WhatsApp number and messages here ============ */
export const WHATSAPP_NUMBER = '91XXXXXXXXXX';
export const MESSAGES = {
  hero: "Hi, I'd like a demo for my clinic",
  impact: "Hi, I'd like to see Cyvo's numbers for my clinic",
  end: "Hi, I'd like a demo for my clinic (end)",
};
export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* The four leaks and their specialists. Order and colours are fixed across the page (STORY-SCRIPT.md §3). */
export type Specialist = {
  id: 'front' | 'reminder' | 'reviews' | 'recall';
  title: string;
  short: string;
  leak: string;
  colour: string;
  img: string;
  thumb: string;
  job: string;
  research: string;
  source: SourceId;
};

export const TEAM: Specialist[] = [
  {
    id: 'front', title: 'Front desk specialist', short: 'Front desk', leak: 'Missed enquiries', colour: 'var(--color-peri)',
    img: '/images/front-desk.webp', thumb: '/images/th-front-desk.webp',
    job: 'Replies in seconds, day and night, on your number. Books, reschedules, answers questions.',
    research: 'Replying within the hour keeps the patient.', source: 'R2',
  },
  {
    id: 'reminder', title: 'Reminder specialist', short: 'Reminders', leak: 'No-shows', colour: 'var(--color-butter)',
    img: '/images/reminder.webp', thumb: '/images/th-reminder.webp',
    job: 'Two reminders: 3 days before and the day before. Patients confirm with one tap.',
    research: 'Two reminders cut missed visits by about a fifth.', source: 'R5',
  },
  {
    id: 'reviews', title: 'Reviews specialist', short: 'Reviews', leak: 'Reviews nobody asked for', colour: 'var(--color-blush)',
    img: '/images/reviews.webp', thumb: '/images/th-reviews.webp',
    job: 'Asks every patient after their visit, with one gentle follow-up. Never only the happy ones, never with incentives.',
    research: 'About 2 in 3 people review when asked.', source: 'R7',
  },
  {
    id: 'recall', title: 'Recall specialist', short: 'Recall', leak: 'Patients who never come back', colour: 'var(--color-peri-soft)',
    img: '/images/recall.webp', thumb: '/images/th-recall.webp',
    job: 'Messages patients when their follow-up is due and books them back in.',
    research: 'Reminding patients when due brings back about 8 more in every 100.', source: 'R11',
  },
];

/* Research we can stand behind (STORY-SCRIPT.md §4). Page wording must not go beyond these. */
export type SourceId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10' | 'R11';
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
  R11: { short: 'Cochrane, 2018', full: 'Jacobson Vann et al., "Patient reminder and recall interventions to improve immunization rates", Cochrane Review CD003941, 2018 (75 studies)', url: 'https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003941.pub3' },
};
export const SOURCE_ORDER = Object.keys(SOURCES) as SourceId[];
