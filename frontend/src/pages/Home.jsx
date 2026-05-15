import React from "react";
import { useNavigate, Link } from "react-router-dom";
import heroImage from "../assets/image.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* ── HERO ─────────────────────────────── */}
      <section style={styles.hero}>

        {/* Background image */}
        <img src={heroImage} alt="" style={styles.heroBg} aria-hidden="true" />

        {/* Light overlay */}
        <div style={styles.heroOverlay} />

        {/* Soft gradient shapes */}
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />

        {/* Floating icons */}
        <div style={{ ...styles.floatingIcon, top: "18%", left: "12%", animationDelay: "0s" }}>
          <KeyIcon />
        </div>
        <div style={{ ...styles.floatingIcon, top: "25%", right: "15%", animationDelay: "1s" }}>
          <WalletIcon />
        </div>
        <div style={{ ...styles.floatingIcon, bottom: "28%", left: "18%", animationDelay: "2s" }}>
          <PhoneIcon />
        </div>
        <div style={{ ...styles.floatingIcon, bottom: "22%", right: "12%", animationDelay: "0.5s" }}>
          <BagIcon />
        </div>

        {/* Content */}
        <div style={styles.heroContent}>
          
          <h1 style={styles.heroTitle}>
            Lost and Found Platform<br />
          </h1>

          <p style={styles.heroTagline}>
            Reunite people with lost belongings
          </p>

          <p style={styles.heroSub}>
            Report lost items, discover found ones, and securely reclaim
            what matters to you.
          </p>

          <div style={styles.heroBtns}>
            <button onClick={() => navigate("/login")} style={styles.btnPrimary}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,100,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.25)";
              }}
            >
              Login
            </button>
            <button onClick={() => navigate("/register")} style={styles.btnOutline}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = "rgba(45,106,100,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Create Account
            </button>
          </div>

        </div>
      </section>

      {/* ── COMBINED BROWSE & PROCESS SECTION ─── */}
      <section style={styles.combinedSection}>
        <div style={styles.combinedWrapper}>

          {/* Left: Browse */}
          <div style={styles.browseColumn}>
            <p style={styles.eyebrow}>Browse</p>
            <h2 style={styles.columnTitle}>Explore the board</h2>

            <div style={styles.browseCards}>
              <ExploreCard
                icon={<SearchIcon />}
                iconBg="linear-gradient(135deg, #e8f4f3 0%, #d4e8e6 100%)"
                iconColor="#2d6a64"
                title="Lost Items"
                desc="Browse reports of missing belongings submitted by users across campus."
                to="/lost-items"
                onClick={() => navigate("/lost-items")}
              />

              <ExploreCard
                icon={<PackageIcon />}
                iconBg="linear-gradient(135deg, #eef3e8 0%, #dde8d4 100%)"
                iconColor="#5a7d52"
                title="Found Items"
                desc="Explore items discovered and reported by the community — yours may be here."
                to="/found-items"
                onClick={() => navigate("/found-items")}
              />
            </div>
          </div>

          {/* Vertical divider */}
          <div style={styles.verticalDivider} />

          {/* Right: Process */}
          <div style={styles.processColumn}>
            <p style={styles.eyebrow}>Process</p>
            <h2 style={styles.columnTitle}>How it works</h2>

            <div style={styles.stepsVertical}>
              <StepCard number="1" icon={<PinIcon />} title="Report Item"
                desc="Submit details and a photo of your lost or found item" isLast={false} />
              <StepCard number="2" icon={<SearchIcon />} title="Find Matches"
                desc="We match your report against existing entries automatically" isLast={false} />
              <StepCard number="3" icon={<CheckIcon />} title="Verify & Claim"
                desc="Confirm ownership securely and arrange the handoff" isLast={true} />
            </div>
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────── */}
      <section style={styles.cta}>
        <div style={styles.ctaInner}>
          <div style={styles.ctaIconRow}>
            <span style={styles.ctaIcon}><KeyIcon /></span>
            <span style={styles.ctaIcon}><WalletIcon /></span>
            <span style={styles.ctaIcon}><PhoneIcon /></span>
          </div>
          <h2 style={styles.ctaTitle}>Missing something?</h2>
          <p style={styles.ctaSub}>
            Join hundreds of users who have already found their lost items.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={styles.btnCtaPrimary}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,100,0.45)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.25)";
            }}
          >
            Get Started — It&apos;s Free
          </button>
        </div>
      </section>

    </div>
  );
};

