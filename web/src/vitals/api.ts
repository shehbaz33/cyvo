import { CONSENT_VERSION, VITALS_ENDPOINT } from '../data/content';
import type { Answers } from './logic';

/* Talks to the Apps Script backend. Bodies go as text/plain so the browser sends a "simple" request
   (no CORS preflight, which Apps Script cannot answer). The backend recomputes the score from the
   answers itself, so it never trusts numbers sent from the page. */

export type Submission = {
  src: string; c: string; ref: string;
  name: string; clinic: string; channel: 'whatsapp' | 'email'; contact: string;
  consent: 'checkbox' | 'in_person';
  answers: Answers;
  website: string; // honeypot: real people leave it empty
};
/* reportUrl carries only a random report ID, never the doctor's name or clinic. */
export type SubmitResult =
  | { ok: true; leadId: string; reportUrl: string; sent: 'yes' | 'queued' | 'failed' }
  | { ok: false; reason: 'not_configured' | 'network' | 'rejected' };

async function post(body: object): Promise<Response> {
  return fetch(VITALS_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
}

export async function submit(s: Submission): Promise<SubmitResult> {
  if (!VITALS_ENDPOINT) return { ok: false, reason: 'not_configured' };
  try {
    const res = await post({ type: 'submit', consentVersion: CONSENT_VERSION, ...s });
    const json = await res.json();
    return json.ok ? { ok: true, leadId: String(json.leadId), reportUrl: String(json.reportUrl), sent: json.sent } : { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

/* Funnel events: the type, the traffic source and at most a step number. Never answers or contact details. */
export type EventType = 'start' | 'q_reached' | 'score_view' | 'form_step' | 'submit' | 'founding_click' | 'share_click' | 'hero_demo' | 'hero_check';
export function track(type: EventType, src: string, n?: number) {
  if (!VITALS_ENDPOINT) return;
  post({ type: 'event', event: type, src, n: n ?? '' }).catch(() => {});
}

/* Flow A: a clinic ID from the pipeline sheet prefills name and clinic on the gate. */
export async function prefill(c: string): Promise<{ name: string; clinic: string } | null> {
  if (!VITALS_ENDPOINT || !c) return null;
  try {
    const res = await fetch(`${VITALS_ENDPOINT}?action=prefill&c=${encodeURIComponent(c)}`);
    const json = await res.json();
    return json.ok ? { name: json.name || '', clinic: json.clinic || '' } : null;
  } catch {
    return null;
  }
}

/* A sent report: the link holds only its random ID; name, clinic and answers come from the sheet. */
export type StoredReport = { answers: string; name: string; clinic: string; date: string; leadId: string };
export async function loadReport(id: string): Promise<StoredReport | null> {
  if (!VITALS_ENDPOINT || !id) return null;
  try {
    const res = await fetch(`${VITALS_ENDPOINT}?action=report&id=${encodeURIComponent(id)}`);
    const json = await res.json();
    return json.ok ? json : null;
  } catch {
    return null;
  }
}
