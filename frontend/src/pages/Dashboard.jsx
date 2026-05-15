import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard",    link: "/dashboard" },
  { icon: "🔍", label: "Lost Items",   link: "/lost-items" },
  { icon: "📦", label: "Found Items",  link: "/found-items" },
  { icon: "📋", label: "My Claims",    link: "/claim-status" },
];

const Dashboard = () => {
  const user     = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.fullName
    ?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div style={styles.shell}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandLogoRow}>
            <div style={styles.brandLogo}>L&F</div>
            <div>
              <div style={styles.brandName}>Lost and Found</div>
              <div style={styles.brandSub}>User Portal</div>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <span style={styles.navSection}>Menu</span>
          {NAV_ITEMS.map(({ icon, label, link }) => {
            const active = location.pathname === link;
            return (
              <Link key={link} to={link} style={{ textDecoration: "none" }}>
                <div
                  style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f0f4f3"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={styles.navIcon}>{icon}</span>
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.fullName}</div>
              <div style={styles.userRole}>User</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = "#fef2f2";
              e.currentTarget.style.borderColor  = "#fca5a5";
              e.currentTarget.style.color        = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = "#f9fafb";
              e.currentTarget.style.borderColor  = "#e5e7eb";
              e.currentTarget.style.color        = "#6b7280";
            }}
          >
            <span style={{ fontSize: 14 }}>→</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <h1 style={styles.pageTitle}>Welcome back, {user?.fullName?.split(" ")[0]} 👋</h1>
          <p style={styles.pageSub}>Manage your lost, found items and claims.</p>
        </div>

        {/* Action cards */}
        <div style={styles.cardsGrid}>
          <ActionCard
            icon="🔍"
            title="Lost Items"
            desc="Report something you've lost or browse all reported lost items."
            accent="#eff6ff"
            iconBg="#dbeafe"
            actions={[
              { label: "Report Lost",     link: "/report-lost",  primary: true },
              { label: "View Lost Items", link: "/lost-items",   primary: false },
            ]}
          />
          <ActionCard
            icon="📦"
            title="Found Items"
            desc="Report something you've found or browse all found items."
            accent="#f0fdf4"
            iconBg="#dcfce7"
            actions={[
              { label: "Report Found",     link: "/report-found", primary: true },
              { label: "View Found Items", link: "/found-items",  primary: false },
            ]}
          />
          <ActionCard
            icon="📋"
            title="Claims"
            desc="Submit a claim for a found item or track your existing claims."
            accent="#fefce8"
            iconBg="#fef9c3"
            actions={[
              { label: "Submit Claim",  link: "/claim",        primary: true },
              { label: "Track Status",  link: "/claim-status", primary: false },
            ]}
          />
        </div>

        {/* Quick links row */}
        <div style={styles.quickRow}>
          <div style={styles.quickTitle}>Quick Actions</div>
          <div style={styles.quickLinks}>
            <QuickLink icon="➕" label="Report Lost Item"  link="/report-lost" />
            <QuickLink icon="📬" label="Report Found Item" link="/report-found" />
            <QuickLink icon="📝" label="Submit a Claim"    link="/claim" />
            <QuickLink icon="📊" label="Track My Claims"   link="/claim-status" />
          </div>
        </div>
      </main>
    </div>
  );
};

/* ── ActionCard ── */
const ActionCard = ({ icon, title, desc, accent, iconBg, actions }) => (
  <div
    style={styles.card}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform  = "translateY(-2px)";
      e.currentTarget.style.boxShadow  = "0 8px 24px rgba(0,0,0,0.08)";
      e.currentTarget.style.borderColor = "#e5e7eb";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform  = "translateY(0)";
      e.currentTarget.style.boxShadow  = "none";
      e.currentTarget.style.borderColor = "#f0f0f0";
    }}
  >
    <div style={{ ...styles.cardIconBox, background: iconBg }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
    <div style={styles.cardTitle}>{title}</div>
    <div style={styles.cardDesc}>{desc}</div>
    <div style={styles.cardActions}>
      {actions.map(({ label, link, primary }) => (
        <Link key={link} to={link} style={{ textDecoration: "none", flex: 1 }}>
          <button
            style={{ ...styles.btn, ...(primary ? styles.btnPrimary : styles.btnSecondary) }}
            onMouseEnter={(e) => {
              if (primary) {
                e.currentTarget.style.background = "#1e40af";
              } else {
                e.currentTarget.style.background  = "#f1f5f9";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }
            }}
            onMouseLeave={(e) => {
              if (primary) {
                e.currentTarget.style.background = "#1d4ed8";
              } else {
                e.currentTarget.style.background  = "#f9fafb";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }
            }}
          >
            {label}
          </button>
        </Link>
      ))}
    </div>
  </div>
);

