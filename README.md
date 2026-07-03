# AI Website Growth Audit — Setup

## What's in here
- `n8n-workflow/seo-audit-workflow.json` — import this into your n8n instance
- `frontend/` — React app (Vite). The form that visitors use.

## Setup steps

### 1. n8n
1. Open your n8n instance (on your Azure VM)
2. Workflows → Import from File → select `seo-audit-workflow.json`
3. Add Anthropic API credentials in n8n: Settings → Credentials → New → "Anthropic API"
   paste your API key from console.anthropic.com
4. Open the "Generate Report with Claude" node and confirm it's using that credential
5. Activate the workflow (toggle in top right)
6. Copy the webhook URL from the "Audit Request Webhook" node — it'll look like
   `https://your-vm-domain/webhook/audit`

### 2. Frontend
1. In `frontend/src/App.jsx`, replace:
   - `N8N_WEBHOOK_URL` with your real webhook URL from step 1
   - the `cal.com` link in the CTA button with your real booking link
2. `cd frontend && npm install`
3. `npm run dev` to test locally
4. `npm run build` then deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages

### 3. Test end to end
Run the dev server, paste a real website URL into the form, and confirm:
- The loading trace shows
- A report renders with a score dial, findings, keywords, content ideas, automation ideas
- The CTA button links to your booking page

## Known things to fix before showing clients
- Some sites block scraper requests (Cloudflare-protected sites especially) —
  the "Handle Fetch Error" branch in n8n catches this and returns a friendly error,
  but you'll want to test against a few real client sites to see how often this happens
- No caching yet — repeated audits of the same URL re-run the full pipeline and
  cost API credits each time. Fine for MVP, add caching (store last result + timestamp
  in a Google Sheet, skip re-running within 24h) once you're getting real traffic
- No lead capture gate yet — currently anyone can run unlimited audits for free.
  Consider adding an email-required step before showing the full report once you
  want to actually build a lead list
