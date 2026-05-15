import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const SubmitClaim = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [formData, setFormData] = useState({ lostId: "", foundId: "", description: "" });
  const [proofFiles, setProofFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lost = await API.get("/lost");
        const found = await API.get("/found");
        setLostItems(lost.data);
        setFoundItems(found.data);
      } catch {
        setMessage("error-load");
      }
    };
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lostId") {
      setFormData({ ...formData, lostId: value, foundId: value ? "" : formData.foundId });
    } else if (name === "foundId") {
      setFormData({ ...formData, foundId: value, lostId: value ? "" : formData.lostId });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.lostId && !formData.foundId) {
      setMessage("error-select");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("lostId", formData.lostId);
      submitData.append("foundId", formData.foundId);
      submitData.append("description", formData.description);
      proofFiles.forEach((file) => submitData.append("proofImages", file));

      await API.post("/claim", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("success");
      setFormData({ lostId: "", foundId: "", description: "" });
      setProofFiles([]);
    } catch (error) {
      setMessage(error?.response?.data?.message || "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/dashboard">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        <div style={styles.pageTitle}>
          <h1 style={styles.title}>Submit a Claim</h1>
          <p style={styles.subtitle}>
            Select the item you're claiming and provide proof of ownership. The admin will review your claim.
          </p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            <div style={styles.formGroup}>
              <label style={styles.label}>Claiming a Lost Item?</label>
              <select name="lostId" value={formData.lostId} onChange={handleChange} style={styles.input}>
                <option value="">Select a lost item</option>
                {lostItems.map((item) => (
                  <option key={item._id} value={item._id}>{item.itemName}</option>
                ))}
              </select>
            </div>

            <div style={styles.orDivider}>
              <span style={styles.orLine} />
              <span style={styles.orText}>or</span>
              <span style={styles.orLine} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Claiming a Found Item?</label>
              <select name="foundId" value={formData.foundId} onChange={handleChange} style={styles.input}>
                <option value="">Select a found item</option>
                {foundItems.map((item) => (
                  <option key={item._id} value={item._id}>{item.itemName}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Why is this item yours?</label>
              <textarea
                name="description"
                placeholder="Describe identifying details — colour, contents, unique marks, where you lost it, etc."
                value={formData.description}
                onChange={handleChange}
                style={{ ...styles.input, height: "110px", resize: "vertical" }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Proof (optional, up to 5 files)</label>
              <input
                type="file"
                multiple
                onChange={(e) => setProofFiles(Array.from(e.target.files || []))}
                style={styles.fileInput}
              />
              {proofFiles.length > 0 && (
                <ul style={styles.fileList}>
                  {proofFiles.map((file, i) => (
                    <li key={i} style={{ color: "#2d6a64", fontSize: 12 }}>✓ {file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            {message === "success" && (
              <div style={styles.successMsg}>✓ Claim submitted successfully! The admin will review it shortly.</div>
            )}
            {message === "error-select" && (
              <div style={styles.errorMsg}>Please select either a lost or found item.</div>
            )}
            {message === "error-load" && (
              <div style={styles.errorMsg}>Failed to load items. Please refresh the page.</div>
            )}
            {message && message !== "success" && message !== "error-select" && message !== "error-load" && (
              <div style={styles.errorMsg}>{message}</div>
            )}

            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(45,106,100,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.2)"; }}
            >
              {loading ? "Submitting…" : "Submit Claim"}
            </button>
          </form>
        </div>
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
  content: { position: "relative", zIndex: 10, maxWidth: "640px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" },
  brandName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#2c3e3a", letterSpacing: "-0.01em" },
  backBtn: { padding: "9px 18px", border: "1.5px solid rgba(45,106,100,0.25)", borderRadius: 100, background: "transparent", color: "#2d6a64", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  pageTitle: { marginBottom: "28px" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 8, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#5a6e6a", lineHeight: 1.6 },
  card: { background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(45,106,100,0.08)" },
  formGroup: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2c3e3a", marginBottom: 6 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(45,106,100,0.15)", background: "#faf9f7", fontSize: 14, color: "#2c3e3a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  orDivider: { display: "flex", alignItems: "center", gap: 12, margin: "4px 0 20px" },
  orLine: { flex: 1, height: 1, background: "rgba(45,106,100,0.12)" },
  orText: { fontSize: 12, color: "#8a9a96", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" },
  fileInput: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px dashed rgba(45,106,100,0.25)", background: "#faf9f7", fontSize: 13, color: "#5a6e6a", cursor: "pointer", boxSizing: "border-box" },
  fileList: { listStyle: "none", padding: 0, marginTop: 8, display: "flex", flexDirection: "column", gap: 4 },
  successMsg: { background: "rgba(16,185,129,0.1)", color: "#065f46", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(16,185,129,0.2)" },
  errorMsg: { background: "rgba(239,68,68,0.08)", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(239,68,68,0.15)" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 100, border: "none", background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,100,0.2)", transition: "transform 0.2s ease, box-shadow 0.2s ease", marginTop: 8 },
};

export default SubmitClaim;