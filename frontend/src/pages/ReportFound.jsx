import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    locationFound: "",
    dateFound: "",
    category: ""
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      await API.post("/found", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Found item reported successfully!");

      setFormData({
        itemName: "",
        description: "",
        locationFound: "",
        dateFound: "",
        category: ""
      });

      setImage(null);

    } catch (error) {
      setMessage("Failed to report found item");
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
        <div style={{ marginBottom: "30px" }}>
          <h2>User Dashboard</h2>
          <h1>Report Found Item</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

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

        <div style={formBox}>
          <form onSubmit={handleSubmit}>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Bags">Bags</option>
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Others">Others</option>
            </select>

            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={formData.itemName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...inputStyle, height: "90px" }}
            />

            <input
              type="text"
              name="locationFound"
              placeholder="Location Found"
              value={formData.locationFound}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="date"
              name="dateFound"
              value={formData.dateFound}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={inputStyle}
            />

            <button style={submitBtn}>
              Submit
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

export default ReportFound;