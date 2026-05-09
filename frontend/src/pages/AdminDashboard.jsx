import React from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.container}>

      {/* Background orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Logout
          </button>
        </div>

        {/* Welcome */}
        <div style={styles.welcome}>
          <h1 style={styles.welcomeTitle}>
            Welcome, {currentUser?.fullName} 
          </h1>
          <p style={styles.welcomeText}>
            Manage users, items, and claims efficiently.
          </p>
        </div>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <h3 style={styles.profileTitle}>Admin Profile</h3>
          <div style={styles.profileGrid}>
            <ProfileRow label="Name"  value={currentUser?.fullName} />
            <ProfileRow label="Email" value={currentUser?.email} />
            <ProfileRow label="Phone" value={currentUser?.phone} />
            <ProfileRow label="Role"  value={currentUser?.role} />
          </div>
        </div>

        {/* Management Cards */}
        <div style={styles.grid}>
          <Card icon="👥" title="Manage Users"       desc="View and manage registered users."      link="/admin/users" />
          <Card icon="📋" title="Manage Claims"      desc="Review and process submitted claims."   link="/admin/claims" />
          <Card icon="🔍" title="Manage Lost Items"  desc="Oversee and manage lost item reports."  link="/admin/lost-items" />
          <Card icon="📦" title="Manage Found Items" desc="Oversee and manage found item reports." link="/admin/found-items" />
        </div>

      </div>
    </div>
  );
};

/* ─── Sub-components ────────────────────────── */

const ProfileRow = ({ label, value }) => (
  <div style={styles.profileRow}>
    <span style={styles.profileLabel}>{label}</span>
    <span style={styles.profileValue}>{value || "—"}</span>
  </div>
);

const Card = ({ icon, title, desc, link }) => (
  <div
    style={styles.card}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 20px 50px rgba(45,106,100,0.15), 0 8px 24px rgba(0,0,0,0.06)";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div style={styles.cardIcon}>{icon}</div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardText}>{desc}</p>
    <Link to={link}>
      <button
        style={styles.cardButton}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(45,106,100,0.35)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.2)";
        }}
      >
        Open
      </button>
    </Link>
  </div>
);

/* ─── Styles ────────────────────────────────── */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#faf9f7",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
  },

  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.5,
    pointerEvents: "none",
  },
  orb1: { width: 400, height: 400, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -100, right: -100 },
  orb2: { width: 300, height: 300, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -80, left: -60 },
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "40%", left: -80 },

  content: {
    position: "relative",
    zIndex: 10,
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  brandName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#2c3e3a",
    letterSpacing: "-0.01em",
  },

  logoutButton: {
    padding: "9px 20px",
    border: "1.5px solid rgba(220,38,38,0.4)",
    borderRadius: 100,
    background: "transparent",
    color: "#dc2626",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },

  welcome: {
    marginBottom: "28px",
  },

  welcomeTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "32px",
    fontWeight: 700,
    color: "#2c3e3a",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },

  welcomeText: {
    fontSize: "15px",
    color: "#5a6e6a",
  },

  profileCard: {
    background: "#ffffff",
    padding: "24px 28px",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid rgba(45,106,100,0.08)",
    marginBottom: "28px",
    maxWidth: "420px",
  },

  profileTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "17px",
    fontWeight: 700,
    color: "#2c3e3a",
    marginBottom: "16px",
    letterSpacing: "-0.01em",
  },

  profileGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  profileRow: {
    display: "flex",
    gap: 12,
    fontSize: 14,
  },

  profileLabel: {
    fontWeight: 600,
    color: "#2c3e3a",
    minWidth: 50,
  },

  profileValue: {
    color: "#5a6e6a",
    textTransform: "capitalize",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "28px 26px",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid rgba(45,106,100,0.08)",
    transition: "box-shadow 0.25s ease, transform 0.25s ease",
    cursor: "default",
  },

  cardIcon: {
    fontSize: 28,
    marginBottom: 14,
  },

  cardTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "17px",
    fontWeight: 700,
    color: "#2c3e3a",
    marginBottom: "8px",
    letterSpacing: "-0.01em",
  },

  cardText: {
    fontSize: "14px",
    color: "#5a6e6a",
    marginBottom: "20px",
    lineHeight: 1.6,
  },

  cardButton: {
    padding: "10px 22px",
    border: "none",
    borderRadius: 100,
    background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(45,106,100,0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default AdminDashboard;