# Cyvo scroll story: script and reveal plan

Status: draft for approval (2026-10-18). Once approved, the page in `index.html` is reworked to follow this script. Visual rules stay as in `DESIGN.md`; copy rules and compliance limits stay as in `Reamde.md`.

---

## 1. The one message

> **Every clinic leaks patients in four places. Cyvo gives you a team of four specialists, one for each leak, working on your WhatsApp day and night. Tell them once, and they remember.**

Everything on the page serves that sentence. A doctor who scrolls to the end should be able to repeat three things:

1. **The problem is real and costs me money.** (Research, not our claims.)
2. **It's a team, not a chatbot.** One specialist per problem.
3. **I stay in charge.** I tell it once and it remembers. It runs routines for me on my schedule. My receptionist handles people.

## 2. Why the current page feels segregated

- Each scene tells its own small story (the night, tell it once, the team, after the visit, results) but nothing connects them.
- The problem is shown (unanswered messages) but never measured, so the "impact" numbers at the end feel invented, because they are.
- The team appears as a lineup, not as an answer to specific problems.

## 3. The fix: three through-lines

| Through-line | How it runs through the page |
|---|---|
| **Four leaks → four specialists** | Act 1 names four leaks, each with a colour. Act 2 plugs each leak with the specialist of the same colour. Act 3 shows them working. Act 5 measures each one. Same four colours and the same order every time. |
| **One clinic, one patient** | Sample Clinic and one invented patient, Priya, from first message to six-month recall. No other patients or clinics appear in mocks. |
| **Research, then our sample** | Every "you're losing" line is a published finding with a source tag. Every rupee figure is sample-clinic arithmetic built on those findings, shown with its working. |

The four leaks (fixed order, fixed colours):

| # | Leak | Specialist | Colour |
|---|---|---|---|
| 1 | Missed enquiries (after hours, slow replies) | Front desk specialist | Periwinkle |
| 2 | No-shows | Reminder specialist | Butter |
| 3 | Reviews nobody asked for | Reviews specialist | Pink |
| 4 | Patients who never come back | Recall specialist | Light periwinkle |

## 4. Research we can stand behind

Use these exact phrasings (or tighter). Each carries a small source tag on the page and a full entry in a "Sources" list near the footer.

