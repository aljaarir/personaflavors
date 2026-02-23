"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "letterboxd", name: "Letterboxd", icon: "🎬", color: "var(--anger)",   hint: "letterboxd.com/" },
  { id: "backloggd",  name: "Backloggd",  icon: "🎮", color: "var(--dark)",    hint: "backloggd.com/u/" },
  { id: "scorasong",  name: "ScoraSong",  icon: "🎵", color: "var(--serious)", hint: "scorasong.com/" },
];

type Values = Record<string, string>;

export default function UsernameInput() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({
    letterboxd: "", backloggd: "", scorasong: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError]     = useState("");

  const filled    = Object.values(values).filter((v) => v.trim().length > 0);
  const canSubmit = filled.length >= 1;
  const progress  = (filled.length / PLATFORMS.length) * 100;

  function handleChange(id: string, val: string) {
    setValues((prev) => ({ ...prev, [id]: val }));
    if (error) setError("");
  }

  function handleClear() {
    setValues({ letterboxd: "", backloggd: "", scorasong: "" });
    setError("");
  }

  function handleSubmit() {
    if (!canSubmit) { setError("Enter at least one username to continue."); return; }
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => { if (v.trim()) params.set(k, v.trim()); });
    router.push(`/loading-page?${params.toString()}`);
  }

  return (
    <div className="input-page">
      <div className="hero-orb a" />
      <div className="hero-orb b" />

      <nav className="nav">
        <Link href="/" className="nav-link">← Back</Link>
        <div className="nav-logo">Persona<em>Flavor</em></div>
        {/* Spacer keeps logo centred */}
        <div style={{ width: 60 }} />
      </nav>

      <div className="input-card">

        {/* Header */}
        <div className="input-header">
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            <span className="eyebrow-line" />
            Step 1 of 1
          </div>
          <h1 className="input-title">
            Enter your <em>usernames</em>
          </h1>
          <p className="input-subtitle">
            Add at least one. The more you connect, the richer your profile.
            No passwords or permissions needed.
          </p>
        </div>

        {/* Platform rows */}
        <div className="platform-list">
          {PLATFORMS.map((p) => {
            const isFocused = focused === p.id;
            const hasValue  = values[p.id].trim().length > 0;
            return (
              <div
                key={p.id}
                className={`platform-row${isFocused ? " is-focused" : ""}${hasValue ? " has-value" : ""}`}
                style={{ "--p-color": p.color } as React.CSSProperties}
              >
                <div className="platform-icon-col">{p.icon}</div>
                <div className="platform-input-col">
                  <div className="platform-label-row">
                    <span className="platform-name">{p.name}</span>
                    <span className="platform-hint">{p.hint}</span>
                  </div>
                  <input
                    className="platform-field"
                    type="text"
                    placeholder="your_username"
                    value={values[p.id]}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(e) => handleChange(p.id, e.target.value)}
                    onFocus={() => setFocused(p.id)}
                    onBlur={() => setFocused(null)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">
            <b>{filled.length}</b> / {PLATFORMS.length} connected
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="input-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Actions */}
        <div className="submit-row">
          <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
            Analyze My Flavor →
          </button>
          {filled.length > 0 && (
            <button className="clear-btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>

        <p className="input-note">
          We only read public profile data · No account required
          <br />
          Usernames are not stored after your session ends
        </p>
      </div>
    </div>
  );
}