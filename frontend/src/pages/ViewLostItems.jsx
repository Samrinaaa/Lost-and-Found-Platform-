import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ViewLostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(""); // 🔥 ADDED

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchLostItems = async () => {
    try {
      const res = await API.get(`/lost?search=${search}`); // 🔥 UPDATED
      setLostItems(res.data);
    } catch (error) {
      setMessage("Failed to load lost items.");
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, [search]); // 🔥 UPDATED (re-fetch on search)

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
          <h1 style={{ fontSize: "36px" }}>Lost Items</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* 🔥 SEARCH BAR (ADDED) */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search lost items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "6px",
              border: "none"
            }}
          />
        </div>

        {/* BACK BUTTON ONLY */}
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

        {/* MESSAGE */}
        {message && (
          <p style={{ textAlign: "center", color: "#f87171" }}>{message}</p>
        )}

        {/* CONTENT */}
        {lostItems.length === 0 ? (
          <div style={emptyBox}>
            <p>No lost items found.</p> {/* slightly adjusted wording */}
          </div>
        ) : (
          <div style={grid}>
            {lostItems.map((item) => (
              <div key={item._id} style={card}>
                <h3>{item.itemName}</h3>

                <p><strong>Description:</strong> {item.description || "N/A"}</p>
                <p><strong>Location Lost:</strong> {item.locationLost || "N/A"}</p>
                <p>
                  <strong>Date Lost:</strong>{" "}
                  {item.dateLost
                    ? new Date(item.dateLost).toLocaleDateString()
                    : "N/A"}
                </p>

                <p><strong>Status:</strong> {item.status}</p>

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    style={imageStyle}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
  gap: "25px",
};

const card = {
  background: "rgba(255,255,255,0.95)",
  padding: "25px",
  borderRadius: "12px",
  color: "#111",
};

const emptyBox = {
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#111",
};

const imageStyle = {
  width: "100%",
  maxHeight: "300px",
  objectFit: "contain",
  borderRadius: "8px",
  marginTop: "10px",
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

export default ViewLostItems;