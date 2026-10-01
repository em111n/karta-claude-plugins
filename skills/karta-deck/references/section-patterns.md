# Section patterns

Common shapes to reach for before inventing something new. Each pattern lists the primitives and the DOM skeleton — style each with the tokens in `design-tokens.md`.

## 1. Section hero + KPI row + narrative cards
The default section shape.

```jsx
<SectionHero id="product" num="03" kicker="product metrics" align="left" glow
  parts={[{ t: "GTV " }, { t: "$11.85M.", hi: true }]}
  lead="79% плана, +7% MoM без one-time." />
<Section tightTop dataLabel="03 Product">
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(14px, 1.6vw, 22px)" }}>
    <StatBlock label="GTV" value="$11.85M" sub="Jul" accent big />
    <StatBlock label="MoM" value="+7%" sub="ex one-time" />
    ...
  </div>
  <div className="dd-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)", marginTop: "clamp(20px, 2.4vw, 28px)" }}>
    <ColBlock title="What worked" items={[...]} accent />
    <ColBlock title="Next" items={[...]} />
  </div>
</Section>
```

## 2. Programmatic bar chart
Never use a canvas / SVG chart lib. Compose bars from divs with `height: (v/max)*100%` inside a flex-end row. Add gridlines as absolute-positioned dashed lines and a right-side Y-axis label column.

Shape:
```jsx
<div style={{ position: "relative", height: 260 }}>
  {[0,1,2,3,4].map(y => (
    <div style={{ position: "absolute", left: 4, right: 28, bottom: `${y*25}%`, borderTop: y===0 ? "1px solid var(--pp-line)" : "1px dashed rgba(255,255,255,.06)" }} />
  ))}
  <div style={{ position: "absolute", inset: "0 28px 0 4px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: 24 }}>
    {/* bars */}
  </div>
</div>
```

Y-axis labels sit against the right edge. Labels below the baseline go in a sibling flex row so bar heights don't distort label alignment.

## 3. Stacked bar (weekly / cohort)
Each bar is a `flex-direction: column-reverse` container of segments summing to the bar's total; each segment `height: (v/total)*100%` with its own colour. Palette from `design-tokens.md`.

## 4. Data table
Two flavours:

- **Compact grid** — `display: grid` with `gridTemplateColumns` matching the columns. Zero gap; a `borderTop: 1px solid var(--pp-line)` on each row cell. Header row uses uppercase 11–12px with `letter-spacing: .22em`.
- **Horizontal scroll table** — wrap the grid in `overflow-x: auto` with a `minWidth: 720` so it never squishes below readable size.

Highlight rows with `background: rgba(204,255,0,.04)` and `color: var(--pp-acid)`.

## 5. Two-column "before → after"
Use a 3-column grid: `1fr auto 1fr` where the middle column is a 1px vertical rule via `background: var(--pp-line); width: 1px`. Each side pair of cells shares one row.

## 6. Radial pill layout (Phase 1 style)
Absolute positioning inside a bordered container with a big central title. Pills placed at `top:8%/left:6%`, `top:8%/right:6%`, `bottom:8%/left:6%`, `bottom:8%/right:6%`, and one centred (`bottom:8%/left:50%` + `translateX(-50%)`). Keep clear of the central heading — never place pills at `top:50%` when the title is huge.

## 7. Product Design click-through
See `ProductDesignBlock` in primitives. Left column: `<ul>` of buttons; right column: preview panel. Preview shows image (with Lightbox click), Figma proto (Play → fullscreen iframe), or "no mockup" placeholder.

## 8. Video ADs carousel row
`VideoAdsRow` — 3 tiles with frozen preview frames + Play button. Fullscreen modal has one video at a time with `←/→` arrows, dots indicator, header shows `NN · Label`.

## 9. Timeline / ship log
Vertical stack of items with a small date cap, headline, and short bullets. Each item padded and separated by a 1px line. Use `fontVariantNumeric: "tabular-nums"` on the dates.

## 10. Support theme gallery
Header + a grid of screenshot images (all with `data-lightbox-src`). Accent variant uses acid border + gradient background; used for "Positive feedback" style closing.

## Composition rules

- One acid accent per row max — a whole row of accent cards flattens the hierarchy.
- Number of stat blocks per row: 3–5. If you need 6+, split into two rows with a shared theme.
- Never put a full-width image next to a full-width chart — pick one anchor per screen.
- Keep section length under ~4 viewport heights. If more, split into `01 / 02 / 03` sub-slides inside the section (see the OPS · Org Structure 2.0 pattern).
