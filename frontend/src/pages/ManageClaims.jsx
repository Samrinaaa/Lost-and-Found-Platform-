import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchClaims = async () => {
    try {
      const res = await API.get("/claim");
      setClaims(res.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
      setMessage("Failed to load claims.");
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
    setMessage("");
  };

  const handleRejectClick = (claim) => {
    setPendingAction({
      type: "reject",
      id: claim._id,
    });
    setMessage("");
  };

  const handleReviewClick = (claim) => {
    setPendingAction({
      type: "review",
      id: claim._id,
    });
    setMessage("");
  };

  const handleRequestInfoClick = (claim) => {
    setPendingAction({
      type: "request",
      id: claim._id,
    });
    setMessage("");
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "approve") {
        await API.put(`/claim/${pendingAction.id}/approve`, {});
      }

      if (pendingAction.type === "reject") {
        await API.put(`/claim/${pendingAction.id}/reject`, {});
      }

      if (pendingAction.type === "review") {
        await API.put(`/claim/${pendingAction.id}/review`, {});
      }

      if (pendingAction.type === "request") {
        if (!requestMessage.trim()) {
          setMessage("Please enter a message before requesting more info.");
          return;
        }

        await API.put(`/claim/${pendingAction.id}/request-info`, {
          message: requestMessage,
        });

        setRequestMessage("");
      }

      setPendingAction(null);
      setMessage("Action completed successfully.");
      fetchClaims();
    } catch (error) {
      console.error("Action failed:", error);
      setMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Action failed."
      );
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
    setRequestMessage("");
    setMessage("");
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
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ opacity: 0.8 }}>Admin Dashboard</h2>
          <h1 style={{ fontSize: "38px" }}>Manage Claims</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

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

        {message && (
          <p
            style={{
              marginBottom: "20px",
              fontWeight: "600",
              color: message.toLowerCase().includes("success") || message.toLowerCase().includes("completed")
                ? "#86efac"
                : "#fca5a5"
            }}
          >
            {message}
          </p>
        )}

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
              <div key={claim._id} style={cardStyle}>
                <h3>Claim Request</h3>

                <p><strong>Claimant:</strong> {claim.claimantUser?.fullName}</p>
                <p><strong>Email:</strong> {claim.claimantUser?.email}</p>
                <p><strong>Lost Item:</strong> {claim.lostId?.itemName || "N/A"}</p>
                <p><strong>Found Item:</strong> {claim.foundId?.itemName || "N/A"}</p>

                {claim.description && (
                  <div style={descBox}>
                    <strong>Claim Description:</strong>
                    <p>{claim.description}</p>
                  </div>
                )}

                <p>
                  <strong>Status:</strong>{" "}
                  <span style={statusStyle(claim.status)}>
                    {claim.status}
                  </span>
                </p>

                {claim.adminMessage && (
                  <div style={adminBox}>
                    <strong>Admin Message:</strong>
                    <p>{claim.adminMessage}</p>
                  </div>
                )}

                {claim.userResponse && (
                  <div style={userBox}>
                    <strong>User Response:</strong>
                    <p>{claim.userResponse}</p>
                  </div>
                )}

                {claim.logs && claim.logs.length > 0 && (
                  <div style={logBox}>
                    <strong>Claim Logs:</strong>
                    <ul style={{ paddingLeft: "18px", marginTop: "8px" }}>
                      {claim.logs.map((log, index) => (
                        <li key={index} style={{ marginBottom: "6px" }}>
                          {log.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {["pending", "under_review", "need_more_info"].includes(claim.status) && (
                  <div style={{ marginTop: "15px" }}>
                    {!isActive ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        <button onClick={() => handleReviewClick(claim)} style={btnBlue}>
                          Review
                        </button>

                        <button onClick={() => handleRequestInfoClick(claim)} style={btnDark}>
                          Request Info
                        </button>

                        <button onClick={() => handleApproveClick(claim)} style={btnGreen}>
                          Approve
                        </button>

                        <button onClick={() => handleRejectClick(claim)} style={btnRed}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={confirmBox}>
                        {pendingAction.type === "request" && (
                          <textarea
                            placeholder="Enter message for user..."
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            style={textareaStyle}
                          />
                        )}

                        <p>
                          Confirm {pendingAction.type} action?
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

const textareaStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px"
};

const adminBox = {
  background: "#fef3c7",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "10px"
};

const userBox = {
  background: "#d1fae5",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "10px"
};

const descBox = {
  background: "#e0f2fe",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "10px"
};

const logBox = {
  background: "#f3f4f6",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "12px"
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

const statusStyle = (status) => {
  if (status === "approved") return { color: "#10b981", fontWeight: "600" };
  if (status === "rejected") return { color: "#ef4444", fontWeight: "600" };
  if (status === "need_more_info") return { color: "#f59e0b", fontWeight: "600" };
  if (status === "under_review") return { color: "#3b82f6", fontWeight: "600" };
  return { color: "#6b7280", fontWeight: "600" };
};

export default ManageClaims;