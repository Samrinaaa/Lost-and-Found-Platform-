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
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${hero})`,
        backgroundSize: "90%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "140px",
        position: "relative"
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2))"
        }}
      />

      {/* Login Card */}
      <div
        style={{
          position: "relative",
          width: "450px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "25px" }}>Login</h2>

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
          <p
            style={{
              marginTop: "15px",
              color: message === "Login successful!" ? "green" : "red"
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

export default Login;