# Design spec: Cyvo landing page

> Source of truth for all UI in this project. Edit freely by hand, then run `/design-director sync` to regenerate `design/tokens.css`.
> Last updated: 2026-10-17 (v2: BrightBite-style palette, League Gothic, team of specialists)
> Product brief: `Reamde.md`. Page copy: `COPY.md`. Image prompts: `design/image-prompts.md`.

## 1. Intent

- **What it is:** A one-page site (plus `data.html`, and later a savings calculator page) for Cyvo: a team of front desk specialists that works on a private clinic's own WhatsApp number in Mumbai.
- **Audience:** Single-doctor private clinics in Mumbai (dentists and dermatologists first). Often not tech-comfortable, sceptical of "AI receptionist" pitches. Opening the page on a mid-range Android, inside the WhatsApp or Instagram in-app browser, on mobile data.
- **Primary action:** Tap "Message us on WhatsApp" (click-to-chat). Secondary: "Check my clinic" (savings calculator, which itself ends in a WhatsApp demo request).
- **First-5-seconds feeling:** Calm, trusted, local. Bright, not clinical.
- **By the end the visitor believes:** "This is not a chatbot. It's a team of specialists, each doing one front desk job on my own number, I control them with one WhatsApp message, and a real person in Mumbai sets it up."

## 2. Direction

- **Aesthetic family:** Bright editorial poster. Condensed uppercase display type, light blush ground, navy ink, one tomato accent for actions, and colour blocks (periwinkle, butter, blush) that carry the illustrations. Structure: "One night, minute by minute."
- **Keywords:** condensed caps, navy ink, blush paper, tomato button, colour-block portraits, rotated stickers, hairline rules, night to morning, timeline, team of specialists.
- **References:** `design/references/README.md`; primary visual reference is BrightBite (screenshot shared 2026-10-17). Chosen exploration: `design/explorations/round-c/page.html` (League Gothic) on the structure of `round-b/b3-one-night.html` with the hero chat from `round-b/b2-proof-first.html`.
- **Common thread across references:** Confident type does the talking; colour comes from blocks behind images, not from the accent; small playful stickers make it human; numbers are shown large and honestly.
- **Concept:** The page is one night at a sample clinic. It opens on navy night with the headline and a 10:41 pm booking handled by the Front desk specialist. The timeline runs 8:00 pm → 9:12 pm (tell it once) → 10:41 pm → our after-hours test → *Morning* (ground switches to blush) → the team of specialists → 9:00 am needs-you list → Sunday report card → savings check → demo.
- **Density:** Balanced.
- **Motion appetite:** Expressive scroll story (Apple-style pinned scenes), built light. See §6.

## 3. Color

### Scales
Accent from tomato `#EA5A2E`; neutral scale from `tokens.py` for reference. Roles below use hand-picked navy-tinted values.

| Step | Accent | Neutral |
|---|---|---|
| 50 | #fff4f1 | #f4f6ff |
| 100 | #ffe5dd | #e9ebf3 |
| 200 | #ffc9b9 | #d5d7e0 |
| 300 | #ffa287 | #bbbdc6 |
| 400 | #f7754f | #9fa1a9 |
| 500 | #ea5a2e | #84868e |
| 600 | #bc3600 | #6a6b73 |
| 700 | #972900 | #53555c |
| 800 | #731c00 | #3e3f46 |
| 900 | #521000 | #2a2b31 |
| 950 | #330500 | #17181e |

### Roles (components use these, never raw steps)
Two grounds: **morning** (blush, default) and **night** (navy: hero and night timeline entries). Night is a section treatment, not a user-toggled dark theme.

| Role | Value | Use |
|---|---|---|
| bg | #fbf6f4 | blush-white page ground |
| surface | #ffffff | cards, specialist card bodies |
| surface-2 | #f3ece8 | patient bubbles, quiet fills |
| text | #141c30 | navy ink: all headings and body |
| text-muted | #5d6175 | secondary text, captions |
| border | #e6deda | hairlines, card borders |
| accent (cta) | #cf4417 | button fill (white text) |
| accent-contrast | #ffffff | text on accent |
| accent-bright | #ea5a2e | stickers and small fills only, navy text on top; never with white text |
| accent-text | #c23e14 | accent as text on blush (eyebrows, links) |
| accent-night | #c23e14 | accent as text on butter (timestamps, hero second clause): 4.7:1 |
| block-peri | #8a90f2 | colour block: Front desk specialist, stickers |
| block-butter | #f6d66b | colour block: Reminder specialist, report total, stickers |
| block-blush | #f4c3cf | colour block: Reviews specialist, stickers |
| block-peri-soft | #e4e5fd | colour block: Recall specialist, savings section ground |
| night | #fbf6f4 | same blush as the page: hero and night scenes share one ground (was navy, then butter) |
| night-surface | #ffffff | phone, inbox and chat cards on the butter ground (1px rgba(20,28,48,0.08) border) |
| night-surface-2 | #eef0f5 | patient and Cyvo bubbles inside white cards |
| night-text | #141c30 | text on the butter ground (same as ink) |
| night-muted | #5d6175 | secondary text on the butter ground |
| success | #2f7a4a | checkmarks only |
| warning | #c23e14 | same as accent-text |
| danger | #b3261e | form errors (calculator page) |

