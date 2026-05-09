# Malaysia Family Trip 2026

Collaborative trip-planning website for the family — Kuala Lumpur, Penang, Langkawi from **25 May → 3 June 2026**.

Notes and suggestions sync in real time across every device that has the URL open. The app polls the server every 8 seconds; when something changes a quiet toast appears and the page updates without losing your cursor in a notes field.

## Run it

```bash
npm install
npm start
```

Open http://localhost:3000 — share the URL with the family on the same network or expose it via [ngrok](https://ngrok.com), Tailscale, or any tunnel.

## Deploy it (optional)

The whole thing is one Node process plus static files. It runs anywhere Node runs — Render, Railway, Fly.io, your home server. Set `PORT` if you need something other than 3000.

## How the family uses it

1. **First visit** — pop in your name. It's stored on your device and gets attached to suggestions and notes you post.
2. **Itinerary tabs** — KL · Penang · Langkawi. Click any day to expand. Each day has a shared "Family Notes" field — type to suggest restaurants, voice concerns, share reminders.
3. **Family Suggestions** (right panel) — drop ideas. Anyone can vote 👍 or 👎. Only the author can delete their own.
4. **Hotels** — filter by Budget / Mid-range / Luxury / Apartments. Click any card to expand pros + family fit + booking link.
5. **Personal notes** — bottom-right pencil button. Just-for-you packing list / budget tracker. Saved per-device.
6. **Share** — top-right Share button shows the URL to send to family.

## What's where

```
.
├── server.js                  # Express API + static file serving
├── data/trip.json             # Synced state (notes, suggestions) — written live
├── public/
│   ├── index.html             # App shell
│   ├── css/styles.css         # Editorial design system
│   └── js/
│       ├── data.js            # Trip content (cities, days, activities, hotels)
│       └── app.js             # Frontend logic + 8 s polling loop
└── package.json
```

## Editing the trip content

Itinerary, hotels, and transfers live in [`public/js/data.js`](public/js/data.js). Edit them in place — no rebuild needed, just refresh the browser.

## Editing the design

Colour palette is at the top of [`public/css/styles.css`](public/css/styles.css) — change the `--kl-*` / `--penang-*` / `--langkawi-*` accents and the rest cascades. Fonts are Cormorant Garamond + Outfit + JetBrains Mono via Google Fonts.

## API surface

Tiny on purpose:

| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET    | `/api/state` | — | full state snapshot |
| GET    | `/api/sync`  | — | `{lastUpdate, version}` cheap for polling |
| POST   | `/api/notes` | `{dayId, text, author}` | upsert family note for a day |
| POST   | `/api/suggestions` | `{name, day, text}` | post idea |
| POST   | `/api/suggestions/:id/vote` | `{vote, deviceId}` | toggle 👍/👎 (one per device) |
| DELETE | `/api/suggestions/:id` | — | remove suggestion |
| GET    | `/api/personal-notes/:deviceId` | — | per-device pad |
| POST   | `/api/personal-notes` | `{deviceId, text}` | save per-device pad |