/* ─── Icons ─────────────────────────────────── */

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29 7 12 12 20.71 7"/>
    <line x1="12" x2="12" y1="22" y2="12"/>
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
    <path d="M12 18h.01"/>
  </svg>
);

const BagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

/* ─── Sub-components ────────────────────────── */

const ExploreCard = ({ icon, iconBg, iconColor, title, desc, onClick, to }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.exploreCard,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        borderColor: hovered ? "rgba(45,106,100,0.35)" : "rgba(45,106,100,0.12)",
        boxShadow: hovered
          ? "0 20px 40px rgba(45,106,100,0.15), 0 8px 16px rgba(0,0,0,0.06)"
          : "0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.ecIcon, background: iconBg, color: iconColor }}>{icon}</div>
      <p style={styles.ecTitle}>{title}</p>
      <p style={styles.ecDesc}>{desc}</p>
      <Link
        to={to}
        onClick={e => e.stopPropagation()}
        style={{
          ...styles.ecLink,
          color: hovered ? "#1f524d" : "#2d6a64",
          textDecoration: "none",
        }}
      >
        View all →
      </Link>
    </div>
  );
};

const StepCard = ({ number, icon, title, desc, isLast }) => (
  <div style={styles.stepCard}>
    <div style={styles.stepLeft}>
      <div style={styles.stepNum}>{number}</div>
      {!isLast && <div style={styles.stepLine} />}
    </div>
    <div style={styles.stepRight}>
      <span style={styles.stepIcon}>{icon}</span>
      <p style={styles.stepTitle}>{title}</p>
      <p style={styles.stepDesc}>{desc}</p>
    </div>
  </div>
);

/* ─── Keyframes ─────────────────────────────── */
const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = floatKeyframes;
  document.head.appendChild(styleSheet);
}

/* ─── Styles ────────────────────────────────── */

