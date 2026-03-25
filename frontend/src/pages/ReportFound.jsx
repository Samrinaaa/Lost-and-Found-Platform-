import React, { useState } from "react";
import API from "../services/api";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    locationFound: "",
    dateFound: "",
    imageUrl: ""
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
      const res = await API.post("/found", formData);
      setMessage("Found item reported successfully!");

      setFormData({
        itemName: "",
        description: "",
        locationFound: "",
        dateFound: "",
        imageUrl: ""
      });

    } catch (error) {
      setMessage("Failed to report found item");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}>

      <div style={{
        width: "420px",
        background: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Report Found Item
        </h2>

        <form onSubmit={handleSubmit}>

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
            style={{ ...inputStyle, height: "80px" }}
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
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            style={inputStyle}
          />

          <button style={buttonStyle}>
            Submit
          </button>

        </form>

        {message && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

export default ReportFound;