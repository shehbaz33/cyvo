# Cyvo page copy

Copy for `index.html` and the later `savings.html` (savings calculator and audit report). Follows the copy rules and compliance limits in `Reamde.md` and the design in `DESIGN.md`.

Conventions:
- Write headings in sentence case here; the design uppercases display headings in CSS.
- `[Sticker: …]` is a rotated label. `{{…}}` is a value to fill in later.
- Every mock uses an invented clinic and invented patients.

---

## index.html

### 1. Hero (night)
- [Sticker: Open at 11 pm]
- **H1:** Your clinic answers WhatsApp at 11 pm. Even when you don't.
- **Sub:** A team of front desk specialists on your clinic's own WhatsApp number, set up in person in Mumbai.
- **Button:** Message us on WhatsApp
- **Founder line:** Shehbaz comes to your clinic for a 5-minute demo.
- **Phone mock** [Sticker: Sample], header "Sample clinic · 10:41 pm":
  - Patient: Hi, can I get an appointment tomorrow?
  - Front desk specialist: We're closed tomorrow. Saturday is open. Which time suits you? [11:00 am] [12:30 pm] [5:00 pm]
  - Patient: 12:30 please
  - Front desk specialist: Booked: Saturday, 12:30 pm. We'll remind you the day before.
- **Caption:** Sample conversation. Invented patient.
- **Scroll hint:** One night at a sample clinic ↓

### 2. The night *(pinned scene)*
- **Clock:** runs from 8:00 pm to 11:04 pm with scroll.
- **Lines (one at a time):** Your receptionist goes home at 8. → Patients keep messaging. → Without a front desk, they wait until morning.
- **Inbox mock** "Sample clinic · WhatsApp · N unread": Is the clinic open on Sunday? 8:47 pm · Can I book for tomorrow morning? 9:30 pm · What is the consultation fee? 10:15 pm · Hi, appointment please 10:41 pm. *Invented patients.*

### 3. 9:12 pm
- **H2:** You tell the team once.
- **Chat:**
  - You: Kal clinic band hai *(Clinic is closed tomorrow)*
  - Cyvo: Noted. 3 patients are booked tomorrow. Shall I move them to Saturday and let them know?
  - You: Haan, Saturday ko shift karo *(Yes, move them to Saturday)*
  - Cyvo: Done. All 3 moved and informed. Every specialist will follow this.
- **How it works:**
  1. **We set it up at your clinic.** In person, in Mumbai, on your existing number.
  2. **The team answers and books your patients.** Day and night, in your clinic's name.
  3. **You instruct them on WhatsApp.** Leave, holidays, new timings. Tell it once. It remembers.

### 4. 10:41 pm
- **H2:** A patient asks for tomorrow.
- **Chat:** patient asks for tomorrow → offered Saturday slots.
- **Specialist tile:** Front desk specialist · "Answers your patients at 11 pm so they don't book somewhere else."

### 5. After 10 pm · our test
- **H2:** We messaged Mumbai clinics at this hour.
- **Big figure:** {{Y}} hours *(shows "?" until the data exists)*
- **Text:** Median first reply when we messaged {{X}} Mumbai clinics after 10 pm. No clinic is named.
- **Pill:** Results from our 18 and 25 Oct tests
- *Rule: publish only real test results. Until then, show the "?" version or hide this entry.*

### 6. Morning *(divider)*

### 7. The team *(pinned scene)*
- **Opening frame (night):** Not one chatbot. A team.
- [Sticker: Morning · meet the team]
- **H2:** A team of specialists. Each does one job.
- **Text:** One bot trying to do everything gets things wrong. Cyvo gives your clinic a team of specialists, each trained for a single front desk job, all working on your number and following your instructions.
- **Cards:**

| Title | Status | One line | Today line (live only, sample) |
|---|---|---|---|
| Front desk specialist | Live | Answers and books your patients, day and night. | Last night: 3 booked after 10 pm |
| Reminder specialist | Live | Reminds and confirms every patient the day before. | Tonight: 12 reminders for tomorrow |
| Reviews specialist | Live | Asks every patient for a Google review after their visit. | — |
| Recall specialist | Live | Brings back patients who are due for a follow-up. | — |

- **Small print:** Patients never see these titles. They just see your clinic.
- *Compliance: Reviews specialist copy always says "asks every patient". Never "5-star reviews", never only happy patients, no incentives.*

