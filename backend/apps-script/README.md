# Clinic Vitals backend

A Google Apps Script bound to the pipeline sheet. It saves each lead to the sheet, scores the answers with the same code as the page, makes the PDF, emails the report, and sends you an alert for every lead. It costs nothing and needs no server.

| File | What it is |
|---|---|
| `Logic.gs` | Generated from `web/src/vitals/logic.ts`. After changing the scoring, run `npm run build:backend` in `web/` and paste it in again. |
| `Code.gs` | Saving leads, PDF, email, WhatsApp, alerts, unsubscribe, cleanup. |

## Set up (about 15 minutes)

1. Create a Google Sheet called **Cyvo pipeline**. Open **Extensions → Apps Script**.
2. Make two script files, `Logic.gs` and `Code.gs`, and paste in these two files.
3. **Project settings → Script properties**. Add these properties:
   - `SITE_URL`: your live site, e.g. `https://cyvo.in`, with no trailing slash
   - `ALERT_EMAIL`: where lead alerts go
   - `SECRET`: any long random string
   - `WA_MODE`: `manual`
4. In the editor, run `setup` once and approve the permissions. This creates the **Leads**, **Events** and **Clinics** tabs and a daily cleanup.
5. Run `testSubmit`. You should get the test report email (score 34, about ₹3,92,000) and a lead alert.
6. Go to **Deploy → New deployment**:
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   
   Copy the `/exec` URL.
7. In `web/src/data/content.ts`, set `VITALS_ENDPOINT` to that URL, then rebuild and deploy the site.

Each time you change `Code.gs` after that, use **Deploy → Manage deployments → Edit → New version**. This keeps the same URL.

## Updating from an earlier version

The **Leads** tab gained three columns at the end: `report_id`, `consent_version`, `opted_out_at`. Add those headers by hand to an existing sheet. The **Events** tab gained a fourth column, `n`. Report links now look like `/vitals.html?report=<16 random characters>`; nothing personal is in the link.

## Flow A prefill

Add rows to the **Clinics** tab: `c` (the ID you put in `?c=`), `name`, `clinic`.

## How each channel works

**Email: automatic from day one.** It is sent from your Gmail, with the PDF attached. A free Gmail account can send about 100 emails a day, which is plenty for now. If you outgrow it, move to Google Workspace (1,500 a day) or Resend.

**WhatsApp phase 1 (now, `WA_MODE=manual`): you send it by hand.** Each lead emails you an alert subject-lined `[Send]`. The alert has a button that opens WhatsApp to the doctor with the report message already typed, and the PDF is attached for you to forward. It takes one tap from your phone. The page tells the doctor it usually arrives within the hour, and shows him the full report straight away.

**WhatsApp phase 2 (`WA_MODE=api`): automatic, within a minute.**
1. Set up the WhatsApp Cloud API in Meta Business Manager. Use a separate number, not your personal one: a number on the API can't also be used in the WhatsApp phone app.
2. Submit this template, category **Marketing** (it offers a founding place), with a **Document** header:

   > Hi {{1}}, here is the Clinic Vitals report for {{2}}.
   >
   > Score: {{3}}/100
   > Estimated loss: about ₹{{4}} a year, roughly {{5}} patients.
   > Weakest vital: {{6}}
   >
   > The full breakdown and how we calculated it are in the PDF.
   >
   > Cyvo is being set up with 10 Mumbai clinics first. Reply FOUNDING and I'll tell you how it would work at {{2}}.
   >
   > Shehbaz, Cyvo
   > Reply STOP to stop messages.

   Add the Hinglish version as a second language if you want it.
3. Once it's approved, add `WA_TOKEN`, `WA_PHONE_ID`, `WA_TEMPLATE` and `WA_TEMPLATE_LANG` to the script properties, and set `WA_MODE` to `api`.
4. Set `VITALS_WHATSAPP_MODE = 'api'` in `content.ts`. The confirmation screen then says "under a minute".

The report goes as **one message with the PDF in the header**, not an image followed by a PDF. A business-started chat only allows one template message until the doctor replies. The PDF header also shows page 1 (the score and the total) as the preview, so it does the job of the image card.

**Replies (FOUNDING, STOP):** in phase 1 they come to your phone and you answer them yourself. In phase 2, answering them automatically needs a webhook. Apps Script can't reliably receive Meta webhooks, so that would be a small Cloudflare Worker. Until then, answer from the WhatsApp Business inbox.

## Data rules (Clinic Vitals brief v3, §11)

- The sheet stores only the gate fields, the answers code and the result. A score view stores the source and nothing else.
- To stop someone, set `status` to `opted_out`. Email unsubscribe links do this automatically.
- Delete requests: delete the row by hand within 7 days and confirm by message.
- Set `status` to `cold` 10 days after the last follow-up. Cold rows are deleted automatically after 90 days.
