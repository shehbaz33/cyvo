// GENERATED from web/src/vitals/logic.ts by `npm run build:backend`. Do not edit here.
"use strict";
var CyvoVitals = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/vitals/logic.ts
  var logic_exports = {};
  __export(logic_exports, {
    ASSUME: () => ASSUME,
    BANDS: () => BANDS,
    FOUNDING: () => FOUNDING,
    FOUNDING_PLACES: () => FOUNDING_PLACES,
    QUESTIONS: () => QUESTIONS,
    SOURCES: () => SOURCES,
    TEAM: () => TEAM,
    VITAL_NAMES: () => VITAL_NAMES,
    adjustDefaults: () => adjustDefaults,
    bandFor: () => bandFor,
    compute: () => compute,
    decodeAnswers: () => decodeAnswers,
    encodeAnswers: () => encodeAnswers,
    flagFor: () => flagFor,
    inr: () => inr,
    money: () => money,
    pct: () => pct,
    score: () => score,
    sortedByLoss: () => sortedByLoss,
    whatsappReportText: () => whatsappReportText
  });

  // src/data/content.ts
  var FOUNDING = {
    places: 10,
    setupLine: "",
    // e.g. 'The setup fee waived' or 'The setup fee reduced to ₹X'
    guaranteeLine: "",
    // e.g. 'If it doesn’t bring back at least X appointments in the first 60 days, your setup fee is refunded'
    depositRupees: 0
    // e.g. 2000 → "Reserve a place with a refundable ₹2,000 deposit…"
  };
  var TEAM = [
    {
      id: "front",
      title: "Front desk specialist",
      short: "Front desk",
      gap: "Missed enquiries",
      colour: "var(--color-peri)",
      img: "/images/front-desk.webp",
      thumb: "/images/th-front-desk.webp",
      job: "Replies in seconds, day and night, on your number. Books, reschedules, answers questions.",
      research: "Replying within the hour keeps the patient.",
      source: "R2"
    },
    {
      id: "reminder",
      title: "Reminder specialist",
      short: "Reminders",
      gap: "No-shows",
      colour: "var(--color-butter)",
      img: "/images/reminder.webp",
      thumb: "/images/th-reminder.webp",
      job: "Two reminders: 3 days before and the day before. Patients confirm with one tap.",
      research: "Two reminders cut missed visits by about a fifth.",
      source: "R5"
    },
    {
      id: "reviews",
      title: "Reviews specialist",
      short: "Reviews",
      gap: "Reviews nobody asked for",
      colour: "var(--color-blush)",
      img: "/images/reviews.webp",
      thumb: "/images/th-reviews.webp",
      job: "Asks every patient after their visit, with one gentle follow-up. Never only the happy ones, never with incentives.",
      research: "About 2 in 3 people review when asked.",
      source: "R7"
    },
    {
      id: "recall",
      title: "Recall specialist",
      short: "Recall",
      gap: "Patients who never come back",
      colour: "var(--color-peri-soft)",
      img: "/images/recall.webp",
      thumb: "/images/th-recall.webp",
      job: "Messages patients when their follow-up is due and books them back in.",
      research: "Reminding patients when due brings back about 8 more in every 100.",
      source: "R11"
    }
  ];
  var SOURCES = {
    R1: { short: "Zocdoc", full: 'Zocdoc, "When do patients want to see the doctor?" (US online bookings)', url: "https://www.zocdoc.com/resources/blog/article/when-do-patients-want-to-see-the-doctor/" },
    R2: { short: "Harvard Business Review, 2011", full: 'Oldroyd, McElheran & Elkington, "The Short Life of Online Sales Leads", Harvard Business Review, 2011 (1.25M leads, 42 US firms)', url: "https://scholarsarchive.byu.edu/facpub/9711" },
    R3: { short: "JCDR, 2016", full: "Missed appointments in a paediatric dental OPD in India, Journal of Clinical and Diagnostic Research, 2016 (2,294 patients)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4948520" },
    R4: { short: "Cochrane, 2013", full: 'Gurol-Urganci et al., "Mobile phone messaging reminders for attendance at healthcare appointments", Cochrane Review CD007458, 2013', url: "https://www.cochrane.org/CD007458" },
    R5: { short: "AJMC, 2018", full: '"Optimizing Number and Timing of Appointment Reminders: A Randomized Trial", American Journal of Managed Care, 2018 (54,066 patients)', url: "https://www.ajmc.com/view/optimizing-number-and-timing-of-appointment-reminders-a-randomized-trial" },
    R6: { short: "Int Dent J, 2012", full: "SMS reminders and on-time attendance at an Indian paediatric dental centre, International Dental Journal, 2012 (206 patients)", url: "https://www.nationalelfservice.net/publication-types/randomised-controlled-trial/text-messaging-to-reduce-failed-appointments/" },
    R7: { short: "BrightLocal, 2017", full: "BrightLocal, Local Consumer Review Survey 2017", url: "https://brightlocal.com/research/local-consumer-review-survey-2017" },
    R8: { short: "Google", full: 'Google Business Profile Help, "Tips to improve your local ranking on Google"', url: "https://support.google.com/business/answer/7091" },
    R9: { short: "Software Advice survey", full: "Software Advice patient survey on online reviews, via HC Innovation Group (US)", url: "https://www.hcinnovationgroup.com/population-health-management/patient-engagement/news/13027701/survey-most-patients-use-healthcare-review-sites-to-choose-docs" },
    R10: { short: "Danish health survey", full: "The effect of multiple reminders on response patterns in a Danish health survey", url: "https://research.regionh.dk/en/publications/the-effect-of-multiple-reminders-on-response-patterns-in-a-danish/" },
    R12: { short: "BMJ Open, 2016", full: 'Robotham et al., "Using digital notifications to improve attendance in clinic: systematic review and meta-analysis", BMJ Open, 2016 (21 trials, 16,076 patients)', url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5093388/" },
    R11: { short: "Cochrane, 2018", full: 'Jacobson Vann et al., "Patient reminder and recall interventions to improve immunization rates", Cochrane Review CD003941, 2018 (75 studies)', url: "https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003941.pub3" }
  };
  var SOURCE_ORDER = Object.keys(SOURCES);

  // src/vitals/logic.ts
  var QUESTIONS = [
    { key: "specialty", group: "About your clinic", text: "What kind of clinic do you run?", options: [
      { label: "Dental", value: "dentist" },
      { label: "Skin and hair", value: "derm" },
      { label: "Physiotherapy", value: "physio" },
      { label: "General practice", value: "gp" },
      { label: "Something else", value: "other" }
    ] },
    { key: "visits", group: "About your clinic", text: "Roughly how many patient visits in a month?", helper: "A rough guess is fine. 30 patients a day is about 750 a month.", options: [
      { label: "Under 200", value: 120 },
      { label: "200 to 500", value: 350 },
      { label: "500 to 1,000", value: 750 },
      { label: "More than 1,000", value: 1300 }
    ] },
    { key: "fee", group: "About your clinic", text: "What does a patient spend on an average visit?", helper: "Consultation plus any treatment, roughly.", options: [
      { label: "Under \u20B9500", value: 400 },
      { label: "\u20B9500 to \u20B91,000", value: 750 },
      { label: "\u20B91,000 to \u20B92,000", value: 1500 },
      { label: "More than \u20B92,000", value: 2500 }
    ] },
    { key: "night", group: "How your clinic handles things", text: "A patient WhatsApps or calls at 10:30 pm asking for an appointment. When do they usually hear back?", options: [
      { label: "Within 15 minutes", value: "fast" },
      { label: "Within an hour", value: "hour" },
      { label: "Next morning", value: "morning" },
      { label: "Sometimes never", value: "never" },
      { label: "I reply myself, from my phone", value: "self" }
    ] },
    { key: "enquiry", group: "How your clinic handles things", text: "Someone asks about fees or timings but doesn\u2019t book. Does anyone follow up later?", options: [
      { label: "Always", value: "always" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Never", value: "never" }
    ] },
    { key: "reminders", group: "How your clinic handles things", text: "How do patients get reminded about their appointment?", options: [
      { label: "We don\u2019t send reminders", value: "none" },
      { label: "Some patients, by hand", value: "some" },
      { label: "Every patient, the day before", value: "every" },
      { label: "Day before and same day, and they can confirm or reschedule", value: "confirm" }
    ] },
    { key: "recall", group: "How your clinic handles things", text: "After a visit, does anyone remind patients when their next visit is due?", options: [
      { label: "Never", value: "never" },
      { label: "Sometimes", value: "sometimes" },
      { label: "Always, by hand", value: "manual" },
      { label: "Yes, automatically", value: "auto" }
    ] },
    { key: "reviews", group: "How your clinic handles things", text: "How do you ask patients for Google reviews?", options: [
      { label: "We don\u2019t ask", value: "none" },
      { label: "Sometimes, verbally", value: "verbal" },
      { label: "A QR code at the desk", value: "qr" },
      { label: "A message to every patient after the visit", value: "every" }
    ] }
  ];
  var ASSUME = {
    afterHoursPer100Visits: 15,
    enquiriesPer100Visits: 8,
    baseNoShowRate: 0.21,
    // BMJ Open 2016 (R12): no-reminder control groups
    googleFindShare: 0.1,
    reviewRate: 0.1,
    reviewBookingEffect: 0.05,
    recallLift: 0.08,
    // Cochrane 2018 (R11): reminders when due bring back ~8 more patients in 100
    dueToReturn: { dentist: 0.4, derm: 0.35, physio: 0.5, gp: 0.2, other: 0.3 }
  };
  var SEVERITY = {
    night: { fast: 0, hour: 0.25, morning: 0.6, never: 0.9, self: 0.3 },
    enquiry: { always: 0, sometimes: 0.4, never: 0.8 },
    reminders: { confirm: 0, every: 0.2, some: 0.5, none: 0.9 },
    recall: { auto: 0, manual: 0.2, sometimes: 0.45, never: 0.8 },
    reviews: { every: 0, qr: 0.3, verbal: 0.6, none: 0.9 }
  };
  var WEIGHT = { night: 25, enquiry: 20, reminders: 20, recall: 20, reviews: 15 };
  var LOST_SHARE = { fast: 0.05, hour: 0.15, morning: 0.3, never: 0.5, self: 0.05 };
  var RECOVERABLE = { always: 0.02, sometimes: 0.08, never: 0.15 };
  var REMINDER_GAP = { none: 0.25, some: 0.15, every: 0.05, confirm: 0 };
  var RECALL_GAP = { never: 1, sometimes: 0.6, manual: 0.3, auto: 0 };
  var ASK_GAP = { none: 1, verbal: 0.8, qr: 0.6, every: 0 };
  var VITAL_NAMES = { 1: "Night replies", 2: "Enquiry follow-up", 3: "Show-up rate", 4: "Return visits", 5: "Google reviews" };
  var BANDS = [
    [40, { name: "Needs urgent attention", line: "Patients are slipping away at several points. Most of it is fixable." }],
    [65, { name: "Needs attention", line: "Some things work well. A few gaps are costing you patients every week." }],
    [85, { name: "Stable", line: "Your front desk is ahead of most clinics. One or two vitals need a look." }],
    [100, { name: "Healthy", line: "Very few patients slip through. You are doing this well." }]
  ];
  var flagFor = (severity) => severity >= 0.6 ? "Needs attention" : severity >= 0.2 ? "Borderline" : "Normal";
  var bandFor = (score2) => BANDS.find(([max]) => score2 <= max)[1];
  function inr(n) {
    const s = String(floorSafe(Math.abs(n)));
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    return (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + last3;
  }
  var pct = (x) => `${Math.round(x * 1e3) / 10}%`;
  var floorSafe = (x) => Math.floor(x + 1e-6);
  var down1000 = (x) => floorSafe(x / 1e3) * 1e3;
  var money = (x) => x < 1e3 ? "Under \u20B91,000" : `\u20B9${inr(down1000(x))}`;
  function score(a) {
    const keys = Object.keys(WEIGHT);
    return Math.round(keys.reduce((sum, k) => sum + WEIGHT[k] * (1 - SEVERITY[k][a[k]]), 0));
  }
  var EVIDENCE = {
    1: [
      { text: "In US online bookings, about 4 in 10 doctor appointments were made between 5 pm and 9 am.", src: "R1" },
      { text: "In a study of US sales enquiries, replying within an hour made firms about 7 times more likely to get a real conversation.", src: "R2" }
    ],
    2: [{ text: "In a study of US sales enquiries, replying within an hour made firms about 7 times more likely to get a real conversation.", src: "R2" }],
    3: [
      { text: "Across 21 trials, reminders cut no-shows from about 21 in 100 to 15 in 100.", src: "R12" },
      { text: "Two reminders work better than one.", src: "R5" },
      { text: "In one Indian children\u2019s dental OPD, 39 in 100 appointments were missed.", src: "R3" }
    ],
    4: [{ text: "For vaccinations, reminding patients when they were due brought back about 8 more in every 100 (75 studies).", src: "R11" }],
    5: [
      { text: "In a US survey across local businesses, about 2 in 3 people said they leave a review when asked.", src: "R7" },
      { text: "Most US patients surveyed read reviews before choosing a doctor.", src: "R9" },
      { text: "Google says more reviews can help your local ranking.", src: "R8" }
    ]
  };
  var BY_ID = (id) => TEAM.find((t) => t.id === id);
  var SPECIALTY_WORD = { dentist: "dental clinics", derm: "skin and hair clinics", physio: "physiotherapy clinics", gp: "general practices", other: "clinics like yours" };
  function compute(a, o = {}) {
    const V = a.visits, F = a.fee;
    const afterHoursPerMonth = o.afterHoursPerDay != null ? o.afterHoursPerDay * 30 : V * ASSUME.afterHoursPer100Visits / 100;
    const enquiriesPerMonth = o.enquiriesPerWeek != null ? o.enquiriesPerWeek * 52 / 12 : V * ASSUME.enquiriesPer100Visits / 100;
    const noShowRate = o.noShowsOutOf10 != null ? o.noShowsOutOf10 / 10 : ASSUME.baseNoShowRate;
    const rs = `\u20B9${inr(F)}`;
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
    const when = { fast: "quickly", hour: "within an hour", morning: "the next morning", never: "sometimes never", self: "from you, on your own phone" }[a.night];
    const sev = (k) => SEVERITY[k][a[k]];
    const mk = (id, k, confidence, patients, result, who, fixName, fix, working) => ({
      id,
      name: VITAL_NAMES[id],
      severity: sev(k),
      flag: flagFor(sev(k)),
      confidence,
      patients,
      loss: patients * F,
      result,
      working,
      specialist: BY_ID(who),
      fixName,
      fix,
      evidence: EVIDENCE[id]
    });
    const ahLabel = o.afterHoursPerDay != null ? `${o.afterHoursPerDay} messages after closing a day \xD7 30 days` : `${V} visits a month \xD7 15 messages after closing for every 100 visits`;
    const enqLabel = o.enquiriesPerWeek != null ? `${o.enquiriesPerWeek} enquiries a week that don\u2019t book (${round1(enquiriesPerMonth)} a month)` : `${V} visits a month \xD7 8 enquiries that don\u2019t book for every 100 visits`;
    const nsLabel = o.noShowsOutOf10 != null ? `${o.noShowsOutOf10} in 10 who don\u2019t turn up without reminders` : "21 in 100 who don\u2019t turn up without reminders (research)";
    const vitals = [
      mk(
        1,
        "night",
        "Our estimate",
        p1,
        a.night === "self" ? "You reply to late messages yourself. Patients get an answer, and you lose your evening." : `Patients who message after closing hear back ${when}. Many book with whichever clinic replies first.`,
        "front",
        "Cyvo night desk",
        "Replies in seconds on your number and books the appointment.",
        `${ahLabel} \xD7 ${pct(lostShare)} who book elsewhere when the reply comes ${when} (our estimate) \xD7 ${rs} a visit \xD7 12 months`
      ),
      mk(
        2,
        "enquiry",
        "Our estimate",
        p2,
        `People who ask about fees or timings and don\u2019t book are ${{ always: "always", sometimes: "only sometimes", never: "never" }[a.enquiry]} followed up.`,
        "front",
        "Cyvo follow-up",
        "Messages people who asked about fees or timings but didn\u2019t book.",
        `${enqLabel} \xD7 ${pct(recoverable)} a follow-up would win back (our estimate) \xD7 ${rs} a visit \xD7 12 months`
      ),
      mk(
        3,
        "reminders",
        "Backed by research",
        p3,
        `${{ none: "No reminders go out", some: "Only some patients get reminded", every: "Reminders go out, but patients can\u2019t confirm or reschedule by reply", confirm: "Reminders with confirm are in place" }[a.reminders]}.`,
        "reminder",
        "Cyvo reminders",
        "Two reminders, and patients confirm or reschedule by reply.",
        `${V} visits a month \xD7 ${nsLabel} \xD7 ${pct(gap)} of those that reminders prevent (research: about 25%) \xD7 ${rs} a visit \xD7 12 months`
      ),
      mk(
        4,
        "recall",
        "Research + our estimate",
        p4,
        `Patients due for their next visit are ${{ never: "not reminded", sometimes: "only sometimes reminded", manual: "reminded by hand", auto: "reminded automatically" }[a.recall]}.`,
        "recall",
        "Cyvo recall",
        "Messages patients when their next visit is due, with open slots.",
        `${V} visits a month \xD7 ${pct(due)} due for a next visit at ${SPECIALTY_WORD[a.specialty]} (our estimate) \xD7 8 in 100 more who come back when reminded (research) \xD7 ${pct(recallGap)} not reminded today \xD7 ${rs} a visit \xD7 12 months`
      ),
      mk(
        5,
        "reviews",
        "Research + our estimate",
        p5,
        `About ${inr(reviewsMissed)} patients a year leave without being asked for a Google review.`,
        "reviews",
        "Cyvo reviews",
        "Asks every patient for a Google review after the visit.",
        `${V} visits a month \xD7 10% new patients who find you on Google \xD7 ${pct(askGap)} of patients not asked \xD7 5% more Google patients with steady new reviews (our estimates) \xD7 ${rs} a visit \xD7 12 months`
      )
    ];
    const totalLoss = vitals.reduce((s, v) => s + v.loss, 0);
    const totalPatients = vitals.reduce((s, v) => s + v.patients, 0);
    const weakest = vitals.reduce((w, v) => v.loss > w.loss ? v : w, vitals[0]);
    const sc = score(a);
    return {
      score: sc,
      band: bandFor(sc),
      vitals,
      totalLoss,
      totalPatients: floorSafe(totalPatients),
      weakest,
      reviewsMissed: floorSafe(reviewsMissed),
      assumed: { afterHoursPerMonth, enquiriesPerMonth, noShowRate }
    };
  }
  var round1 = (x) => Math.round(x * 10) / 10;
  var adjustDefaults = (a) => ({
    afterHoursPerDay: Math.max(1, Math.round(a.visits * ASSUME.afterHoursPer100Visits / 100 / 30)),
    enquiriesPerWeek: Math.max(1, Math.round(a.visits * ASSUME.enquiriesPer100Visits / 100 * 12 / 52)),
    noShowsOutOf10: Math.round(ASSUME.baseNoShowRate * 10)
  });
  function encodeAnswers(a) {
    return QUESTIONS.map((q) => String(a[q.key])).join(".");
  }
  function decodeAnswers(code) {
    if (!code) return null;
    const parts = code.split(".");
    if (parts.length !== QUESTIONS.length) return null;
    const out = {};
    for (let i = 0; i < QUESTIONS.length; i++) {
      const opt = QUESTIONS[i].options.find((o) => String(o.value) === parts[i]);
      if (!opt) return null;
      out[QUESTIONS[i].key] = opt.value;
    }
    return out;
  }
  var FOUNDING_PLACES = FOUNDING.places;
  var sortedByLoss = (r) => [...r.vitals].sort((x, y) => y.loss - x.loss);
  function whatsappReportText(name, clinic, r, reportUrl) {
    return [
      `Hi ${name}, here is the Clinic Vitals report for ${clinic}.`,
      "",
      `Score: ${r.score}/100`,
      `Estimated loss: about ${money(r.totalLoss)} a year, roughly ${inr(r.totalPatients)} patients.`,
      `Weakest vital: ${r.weakest.name}`,
      "",
      `The full breakdown and how we calculated it: ${reportUrl}`,
      "",
      `Cyvo is being set up with ${FOUNDING_PLACES} Mumbai clinics first. Reply FOUNDING and I\u2019ll tell you how it would work at ${clinic}.`,
      "",
      "Shehbaz, Cyvo",
      "Reply STOP to stop messages."
    ].join("\n");
  }
  return __toCommonJS(logic_exports);
})();
