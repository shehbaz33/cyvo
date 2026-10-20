/* Cyvo Clinic Vitals backend (Google Apps Script, bound to the pipeline sheet).
   Setup steps are in README.md next to this file.

   Script properties (Project settings → Script properties):
     SITE_URL          https://your-domain        (no trailing slash; report links point here)
     ALERT_EMAIL       where new-lead alerts go   (defaults to the script owner)
     SECRET            any long random string     (signs unsubscribe links)
     WA_MODE           manual | api               (manual until Meta approves the template)
     WA_TOKEN          WhatsApp Cloud API permanent token            (api mode only)
     WA_PHONE_ID       WhatsApp Cloud API phone number ID            (api mode only)
     WA_TEMPLATE       approved template name, e.g. clinic_vitals_report (api mode only)
     WA_TEMPLATE_LANG  template language code, e.g. en               (api mode only)

   Scoring comes from Logic.gs (generated from web/src/vitals/logic.ts), never from the page. */

const LEADS = 'Leads';
const EVENTS = 'Events';
const CLINICS = 'Clinics';
const COLS = ['lead_id', 'timestamp', 'src', 'c', 'ref', 'name', 'clinic', 'channel', 'contact', 'consent', 'answers', 'score', 'totalLoss', 'weakestVital', 'report_sent', 'status', 'report_id', 'consent_version', 'opted_out_at'];
const EVENT_COLS = ['timestamp', 'type', 'src', 'n'];
/* Funnel events from the page: type, source and at most a step number. Never answers or contact details. */
const EVENT_TYPES = ['start', 'q_reached', 'score_view', 'form_step', 'submit', 'founding_click', 'share_click', 'hero_demo', 'hero_check'];
const TZ = 'Asia/Kolkata';
const CYVO_WA = '919920805299';
const CYVO_WA_DISPLAY = '+91 99208 05299';

const prop = (k, d) => PropertiesService.getScriptProperties().getProperty(k) || d || '';
const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Entry points ---------- */
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false }); }
  if (body.type === 'event' && EVENT_TYPES.indexOf(body.event) >= 0) {
    const n = Number(body.n);
    sheet_(EVENTS, EVENT_COLS).appendRow([new Date(), body.event, clip(body.src, 20), n >= 1 && n <= 20 ? n : '']);
    return json({ ok: true });
  }
  if (body.type === 'submit') return json(handleSubmit_(body));
  return json({ ok: false });
}

function doGet(e) {
  const p = e.parameter || {};
  if (p.action === 'report') {
    // A report link carries only this random ID; name, clinic and answers stay in the sheet.
    const id = clip(p.id, 40);
    const row = id.length >= 12 ? findRow_(sheet_(LEADS, COLS), COLS.indexOf('report_id'), id) : null;
    if (!row) return json({ ok: false });
    const v = (k) => row.values[COLS.indexOf(k)];
    return json({ ok: true, answers: v('answers'), name: v('name'), clinic: v('clinic'), date: Utilities.formatDate(new Date(v('timestamp')), TZ, 'yyyy-MM-dd'), leadId: v('lead_id') });
  }
  if (p.action === 'prefill') {
    const row = findRow_(sheet_(CLINICS, ['c', 'name', 'clinic']), 0, clip(p.c, 40));
    return json(row ? { ok: true, name: row.values[1], clinic: row.values[2] } : { ok: false });
  }
  if (p.action === 'stop') {
    if (p.k !== sign_(p.id)) return HtmlService.createHtmlOutput('<p>This link is not valid.</p>');
    const sh = sheet_(LEADS, COLS);
    const row = findRow_(sh, 0, p.id);
    if (row) {
      sh.getRange(row.index, COLS.indexOf('status') + 1).setValue('opted_out');
      sh.getRange(row.index, COLS.indexOf('opted_out_at') + 1).setValue(new Date());
    }
    return HtmlService.createHtmlOutput('<p style="font:17px/1.5 system-ui,sans-serif;padding:24px">Done. You won’t get more messages from Cyvo. Your report stays yours to keep.</p>');
  }
  return ContentService.createTextOutput('Cyvo Clinic Vitals');
}

