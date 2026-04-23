import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const SubmitClaim = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [formData, setFormData] = useState({
    lostId: "",
    foundId: "",
    description: ""
  });

  const [proofFiles, setProofFiles] = useState([]);
  const [message, setMessage] = useState("");

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
    const { name, value } = e.target;

    // allow only one selection at a time
    if (name === "lostId") {
      setFormData({
        ...formData,
        lostId: value,
        foundId: value ? "" : formData.foundId
      });
      return;
    }

    if (name === "foundId") {
      setFormData({
        ...formData,
        foundId: value,
        lostId: value ? "" : formData.lostId
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setProofFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.lostId && !formData.foundId) {
      setMessage("Please select either a lost item or a found item.");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("lostId", formData.lostId);
      submitData.append("foundId", formData.foundId);
      submitData.append("description", formData.description);

      proofFiles.forEach((file) => {
        submitData.append("proofImages", file);
      });

      await API.post("/claim", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("Claim submitted successfully!");

      setFormData({
        lostId: "",
        foundId: "",
        description: ""
      });

      setProofFiles([]);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to submit claim."
      );
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
          <h2 style={{ opacity: 0.8 }}>User Dashboard</h2>
          <h1 style={{ fontSize: "36px" }}>Submit Claim</h1>
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

            <textarea
              name="description"
              placeholder="Describe why this item is yours (color, unique marks, contents, etc.)"
              value={formData.description}
              onChange={handleChange}
              style={{ ...inputStyle, height: "100px" }}
            />

            <div style={fileBox}>
              <label style={labelStyle}>Upload Proof Images/Documents (optional)</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={fileInputStyle}
              />

              {proofFiles.length > 0 && (
                <ul style={fileListStyle}>
                  {proofFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" style={submitBtn}>
              Submit Claim
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                textAlign: "center",
                color: message.toLowerCase().includes("success") ? "#10b981" : "#f87171",
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

const fileBox = {
  marginBottom: "15px"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600"
};

const fileInputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "#fff"
};

const fileListStyle = {
  marginTop: "10px",
  paddingLeft: "18px",
  color: "#374151"
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