| # | Finding | Exact page wording | Source | Caveat to respect |
|---|---|---|---|---|
| R1 | 40–48% of appointments on Zocdoc are booked between 5 pm and 9 am | "About 4 in 10 doctor appointments are booked between 5 pm and 9 am." | [Zocdoc: When do patients want to see the doctor?](https://www.zocdoc.com/resources/blog/article/when-do-patients-want-to-see-the-doctor/) | US online booking data. Say "online", don't imply India. |
| R2 | Firms that replied within an hour were ~7× more likely to qualify a lead than those that replied an hour later (1.25M leads, 42 US firms) | "Businesses that reply within an hour are about 7 times more likely to reach the customer than those that reply even one hour later." | [Oldroyd, McElheran, Elkington, *HBR* 2011](https://scholarsarchive.byu.edu/facpub/9711) | Cross-industry, not healthcare. Use as "people move on fast", not as a clinic stat. |
| R3 | 38.6% of scheduled patients missed their appointment (2,294 patients, Indian hospital paediatric dental OPD) | "In one Indian dental hospital study, 39 in 100 patients missed their appointment." | [JCDR 2016, PMC4948520](https://pmc.ncbi.nlm.nih.gov/articles/PMC4948520) | Hospital, paediatric. Say "one study". |
| R4 | Text reminders increase attendance vs no reminder (RR 1.10, 95% CI 1.03–1.17) | "Text reminders get more patients through the door than no reminder." | [Cochrane review CD007458 (2013)](https://www.cochrane.org/CD007458), [AAFP summary](https://www.aafp.org/afp/2013/0701/p20) | Low–moderate quality evidence. Don't turn RR into a big %. |
| R5 | Two reminders (3 days + 1 day before) → 4.4% missed visits vs 5.8% / 5.3% with one (54,066 patients). High-risk patients: 20.5% vs 25.0% / 24.2% | "Two reminders beat one: in a trial of 54,000 patients, a reminder 3 days before and another the day before cut missed visits by about a fifth." | [AJMC 2018 randomised trial](https://www.ajmc.com/view/optimizing-number-and-timing-of-appointment-reminders-a-randomized-trial) | (5.8→4.4 = 24% fewer; 5.3→4.4 = 17% fewer.) "About a fifth" covers both. |
| R6 | SMS reminders: 79.2% on-time attendance vs 35.5% without (Indian paediatric dental centre, 206 patients) | "In an Indian dental clinic trial, patients who got an SMS reminder were twice as likely to arrive on time." | Int Dent J 2012 (via [National Elf summary](https://www.nationalelfservice.net/publication-types/randomised-controlled-trial/text-messaging-to-reduce-failed-appointments/)) | Small single-centre study. Verify full citation before launch. |
| R7 | 68% of consumers left a local business review when asked | "About 2 in 3 people leave a review when they are asked." | [BrightLocal Local Consumer Review Survey 2017](https://brightlocal.com/research/local-consumer-review-survey-2017) | Self-reported, all local businesses. |
| R8 | Google: "More reviews and positive ratings can help your business's local ranking." | "Google says more reviews can help your clinic show up higher in local search." | [Google Business Profile Help](https://support.google.com/business/answer/7091) | Don't promise ranking. |
| R9 | Patients use reviews to pick a doctor: ~72% use them as a first step | "Most patients now read reviews before choosing a new doctor." | [Software Advice survey via HC Innovation Group](https://www.hcinnovationgroup.com/population-health-management/patient-engagement/news/13027701/survey-most-patients-use-healthcare-review-sites-to-choose-docs) | US vendor survey. Keep it qualitative ("most"). |
| R10 | Follow-up reminders lifted a national health survey response from 36.7% to 59.5% | "In a national health survey, a couple of polite follow-ups lifted replies from about 37% to 60%." | [Danish health survey, Region H](https://research.regionh.dk/en/publications/the-effect-of-multiple-reminders-on-response-patterns-in-a-danish/) | Surveys, not reviews. Use only as "a gentle follow-up works". |
| R11 | Reminder/recall raises uptake by ~8 percentage points (75 studies, 10 countries) | "Across 75 studies, reminding patients when they're due brought back about 8 more in every 100." | [Cochrane review CD003941 (2018)](https://cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003941.pub3) | Immunisation recall. Say "patients due back". |

**Claims we will not make** (no evidence found):
- "3 reminders make patients 30% more likely to visit."
- "Asking for a review 3 times gets more reviews."
- Any result attributed to Cyvo itself, until we have our own data.

**Product decisions the research suggests:**
- Reminder specialist sends **two** reminders: 3 days before and the day before (R5).
- Reviews specialist asks **once, plus one gentle follow-up** a day or two later. More than that risks annoying patients and WhatsApp spam flags (R10 shows diminishing returns after 2–3).
- Recall specialist messages when a follow-up is due, plus one reminder.
- All proactive messages (reminders, review asks, recalls) need patient opt-in and approved WhatsApp templates. Review asks and recalls may count as marketing messages under Meta's pricing. Check before launch.

## 5. The script, act by act

Legend: **Beat** = one scroll step. *Motion* describes what moves. **Copy** is final unless marked TBD.
Chapter rail becomes: **The leak · The team · Your rules · One patient · The impact**.

### Act 0 · Hero (not pinned)
*Keeps the current layout.*

- **Copy:** "Your clinic answers WhatsApp at 11 pm. Even when you don't." / "A team of front desk specialists on your clinic's own WhatsApp number, set up in person in Mumbai." / [Message us on WhatsApp]
- **Visual:** the four specialist tiles with live notifications.
- **New:** under the tiles, four small leak chips in the same colours: *Missed enquiries · No-shows · Reviews · Follow-ups* — a quiet preview of the frame.
- *Motion:* tiles rise in; notifications pop; scroll cue "Scroll: see where clinics lose patients".

### Act 1 · The leak (pinned, 6 beats) · replaces "The night"
**Purpose:** make the doctor feel the loss, with research.
**Visual system:** a 24-hour day bar across the screen (12 am → 12 am). Clinic hours (10 am–8 pm) shaded. Patient messages appear as dots on the bar. On the right, a **leak panel** with four rows (the four leaks), each with its colour and an empty "drip" meter that fills as the act goes on.

| Beat | Headline (big) | Supporting line + source tag | Motion |
|---|---|---|---|
| 1 | Your clinic is open 10 hours a day. | — | Day bar draws in; open hours shade in. |
| 2 | Patients don't keep your hours. | About 4 in 10 doctor appointments are booked between 5 pm and 9 am. **[R1]** | Dots pour onto the evening and night part of the bar. Leak 1 meter fills. |
| 3 | Every hour you wait, they keep looking. | Businesses that reply within an hour are about 7× more likely to reach the customer than those that reply an hour later. **[R2]** | Night dots fade and drift off the bar ("went elsewhere"). |
| 4 | The ones who book still forget. | In one Indian dental hospital study, 39 in 100 patients missed their appointment. **[R3]** | A row of 10 appointment chips; 4 grey out. Leak 2 fills. |
| 5 | Happy patients don't review, unless you ask. | About 2 in 3 people leave a review when asked. Most patients read reviews before choosing a doctor. **[R7, R9]** | Empty review stars outline (single star icon, never five). Leak 3 fills. |
| 6 | And patients who are due back drift away. | — | A calendar page flips 6 months; a chip fades. Leak 4 fills. |
| end | **Four leaks. Every clinic has them. Most don't have the hands to fix them.** | | Leak panel holds full; scroll cue "Next". |

### Act 2 · The team (pinned, 5 beats)
**Purpose:** it's a team, and each member exists for a reason.

| Beat | On screen | Copy | Motion |
|---|---|---|---|
| 0 | Big type | **Not one chatbot. A team.** One specialist for each leak. | Leak panel from Act 1 slides in from the left. |
| 1 | Front desk specialist card (periwinkle) | Replies in seconds, day and night, on your number. Books, reschedules, answers questions. *Research: reply within the hour [R2]* | Leak 1 row slides into the card; its meter drains; chip turns to "Covered". |
| 2 | Reminder specialist (butter) | Two reminders: 3 days before and the day before. Patients confirm with one tap. *Research: two reminders cut missed visits by about a fifth [R5]* | Leak 2 plugs. |
| 3 | Reviews specialist (pink) | Asks every patient after their visit, with one gentle follow-up. Never only the happy ones, never with incentives. *Research: 2 in 3 review when asked [R7]; Google rewards reviews [R8]* | Leak 3 plugs. |
| 4 | Recall specialist (light periwinkle) | Messages patients when their follow-up is due and books them back in. *Research: +8 in 100 come back [R11]* | Leak 4 plugs. Full row of four cards, all "Covered". |

Phone: one card at a time (as now), leak chip above it. Desktop: cards join a row.

### Act 3 · Your rules (pinned, 8 beats) · memory + routines + receptionist
**Purpose:** remove the fear of losing control, and show what no chatbot does: it remembers, and it works on your schedule.
**Visual system:** left, the doctor's own WhatsApp chat with Cyvo. Right, a **"What the team remembers"** panel that fills up beat by beat: each instruction lands as a card with an icon (one-off, rule, routine) and the four specialist avatars that will follow it.

| Beat | Headline | Doctor's chat (doctor → Cyvo) | Memory panel |
|---|---|---|---|
| 1 | **Tell it once. It remembers.** | "Kal clinic band hai" *(Clinic is closed tomorrow)* → "Noted. 3 patients are booked tomorrow. Move them to Saturday?" → "Haan" → "Done. All 3 moved and informed." | Card: **Closed tomorrow** · one-off · all four avatars tick. |
| 2 | Rules, not reminders. | "Saturday ko 12 se 3 booking mat lena" *(Don't take bookings on Saturday between 12 and 3)* → "Got it. No bookings Saturday 12–3 pm." | Card: **No bookings Sat 12–3 pm** · rule. |
| 3 | It keeps your clinic's way of working. | "Root canal ke liye 60 minute ka slot rakho" *(Keep 60-minute slots for root canals)* → "Done. Root canals now get 60 minutes." | Card: **Root canal = 60 min** · standing rule. (Dermatology variant: "Chemical peel = 45 min".) |
| 4 | Plan ahead, once. | "20 se 24 Dec main chhutti pe hoon" *(I'm on leave 20–24 Dec)* → "Noted. No bookings 20–24 Dec. Patients asking will be offered the 26th onwards." | Card: **Leave 20–24 Dec** · dated rule. |
| 5 | **Set routines. It runs them for you.** | "Roz raat 10 baje kal ki bookings bhejo" *(Every night at 10, send me tomorrow's bookings)* → "Done. Every night at 10 pm." | Card: **Every night 10 pm · tomorrow's bookings** · routine (clock icon). |
| 6 | (The routine running) | **10:00 pm**, from Cyvo: "Tomorrow, Saturday: 14 bookings. First at 10:00 am. 2 new patients. 12–3 pm blocked, as you asked." | The routine card pulses once. |
| 7 | Every Sunday, your report card. | **Sun 9:00 am**: the weekly report card arrives (the existing report card block, now presented as a routine). | Card: **Every Sunday 9 am · report card** · routine (on by default). |
| 8 | **Your receptionist gets a team, not a replacement.** She handles the people. The team handles everything else. | Needs-you list with take-over buttons. | Panel collapses into "6 things remembered · 2 routines running". The closing line lights up word by word. |

Routine ideas to mention in small text (not all animated): "Every Monday 9 am: last week's no-shows" · "Every evening: patients who asked for a call back" · "1st of the month: follow-ups due this month".
On phones: chat on top, memory panel collapses to a single strip of cards under it.

### Act 4 · One patient (pinned, ~12 beats) · merges the "Tell it once" patient part + "After the visit"
**Purpose:** show the team as one continuous service that follows your rules, not four tools.
**Visual system:** a **journey line** across the top with five stops: *Enquiry · Reminders · Visit · Review · Recall*. The active stop lights in that specialist's colour, with their avatar on it. Below: one phone with Priya's chat that keeps scrolling. The stage background takes the active specialist's colour. When a rule from Act 3 is applied, a small chip appears: "Your rule: no bookings Sat 12–3".

| Beats | Stop | Time label | Chat (specialist → Priya) |
|---|---|---|---|
| 1–3 | Enquiry · Front desk | Sun 10:41 pm | Priya: Hi, can I come in this week? → "Of course. Saturday has: 11:00 am · 3:30 pm · 5:00 pm" + chip **"Skipped 12–3 pm: your rule"** → Priya: 11 → "Booked: Saturday, 11:00 am." |
| 4–5 | Reminders · Reminder | Wed 7:00 pm (3 days before), then Fri 7:00 pm (day before) | "Reminder: Saturday 11:00 am at Sample Clinic. Reply 1 to confirm, 2 to change." → Priya: 1 → (Fri) "See you tomorrow at 11:00 am." |
| 6 | Visit | Sat 11:00 am | No chat. A "Visited ✓" stamp on the journey line. The receptionist sees Priya in person. |
| 7–9 | Review · Reviews | Sat 1:15 pm, then Mon 11:00 am | "Thank you for visiting today. If you have a minute, please share your experience on Google. [Write a review]" → (Mon, gentle follow-up) "Just a gentle reminder, only if you'd like to." → Priya: Done. Note: *Every patient is asked. No incentives.* |
| 10–12 | Recall · Recall | 6 months later | "Your follow-up is due. Next week: Tue 11:00 am · Thu 5:00 pm" → Priya: Thursday 5 → "Booked: Thursday, 5:00 pm. We'll remind you." Journey line loops back to Reminders. |
| end | — | — | **One patient. Four specialists. Your rules, every time.** |

### Act 5 · The impact (pinned, 5 beats)
**Purpose:** turn research into rupees, honestly, for a clinic like theirs.
**Header:** "What the research suggests for a clinic like yours" · label: *Sample clinic: 25 messages a day, 20 patients a day, ₹1,500 average per visit, 150 check-ups due a month. Estimates, not results.*
(Revised 2026-10-18: visit value ₹800 → ₹1,500, follow-ups due 40 → 150, missed enquiries now monetised, total beat added.)

| Beat | Leak | Big number | Working shown under it | Source |
|---|---|---|---|---|
| 1 | Missed enquiries | **₹22,500** a month | 300 after-hours messages; 1 in 5 a new patient wanting to book; a fast reply keeps 1 in 4 → 15 × ₹1,500 (assumptions) | R1, R2 |
| 2 | No-shows | **₹63,000** a month | 520 booked, 1 in 5 missed; reminders lift attendance ~10% (80% → 88%) → ~42 visits × ₹1,500 | R4, R5 |
| 3 | Reviews | **50+** new reviews a month | 520 asked; even if only 1 in 10 posts (surveys say up to 2 in 3 when asked) | R7, R8 |
| 4 | Follow-ups | **₹18,000** a month | 150 due × ~8 in 100 more return → 12 × ₹1,500 | R11 |
| 5 | Receptionist | **50 hrs** a month | 750 messages × ~3 min + 520 reminder calls × ~2 min (assumption) | — |
| 6 | All together | **₹1,03,500** a month · about ₹12 lakh a year | Sum of 1, 2, 4 | — |
| end | | **Get these numbers for your clinic** → [Check my clinic] · [Message us on WhatsApp] | | |

The biggest assumptions (visit value, share of night messages that are new bookings, check-ups due) must be editable in the savings calculator, with these as defaults.

### Act 6 · Close (not pinned)
- Team image + **"See the team on your own number."** + founder line + WhatsApp button.
- Pricing line, data line.
- **Sources** list (R1–R11, linked, one line each) above the footer, in small text. Every source tag on the page links here.

## 6. Reveal and motion rules for this script

- **One idea per beat.** A beat changes one headline and one visual. Never two big changes at once.
- **Colour is the thread.** A leak's colour, its specialist's colour, the journey stop and the impact row always match.
- **Numbers count up only once per beat entry**, and land on the exact figure.
- **Source tags** ("Source: Cochrane 2013") appear with the stat, in small muted text, and are tappable links to the Sources list.
- **Scroll guidance:** chapter rail (desktop) uses the new act names; the scroll cue ring shows progress within each act; cue copy: "Scroll: see where clinics lose patients" (hero) → "Keep scrolling" → "Next".
- **Length:** about 36 beats in total. At ~70% of the screen height per beat, a fast scroller gets through in ~40 seconds. If testing shows drop-off, trim Act 1 to 4 beats first.
- **Fallback:** without JS or with reduced motion, each act renders as a normal section: headline, the research line with its source, and the static visual.

## 7. What changes on the page

| Current section | Becomes |
|---|---|
| Hero | Same, plus four leak chips under the tiles |
| The night (clock + inbox) | **Act 1 · The leak** (day bar + leak panel, research) |
| Our test (? hours) | Folded into Act 1 beat 3 as our own finding once real; until then hidden |
| Tell it once | Doctor part → **Act 3 · Your rules** (now with memory and routines); patient part → **Act 4 · One patient** |
| The team | **Act 2**, now plugging leaks |
| Morning: needs-you | **Act 3** beat 8 |
| After the visit | **Act 4** (with Enquiry and Visit stops added) |
| Report card | **Act 3** beat 7, presented as a routine that's on by default |
| Results (invented numbers) | **Act 5**, research-based sample numbers with working |
| Closing statement | Moves into Act 3 beat 8 |
| Savings teaser | Merged into the Act 5 ending CTA |

## 8. Open items before building

1. Verify R6 full citation (Int Dent J 2012) and R10 details from the original papers.
2. Confirm with the product: Reminder specialist sends two reminders (3 days + 1 day); Reviews specialist sends one follow-up. Memory covers one-off closures, time-window rules, procedure durations and leave dates; routines can be set in plain language (e.g. nightly bookings at 10 pm). The script describes this behaviour; the product must match it.
3. Check WhatsApp template categories and opt-in flow for reminders, review asks and recalls.
4. Replace the after-hours "? hours" with our own 18/25 Oct test result if it is strong; it can become the local proof next to R1.
