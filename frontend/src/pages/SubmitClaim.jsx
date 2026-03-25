import React, { useEffect, useState } from "react";
import API from "../services/api";

const SubmitClaim = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [formData, setFormData] = useState({
    lostId: "",
    foundId: ""
  });

  const [message, setMessage] = useState("");

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5"
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Submit Claim
        </h2>

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

          <button style={buttonStyle}>
            Submit Claim
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

export default SubmitClaim;