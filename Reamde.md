# Cyvo landing page

One page for Cyvo, a WhatsApp front desk for private clinics in Mumbai. This README is the brief for building it. Read it fully before writing any code, and use the project's landing-page skill for design.

## What this page is for

The page has two jobs:

1. Be the link in the Instagram bio (@cyvowork) and in DM signatures, so a doctor who checks Cyvo after a DM finds something credible.
2. Be easy for one doctor to forward to another in a WhatsApp group.

It is not built to convert cold traffic. There is no SEO work, no ad landing variants and no email capture. The only call to action is a WhatsApp click-to-chat button.

Success is measured by one thing: doctors who open the page and then message on WhatsApp asking for a demo. Everything on the page should help that or be cut.

## Who reads it

- Single-doctor private clinics in Mumbai: dentists and dermatologists first (specialty is being tested, so copy must work for both), physiotherapists later.
- Most will open it on a mid-range Android phone, inside the WhatsApp or Instagram in-app browser, often on mobile data.
- Many are not tech-comfortable. They care about patients, rupees, their receptionist's time and Google reviews. They do not care about AI, LLMs or agents as technology.
- They have likely been cold-called by other "AI receptionist" vendors. They are sceptical of big claims.

## Positioning

- One line: a front desk team that works on your clinic's WhatsApp and takes instructions from you on WhatsApp.
- Tagline: "Your clinic runs. Even when you don't." Supporting line: "Tell it once. It remembers."
- Cyvo gives the receptionist a team. It never replaces her.
- Differentiators to show on the page:
  - Answers and books patients at night, on the clinic's own number.
  - The doctor instructs it on WhatsApp in plain language ("Kal clinic band hai") and every booking follows that rule.
  - Set up in person at the clinic, in Mumbai. A named local person to call.
  - A weekly report card on WhatsApp showing what it did, with a rupee estimate.
  - Cancel with one message. No lock-in.

Angle priority on the page: the 10:30 pm patient leads; "tell it once", "your receptionist gets a team", "set up in person" and "proof every Sunday" support it.

## Page sections, in order

1. **Hero.** Headline: "Your clinic answers WhatsApp at 11 pm. Even when you don't." Sub-line: "A front desk team on your clinic's own WhatsApp number, set up in person in Mumbai." Primary button: "Message us on WhatsApp".
2. **After-hours finding.** "We messaged {{X}} Mumbai clinics after 10 pm. Median first reply: {{Y}} hours." Anonymised. Keep this as a placeholder block that is easy to fill once the tests on 18 and 25 Oct are done. Until then it can be hidden or replaced with a neutral line.
3. **How it works, three steps.** We set it up at your clinic. It answers and books your patients, day and night. You instruct it on WhatsApp.
4. **The "tell it once" moment.** A mock WhatsApp exchange: doctor types "Kal clinic band hai", Cyvo confirms the closure and asks about existing bookings, then a patient asking for tomorrow is offered the next open day. Built in HTML/CSS, not a screenshot of a real chat.
5. **Sample Sunday report card.** Mock clinic, clearly labelled "Sample". Example figures: appointments booked, how many after hours, no-shows prevented, new Google reviews, and an estimated rupee figure labelled as an estimate.
6. **Receptionist section.** "Gives your receptionist a team." She gets a take-over button and a "needs you" list. The agents handle volume; she handles people.
7. **The team.** Swagat (answers and books) and Yaad (reminders and confirmations) as live. Shukriya (review requests) and Wapsi (brings back patients due for follow-ups) marked "Coming soon". Short first-person one-liners are fine, for example "I answer your patients at 11 pm so they don't book somewhere else." Patients never see these names; say so in small text.
8. **Pricing line.** "One-time setup fee plus a monthly fee. Cancel with one message." No numbers until pricing is decided. Build it so numbers can be dropped in later.
9. **Data and privacy.** One or two lines plus a link to the data page.
10. **Final call to action.** Repeat the WhatsApp button, plus a line that the founder comes to the clinic for a 5-minute demo.
11. **Footer.** Cyvo, Mumbai, link to the data page, link to Instagram. No WhatsApp logo.

## Second page: data.html

Plain-language data handling page. Short, readable on a phone.

