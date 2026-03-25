import React, { useEffect, useState } from "react";
import API from "../services/api";

const ClaimStatus = () => {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");

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
        background: "#f5f5f5",
        padding: "40px"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Claim Status
      </h1>

      {message && (
        <p style={{ textAlign: "center", color: "red" }}>{message}</p>
      )}

      {claims.length === 0 ? (
        <p style={{ textAlign: "center" }}>No claims submitted yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}
        >
          {claims.map((claim) => (
            <div
              key={claim._id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
              }}
            >
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
                <strong>Status:</strong> {claim.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimStatus;