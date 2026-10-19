# Cyvo

Static landing page (`index.html`, `data.html`) for Cyvo, a WhatsApp front desk for private clinics in Mumbai. The product brief, copy rules and compliance limits are in `Reamde.md`; read it before writing copy. Page copy (including the later savings calculator page) is in `COPY.md`. Gemini prompts for the specialist illustrations are in `design/image-prompts.md`.

## Design system
Before writing or changing any UI, read DESIGN.md at the project root and follow it.
- Use tokens from design/tokens.css (CSS variables), never hardcoded colors, sizes, or fonts.
- Respect the Never list in DESIGN.md.
- If a task needs something DESIGN.md does not cover, propose an addition to DESIGN.md first.
- If DESIGN.md was edited by hand, run /design-director sync to regenerate tokens.

## Site code
The live page is the React app in `web/` (see `web/README.md`). The scroll story follows `design/STORY-SCRIPT.md`. The older single-file `index.html` at the root is superseded.
