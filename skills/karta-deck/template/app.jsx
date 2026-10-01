/* App shell — assembles sections, scroll-spy, hash routing */
const { useState: aS, useEffect: aE, useRef: aRf } = React;

/* Scroll progress bar (DOM-driven, no React re-render per frame) */
function Progress() {
  const ref = aRf(null);
  aE(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (ref.current) ref.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} style={{ position: "fixed", top: 0, left: 0, height: 2, width: "0%", background: "var(--pp-acid)", zIndex: 80, transition: "width .1s linear" }} />;
}

function App() {
  const [active, setActive] = aS(SECTIONS[0]?.id || "");

  /* On-mount: scroll to hash target — Babel finishes compiling AFTER
     the browser's native anchor jump, so do it ourselves. */
  aE(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
      else if (tries++ < 20) setTimeout(tick, 80);
    };
    tick();
  }, []);

  /* Scroll-spy (rAF-throttled) */
  aE(() => {
    const ids = SECTIONS.map((s) => s.id);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.scrollY + window.innerHeight * 0.35;
        let cur = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top + window.scrollY <= mid) cur = id;
        }
        setActive(cur);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <React.Fragment>
      <Progress />
      <Header active={active} />
      {SECTIONS.map((s) => {
        const Sec = SECTION_COMPONENTS[s.id];
        return Sec ? (
          <div key={s.id} className="chapter" style={{ position: "relative" }}>
            <Sec />
          </div>
        ) : null;
      })}
      <Lightbox />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
