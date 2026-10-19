# Cyvo image prompts (Gemini)

Illustrations of the four front desk specialists, plus an optional team image. Style rules come from `DESIGN.md` §7. Every prompt below is complete; copy the whole block.

## Workflow

1. Generate **#1 Front desk specialist** first, in a fresh chat. Ask for 1:1 (square). Regenerate or edit until it passes the checklist at the bottom. This image becomes the style master.
2. For #2–#4: start each in the same chat, or a new one with the approved image **attached**. The prompts already begin with "Same illustration style as the attached image".
3. Small fixes: reply with one short edit at a time, e.g. "Same image, but thinner outlines", "remove the text on the badge", "less detail in the hair", "make the background one flat colour".
4. Download the full-size PNG. Save it as `design/images/originals/front-desk.png`, `reminder.png`, `reviews.png`, `recall.png`, `team.png`. Claude will crop, compress to WebP ≤ 30 KB and wire them in.
5. Never use an image that looks like a photograph. The specialists must read as illustrated characters, not real staff.

---

## 1. Front desk specialist (style master, periwinkle)

```
Flat editorial illustration of a young Indian woman working as a clinic front desk specialist in Mumbai. Waist-up, centred, facing slightly toward the viewer, friendly and calm, competent expression. She wears a slim over-ear headset with a small microphone. She holds a phone in one hand, turned slightly toward us; the screen shows a simple calendar slot shape with no readable text. Her other hand makes a small reassuring gesture. She wears a simple navy collarless front-desk uniform top with a small blank blush-white name badge.

Style: confident hand-drawn ink outlines in deep navy (#17164D), limited flat colour fills, subtle paper grain, no gradients, only one flat shadow tone. Palette strictly: navy #17164D, blush white #FBF6F4, periwinkle #8A90F2, butter yellow #F6D66B, soft pink #F4C3CF, a small touch of tomato #EA5A2E. Clean and uncluttered, generous space around the figure.

Background: one flat periwinkle colour (#8A90F2), nothing else.
Square 1:1 format.

Do not include: any text, letters or logos; WhatsApp logo or green chat bubbles; robots, circuits, glowing effects, sparkles or holograms; stethoscopes, lab coats or medical scrubs; photorealism or 3D rendering; gradients; star ratings.
```

## 2. Reminder specialist (butter)

```
Same illustration style, line weight, colour palette, proportions and level of detail as the attached image. This is a colleague from the same team.

Flat editorial illustration of an Indian man in his thirties working as a clinic reminder specialist in Mumbai. Waist-up, centred, facing slightly toward the viewer, friendly and organised. Neat short hair, sleeves rolled up. He holds up a blank blush-white appointment card in one hand and a small round tomato-coloured desk bell in the other. Same navy collarless front-desk uniform top with a small blank blush-white name badge.

Style: confident hand-drawn ink outlines in deep navy (#17164D), limited flat colour fills, subtle paper grain, no gradients, one flat shadow tone. Palette strictly: navy #17164D, blush white #FBF6F4, periwinkle #8A90F2, butter yellow #F6D66B, soft pink #F4C3CF, a small touch of tomato #EA5A2E.

Background: one flat butter yellow colour (#F6D66B), nothing else.
Square 1:1 format.

Do not include: any text, letters or logos; WhatsApp logo or green chat bubbles; robots, circuits, glowing effects, sparkles or holograms; stethoscopes, lab coats or medical scrubs; photorealism or 3D rendering; gradients; star ratings.
```

## 3. Reviews specialist (pink)

```
Same illustration style, line weight, colour palette, proportions and level of detail as the attached image. This is a colleague from the same team.

Flat editorial illustration of an Indian woman in her forties working as a clinic reviews specialist in Mumbai. Waist-up, centred, facing slightly toward the viewer, warm and gracious, as if thanking a patient. Curly hair tied back. She holds a blank blush-white card with one single outlined star on it (only one star). Same navy collarless front-desk uniform top with a small blank blush-white name badge.

Style: confident hand-drawn ink outlines in deep navy (#17164D), limited flat colour fills, subtle paper grain, no gradients, one flat shadow tone. Palette strictly: navy #17164D, blush white #FBF6F4, periwinkle #8A90F2, butter yellow #F6D66B, soft pink #F4C3CF, a small touch of tomato #EA5A2E.

Background: one flat soft pink colour (#F4C3CF), nothing else.
Square 1:1 format.

Do not include: any text, letters or logos; WhatsApp logo or green chat bubbles; robots, circuits, glowing effects, sparkles or holograms; stethoscopes, lab coats or medical scrubs; photorealism or 3D rendering; gradients; more than one star.
```

## 4. Recall specialist (light periwinkle)

```
Same illustration style, line weight, colour palette, proportions and level of detail as the attached image. This is a colleague from the same team.

Flat editorial illustration of an Indian man in his twenties working as a clinic recall specialist in Mumbai. Waist-up, centred, facing slightly toward the viewer, friendly and attentive. Round glasses, short wavy hair. He holds a tear-off calendar page with one date circled in tomato red; no readable numbers or text. Same navy collarless front-desk uniform top with a small blank blush-white name badge.

Style: confident hand-drawn ink outlines in deep navy (#17164D), limited flat colour fills, subtle paper grain, no gradients, one flat shadow tone. Palette strictly: navy #17164D, blush white #FBF6F4, periwinkle #8A90F2, butter yellow #F6D66B, soft pink #F4C3CF, a small touch of tomato #EA5A2E.

Background: one flat very light periwinkle colour (#E4E5FD), nothing else.
Square 1:1 format.

Do not include: any text, letters or logos; WhatsApp logo or green chat bubbles; robots, circuits, glowing effects, sparkles or holograms; stethoscopes, lab coats or medical scrubs; photorealism or 3D rendering; gradients; star ratings.
```

## 5. Team image (optional; attach all four approved images)

```
Same illustration style, line weight, colour palette and character designs as the four attached images. Show these exact four characters together as one team.

Full-body flat editorial illustration of the four clinic front desk specialists standing side by side like colleagues, relaxed and confident, shoulders slightly overlapping. Each stands on their own square colour tile: periwinkle #8A90F2, butter yellow #F6D66B, soft pink #F4C3CF, light periwinkle #E4E5FD. They keep their props: headset and phone, appointment card and desk bell, card with one star, circled calendar page.

Style: confident hand-drawn ink outlines in deep navy (#17164D), limited flat colour fills, subtle paper grain, no gradients, one flat shadow tone.

Background: flat blush white (#FBF6F4).
Wide 16:9 format.

Do not include: any text, letters or logos; WhatsApp logo or green chat bubbles; robots, circuits, glowing effects, sparkles or holograms; stethoscopes, lab coats or medical scrubs; photorealism or 3D rendering; gradients.
```

## Open Graph image (not generated)

Build the 1200×630 preview card in HTML from the approved tiles: navy background, headline in League Gothic caps, "EVEN WHEN YOU DON'T." in #FF8A63, the four tiles small along the bottom, "CYVO." wordmark. Claude can build it once the tiles exist.

---

## Checklist before using an image

- [ ] Reads clearly as an illustration, not a photo or a real employee.
- [ ] Outlines navy, fills flat, no gradients or glow.
- [ ] Background is one flat colour, matching the hex in the prompt.
- [ ] No text, letters, logos, green bubbles, robots, scrubs, or more than one star.
- [ ] Hands and props look right (count the fingers).
- [ ] Looks like the same team as the Front desk specialist (line weight, face style, uniform).
- [ ] No visible watermark in a corner. If there is one, regenerate in Google AI Studio or crop it out.
