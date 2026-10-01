/* Karta - Investor Deck · shared components & hooks. Exports to window. */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   HOOKS
   ============================================================ */

/* reveal-on-scroll: returns a ref-callback; toggles `.in` when visible */
function useReveal(opts) {
  const o = opts || {};
  return useCallback((node) => {
    if (!node) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { node.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { node.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: o.threshold || 0.18, rootMargin: o.rootMargin || "0px 0px -8% 0px" });
    io.observe(node);
  }, []);
}

/* Reveal wrapper element. variant: up|left|right|scale; stagger children via CSS var delay */
function Reveal({ children, variant = "up", delay = 0, className = "", style, as = "div", ...rest }) {
  const ref = useReveal();
  const cls = { up: "reveal", left: "reveal-l", right: "reveal-r", scale: "reveal-scale" }[variant] || "reveal";
  const Tag = as;
  return (
    <Tag ref={ref} className={`${cls} ${className}`} style={{ transitionDelay: `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* count-up number when scrolled into view. format(n) -> string */
function CountUp({ to, dur = 1500, format, className, style }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    let raf, start;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const tick = (t) => {
          if (!start) start = t;
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, dur]);
  return <span ref={ref} className={className} style={style}>{format ? format(val) : Math.round(val)}</span>;
}

/* ============================================================
   PRIMITIVES
   ============================================================ */

function Label({ children, variant }) {
  const dim = variant === "light" ? "#919191" : "var(--pp-fg-4)";
  const mid = variant === "acid" ? "var(--pp-acid)" : (variant === "light" ? "#f1f1f1" : "var(--pp-fg-2)");
  return (
    <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 15, lineHeight: 1.5, letterSpacing: ".02em", display: "inline-flex", gap: "0.4em" }}>
      <span style={{ color: dim }}>[</span>
      <span style={{ color: mid }}>{children}</span>
      <span style={{ color: dim }}>]</span>
    </span>
  );
}

function ArrowIcon({ color = "#030303", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

function Button({ children, variant = "primary", onClick, href, arrow = true, target, rel }) {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 16, lineHeight: 1,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "14px 24px", borderRadius: "var(--pp-r-pill)", cursor: "pointer",
    transition: "background .3s var(--pp-ease), color .3s var(--pp-ease), border-color .3s var(--pp-ease), transform .15s var(--pp-ease)",
    textDecoration: "none", transform: hover ? "translateY(-1px)" : "none",
  };
  const skin = variant === "primary"
    ? { background: hover ? "#a6cc00" : "var(--pp-acid)", color: "#030303", border: "1px solid transparent" }
    : { background: hover ? "var(--pp-surface-2)" : "transparent", color: "var(--pp-fg)", border: `1px solid ${hover ? "#3a3a3a" : "#2a2a2a"}` };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} target={target} rel={rel} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...skin }}>
      {children}
      {arrow && variant === "primary" && <ArrowIcon />}
    </Tag>
  );
}

/* DS "Pill Button" - softly-raised gradient pill + leading disc/glyph.
   accent = lime gradient (dark disc, lime glyph) · default = charcoal gradient (white disc, dark glyph) */
const PILL_GLYPHS = {
  arrow: <path d="M8 12h7.4M12 8l4 4-4 4" />,
  trend: <React.Fragment><path d="M7.4 14.8l3-3.4 2.4 2L16.6 8.8" /><path d="M13.7 8.8h3v3" /></React.Fragment>,
  check: <path d="M7.5 12.4l3 3 6-6.4" />,
  info: <React.Fragment><path d="M12 10.6v5.2" /><path d="M12 8.2v.01" /></React.Fragment>,
  alert: <React.Fragment><path d="M12 7.4v5" /><path d="M12 15.8v.01" /></React.Fragment>,
};
function PillButton({ children, glyph = "arrow", variant = "default", size = "md", onClick, href, type }) {
  const accent = variant === "accent";
  const S = { sm: { padV: 8, padL: 9, padR: 16, gap: 8, fs: 15, ic: 18 },
              md: { padV: 13, padL: 14, padR: 24, gap: 11, fs: 19, ic: 24 },
              lg: { padV: 17, padL: 18, padR: 30, gap: 13, fs: 23, ic: 30 } }[size];
  const Tag = href ? "a" : "button";
  const discFill = accent ? "#0a0a0a" : "#fafafa";
  const glyphStroke = accent ? "var(--pp-acid)" : "#1a1a1a";
  return (
    <Tag href={href} onClick={onClick} type={href ? undefined : type} className="pp-pill-btn-dyn" draggable={false} onDragStart={(e) => e.preventDefault()}
      style={{
        display: "inline-flex", alignItems: "center", gap: S.gap,
        padding: `${S.padV}px ${S.padR}px ${S.padV}px ${S.padL}px`,
        border: "1px solid rgba(255,255,255,.07)",
        borderTopColor: accent ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.16)",
        borderRadius: "var(--pp-r-pill, 100px)",
        background: accent
          ? "linear-gradient(180deg, var(--pp-acid) 0%, #bce000 100%)"
          : "linear-gradient(180deg, rgba(52,52,52,.5) 0%, rgba(38,38,38,.5) 100%)",
        color: accent ? "#030303" : "var(--pp-fg)",
        fontFamily: "var(--pp-font-body)", fontWeight: 500, fontSize: S.fs, lineHeight: 1, letterSpacing: "-.01em",
        textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap",
        boxShadow: "0 1px 0 rgba(255,255,255,.05) inset, 0 2px 6px rgba(0,0,0,.35)",
        transition: "filter .3s var(--pp-ease, cubic-bezier(.44,0,.16,1)), transform .12s var(--pp-ease, cubic-bezier(.44,0,.16,1))",
      }}>
      <svg width={S.ic} height={S.ic} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill={discFill} />
        <g stroke={glyphStroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          {PILL_GLYPHS[glyph]}
        </g>
      </svg>
      <span>{children}</span>
    </Tag>
  );
}

/* hairline card */
function HCard({ children, style, hover, className }) {
  const [h, setH] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: "var(--pp-card)", border: "1px solid var(--pp-line)", borderRadius: 12,
        padding: 28, display: "flex", flexDirection: "column",
        transition: "border-color .4s, transform .4s, background .4s",
        borderColor: h ? "rgba(204,255,0,.4)" : "var(--pp-line)",
        transform: h ? "translateY(-3px)" : "none",
        ...style,
      }}>
      {children}
    </div>
  );
}

/* section shell - centered 1040 column, big rhythm */
function Section({ id, children, label, intro, dataLabel, tightTop, style }) {
  const pad = tightTop ? "56px 24px 120px" : "120px 24px";
  return (
    <section id={id} data-screen-label={dataLabel || id} style={{ position: "relative", zIndex: 1, background: "var(--pp-page)", padding: pad, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      <div style={{ width: "100%", maxWidth: 1440, display: "flex", flexDirection: "column", gap: 64 }}>
        {(label || intro) && (
          <Reveal style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 0 150px", paddingTop: 10 }}><Label>{label}</Label></div>
            {intro && <h2 className="pp-lead" style={{ flex: "3 1 480px", margin: 0 }}>{intro}</h2>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* per-word stagger title - parts: [{t, hi}] ; staggers each word up on scroll-in */
function StaggerTitle({ parts, className = "", style, base = 0.05, step = 0.04 }) {
  const ref = useReveal({ threshold: 0.3 });
  let i = -1;
  return (
    <h2 ref={ref} className={`pp-stitle ${className}`} style={{ margin: 0, ...style }}>
      {parts.map((p, pi) => {
        if (p.br) return <br key={pi + "-br"} />;
        return p.t.split(" ").filter(Boolean).map((w, wi) => {
          i += 1;
          return (
            <span key={pi + "-" + wi} className="w" style={{ animationDelay: (base + i * step) + "s", color: p.hi ? "var(--pp-acid)" : undefined, whiteSpace: "pre" }}>
              {w}{"\u00A0"}
            </span>
          );
        });
      })}
    </h2>
  );
}

/* sticky chapter-break recede: the divider pins, then scales + fades as the
   section content scrolls up over it (the section "transition"). */
function useSectionRecede(cardRef, secRef, numRef) {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    /* Progress is read LIVE from the sticky container (the .chapter wrapper),
       not a cached startY - so it stays correct even when content above shifts
       the divider down after mount (lazy images, video, fonts). The divider sits
       at the top of its chapter, so once the chapter's top scrolls past the
       viewport top, -top == pixels receded. */
    const container = () => (secRef.current ? secRef.current.closest(".chapter") || secRef.current.parentElement : null);
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const c = container();
        if (!cardRef.current || reduce || !c) return;
        const vh = window.innerHeight;
        const top = c.getBoundingClientRect().top;
        const p = Math.min(Math.max(-top / (vh * 0.55), 0), 1);
        cardRef.current.style.transform = `scale(${1 - p * 0.12}) translateY(${p * -4}%)`;
        cardRef.current.style.opacity = String(1 - p * 0.55);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); window.removeEventListener("load", onScroll); cancelAnimationFrame(raf); };
  }, []);
}

/* SECTION DIVIDER - every numbered section opens with a full-screen chapter
   break: acid bottom-glow + [ NN ] + the section NAME, which pins and recedes
   as the section's thesis scrolls up over it. The descriptive headline + lead
   follow below in normal flow. */
function SectionHero({ id, num, kicker, kickerNode, parts, lead, leadStyle, align = "center", glow = false, media = null, mediaNode = null, titleMax = 1000 }) {
  const cardRef = useRef(null), secRef = useRef(null), numRef = useRef(null);
  const ghostRef = useReveal({ threshold: 0.2 });
  useSectionRecede(cardRef, secRef, numRef);
  return (
    <React.Fragment>
      <section id={id} data-screen-label={`${num} ${kicker}`} ref={secRef} style={{
        position: "sticky", top: 0, zIndex: 0, height: "88vh", minHeight: 640, overflow: "hidden",
        background: "var(--pp-page)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div ref={cardRef} style={{
          position: "absolute", inset: 0, overflow: "hidden",
          background: "radial-gradient(125% 95% at 50% 118%, rgba(204,255,0,.6), rgba(204,255,0,.28) 40%, rgba(204,255,0,.07) 64%, transparent 82%), var(--pp-page)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transformOrigin: "50% 0%", willChange: "transform, opacity",
        }}>
          <div ref={numRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", willChange: "transform" }}>
            <span ref={ghostRef} aria-hidden="true" className="pp-ghostnum sec-num"
              style={{ top: "7%", right: "3%", left: "auto", WebkitTextStroke: "1.5px #262626", fontSize: "clamp(190px,27vw,360px)" }}>{num}</span>
          </div>
          {kickerNode ? (
            <h2 className="pp-h1 pp-stitle in" style={{ margin: 0, position: "relative", zIndex: 1, fontSize: "clamp(48px,8vw,112px)", lineHeight: 1.0, letterSpacing: "-.035em", textTransform: "capitalize", maxWidth: 1440, textAlign: "center", padding: "0 24px", color: "var(--pp-fg)" }}>{kickerNode}</h2>
          ) : (
            <StaggerTitle parts={[{ t: kicker }]} base={0.12} step={0.05} className="pp-h1"
              style={{ position: "relative", zIndex: 1, fontSize: "clamp(48px,8vw,112px)", lineHeight: 1.0, letterSpacing: "-.035em", textTransform: "capitalize", maxWidth: 1440, textAlign: "center", padding: "0 24px" }} />
          )}
        </div>
      </section>
      <section style={{ position: "relative", zIndex: 1, background: "var(--pp-page)", padding: "104px 24px 0", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 1440, display: "flex", flexDirection: "column", gap: 22, alignItems: align === "center" ? "center" : "flex-start", textAlign: align === "center" ? "center" : "left" }}>
          {media && (
            <img src={media} alt="" aria-hidden="true" className="hero-media" style={{
              position: "absolute", top: -64, right: 0, width: "clamp(320px, 33vw, 500px)",
              objectFit: "contain", objectPosition: "top right", pointerEvents: "none", zIndex: 0,
            }} />
          )}
          {mediaNode && (
            <div className="hero-media" aria-hidden="true" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", width: "clamp(260px, 30vw, 460px)", pointerEvents: "none", zIndex: 0 }}>{mediaNode}</div>
          )}
          <Reveal variant="up">
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: ".55em", fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 14, letterSpacing: ".04em", textTransform: "capitalize", color: "var(--pp-fg-3)" }}>
              <span style={{ color: "var(--pp-acid)", letterSpacing: 0 }}>[ {num} ]</span>{kicker}
            </span>
          </Reveal>
          <StaggerTitle parts={parts} className="pp-h1" style={{ fontSize: "clamp(34px,4.6vw,60px)", lineHeight: 1.05, maxWidth: titleMax }} />
          {lead && (
            <Reveal variant="up" delay={0.12}>
              <p className="pp-lead" style={{ margin: 0, maxWidth: 760, fontSize: "clamp(19px,2vw,26px)", color: "var(--pp-fg-2)", ...leadStyle }}>{lead}</p>
            </Reveal>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

/* big statement headline block (left rail label + huge headline) */
function Statement({ label, children, sub, align = "left", max = 920 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: align === "center" ? "center" : "flex-start", textAlign: align }}>
      {label && <Reveal><Label variant="acid">{label}</Label></Reveal>}
      <Reveal delay={0.05}>
        <h2 className="pp-h1" style={{ margin: 0, maxWidth: max, textAlign: align }}>{children}</h2>
      </Reveal>
      {sub && <Reveal delay={0.1}><p className="pp-body" style={{ margin: 0, maxWidth: 640, fontSize: 18, textAlign: align }}>{sub}</p></Reveal>}
    </div>
  );
}

/* acid highlight inline */
function Hi({ children }) { return <span style={{ color: "var(--pp-acid)" }}>{children}</span>; }

/* animated horizontal bar - fills to pct% when scrolled into view */
function Bar({ pct, color = "var(--pp-acid)", opacity = 1, height = 8, dur = 1.1, delay = 0 }) {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ height, background: "#141414", borderRadius: 100, overflow: "hidden" }}>
      <div style={{ width: (on ? Math.min(pct, 100) : 0) + "%", height: "100%", background: color, borderRadius: 100, opacity, transition: `width ${dur}s cubic-bezier(.44,0,.16,1) ${delay}s` }} />
    </div>
  );
}

/* ============================================================
   HAND-PHONE SCREEN SWITCHER
   Real photo of a hand holding a phone with the screen cut to
   transparency (the FRAME), with app screens stacked underneath.
   All layers share ONE canvas (987×1203), so they're placed at
   inset:0 full-size - switching = cross-fade the active screen.
   To add a screen: drop a 987×1203 PNG with the screen content
   in place (rest transparent) and add it to `screens`.
   ============================================================ */
const HAND_FRAME = "assets/hand-frame-real.webp";
const HAND_RATIO = "987 / 1203";
/* The screen cut-out within the 987×1203 frame, as a clip-path. Everything
   in the screen layer is masked to exactly this rounded rectangle, so sliding
   carousel images can NEVER appear outside the phone's glass. */
const HAND_SCREEN_CLIP = "inset(5.32% 48.33% 22.44% 11.14% round 5.98% / 4.9%)";
/* Hand-phone screen layer. Pass an array of 987×1203 screen PNGs.
   1 screen → static. >1 → auto-swipe carousel that slides left every
   `interval` ms and loops. The frame is a PERMANENT node - it never
   remounts or re-fades when the screen set changes; only the screen
   inside swaps (and fades/slides in). */
function HandScreen({ screens = [], vh = 78, frame = HAND_FRAME, interval = 4000 }) {
  const n = Math.max(1, screens.length);
  const sig = screens.join("|");
  const [i, setI] = React.useState(0);     // ever-increasing within a set; current = i % n

  // reset the carousel whenever the screen SET changes (capability switch)
  React.useEffect(() => { setI(0); }, [sig]);

  // auto-advance (only for multi-screen sets)
  React.useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((p) => p + 1), interval);
    return () => clearInterval(t);
  }, [sig, n, interval]);

  const boxStyle = { height: `${vh}vh`, maxWidth: "100%", aspectRatio: HAND_RATIO, position: "relative", margin: "0 auto" };
  // the screen layer is clipped to the glass rect - nothing escapes the phone
  const clipStyle = { position: "absolute", inset: 0, clipPath: HAND_SCREEN_CLIP, WebkitClipPath: HAND_SCREEN_CLIP };
  const imgStyle = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none", userSelect: "none" };

  const cur = ((i % n) + n) % n;
  const prev = ((i - 1) % n + n) % n;
  const sliding = i > 0;   // true only on an autoplay advance within the same set

  return (
    <div style={boxStyle}>
      {/* segmented progress - one bar per screen; the active one fills over `interval` */}
      {n > 1 && (
        <div style={{ position: "absolute", left: "17.22%", width: "28.37%", top: "calc(4.24% - 26px)", display: "flex", gap: 7, zIndex: 5 }}>
          {screens.map((_, b) => (
            <div key={b} style={{ flex: 1, height: 5, borderRadius: 4, background: "rgba(255,255,255,.22)", overflow: "hidden" }}>
              <div
                key={b === cur ? "run-" + i : "static"}
                className={b === cur ? "hand-bar-run" : undefined}
                style={{ height: "100%", background: "var(--pp-acid)", borderRadius: 4, transformOrigin: "left",
                  boxShadow: b <= cur ? "0 0 10px rgba(204,255,0,.5)" : "none",
                  transform: b < cur ? "scaleX(1)" : (b === cur ? undefined : "scaleX(0)"),
                  animationDuration: b === cur ? interval + "ms" : undefined }} />
            </div>
          ))}
        </div>
      )}
      <div style={clipStyle}>
        {/* on an autoplay advance the previous screen stays beneath while the new one slides over it */}
        {sliding && <img key={"under-" + sig + "-" + i} src={screens[prev]} alt="" style={{ ...imgStyle, zIndex: 1 }} />}
        <img key={"over-" + sig + "-" + cur} src={screens[cur]} alt=""
          className={sliding ? "hand-slide-in" : "hand-screen-fade"}
          style={{ ...imgStyle, zIndex: 2 }} />
      </div>
      {/* PERMANENT frame - stable element, never remounts on set change */}
      <img src={frame} alt="Karta app in hand" style={{ ...imgStyle, zIndex: 3 }} />
    </div>
  );
}

/* iPhone mockup - titanium frame + dynamic island; screen content via children. Sized by height (vh). */
function PhoneMockup({ children, vh = 70 }) {
  return (
    <div style={{ height: `${vh}vh`, maxWidth: "100%", aspectRatio: "1 / 2.03", margin: "0 auto", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "13.5% / 6.6%", background: "linear-gradient(150deg,#3a3a3a,#0b0b0b 58%)", padding: "3%", boxShadow: "0 34px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.07)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "11.5% / 5.7%", overflow: "hidden", background: "#050505", border: "1px solid #1c1c1c" }}>
          {children}
          <div style={{ position: "absolute", top: "2.6%", left: "50%", transform: "translateX(-50%)", width: "34%", height: "3.6%", background: "#000", borderRadius: 100, zIndex: 4, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.05)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SOCIAL TILES
   ============================================================ */
const socials = {
  in: "M5.5 7.5H7.3V13H5.5V7.5ZM6.4 4.8a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1ZM8.5 7.5h1.7v.8c.3-.5.9-.9 1.7-.9 1.5 0 2.1 1 2.1 2.6V13h-1.8v-2.5c0-.7-.2-1.2-.9-1.2-.6 0-.9.4-.9 1.1V13H8.5V7.5Z",
  x: "M11.6 4.5h1.7l-3.7 4.3 4.4 5.7h-3.4L8.3 11l-2.9 3.5H3.6l4-4.7L3.4 4.5h3.5L9.3 7.7 11.6 4.5Zm-.6 8.9h.9L7 5.5h-1L11 13.4Z",
  tg: "M14.5 4.3 3.6 8.5c-.6.24-.6.9-.04 1.07l2.7.84 1.05 3.3c.13.36.5.45.78.21l1.5-1.22 2.86 2.1c.36.26.86.06.94-.38l1.86-9.2c.1-.5-.38-.9-.85-.72Z",
  ig: "M6 3.5h6c1.4 0 2.5 1.1 2.5 2.5v6c0 1.4-1.1 2.5-2.5 2.5H6A2.5 2.5 0 0 1 3.5 12V6A2.5 2.5 0 0 1 6 3.5Zm0 1A1.5 1.5 0 0 0 4.5 6v6A1.5 1.5 0 0 0 6 13.5h6a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 12 4.5H6Zm3 2A2.5 2.5 0 1 1 9 11.5 2.5 2.5 0 0 1 9 6.5Zm0 1A1.5 1.5 0 1 0 9 10.5 1.5 1.5 0 0 0 9 7.5Zm3.2-1.7a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2Z",
};
const socialUrls = {
  in: "https://www.linkedin.com/company/joinkarta/",
  x:  "https://x.com/Karta_Personal",
  tg: "https://t.me/karta",
  tg_news: "https://t.me/karta_news",
  ig: "https://www.instagram.com/karta.personal",
};
function Social({ k }) {
  const [h, setH] = useState(false);
  const url = socialUrls[k] || "#";
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      aria-label={k === "in" ? "LinkedIn" : k === "x" ? "X / Twitter" : k === "tg" ? "Telegram" : k === "ig" ? "Instagram" : "Social"}
      style={{ width: 40, height: 40, borderRadius: 12, background: h ? "#3a3a3a" : "var(--pp-control)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff"><path d={socials[k]} /></svg>
    </a>
  );
}

/* ============================================================
   STAGGER (hero per-character rise)
   ============================================================ */
function Stagger({ text, style, base = 0.15, step = 0.03 }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <span style={style}>
      {words.map((w, wi) => (
        <span key={wi} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
          {w.split("").map((c) => {
            const idx = i++;
            return <span key={idx} className="pp-rise" style={{ animationDelay: `${base + idx * step}s` }}>{c}</span>;
          })}
          {wi < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

Object.assign(window, {
  useReveal, Reveal, CountUp, Label, ArrowIcon, Button, PillButton, HCard,
  Section, SectionHero, StaggerTitle, Statement, Hi, Bar, PhoneMockup, HandScreen, Social, Stagger,
  socials, socialUrls,
});
