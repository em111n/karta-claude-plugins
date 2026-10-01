# Design tokens

All tokens live in `colors_and_type.css` and are consumed via CSS variables. JSX components mirror them as JS constants at the top of each `sections-*.jsx` / `demo-sections.jsx` file:

```jsx
const ACID  = "var(--pp-acid)";     // #ccff00
const FG    = "var(--pp-fg)";       // #fafafa
const FG2   = "var(--pp-fg-2)";     // ~ #d0d0d0
const FG3   = "var(--pp-fg-3)";     // ~ #a0a0a0
const FG4   = "var(--pp-fg-4)";     // ~ #6b6b6b (labels)
const LINE  = "var(--pp-line)";     // #2a2a2a (borders)
const CARD  = "var(--pp-card)";     // #111 (raised)
const FD    = "var(--pp-font-display)";
const FB    = "var(--pp-font-body)";
```

Don't introduce new hex codes inline — extend `colors_and_type.css` and add a JS constant if needed.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--pp-page` | `#050505` | page background |
| `--pp-card` | `#111` | raised surface (rare) |
| `--pp-line` | `#2a2a2a` | 1px borders on cards |
| `--pp-acid` | `#ccff00` | primary accent — highlighted words in headings, KPI values, primary CTA, active tab, chart series |
| `--pp-fg` | `#fafafa` | primary text |
| `--pp-fg-2` | ~`#d0d0d0` | secondary text |
| `--pp-fg-3` | ~`#a0a0a0` | supporting text |
| `--pp-fg-4` | ~`#6b6b6b` | eyebrows, meta, disabled |

Chart series (outside the acid highlight) draw from a muted palette: `#4a90e2` (blue), `#a78bfa` (violet), `#a04a5e` (mauve), `#e0a55e` (amber), `#e07a3f` (orange), `#3ac16f` (green). Reuse these; do not sample new palettes per chart.

Backgrounds for glass cards:

```
background: linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.015) 70%);   /* neutral */
background: linear-gradient(135deg, rgba(204,255,0,.06),  rgba(204,255,0,.015) 70%);      /* accent */
```

Border pairs to match:

```
border: 1px solid var(--pp-line);            /* neutral */
border: 1px solid rgba(204,255,0,.28);       /* accent */
```

## Typography

Archivo variable font (`fonts/archivo.woff2`), single weight file covers 100–900 and stretch 62–125.

| Role | Family var | Weight | Stretch | Notes |
|---|---|---|---|---|
| Display | `--pp-font-display` | 700–800 | 115–125 | Headings, KPI values, section titles. Always set `fontStretch` + `fontVariationSettings`. |
| Body | `--pp-font-body` | 500–600 | 100 | Paragraphs, list items. |
| Meta | `--pp-font-display` | 600–700 | 100 | Eyebrows, table headers — uppercase + `letter-spacing: .18em – .22em`. |
| Numbers | any | matches context | 100 | Add `font-variant-numeric: tabular-nums` for column-aligned figures. |

Sizing uses `clamp()` almost universally: `fontSize: "clamp(24px, 3vw, 40px)"`. Never hard-code font-size in px without a clamp — decks are viewed on studio monitors and phones.

Letter-spacing:
- Display headlines: `-.03em` (tight)
- Big titles: `-.02em`
- Uppercase eyebrows: `.18em – .22em`

## Spacing

Sections use `clamp()` for vertical rhythm:

```
gap between sub-blocks:   clamp(16px, 2vw, 24px)
padding on cards:         clamp(20px, 2.4vw, 32px)
gap between major blocks: clamp(48px, 6vw, 90px)
paddingTop new subsection: clamp(48px, 6vw, 88px)  + borderTop var(--pp-line)
```

Horizontal card gutters follow the same pattern. A grid gap `clamp(14px, 1.8vw, 22px)` is the workhorse.

## Radii

- Cards: `12–14px` (`borderRadius: 12` most cases, `14` for the outer container of a slide-scale block).
- Pills / chips: `999px`.
- Circles (Play buttons): `50%`.

## Shadows and glow

Almost no shadows on cards. Two exceptions:
- Play button: `boxShadow: "0 10px 30px rgba(204,255,0,.24), 0 0 0 1px rgba(204,255,0,.5)"`.
- Section hero glow: baked into a `radial-gradient` background on the sticky element, not a `box-shadow`.

## Motion

Ease: `cubic-bezier(.44,0,.16,1)` — assign to `--pp-ease` if you need a variable.
Durations: reveal 800ms, stagger step 40–50ms, hover 180–250ms, section-recede transform ~1200ms.

Reduced-motion: every animation must have `@media (prefers-reduced-motion: reduce)` fallback that sets opacity to 1 and disables transforms. See how `.pp-rise` and `.reveal` are defined in `index.html` styles.
