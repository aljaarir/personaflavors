"use client";

export default function BlockedPage() {
  return (
    <>
      <style>{`
        .blocked-page {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 60px;
          position: relative;
          overflow: hidden;
        }

        .blocked-page .hero-orb { position: fixed; }

        .blocked-card {
          width: 100%;
          max-width: 520px;
          z-index: 1;
        }

        /* Header — same as .input-header */
        .blocked-header {
          margin-bottom: 36px;
          animation: slideUp 0.7s 0.05s cubic-bezier(0.22,1,0.36,1) both;
          text-align: center;
        }
        .blocked-glyph {
          font-family: var(--font-display);
          font-size: 2.4rem;
          color: var(--romantic);
          margin-bottom: 20px;
          display: block;
          animation: float 4s ease-in-out infinite;
        }
        .blocked-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .blocked-title em { font-style: italic; color: var(--romantic); }
        .blocked-subtitle {
          font-size: 0.85rem;
          color: var(--text-2);
          line-height: 1.7;
        }

        /* Pitch rows — same pattern as .how-step but stacked */
        .blocked-pitch {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 20px;
          animation: slideUp 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }
        .blocked-pitch-row {
          display: grid;
          grid-template-columns: 52px 1fr;
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          position: relative;
          transition: background var(--transition), border-color var(--transition);
        }
        .blocked-pitch-row::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--romantic), transparent);
          opacity: 0;
          transition: opacity var(--transition);
        }
        .blocked-pitch-row:hover { background: var(--surface-2); border-color: var(--border-hover); }
        .blocked-pitch-row:hover::before { opacity: 1; }

        .blocked-pitch-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--border);
          font-size: 1.2rem;
        }
        .blocked-pitch-col {
          display: flex;
          flex-direction: column;
          padding: 13px 18px;
          gap: 3px;
        }
        .blocked-pitch-label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--romantic);
        }
        .blocked-pitch-body {
          font-size: 0.82rem;
          color: var(--text-2);
          line-height: 1.55;
        }

        /* Submit row — reuses exact globals classes */
        .blocked-actions {
          display: flex;
          gap: 10px;
          animation: slideUp 0.7s 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }
        .blocked-cta {
          flex: 1;
          font-family: var(--font-ui);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--bg);
          background: var(--romantic);
          padding: 15px 24px;
          border: none;
          position: relative;
          overflow: hidden;
          transition: opacity var(--transition), box-shadow var(--transition), transform var(--transition);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .blocked-cta::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
          pointer-events: none;
        }
        .blocked-cta:hover {
          opacity: 0.9;
          box-shadow: 0 0 32px rgba(232,106,125,0.4);
          transform: translateY(-1px);
        }

        .blocked-note {
          margin-top: 18px;
          font-family: var(--font-mono);
          font-size: 0.56rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
          text-align: center;
          line-height: 1.9;
          animation: fadeIn 1s 0.6s both;
        }
      `}</style>

      <div className="blocked-page">
        {/* Ambient — exact same as input page */}
        <div className="hero-ambient">
          <div className="hero-orb a" style={{ background: "radial-gradient(circle, rgba(232,106,125,0.08) 0%, transparent 70%)" }} />
          <div className="hero-orb b" />
        </div>

        <div className="blocked-card">

          {/* Header */}
          <div className="blocked-header">
            <div className="eyebrow" style={{ marginBottom: 16, justifyContent: "center" }}>
              <span className="eyebrow-line" style={{ background: "var(--romantic)" }} />
              ScoraSong required
              <span className="eyebrow-line" style={{ background: "var(--romantic)" }} />
            </div>
            <span className="blocked-glyph">⊘</span>
            <div className="blocked-title">
              Your music is<br /><em>the missing piece</em>
            </div>
            <div className="blocked-subtitle" style={{ marginTop: 10 }}>
              PersonaFlavor needs your listening history to build an accurate taste profile.
              Without ScoraSong, the analysis is incomplete.
            </div>
          </div>

          {/* Pitch rows — same as platform-row layout */}
          <div className="blocked-pitch">
            <div className="blocked-pitch-row">
              <div className="blocked-pitch-icon">🎵</div>
              <div className="blocked-pitch-col">
                <div className="blocked-pitch-label">Music reveals the most</div>
                <div className="blocked-pitch-body">Listening habits expose taste dimensions that movies and games alone can't capture. It's the dimension that makes your profile real.</div>
              </div>
            </div>
            <div className="blocked-pitch-row">
              <div className="blocked-pitch-icon">📊</div>
              <div className="blocked-pitch-col">
                <div className="blocked-pitch-label">Rate songs & albums</div>
                <div className="blocked-pitch-body">ScoraSong lets you log what you listen to with ratings and reviews — your musical memory, organized.</div>
              </div>
            </div>
            <div className="blocked-pitch-row">
              <div className="blocked-pitch-icon">⚡</div>
              <div className="blocked-pitch-col">
                <div className="blocked-pitch-label">Free to join</div>
                <div className="blocked-pitch-body">Sign up, rate a few albums, come back and run your full PersonaFlavor analysis.</div>
              </div>
            </div>
          </div>

          {/* Actions — same structure as .submit-row */}
          <div className="blocked-actions">
            <a
              href="https://scorasong.com"
              className="blocked-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join ScoraSong — it&apos;s free →
            </a>
            <a href="/input" className="clear-btn">
              ← Back
            </a>
          </div>

          <div className="blocked-note">
            Already have an account? Go back and enter your ScoraSong username.
          </div>

        </div>
      </div>
    </>
  );
}