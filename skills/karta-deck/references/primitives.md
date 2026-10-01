# Primitives

All primitives are defined in `components.jsx` and are globally available in every `sections-*.jsx` / `demo-sections.jsx` file (Babel-standalone flattens the scripts into one scope).

## `<Section>`
Outer wrapper — sets max width, side padding, and applies the sticky-recede offset that pairs with `<SectionHero>`.

```jsx
<Section tightTop dataLabel="03 Product">
  ...content...
</Section>
```

- `tightTop`: pass when a `<SectionHero>` immediately precedes it (removes double gap).
- `dataLabel`: the string that shows in the fixed header's active-section badge. Format: `"NN Title"`.

## `<SectionHero>`
Sticky 88vh section that recedes as its body scrolls up.

```jsx
<SectionHero id="marketing" num="05" kicker="marketing"
  align="left" glow
  parts={[{ t: "GTV new users " }, { t: "+80% MoM.", hi: true }]}
  lead="Reassembled analytics after two hits." />
```

- `id`: element id — also the scroll-spy target and the `href="#..."` anchor.
- `num`: two-char slide number, shown as a huge ghost numeral in the sticky bg.
- `kicker`: uppercase eyebrow shown as the massive sticky title.
- `kickerNode`: if you need a coloured character inside the kicker, pass JSX here — bypasses the word-level colouring of the default StaggerTitle. Still pass `kicker` as a plain string too (used in the `data-screen-label` attribute).
- `parts`: an array of `{ t, hi?, br? }` chunks that becomes the H1 in the body of the section. Only whole parts can be highlighted acid via `hi: true`.
- `lead`: single-sentence sub headline.
- `align`: `"left"` or `"center"`.
- `glow`: enables the acid radial gradient background on the sticky hero.

## `<StatBlock>`
KPI tile — big number, tiny label, sub caption.

```jsx
<StatBlock label="GTV · new users" value="+80%" sub="MoM · fresh cohort" accent big />
```

- `accent`: acid gradient + acid-tinted border and value.
- `big`: bumps the value size ~30%.

Layout in a row: `display: grid; gridTemplateColumns: repeat(auto-fit, minmax(200px, 1fr)); gap: clamp(14px, 1.6vw, 22px)`.

## `<ColBlock>`
Titled bullet card. Renders an uppercase title + bulleted list of items. Items can contain `<b>` and inline HTML.

```jsx
<ColBlock title="What worked" items={[
  "First bullet — <b>bold key term</b>",
  "Second bullet",
]} accent />
```

- `accent`: acid border + accent gradient.
- `kicker`: extra small eyebrow above the title.

## `<BulletList>`
Plain bulleted list without a card wrapper.

```jsx
<BulletList items={[
  "Point one",
  "Point <b>two</b>",
]} dense />
```

- `dense`: tighter line-height and smaller font for cramped panels.

## `<Reveal>`
Wraps children in a fade-and-lift on scroll-into-view.

```jsx
<Reveal delay={0.08}>
  ...anything...
</Reveal>
```

- `delay`: seconds before the animation starts (stagger by increasing per row).

## `<Funnel>`
Vertical bar comparison — a stacked list of labelled bars.

```jsx
<Funnel data={[
  { label: "Impressions", value: 100_000 },
  { label: "Sign-ups", value: 4200, accent: true },
]} />
```

## `<VidThumb>`
Video thumbnail that clicks to play in the shared Lightbox.

```jsx
<VidThumb src="assets/creative/slide-3-1.mov" cap="Builder Guy · story 1" />
```

The parent `<Lightbox/>` (mounted once at the app root) collects all `[data-lightbox-src]` elements and `<VidThumb>`s and wires up click-to-open.

## `<Lightbox/>`
Mount once at the end of `<App/>`. Automatically opens for any `<img>` or `<VidThumb>` with `data-lightbox-src` / `data-lightbox-cap`. Prev/Next arrows, `Esc` to close, keyboard `←/→` navigation.

## `<ProductDesignBlock/>`
The click-through pattern used in the Design section — list of features on the left, big preview on the right. Supports images OR Figma prototype embeds:

```jsx
const PD_FEATURES = [
  { title: "Negative Balance", img: "assets/pd-jul/negative-balance.png" },
  { title: "24h Offer", proto: "https://www.figma.com/proto/..." },
];
```

Items with `proto` render a kicker + title + big round Play/CTA button. Clicking it opens the Figma iframe embed in a modal AND requests browser fullscreen. Esc / exiting fullscreen closes.

## `<AiDesignSystemBlock/>` / `<VideoAdsRow/>`
Two variants of the same carousel pattern for videos/images:

- `AiDesignSystemBlock` — 4-item click-through list on the left, preview on the right, Play button opens fullscreen with `←/→` navigation between items. Handles mixed images + videos.
- `VideoAdsRow` — a row of 3 tiles (columns configurable), each shows a preview frame captured at ~1s, opens a shared fullscreen carousel modal.

```jsx
<VideoAdsRow items={[
  { src: "assets/creative-jul/referral-ad.mp4", label: "Referral AD", aspectRatio: "4 / 5", accent: true },
  { src: "assets/creative-jul/motion-fin.mp4",  label: "Low Fees",    aspectRatio: "4 / 5" },
  { src: "assets/creative-jul/motion-nb.mp4",   label: "Karta Says Yes", aspectRatio: "4 / 5" },
]} />
```

Preview frame technique: video with `preload="auto" muted playsInline`; on `loadeddata` we try `currentTime = 1.0` and also briefly `play()` + `pause()` after 1050ms so we get past the opening black frames even when the server doesn't support byte-range requests.
