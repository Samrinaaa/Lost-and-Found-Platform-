import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard",   link: "/admin" },
  { icon: "👥", label: "Users",       link: "/admin/users" },
  { icon: "📋", label: "Claims",      link: "/admin/claims" },
  { icon: "🔍", label: "Lost Items",  link: "/admin/lost-items" },
  { icon: "📦", label: "Found Items", link: "/admin/found-items" },
];

const AdminProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") === "password" ? "password" : "info";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Change password state
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null); // { type: "success"|"error", text }

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

  const handlePwChange = async () => {
    setPwMsg(null);
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      return setPwMsg({ type: "error", text: "All fields are required." });
    }
    if (pwForm.newPassword.length < 6) {
      return setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwMsg({ type: "error", text: "New passwords do not match." });
    }
    setPwLoading(true);
    try {
      await API.put("/admin/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to change password.";
      setPwMsg({ type: "error", text: msg });
    } finally {
      setPwLoading(false);
    }
  };

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
                <Link to="/admin/profile?tab=password" style={{ textDecoration: "none" }} onClick={() => { setShowProfileModal(false); setActiveTab("password"); }}>
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
        <div style={styles.topbar}>
          <h1 style={styles.pageTitle}>My Profile</h1>
          <p style={styles.pageSub}>Manage your account information and security.</p>
        </div>

        <div style={styles.card}>
          {/* Avatar header */}
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatarLarge}>{initials}</div>
            <div>
              <div style={styles.profileHeaderName}>{currentUser?.fullName}</div>
              <div style={styles.profileHeaderEmail}>{currentUser?.email || "admin@example.com"}</div>
              <span style={styles.profileHeaderBadge}>Admin</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabBar}>
            <button
              style={{ ...styles.tab, ...(activeTab === "info" ? styles.tabActive : {}) }}
              onClick={() => setActiveTab("info")}
            >
              👤 Admin Info
            </button>
            <button
              style={{ ...styles.tab, ...(activeTab === "password" ? styles.tabActive : {}) }}
              onClick={() => setActiveTab("password")}
            >
              🔒 Change Password
            </button>
          </div>

          {/* ── Tab: Info ── */}
          {activeTab === "info" && (
            <div style={styles.tabContent}>
              <div style={styles.infoGrid}>
                <InfoField label="Full Name"   value={currentUser?.fullName} icon="👤" />
                <InfoField label="Email"       value={currentUser?.email}    icon="✉️" />
                <InfoField label="Role"        value="Administrator"         icon="🛡️" />
                <InfoField label="Account ID"  value={currentUser?._id || currentUser?.id || "—"} icon="🪪" mono />
              </div>
              <div style={styles.infoNote}>
                <span style={{ fontSize: 13 }}>ℹ️</span>
                <span>To update your name or email, please contact the system owner.</span>
              </div>
            </div>
          )}

          {/* ── Tab: Change Password ── */}
          {activeTab === "password" && (
            <div style={styles.tabContent}>
              {pwMsg && (
                <div style={{ ...styles.alert, ...(pwMsg.type === "success" ? styles.alertSuccess : styles.alertError) }}>
                  {pwMsg.type === "success" ? "✅" : "⚠️"} {pwMsg.text}
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  style={styles.input}
                  onFocus={(e) => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px #dbeafe"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    style={styles.input}
                    onFocus={(e) => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px #dbeafe"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    style={styles.input}
                    onFocus={(e) => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px #dbeafe"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password strength hint */}
              {pwForm.newPassword && (
                <PasswordStrength password={pwForm.newPassword} />
              )}

              <div style={{ marginTop: 24 }}>
                <button
                  onClick={handlePwChange}
                  disabled={pwLoading}
                  style={{ ...styles.submitBtn, ...(pwLoading ? styles.submitBtnDisabled : {}) }}
                  onMouseEnter={(e) => { if (!pwLoading) e.currentTarget.style.background = "#1e40af"; }}
                  onMouseLeave={(e) => { if (!pwLoading) e.currentTarget.style.background = "#1d4ed8"; }}
                >
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* ── InfoField ── */
const InfoField = ({ label, value, icon, mono }) => (
  <div style={styles.infoField}>
    <div style={styles.infoFieldLabel}>
      <span>{icon}</span> {label}
    </div>
    <div style={{ ...styles.infoFieldValue, ...(mono ? styles.infoFieldMono : {}) }}>
      {value || "—"}
    </div>
  </div>
);

/* ── PasswordStrength ── */
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Contains a number",     pass: /\d/.test(password) },
    { label: "Contains uppercase",    pass: /[A-Z]/.test(password) },
    { label: "Contains a symbol",     pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][score];
  const strengthColor = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][score];

  return (
    <div style={styles.strengthBox}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={styles.strengthText}>Password strength</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: strengthColor }}>{strengthLabel}</span>
      </div>
      <div style={styles.strengthTrack}>
        <div style={{ ...styles.strengthFill, width: `${(score / 4) * 100}%`, background: strengthColor }} />
      </div>
      <div style={styles.checkList}>
        {checks.map((c) => (
          <div key={c.label} style={{ ...styles.checkItem, color: c.pass ? "#16a34a" : "#9ca3af" }}>
            <span>{c.pass ? "✓" : "○"}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Styles ── */
const styles = {
  shell: { display: "flex", minHeight: "100vh", background: "#f5f5f4", fontFamily: "'Inter', 'Segoe UI', sans-serif" },

  /* Sidebar — identical to dashboard */
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

  /* Main */
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { marginBottom: 22 },
  pageTitle: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4, letterSpacing: "-0.01em" },
  pageSub: { fontSize: 13, color: "#6b7280" },

  /* Card */
  card: { background: "#ffffff", border: "1px solid #f0f0f0", borderRadius: 14, overflow: "hidden" },

  /* Profile header inside card */
  profileHeader: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "24px 28px", borderBottom: "1px solid #f3f4f6",
    background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
  },
  profileAvatarLarge: {
    width: 60, height: 60, borderRadius: "50%",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, fontWeight: 700, flexShrink: 0,
    boxShadow: "0 4px 12px rgba(29,78,216,0.25)",
  },
  profileHeaderName: { fontSize: 17, fontWeight: 700, color: "#111827" },
  profileHeaderEmail: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  profileHeaderBadge: {
    display: "inline-block", marginTop: 6, padding: "3px 10px",
    background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 600, borderRadius: 999,
  },

  /* Tabs */
  tabBar: {
    display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 28px", gap: 4,
  },
  tab: {
    padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#6b7280",
    background: "transparent", border: "none", borderBottom: "2px solid transparent",
    cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
    marginBottom: "-1px",
  },
  tabActive: { color: "#1d4ed8", borderBottomColor: "#1d4ed8", fontWeight: 600 },

  tabContent: { padding: "24px 28px" },

  /* Info tab */
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 20 },
  infoField: { background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 10, padding: "14px 16px" },
  infoFieldLabel: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, fontWeight: 600, color: "#9ca3af",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
  },
  infoFieldValue: { fontSize: 14, fontWeight: 500, color: "#111827" },
  infoFieldMono: { fontSize: 12, fontFamily: "monospace", color: "#6b7280", wordBreak: "break-all" },
  infoNote: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 8,
    padding: "10px 14px", fontSize: 12, color: "#92400e",
  },

  /* Password tab */
  formGroup: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { fontSize: 12, fontWeight: 600, color: "#374151" },
  input: {
    padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8,
    fontSize: 13, color: "#111827", background: "#ffffff",
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%", boxSizing: "border-box",
  },

  /* Password strength */
  strengthBox: { background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 10, padding: "14px 16px", marginTop: 4 },
  strengthText: { fontSize: 12, fontWeight: 500, color: "#6b7280" },
  strengthTrack: { height: 4, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", marginBottom: 10 },
  strengthFill: { height: "100%", borderRadius: 99, transition: "width 0.3s, background 0.3s" },
  checkList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" },
  checkItem: { fontSize: 11, display: "flex", alignItems: "center", gap: 5 },

  /* Alert */
  alert: { padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 18 },
  alertSuccess: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" },
  alertError:   { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" },

  /* Submit */
  submitBtn: {
    padding: "10px 24px", background: "#1d4ed8", color: "#ffffff",
    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "background 0.15s",
  },
  submitBtnDisabled: { background: "#93c5fd", cursor: "not-allowed" },
};

export default AdminProfile;