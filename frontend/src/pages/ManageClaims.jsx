import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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

  const approveClaim = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this claim?"
    );

    if (!confirmApprove) return;

    try {
      await axios.put(
        `http://localhost:5001/api/claim/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchClaims();
    } catch (error) {
      console.error("Error approving claim:", error);
    }
  };

  const rejectClaim = async (id) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this claim?"
    );

    if (!confirmReject) return;

    try {
      await axios.put(
        `http://localhost:5001/api/claim/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchClaims();
    } catch (error) {
      console.error("Error rejecting claim:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "25px" }}>Admin Dashboard</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            alignItems: "center",
          }}
        >
          <h2>Manage Claims</h2>

          <button
            onClick={() => navigate("/admin")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>

        {claims.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            }}
          >
            <p>No claims submitted yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
              gap: "20px",
            }}
          >
            {claims.map((claim) => (
              <div
                key={claim._id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                }}
              >
                <h3>Claim Request</h3>

                <p>
                  <strong>Claimant:</strong>{" "}
                  {claim.claimantUser?.fullName || "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {claim.claimantUser?.email || "Unknown"}
                </p>

                {claim.lostId && (
                  <p>
                    <strong>Lost Item:</strong>{" "}
                    {claim.lostId?.itemName || "Unknown"}
                  </p>
                )}

                {claim.foundId && (
                  <p>
                    <strong>Found Item:</strong>{" "}
                    {claim.foundId?.itemName || "Unknown"}
                  </p>
                )}

                <p>
                  <strong>Status:</strong> {claim.status}
                </p>

                {claim.status === "pending" && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => approveClaim(claim._id)}
                      style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#10b981",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectClaim(claim._id)}
                      style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#ef4444",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClaims;