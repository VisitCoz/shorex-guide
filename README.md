# Visit Cozumel — ShoreEx Sell-Card Guide

A mobile web guide that helps **cruise-line shore-excursion reps sell Visit Cozumel tours**.
The rep is seasonal, juggles ~100 tours across ports, and has never done our tour. This guide gives
them, in ~30 seconds: **what the tour is, why it's worth it, and how to pitch it to a guest.**

**Live:** https://visitcoz.github.io/visitcozumel-dashboards/shorex-guide/

---

## How it's built

- `index.html` — the **hub**: a Cinépolis-style poster grid of tours + a "match the guest" band.
- `honey-traditions.html` · `native-kitchen.html` · `city-tour-sky-show.html` — one page per tour:
  hero → plain "what guests will do" description → **Itinerary** (numbered stops) → **Tour Highlights**
  (a big photo per stop, each a swipe carousel of every photo in its folder) → an optional
  **"Notes for selling this tour"** drop-down.
- `styles.css` — all styling. `gallery.js` — builds the per-stop carousels + the fullscreen tap gallery.
- `photos.js` — auto-generated list of every photo (so the static site knows what's in each folder).
- `images/<tour>/<stop>/` — drop photos here.

## Adding photos (no tech needed)

1. Drop any photos into a stop's folder in `images/…` (any name, iPhone HEIC is fine, as many as you like).
2. Double-click **`publish-photos.command`**.
3. Wait ~1 min, then **hard-refresh the page (Cmd+Shift+R)** — browsers cache images, so a normal
   refresh can look like the upload failed when it didn't.

The publish script (`_gen-photos.sh`) converts photos to jpg, renames them to clean `1.jpg, 2.jpg…`,
rebuilds `photos.js`, and pushes live.

---

## Decisions & Why

A running log of the choices behind this guide, so the reasoning is never lost. Newest first.

- **2026-07-25 — Hub posters read the manifest.** After photos were renamed to `1.jpg`, the hub's
  hardcoded `cover.jpg` links broke. The hub now pulls each tour's first hero photo from `photos.js`,
  so it can never fall out of sync again.
- **2026-07-25 — All photos per stop, clean names.** Every photo in a folder is used (swipe carousel),
  not just one. The publish script renames to `1.jpg, 2.jpg…` because phone/download filenames with
  spaces and parentheses broke the photo list.
- **2026-07-25 — Swipe carousel per stop.** Chosen over a long stack of single images (looked "gross")
  and over thumbnail strips — cleanest on mobile, one photo at a time, tap for fullscreen.
- **2026-07-25 — Real place-names (cruise wording).** Each stop titled by its actual landmark
  (Malecón, Mestizaje Monument, Plaza Central, Mercado Municipal, Corpus Christi Church, Mayan Sky Show)
  so it reads credibly to a cruise rep. "Tour at a glance" → **Itinerary**; "beat by beat" → **Tour
  Highlights**.
- **2026-07-24 — "Notes for selling" are recommendations, not scripts.** Reps dislike being told
  exactly what to say / who not to sell to, so the sell-notes are framed as friendly guidance
  (what guests love, good fit for, good to know, handy answers).
- **2026-07-24 — No prices, no "Book Now."** This is a *sales tool for the cruise line's own reps*, not
  a storefront. Sending reps to a page that sells our tours direct (cheaper) would undercut the cruise
  line and risk the vendor relationship. Pricing lives in the rep's own system.
- **2026-07-24 — Standalone host, not our booking site.** Hosted on GitHub Pages, separate from
  visitcozumel.com.mx, so there's zero channel conflict and Mike controls/updates it himself.
- **2026-07-24 — Description is rep-voice, not website copy.** "On this tour, guests will…" — a clear
  summary of what they *do*, not the marketing paragraph already on the cruise-line site.

## Note

This layout (poster-grid hub + story-scroll pages + swipe carousels + drop-and-publish photos) is the
**template for future Visit Cozumel, Tierra Maya, and Cozumel Island Transfer sites**. Those sites do
sell, so — unlike this rep guide — they can include prices and booking.
