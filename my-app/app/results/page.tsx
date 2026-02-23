"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

/* ─── Stat labels for the polygon ─── */
const STAT_KEYS = ["complexity", "darkness", "mainstream", "emotional", "experimental"] as const;
const STAT_LABELS = ["Complex", "Dark", "Mainstream", "Emotional", "Experimental"];

/* ─── Radar polygon math ─── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPolygon(stats: Record<string, number>, cx: number, cy: number, maxR: number) {
  const n = STAT_KEYS.length;
  return STAT_KEYS.map((k, i) => {
    const r = (stats[k] / 100) * maxR;
    return polarToCartesian(cx, cy, r, (360 / n) * i);
  })
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
}

/* ─── Mini radar SVG ─── */
function RadarChart({
  stats,
  size = 260,
  color = "#e8c55a",
}: {
  stats: Record<string, number>;
  size?: number;
  color?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 28;
  const n = STAT_KEYS.length;
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((r, i) => {
        const pts = Array.from({ length: n }, (_, j) => {
          const p = polarToCartesian(cx, cy, r * maxR, (360 / n) * j);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {STAT_KEYS.map((_, i) => {
        const p = polarToCartesian(cx, cy, maxR, (360 / n) * i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Filled polygon */}
      <polygon
        points={buildPolygon(stats, cx, cy, maxR)}
        fill={`${color}22`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Stat dots */}
      {STAT_KEYS.map((k, i) => {
        const r = (stats[k] / 100) * maxR;
        const p = polarToCartesian(cx, cy, r, (360 / n) * i);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        );
      })}

      {/* Axis labels */}
      {STAT_KEYS.map((_, i) => {
        const p = polarToCartesian(cx, cy, maxR + 18, (360 / n) * i);
        return (
          <text
            key={i}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            letterSpacing="1.5"
            fill="rgba(237,232,223,0.35)"
            fontFamily="'Syne Mono', monospace"
          >
            {STAT_LABELS[i].toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Platform badge ─── */
function PlatformBadge({ label, count }: { label: string; count: number }) {
  return (
    <div className="platform-badge">
      <span className="badge-label">{label}</span>
      <span className="badge-count">{count}</span>
    </div>
  );
}

/* ─── Stat bar ─── */
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="stat-bar-row">
      <div className="stat-bar-label">{label}</div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <div className="stat-bar-value">{value}</div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();

  const data = useMemo(() => {
    try {
      const raw = searchParams.get("data");
      return raw ? JSON.parse(decodeURIComponent(raw)) : null;
    } catch {
      return null;
    }
  }, [searchParams]);

    const analysis = data ?? {};
    const dims = analysis.stats ?? { complexity: 70, darkness: 60, mainstream: 30, emotional: 75, experimental: 55 };
    const persona = {
        title: analysis.persona ?? "The Wanderer",
        description: analysis.description ?? "No fixed coordinates.",
        stats: analysis.stats ?? dims,
    };
    
    const totalCount = analysis.total_count ?? 0;

  const statColors: Record<string, string> = {
    complexity: "#7b7be8",
    darkness: "#6ec4a8",
    mainstream: "#e8c55a",
    emotional: "#e86a7d",
    experimental: "#e87542",
  };

  return (
    <>
      <style>{`
        /* ── Page shell ── */
        .results-page {
          min-height: 100svh;
          background: var(--bg);
          padding-bottom: 100px;
        }

        /* ── Hero band ── */
        .results-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
          padding: 100px 56px 72px;
        }
        .results-hero-ambient { position: absolute; inset: 0; pointer-events: none; }
        .results-hero-orb-a {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,197,90,0.08) 0%, transparent 70%);
          filter: blur(80px);
          top: -20%; right: -10%;
        }
        .results-hero-orb-b {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(110,196,168,0.06) 0%, transparent 70%);
          filter: blur(80px);
          bottom: -20%; left: -5%;
        }

        .results-hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 64px;
          max-width: 1200px;
        }

        .results-persona-eyebrow {
          margin-bottom: 16px;
        }
        .results-persona-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          line-height: 1.02;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
        }
        .results-persona-title em { font-style: italic; color: var(--accent); }

        .results-persona-desc {
          font-size: 1rem;
          color: var(--text-2);
          line-height: 1.8;
          max-width: 52ch;
          margin-bottom: 36px;
        }

        .results-summary {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 300;
          font-style: italic;
          color: var(--text);
          line-height: 1.7;
          max-width: 60ch;
          border-left: 2px solid var(--accent);
          padding-left: 20px;
        }

        .results-radar-wrap {
          flex-shrink: 0;
          animation: fadeIn 1s 0.3s both;
        }

        /* ── Stats band ── */
        .stats-band {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .stat-cell {
          padding: 28px 24px;
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          transition: background var(--transition);
          cursor: default;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-cell::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--s-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .stat-cell:hover { background: var(--surface); }
        .stat-cell:hover::after { transform: scaleX(1); }

        .stat-cell-name {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 10px;
        }
        .stat-cell-value {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        /* ── Main content grid ── */
        .results-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 56px 0;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
        }

        /* ── Patterns section ── */
        .results-section-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .patterns-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 48px;
        }
        .pattern-row {
          display: grid;
          grid-template-columns: 32px 1fr;
          align-items: center;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 18px 20px 18px 0;
          transition: background var(--transition), border-color var(--transition);
        }
        .pattern-row:hover {
          background: var(--surface-2);
          border-color: var(--border-hover);
        }
        .pattern-num {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          color: var(--text-3);
          text-align: center;
        }
        .pattern-text {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 300;
          color: var(--text);
          line-height: 1.5;
        }

        /* ── Stat bars ── */
        .stat-bars-section { margin-bottom: 48px; }
        .stat-bar-row {
          display: grid;
          grid-template-columns: 90px 1fr 36px;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .stat-bar-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
        }
        .stat-bar-track {
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .stat-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.22,1,0.36,1);
        }
        .stat-bar-value {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-3);
          text-align: right;
        }

        /* ── Platform data cards ── */
        .data-counts {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .platform-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 14px 18px;
          transition: background var(--transition);
        }
        .platform-badge:hover { background: var(--surface-2); }
        .badge-label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .badge-count {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--accent);
        }

        /* ── Side panel ── */
        .results-side {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .side-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 28px 24px;
        }
        .side-card-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 16px;
        }
        .side-total {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 300;
          letter-spacing: -0.03em;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 6px;
        }
        .side-total-label {
          font-size: 0.8rem;
          color: var(--text-3);
        }

        /* Share row */
        .share-row {
          display: flex;
          gap: 8px;
          margin-top: 24px;
        }
        .share-btn {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 0;
          border: 1px solid var(--border);
          color: var(--text-2);
          background: transparent;
          cursor: pointer;
          transition: border-color var(--transition), color var(--transition), background var(--transition);
        }
        .share-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(232,197,90,0.05);
        }
        .share-btn-primary {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg);
        }
        .share-btn-primary:hover {
          opacity: 0.88;
          color: var(--bg);
          background: var(--accent);
          box-shadow: 0 0 24px rgba(232,197,90,0.3);
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .results-hero-inner { grid-template-columns: 1fr; }
          .results-radar-wrap { display: none; }
          .stats-band { grid-template-columns: repeat(3, 1fr); }
          .results-body { grid-template-columns: 1fr; padding: 40px 20px 0; }
        }
        @media (max-width: 768px) {
          .results-hero { padding: 80px 20px 48px; }
          .stats-band { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="results-page">
        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">Persona<em>Flavor</em></div>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/input" className="nav-link">Try Again</a>
          </div>
          <a href="/input" className="nav-cta">New Profile</a>
        </nav>

        {/* Hero */}
        <div className="results-hero" style={{ paddingTop: 124 }}>
          <div className="results-hero-ambient">
            <div className="results-hero-orb-a" />
            <div className="results-hero-orb-b" />
          </div>
          <div className="results-hero-inner">
            <div style={{ animation: "slideUp 0.8s 0.05s cubic-bezier(0.22,1,0.36,1) both" }}>
              <div className="eyebrow results-persona-eyebrow">
                <span className="eyebrow-line" />
                Your PersonaFlavor
              </div>
              <div className="results-persona-title">
                <em>{persona.title}</em>
              </div>
              <div className="results-persona-desc">{persona.description}</div>
              {analysis.summary && (
                <div className="results-summary">"{analysis.summary}"</div>
              )}
            </div>

            <div className="results-radar-wrap">
              <RadarChart stats={persona.stats ?? dims} size={280} color="#e8c55a" />
            </div>
          </div>
        </div>

        {/* Stat band */}
        <div className="stats-band">
          {STAT_KEYS.map((k, i) => (
            <div
              key={k}
              className="stat-cell"
              style={{ "--s-color": Object.values(statColors)[i] } as React.CSSProperties}
            >
              <div className="stat-cell-name">{STAT_LABELS[i]}</div>
              <div className="stat-cell-value" style={{ color: Object.values(statColors)[i] }}>
                {dims[k]}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="results-body">
          <div>
            {/* Patterns */}
            {analysis.patterns?.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div className="results-section-label">
                  <span className="eyebrow-line" />
                  Key Patterns
                </div>
                <div className="patterns-list">
                  {analysis.patterns.map((p: string, i: number) => (
                    <div key={i} className="pattern-row">
                      <div className="pattern-num">0{i + 1}</div>
                      <div className="pattern-text">{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stat bars */}
            <div className="stat-bars-section">
              <div className="results-section-label">
                <span className="eyebrow-line" />
                Dimension Breakdown
              </div>
              {STAT_KEYS.map((k, i) => (
                <StatBar
                  key={k}
                  label={STAT_LABELS[i]}
                  value={dims[k]}
                  color={Object.values(statColors)[i]}
                />
              ))}
            </div>
{/* 
            Platform data
            <div>
              <div className="results-section-label">
                <span className="eyebrow-line" />
                Sources Analyzed
              </div>
              <div className="data-counts">
                {totalCount > 0 && <PlatformBadge label="total reviews" count={totalCount} />}
              </div>
            </div> */}
          </div>

          {/* Side panel */}
          <div className="results-side">
            <div className="side-card">
              <div className="side-card-label">Total items analyzed</div>
              <div className="side-total">{totalCount}</div>
              <div className="side-total-label">across all platforms</div>
            </div>

            <div className="side-card">
              <div className="side-card-label">Radar Profile</div>
              <RadarChart stats={persona.stats ?? dims} size={280} color="#e8c55a" />
            </div>

            <div className="side-card">
              <div className="side-card-label">Share your flavor</div>
              <div className="share-row">
                <button
                  className="share-btn"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  Copy Link
                </button>
                <button
                  className="share-btn share-btn-primary"
                  onClick={() => {
                    const text = `My PersonaFlavor is: ${persona.title}\n"${persona.description}"\n\npersonaflavors.com`;
                    navigator.clipboard.writeText(text);
                  }}
                >
                  Copy Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh", background: "var(--bg)" }} />}>
      <ResultsContent />
    </Suspense>
  );
}