### Contrast checks
| Pair | Ratio | Pass |
|---|---|---|
| text on bg | 15.6:1 | AAA |
| text on surface | 16.7:1 | AAA |
| text-muted on bg | 6.1:1 | AA |
| text-muted on surface-2 | 5.6:1 | AA |
| accent-contrast on accent (button) | 4.7:1 | AA |
| text on accent-bright (stickers) | 4.8:1 | AA |
| accent-text on bg | 4.9:1 | AA |
| text on block-peri | 5.8:1 | AA |
| text on block-butter | 11.7:1 | AAA |
| text on block-blush | 10.8:1 | AAA |
| text on block-peri-soft | 13.5:1 | AAA |
| night-text on night | 15.1:1 | AAA |
| night-muted on night | 7.4:1 | AAA |
| night-muted on night-surface | 6.1:1 | AA |
| accent-night on night | 7.2:1 | AAA |
| success on bg | 4.9:1 | AA |

### Color rules
- Tomato is for **action**: buttons and links. Plus stickers in its bright form. Under 10% of any viewport.
- White text only on `accent` `#cf4417`. On `accent-bright` `#ea5a2e`, use navy text (white fails at 3.5:1).
- Colour blocks carry personality: one per specialist, used behind illustrations and as sticker colours. Never as full-section backgrounds, except `block-peri-soft` for the savings section.
- No green fills or green stickers (WhatsApp association). Green only for small checkmarks.
- No gradients anywhere.

## 4. Typography

- **Display:** League Gothic (regular 400, one weight). Google Fonts / The League of Moveable Type, OFL. Uppercase via `text-transform`; source copy stays in sentence case, per the brief. Self-host one Latin-subset woff2 at launch (~20 KB).
- **Text:** System UI stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). Zero bytes.
- **Mono:** none.
- **Scale:** base 17px, ratio 1.25. League Gothic is narrow, so display sizes run large; each display size is multiplied by 1.18 against the base scale.

| Token | Size (mobile → desktop) | Line height | Tracking | Weight | Font |
|---|---|---|---|---|---|
| display-xl (h1) | 61 → 104px | 0.92 | +0.005em | 400, uppercase | display |
| display-lg (section titles: team, savings, end) | 52 → 113px | 0.92 | +0.005em | 400, uppercase | display |
| display (timeline time) | 75px | 0.9 | +0.005em | 400, uppercase | display |
| h2 (timeline titles) | 40 → 64px | 0.95 | +0.005em | 400, uppercase | display |
| h3 (specialist titles, card titles) | 33px | 0.95 | +0.005em | 400, uppercase | display |
| figure (report numbers) | 42px | 1.0 | 0 | 400 | display |
| body-lg (sub-lines) | 18px | 1.5 | 0 | 400 | text |
| body | 17px | 1.55 | 0 | 400; 600 for emphasis | text |
| small | 15px | 1.45 | 0 | 400 | text |
| label / sticker | 12–13.6px | 1.3 | +0.06–0.08em, uppercase | 700 | text |

Rules:
- Display face only for headings, times, figures and the wordmark. Never for paragraphs, buttons or chat text.
- Uppercase display headings max ~10 words. Longer statements go in body text.
- Body never below 15px; chat 15px; everything else 17px.
- Max line length 44ch body, 16ch h2. Hero headline: 11ch on phones; from 1000px it runs full width at 20ch in three lines, with "Even when you don't." on its own line.
- Left-aligned; only the "Morning" divider is centered.
- No italics anywhere (League Gothic has none; emphasis is colour).

## 5. Space, layout, shape

- **Base unit:** 4px.
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- **Section padding:** clamp(56px, 9vw, 104px). Timeline entries: 40px top / 44px bottom, hairline between.
- **Container max width:** 1080px; gutters 20px (16px minimum at 360px).
- **Grid:** single column on phones. Timeline entries from 760px: 180px time rail + content. Specialist cards: 1 column → 2 at 760px → 4 at 1000px.
- **Radius:** none 0 (cards, colour blocks; square like the reference), sm 4px (buttons, nav button), md 14px (chat bubbles), lg 18px (phone mock), full 9999px (stickers, slot chips).
- **Borders:** 1px `border` on blush, 1px `night-surface` on night. Hairline rules between sections, like the reference.
- **Shadows:** none.
- **Breakpoints:** 640, 760, 1000px. Design at 360px first.
- **Tap targets:** primary button min-height 56px, full width up to 360px. Others min 44px.