const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: "#faf9f7",
    color: "#2c3e3a",
    minHeight: "100vh",
  },

  hero: {
    position: "relative",
    minHeight: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
    padding: "90px 24px 70px",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.05,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(250,249,247,0.92) 0%, rgba(245,244,241,0.97) 100%)",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(70px)",
    opacity: 0.5,
    pointerEvents: "none",
  },
  orb1: { width: 450, height: 450, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -180, right: -120 },
  orb2: { width: 350, height: 350, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -120, left: -80 },

  floatingIcon: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 8px 32px rgba(45,106,100,0.12), 0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2d6a64",
    animation: "float 4s ease-in-out infinite",
    zIndex: 1,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.6)",
  },

  heroContent: { position: "relative", zIndex: 2, maxWidth: 580, width: "90%" },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 100,
    background: "rgba(45,106,100,0.08)",
    border: "1px solid rgba(45,106,100,0.15)",
    fontSize: 12,
    fontWeight: 500,
    color: "#2d6a64",
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#2d6a64",
  },

  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#2c3e3a",
    margin: "0 0 14px",
    letterSpacing: "-0.02em",
  },
  heroTagline: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    fontStyle: "italic",
    color: "#4a5f5b",
    margin: "0 0 14px",
    fontWeight: 400,
  },
  heroSub: {
    fontSize: 15,
    color: "#5a6e6a",
    lineHeight: 1.7,
    maxWidth: 400,
    margin: "0 auto 28px",
  },
  heroBtns: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 34px",
    borderRadius: 100,
    border: "none",
    background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(45,106,100,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  btnOutline: {
    padding: "14px 34px",
    borderRadius: 100,
    border: "1.5px solid #2d6a64",
    background: "transparent",
    color: "#2d6a64",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s ease, background 0.2s ease",
  },

  combinedSection: {
    padding: "70px 24px 80px",
    background: "#f5f4f1",
    borderTop: "1px solid rgba(45,106,100,0.08)",
  },
  combinedWrapper: {
    display: "flex",
    gap: 50,
    maxWidth: 1050,
    margin: "0 auto",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  verticalDivider: {
    width: 1,
    alignSelf: "stretch",
    background: "linear-gradient(180deg, transparent, rgba(45,106,100,0.15), transparent)",
  },

  browseColumn: {
    flex: "1 1 460px",
    minWidth: 280,
  },
  columnTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(1.3rem, 2.2vw, 1.65rem)",
    fontWeight: 700,
    color: "#2c3e3a",
    margin: "0 0 24px",
    letterSpacing: "-0.01em",
  },
  browseCards: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
  },
  exploreCard: {
    flex: "1 1 190px",
    minWidth: 190,
    maxWidth: 260,
    padding: "26px 22px",
    borderRadius: 16,
    border: "1px solid rgba(45,106,100,0.12)",
    background: "#ffffff",
    cursor: "pointer",
    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  },
  ecIcon: {
    width: 48, height: 48, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  ecTitle: { fontSize: 16, fontWeight: 600, color: "#2c3e3a", margin: "0 0 8px" },
  ecDesc: { fontSize: 13, color: "#5a6e6a", lineHeight: 1.65, margin: 0 },
  ecLink: {
    display: "inline-block",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 16,
    transition: "color 0.2s ease",
  },

  processColumn: {
    flex: "1 1 380px",
    minWidth: 260,
  },
  stepsVertical: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  stepCard: {
    display: "flex",
    gap: 18,
    paddingBottom: 28,
  },
  stepLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepNum: {
    width: 40, height: 40, borderRadius: "50%",
    border: "2px solid rgba(45,106,100,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#2d6a64",
    background: "linear-gradient(135deg, rgba(45,106,100,0.06) 0%, rgba(45,106,100,0.02) 100%)",
    flexShrink: 0,
  },
  stepLine: {
    width: 2,
    flex: 1,
    background: "linear-gradient(180deg, rgba(45,106,100,0.2), rgba(45,106,100,0.05))",
    marginTop: 10,
    borderRadius: 1,
  },
  stepRight: {
    paddingTop: 6,
  },
  stepIcon: {
    fontSize: 18,
    display: "flex",
    marginBottom: 10,
    color: "#2d6a64",
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(45,106,100,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: { fontSize: 15, fontWeight: 600, color: "#2c3e3a", margin: "0 0 6px" },
  stepDesc: { fontSize: 13, color: "#5a6e6a", lineHeight: 1.6, margin: 0 },

  eyebrow: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#2d6a64", margin: "0 0 8px",
  },

  cta: {
    padding: "80px 24px",
    background: "linear-gradient(180deg, #e8f0ef 0%, #dce6e5 100%)",
    textAlign: "center",
    borderTop: "1px solid rgba(45,106,100,0.1)",
  },
  ctaInner: {
    maxWidth: 480,
    margin: "0 auto",
  },
  ctaIconRow: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "rgba(255,255,255,0.8)",
    boxShadow: "0 4px 16px rgba(45,106,100,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2d6a64",
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: 700,
    color: "#2c3e3a",
    margin: "0 0 12px",
  },
  ctaSub: {
    fontSize: 15,
    color: "#5a6e6a",
    margin: "0 0 28px",
    lineHeight: 1.6,
  },
  btnCtaPrimary: {
    padding: "16px 40px",
    borderRadius: 100,
    border: "none",
    background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(45,106,100,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default Home;