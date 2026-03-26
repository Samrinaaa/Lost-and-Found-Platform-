import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ClaimStatus = () => {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get("/claim");
        setClaims(res.data);
      } catch (error) {
        setMessage("Failed to load claims.");
      }
    };

    fetchClaims();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px",
          color: "white",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ opacity: 0.8 }}>User Dashboard</h2>
          <h1 style={{ fontSize: "36px" }}>Claim Status</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* BACK BUTTON */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
          }}
        >
          <Link to="/dashboard">
            <button style={btnBlue}>Back</button>
          </Link>
        </div>

        {/* MESSAGE */}
        {message && (
          <p style={{ textAlign: "center", color: "#f87171" }}>
            {message}
          </p>
        )}

        {/* EMPTY STATE */}
        {claims.length === 0 ? (
          <div style={emptyBox}>
            <p>No claims submitted yet.</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {claims.map((claim) => (
              <div key={claim._id} style={cardStyle}>
                {claim.lostId && (
                  <p>
                    <strong>Lost Item:</strong> {claim.lostId.itemName}
                  </p>
                )}

                {claim.foundId && (
                  <p>
                    <strong>Found Item:</strong> {claim.foundId.itemName}
                  </p>
                )}

                <p>
                  <strong>Status:</strong>{" "}
                  <span style={statusStyle(claim.status)}>
                    {claim.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* STYLES */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  padding: "20px",
  borderRadius: "12px",
  color: "#111",
};

const emptyBox = {
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "10px",
  textAlign: "center",
  color: "#111",
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const statusStyle = (status) => {
  if (status === "approved") return { color: "#10b981", fontWeight: "600" };
  if (status === "rejected") return { color: "#ef4444", fontWeight: "600" };
  return { color: "#f59e0b", fontWeight: "600" }; // pending
};

export default ClaimStatus;