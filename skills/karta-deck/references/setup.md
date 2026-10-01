# Setup

## Minimum runnable deck

Four files from `template/`:

```
your-deck/
  index.html
  colors_and_type.css
  components.jsx
  app.jsx
  sections.jsx        # your content — edit this
  assets/             # your images, videos, fonts
```

`index.html` pulls React 18 + Babel-standalone from CDN and loads the JSX files with `type="text/babel"`.

## The cache-busting `?v=NN` pattern

Every JSX/CSS `src`/`href` in `index.html` has a `?v=NN` suffix. Bump `NN` on every change:

```bash
sed -i '' 's/?v=NN"/?v=NN+1"/g' index.html
```

Without this, Babel serves the previous compiled version from the browser cache and your edits appear "silently ignored".

## Hash scrolling

Babel compiles JSX at load time — after the browser has already tried to jump to `#foo`. Add this useEffect at the top of `App()` in `app.jsx` (already present in the template) so deep links work:

```js
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
```

## Registering sections

In `sections.jsx`:

```js
const SECTIONS = [
  { id: "hero",     label: "01 Hero" },
  { id: "context",  label: "02 Context" },
  { id: "product",  label: "03 Product" },
  ...
];
```

The scroll-spy in `<App/>` and the fixed menu both read this array. Every section's `id` prop must match an entry.

## Running the preview

```bash
cd your-deck
python3 -m http.server 8942
open http://localhost:8942
```

Note: Python's `http.server` returns `200` to Range requests instead of `206` — video seeking snaps back to `0`. Preview-frame capture in `VideoAdsRow` includes a `play()`→`pause()` fallback that works anyway. Production hosts (GitHub Pages, Cloudflare, Vercel) support Range correctly.

## Deploying to GitHub Pages

```bash
git init -b main
git add . && git -c user.email="you@x.com" -c user.name="you" commit -m "Initial deck"
gh repo create your-org/your-deck --public --source=. --push
gh api -X POST "repos/your-org/your-deck/pages" --input - <<'JSON'
{"source":{"branch":"main","path":"/"}}
JSON
```

Live URL: `https://your-org.github.io/your-deck/`. First build takes ~1–2 min.

For custom domain, add a `CNAME` file in the repo root with the domain, and point DNS to `<user>.github.io`.

## Adding videos

Formats: `.mp4` (H.264) works everywhere. `.mov` works on Safari; convert to `.mp4` for Chrome/Firefox.

```bash
ffmpeg -i in.mov -c:v libx264 -preset slow -crf 22 -c:a aac -movflags +faststart out.mp4
```

`+faststart` moves the moov atom to the front — required for streaming/seeking to work over HTTP.

Keep video files under 25MB where possible; GitHub Pages has a 100MB per-file limit but slow first-load hurts the demo experience.

## Font hosting

Archivo lives in `assets/fonts/archivo.woff2` — a single variable file (~120KB) covering weight 100–900 and stretch 62–125. `colors_and_type.css` includes the `@font-face` declaration. Do not swap for the split-weight versions from Google Fonts — you lose variable axes.

## Common failure modes

- **Blank page + "Unexpected token" in console** — Babel choked on a syntax error in the JSX. Read the console line number; JSX errors in one file don't compile any file after it in `index.html` script order.
- **Old code keeps rendering** — forgot to bump `?v=NN`. Do it and hard-reload.
- **Section jumps but ends on wrong slide** — the sticky-recede offset needs the `<SectionHero>` immediately followed by `<Section tightTop>`. If you put something between them, add manual top padding.
- **Images 404 on GitHub Pages but work locally** — GitHub Pages is case-sensitive; macOS filesystem isn't. Rename to lowercase and remove spaces (`Referral Code.png` → `referral-code.png`).
- **Videos load but don't seek** — the host doesn't serve Range requests. Either move to a host that does (GH Pages, Cloudflare, S3) or accept the frozen-frame fallback.
