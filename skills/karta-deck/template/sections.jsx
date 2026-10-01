/* Author your sections here. Register each in the SECTIONS array so the menu,
   scroll-spy, and App loop pick them up. Sections render top-to-bottom in SECTIONS order. */

const { useState: uS, useEffect: uE, useRef: uR } = React;

/* Local JS aliases for the CSS tokens (see references/design-tokens.md) */
const ACID = "var(--pp-acid)";
const FG   = "var(--pp-fg)";
const FG2  = "var(--pp-fg-2)";
const FG3  = "var(--pp-fg-3)";
const FG4  = "var(--pp-fg-4)";
const LINE = "var(--pp-line)";
const FD   = "var(--pp-font-display)";
const FB   = "var(--pp-font-body)";

/* ============================================================
   Section index — everything the menu / scroll-spy / App need
   ============================================================ */
const SECTIONS = [
  { id: "hero",    label: "01 Hero" },
  { id: "context", label: "02 Context" },
  { id: "close",   label: "03 Wrap" },
];

/* ============================================================
   01 · Hero
   ============================================================ */
function DeckHero() {
  return (
    <React.Fragment>
      <SectionHero id="hero" num="01" kicker="deck" align="left" glow
        parts={[{ t: "Your headline " }, { t: "in one acid word.", hi: true }]}
        lead="One-sentence subhead. Numbers first, verbs second, adjectives never." />
      <Section tightTop dataLabel="01 Hero">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(14px, 1.6vw, 22px)" }}>
          <StatBlock label="Metric one" value="$11.85M" sub="Jul · 79% plan" accent big />
          <StatBlock label="MoM growth" value="+7%" sub="ex one-time" />
          <StatBlock label="Users" value="5 941" sub="+6.2%" />
          <StatBlock label="Transactions" value="173K" sub="+8.9%" />
        </div>
      </Section>
    </React.Fragment>
  );
}

/* ============================================================
   02 · Context
   ============================================================ */
function DeckContext() {
  return (
    <React.Fragment>
      <SectionHero id="context" num="02" kicker="context" align="left" glow
        parts={[{ t: "What happened " }, { t: "and why it matters.", hi: true }]}
        lead="A framing sentence for the section body." />
      <Section tightTop dataLabel="02 Context">
        <div className="dd-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)" }}>
          <ColBlock title="What worked" items={[
            "First bullet — <b>key term bolded</b>",
            "Second bullet with a number: <b>+$50K</b>",
            "Third bullet, tighter",
          ]} accent />
          <ColBlock title="What's next" items={[
            "Follow-up plan for August",
            "Owner + date: <b>Aug 15 · em</b>",
          ]} />
        </div>
      </Section>
    </React.Fragment>
  );
}

/* ============================================================
   03 · Close
   ============================================================ */
function DeckClose() {
  return (
    <React.Fragment>
      <SectionHero id="close" num="03" kicker="wrap" align="left" glow
        parts={[{ t: "One-line " }, { t: "closing thought.", hi: true }]}
        lead="Cue the audience for questions." />
      <Section tightTop dataLabel="03 Wrap">
        <div style={{ padding: "clamp(24px, 2.8vw, 40px)", borderRadius: 14, border: `1px solid ${LINE}`, background: "linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.015) 70%)", display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontFamily: FD, fontWeight: 600, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: FG4 }}>Q&amp;A</span>
          <h3 style={{ margin: 0, fontFamily: FD, fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800,'wdth' 125", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-.02em", lineHeight: 1.15, color: FG }}>
            Contact · <span style={{ color: ACID }}>hi@karta.io</span>
          </h3>
        </div>
      </Section>
    </React.Fragment>
  );
}

/* ============================================================
   Map SECTIONS id → component (App reads this)
   ============================================================ */
const SECTION_COMPONENTS = {
  hero: DeckHero,
  context: DeckContext,
  close: DeckClose,
};

/* ============================================================
   Header — fixed top-left menu (very light)
   ============================================================ */
function Header({ active }) {
  return (
    <header style={{ position: "fixed", top: 16, left: 0, right: 0, zIndex: 60, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 10, padding: "6px 8px", borderRadius: 999, border: `1px solid ${LINE}`, background: "rgba(6,6,6,.8)", backdropFilter: "blur(10px)", pointerEvents: "auto" }}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}
            style={{ padding: "8px 14px", borderRadius: 999, fontFamily: FD, fontWeight: 700, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: active === s.id ? "#0a0a0a" : FG3, background: active === s.id ? ACID : "transparent", textDecoration: "none", transition: "color .2s, background .2s" }}>
            {s.label}
          </a>
        ))}
      </div>
    </header>
  );
}