### 8. 9:00 am · Friday
- **H2:** Your receptionist starts with a short list.
- **Text:** Everything routine is done. What needs a person is waiting for her, with a take-over button. Cyvo gives your receptionist a team. She handles the people.
- **Needs-you mock** [Sticker: Sample]:
  - Asks about treatment cost · Patient · 10:52 pm · [Take over]
  - Wants to speak to the doctor · Patient · 7:40 am · [Take over]
- **Line:** Overnight: 3 booked, 4 questions answered.

### 8b. After the visit *(pinned scene, one patient, three specialists)*
- **Eyebrow:** After the visit · one patient, three specialists · *Sample clinic. Invented patient.*
- **Reminder specialist · Fri 7:00 pm** (butter) — H2: The night before, every patient gets a reminder.
  - Reminder specialist: Hi Priya, a reminder from Sample Clinic: your appointment is tomorrow, Saturday, at 12:30 pm. Reply 1 to confirm or 2 to change the time.
  - Priya: 1
  - Reminder specialist: Confirmed. See you tomorrow at 12:30 pm.
- **Reviews specialist · Sat 1:15 pm** (blush) — H2: After the visit, every patient is asked for a review.
  - Reviews specialist: Thank you for visiting Sample Clinic today, Priya. If you have a minute, please share your experience on Google. It helps other patients find us. [Write a review on Google]
  - Priya: Done. Thank you!
  - Note: Every patient is asked, not only the happy ones. No incentives, ever.
- **Recall specialist · Six months later** (periwinkle-soft) — H2: When a follow-up is due, the patient comes back.
  - Recall specialist: Hi Priya, it's been six months since your last visit to Sample Clinic and your follow-up is due. Would next week work? [Tue 11:00 am] [Thu 5:00 pm]
  - Priya: Thursday 5 pm
  - Recall specialist: Booked: Thursday, 5:00 pm. We'll remind you the day before.

### 9. Sunday · 9:00 am
- **H2:** Your report card arrives on WhatsApp.
- **Report card** [Sticker: Sample], "Sample clinic · this week":
  - Appointments booked: 46
  - Of them after hours: 17
  - No-shows avoided after a reminder: 6
  - Review requests sent: 38
  - Patients back for a follow-up: 8
  - **Estimated value of after-hours bookings: ₹13,600** *(17 × ₹800)*
- **Fine print:** Invented clinic and figures, at ₹800 a visit. The rupee figure is an estimate.

### 9b. Results scene *(pinned, one number per scroll step)*
- **Eyebrow:** What a month could look like · **Label:** Sample clinic · illustrative estimates, not results
- *ILLUSTRATIVE placeholders. Replace with real figures when available; keep the label until then.*

| Step | Number | Line | Working | Specialist |
|---|---|---|---|---|
| 1 | ₹73,600 | More revenue a month | 68 after-hours bookings and 24 no-shows avoided, at ₹800 a visit. | Front desk + Reminder · Live |
| 2 | 11 hrs | Of your receptionist's time back, every week | About 220 routine replies she no longer types, at 3 minutes each. | The whole team · Live |
| 3 | +30 | More Google reviews a month | From asking every patient after their visit. | Reviews · Live |
| 4 | 34 | Patients back for their follow-up, every month | Reminded at the right time, so recalls don't slip. | Recall · Live |

### 9c. Closing statement *(words light up on scroll)*
Your receptionist handles the people. The team handles everything else.

### 10. Savings check *(teaser, links to savings.html)*
- [Sticker: 2 minutes]
- **H2:** What is your front desk missing?
- **Text:** Answer five questions about your clinic. Get a free front desk audit with an estimate, in rupees, of what after-hours replies, reminders and follow-ups could be worth to you.
- **Preview rows:** Patients who message in a day · Your clinic timings · Patients you see in a day · Follow-ups due each month · Average visit fee
- **Button:** Check my clinic

### 11. Pricing and data
- **Pricing:** One-time setup fee plus a monthly fee. Cancel with one message. *(numbers slot in later: Setup ₹{{setup}} · Monthly ₹{{monthly}})*
- **Data:** Patient numbers are encrypted. We never store diagnoses, prescriptions or medical records. [How we handle data →]

### 12. Final call to action
- **H2:** See the team on your own number.
- **Founder:** Shehbaz, Mumbai. I come to your clinic for a 5-minute demo and set everything up in person.
- **Button:** Message us on WhatsApp *(second pre-filled text: "Hi, I'd like a demo for my clinic (end)")*

