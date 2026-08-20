# Base Coffee — motion landing page

A single-page site for **Base Coffee**, Road No. 46, Jubilee Hills, Hyderabad.

Dark cinematic direction: near-black ground, the café's own footage full-bleed,
cream type over it. Archivo for structure, Instrument Serif italic for the
quiet moments.

## Three motion beats, and only three

1. **Hero aperture** — the 日 mark holds as a logo lockup, grows to fill the
   viewport, and its centre bar tears in half; the footage pours out of the gap.
   The mark is drawn in real viewport pixels rather than scaled, so the stroke
   weight never distorts mid-flight.
2. **Pinned menu rail** — the signatures pan horizontally while the section is
   pinned. Pan distance is measured off the rail's own `scrollWidth`, not
   guessed in `vw`, so it lands exactly on the last card at every width.
3. **Base Buddy** — the mascot reveal. The 日 in the corner fills with coffee as
   you scroll, which is the only piece of chrome on the page and doubles as the
   scroll indicator.

## Content provenance

Every image, video, product name, and line of voice copy comes from
[@basecoffeeindia](https://www.instagram.com/basecoffeeindia/) — 21 reels and
4 photo posts, transcoded for web (`scale≤1280×960`, H.264 CRF 30, audio
stripped, `+faststart`). 13 MB of media total.

The logo was rebuilt as SVG from pixel measurements off a 1080px post:
outer rectangle 50 × 69, stroke 10% of width, centre bar of the same weight
splitting it exactly in half.

**There are no prices and no opening hours on this site.** Base has not
published either, so neither was invented — Hours links out to Google Maps.

## Develop

```bash
npm install
npm run dev        # http://localhost:3060
npm run build      # static export to ./out
```

## Deploy

Static export, no `basePath` — it is built for a custom domain, so the
tailnet `/base-coffee/` path preview will render unstyled by design.

```bash
npm run build
rsync -az --delete ./out/ root@187.127.134.219:/srv/base-coffee/
```

Routed on the bombay VPS via `domain-add basecoffee.in base-coffee --preview`.
DNS: A records for `@`, `www`, `staging` → `187.127.134.219`.
