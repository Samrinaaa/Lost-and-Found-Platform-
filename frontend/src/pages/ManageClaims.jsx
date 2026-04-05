import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/claim",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClaims(res.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApproveClick = (claim) => {
    setPendingAction({
      type: "approve",
      id: claim._id,
    });
  };

  const handleRejectClick = (claim) => {
    setPendingAction({
      type: "reject",
      id: claim._id,
    });
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "approve") {
        await axios.put(
          `http://localhost:5001/api/claim/${pendingAction.id}/approve`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (pendingAction.type === "reject") {
        await axios.put(
          `http://localhost:5001/api/claim/${pendingAction.id}/reject`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setPendingAction(null);
      fetchClaims();
    } catch (error) {
      console.error("Action failed:", error);
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
  };

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
          <h2 style={{ opacity: 0.8 }}>Admin Dashboard</h2>
          <h1 style={{ fontSize: "38px" }}>Manage Claims</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex",
            gap: "10px",
          }}
        >
          <Link to="/admin">
            <button style={btnBlue}>Back</button>
          </Link>

        </div>

        {/* CLAIM CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: "25px",
            marginTop: "30px",
          }}
        >
          {claims.map((claim) => {
            const isActive =
              pendingAction && pendingAction.id === claim._id;

            return (
              <div
                key={claim._id}
                style={cardStyle}
              >
                <h3>Claim Request</h3>

                <p><strong>Claimant:</strong> {claim.claimantUser?.fullName}</p>
                <p><strong>Email:</strong> {claim.claimantUser?.email}</p>
                <p><strong>Lost Item:</strong> {claim.lostId?.itemName}</p>
                <p><strong>Found Item:</strong> {claim.foundId?.itemName}</p>
                <p><strong>Status:</strong> {claim.status}</p>

                {claim.status === "pending" && (
                  <div style={{ marginTop: "15px" }}>
                    {!isActive ? (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => handleApproveClick(claim)}
                          style={btnGreen}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleRejectClick(claim)}
                          style={btnRed}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={confirmBox}>
                        <p>
                          Are you sure you want to{" "}
                          {pendingAction.type} this claim?
                        </p>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button onClick={handleConfirm} style={btnDark}>
                            Confirm
                          </button>

                          <button onClick={handleCancel} style={btnGray}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* STYLES */

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  padding: "25px",
  borderRadius: "12px",
  color: "#111",
};

const confirmBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "8px",
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const btnGreen = {
  background: "#10b981",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const btnRed = {
  background: "#ef4444",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const btnDark = {
  background: "#111827",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const btnGray = {
  background: "#9ca3af",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

export default ManageClaims;