### 13. Footer
Cyvo · Mumbai · How we handle data · Instagram

---

## savings.html (build later)

### Intro
- [Sticker: 2 minutes]
- **H1:** Check your clinic's front desk.
- **Text:** Five questions. Your numbers stay on this page; we don't ask for your phone or email.

### Questions
1. **How many patients message or call your clinic in a day?** Helper: A rough number is fine. *(number, e.g. 25)*
2. **What are your clinic timings?** Opens at [10:00 am] · Closes at [8:00 pm] · Closed on [Sunday] *(time pickers, day chips)*
3. **How many patients do you see in a day?** *(number, e.g. 20)*
4. **How many patients are due for a follow-up each month?** Helper: Recalls, check-ups, second sittings, review visits. *(number, e.g. 40)*
5. **What is your average fee per visit?** *(₹, e.g. 800)*
- **Button:** See my front desk audit

### Assumptions (shown under the result, editable)
Estimates use your numbers and these assumptions. Change any of them if you know better.

| Assumption | Default | Range used |
|---|---|---|
| Messages that arrive when the clinic is closed | 20% | fixed (editable) |
| After-hours enquiries that would have booked if answered quickly | — | 10% (low) to 25% (high) |
| Patients who don't show up | 10% | fixed (editable) |
| No-shows avoided by a reminder the day before | — | 20% (low) to 40% (high) |
| Extra follow-ups that come back when reminded | — | 10% (low) to 20% (high) of follow-ups due |
| Receptionist time per routine WhatsApp enquiry | 3 min | fixed (editable) |
| Routine enquiries the team can handle fully | 60% | fixed (editable) |

*Replace the 20% after-hours default with the real share from the 18/25 Oct tests once available, and cite it.*

### Formulas (monthly; 30 days for messages, clinic days = days open in a month)
- After-hours enquiries = messages/day × 30 × after-hours share
- After-hours bookings (low/high) = after-hours enquiries × 10% / 25%
- No-shows = patients/day × clinic days × no-show rate
- No-shows avoided (low/high) = no-shows × 20% / 40%
- Follow-ups recovered (low/high) = follow-ups due × 10% / 20%
- Value (low/high) = (after-hours bookings + no-shows avoided + follow-ups recovered) × average fee
- Receptionist hours saved = messages/day × 30 × routine share × minutes per enquiry ÷ 60
- Round rupees to the nearest ₹500; show ranges, never a single "you will earn" number.

### Audit report (result screen)
- **H2:** Your front desk audit
- **Sub:** Sample estimate for {{clinic timings}} · based on your answers

Cards (one per finding, each names the specialist who handles it):

1. **After-hours enquiries** · Front desk specialist
   About {{after-hours enquiries}} messages a month arrive when you're closed. If {{low}}–{{high}} of them book instead of going elsewhere: **₹{{a_low}}–₹{{a_high}} a month (estimate)**.
2. **No-shows** · Reminder specialist
   About {{no-shows}} patients a month don't turn up. A reminder the day before could bring back {{low}}–{{high}}: **₹{{n_low}}–₹{{n_high}} a month (estimate)**.
3. **Follow-ups** · Recall specialist
   {{F}} patients are due back each month. A timely nudge could bring back {{low}}–{{high}} more: **₹{{f_low}}–₹{{f_high}} a month (estimate)**.
4. **Your receptionist's time** · the whole team
   About **{{hours}} hours a month** of routine WhatsApp replies she no longer has to type.

- **Total card (butter):** Estimated value: **₹{{low}}–₹{{high}} a month**, plus about {{hours}} hours of your receptionist's time.
- **Fine print:** These are estimates from your answers and the assumptions below, not a promise of results. Your clinic's real numbers will differ.
- **CTA heading:** Want to see this on your own number?
- **Button:** Book a 5-minute demo on WhatsApp
  - Pre-filled text: "Hi, I checked my clinic on Cyvo. Estimate: ₹{{low}}–₹{{high}} a month. I'd like a demo."
- **Secondary:** Change my answers

### Compliance notes for the calculator
- No email, phone or name fields. Nothing is sent anywhere until the visitor taps the WhatsApp button.
- No analytics on the inputs unless a cookieless tool is added and mentioned on the data page.
- Every rupee figure says "estimate"; assumptions are visible on the same screen.
