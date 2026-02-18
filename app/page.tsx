"use client";

import { useState, useEffect, useRef } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type Platform = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  desc: string;
  handle: string;
};

type Archetype = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  radarColor: string;
  radarFill: string;
  traits: Record<string, number>;
  famous: string[];
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const PLATFORMS: Platform[] = [
  { id: "letterboxd", name: "Letterboxd", icon: "🎬", color: "#00C030", bg: "#0a1a0e", desc: "Films & cinema",    handle: "" },
  { id: "goodreads",  name: "Goodreads",  icon: "📚", color: "#F4A261", bg: "#1a1208", desc: "Books & literature", handle: "" },
  { id: "backloggd",  name: "Backloggd",  icon: "🎮", color: "#7B68EE", bg: "#0d0b1a", desc: "Video games",        handle: "" },
  { id: "scorasong",  name: "ScoraSong",  icon: "🎵", color: "#FF6B9D", bg: "#1a080f", desc: "Music ratings",      handle: "" },
];

const ARCHETYPES: Archetype[] = [
  {
    id: "romantic_melancholic",
    name: "The Romantic Melancholic",
    emoji: "🌒",
    tagline: "Drawn to beautiful impermanence",
    description: "You live in the space between joy and sorrow. Arthouse cinema, literary fiction, and slow folk music define your inner landscape. You find meaning in transience, seek depth over spectacle, and believe that sadness is just love with nowhere to go.",
    color: "#A78BFA", radarColor: "#A78BFA", radarFill: "rgba(167,139,250,0.25)",
    traits: { Depth: 92, Nostalgia: 88, Sensitivity: 85, Adventure: 42, Social: 38, Optimism: 55 },
    famous: ["Sofia Coppola", "Haruki Murakami", "Elliott Smith"],
  },
  {
    id: "cerebral_explorer",
    name: "The Cerebral Explorer",
    emoji: "🔭",
    tagline: "Mapping the edges of the known",
    description: "Ideas are your currency. You chase science-fiction worlds, dense non-fiction, atmospheric soundscapes, and games that reward patience. You'd rather understand one thing deeply than skim a thousand surfaces.",
    color: "#34D399", radarColor: "#34D399", radarFill: "rgba(52,211,153,0.25)",
    traits: { Depth: 90, Nostalgia: 45, Sensitivity: 72, Adventure: 88, Social: 50, Optimism: 78 },
    famous: ["Ursula K. Le Guin", "Ari Aster", "Brian Eno"],
  },
  {
    id: "social_hedonist",
    name: "The Social Hedonist",
    emoji: "✨",
    tagline: "Culture as communion",
    description: "You experience art with others — and you want them to feel it too. Pop cinema, bestselling novels, anthemic music, and accessible games fill your world. You measure quality by the conversations it sparks.",
    color: "#FB923C", radarColor: "#FB923C", radarFill: "rgba(251,146,60,0.25)",
    traits: { Depth: 48, Nostalgia: 60, Sensitivity: 65, Adventure: 72, Social: 95, Optimism: 90 },
    famous: ["Taylor Swift", "Nora Ephron", "John Green"],
  },
  {
    id: "aesthetic_purist",
    name: "The Aesthetic Purist",
    emoji: "🎴",
    tagline: "Form is the highest content",
    description: "Beauty isn't decoration — it's the point. You gravitate toward visually extraordinary cinema, precisely crafted prose, jazz, and games with impeccable art direction. You'd rather experience one perfect thing than ten adequate ones.",
    color: "#F472B6", radarColor: "#F472B6", radarFill: "rgba(244,114,182,0.25)",
    traits: { Depth: 85, Nostalgia: 70, Sensitivity: 88, Adventure: 55, Social: 42, Optimism: 65 },
    famous: ["Wong Kar-wai", "Joan Didion", "Miles Davis"],
  },
  {
    id: "dark_ironist",
    name: "The Dark Ironist",
    emoji: "🕯",
    tagline: "Laughing at the void",
    description: "You see through every pretension — including your own. Black comedies, satirical fiction, post-punk, and experimental games feel like home. Your taste is a defense mechanism and you know it. That's the joke.",
    color: "#94A3B8", radarColor: "#94A3B8", radarFill: "rgba(148,163,184,0.25)",
    traits: { Depth: 80, Nostalgia: 55, Sensitivity: 78, Adventure: 70, Social: 45, Optimism: 30 },
    famous: ["Charlie Kaufman", "Donna Tartt", "Nick Cave"],
  },
];

