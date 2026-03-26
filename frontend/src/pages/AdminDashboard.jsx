import React from "react";
import { useNavigate, Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const AdminDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
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
          <h1 style={title}>Admin Dashboard</h1>

          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div style={welcome}>
          <h2 style={welcomeTitle}>
            Welcome, {currentUser?.fullName}
          </h2>

          <p style={welcomeText}>
            Manage users, items, and claims efficiently.
          </p>
        </div>

        {/* Profile Card */}
        <div style={profileCard}>
          <h3 style={profileTitle}>Admin Profile</h3>
          <p><strong>Name:</strong> {currentUser?.fullName}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Phone:</strong> {currentUser?.phone}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
        </div>

        {/* Cards */}
        <div style={grid}>
          <Card title="Manage Users" desc="View and manage users." link="/admin/users" />
          <Card title="Manage Claims" desc="Review claims." link="/admin/claims" />
          <Card title="Manage Lost Items" desc="Manage lost reports." link="/admin/lost-items" />
          <Card title="Manage Found Items" desc="Manage found reports." link="/admin/found-items" />
        </div>

      </div>
    </div>
  );
};

/* Card Component */
const Card = ({ title, desc, link }) => (
  <div style={card}>
    <h3 style={cardTitle}>{title}</h3>
    <p style={cardText}>{desc}</p>

    <Link to={link}>
      <button style={btn}>Open</button>
    </Link>
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

const profileCard = {
  background: "rgba(255,255,255,0.9)",
  color: "#111",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  maxWidth: "420px"
};

const profileTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "10px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  marginBottom: "10px"
};

const btn = {
  marginTop: "10px",
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer"
};

export default AdminDashboard;