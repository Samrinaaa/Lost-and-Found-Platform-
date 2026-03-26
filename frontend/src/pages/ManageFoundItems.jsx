import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ManageFoundItems = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchFoundItems = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/found",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(res.data);
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this found item?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/admin/found-items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchFoundItems();
    } catch (error) {
      console.error("Error deleting found item:", error);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

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
          <h2>Admin Dashboard</h2>
          <h1>Manage Found Items</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        <div style={{ position: "absolute", top: "40px", right: "40px" }}>
          <button onClick={() => navigate("/admin")} style={btnBlue}>
            Back
          </button>
        </div>

        <div style={gridStyle}>
          {items.map((item) => (
            <div key={item._id} style={cardStyle}>
              <h3>{item.itemName}</h3>

              <p>
                <strong>Description:</strong>{" "}
                {item.description || "No description"}
              </p>

              <p>
                <strong>Location Found:</strong>{" "}
                {item.locationFound || "Unknown"}
              </p>

              <p>
                <strong>Date Found:</strong>{" "}
                {item.dateFound
                  ? new Date(item.dateFound).toLocaleDateString()
                  : "Not specified"}
              </p>

              <p>
                <strong>Reported By:</strong>{" "}
                {item.userId?.fullName || "Unknown"}
              </p>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  style={imageStyle}
                />
              )}

              <button
                onClick={() => deleteItem(item._id)}
                style={btnRed}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const cardStyle = {
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

export default ManageFoundItems;