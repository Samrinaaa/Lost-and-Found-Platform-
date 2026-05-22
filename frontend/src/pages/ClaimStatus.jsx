import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 6;

const statusConfig = {
  pending:        { label: "Pending",          bg: "rgba(100,116,139,0.1)", color: "#475569" },
  under_review:   { label: "Under Review",     bg: "rgba(59,130,246,0.1)",  color: "#2563eb" },
  need_more_info: { label: "More Info Needed", bg: "rgba(245,158,11,0.1)",  color: "#d97706" },
  approved:       { label: "Approved",         bg: "rgba(16,185,129,0.1)",  color: "#059669" },
  rejected:       { label: "Rejected",         bg: "rgba(239,68,68,0.1)",   color: "#dc2626" },
};

const ClaimStatus = () => {
  const [claims, setClaims]           = useState([]);
  const [message, setMessage]         = useState("");
  const [responses, setResponses]     = useState({});
  const [responseFiles, setResponseFiles] = useState({});
  const [loadingId, setLoadingId]     = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalItems, setTotalItems]   = useState(0);

  const fetchClaims = async (page = 1) => {
    try {
      const res = await API.get(`/claim?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setClaims(res.data.claims);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch {
      setMessage("Failed to load claims.");
    }
  };

  useEffect(() => { fetchClaims(1); }, []);

  const handlePageChange = (page) => {
    fetchClaims(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitResponse = async (id) => {
    if (!responses[id]?.trim()) {
      setMessage("Please enter your response before submitting.");
      return;
    }
    setLoadingId(id);
    try {
      const submitData = new FormData();
      submitData.append("response", responses[id]);
      (responseFiles[id] || []).forEach((file) => submitData.append("proofImages", file));

      await API.put(`/claim/${id}/respond`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Response submitted successfully!");
      setResponses({ ...responses, [id]: "" });
      setResponseFiles({ ...responseFiles, [id]: [] });
      await fetchClaims(currentPage);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to submit response.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/dashboard">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        {/* Page title */}
        <div style={styles.pageTitle}>
          <h1 style={styles.title}>My Claims</h1>
          <p style={styles.subtitle}>
            {totalItems} claim{totalItems !== 1 ? "s" : ""} submitted
            {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {message && (
          <div style={message.includes("success") || message.includes("Success") ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}

        {claims.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2c3e3a", marginBottom: 8 }}>
              No claims yet
            </h3>
            <p style={{ color: "#5a6e6a", fontSize: 14, marginBottom: 20 }}>
              You haven't submitted any claims yet.
            </p>
            <Link to="/claim">
              <button style={styles.submitBtn}>Submit a Claim</button>
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.claimsList}>
              {claims.map((claim) => {
                const status = statusConfig[claim.status] || statusConfig.pending;
                return (
                  <div key={claim._id} style={styles.card}>

                    {/* Card header */}
                    <div style={styles.cardHeader}>
                      <div>
                        <div style={styles.cardItemName}>
                          {claim.lostId?.itemName || claim.foundId?.itemName || "Unknown Item"}
                        </div>
                        <div style={styles.cardItemType}>
                          {claim.lostId ? "Lost item claim" : "Found item claim"}
                        </div>
                      </div>
                      <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    {/* Description */}
                    {claim.description && (
                      <div style={styles.infoBox}>
                        <div style={styles.infoBoxLabel}>Your claim description</div>
                        <p style={styles.infoBoxText}>{claim.description}</p>
                      </div>
                    )}

                    {/* Admin message */}
                    {claim.adminMessage && (
                      <div style={{ ...styles.infoBox, background: "#fef9ec", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <div style={{ ...styles.infoBoxLabel, color: "#d97706" }}>⚠ Admin request</div>
                        <p style={styles.infoBoxText}>{claim.adminMessage}</p>
                      </div>
                    )}

                    {/* Proof images */}
                    {claim.proofImages?.length > 0 && (
                      <div style={styles.proofSection}>
                        <div style={styles.infoBoxLabel}>Uploaded proof</div>
                        <div style={styles.proofGrid}>
                          {claim.proofImages.map((filePath, i) => (
                            /\.(jpg|jpeg|png|gif|webp)/i.test(filePath) ? (
                              <img key={i} src={filePath} alt={`proof-${i}`} style={styles.proofImg} />
                            ) : (
                              <a key={i} href={filePath} target="_blank" rel="noreferrer" style={styles.proofLink}>
                                📄 File {i + 1}
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Respond to admin */}
                    {claim.status === "need_more_info" && (
                      <div style={styles.respondSection}>
                        <div style={styles.infoBoxLabel}>Provide additional information</div>
                        <textarea
                          placeholder="Enter your response…"
                          value={responses[claim._id] || ""}
                          onChange={(e) => setResponses({ ...responses, [claim._id]: e.target.value })}
                          style={styles.textarea}
                        />
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setResponseFiles({ ...responseFiles, [claim._id]: Array.from(e.target.files || []) })}
                          style={styles.fileInput}
                        />
                        <button
                          onClick={() => submitResponse(claim._id)}
                          disabled={loadingId === claim._id}
                          style={styles.respondBtn}
                        >
                          {loadingId === claim._id ? "Submitting…" : "Submit Response"}
                        </button>
                      </div>
                    )}

                    {/* User response */}
                    {claim.userResponse && (
                      <div style={{ ...styles.infoBox, background: "#f0fdf4", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <div style={{ ...styles.infoBoxLabel, color: "#059669" }}>✓ Your response</div>
                        <p style={styles.infoBoxText}>{claim.userResponse}</p>
                      </div>
                    )}

                    {/* Activity log */}
                    {claim.logs?.length > 0 && (
                      <details style={styles.logDetails}>
                        <summary style={styles.logSummary}>Activity log ({claim.logs.length})</summary>
                        <ul style={styles.logList}>
                          {claim.logs.map((log, i) => (
                            <li key={i} style={styles.logItem}>• {log.message}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#faf9f7", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden", padding: "40px 20px" },
  orb: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.5, pointerEvents: "none" },
  orb1: { width: 400, height: 400, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -100, right: -100 },
  orb2: { width: 300, height: 300, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -80, left: -60 },
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "40%", left: -80 },
  content: { position: "relative", zIndex: 10, maxWidth: "780px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" },
  brandName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#2c3e3a", letterSpacing: "-0.01em" },
  backBtn: { padding: "9px 18px", border: "1.5px solid rgba(45,106,100,0.25)", borderRadius: 100, background: "transparent", color: "#2d6a64", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  pageTitle: { marginBottom: "24px" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 4, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#5a6e6a" },
  successMsg: { background: "rgba(16,185,129,0.1)", color: "#065f46", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(16,185,129,0.2)" },
  errorMsg: { background: "rgba(239,68,68,0.08)", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(239,68,68,0.15)" },
  emptyState: { background: "#fff", borderRadius: 20, padding: "60px 20px", textAlign: "center", border: "1px solid rgba(45,106,100,0.08)" },
  claimsList: { display: "flex", flexDirection: "column", gap: 20 },
  card: { background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(45,106,100,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  cardItemName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#2c3e3a", marginBottom: 2 },
  cardItemType: { fontSize: 12, color: "#5a6e6a" },
  statusBadge: { display: "inline-block", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0 },
  infoBox: { background: "#f8f9fa", border: "1px solid rgba(45,106,100,0.1)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 },
  infoBoxLabel: { fontSize: 11, fontWeight: 700, color: "#5a6e6a", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 },
  infoBoxText: { fontSize: 14, color: "#2c3e3a", lineHeight: 1.5, margin: 0 },
  proofSection: { marginBottom: 12 },
  proofGrid: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 },
  proofImg: { width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(45,106,100,0.15)" },
  proofLink: { padding: "8px 14px", background: "rgba(45,106,100,0.08)", color: "#2d6a64", borderRadius: 8, fontSize: 13, fontWeight: 600 },
  respondSection: { background: "#faf9f7", borderRadius: 12, padding: "16px", marginBottom: 12, border: "1px solid rgba(45,106,100,0.1)" },
  textarea: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(45,106,100,0.15)", background: "#fff", fontSize: 14, fontFamily: "inherit", color: "#2c3e3a", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", marginBottom: 10 },
  fileInput: { width: "100%", marginBottom: 10, fontSize: 13 },
  respondBtn: { padding: "10px 20px", borderRadius: 100, border: "none", background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  logDetails: { marginTop: 12 },
  logSummary: { fontSize: 12, color: "#5a6e6a", fontWeight: 600, cursor: "pointer", userSelect: "none" },
  logList: { listStyle: "none", padding: "10px 0 0", margin: 0, display: "flex", flexDirection: "column", gap: 6 },
  logItem: { fontSize: 12, color: "#5a6e6a" },
  submitBtn: { padding: "10px 22px", border: "none", borderRadius: 100, background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};

export default ClaimStatus;