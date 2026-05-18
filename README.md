# express-api-screenshot-taker

A tiny Express microservice that takes a URL and returns a full-page PNG screenshot. That's it. No dashboards, no config UI — just hit an endpoint and get back an image.

## Why this exists

I needed a dead-simple screenshot API I could call from other services. Browser extensions don't work server-side. Third-party screenshot services add latency and cost per call. So I spun this up: a self-hosted Puppeteer backend that runs headless Chromium, waits for the page to fully load, and streams back a PNG.

---

## Usage

```bash
curl "http://localhost:3001/generateImage?url=https://example.com" --output screenshot.png
```

The response is a raw `image/png` binary — pipe it wherever you need it. No base64 wrapping, no JSON envelope.

If the URL is missing you get:

```json
{ "error": "URL is required" }
```

If Puppeteer fails to load the page you get:

```json
{ "error": "Failed to launch the browser process! <reason>" }
```

---

## Run locally

```bash
npm install
node server.js
```

Server starts on **port 3001** by default. Override with `PORT=XXXX node server.js`.

Set `NODE_ENV=production` to tighten CORS — then edit `allowedOrigins` in `server.js` to list the domains you actually want to allow.

---

## Stack

| Thing | What |
|---|---|
| Express 4 | HTTP server |
| Puppeteer 22 | Headless Chromium automation |
| dotenv | Env var loading |

---

## Notes & limitations

- **Full-page screenshots only** — it always captures the entire scrollable page, not just the viewport. Change `{ fullPage: true }` to `{ fullPage: false }` if you want viewport-only.
- **No auth** — CORS is the only gate right now. Don't expose this publicly without adding at least a token check.
- **No queue** — every request spins up a fresh browser process. Under load that's expensive. Works fine for occasional internal use.
- **CORS config has placeholder text** — before deploying, replace `'any domain here'` in `allowedOrigins` with your real domains.
