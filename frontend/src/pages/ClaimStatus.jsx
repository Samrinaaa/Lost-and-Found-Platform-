import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ClaimStatus = () => {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState({});
  const [responseFiles, setResponseFiles] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchClaims = async () => {
    try {
      const res = await API.get("/claim");
      setClaims(res.data);
    } catch (error) {
      setMessage("Failed to load claims.");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleResponseChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: value
    });
  };

  const handleFileChange = (id, files) => {
    setResponseFiles({
      ...responseFiles,
      [id]: Array.from(files || [])
    });
  };

  const submitResponse = async (id) => {
    if (!responses[id] || !responses[id].trim()) {
      setMessage("Please enter your response before submitting.");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("response", responses[id]);

      const files = responseFiles[id] || [];
      files.forEach((file) => {
        submitData.append("proofImages", file);
      });

      await API.put(`/claim/${id}/respond`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("Response submitted successfully!");

      setResponses({
        ...responses,
        [id]: ""
      });

      setResponseFiles({
        ...responseFiles,
        [id]: []
      });

      await fetchClaims();
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to submit response."
      );
    }
  };

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:5001${path}`;
  };

  const isImageFile = (path) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(path || "");
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
          <h2 style={{ opacity: 0.8 }}>User Dashboard</h2>
          <h1 style={{ fontSize: "36px" }}>Claim Status</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

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

        {message && (
          <p
            style={{
              textAlign: "center",
              color: message.toLowerCase().includes("success") ? "#86efac" : "#fca5a5",
              fontWeight: "600",
              marginBottom: "20px"
            }}
          >
            {message}
          </p>
        )}

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

                {claim.description && (
                  <div style={descBox}>
                    <strong>Your Claim Description:</strong>
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
                    <strong>Admin Request:</strong>
                    <p>{claim.adminMessage}</p>
                  </div>
                )}

                {claim.proofImages && claim.proofImages.length > 0 && (
                  <div style={proofBox}>
                    <strong>Uploaded Proof:</strong>
                    <div style={proofGrid}>
                      {claim.proofImages.map((filePath, index) => (
                        <div key={index} style={proofItem}>
                          {isImageFile(filePath) ? (
                            <img
                              src={getFileUrl(filePath)}
                              alt={`proof-${index}`}
                              style={proofImage}
                            />
                          ) : (
                            <a
                              href={getFileUrl(filePath)}
                              target="_blank"
                              rel="noreferrer"
                              style={fileLinkStyle}
                            >
                              View File {index + 1}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {claim.status === "need_more_info" && (
                  <div style={{ marginTop: "10px" }}>
                    <textarea
                      placeholder="Provide additional details..."
                      value={responses[claim._id] || ""}
                      onChange={(e) =>
                        handleResponseChange(claim._id, e.target.value)
                      }
                      style={textareaStyle}
                    />

                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleFileChange(claim._id, e.target.files)
                      }
                      style={fileInputStyle}
                    />

                    {responseFiles[claim._id] && responseFiles[claim._id].length > 0 && (
                      <ul style={fileListStyle}>
                        {responseFiles[claim._id].map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    )}

                    <button
                      style={submitBtn}
                      onClick={() => submitResponse(claim._id)}
                    >
                      Submit Response
                    </button>
                  </div>
                )}

                {claim.userResponse && (
                  <div style={userBox}>
                    <strong>Your Response:</strong>
                    <p>{claim.userResponse}</p>
                  </div>
                )}

                {claim.logs && claim.logs.length > 0 && (
                  <div style={logBox}>
                    <strong>Progress Log:</strong>
                    <ul style={{ paddingLeft: "18px", marginTop: "8px" }}>
                      {claim.logs.map((log, index) => (
                        <li key={index} style={{ marginBottom: "6px" }}>
                          {log.message}
                        </li>
                      ))}
                    </ul>
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

const textareaStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px"
};

const fileInputStyle = {
  width: "100%",
  marginBottom: "10px"
};

const fileListStyle = {
  marginTop: "0",
  marginBottom: "10px",
  paddingLeft: "18px",
  color: "#374151"
};

const submitBtn = {
  width: "100%",
  padding: "10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
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
  marginTop: "10px",
  marginBottom: "10px"
};

const logBox = {
  background: "#f3f4f6",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "12px"
};

const proofBox = {
  background: "#ede9fe",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "12px"
};

const proofGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
  gap: "10px",
  marginTop: "10px"
};

const proofItem = {
  textAlign: "center"
};

const proofImage = {
  width: "100%",
  height: "100px",
  objectFit: "cover",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const fileLinkStyle = {
  color: "#4f46e5",
  textDecoration: "underline",
  fontWeight: "600"
};

const statusStyle = (status) => {
  if (status === "approved") return { color: "#10b981", fontWeight: "600" };
  if (status === "rejected") return { color: "#ef4444", fontWeight: "600" };
  if (status === "need_more_info") return { color: "#f59e0b", fontWeight: "600" };
  if (status === "under_review") return { color: "#3b82f6", fontWeight: "600" };
  return { color: "#6b7280", fontWeight: "600" };
};

export default ClaimStatus;