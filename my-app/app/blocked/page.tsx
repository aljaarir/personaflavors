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
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        /* Ambient */
        .blocked-orb-a {
          position: fixed;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,106,125,0.07) 0%, transparent 65%);
          filter: blur(90px);
          top: -20%; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .blocked-orb-b {
          position: fixed;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(123,123,232,0.06) 0%, transparent 70%);
          filter: blur(80px);
          bottom: -10%; right: -10%;
          pointer-events: none;
        }

        /* Lock glyph */
        .blocked-glyph-wrap {
          position: relative;
          width: 80px; height: 80px;
          margin: 0 auto 40px;
          animation: slideUp 0.7s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }
        .blocked-glyph-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(232,106,125,0.25);
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .blocked-glyph-ring-2 {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1px solid rgba(232,106,125,0.1);
          animation: pulse-ring 3s 0.8s ease-in-out infinite;
        }
        .blocked-glyph {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--romantic);
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        /* Content */
        .blocked-card {
          position: relative;
          z-index: 1;
          max-width: 560px;
          width: 100%;
        }

        .blocked-eyebrow {
          margin-bottom: 20px;
          justify-content: center;
          animation: slideUp 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }

        .blocked-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
          animation: slideUp 0.7s 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }
        .blocked-title em {
          font-style: italic;
          color: var(--romantic);
        }

        .blocked-desc {
          font-size: 0.92rem;
          color: var(--text-2);
          line-height: 1.8;
          max-width: 46ch;
          margin: 0 auto 48px;
          animation: slideUp 0.7s 0.26s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Why card — the pitch */
        .blocked-pitch {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 36px;
          text-align: left;
          animation: slideUp 0.7s 0.33s cubic-bezier(0.22,1,0.36,1) both;
        }
        .pitch-row {
          display: grid;
          grid-template-columns: 44px 1fr;
          align-items: center;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: background var(--transition), border-color var(--transition);
        }
        .pitch-row:hover {
          background: var(--surface-2);
          border-color: var(--border-hover);
        }
        .pitch-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border-right: 1px solid var(--border);
          padding: 16px 0;
          align-self: stretch;
        }
        .pitch-text {
          padding: 14px 18px;
        }
        .pitch-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .pitch-body {
          font-size: 0.82rem;
          color: var(--text-2);
          line-height: 1.55;
        }

        /* Divider */
        .blocked-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          animation: fadeIn 0.7s 0.4s both;
        }
        .blocked-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .blocked-divider-text {
          font-family: var(--font-mono);
          font-size: 0.56rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-3);
        }

        /* CTA buttons */
        .blocked-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: slideUp 0.7s 0.44s cubic-bezier(0.22,1,0.36,1) both;
        }

        .blocked-cta-primary {
          width: 100%;
          font-family: var(--font-ui);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: var(--bg);
          background: var(--romantic);
          padding: 17px 32px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity var(--transition), box-shadow var(--transition), transform var(--transition);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .blocked-cta-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%);
          pointer-events: none;
        }
        .blocked-cta-primary:hover {
          opacity: 0.9;
          box-shadow: 0 0 40px rgba(232,106,125,0.35);
          transform: translateY(-1px);
        }

        .blocked-cta-secondary {
          width: 100%;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-2);
          background: transparent;
          padding: 15px 32px;
          border: 1px solid var(--border);
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color var(--transition), color var(--transition);
        }
        .blocked-cta-secondary:hover {
          border-color: var(--border-hover);
          color: var(--text);
        }

        /* Note */
        .blocked-note {
          margin-top: 24px;
          font-family: var(--font-mono);
          font-size: 0.56rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-3);
          line-height: 1.9;
          animation: fadeIn 1s 0.6s both;
        }
      `}</style>

      <div className="blocked-page">
        <div className="blocked-orb-a" />
        <div className="blocked-orb-b" />

        <div className="blocked-card">

          {/* Lock glyph */}
          <div className="blocked-glyph-wrap">
            <div className="blocked-glyph-ring-2" />
            <div className="blocked-glyph-ring" />
            <div className="blocked-glyph">⊘</div>
          </div>

          {/* Eyebrow */}
          <div className="eyebrow blocked-eyebrow">
            <span className="eyebrow-line" style={{ background: "var(--romantic)" }} />
            ScoraSong account required
            <span className="eyebrow-line" style={{ background: "var(--romantic)" }} />
          </div>

          {/* Title */}
          <div className="blocked-title">
            Your music is<br /><em>the missing piece</em>
          </div>

          {/* Description */}
          <p className="blocked-desc">
            PersonaFlavor builds your taste profile across movies, games, <em>and</em> music.
            Without your listening history, we can only see part of who you are.
            Connect ScoraSong to unlock your full PersonaFlavor.
          </p>

          {/* The pitch — why ScoraSong */}
          <div className="blocked-pitch">
            <div className="pitch-row">
              <div className="pitch-icon">🎵</div>
              <div className="pitch-text">
                <div className="pitch-label">Rate what you hear</div>
                <div className="pitch-body">Log songs and albums with ratings, reviews, and listening dates — your musical memory, organized.</div>
              </div>
            </div>
            <div className="pitch-row">
              <div className="pitch-icon">📊</div>
              <div className="pitch-text">
                <div className="pitch-label">Music powers the analysis</div>
                <div className="pitch-body">Music is the most revealing dimension of taste. It's the data that makes your PersonaFlavor actually accurate.</div>
              </div>
            </div>
            <div className="pitch-row">
              <div className="pitch-icon">⚡</div>
              <div className="pitch-text">
                <div className="pitch-label">Free to join</div>
                <div className="pitch-body">ScoraSong is free. Sign up, rate a few albums, come back here and run your full analysis.</div>
              </div>
            </div>
          </div>

          <div className="blocked-divider">
            <div className="blocked-divider-line" />
            <div className="blocked-divider-text">ready?</div>
            <div className="blocked-divider-line" />
          </div>

          {/* Actions */}
          <div className="blocked-actions">
            <a
              href="https://scorasong.com/signup"
              className="blocked-cta-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join ScoraSong — it&apos;s free
              <span style={{ fontSize: "1.1rem" }}>→</span>
            </a>
            <a href="/input" className="blocked-cta-secondary">
              ← Go back and try again
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