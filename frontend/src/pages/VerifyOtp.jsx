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

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/verify-otp",
        { userId, otp }
      );

      setSuccess(res.data.message);
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      setSuccess("");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "350px", padding: "30px", background: "#fff", borderRadius: "10px" }}>
        <h2>Verify OTP</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleVerify}>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            required
          />
          <button style={{ width: "100%", padding: "10px" }}>Verify</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;