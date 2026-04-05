import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import hero from "../assets/image.png";
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

      navigate("/dashboard");

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

      navigate("/dashboard");

    } catch (error) {
      console.log("GOOGLE ERROR:", error);
      setMessage("Google login failed");
    }
  };

  return (
    <div style={containerStyle}>

      {/* BLURRED BACKGROUND */}
      <div style={backgroundStyle} />

      {/* OVERLAY */}
      <div style={overlayStyle} />

      {/* CARD */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome Back </h2>
        <p style={subtitleStyle}>Login to continue</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button style={buttonStyle}>Login</button>
        </form>

        <div style={dividerStyle}>OR</div>

        <div style={{ marginTop: "20px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google login failed")}
          />
        </div>

        {message && <p style={errorStyle}>{message}</p>}

        <p style={footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};


// STYLES
// container
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden"
};

// blurred background
const backgroundStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: `url(${hero})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(8px)",
  transform: "scale(1.1)"
};

// overlay
const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)"
};

const cardStyle = {
  position: "relative",
  width: "440px",
  background: "#ffffff",
  padding: "38px",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  textAlign: "center",
  transition: "transform 0.2s ease",
};

// title
const titleStyle = {
  marginBottom: "6px",
  fontWeight: "600",
  fontSize: "22px"
};

const subtitleStyle = {
  marginBottom: "22px",
  fontSize: "13px",
  color: "#666"
};

// labels
const labelStyle = {
  display: "block",
  textAlign: "left",
  marginBottom: "5px",
  fontSize: "13px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.2s ease"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
  transition: "all 0.2s ease"
};

const dividerStyle = {
  margin: "18px 0",
  fontSize: "12px",
  color: "#999"
};

const footerText = {
  marginTop: "16px",
  fontSize: "14px"
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500"
};

const errorStyle = {
  marginTop: "10px",
  color: "red",
  fontSize: "14px"
};

export default Login;