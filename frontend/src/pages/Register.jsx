import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import hero from "../assets/image.png";

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
    <div style={containerStyle}>

      {/* BACKGROUND */}
      <div style={backgroundStyle} />

      {/* OVERLAY */}
      <div style={overlayStyle} />

      {/* CARD */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Register to continue</p>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Full Name</label>
          <input
            name="fullName"
            placeholder="Enter your full name"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Email</label>
          <input
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Phone</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button style={buttonStyle}>Register</button>
        </form>

        <p style={footerText}>
          Already have an account?{" "}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}


// ===== SAME STYLE AS LOGIN =====

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden"
};

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
  textAlign: "center"
};

const titleStyle = {
  marginBottom: "6px",
  fontWeight: "600",
  fontSize: "22px"
};

const subtitleStyle = {
  marginBottom: "20px",
  fontSize: "13px",
  color: "#666"
};

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
  fontSize: "14px"
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
  marginTop: "10px"
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
  color: "red",
  marginBottom: "10px",
  fontSize: "14px"
};

const successStyle = {
  color: "green",
  marginBottom: "10px",
  fontSize: "14px"
};

export default Register;