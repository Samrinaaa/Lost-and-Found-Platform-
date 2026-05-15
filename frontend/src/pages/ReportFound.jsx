import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    locationFound: "",
    dateFound: "",
    category: ""
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      await API.post("/found", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("success");
      setFormData({ itemName: "", description: "", locationFound: "", dateFound: "", category: "" });
      setImage(null);

      setTimeout(() => navigate("/found-items"), 1500);
    } catch (error) {
      setMessage("error");
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

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/dashboard">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        {/* Page title */}
        <div style={styles.pageTitle}>
          <h1 style={styles.title}>Report Found Item</h1>
          <p style={styles.subtitle}>
            Found something? Help reunite it with its owner by filling in the details below.
          </p>
        </div>

        {/* Form card */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Bags">Bags</option>
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="e.g. Brown leather wallet"
                value={formData.itemName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                placeholder="Describe the item — colour, brand, unique marks, contents, etc."
                value={formData.description}
                onChange={handleChange}
                style={{ ...styles.input, height: "100px", resize: "vertical" }}
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Location Found</label>
                <input
                  type="text"
                  name="locationFound"
                  placeholder="e.g. Baneshwor, Kathmandu"
                  value={formData.locationFound}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Date Found</label>
                <input
                  type="date"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={styles.fileInput}
              />
              {image && (
                <p style={styles.fileName}>Selected: {image.name}</p>
              )}
            </div>

            {message === "success" && (
              <div style={styles.successMsg}>
                ✓ Found item reported successfully! Redirecting…
              </div>
            )}
            {message === "error" && (
              <div style={styles.errorMsg}>
                ✕ Failed to report found item. Please try again.
              </div>
            )}

            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(45,106,100,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.2)";
              }}
            >
              {loading ? "Submitting…" : "Submit Report"}
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
  content: { position: "relative", zIndex: 10, maxWidth: "680px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" },
  brandName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#2c3e3a", letterSpacing: "-0.01em" },
  backBtn: { padding: "9px 18px", border: "1.5px solid rgba(45,106,100,0.25)", borderRadius: 100, background: "transparent", color: "#2d6a64", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  pageTitle: { marginBottom: "28px" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 8, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#5a6e6a", lineHeight: 1.6 },
  card: { background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(45,106,100,0.08)" },
  formGroup: { marginBottom: 18 },
  row: { display: "flex", gap: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2c3e3a", marginBottom: 6 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(45,106,100,0.15)", background: "#faf9f7", fontSize: 14, color: "#2c3e3a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  fileInput: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px dashed rgba(45,106,100,0.25)", background: "#faf9f7", fontSize: 13, color: "#5a6e6a", cursor: "pointer", boxSizing: "border-box" },
  fileName: { fontSize: 12, color: "#2d6a64", marginTop: 6, fontWeight: 500 },
  successMsg: { background: "rgba(16,185,129,0.1)", color: "#065f46", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(16,185,129,0.2)" },
  errorMsg: { background: "rgba(239,68,68,0.08)", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(239,68,68,0.15)" },
  submitBtn: { width: "100%", padding: "13px", borderRadius: 100, border: "none", background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,100,0.2)", transition: "transform 0.2s ease, box-shadow 0.2s ease", marginTop: 8 },
};

export default ReportFound;