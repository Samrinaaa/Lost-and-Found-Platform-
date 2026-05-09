import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData
      );

      setSuccess(res.data.message);
      setError("");

      setTimeout(() => {
        navigate("/verify-otp", { state: { userId: res.data.userId } });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>

      {/* Background elements */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      {/* Card */}
      <div style={styles.card}>
        
        {/* Logo/Brand */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <UserPlusIcon />
          </div>
        </div>

        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(45,106,100,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(45,106,100,0.2)";
            }}
          >
            Create Account
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <Link to="/" style={styles.backLink}>
        <ArrowLeftIcon /> Back to home
      </Link>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────── */

const UserPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" x2="19" y1="8" y2="14"/>
    <line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

/* ─── Styles ────────────────────────────────── */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background: "#faf9f7",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "40px 20px",
  },

  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.5,
    pointerEvents: "none",
  },
  orb1: { width: 400, height: 400, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -100, right: -100 },
  orb2: { width: 300, height: 300, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -80, left: -60 },
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "50%", left: -80 },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    padding: "36px 36px 40px",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(45,106,100,0.1), 0 8px 24px rgba(0,0,0,0.04)",
    border: "1px solid rgba(45,106,100,0.08)",
    zIndex: 10,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(45,106,100,0.1) 0%, rgba(45,106,100,0.05) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2d6a64",
  },

  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#2c3e3a",
    margin: "0 0 16px",
    textAlign: "center",
    letterSpacing: "-0.02em",
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#2c3e3a",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(45,106,100,0.15)",
    background: "#faf9f7",
    fontSize: 14,
    color: "#2c3e3a",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: 100,
    border: "none",
    background: "linear-gradient(135deg, #2d6a64 0%, #245854 100%)",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(45,106,100,0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginTop: 8,
  },

  footer: {
    marginTop: 24,
    fontSize: 14,
    color: "#5a6e6a",
    textAlign: "center",
  },
  link: {
    color: "#2d6a64",
    textDecoration: "none",
    fontWeight: 600,
  },

  error: {
    background: "rgba(220, 38, 38, 0.08)",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
  },
  success: {
    background: "rgba(22, 163, 74, 0.08)",
    color: "#16a34a",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
  },

  backLink: {
    position: "absolute",
    top: 24,
    left: 24,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: "#2d6a64",
    textDecoration: "none",
  },
};

export default Register;