- What Cyvo stores (clinic profile, appointments, patient phone numbers and names, message history) and what it does not (no diagnosis, prescriptions or medical records).
- Where it is stored and for how long. Use placeholders where the answer is not settled.
- Who can see it (the clinic's own staff and Cyvo for support only).
- Phone numbers encrypted at rest.
- Each clinic signs a simple data agreement; the clinic informs its patients.
- How a clinic or patient asks for data to be deleted.
- Contact for data questions.
- Written for the DPDP Act, but in plain language, without claiming certification or "fully compliant".

## WhatsApp button

- Use a click-to-chat link: `https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27d%20like%20a%20demo%20for%20my%20clinic`
- Keep the number and the pre-filled text in one config constant at the top of the file so they change in one place.
- Optional: a second pre-filled text variant for the final section, so it is possible to tell which button was used.
- Label the button with words ("Message us on WhatsApp"). Do not use the WhatsApp logo or green-bubble trademark styling.

## Copy rules

- Plain English. Short sentences. Rupees, minutes and patients.
- No "AI-powered", "transform", "revolutionise", "cutting-edge", "seamless", "game-changer".
- Never say "replaces your receptionist".
- No percentages or results without a source. Any rupee figure is labelled "estimate" and only uses a sample clinic.
- Hinglish lines are allowed where they are natural ("Kal clinic band hai"), with English meaning nearby if needed.
- Sentence case for headings. No emoji.

## Compliance limits (do not break these)

- **Meta branding.** No WhatsApp logo. Never write "WhatsApp approved", "official WhatsApp partner" or similar.
- **Google review policy.** Say "asks every patient for a review". Never "gets you 5-star reviews", never imply asking only happy patients, no incentives.
- **Claims.** ASCI expects ad claims to be substantiated. The after-hours figure shows only real test results; the report card is labelled as a sample; every rupee figure is labelled an estimate.
- **Patient data.** Mock clinic and invented patients only, in every chat mock and report card. No screenshots from a real clinic.
- **After-hours test.** Never name or show a specific clinic.
- **Doctor testimonials.** None for now. NMC conduct rules limit doctors publicly endorsing commercial products; check before adding any doctor's name or photo.
- **DPDP.** No third-party trackers or ad pixels. If analytics are added, use a cookieless, privacy-friendly option and mention it on the data page.

## Technical constraints

- Static site: `index.html`, `data.html`, minimal assets. Single HTML file per page with inline CSS is fine.
- Mobile-first. Design at 360px width first. Test on a cheap Android phone and inside the WhatsApp and Instagram in-app browsers.
- Fast on mobile data: aim for under about 200 KB per page, no heavy JS frameworks, system fonts or one web font at most, compressed images.
- Readable for older doctors: base font size at least 16px, strong contrast, large tap targets for the button.
- Works without JavaScript for all content; JS only for small touches.
- Open Graph tags (title, description, image) so the link previews well when forwarded on WhatsApp. The preview image should carry the headline.
- Hosting: Vercel (or similar static host). Custom domain if available.

## Out of scope

- Multiple landing pages per angle or specialty
- SEO pages, blog
- Paid ad tracking, pixels
- Email capture or nurture
- Live chat widget or chatbot on the page
- Rupee estimate calculator (separate page, built separately; can be linked later)

## Open questions to settle before building

These are answered in a brainstorm and added here before Claude Code starts.

1. Visual direction: colour palette, font, overall feel (clinic-clean, warm, Mumbai-local?).
2. Logo: does a Cyvo logo or wordmark exist, or should the page use a text wordmark?
3. Language: English only, or an English/Hinglish toggle?
4. Specialty in copy: neutral "clinics", or examples that name dentists and dermatologists?
5. The WhatsApp number for the button, and whether it is a personal or a separate Business app number.
6. After-hours finding: hide until real numbers exist, or show a neutral line now?
7. Founder presence: photo and name on the page ("Shehbaz, based in Mumbai, comes to your clinic"), or not?
8. Report card figures for the sample: which numbers to show.
9. Domain name and hosting.
10. Analytics: none, or a cookieless option?
11. Data page answers: storage location, retention period, contact email.