/* ---------- Submission ---------- */
function handleSubmit_(b) {
  if (b.website) return { ok: true, leadId: '', sent: 'queued' }; // honeypot: quietly ignore bots

  const code = CyvoVitals.QUESTIONS.map((q) => String(b.answers && b.answers[q.key])).join('.');
  const a = CyvoVitals.decodeAnswers(code);
  const name = clip(b.name, 80), clinic = clip(b.clinic, 100), channel = b.channel;
  const contact = clip(b.contact, 120);
  const consent = b.consent === 'in_person' ? 'in_person' : b.consent === 'checkbox' ? 'checkbox' : '';
  const validContact = channel === 'whatsapp' ? /^\+91[6-9]\d{9}$/.test(contact) : channel === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) : false;
  if (!a || !name || !clinic || !validContact || !consent) return { ok: false };

  // At most 3 sends per contact per hour (stops someone flooding a stranger's inbox).
  const cache = CacheService.getScriptCache();
  const ck = 'n:' + contact.toLowerCase();
  const n = Number(cache.get(ck) || 0);
  if (n >= 3) return { ok: false };
  cache.put(ck, String(n + 1), 3600);

  const r = CyvoVitals.compute(a);
  const date = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let leadId, rowIndex;
  const sh = sheet_(LEADS, COLS);
  try {
    // Retake from the same contact: update the row, keep its status (follow-ups don't restart).
    const existing = findRow_(sh, COLS.indexOf('contact'), contact);
    const values = [
      '', new Date(), clip(b.src, 20), clip(b.c, 40), clip(b.ref, 40), name, clinic, channel, contact, consent,
      code, r.score, Math.floor(r.totalLoss / 1000) * 1000, r.weakest.name, 'pending', 'new',
      '', clip(b.consentVersion, 40), '',
    ];
    if (existing) {
      leadId = existing.values[0];
      values[0] = leadId;
      values[COLS.indexOf('report_id')] = existing.values[COLS.indexOf('report_id')] || newReportId_();
      values[COLS.indexOf('status')] = existing.values[COLS.indexOf('status')] === 'opted_out' ? 'new' : existing.values[COLS.indexOf('status')];
      rowIndex = existing.index;
      sh.getRange(rowIndex, 1, 1, COLS.length).setValues([values]);
    } else {
      leadId = Utilities.getUuid().slice(0, 8);
      values[0] = leadId;
      values[COLS.indexOf('report_id')] = newReportId_();
      sh.appendRow(values);
      rowIndex = sh.getLastRow();
    }
  } finally {
    lock.releaseLock();
  }

  // The link holds only the random report ID: no name or clinic in the address.
  const url = prop('SITE_URL') + '/vitals.html?report=' + sh.getRange(rowIndex, COLS.indexOf('report_id') + 1).getValue();
  const pdf = reportPdf_(a, r, name, clinic, date);
  let sent = 'failed';
  try {
    if (channel === 'email') { sendEmail_(contact, name, clinic, r, pdf, url, leadId); sent = 'yes'; }
    else if (prop('WA_MODE', 'manual') === 'api') { sendWhatsApp_(contact, name, clinic, r, pdf); sent = 'yes'; }
    else sent = 'queued'; // manual mode: the alert below carries a one-tap send link
  } catch (err) {
    console.error(err);
    sent = 'failed';
  }
  sh.getRange(rowIndex, COLS.indexOf('report_sent') + 1).setValue(sent === 'queued' ? 'manual' : sent);
  alert_({ leadId, name, clinic, channel, contact, src: clip(b.src, 20), r, url, pdf, sent });
  return { ok: true, leadId, sent, reportUrl: url };
}

