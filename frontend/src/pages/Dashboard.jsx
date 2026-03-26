import React from "react";
import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={containerStyle}>

      {/* Background */}
      <div style={bgStyle}></div>

      {/* Overlay */}
      <div style={overlayStyle}></div>

      {/* Content */}
      <div style={contentWrapper}>

        {/* Header */}
        <div style={header}>
          <h1 style={title}>User Dashboard</h1>

          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        </div>

        {/* Welcome */}
        <div style={welcome}>
          <h2 style={welcomeTitle}>
            Welcome, {user?.fullName}
          </h2>

          <p style={welcomeText}>
            Manage your lost, found items and claims.
          </p>
        </div>

        {/* Cards */}
        <div style={grid}>

          {/* LOST */}
          <DashboardCard
            title="Lost Item Management"
            desc="Report or browse lost items."
            primaryLink="/report-lost"
            secondaryLink="/lost-items"
            primaryText="Report Lost"
            secondaryText="View Lost"
          />

          {/* FOUND */}
          <DashboardCard
            title="Found Item Management"
            desc="Report or browse found items."
            primaryLink="/report-found"
            secondaryLink="/found-items"
            primaryText="Report Found"
            secondaryText="View Found"
          />

          {/* CLAIM */}
          <DashboardCard
            title="Claim Management"
            desc="Submit and track your claims."
            primaryLink="/claim"
            secondaryLink="/claim-status"
            primaryText="Submit Claim"
            secondaryText="Track Status"
          />

        </div>

      </div>
    </div>
  );
};

/* CARD COMPONENT */
const DashboardCard = ({
  title,
  desc,
  primaryLink,
  secondaryLink,
  primaryText,
  secondaryText
}) => (
  <div style={card}>
    <h3 style={cardTitle}>{title}</h3>
    <p style={cardText}>{desc}</p>

    <div style={buttonRow}>
      <Link to={primaryLink}>
        <button style={primaryButton}>{primaryText}</button>
      </Link>

      <Link to={secondaryLink}>
        <button style={secondaryButton}>{secondaryText}</button>
      </Link>
    </div>
  </div>
);

/* STYLES */

const containerStyle = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden"
};

const bgStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: `url(${hero})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 0
};

const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.65)",
  zIndex: 1
};

const contentWrapper = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px",
  color: "white"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const title = {
  fontSize: "38px",
  fontWeight: "700",
  letterSpacing: "0.5px"
};

const logoutButton = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer"
};

const welcome = {
  marginBottom: "30px"
};

const welcomeTitle = {
  fontSize: "26px",
  fontWeight: "600",
  marginBottom: "8px"
};

const welcomeText = {
  fontSize: "16px",
  color: "#e5e7eb"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px"
};

const card = {
  background: "rgba(255,255,255,0.95)",
  color: "#111",
  padding: "22px",
  borderRadius: "12px"
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "8px"
};

const cardText = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "12px"
};

const buttonRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const primaryButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer"
};

const secondaryButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#10b981",
  color: "white",
  cursor: "pointer"
};

export default Dashboard;