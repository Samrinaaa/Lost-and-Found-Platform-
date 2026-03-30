import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import hero from "../assets/Lost&Found.png";

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

      // 🔥 UPDATED: redirect to OTP page (instead of login)
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
      <div style={overlayStyle} />

      <div style={cardStyle}>
        <h2 style={titleStyle}>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} style={inputStyle} required />
          <input name="email" placeholder="Email" onChange={handleChange} style={inputStyle} required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} style={inputStyle} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} style={inputStyle} required />

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

const containerStyle = {
  height: "100vh",
  backgroundImage: "url('/src/assets/Lost&Found.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative"
};

const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.65)"
};

const cardStyle = {
  position: "relative",
  width: "420px",
  background: "#ffffff",
  padding: "35px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  textAlign: "center"
};

const titleStyle = {
  marginBottom: "20px",
  fontWeight: "600"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};

const footerText = {
  marginTop: "15px",
  fontSize: "14px"
};

const linkStyle = {
  color: "#3b82f6",
  textDecoration: "none"
};

export default Register;