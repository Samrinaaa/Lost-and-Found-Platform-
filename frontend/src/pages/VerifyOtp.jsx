import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/verify-otp", { userId, otp });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.card}>
        <div style={styles.iconBox}>✉️</div>

        <h2 style={styles.title}>Check your email</h2>
        <p style={styles.subtitle}>
          We sent a verification code to your email address. Enter it below to activate your account.
        </p>

        {error && <div style={styles.errorMsg}>{error}</div>}
        {success && <div style={styles.successMsg}>✓ {success}</div>}

        <form onSubmit={handleVerify}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Code</label>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
              required
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(45,106,100,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.2)"; }}
          >
            {loading ? "Verifying…" : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#faf9f7", fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "40px 20px" },
  orb: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.5, pointerEvents: "none" },
  orb1: { width: 400, height: 400, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -100, right: -100 },
  orb2: { width: 300, height: 300, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -80, left: -60 },
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "40%", left: -80 },
  card: { position: "relative", zIndex: 10, width: "100%", maxWidth: 420, background: "#fff", padding: "40px 36px", borderRadius: 20, boxShadow: "0 20px 60px rgba(45,106,100,0.1), 0 8px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(45,106,100,0.08)", textAlign: "center" },
  iconBox: { fontSize: 40, marginBottom: 20 },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#2c3e3a", marginBottom: 10, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#5a6e6a", lineHeight: 1.6, marginBottom: 28 },
  formGroup: { marginBottom: 18, textAlign: "left" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2c3e3a", marginBottom: 6 },
  input: { width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(45,106,100,0.15)", background: "#faf9f7", fontSize: 16, color: "#2c3e3a", outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: "0.2em", fontWeight: 600 },
  successMsg: { background: "rgba(16,185,129,0.1)", color: "#065f46", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(16,185,129,0.2)" },
  errorMsg: { background: "rgba(239,68,68,0.08)", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(239,68,68,0.15)" },
  submitBtn: { width: "100%", padding: "14px", borderRadius: 100, border: "none", background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,100,0.2)", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
};

export default VerifyOtp;