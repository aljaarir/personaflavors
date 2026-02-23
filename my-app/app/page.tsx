"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RadarProps {
  /** 6 values 0–100: [humor, dark, romantic, serious, anger, extra] */
  values: number[];
  color: string;
  size?: number;
}

// ─── SVG Radar ───────────────────────────────────────────────────────────────
function Radar({ values, color, size = 120 }: RadarProps) {
  const cx = size / 2, cy = size / 2, r = size * 0.42;
  const n = values.length;

  const pt = (v: number, i: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (v / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)] as [number, number];
  };

  const axisEnd = (i: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const poly = values.map((v, i) => pt(v, i).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((scale) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          return [cx + r * scale * Math.cos(a), cy + r * scale * Math.sin(a)].join(",");
        }).join(" ");
        return (
          <polygon key={scale} points={pts} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
        );
      })}
      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const [ex, ey] = axisEnd(i);
        return (
          <line key={i} x1={cx} y1={cy} x2={ex} y2={ey}
            stroke="rgba(255,255,255,0.07)" strokeWidth={0.8} />
        );
      })}
      {/* Data polygon */}
      <polygon points={poly} fill={color + "28"} stroke={color}
        strokeWidth={1.5} strokeLinejoin="round" />
      {/* Vertex dots */}
      {values.map((v, i) => {
        const [px, py] = pt(v, i);
        return <circle key={i} cx={px} cy={py} r={2} fill={color} />;
      })}
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Emotion axes: Humor · Dark/Sad · Romantic · Serious · Anger · Whimsy
const TICKER_ITEMS = [
  "Letterboxd", "Backloggd", "ScoraSong",
  "Personality decoded", "Taste is data", "6 dimensions",
  "Humor · Dark · Romantic · Serious · Anger · Whimsy",
  "Find your flavor", "Cross-platform analysis",
];

const DIMENSIONS = [
  { emoji: "😂", name: "Humor",    desc: "Absurdity, levity, satire — how much comedy shapes your lens", color: "var(--humor)" },
  { emoji: "🌑", name: "Dark",     desc: "Melancholy, tragedy, existential depth in what you consume",  color: "var(--dark)"    },
  { emoji: "🌹", name: "Romantic", desc: "Love, longing, intimacy — the emotional pulls you return to",  color: "var(--romantic)"},
  { emoji: "🗿", name: "Serious",  desc: "Realism, nuance, weight — preference for grounded narratives", color: "var(--serious)" },
  { emoji: "🔥", name: "Anger",    desc: "Passion, conflict, intensity — high-stakes tension and fury",  color: "var(--anger)"   },
];

const GROUPS = [
  { glyph: "◈", name: "The Archivist",     color: "#c8a96e", desc: "Meticulous loggers who find beauty in cataloguing the obscure.", tags: ["Dark", "Serious", "Whimsy"] },
  { glyph: "◉", name: "Chaotic Optimist",  color: "#7bc4a0", desc: "High-humor, high-anger: chaotic but warmhearted in taste.",     tags: ["Humor", "Anger", "Romantic"] },
  { glyph: "◍", name: "The Slow Burn",     color: "#9b8de8", desc: "Savors long arcs, bittersweet endings, and quiet heartbreak.",   tags: ["Dark", "Romantic", "Serious"] },
  { glyph: "◎", name: "The Ambiguist",     color: "#e87b8d", desc: "Drawn to open endings, contradictions, and moral grey zones.",   tags: ["Serious", "Dark", "Anger"] },
  { glyph: "◐", name: "Parallel Thinker", color: "#6bb4d4", desc: "Jumps genre, medium, mood — eclectic and impossible to predict.",  tags: ["Humor", "Whimsy", "Dark"] },
  { glyph: "◑", name: "The Completionist",color: "#e8a96e", desc: "Finishes everything, rates everything, believes every story matters.", tags: ["Serious", "Humor", "Whimsy"] },
];

