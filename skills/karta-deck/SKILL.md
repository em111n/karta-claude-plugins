---
name: karta-deck
description: Build presentation decks in the Karta visual language — black background with acid `#ccff00` accents, Archivo variable display font, sticky-recede section heroes, and interactive components (Lightbox images, fullscreen video carousels, click-through product-design lists, Figma prototype embeds that open into browser fullscreen). Use when a user asks to create a demo deck, pitch deck, investor deck, monthly review, roadmap slide set, or any Karta-branded slide-style presentation.
---

# Karta Deck

Single-page decks rendered as long-scroll HTML. No bundler — Babel-standalone compiles JSX in the browser at load time. Each section is a full-viewport block with a sticky "recede" hero and a body that scrolls up underneath.

Live: **demo.karta.io** (monthly demo days, open) and **doc.karta.io** (investor & partnership pitch decks, password-protected). Sources live in the org repos `karta.demo` and `karta.design`; as decks grow, content is split into `sections-a.jsx` / `sections-b.jsx` / `sections-c.jsx`.

## Starting a new deck

1. Copy the files in `template/` to a new folder — that's the minimum runnable deck.
2. Serve with any static file server for local preview (`python3 -m http.server 8942`). You never need GitHub to author or preview.
3. Author new sections in your own `sections.jsx` (or split into `sections-a.jsx`, `sections-b.jsx`, `sections-c.jsx` as it grows). Register each section in the `SECTIONS` array so the menu picks them up.
4. Every time you edit a `.jsx` / `.css` file, bump the `?v=NN` cache-buster in `index.html` — otherwise Babel serves stale code.

## Publishing (hand-off)

You do **not** need GitHub access to make a deck. Author and preview locally, then hand the deck to the deck maintainer as a **zip archive** — they merge it into the right repo and deploy:

- **Demo** decks → `karta.demo` → **demo.karta.io** (open).
- **Pitch** / investor decks → `karta.design` → **doc.karta.io** (password-protected; encryption + deploy are applied by the maintainer, not in the deck).

To package, ask Claude Code to zip the deck folder (runtime files + `assets/`). Don't add passwords or deploy config to the deck itself.

## What's in this skill

- `references/design-tokens.md` — colours, typography, spacing, motion. **Read first** before touching styles.
- `references/primitives.md` — every reusable component that ships with the deck (StatBlock, ColBlock, BulletList, Funnel, SectionHero, Section, Reveal, Lightbox, VidThumb). Signatures + when to use each.
- `references/section-patterns.md` — the recurring shapes: stats row, two-column narrative, product-design click-through, video-ads carousel, before/after table, comparison funnel.
- `references/setup.md` — the boring bits: index.html gotchas, cache busting, hash scrolling, running the preview locally.
- `template/` — a runnable minimum deck. Copy the folder verbatim to start; do not edit these template files in place.

## Ground rules

- **Colour**: black `#050505` background, acid `#ccff00` accent used sparingly (highlighted words, KPI values, primary CTAs). Grays graduate `--pp-fg` → `--pp-fg-2/3/4`. Never introduce a new brand colour — extend the palette via CSS variables in `colors_and_type.css`.
- **Type**: Archivo variable — display uses `wdth 115–125, wght 700–800`; body 500. Always set `font-stretch` inline via `fontStretch` + `fontVariationSettings` so display type looks correct.
- **Motion**: reveal-on-scroll for cards, sticky-recede for section heroes, staggered per-word or per-character animation on titles. Do not add new easings — reuse `cubic-bezier(.44,0,.16,1)` and its reduced-motion fallback.
- **Layout**: everything sits inside a `<Section>` wrapper. Two-column grids collapse to one column at `max-width: 900px` via the `.dd-two-col` class. Charts scroll horizontally inside their frame; the page body never scrolls sideways.
- **Interaction**: images with `data-lightbox-src` open in the shared Lightbox (already wired in `<Lightbox/>`). Videos use the `VideoAdsRow` carousel pattern — keyboard `←/→` navigate, `Esc` closes. Figma prototypes use `iframe` + Fullscreen API so the browser goes full-screen on click.
- **Content**: numbers first, verbs second, adjectives never. Section heroes are `kicker · num · title (with one acid word)`. Copy in Russian and English mixes fine; keep terminology consistent inside a deck.

## Anti-patterns to reject

- Adding a build step (Vite, Next, Webpack). The deck runs on any static host with no toolchain — do not "modernise" it.
- Emojis in body copy or headings. Kickers, section labels, KPI subs — all plain text.
- New fonts. Archivo covers display, body, and mono via CSS variables.
- Loose colours (`#e0e0e0`, `rgba(255,0,0,.3)`) inside components. Every colour lives in `colors_and_type.css`; components read the token.
- Autoplaying video anywhere in preview panels. Preview posters freeze at ~1s; playback happens only in the fullscreen modal.

## When the user asks for something not covered

If they ask for a chart type, section shape, or interaction not in `references/section-patterns.md`, build it — but match the primitives' visual grammar (dashed vs solid borders, glass gradients, acid highlight, tabular-nums for numbers) and add it to the references so the next deck picks it up.
