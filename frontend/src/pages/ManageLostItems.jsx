import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ManageLostItems = () => {
  const [items, setItems] = useState([]);
  const [confirmId, setConfirmId] = useState(null); 

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchLostItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/lost", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/admin/lost-items/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConfirmId(null);
      fetchLostItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={overlay} />

      <div style={container}>
        <div style={{ marginBottom: "30px" }}>
          <h2>Admin Dashboard</h2>
          <h1>Manage Lost Items</h1>
          <p>Welcome, <strong>{currentUser?.fullName}</strong></p>
        </div>

        <div style={{ position: "absolute", top: "40px", right: "40px" }}>
          <button onClick={() => navigate("/admin")} style={btnBlue}>
            Back
          </button>
        </div>

        <div style={grid}>
          {items.map((item) => (
            <div key={item._id} style={card}>
              <h3>{item.itemName}</h3>

              <p><strong>Description:</strong> {item.description || "No description"}</p>
              <p><strong>Location:</strong> {item.locationLost || "Unknown"}</p>

              <p>
                <strong>Date:</strong>{" "}
                {item.dateLost
                  ? new Date(item.dateLost).toLocaleDateString()
                  : "Not specified"}
              </p>

              <p>
                <strong>Reported By:</strong>{" "}
                {item.userId?.fullName || "Unknown"}
              </p>

              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.itemName} style={imageStyle} />
              )}

              {/* CONFIRM UI */}
              {confirmId === item._id ? (
                <div style={{ marginTop: "10px" }}>
                  <p>Are you sure you want to delete this item?</p>

                  <button
                    onClick={() => deleteItem(item._id)}
                    style={confirmBtn}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => setConfirmId(null)}
                    style={cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(item._id)}
                  style={btnRed}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* STYLES */

const pageStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${hero})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const container = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px",
  color: "white",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const card = {
  background: "rgba(255,255,255,0.95)",
  padding: "20px",
  borderRadius: "12px",
  color: "#111",
};

const imageStyle = {
  width: "100%",
  maxHeight: "200px",
  objectFit: "contain",
  marginTop: "10px",
  borderRadius: "8px",
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const btnRed = {
  background: "#ef4444",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  marginTop: "10px",
};

const confirmBtn = {
  background: "#111827",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  marginRight: "8px",
};

const cancelBtn = {
  background: "#9ca3af",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
};

export default ManageLostItems;