import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        credential: credentialResponse.credential
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log("GOOGLE ERROR:", error);
      setMessage("Google login failed");
    }
  };

  return (
    <div style={styles.container}>

      {/* Background elements */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      {/* Floating icons
      <div style={{ ...styles.floatingIcon, top: "15%", left: "10%" }}>
        <KeyIcon />
      </div>
      <div style={{ ...styles.floatingIcon, top: "20%", right: "12%" }}>
        <WalletIcon />
      </div>
      <div style={{ ...styles.floatingIcon, bottom: "18%", left: "8%" }}>
        <SearchIcon />
      </div>
      <div style={{ ...styles.floatingIcon, bottom: "25%", right: "10%" }}>
        <PackageIcon />
      </div> */}

      {/* Card */}
      <div style={styles.card}>
        
        {/* Logo/Brand */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <SearchIcon />
          </div>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {message && <p style={styles.error}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
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
              placeholder="Enter your password"
              value={formData.password}
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
            Login
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google login failed")}
            shape="pill"
            size="large"
            width="100%"
          />
        </div>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <Link to="/" style={styles.backLink}>
        <ArrowLeftIcon /> Back to home
      </Link>
    </div>
  );
};

/* ─── Icons ─────────────────────────────────── */

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

// const KeyIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
//   </svg>
// );

// const WalletIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
//     <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
//     <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
//   </svg>
// );

// const PackageIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16.5 9.4 7.55 4.24"/>
//     <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
//     <polyline points="3.29 7 12 12 20.71 7"/>
//     <line x1="12" x2="12" y1="22" y2="12"/>
//   </svg>
// );

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
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "40%", left: -80 },

  floatingIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 12,
    background: "rgba(255,255,255,0.8)",
    boxShadow: "0 8px 24px rgba(45,106,100,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2d6a64",
    border: "1px solid rgba(255,255,255,0.6)",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    padding: "40px 36px",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(45,106,100,0.1), 0 8px 24px rgba(0,0,0,0.04)",
    border: "1px solid rgba(45,106,100,0.08)",
    zIndex: 10,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
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
    margin: "0 0 6px",
    textAlign: "center",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 14,
    color: "#5a6e6a",
    margin: "0 0 28px",
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 18,
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
    padding: "14px 16px",
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

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(45,106,100,0.12)",
  },
  dividerText: {
    fontSize: 12,
    color: "#8a9a96",
    whiteSpace: "nowrap",
  },

  googleWrapper: {
    display: "flex",
    justifyContent: "center",
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
    marginBottom: 20,
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

export default Login;