## 6. Motion

- **Model:** scroll-driven story, Apple-style. Each `.scene` is tall (100svh + steps × 70vh); its `.stage` sticks to the viewport while plain JS (no library, ~3 KB) maps scroll progress to a step. Everything is tied to scroll position, so it **reverses when scrolling up**.
- **Durations:** fast 120ms (hover), base 400ms (step changes, pops), slow 700ms (ground colour changes, swaps). Count-ups 900ms ease-out.
- **Easing:** `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- **What may animate:** opacity and transform only, plus background colour on whole stages. No layout-thrashing properties. Wheel scrolling is eased with Lenis (1.2s, exponential ease-out); touch scrolling stays native, and Lenis is off with reduced motion. Inside pinned scenes, background layers are tied to scroll position, not played on a timer.
- **Step vocabulary:** `data-at="n"` (shown from step n), `data-before="n"` (shown until step n), `data-cur="n"` (current only). Classes: `.reveal` fades in place, `.pop` enters the flow (chat, inbox), `.swap` replaces another element.
- **Hero:** chat bubbles arrive one by one on load (700ms apart), once.
- **Non-pinned content:** one-time fade-in on entering the viewport (`data-view`), report-card figures count up.
- **Fallback:** without JS, or with `prefers-reduced-motion: reduce`, the `.motion` class is never added and every scene renders as a normal, fully readable section with all content visible.
- **Phone fit:** each pinned stage must fit a 360×640 viewport inside the WhatsApp in-app browser. On phones the team scene shows one specialist at a time; night lines swap rather than stack.
- **Scroll guidance (motion only):** a 3px tomato page-progress bar fixed at the top; a fixed bottom-centre cue pill (ink, white text, nowrap) with a progress ring for the current scene and a nudging chevron: "Scroll to see one night" in the hero (desktop only; hidden on phones so it never covers the CTA), "Keep scrolling" inside a pinned scene, "Next" (dot instead of chevron) when the scene is complete, hidden in normal sections. Desktop ≥1100px adds a right-side chapter rail (The night · Tell it once · The team · Results) visible while a scene is pinned. Pinned stages reserve 64px at the bottom on phones for the cue.
- **Hero:** the four specialist tiles rise in one after another (120ms stagger); then the live specialists' sample notifications pop up (Front desk "Booked: Sat, 12:30 pm", Reminders "12 reminders sent").
- **Hover/press:** buttons darken 6% over `fast`. Stickers never animate.

## 7. Imagery

- **Approach:** Illustrated specialists (generated with Gemini, then hand-checked), HTML-built mock-ups, one founder photo. No stock photos, no photoreal people standing in for the specialists.
- **Why illustrated, not photoreal:** the specialists are software. Photoreal "staff" would imply humans answer the chats, which misleads doctors and is an ASCI claims risk. Illustration reads as a team of characters, honestly.
- **Specialist illustrations:** one consistent style across all four (see `design/image-prompts.md`). Waist-up character, front desk uniform in navy, one job prop each, set on their colour block, cut-out style so the block shows around them like BrightBite's portraits. Export WebP/AVIF at 2× of 360px card width, ≤ 30 KB each. Fallback until images exist: line SVG on the colour block.
  - Front desk specialist: headset, holds a phone showing a booked slot. Block periwinkle.
  - Reminder specialist: holds an appointment card and a small bell or clock. Block butter.
  - Reviews specialist: holds a card with a single star outline (not five stars). Block blush.
  - Recall specialist: holds a calendar page with one date circled. Block periwinkle-soft.
- **Final files (2026-10-17):** `design/images/front-desk.webp`, `reminder.webp`, `reviews.webp`, `recall.webp` (720×738, 17–23 KB each, cropped from the 1024px Gemini originals at x150–950 / y40–860), and `team-720.webp` / `team-1200.webp` (15 / 29 KB). Originals in `design/images/originals/`. Show the portraits with `object-fit: cover` filling the colour block, so the image background is the block (no seam). `loading="lazy"` on every image below the hero.
- **Team group image:** all four standing on their own colour tiles. Used above the final call to action ("See the team on your own number") and as the base for the Open Graph image. Tiles were recoloured so each specialist's tile matches their card colour.
- **Founder photo:** one real photo, circle 72–88px, ≤ 25 KB. Placeholder: initial "S" in League Gothic on butter.
- **Stickers:** rotated pills (−6° to +8°), 12px/700 uppercase. Used for: "Open at 11 pm", "Sample", "Live", "Coming soon", "Not a chatbot", "2 minutes". Max two per viewport.
- **Mocks:** chat, report card and needs-you list built in HTML/CSS, always with a "Sample" sticker; invented clinic and patients.
- **Open Graph image:** 1200×630, blush ground (#fbf6f4), source `design/og/og.html`, headline in League Gothic caps with "Even when you don't." in `accent-night`, the four specialist tiles small along the bottom, "cyvo." wordmark. No WhatsApp logo.
- **Icons:** none decorative. Functional glyphs only (✓, ↓, →, ↗).

## 8. Page structure / scroll journey

Full copy for every section is in `COPY.md`.

| # | Section | Ground | Feeling | Notes |
|---|---|---|---|---|
| 1 | Hero | night | confident | "Open at 11 pm" sticker; h1; sub-line names the team of specialists; tomato button; founder line; phone mock where the reply is labelled "Front desk specialist". Desktop (≥1000px): headline spans the full width on top; below it, copy + button left and phone right, top-aligned. |
| 2 | **Scene: the night** (pinned, 5 steps) | night | tension | Clock runs 8:00 → 11:04 pm with scroll; inbox fills with 4 unanswered patient messages, unread count climbs; lines swap: "Your receptionist goes home at 8." → "Patients keep messaging." → "Without a front desk, they wait until morning." |
| 3 | 9:12 pm · you tell the team once | night | key moment | Doctor ↔ Cyvo chat ("Kal clinic band hai"); three how-it-works steps. |
| 4 | 10:41 pm · a patient asks | night | proof | Patient chat; small Front desk specialist tile. |
| 5 | After 10 pm · our test | night | serious | Big numeral finding; placeholder "?" until 18/25 Oct test data. |
| 6 | Morning divider | blush | relief | Ground switch. |
| 7 | **Scene: the team** (pinned, 6 steps) | blush | the turn | Step 0 "Not one chatbot. A team."; ground turns to morning; specialists join one by one (phone: one card at a time + name chips; desktop: row of four); last step shows the team image (phone). Preceded by **Scene: tell it once** (pinned, 9 steps): the chat plays out message by message, time swaps 9:12 → 10:41 pm. |
| 8 | 9:00 am · needs-you list | blush | reassurance | Receptionist gets a team; take-over buttons. |
| 8b | **Scene: after the visit** (pinned, 9 steps) | butter → blush → peri-soft | warm | One invented patient (Priya), three live specialists, three steps each: Reminder (Fri 7:00 pm, butter), Reviews (Sat 1:15 pm, blush, with the "every patient is asked, no incentives" note), Recall (six months later, peri-soft). Stage colour follows the specialist. Chapter "After the visit". |
| 9 | Sunday · report card | blush | proof | Sample report card (17 after-hours bookings × ₹800 = ₹13,600 estimate); figures count up. Followed by **Scene: results** (pinned, 4 steps): one big number per step on that specialist's colour block, portrait on the right (desktop): ₹73,600 revenue/month, 11 hrs/week saved, +30 reviews/month (coming soon), 34 follow-ups/month (coming soon). All "Sample clinic · illustrative estimates, not results". Then **Scene: closing statement** (pinned): "Your receptionist handles the people. The team handles everything else." lights up word by word. |
| 10 | Savings check teaser | peri-soft | curiosity | Four questions preview, "Check my clinic" button to the calculator page. |
| 11 | Pricing + data | blush | plain | One pricing line; privacy lines + link to `data.html`. |
| 12 | Final call to action | blush | warm | "See the team on your own number." Founder photo; tomato button (second pre-filled text). |
| 13 | Footer | blush | quiet | Cyvo · Mumbai, data page, Instagram. |

### Savings calculator page (later, `savings.html`)
Same tokens and components. Single column. Questions as large tap-friendly inputs, one screen; result is an on-page "front desk audit" built from the visitor's own numbers and stated assumptions, then a WhatsApp demo button with the summary pre-filled. No email or phone capture (the brief forbids email capture). Copy and formulas in `COPY.md`.

## 9. Components

### Button (primary)
- Label only ("Message us on WhatsApp"); no icon, no WhatsApp logo.
- min-height 56px, padding 0 24px, radius sm (4px), width 100% up to 360px. 17px/600 system sans.
- Fill `accent` #cf4417, text white, on both grounds.
- States: hover/press darken 6%; focus-visible 3px outline (`text` on blush, `night-text` on night), 3px offset.
- Secondary (ghost): transparent, 1.5px navy border, navy text. Used for "Check my clinic" when next to a primary.

### Nav
- Wordmark "CYVO." in League Gothic, the dot in `accent-night`. Right: small outlined "Message us" button (radius sm). Hairline below.

### Sticker
- Pill, 12px/700 uppercase, +0.06em, padding 7px 12px, rotated −6° (alternate +8°). Fills: block-peri, block-butter, block-blush, accent-bright, always navy text.

### Timeline entry
- Time (display token) + uppercase label; h2; optional muted paragraph; one content block. Night: time in `accent-night`. Blush: time in navy. Hairline between entries.

### Chat bubbles
- Max width 86%, padding 9px 12px, radius md, 15px text. Sender label above: 11.5px/700 uppercase at 65% opacity ("Patient", "Front desk specialist", "You").
- Doctor: right, `night-text` fill + navy text on night; navy fill + white text on blush.
- Specialist replies: on night `night-text` fill (right) in the hero mock; `night-surface-2` (left) in timeline chats. On blush, `surface` + border.
- Patient: `night-surface-2` on night, `surface-2` on blush.
- Slot chips: radius full; selected chip navy fill.

### Specialist card
- Square card, 1px border, no radius. Top: colour block, aspect 720:738, portrait image filling it (`object-fit: cover`), status sticker top-left above the image. Body: h3 job title, one-line job (15px muted), then a hairline and one "today" line in navy 14px (live specialists only, e.g. "Last night: 3 booked after 10 pm").
- Coming soon: title in muted, "Coming soon" sticker, no "today" line.

### Report card
- Square card, 1px border, "Sample" sticker overlapping the top edge. Rows: label left, League Gothic figure right. Total row: butter fill, "Estimated value". Fine print under the card.

### Needs-you list
- Square card. Header "Needs you" + tomato-bright count sticker. Rows: request, small muted "Patient · time", ghost "Take over" pill.

### Savings teaser
- Full-bleed `block-peri-soft` band on phone. Sticker "2 minutes"; display-lg title; muted paragraph; four example questions as white rows with muted example values; primary button "Check my clinic".

### Calculator inputs (savings page)
- Label above (17px/600), input 56px tall, 1.5px navy border, radius sm, 20px text, numeric keyboard (`inputmode="numeric"`). Helper text 15px muted. Error in `danger` with text, never colour alone.

### Audit report (savings page)
- Stack of square cards, one per finding (after-hours enquiries, no-shows, follow-ups, receptionist time), each with the specialist who handles it, the visitor's number, the assumption used, and a low–high rupee estimate. Final butter card with the monthly range. "Estimate" label on every rupee figure. Assumptions listed and editable.

## 10. Guardrails

### Always
- Real copy from `COPY.md` / `Reamde.md`.
- Present Cyvo as a team of specialists, each trained for one job. Never claim they are humans.
- One accent (tomato) for actions; personality from colour blocks.
- Every mock labelled "Sample"; invented clinic and patients.
- Every rupee figure labelled "estimate"; calculator shows its assumptions.
- Visible focus states; `prefers-reduced-motion` respected; works without JS.
- Page weight under ~200 KB including font and images.
- Source copy in sentence case (uppercase is CSS only).

### Never
- Gradients, glows, drop shadows. (User choice.)
- Robot, sparkle, chip or brain imagery; "AI-powered", "AI agents", "LLM", "bot" as a selling word. (User choice.) Exception: "Not a chatbot" sticker, which is a contrast statement.
- Rows of three equal icon cards. (User choice.)
- Photoreal people representing the specialists, or any suggestion that humans answer the chats.
- Cute personal names for the specialists (Swagat etc.). Use job titles. (User choice.)
- Cream-and-serif "editorial AI" look; Fraunces; Inter, Roboto or Arial as display.
- WhatsApp logo, green bubbles or green fills, "official WhatsApp partner".
- Stock photos, 3D renders, clinic-blue palettes.
- White text on `#ea5a2e`.
- Emoji; centered paragraphs; italic.
- Unsourced numbers; naming a real clinic; "gets you 5-star reviews"; five-star imagery for the Reviews specialist.
- "Replaces your receptionist."
- Banned words: transform, revolutionise, cutting-edge, seamless, game-changer, unlock, supercharge, elevate, empower.
- Email or phone capture on the calculator.
- Scroll-jacking beyond eased wheel scrolling (touch is never intercepted), extra animation libraries beyond Motion and Lenis, or animating layout properties.
- Every element fading up the same way: motion is choreographed per scene.
- Result figures without the "Sample clinic · illustrative" label.
- Third-party trackers.