const REVIEWS = [
  {
    user: "nocturnalreader", av: "NR", avColor: "#c8a96e",
    body: "Called me a 'melancholic romantic with hyper-analytical tendencies.' Somehow the most accurate personality read I've ever gotten — and I've done every Myers-Briggs variant.",
    group: "The Slow Burn", sources: ["Letterboxd"],
    radar: [30, 82, 75, 78, 20, 50], radarColor: "#9b8de8",
  },
  {
    user: "synthwave_dan", av: "SD", avColor: "#7bc4a0",
    body: "I got 'Chaotic Optimist' and my entire Backloggd history of abandoned games makes total sense now. It saw right through me.",
    group: "Chaotic Optimist", sources: ["Backloggd", "ScoraSong"],
    radar: [85, 30, 55, 25, 80, 60], radarColor: "#7bc4a0",
  },
  {
    user: "quietpages", av: "QP", avColor: "#6bb4d4",
    body: "The radar showing my Serious vs Humor breakdown was humbling. I consume a lot but digest slowly. Very true, unfortunately.",
    group: "The Archivist", sources: ["Letterboxd", "ScoraSong"],
    radar: [28, 55, 40, 88, 35, 70], radarColor: "#c8a96e",
  },
  {
    user: "filmcritic_99", av: "FC", avColor: "#e87b8d",
    body: "It connected my love of slow cinema with my 5-star Radiohead bias and said I have 'a high tolerance for ambiguity.' No notes.",
    group: "The Ambiguist", sources: ["Letterboxd", "ScoraSong"],
    radar: [22, 88, 45, 80, 55, 35], radarColor: "#e87b8d",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveReview((p) => (p + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Double ticker items so seamless loop works
  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-logo">
          Persona<em>Flavor</em>
        </div>
        <div className="nav-links">
          <a className="nav-link" href="#how">How It Works</a>
          <a className="nav-link" href="#groups">Groups</a>
          <a className="nav-link" href="#reviews">Reviews</a>
        </div>
        <Link href="/username-input" className="nav-cta">
          Get Your Profile
        </Link>
      </nav>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {tickerAll.map((item, i) => (
            <span className="ticker-item" key={i}>
              {item.includes("·") ? <b>{item}</b> : item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="hero">
        {/* Ambient lighting */}
        <div className="hero-ambient">
          <div className="hero-orb a" />
          <div className="hero-orb b" />
        </div>
        {/* Grid lines */}
        <div className="hero-grid-lines" />

        {/* Left copy */}
        <div className="hero-left">
          <div className="hero-eyebrow eyebrow">
            <span className="eyebrow-line" />
            Your taste, decoded
          </div>
          <h1 className="hero-headline">
            What your <em>ratings</em> reveal
            <br />about who you are
          </h1>
          <p className="hero-sub">
            Connect Letterboxd, Backloggd, and ScoraSong.
            PersonaFlavor cross-references everything you've consumed to
            generate a personality profile — visualized as a unique emotional
            radar chart.
          </p>
          <div className="hero-actions">
            <Link href="/username-input" className="btn-primary">
                Start Assessment →
            </Link>
          </div>
          <div className="hero-platforms">
            <span className="hero-platforms-label">Connects with</span>
            {["Letterboxd", "Backloggd", "ScoraSong"].map((p) => (
              <span key={p} className="platform-pill">{p}</span>
            ))}
          </div>
        </div>

        {/* Right — floating radar cards */}
        <div className="hero-right">
          <div className="radar-showcase">
            <div className="radar-showcase-halo" />
            <div className="rcard r-main">
              <span className="rcard-label">@darkfilmlover</span>
              <span className="rcard-group">The Ambiguist</span>
              <Radar values={[22, 88, 45, 80, 55, 35]} color="#e87b8d" size={160} />
            </div>
            <div className="rcard r-tr">
              <span className="rcard-label">@bookworm92</span>
              <span className="rcard-group">Slow Burn</span>
              <Radar values={[28, 70, 80, 85, 18, 55]} color="#9b8de8" size={100} />
            </div>
            <div className="rcard r-bl">
              <span className="rcard-label">@pixelchaser</span>
              <span className="rcard-group">Chaotic</span>
              <Radar values={[90, 25, 50, 20, 85, 65]} color="#7bc4a0" size={90} />
            </div>
            <div className="rcard r-tl">
              <span className="rcard-label">@lofi_dan</span>
              <span className="rcard-group">Parallel</span>
              <Radar values={[50, 60, 60, 60, 40, 55]} color="#c8a96e" size={80} />
            </div>
          </div>
        </div>
      </section>

      {/* ── EMOTION DIMENSIONS STRIP ─────────────────────────────────── */}
      <div className="dim-strip">
        {DIMENSIONS.map((d) => (
          <div
            className="dim-item"
            key={d.name}
            style={{ "--d-color": d.color } as React.CSSProperties}
          >
            <span className="dim-emoji">{d.emoji}</span>
            <div className="dim-name" style={{ color: d.color }}>{d.name}</div>
            <div className="dim-desc">{d.desc}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="how-section" id="how">
        <div className="how-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>
              <span className="eyebrow-line" />Process
            </div>
            <h2 className="section-title">
              How the flavoring <em>works</em>
            </h2>
          </div>
          <p className="how-intro">
            We don't ask you personality questions. We read your history — the
            genres you gravitate toward, the ratings you give, the moods you
            return to — and build a cross-platform picture of your inner world.
          </p>
        </div>
        <div className="how-steps">
          {[
            { n: "01", icon: "🔗", title: "Enter Usernames", desc: "Paste your handles for any combination of the three platforms. No passwords, no OAuth — just names." },
            { n: "02", icon: "🧮", title: "We Parse Patterns", desc: "Ratings, dates, genres, completion — we extract emotional signals from your full history." },
            { n: "03", icon: "🕸", title: "Cross-Platform Map", desc: "The threads between your film and music taste say more than either alone. We find those threads." },
            { n: "04", icon: "◈", title: "Your Flavor Profile", desc: "A Flavor Group, a radar chart, and a written assessment — a profile that actually sounds like you." },
          ].map((s) => (
            <div className="how-step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <span className="step-icon">{s.icon}</span>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
              <div className="step-connector">›</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GROUPS ───────────────────────────────────────────────────── */}
      <section className="groups-section" id="groups">
        <div className="groups-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>
              <span className="eyebrow-line" />Taxonomy
            </div>
            <h2 className="section-title">
              The Flavor <em>Groups</em>
            </h2>
          </div>
          <div className="groups-big-num">06</div>
        </div>
        <div className="groups-grid">
          {GROUPS.map((g) => (
            <div
              className="group-card"
              key={g.name}
              style={{ "--g-color": g.color } as React.CSSProperties}
            >
              <div className="group-glyph" style={{ color: g.color }}>{g.glyph}</div>
              <div className="group-name">{g.name}</div>
              <div className="group-summary">{g.desc}</div>
              <div className="group-tags">
                {g.tags.map((t) => (
                  <span className="group-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RADAR EXPLAINER ──────────────────────────────────────────── */}
      <section className="radar-explainer">
        <div className="radar-explainer-visual">
          <div className="radar-explainer-halo" />
          {/* Axis labels */}
          <div className="radar-axis-labels">
            <span className="rlabel top"   style={{ color: "var(--humor)" }}>   <span className="rlabel-dot" style={{ background: "var(--humor)" }} />Humor</span>
            <span className="rlabel tr"    style={{ color: "var(--dark)" }}>    <span className="rlabel-dot" style={{ background: "var(--dark)" }} />Dark</span>
            <span className="rlabel br"    style={{ color: "var(--romantic)" }}><span className="rlabel-dot" style={{ background: "var(--romantic)" }} />Romantic</span>
            <span className="rlabel bottom"style={{ color: "var(--serious)" }}> <span className="rlabel-dot" style={{ background: "var(--serious)" }} />Serious</span>
            <span className="rlabel bl"    style={{ color: "var(--anger)" }}>   <span className="rlabel-dot" style={{ background: "var(--anger)" }} />Anger</span>
            <span className="rlabel tl"    style={{ color: "var(--text-3)" }}>  <span className="rlabel-dot" style={{ background: "var(--text-3)" }} />Whimsy</span>
          </div>
          <Radar values={[68, 72, 55, 82, 38, 60]} color="#c8a96e" size={240} />
        </div>

        <div className="radar-explainer-text">
          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            <span className="eyebrow-line" />The Chart
          </div>
          <h2 className="section-title">
            Your emotional <em>fingerprint</em>
          </h2>
          <p>
            Every person who rates things leaves emotional residue. A pattern in
            what they love, what they abandon, and what they keep returning to.
          </p>
          <p>
            We map that pattern across six axes — Humor, Dark, Romantic, Serious,
            Anger, and Whimsy — pulled from the actual content of everything
            you've consumed and rated.
          </p>
          <p>
            No two polygons look the same. That's the point.
          </p>
          <div className="radar-legend">
            {[
              { label: "Humor",    color: "var(--humor)" },
              { label: "Dark",     color: "var(--dark)" },
              { label: "Romantic", color: "var(--romantic)" },
              { label: "Serious",  color: "var(--serious)" },
              { label: "Anger",    color: "var(--anger)" },
            ].map((l) => (
              <div className="radar-legend-item" key={l.label}>
                <div className="legend-swatch" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────── */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-header">
          <div>
            <div className="eyebrow" style={{ marginBottom: "14px" }}>
              <span className="eyebrow-line" />Testimonials
            </div>
            <h2 className="section-title">What people <em>found out</em></h2>
          </div>
          <div className="reviews-nav">
            <button
              className="reviews-nav-btn"
              onClick={() => setActiveReview((p) => (p - 1 + REVIEWS.length) % REVIEWS.length)}
            >←</button>
            <button
              className="reviews-nav-btn"
              onClick={() => setActiveReview((p) => (p + 1) % REVIEWS.length)}
            >→</button>
          </div>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div
              className="review-card"
              key={i}
              onClick={() => setActiveReview(i)}
              style={{
                borderTop: i === activeReview ? `2px solid ${r.avColor}` : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <div className="review-top">
                <div className="review-user">
                  <div
                    className="review-avatar"
                    style={{
                      background: r.avColor + "22",
                      color: r.avColor,
                    }}
                  >
                    {r.av}
                  </div>
                  <span className="review-username">@{r.user}</span>
                </div>
                <span className="review-group-pill">{r.group}</span>
              </div>

              <p className="review-body">"{r.body}"</p>

              <div className="review-footer-row">
                <div className="review-sources">
                  {r.sources.map((s) => (
                    <span className="source-chip" key={s}>{s}</span>
                  ))}
                </div>
                <div className="review-mini-radar">
                  <Radar values={r.radar} color={r.radarColor} size={64} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="eyebrow cta-eyebrow">
          <span className="eyebrow-line" />
          Free · No account required
          <span className="eyebrow-line" />
        </div>
        <h2 className="cta-title">
          Ready to decode your <em>flavor?</em>
        </h2>
        <p className="cta-sub">30 seconds. Three usernames. One polygon that's entirely you.</p>
        <div className="cta-actions">
            <Link href="/username-input" className="btn-primary">
                Start Assessment →
            </Link>
        </div>
        <p className="cta-note">Works with any combination of supported platforms</p>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-logo">PersonaFlavor</div>
        <div className="footer-links">
          <a className="footer-link" href="#">Privacy</a>
          <a className="footer-link" href="#">Terms</a>
          <a className="footer-link" href="#">GitHub</a>
          <a className="footer-link" href="#">About</a>
        </div>
        <div className="footer-copy">
          © 2025 — Affiliated with ScoraSong
        </div>
      </footer>
    </>
  );
}