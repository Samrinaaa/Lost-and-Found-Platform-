import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import hero from "../assets/Lost&Found.png";

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

      setMessage("Login successful!");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (error) {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Overlay */}
      <div style={overlayStyle} />

      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button style={buttonStyle}>
            Login
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "12px", color: message === "Login successful!" ? "green" : "red" }}>
            {message}
          </p>
        )}

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

export default Login;
