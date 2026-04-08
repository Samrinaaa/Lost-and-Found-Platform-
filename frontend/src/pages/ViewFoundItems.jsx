import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ViewFoundItems = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(""); 

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchFoundItems = async () => {
    try {
      const res = await API.get(`/found?search=${search}`); 
      setFoundItems(res.data);
    } catch (error) {
      setMessage("Failed to load found items.");
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, [search]); 

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
          <h1 style={{ fontSize: "36px" }}>Found Items</h1>
          <p>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* SEARCH BAR */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search found items..."
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

        {/* MESSAGE */}
        {message && (
          <p style={{ textAlign: "center", color: "#f87171" }}>
            {message}
          </p>
        )}

        {/* EMPTY STATE */}
        {foundItems.length === 0 ? (
          <div style={emptyBox}>
            <p>No found items found.</p> 
          </div>
        ) : (
          <div style={gridStyle}>
            {foundItems.map((item) => (
              <div key={item._id} style={cardStyle}>
                <h3>{item.itemName}</h3>

                <p>
                  <strong>Description:</strong>{" "}
                  {item.description || "N/A"}
                </p>

                <p>
                  <strong>Location Found:</strong>{" "}
                  {item.locationFound || "N/A"}
                </p>

                <p>
                  <strong>Date Found:</strong>{" "}
                  {item.dateFound
                    ? new Date(item.dateFound).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Status:</strong> {item.status}
                </p>

                {/* IMAGE DISPLAY */}
                {item.imageUrl && (
                  <img
                    src={
                      item.imageUrl.startsWith("http")
                        ? item.imageUrl
                        : `http://localhost:5001${item.imageUrl}`
                    }
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
  maxHeight: "250px",
  objectFit: "contain",
  borderRadius: "8px",
  marginTop: "10px",
};

const emptyBox = {
  background: "rgba(255,255,255,0.95)",
  padding: "30px",
  borderRadius: "10px",
  textAlign: "center",
  color: "#111",
};

const btnBlue = {
  background: "#3b82f6",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

export default ViewFoundItems;