/* ── QuickLink ── */
const QuickLink = ({ icon, label, link }) => (
  <Link to={link} style={{ textDecoration: "none" }}>
    <div
      style={styles.quickLink}
      onMouseEnter={(e) => {
        e.currentTarget.style.background  = "#eff6ff";
        e.currentTarget.style.borderColor = "#bfdbfe";
        e.currentTarget.style.color       = "#1d4ed8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = "#ffffff";
        e.currentTarget.style.borderColor = "#f0f0f0";
        e.currentTarget.style.color       = "#374151";
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={styles.quickLinkLabel}>{label}</span>
      <span style={styles.quickLinkArrow}>→</span>
    </div>
  </Link>
);

/* ── Styles ── */
const styles = {
  shell: {
    display: "flex", minHeight: "100vh", background: "#f5f5f4",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* Sidebar */
  sidebar: {
    width: 220, flexShrink: 0, background: "#ffffff",
    borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh", overflowY: "auto",
  },
  brand: { padding: "20px 16px 18px", borderBottom: "1px solid #ebebeb" },
  brandLogoRow: { display: "flex", alignItems: "center", gap: 10 },
  brandLogo: {
    width: 36, height: 36, borderRadius: 9,
    background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  brandName: { fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.2 },
  brandSub:  { fontSize: 11, color: "#6b7280", fontWeight: 500, marginTop: 2 },
  nav: { padding: "12px 0", flex: 1 },
  navSection: {
    display: "block", padding: "8px 18px 4px", fontSize: 10, fontWeight: 600,
    color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase",
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 9, padding: "8px 18px",
    fontSize: 13, color: "#6b7280", borderLeft: "2px solid transparent", cursor: "pointer",
  },
  navItemActive: { color: "#111827", fontWeight: 500, borderLeftColor: "#1d4ed8", background: "#eff6ff" },
  navIcon: { fontSize: 15, lineHeight: 1 },
  sidebarFooter: {
    padding: "14px 16px", borderTop: "1px solid #ebebeb",
    display: "flex", flexDirection: "column", gap: 8,
  },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: "4px 0" },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { fontSize: 11, color: "#9ca3af" },
  logoutBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    width: "100%", padding: "7px 12px", background: "#f9fafb",
    border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer",
    color: "#6b7280", fontSize: 12, fontWeight: 500,
    transition: "background 0.15s, border-color 0.15s, color 0.15s",
  },

  /* Main */
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { marginBottom: 24 },
  pageTitle: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4, letterSpacing: "-0.01em" },
  pageSub: { fontSize: 13, color: "#6b7280" },

  /* Action cards */
  cardsGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20,
  },
  card: {
    background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 14,
    padding: "20px 18px", display: "flex", flexDirection: "column", gap: 0,
    transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
  },
  cardIconBox: {
    width: 44, height: 44, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 14, flexShrink: 0,
  },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 6 },
  cardDesc:  { fontSize: 12, color: "#9ca3af", lineHeight: 1.5, marginBottom: 18, flex: 1 },
  cardActions: { display: "flex", gap: 8 },
  btn: {
    width: "100%", padding: "8px 10px", border: "none", borderRadius: 8,
    fontSize: 12, fontWeight: 600, cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  },
  btnPrimary: {
    background: "#1d4ed8", color: "#ffffff", border: "none",
  },
  btnSecondary: {
    background: "#f9fafb", color: "#374151",
    border: "1px solid #e5e7eb",
  },

  /* Quick links */
  quickRow: {
    background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 14, padding: "18px 20px",
  },
  quickTitle: { fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 },
  quickLinks: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  quickLink: {
    display: "flex", alignItems: "center", gap: 8, padding: "11px 14px",
    border: "1px solid #f0f0f0", borderRadius: 10, background: "#ffffff",
    cursor: "pointer", transition: "background 0.15s, border-color 0.15s, color 0.15s",
    color: "#374151",
  },
  quickLinkLabel: { fontSize: 12, fontWeight: 500, flex: 1 },
  quickLinkArrow: { fontSize: 12, color: "#d1d5db" },
};

export default Dashboard;