const TRAITS_LABELS = ["Depth", "Nostalgia", "Sensitivity", "Adventure", "Social", "Optimism"];

const REVIEWS = [
  { name: "Maya Chen",    handle: "@mayachen_reads",   avatar: "MC", color: "#A78BFA", archetype: "Romantic Melancholic 🌒", stars: 5, text: "I connected my Letterboxd and Goodreads and the result was uncanny. It called out my obsession with melancholic arthouse films and introspective fiction in one paragraph. My friends said 'that's literally just you.' I've never felt so seen by an algorithm." },
  { name: "Jordan Park",  handle: "@jpark_backlog",    avatar: "JP", color: "#34D399", archetype: "Cerebral Explorer 🔭",    stars: 5, text: "Skeptical going in, genuinely impressed coming out. The trait radar was spot-on — high adventure and depth, low social score. That's my entire personality in a hexagon. It matched me with Brian Eno, which tells me the model actually understands the texture of taste." },
  { name: "Priya Nair",   handle: "@priya.scorasong",  avatar: "PN", color: "#FB923C", archetype: "Social Hedonist ✨",       stars: 5, text: "Used all four platforms and the cross-platform analysis was wild. It noticed that I rate pop music higher than my Letterboxd would suggest, and called it out as my contradiction trait. Social Hedonist with aesthetic pretensions. Devastatingly accurate." },
  { name: "Sam Novak",    handle: "@samnovak_films",   avatar: "SN", color: "#F472B6", archetype: "Aesthetic Purist 🎴",      stars: 5, text: "The radar chart is just a beautiful object. I screenshotted mine and made it my phone wallpaper. The assessment is incredibly nuanced — it doesn't just look at what you like, it looks at HOW you like it. That cross-medium insight is genuinely new." },
  { name: "Alex Torres",  handle: "@alextorres_lit",   avatar: "AT", color: "#94A3B8", archetype: "Dark Ironist 🕯",          stars: 4, text: "It labeled me a Dark Ironist. I tried to be offended but the description is too accurate. It correctly inferred from my ratings that I use irony as emotional armor. The optimism score of 30 is a little too honest. Highly recommend if you want to be slightly roasted by AI." },
  { name: "Leila Hassan", handle: "@leilahassan",      avatar: "LH", color: "#60A5FA", archetype: "Romantic Melancholic 🌒", stars: 5, text: "Connecting ScoraSong was the key that unlocked everything. My film and book taste pointed one way but my music listening added a whole other emotional dimension. The final archetype felt like a synthesis I couldn't have described myself. Genuinely impressive." },
];

const FEATURES = [
  { icon: "⬡", title: "Cross-Medium Synthesis",     desc: "Our model finds the through-line across film, literature, games, and music to surface patterns you haven't noticed about yourself.",                                                              color: "#A78BFA" },
  { icon: "◎", title: "Radar Trait Visualization",   desc: "Six personality dimensions rendered as a bespoke radar chart unique to your taste profile — yours to screenshot and keep.",                                                                     color: "#34D399" },
  { icon: "◈", title: "Archetype Matching",          desc: "One of five curated archetypes with deep narrative descriptions, creative references, and historical figures whose taste mirrors yours.",                                                          color: "#F472B6" },
  { icon: "◻", title: "Contradiction Detection",     desc: "The most interesting people are inconsistent. We flag where your tastes diverge across platforms — your 'contradiction trait' — and explain what it means.",                                    color: "#FB923C" },
  { icon: "⬡", title: "Combined & Separate Views",   desc: "See your radar against all other archetypes at once, or isolate them individually. Understand not just who you are, but who you almost were.",                                                   color: "#60A5FA" },
  { icon: "◎", title: "Zero Data Storage",           desc: "Your handles are used in real-time to fetch public data. We never store your credentials, your history, or your results. Your taste stays yours.",                                               color: "#94A3B8" },
];

const STATS = [
  { value: "47,000+", label: "Profiles analyzed" },
  { value: "4",       label: "Platforms synthesized" },
  { value: "5",       label: "Archetypes discovered" },
  { value: "6",       label: "Trait dimensions mapped" },
];

