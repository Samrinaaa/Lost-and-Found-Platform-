import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";
import NotificationBell from "../components/NotificationBell"; 

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard",   link: "/admin" },
  { icon: "👥", label: "Users",       link: "/admin/users" },
  { icon: "📋", label: "Claims",      link: "/admin/claims" },
  { icon: "🔍", label: "Lost Items",  link: "/admin/lost-items" },
  { icon: "📦", label: "Found Items", link: "/admin/found-items" },
];

const AdminDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate  = useNavigate();
  const location  = useLocation();

  const [stats, setStats] = useState({ totalUsers: 0, totalLost: 0, totalFound: 0, totalClaims: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileModal && !e.target.closest("#profile-modal") && !e.target.closest("#user-row-btn")) {
        setShowProfileModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = currentUser?.fullName
    ?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "AD";

  return (
    <div style={styles.shell}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandLogoRow}>
            <div style={styles.brandLogo}>L&F</div>
            <div>
              <div style={styles.brandName}>Lost and Found</div>
              <div style={styles.brandSub}>Admin Panel</div>
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
          <div style={{ position: "relative" }}>
            <button
              id="user-row-btn"
              onClick={() => setShowProfileModal((v) => !v)}
              style={styles.userRowBtn}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={styles.avatar}>{initials}</div>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{currentUser?.fullName}</div>
                <div style={styles.userRole}>Admin</div>
              </div>
              <span style={styles.chevron}>{showProfileModal ? "▲" : "▼"}</span>
            </button>

            {showProfileModal && (
              <div id="profile-modal" style={styles.profileModal}>
                <div style={styles.profileModalHeader}>
                  <div style={styles.profileModalAvatar}>{initials}</div>
                  <div>
                    <div style={styles.profileModalName}>{currentUser?.fullName}</div>
                    <div style={styles.profileModalEmail}>{currentUser?.email || "admin@example.com"}</div>
                    <span style={styles.profileModalBadge}>Admin</span>
                  </div>
                </div>
                <div style={styles.profileModalDivider} />
                <Link to="/admin/profile" style={{ textDecoration: "none" }} onClick={() => setShowProfileModal(false)}>
                  <div style={styles.profileModalItem}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span>👤</span> View Profile
                  </div>
                </Link>
                <Link to="/admin/profile?tab=password" style={{ textDecoration: "none" }} onClick={() => setShowProfileModal(false)}>
                  <div style={styles.profileModalItem}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span>🔒</span> Change Password
                  </div>
                </Link>
                <div style={styles.profileModalDivider} />
                <div
                  style={{ ...styles.profileModalItem, color: "#dc2626" }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span>→</span> Logout
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.borderColor = "#fca5a5";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <span style={{ fontSize: 14 }}>→</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={styles.main}>
        {/* ── Topbar: title + notification bell ── */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Welcome back, {currentUser?.fullName?.split(" ")[0]} 👋</h1>
            <p style={styles.pageSub}>Here's what's happening on your platform today.</p>
          </div>
          {/* Notification bell sits in the top-right of the topbar */}
          <NotificationBell />
        </div>

        {/* Stat cards — compact, 2-col */}
        <div style={styles.statsGrid}>
          <StatCard icon="👥" label="Total Users"  value={stats.totalUsers}  loading={loadingStats} accent="#2563eb" bg="#eff6ff" />
          <StatCard icon="🔍" label="Lost Items"   value={stats.totalLost}   loading={loadingStats} accent="#d97706" bg="#fffbeb" />
          <StatCard icon="📦" label="Found Items"  value={stats.totalFound}  loading={loadingStats} accent="#16a34a" bg="#f0fdf4" />
          <StatCard icon="📋" label="Total Claims" value={stats.totalClaims} loading={loadingStats} accent="#dc2626" bg="#fef2f2" />
        </div>

        {/* Management — 2-col */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Management</span>
          </div>
          <div style={styles.mgmtGrid}>
            <MgmtCard icon="👥" title="Users"       desc="Manage registered accounts"  link="/admin/users"       accent="#dbeafe" />
            <MgmtCard icon="📋" title="Claims"      desc="Review submitted claims"     link="/admin/claims"      accent="#fef3c7" />
            <MgmtCard icon="🔍" title="Lost Items"  desc="Oversee lost reports"        link="/admin/lost-items"  accent="#dcfce7" />
            <MgmtCard icon="📦" title="Found Items" desc="Oversee found reports"       link="/admin/found-items" accent="#f3e8ff" />
          </div>
        </div>
      </main>
    </div>
  );
};

/* ── Sub-components ── */
const StatCard = ({ icon, label, value, loading, bg }) => (
  <div style={styles.statCard}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statVal}>{loading ? "—" : value}</div>
      </div>
      <div style={{ ...styles.statIconBox, background: bg }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
    </div>
  </div>
);

const MgmtCard = ({ icon, title, desc, link, accent }) => (
  <Link to={link} style={{ textDecoration: "none" }}>
    <div
      style={styles.mgmtCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.background  = "#fafafa";
        e.currentTarget.style.borderColor = "#d1d5db";
        e.currentTarget.style.transform   = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background  = "#ffffff";
        e.currentTarget.style.borderColor = "#f0f0f0";
        e.currentTarget.style.transform   = "translateY(0)";
      }}
    >
      <div style={{ ...styles.mgmtIcon, background: accent }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={styles.mgmtTitle}>{title}</div>
        <div style={styles.mgmtDesc}>{desc}</div>
      </div>
      <span style={styles.mgmtArrow}>→</span>
    </div>
  </Link>
);

/* ── Styles ── */
const styles = {
  shell: { display: "flex", minHeight: "100vh", background: "#f5f5f4", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  sidebar: {
    width: 220, flexShrink: 0, background: "#ffffff", borderRight: "1px solid #ebebeb",
    display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto",
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
  brandSub: { fontSize: 11, color: "#6b7280", fontWeight: 500, marginTop: 2 },
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
  sidebarFooter: { padding: "14px 16px", borderTop: "1px solid #ebebeb", display: "flex", flexDirection: "column", gap: 8 },
  userRowBtn: {
    display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 8px",
    background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left",
  },
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { fontSize: 11, color: "#9ca3af" },
  chevron: { fontSize: 9, color: "#9ca3af", flexShrink: 0 },
  profileModal: {
    position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0,
    background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden", padding: "6px 0",
  },
  profileModalHeader: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 10px" },
  profileModalAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  profileModalName: { fontSize: 13, fontWeight: 600, color: "#111827" },
  profileModalEmail: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  profileModalBadge: {
    display: "inline-block", marginTop: 4, padding: "2px 7px",
    background: "#eff6ff", color: "#1d4ed8", fontSize: 10, fontWeight: 600, borderRadius: 999,
  },
  profileModalDivider: { height: 1, background: "#f3f4f6", margin: "4px 0" },
  profileModalItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
    fontSize: 12, color: "#374151", cursor: "pointer",
  },
  logoutBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
    padding: "7px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8,
    cursor: "pointer", color: "#6b7280", fontSize: 12, fontWeight: 500,
  },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },

  // ← topbar is now a flex row so the bell floats to the right
  topbar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  pageTitle: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4, letterSpacing: "-0.01em" },
  pageSub: { fontSize: 13, color: "#6b7280" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 },
  statCard: { background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 12, padding: "16px 18px" },
  statIconBox: { width: 46, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statLabel: { fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 6 },
  statVal: { fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1 },
  panel: { background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 12, padding: "18px 20px" },
  panelHeader: { marginBottom: 14 },
  panelTitle: { fontSize: 14, fontWeight: 600, color: "#111827" },
  mgmtGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 },
  mgmtCard: {
    display: "flex", alignItems: "center", gap: 12, padding: "14px",
    border: "1px solid #f0f0f0", borderRadius: 10, background: "#ffffff", cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s, transform 0.15s",
  },
  mgmtIcon: { width: 38, height: 38, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  mgmtTitle: { fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 },
  mgmtDesc: { fontSize: 11, color: "#9ca3af", lineHeight: 1.4 },
  mgmtArrow: { marginLeft: "auto", fontSize: 14, color: "#d1d5db", flexShrink: 0 },
};

export default AdminDashboard;