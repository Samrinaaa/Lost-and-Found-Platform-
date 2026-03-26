import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const SubmitClaim = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [formData, setFormData] = useState({
    lostId: "",
    foundId: ""
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lost = await API.get("/lost");
        const found = await API.get("/found");

        setLostItems(lost.data);
        setFoundItems(found.data);
      } catch (error) {
        setMessage("Failed to load items.");
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/claim", formData);

      setMessage("Claim submitted successfully!");

      setFormData({
        lostId: "",
        foundId: ""
      });

    } catch (error) {
      setMessage("Failed to submit claim.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px",
          color: "white",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ opacity: 0.8 }}>User Dashboard</h2>
          <h1 style={{ fontSize: "36px" }}>Submit Claim</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* BACK BUTTON */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
          }}
        >
          <Link to="/dashboard">
            <button style={btnBlue}>Back</button>
          </Link>
        </div>

        {/* FORM */}
        <div style={formBox}>
          <form onSubmit={handleSubmit}>

            <select
              name="lostId"
              value={formData.lostId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Lost Item</option>
              {lostItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName}
                </option>
              ))}
            </select>

            <select
              name="foundId"
              value={formData.foundId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Found Item</option>
              {foundItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName}
                </option>
              ))}
            </select>

            <button style={submitBtn}>
              Submit Claim
            </button>

          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                textAlign: "center",
                color: message.includes("Failed") ? "#f87171" : "#10b981",
                fontWeight: "600"
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* STYLES */

const formBox = {
  maxWidth: "500px",
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "12px",
  color: "#111",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px"
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

export default SubmitClaim;