import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <div>
            <h1 style={{ marginBottom: "10px" }}>User Dashboard</h1>
            <p style={{ fontSize: "20px", margin: 0 }}>
              Welcome, <strong>{user?.fullName}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px"
          }}
        >
          <div style={cardStyle}>
            <h3>Lost Item Management</h3>
            <p>Report a lost item or browse all lost item reports.</p>

            <div style={buttonRowStyle}>
              <Link to="/report-lost">
                <button style={{ ...buttonStyle, background: "#3b82f6" }}>
                  Report Lost Item
                </button>
              </Link>

              <Link to="/lost-items">
                <button style={{ ...buttonStyle, background: "#10b981" }}>
                  View Lost Items
                </button>
              </Link>
            </div>
          </div>

          <div style={cardStyle}>
            <h3>Found Item Management</h3>
            <p>Report a found item or browse all found item reports.</p>

            <div style={buttonRowStyle}>
              <Link to="/report-found">
                <button style={{ ...buttonStyle, background: "#3b82f6" }}>
                  Report Found Item
                </button>
              </Link>

              <Link to="/found-items">
                <button style={{ ...buttonStyle, background: "#10b981" }}>
                  View Found Items
                </button>
              </Link>
            </div>
          </div>

          <div style={cardStyle}>
            <h3>Claim Management</h3>
            <p>Submit a claim for an item and track its status.</p>

            <div style={buttonRowStyle}>
              <Link to="/claim">
                <button style={{ ...buttonStyle, background: "#3b82f6" }}>
                  Submit a Claim
                </button>
              </Link>

              <Link to="/claim-status">
                <button style={{ ...buttonStyle, background: "#10b981" }}>
                  Track Claim Status
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
};

const buttonRowStyle = {
  marginTop: "18px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer"
};

export default Dashboard;