/* ---------- Delivery ---------- */
function sendEmail_(to, name, clinic, r, pdf, url, leadId) {
  const stop = ScriptApp.getService().getUrl() + '?action=stop&id=' + leadId + '&k=' + sign_(leadId);
  const chat = 'https://wa.me/' + CYVO_WA + '?text=' + encodeURIComponent("Hi, I just checked my clinic's vitals. I'd like a demo.");
  const lines = [
    'Hi ' + name + ',', '',
    'Here is the Clinic Vitals report for ' + clinic + '.', '',
    'Score: ' + r.score + '/100 (' + r.band.name + ')',
    'Estimated loss: about ' + CyvoVitals.money(r.totalLoss) + ' a year, roughly ' + CyvoVitals.inr(r.totalPatients) + ' patients.',
    'Weakest vital: ' + r.weakest.name, '',
    'The PDF shows each vital, what it costs, how we worked it out and the sources we used. You can also open it online: ' + url, '',
    'Cyvo is an assistant that runs on your clinic’s own WhatsApp number. It replies to patients at any hour, books and reminds them, and asks for reviews. I’m setting it up with ' + CyvoVitals.FOUNDING_PLACES + ' Mumbai clinics first. Reply FOUNDING and I’ll tell you how it would work at ' + clinic + '.', '',
    'Message me on WhatsApp: ' + chat, '',
    'Shehbaz', 'Cyvo, Mumbai', '',
    'You got this because you asked for your report. Unsubscribe: ' + stop,
  ];
  const html = lines.map((l) => (l ? esc(l).replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>') : '')).join('<br>');
  MailApp.sendEmail({
    to: to, subject: name + ', your Clinic Vitals report: ' + r.score + '/100',
    body: lines.join('\n'), htmlBody: '<div style="font:15px/1.5 Arial,sans-serif;color:#141c30">' + html + '</div>',
    attachments: [pdf], name: 'Shehbaz, Cyvo',
  });
}

/* Business-initiated message: only an approved template can open the chat. The PDF goes in the
   template's document header, so it arrives as one message with the report preview on top. */
function sendWhatsApp_(contact, name, clinic, r, pdf) {
  const base = 'https://graph.facebook.com/v21.0/' + prop('WA_PHONE_ID');
  const auth = { Authorization: 'Bearer ' + prop('WA_TOKEN') };
  const up = UrlFetchApp.fetch(base + '/media', {
    method: 'post', headers: auth, muteHttpExceptions: true,
    payload: { messaging_product: 'whatsapp', type: 'application/pdf', file: pdf },
  });
  const mediaId = JSON.parse(up.getContentText()).id;
  if (!mediaId) throw new Error('Media upload failed: ' + up.getContentText());
  const text = (s) => ({ type: 'text', text: String(s) });
  const res = UrlFetchApp.fetch(base + '/messages', {
    method: 'post', contentType: 'application/json', headers: auth, muteHttpExceptions: true,
    payload: JSON.stringify({
      messaging_product: 'whatsapp', to: contact.replace('+', ''), type: 'template',
      template: {
        name: prop('WA_TEMPLATE', 'clinic_vitals_report'), language: { code: prop('WA_TEMPLATE_LANG', 'en') },
        components: [
          { type: 'header', parameters: [{ type: 'document', document: { id: mediaId, filename: pdf.getName() } }] },
          { type: 'body', parameters: [text(name), text(clinic), text(r.score), text(CyvoVitals.money(r.totalLoss).replace('₹', '')), text(CyvoVitals.inr(r.totalPatients)), text(r.weakest.name)] },
        ],
      },
    }),
  });
  if (res.getResponseCode() >= 300) throw new Error('Template send failed: ' + res.getContentText());
}

/* Every lead emails Shehbaz: details, a one-tap link that opens WhatsApp with the report message ready
   (manual mode), the day 1–2 follow-up for the weakest vital, and the PDF to forward. */
function alert_(o) {
  const digits = o.contact.replace(/\D/g, '');
  const reportMsg = CyvoVitals.whatsappReportText(o.name, o.clinic, o.r, o.url);
  const follow = FOLLOW_UP[o.r.weakest.id].replace('{{name}}', o.name).replace('{{clinic}}', o.clinic).replace('{{places}}', String(CyvoVitals.FOUNDING_PLACES)).replace('{{reviewsMissed}}', CyvoVitals.inr(o.r.reviewsMissed));
  const status = o.sent === 'yes' ? 'Report sent automatically.' : o.sent === 'queued' ? 'ACTION: send the report on WhatsApp (link below).' : 'FAILED to send. Message or call within the day.';
  const rows = [
    ['Status', status], ['Name', o.name], ['Clinic', o.clinic], ['Contact', o.contact + ' (' + o.channel + ')'], ['Source', o.src],
    ['Score', o.r.score + '/100 · ' + o.r.band.name], ['Estimated loss', CyvoVitals.money(o.r.totalLoss) + ' a year · ' + CyvoVitals.inr(o.r.totalPatients) + ' patients'],
    ['Weakest vital', o.r.weakest.name], ['Lead ID', o.leadId],
  ];
  let html = '<div style="font:15px/1.5 Arial,sans-serif;color:#141c30"><table cellpadding="4">' + rows.map((r) => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table>';
  if (o.channel === 'whatsapp' && o.sent !== 'yes') html += '<p><a href="https://wa.me/' + digits + '?text=' + encodeURIComponent(reportMsg) + '" style="background:#cf4417;color:#fff;padding:12px 18px;text-decoration:none;display:inline-block">Send report on WhatsApp</a> &nbsp;then attach the PDF from this email.</p>';
  html += '<p><a href="' + esc(o.url) + '">Open the web report</a></p>';
  if (o.channel === 'whatsapp') html += '<p><b>Day 1–2 follow-up</b> (only if no FOUNDING reply):<br><a href="https://wa.me/' + digits + '?text=' + encodeURIComponent(follow) + '">' + esc(follow) + '</a></p>';
  else html += '<p><b>Day 1–2 follow-up</b> (only if no reply): ' + esc(follow) + '</p>';
  html += '</div>';
  MailApp.sendEmail({ to: prop('ALERT_EMAIL', Session.getEffectiveUser().getEmail()), subject: (o.sent === 'yes' ? '' : o.sent === 'queued' ? '[Send] ' : '[FAILED] ') + 'Clinic Vitals: ' + o.name + ', ' + o.clinic + ' · ' + o.r.score + '/100', htmlBody: html, attachments: [o.pdf], name: 'Cyvo Clinic Vitals' });
}

const FOLLOW_UP = {
  1: 'Hi {{name}}, Shehbaz from Cyvo. Your Clinic Vitals report showed night replies are your weakest vital. A 10:30 pm patient waits until morning. I’m setting Cyvo up with {{places}} Mumbai clinics first, starting with exactly this. Want me to hold a place for {{clinic}}?',
  2: 'Hi {{name}}, Shehbaz from Cyvo. Your Clinic Vitals report showed people ask about fees or timings and nobody follows up. They were already interested. I’m setting Cyvo up with {{places}} Mumbai clinics first, starting with exactly this. Want me to hold a place for {{clinic}}?',
  3: 'Hi {{name}}, Shehbaz from Cyvo. Your Clinic Vitals report flagged your show-up rate. Cyvo reminds every patient and lets them confirm or reschedule by reply. I’m setting Cyvo up with {{places}} Mumbai clinics first, starting with exactly this. Want me to hold a place for {{clinic}}?',
  4: 'Hi {{name}}, Shehbaz from Cyvo. Your Clinic Vitals report showed patients due for their next visit aren’t reminded, so many don’t come back. Cyvo messages them when they’re due, with open slots. I’m setting Cyvo up with {{places}} Mumbai clinics first, starting with exactly this. Want me to hold a place for {{clinic}}?',
  5: 'Hi {{name}}, Shehbaz from Cyvo. Your Clinic Vitals report showed about {{reviewsMissed}} patients a year leave without being asked for a Google review. Cyvo asks every patient after the visit. I’m setting Cyvo up with {{places}} Mumbai clinics first, starting with exactly this. Want me to hold a place for {{clinic}}?',
};

/* ---------- PDF (same content as the web report) ---------- */
const WHAT_CYVO_IS = 'Cyvo is an assistant that runs on your clinic’s own WhatsApp number. It replies to patients at any hour, books and reminds them, and asks for reviews, the way a good receptionist would. We are setting it up with a small group of Mumbai clinics first.';

/* The founding-clinic offer, same lines as the web report (empty config lines are left out). */
function foundingHtml_(r, clinic) {
  const F = CyvoVitals.FOUNDING;
  const items = ['Setup on your own WhatsApp number, done in person by Shehbaz', 'Your weakest vital (' + r.weakest.name + ') fixed first', F.setupLine, 'The founding monthly price kept for as long as you stay', F.guaranteeLine].filter(Boolean);
  return '<div class="box" style="background:#e4e5fd"><b>Founding clinics: ' + F.places + ' places in Mumbai</b><br>Cyvo is being set up with ' + F.places + ' Mumbai clinics first. A founding clinic gets:<ul>' +
    items.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
    (F.depositRupees > 0 ? 'Reserve a place with a refundable ₹' + CyvoVitals.inr(F.depositRupees) + ' deposit. If you change your mind before setup, you get it back.<br>' : '') +
    'Ask for a founding place on WhatsApp: ' + CYVO_WA_DISPLAY + ' · wa.me/' + CYVO_WA + '</div>';
}

/* 16 random hex characters: the only thing a report link carries. */
function newReportId_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }

function reportPdf_(a, r, name, clinic, date) {
  const flagColour = { 'Needs attention': '#b3261e', Borderline: '#8a5a00', Normal: '#2f7a4a' };
  const nice = Utilities.formatDate(new Date(date + 'T12:00:00'), TZ, 'd MMMM yyyy');
  const V = a.visits;
  const rows = CyvoVitals.sortedByLoss(r).map((v) =>
    '<tr><td><b>' + esc(v.name) + '</b><br><span class="m">' + esc(v.result) + '</span></td>' +
    '<td style="color:' + flagColour[v.flag] + '"><b>' + v.flag + '</b></td>' +
    '<td class="n">' + CyvoVitals.money(v.loss) + '</td><td class="n">' + CyvoVitals.inr(v.patients) + '</td>' +
    '<td>' + v.confidence + '</td><td class="m"><b>' + esc(v.fixName) + '</b><br>' + esc(v.fix) + '</td></tr>' +
    '<tr><td colspan="6" class="m" style="background:#fbf6f4">Research: ' + v.evidence.map((e) => esc(e.text) + ' [' + esc(CyvoVitals.SOURCES[e.src].short) + ']').join(' ') + '</td></tr>').join('');
  const calc = r.vitals.map((v) => '<li><b>' + esc(v.name) + '</b><br>' + esc(v.working) + ' = ' + CyvoVitals.money(v.loss) + '</li>').join('');
  const html = '<html><head><style>' +
    'body{font-family:Arial,sans-serif;color:#141c30;font-size:11pt;line-height:1.45}h1{font-size:22pt;margin:0 0 4px}h2{font-size:15pt;margin:22px 0 6px}' +
    '.m{color:#474c60;font-size:9.5pt}.n{white-space:nowrap;font-weight:bold}table{border-collapse:collapse;width:100%;margin-top:8px}' +
    'td,th{border-bottom:1px solid #e6deda;padding:7px 6px;vertical-align:top;text-align:left;font-size:9.5pt}th{font-size:8pt;text-transform:uppercase;color:#5d6175}' +
    '.box{background:#f6d66b;padding:12px 14px;margin-top:12px}.big{font-size:20pt;font-weight:bold}li{margin-bottom:8px}.foot{color:#5d6175;font-size:8.5pt;margin-top:18px}' +
    '</style></head><body>' +
    '<h1>' + esc(clinic) + ': Clinic Vitals report</h1><div class="m">' + nice + ' · Prepared for ' + esc(name) + '</div>' +
    '<p><span class="big">' + r.score + '/100</span> &nbsp; <b>' + r.band.name + '</b><br>' + r.band.line + '</p>' +
    '<div class="box"><span class="big">About ' + CyvoVitals.money(r.totalLoss) + ' a year</span><br>Roughly ' + CyvoVitals.inr(r.totalPatients) + ' patients a year · estimate, rounded down</div>' +
    '<p class="m" style="background:#e4e5fd;padding:8px 10px">' + WHAT_CYVO_IS + '</p>' +
    '<table><tr><th>Vital</th><th>Flag</th><th>Loss / year</th><th>Patients</th><th>How sure</th><th>Who fixes it</th></tr>' + rows + '</table>' +
    '<div style="page-break-before:always"></div>' +
    '<h2>How we calculated this</h2><p>These are estimates from your answers and the rates below. We round every number down.</p><ol>' + calc + '</ol>' +
    '<h2>What is our estimate, not research</h2><ul>' +
    '<li>About 15 messages or calls after closing for every 100 visits a month (' + CyvoVitals.inr(Math.round(V * 0.15)) + ' a month for you).</li>' +
    '<li>About 8 daytime enquiries that don’t book for every 100 visits (' + CyvoVitals.inr(Math.round(V * 0.08)) + ' a month for you).</li>' +
    '<li>How many night-time patients book elsewhere, by how fast you reply.</li><li>How many patients are due for a next visit at a clinic like yours.</li>' +
    '<li>About 10% of visits are new patients who found you on Google, and 1 in 10 patients who are asked leave a review. That is far below the 2 in 3 the research finds, to stay on the safe side.</li></ul>' +
    '<h2>Where the numbers come from</h2><ol>' +
    ['R1', 'R2', 'R12', 'R5', 'R3', 'R11', 'R7', 'R9', 'R8'].map((id) => '<li>' + esc(CyvoVitals.SOURCES[id].full) + '<br><span class="m">' + esc(CyvoVitals.SOURCES[id].url) + '</span></li>').join('') + '</ol>' +
    '<p class="m">Some studies were done outside India or on sales enquiries rather than patients. We use them as a guide and keep our own numbers on the low side.</p>' +
    '<p>If your numbers are different, use “Adjust for your clinic” on the web report.</p>' +
    foundingHtml_(r, clinic) +
    '<p class="foot">Cyvo, Mumbai · ' + esc(prop('SITE_URL')) + '/data.html · All figures are estimates.</p>' +
    '</body></html>';
  return HtmlService.createHtmlOutput(html).getBlob().getAs('application/pdf').setName('Clinic Vitals - ' + clinic.replace(/[^\w\s-]/g, '') + '.pdf');
}

/* ---------- Sheet helpers ---------- */
function sheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
function findRow_(sh, col, value) {
  if (!value || sh.getLastRow() < 2) return null;
  const data = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
  for (let i = data.length - 1; i >= 0; i--) if (String(data[i][col]) === String(value)) return { index: i + 2, values: data[i] };
  return null;
}
function sign_(id) {
  const raw = Utilities.computeHmacSha256Signature(String(id || ''), prop('SECRET', 'change-me'));
  return Utilities.base64EncodeWebSafe(raw).slice(0, 16);
}

/* ---------- One-time setup and housekeeping ---------- */
/* Run once from the editor: creates the sheets and a daily cleanup trigger. */
function setup() {
  sheet_(LEADS, COLS); sheet_(EVENTS, EVENT_COLS); sheet_(CLINICS, ['c', 'name', 'clinic']);
  ScriptApp.getProjectTriggers().forEach((t) => { if (t.getHandlerFunction() === 'cleanupColdLeads') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('cleanupColdLeads').timeBased().everyDays(1).atHour(3).create();
}
/* Daily: leads marked "cold" are deleted 90 days after their last submission; opted-out leads are cut down to contact + flag after 90 days. */
function cleanupColdLeads() {
  const sh = sheet_(LEADS, COLS);
  if (sh.getLastRow() < 2) return;
  const data = sh.getRange(2, 1, sh.getLastRow() - 1, COLS.length).getValues();
  const cutoff = Date.now() - 90 * 24 * 3600 * 1000;
  for (let i = data.length - 1; i >= 0; i--) {
    const status = data[i][COLS.indexOf('status')];
    if (status === 'cold' && new Date(data[i][1]).getTime() < cutoff) sh.deleteRow(i + 2);
    // Opted out: after 90 days keep only the contact and the flag, so we never message them again.
    if (status === 'opted_out' && new Date(data[i][COLS.indexOf('opted_out_at')] || data[i][1]).getTime() < cutoff) {
      const keep = COLS.map((k, j) => (['lead_id', 'contact', 'status', 'opted_out_at'].indexOf(k) >= 0 ? data[i][j] : ''));
      sh.getRange(i + 2, 1, 1, COLS.length).setValues([keep]);
    }
  }
}
/* Test from the editor: sends the section 9 test case to ALERT_EMAIL as an email report. */
function testSubmit() {
  const a = CyvoVitals.decodeAnswers('dentist.350.750.morning.never.some.never.verbal');
  console.log(JSON.stringify(handleSubmit_({ src: 'test', name: 'Dr. Test', clinic: 'Test Clinic', channel: 'email', contact: prop('ALERT_EMAIL', Session.getEffectiveUser().getEmail()), consent: 'checkbox', consentVersion: 'test', answers: a })));
}