const HOW_STEPS = [
  { n: "01", title: "Connect your platforms",    desc: "Enter your username for any combination of Letterboxd, Goodreads, Backloggd, and ScoraSong. Even one platform works — more connections mean deeper insight.", color: "#A78BFA" },
  { n: "02", title: "AI synthesizes your taste", desc: "Our model parses your rating history, genre preferences, variance patterns, and obscurity scores across all connected platforms simultaneously.",               color: "#34D399" },
  { n: "03", title: "Receive your archetype",    desc: "Your personality archetype is revealed with a full radar chart, trait scores, contradiction analysis, and your creative doppelgängers throughout history.",   color: "#F472B6" },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function pickArchetype(platforms: Platform[]): Archetype {
  const connected = platforms.filter((p) => p.handle.trim().length > 0);
  if (!connected.length) return ARCHETYPES[0];
  return ARCHETYPES[connected.reduce((s, p) => s + p.handle.length, 0) % ARCHETYPES.length];
}

const buildRadarData = (traits: Record<string, number>) =>
  TRAITS_LABELS.map((l) => ({ trait: l, value: traits[l] ?? 50 }));

/* ═══════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════ */
function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < n ? "#FBBF24" : "rgba(255,255,255,0.12)", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: `${color}18`, border: `1.5px solid ${color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color, fontFamily: "monospace" }}>
      {initials}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#a78bfa", marginBottom: 16 }}>
      {children}
    </p>
  );
}

function GlowCard({ children, color = "#a78bfa", style = {} }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "rgba(12,9,26,0.85)", border: `1px solid ${color}22`, borderRadius: 18, backdropFilter: "blur(12px)", ...style }}>
      {children}
    </div>
  );
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      dx: (Math.random() - 0.5) * 0.22,
      dy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.4 + 0.05,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,155,255,${p.alpha})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function NavBar({ onStart }: { onStart: () => void }) {
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(3,2,14,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(130,90,255,0.1)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          tasteprofile
        </span>
        <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {([["#how-it-works", "How it works"], ["#features", "Features"], ["#reviews", "Reviews"]] as [string, string][]).map(([href, label]) => (
            <a key={href} href={href} style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
              {label}
            </a>
          ))}
          <button onClick={onStart} style={{ background: "linear-gradient(135deg,#5b32e8,#9333ea)", border: "none", color: "#fff", borderRadius: 10, padding: "9px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}

function RadarCard({ archetype, showAll, selectedId }: { archetype: Archetype; showAll: boolean; selectedId: string }) {
  const data = buildRadarData(archetype.traits);
  const hi = !showAll || selectedId === archetype.id;
  return (
    <div style={{ background: "rgba(12,9,26,0.95)", border: `1px solid ${hi ? archetype.color + "50" : "rgba(80,70,120,0.12)"}`, borderRadius: 16, padding: "14px 10px 6px", transition: "all 0.4s", opacity: hi ? 1 : 0.28, transform: hi ? "scale(1)" : "scale(0.96)" }}>
      <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: archetype.color, marginBottom: 0, fontFamily: "'Playfair Display', serif" }}>
        {archetype.emoji} {archetype.name}
      </p>
      <ResponsiveContainer width="100%" height={170}>
        <RadarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="trait" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "monospace" }} />
          <Radar dataKey="value" stroke={archetype.radarColor} fill={archetype.radarFill} strokeWidth={1.8} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AnalysisLog({ lines }: { lines: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  return (
    <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(110,90,200,0.28)", borderRadius: 12, padding: "20px 24px", fontFamily: "monospace", fontSize: 13, color: "#a0f0b0", height: 230, overflowY: "auto", backdropFilter: "blur(8px)" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ marginBottom: 4, opacity: i === lines.length - 1 ? 1 : 0.6 }}>
          <span style={{ color: "#6040a0", marginRight: 8 }}>›</span>{line}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════ */
function LandingPage({ onStart }: { onStart: () => void }) {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "130px 24px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "12%", left: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(80,35,210,0.16) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "8%", right: "6%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

        <SectionLabel>AI-powered taste analysis</SectionLabel>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px,7vw,82px)", fontWeight: 700, lineHeight: 1.08, margin: "0 0 24px", maxWidth: 820 }}>
          Discover the person<br />
          <span style={{ background: "linear-gradient(90deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            hiding in your taste
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 18, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
          Connect your Letterboxd, Goodreads, Backloggd, and ScoraSong profiles. We synthesize your ratings across every medium into a deep personality archetype and bespoke visual trait map.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 44 }}>
          {PLATFORMS.map((p) => (
            <span key={p.id} style={{ padding: "7px 18px", border: `1px solid ${p.color}38`, borderRadius: 24, fontSize: 13, color: p.color, background: `${p.color}0a`, fontFamily: "monospace" }}>
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onStart}
            style={{ background: "linear-gradient(135deg,#5b32e8,#9333ea)", border: "none", color: "#fff", borderRadius: 13, padding: "17px 44px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 45px rgba(91,50,232,0.45)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
            Discover Your Archetype →
          </button>
          <a href="#how-it-works"
            style={{ border: "1px solid rgba(130,90,255,0.28)", color: "rgba(255,255,255,0.55)", borderRadius: 13, padding: "17px 38px", fontSize: 16, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            See how it works
          </a>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 18, fontFamily: "monospace", letterSpacing: 1.5 }}>
          FREE · NO ACCOUNT · RESULTS IN ~30 SECONDS
        </p>

        {/* Hero radar preview */}
        <div style={{ marginTop: 88, maxWidth: 740, width: "100%", position: "relative" }}>
          <GlowCard color="#a78bfa" style={{ padding: "28px 20px 16px" }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(167,139,250,0.5)", marginBottom: 18, textAlign: "left" }}>
              Example result — The Romantic Melancholic
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
              {ARCHETYPES.slice(0, 4).map((a) => (
                <RadarCard key={a.id} archetype={a} showAll={true} selectedId="romantic_melancholic" />
              ))}
            </div>
          </GlowCard>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(0deg,#03020e 0%,transparent 100%)", borderRadius: "0 0 18px 18px", pointerEvents: "none" }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "rgba(130,90,255,0.07)", borderRadius: 20, border: "1px solid rgba(130,90,255,0.13)", overflow: "hidden" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: "32px 20px", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid rgba(130,90,255,0.1)" : "none" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 6px" }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontFamily: "monospace", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>How it works</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, margin: "0 0 16px" }}>
              Three steps to<br />
              <span style={{ background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>know yourself better</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, maxWidth: 460, margin: "0 auto" }}>
              No questionnaires. No forced introspection. Just your actual taste, analyzed.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {HOW_STEPS.map((s) => (
              <GlowCard key={s.n} color={s.color} style={{ padding: "36px 30px" }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: s.color, letterSpacing: 3, marginBottom: 18, opacity: 0.65 }}>{s.n}</div>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: `${s.color}12`, border: `1px solid ${s.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>
                  {s.n === "01" ? "⬡" : s.n === "02" ? "◎" : "◈"}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", margin: "0 0 12px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 15, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Features</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, margin: "0 0 16px" }}>
              Everything you need to understand<br />
              <span style={{ background: "linear-gradient(90deg,#34d399,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>your aesthetic self</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {FEATURES.map((f) => (
              <GlowCard key={f.title} color={f.color} style={{ padding: "28px 26px" }}>
                <div style={{ fontSize: 22, color: f.color, marginBottom: 16, fontFamily: "monospace" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.72, margin: 0 }}>{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHETYPES PREVIEW ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel>The five archetypes</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, margin: "0 0 16px" }}>Which one are you?</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 430, margin: "0 auto" }}>
              Every archetype is a real pattern mapped across thousands of profiles.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
            {ARCHETYPES.map((a) => (
              <div key={a.id}
                onMouseEnter={() => setHoveredArchetype(a.id)}
                onMouseLeave={() => setHoveredArchetype(null)}
                style={{ background: hoveredArchetype === a.id ? `${a.color}0e` : "rgba(12,9,26,0.75)", border: `1px solid ${hoveredArchetype === a.id ? a.color + "45" : "rgba(80,70,120,0.18)"}`, borderRadius: 16, padding: "24px 16px", transition: "all 0.3s", transform: hoveredArchetype === a.id ? "translateY(-5px)" : "none" }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{a.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: a.color, margin: "0 0 7px", lineHeight: 1.3 }}>{a.name}</h3>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontStyle: "italic", margin: "0 0 14px" }}>{a.tagline}</p>
                {TRAITS_LABELS.slice(0, 3).map((t) => (
                  <div key={t} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontFamily: "monospace" }}>{t}</span>
                      <span style={{ fontSize: 10, color: a.color, fontFamily: "monospace" }}>{a.traits[t]}</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(80,60,140,0.28)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${a.traits[t]}%`, background: a.color, borderRadius: 2, opacity: 0.65 }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>What people are saying</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, margin: "0 0 16px" }}>Reactions from real users</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, maxWidth: 440, margin: "0 auto" }}>
              People describe it as the first personality test that actually understood them.
            </p>
          </div>
          <div style={{ columns: 3, columnGap: 18 }}>
            {REVIEWS.map((r) => (
              <GlowCard key={r.name} color={r.color} style={{ padding: "24px 22px", marginBottom: 18, breakInside: "avoid", display: "block" }}>
                <Stars n={r.stars} />
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.78, margin: "0 0 20px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <Avatar initials={r.avatar} color={r.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{r.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: "2px 0 0", fontFamily: "monospace" }}>{r.handle}</p>
                  </div>
                  <span style={{ background: `${r.color}12`, border: `1px solid ${r.color}28`, color: r.color, borderRadius: 20, padding: "4px 11px", fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    {r.archetype}
                  </span>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", background: "linear-gradient(135deg,rgba(91,50,232,0.18) 0%,rgba(147,51,234,0.13) 50%,rgba(244,114,182,0.09) 100%)", border: "1px solid rgba(140,100,255,0.22)", borderRadius: 28, padding: "68px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-25%", right: "-8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
          <SectionLabel>Ready?</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.12 }}>
            Your archetype is<br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>waiting to be found</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.72 }}>
            Five archetypes. Six trait dimensions. One radar chart that finally explains you.
          </p>
          <button onClick={onStart}
            style={{ background: "linear-gradient(135deg,#5b32e8,#9333ea)", border: "none", color: "#fff", borderRadius: 14, padding: "18px 52px", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 55px rgba(91,50,232,0.5)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
            Analyze My Taste →
          </button>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 11, marginTop: 18, fontFamily: "monospace", letterSpacing: 1.5 }}>FREE · NO SIGNUP · INSTANT RESULTS</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(130,90,255,0.1)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tasteprofile</span>
          <div style={{ display: "flex", gap: 28 }}>
            {["Letterboxd", "Goodreads", "Backloggd", "ScoraSong"].map((p) => (
              <span key={p} style={{ color: "rgba(255,255,255,0.22)", fontSize: 13, fontFamily: "monospace" }}>{p}</span>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, fontFamily: "monospace" }}>© 2025 tasteprofile · no affiliation with third-party platforms</p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONNECT SCREEN
═══════════════════════════════════════════════ */
function ConnectScreen({ platforms, onUpdate, onAnalyze, onBack }: { platforms: Platform[]; onUpdate: (id: string, val: string) => void; onAnalyze: () => void; onBack: () => void }) {
  const connected = platforms.filter((p) => p.handle.trim().length > 0);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", position: "relative", zIndex: 1 }}>
      <button onClick={onBack} style={{ position: "absolute", top: 80, left: 28, background: "transparent", border: "1px solid rgba(130,90,255,0.22)", borderRadius: 8, color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "8px 18px", fontSize: 13 }}>← Back</button>
      <div style={{ maxWidth: 680, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Step 1 of 1</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, margin: "0 0 12px" }}>Connect your platforms</h2>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 16 }}>Enter your public username. More connections = richer analysis.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30 }}>
          {platforms.map((p) => (
            <div key={p.id} style={{ background: p.handle ? `${p.bg}bb` : "rgba(12,9,26,0.8)", border: `1px solid ${p.handle ? p.color + "50" : "rgba(80,70,120,0.18)"}`, borderRadius: 16, padding: "20px 22px", transition: "all 0.3s", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 26 }}>{p.icon}</span>
                <div>
                  <p style={{ color: p.handle ? p.color : "rgba(255,255,255,0.82)", fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif", margin: 0 }}>{p.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 12, margin: "2px 0 0" }}>{p.desc}</p>
                </div>
                {p.handle && <span style={{ marginLeft: "auto", color: p.color, fontSize: 16 }}>✓</span>}
              </div>
              <input
                placeholder="@username"
                value={p.handle}
                onChange={(e) => onUpdate(p.id, e.target.value)}
                style={{ width: "100%", background: "rgba(0,0,0,0.42)", border: `1px solid ${p.handle ? p.color + "42" : "rgba(100,80,180,0.15)"}`, borderRadius: 9, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
        <button onClick={onAnalyze} disabled={!connected.length}
          style={{ width: "100%", background: connected.length ? "linear-gradient(135deg,#5b32e8,#9333ea)" : "rgba(80,60,140,0.25)", border: "none", color: connected.length ? "#fff" : "rgba(255,255,255,0.28)", borderRadius: 13, padding: "17px", fontSize: 16, fontWeight: 700, cursor: connected.length ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
          {connected.length ? `Analyze ${connected.length} platform${connected.length > 1 ? "s" : ""} →` : "Enter at least one username to continue"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANALYZING SCREEN
═══════════════════════════════════════════════ */
function AnalyzingScreen({ lines, progress }: { lines: string[]; progress: number }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, border: "3px solid rgba(100,80,200,0.15)", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin 0.85s linear infinite", margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", margin: "0 0 8px" }}>Reading your taste</h2>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 15 }}>Synthesizing cross-platform patterns...</p>
        </div>
        <AnalysisLog lines={lines} />
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", fontFamily: "monospace" }}>Analysis progress</span>
            <span style={{ fontSize: 12, color: "#a78bfa", fontFamily: "monospace" }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(80,60,140,0.28)", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#5b32e8,#a78bfa,#f472b6)", borderRadius: 4, transition: "width 0.45s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════════════════ */
function ResultScreen({ archetype, platforms, onReset }: { archetype: Archetype; platforms: Platform[]; onReset: () => void }) {
  const [viewMode, setViewMode] = useState<"separate" | "combined">("separate");
  const radarData = buildRadarData(archetype.traits);
  const connected = platforms.filter((p) => p.handle.trim().length > 0);

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "90px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 44 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tasteprofile</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {connected.map((p) => (
            <span key={p.id} style={{ padding: "4px 12px", border: `1px solid ${p.color}38`, borderRadius: 16, fontSize: 12, color: p.color, fontFamily: "monospace" }}>
              {p.icon} {p.handle}
            </span>
          ))}
        </div>
        <button onClick={onReset} style={{ background: "transparent", border: "1px solid rgba(130,90,255,0.22)", borderRadius: 8, color: "rgba(255,255,255,0.42)", cursor: "pointer", padding: "8px 18px", fontSize: 13 }}>← Start over</button>
      </div>

      {/* Archetype hero card */}
      <GlowCard color={archetype.color} style={{ padding: "44px 52px", marginBottom: 28, display: "flex", gap: 52, alignItems: "center", boxShadow: `0 0 80px ${archetype.color}10` }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Your archetype</p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20 }}>
            <span style={{ fontSize: 52, lineHeight: 1 }}>{archetype.emoji}</span>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: archetype.color, margin: "0 0 6px" }}>{archetype.name}</h2>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 15, fontStyle: "italic", margin: 0 }}>{archetype.tagline}</p>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.8, fontSize: 15, maxWidth: 500, marginBottom: 22 }}>{archetype.description}</p>
          <div>
            <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Resonates with</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {archetype.famous.map((n) => (
                <span key={n} style={{ background: `${archetype.color}10`, border: `1px solid ${archetype.color}32`, color: archetype.color, borderRadius: 20, padding: "5px 16px", fontSize: 13 }}>{n}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ width: 275, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height={275}>
            <RadarChart data={radarData} margin={{ top: 10, right: 22, bottom: 10, left: 22 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="trait" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "monospace" }} />
              <Radar dataKey="value" stroke={archetype.radarColor} fill={archetype.radarFill} strokeWidth={2.5} />
              <Tooltip contentStyle={{ background: "#0a0720", border: `1px solid ${archetype.color}30`, borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlowCard>

      {/* All archetype radars */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "rgba(255,255,255,0.82)", margin: 0 }}>All Archetype Profiles</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {(["separate", "combined"] as const).map((m) => (
              <button key={m} onClick={() => setViewMode(m)}
                style={{ padding: "7px 20px", borderRadius: 9, border: `1px solid ${viewMode === m ? archetype.color : "rgba(100,80,180,0.22)"}`, background: viewMode === m ? `${archetype.color}15` : "transparent", color: viewMode === m ? archetype.color : "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: "monospace", textTransform: "capitalize", transition: "all 0.2s" }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "separate" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {ARCHETYPES.map((a) => <RadarCard key={a.id} archetype={a} showAll={true} selectedId={archetype.id} />)}
          </div>
        ) : (
          <GlowCard color="#a78bfa" style={{ padding: "28px 22px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 14 }}>
              {ARCHETYPES.map((a) => (
                <span key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: a.color, display: "inline-block" }} />
                  <span style={{ color: a.id === archetype.id ? a.color : "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{a.emoji} {a.name}</span>
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={310}>
              <RadarChart
                data={TRAITS_LABELS.map((label) => {
                  const pt: Record<string, string | number> = { trait: label };
                  ARCHETYPES.forEach((a) => { pt[a.id] = a.traits[label]; });
                  return pt;
                })}
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 11, fontFamily: "monospace" }} />
                {ARCHETYPES.map((a) => (
                  <Radar key={a.id} name={a.name} dataKey={a.id} stroke={a.radarColor} fill={a.id === archetype.id ? a.radarFill : "transparent"} strokeWidth={a.id === archetype.id ? 2.5 : 1} strokeOpacity={a.id === archetype.id ? 1 : 0.32} />
                ))}
                <Tooltip contentStyle={{ background: "#0a0720", border: "1px solid rgba(100,80,180,0.22)", borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </GlowCard>
        )}
      </div>

      {/* Trait bars */}
      <GlowCard color="#a78bfa" style={{ padding: "30px 36px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "rgba(255,255,255,0.78)", marginBottom: 22 }}>Trait Score Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 48px" }}>
          {TRAITS_LABELS.map((trait) => (
            <div key={trait}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "monospace" }}>{trait}</span>
                <span style={{ color: archetype.color, fontSize: 13, fontFamily: "monospace", fontWeight: 700 }}>{archetype.traits[trait]}</span>
              </div>
              <div style={{ height: 5, background: "rgba(80,60,140,0.22)", borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${archetype.traits[trait]}%`, background: `linear-gradient(90deg,${archetype.color}65,${archetype.color})`, borderRadius: 4, transition: "width 1.2s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      <div style={{ textAlign: "center", marginTop: 52 }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 16 }}>Want to explore another combination?</p>
        <button onClick={onReset} style={{ background: "linear-gradient(135deg,#5b32e8,#9333ea)", border: "none", color: "#fff", borderRadius: 12, padding: "15px 38px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Analyze Again →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════ */
export default function Page() {
  const [step, setStep] = useState<"landing" | "connect" | "analyzing" | "result">("landing");
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [progress, setProgress] = useState(0);

  const updateHandle = (id: string, val: string) =>
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, handle: val } : p)));

  const runAnalysis = async () => {
    setStep("analyzing");
    setLogLines([]);
    setProgress(0);
    const connected = platforms.filter((p) => p.handle.trim().length > 0);
    const logs = [
      `Connecting to ${connected.map((p) => p.name).join(", ")}...`,
      `Fetching public rating history across ${connected.length} platform${connected.length > 1 ? "s" : ""}...`,
      "Parsing genre distributions and rating variance patterns...",
      "Mapping emotional resonance signatures per medium...",
      "Cross-referencing taste vectors — film ↔ literature ↔ music ↔ games...",
      "Scoring obscurity index and mainstream divergence...",
      "Identifying contradiction traits between platforms...",
      "Running personality lattice classification model...",
      "Calibrating archetype confidence intervals...",
      "Building your visual trait profile...",
      "Analysis complete. Your archetype has been determined.",
    ];
    for (let i = 0; i < logs.length; i++) {
      await sleep(370 + Math.random() * 270);
      setLogLines((prev) => [...prev, logs[i]]);
      setProgress(Math.round(((i + 1) / logs.length) * 100));
    }
    await sleep(500);
    setArchetype(pickArchetype(platforms));
    setStep("result");
  };

  const reset = () => { setPlatforms(PLATFORMS); setStep("landing"); };

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <ParticleBackground />
      {step === "landing" && (
        <>
          <NavBar onStart={() => setStep("connect")} />
          <LandingPage onStart={() => setStep("connect")} />
        </>
      )}
      {step === "connect" && (
        <ConnectScreen platforms={platforms} onUpdate={updateHandle} onAnalyze={runAnalysis} onBack={() => setStep("landing")} />
      )}
      {step === "analyzing" && (
        <AnalyzingScreen lines={logLines} progress={progress} />
      )}
      {step === "result" && archetype && (
        <ResultScreen archetype={archetype} platforms={platforms} onReset={reset} />
      )}
    </div>
  );
}