## 11. Locked vs flexible

- **Locked (ask before changing):** navy / blush / tomato / colour-block palette; League Gothic as the only web font; night-to-morning timeline structure; team-of-specialists framing and job-title names; illustrated (not photoreal) specialists; the Never list.
- **Flexible (adjust freely):** sticker wording and placement; timeline timestamps; order of sections 8–11; which colour block goes with which specialist; spacing ±1 step; calculator assumptions (as long as they stay visible and labelled).

## 12. Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-10-17 | Feeling: calm, trusted, local | Readers are sceptical doctors cold-called by "AI receptionist" vendors. |
| 2026-10-17 | Text wordmark | No logo exists; costs no image weight. |
| 2026-10-17 | Founder name and photo on the page | A local face answers scepticism and backs "set up in person". |
| 2026-10-17 | English page, Hinglish only inside chat mocks with English underneath | Natural without doubling every line. |
| 2026-10-17 | Motion almost none | Cheap Androids, in-app browsers. |
| 2026-10-17 | Never: gradients/glows, robot/AI imagery and language, three equal icon cards | User's interview choices. |
| 2026-10-17 | Structure: "One night, minute by minute" (round B3) + hero chat (B2) | The timeline is the brief's story; dark-to-light switch is memorable; hero chat shows the product without scrolling. |
| 2026-10-17 | ~~Marigold accent on cream, Fraunces serif~~ — superseded | User disliked marigold; cream + serif read as "made by Claude". |
| 2026-10-17 | Palette from BrightBite reference: blush #fbf6f4, navy #141c30, tomato #cf4417 buttons, periwinkle/butter/blush blocks | User's reference. Colour lives in blocks behind images; accent stays for actions. |
| 2026-10-17 | Button tomato darkened from #ea5a2e to #cf4417 | White text on #ea5a2e is 3.5:1 (fails AA); #cf4417 gives 4.7:1. |
| 2026-10-17 | League Gothic display, uppercase via CSS | Closest to the reference; reads hand-set, not AI-default. Compared with Antonio and Big Shoulders. |
| 2026-10-17 | Position as "a team of specialists, each does one job — not a chatbot" | User direction; matches the brief's "gives your receptionist a team". |
| 2026-10-17 | Specialist names → job titles: Front desk / Reminder / Reviews / Recall specialist | User found Swagat, Yaad etc. too generic; titles read as a staff roster. |
| 2026-10-17 | Specialists illustrated with Gemini, consistent style, on colour blocks | Shows a team; honest that they are not real staff; small files. |
| 2026-10-17 | Add savings check: teaser on the page, calculator + audit report on its own page later | User request. Separate page matches the brief; no email capture, ends in WhatsApp. |
| 2026-10-17 | Night and ink moved from indigo #17164d to blue-black: night #111a2e, ink #141c30, surfaces #1b2640 / #28344e; periwinkle stickers kept off the night ground | User found the hero too purple. All pairs re-checked (AA/AAA). |
| 2026-10-17 | Hero headline capped at 104px on desktop and set full width above a copy/phone row | At 141px in a half-width column it ran to six lines and pushed the button below the fold. |
| 2026-10-20 | Hero sub-line: five key phrases ("answers patients at 11 pm", "cuts no-shows", "collects reviews", "brings patients back", "remembers your rules") in semibold with highlighters that draw in one after another in each specialist's colour (accent for "remembers"). The gaps act now starts on cream like the hero, so no colour band shows under the first screen. Scroll hint pulses: an orange dot pings outward and the text fades gently | User asked for the key details to be highlighted and animated, the band under the first screen removed, and a pulsing scroll hint. |
| 2026-10-20 | Section dividers removed entirely; the section base colours alone mark a new section. Hero gains character: the four specialists as round portraits around the to-do card (desktop: on its corners and edges, clear of text; phones: a row on the card's top edge), gently bobbing; the one on a task grows with a pulsing ring in its colour, and a green tick pops on when its task is done. The small avatar stack in the card header is gone | User found the melt odd and the first screen bland. |
| 2026-10-20 | Section dividers changed from waves to a melt: the section above hangs into the next one in liquid drips (shoulder, thick body, round drop), drawn as one SVG outline in real pixels so drips keep their shape at any width; mostly short drips with a few long ones and straight edge between; they stretch as you scroll through. Wave dividers removed | User felt the waves didn't look good and asked for the next section to feel like it melts in. |
| 2026-10-20 | Each section has its own base colour (`SECTION_BG` in content.ts): hero cream, gaps periwinkle wash, team butter wash, rules mint wash, one patient blush wash, impact sand, close cream. Acts start and end on their base (beats still tint in between); scenes carry it as their own background so it also shows without JS. Wave dividers are now the edge between two colours: previous section above, next section filled below the wave line, with the two animated waves on top | User wanted different section backgrounds so a new section is obvious. |
| 2026-10-20 | Charcoal tokens added (after creem.io): `--color-ink-900` #191a1c, `-800` #222324, `-700` #2f3032, `-500` #505153, `--color-ink-text` #f8f4f1; the hero to-do card uses them with a 5px solid bottom edge. Wave dividers between every section: two rounded waves (neutral + tomato) draw in when they enter and slide sideways in opposite directions with scroll | User asked for Creem's blacks on the to-do card and its animated section dividers. |
| 2026-10-20 | Hero simplified (inspired by todo.is "the to-do list that does itself"): headline "The clinic that runs itself." with a butter highlighter under "runs itself."; two-line sub-line naming Cyvo as the clinic's personal assistant on WhatsApp; one primary button + a text link to the checkup; one trust line. Right side: a dark "Today · Sample Clinic" to-do card with the four specialists' avatars; each to-do is taken by its specialist ("is on it…"), ticked, struck through in that specialist's colour, and its monthly value joins a ₹1,03,500 total; it loops. Server render / no-JS / reduced motion show the finished list | User found the previous hero content-heavy and asked for something more impressive, showing the team and the money being made. |
| 2026-10-20 | Cyvo positioned as "your clinic's personal assistant" (hero headline and sub-line; One patient act says "Cyvo answers"), not a front desk. Hero card now builds the money on scroll: it starts "Autopilot off", each outcome switches on, and a bar + equation sum to ₹1,03,500 a month (phones: as the card crosses the screen; desktop: over the first half-screen). Founder line: "built AI systems for 7+ years and helped software companies grow past $1M a year in revenue" (the "10,000+ managers" claim is removed here and on the checkup) | User wanted the ₹1 lakh to be explained by an animation, revealed on scroll, and a clearer "personal assistant" framing. |
| 2026-10-20 | Hero rebuilt around outcomes and money: "Your front desk, on autopilot. Even at 11 pm."; sub-line "connect it once… you just watch"; sample-clinic total (₹1,03,500 a month, labelled estimate, links to the Impact maths); buttons "Book a 5-minute demo" + "What's my clinic's number?"; an "Autopilot on" card lists the four outcomes (answers at 11 pm, cuts no-shows, collects reviews, brings patients back) with monthly values read from the Impact act, plus "You: just watch" (Sunday report card, 50 hours back). The 10:41 pm chat moved out; the One patient act tells that story | User wanted the first screen to show the whole picture and the money, not only night replies. |
| 2026-10-20 | New hero: headline kept (3 lines on phones, sized at 12.6vw); sub-line ends on the payoff ("…books with you, not the clinic down the road"); a 10:41 pm sample chat that ends in a booking replaces the four people tiles (the team act still introduces them); primary CTA "Book a 5-minute demo", secondary "How many patients am I losing?"; on phones both buttons sit above the chat so they're on the first screen even at 640px; founder line drops "AI"; "Open at 11 pm" sticker removed; hero entrance and chat run on CSS animation so they appear before scripts load on slow data; the floating scroll pill shows only inside pinned acts; hero buttons send `hero_demo` / `hero_check` events | User asked for a clearer, higher-converting first screen. |
| 2026-10-20 | Home page given the same review: hero sub-line now says what Cyvo is (an assistant on the clinic's WhatsApp number) instead of "a team of four specialists"; second hero button "How many patients am I losing?" → Clinic Vitals; founder credential added; every research line names who was studied (US bookings, US sales enquiries, children's dental OPD, vaccinations, US survey); unsourced "Most never are" removed; reminder card now cites BMJ Open 2016; Impact numbers carry "How sure" labels; meta description updated. "Live" stickers and the 5-minute demo kept | User confirmed Cyvo is fully working and asked for the same fixes on the home page. |
| 2026-10-20 | Clinic Vitals review applied: loss-first hook + 10:30 pm story on entry; total ₹ shown free (breakdown still gated); Q2 buckets up to 1,300 visits; Q4 adds "I reply myself"; Night replies + Enquiry follow-up labelled "Our estimate"; claim wording names the study's population (US, children's OPD, vaccinations); fixers renamed "Cyvo night desk / follow-up / reminders / recall / reviews" with a one-line "what Cyvo is"; demo CTA replaced by a Founding clinics offer (price, guarantee and deposit lines hidden until set in `FOUNDING`); consent "at most 3 times" + stored consent version; report links carry a random ID only; funnel events; og:image | User's review doc "Clinic Vitals: gaps and fixes before launch". |
| 2026-10-20 | Word "leak" replaced by "gap" in all copy (Gap 1 of 4, Four gaps, One specialist for each gap, "Not covered yet"). Code class names keep `leak-` | User: "leak" is not acceptable to doctors. "Gap" echoes the clinical term "care gap", is calm, and keeps the four-part structure. |
| 2026-10-20 | Clinic Vitals: specialists by job title (not Swagat/Yaad/Wapsi/Shukriya); every vital shows "What the research says" with source tags and a "How sure" label (Backed by research / Research + our estimate / Our estimate); unverifiable claims dropped (rater8, Juno, "15% of lapsed patients" vendor figure); recall uses Cochrane 2018's ~8 in 100; no-show base 21% from BMJ Open 2016 | User asked the report to match the site's specialists and be backed by real research. |
| 2026-10-20 | Clinic Vitals flow made Typeform-like: one question per screen, A/B/C keys, 0.26s tap confirmation, rupees shown blurred on the free score, gate split into name → clinic → channel → contact, specific privacy promises next to the button instead of "no spam" | Stepped forms convert better in published case studies; one test found "we will never spam you" cut sign-ups 18.7%, while concrete privacy statements near the button helped. |
| 2026-10-19 | Clinic Vitals checkup (`vitals.html`, web/src/vitals/) replaces the planned savings calculator: 8 tap questions, free score, then a gate that collects name, clinic and WhatsApp number or email with consent. Backend is a Google Apps Script on the pipeline sheet (backend/apps-script). Email sends automatically; WhatsApp is hand-sent from a one-tap alert until a Meta template is approved | User's new lead hook (Clinic Vitals brief v3). This lifts the brief's 'no email or phone capture' rule for this page only, with explicit consent. |
| 2026-10-19 | Every pinned act (leak, team, rules, patient, impact) gets the same scroll-linked backdrop (`Backdrop` in web/src/components/ui.tsx): stage colour blends beat to beat, a strip of oversized words slides across, main visual drifts. Scroll cue gets a pulsing halo, two falling chevrons and a gentle bob | User liked the impact act's scroll feel and wanted it everywhere, plus a clearer prompt to keep scrolling. |
| 2026-10-19 | Lenis smooth wheel scroll (touch native, off with reduced motion); Impact act opens on the total and lists the leaks largest first; its background colour, a wide strip of words and the art all move with scroll | User asked for the scroll feel of crosswalk.cl, which uses Lenis plus scroll-linked transforms. This replaces the earlier 'no scroll-jacking' rule for wheel input only. |
| 2026-10-18 | Page rebuilt in React 18 + Motion (Vite, pre-rendered) in `web/`, following `design/STORY-SCRIPT.md`: hero → the leak → the team → your rules → one patient → the impact → close. Research-backed claims with source tags and a sources list; memory and routines act | User asked for a clearer story, research-backed impact, and a React + animation-library rebuild. Pre-rendering keeps content readable without JS; ~108 KB gzipped JS accepted over the brief's 'no heavy framework' guideline at the user's request. |
| 2026-10-17 | All four specialists are live (Reviews and Recall no longer "coming soon"); new pinned scene "After the visit" tells the Reminder, Reviews and Recall stories; chapter rail gains it; scroll cue moves to bottom-left on desktop | User confirmed all agents are live and asked for their stories in the scroll. |
| 2026-10-17 | Butter dropped: the whole page uses the blush #fbf6f4 ground (colour comes from the specialist blocks and results scenes) | User preferred the team section's background everywhere. |
| 2026-10-17 | Hero shows the team: 2×2 specialist tiles (400px thumbnails, ~35 KB total) with names, status and sample notifications, replacing the phone chat (still shown in 'Tell it once') | User wanted the team and each specialist highlighted in the first screen. |
| 2026-10-17 | Added scroll guidance: progress bar, scroll cue with scene ring, chapter rail | Visitors need to know the page is a scroll story and how far each scene goes. |
| 2026-10-17 | Dark navy grounds replaced with soft butter #fcf1cf; white cards with hairlines; outgoing chat bubbles ink with white text; 'Morning' is now butter → blush | User still read the navy as purple and wanted soft backgrounds like the specialist colour blocks. Butter is the only tested pastel where orange text passes AA at small sizes (4.7:1). |
| 2026-10-17 | Motion changed from "almost none" to an Apple-style scroll story (pinned scenes: night, tell it once, team, results, closing statement) | User request, referencing apple.com product pages. Kept light (no library, ~3 KB JS, transform/opacity only) with a full static fallback for no-JS and reduced motion. |
| 2026-10-17 | Results scene uses invented, clearly labelled sample figures; report card corrected to ₹13,600/week | User asked for placeholder outcomes until real data exists. Labels keep it within ASCI and the brief; ₹41,000/week was inconsistent with 17 bookings × ₹800. |
| 2026-10-17 | Specialist images approved; portraits cropped above the Gemini watermark; team tiles recoloured to match each card | Cropping keeps waist-up framing and removes the mark without editing it out; total image weight ~125 KB, lazy-loaded. |
