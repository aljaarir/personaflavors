"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const STAGES = [
  { label: "Tuning into your Letterboxd", icon: "🎬" },
  { label: "Scanning your game history", icon: "🎮" },
  { label: "Reading your music taste", icon: "🎵" },
  { label: "Synthesizing your flavor profile", icon: "✨" },
];

function LoadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      letterboxd_username: searchParams.get("letterboxd") ?? "",
      scorasong_username: searchParams.get("scorasong") ?? "",
      backloggd_username: searchParams.get("backloggd") ?? "",
    });

    let cancelled = false;
    let pushTimeout: number | undefined;

    fetch(`https://personaflavors-production.up.railway.app/user/data?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDone(true);
        pushTimeout = window.setTimeout(() => {
          const payload = {
            persona: data.analysis?.persona,
            description: data.analysis?.description,
            stats: data.analysis?.stats,
            total_count: data.total_count,
          };
          router.push(`/results?data=${encodeURIComponent(JSON.stringify(payload))}`);
        }, 800);
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      if (pushTimeout) clearTimeout(pushTimeout);
    };
  }, [searchParams, router]);

  const progress = done ? 100 : ((stageIndex + 1) / STAGES.length) * 85;

  return (
    <>
      <style>{`
        .loading-page {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 60px;
          position: relative;
          overflow: hidden;
        }

        .loading-card {
          width: 100%;
          max-width: 520px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .loading-header {
          animation: slideUp 0.7s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .loading-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .loading-title em { font-style: italic; color: var(--accent); }
        .loading-subtitle {
          font-size: 0.85rem;
          color: var(--text-2);
          line-height: 1.7;
        }

        .loading-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideUp 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }
        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .spin-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid transparent;
        }
        .spin-ring-outer {
          border-top-color: var(--accent);
          border-right-color: rgba(232,197,90,0.2);
          animation: spin 2s linear infinite;
        }
        .spin-ring-inner {
          inset: 14px;
          border-bottom-color: var(--dark);
          border-left-color: rgba(123,123,232,0.2);
          animation: spin 1.4s linear infinite reverse;
        }
        .spin-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          animation: iconPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .done-glyph {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--accent);
          animation: iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .loading-stage-label {
          font-family: var(--font-mono);
          font-size: 0.63rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          min-height: 1.4em;
          animation: slideUp 0.7s 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }

        .loading-progress {
          animation: slideUp 0.7s 0.32s cubic-bezier(0.22,1,0.36,1) both;
        }

        .loading-stages {
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: slideUp 0.7s 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .loading-stage-row {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          align-items: center;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: border-color var(--transition), background var(--transition);
        }
        .loading-stage-row.is-active {
          border-color: var(--accent);
          background: var(--surface-2);
        }
        .loading-stage-row.is-complete {
          border-color: rgba(110,196,168,0.25);
        }
        .stage-row-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border-right: 1px solid var(--border);
          padding: 14px 0;
        }
        .stage-row-name {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
          padding-left: 16px;
          transition: color var(--transition);
        }
        .loading-stage-row.is-active   .stage-row-name { color: var(--accent); }
        .loading-stage-row.is-complete .stage-row-name { color: var(--serious); }
        .stage-row-status {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          color: var(--text-3);
          padding: 0 16px;
          white-space: nowrap;
        }
        .loading-stage-row.is-active   .stage-row-status { color: var(--accent); }
        .loading-stage-row.is-complete .stage-row-status { color: var(--serious); }
      `}</style>

      <div className="loading-page">
        {/* Ambient orbs — defined in globals */}
        <div className="hero-ambient">
          <div className="hero-orb a" />
          <div className="hero-orb b" />
        </div>

        <div className="loading-card">

          {/* Header */}
          <div className="loading-header">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              <span className="eyebrow-line" />
              Analyzing your taste
            </div>
            <div className="loading-title">
              Brewing your<br /><em>PersonaFlavor</em>
            </div>
            <div className="loading-subtitle">
              Sit tight — we&apos;re reading across your platforms.
            </div>
          </div>

          {/* Spinner */}
          <div className="loading-spinner-wrap">
            {done ? (
              <div className="done-glyph">✦</div>
            ) : (
              <div className="loading-spinner">
                <div className="spin-ring spin-ring-outer" />
                <div className="spin-ring spin-ring-inner" />
                <div className="spin-icon" key={stageIndex}>
                  {STAGES[stageIndex].icon}
                </div>
              </div>
            )}
          </div>

          {/* Current stage label */}
          <div className="loading-stage-label">
            <span className="eyebrow-line" />
            {done ? "Ready — redirecting" : `${STAGES[stageIndex].label}${dots}`}
            <span className="eyebrow-line" />
          </div>

          {/* Progress bar — uses .progress-row / .progress-track / .progress-fill from globals */}
          <div className="loading-progress progress-row">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-label">
              <b>{stageIndex + 1}</b> / {STAGES.length}
            </div>
          </div>

          {/* Stage checklist — uses .platform-row layout pattern from globals */}
          <div className="loading-stages">
            {STAGES.map((s, i) => {
              const isActive = i === stageIndex && !done;
              const isComplete = i < stageIndex || done;
              return (
                <div
                  key={i}
                  className={`loading-stage-row${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
                >
                  <div className="stage-row-icon">{s.icon}</div>
                  <div className="stage-row-name">{s.label}</div>
                  <div className="stage-row-status">
                    {isComplete ? "✓ done" : isActive ? "running" : "waiting"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh", background: "var(--bg)" }} />}>
      <LoadingContent />
    </Suspense>
  );
}