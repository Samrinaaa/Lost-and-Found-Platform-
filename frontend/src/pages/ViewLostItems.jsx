import React, { useEffect, useState } from "react";
import API from "../services/api";

const ViewLostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const res = await API.get("/lost");
        setLostItems(res.data);
      } catch (error) {
        setMessage("Failed to load lost items.");
      }
    };

    fetchLostItems();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Lost Items</h1>

      {message && (
        <p style={{ textAlign: "center", color: "red" }}>{message}</p>
      )}

      {lostItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No lost items reported yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}
        >
          {lostItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
              }}
            >
              <h3>{item.itemName}</h3>

              <p>
                <strong>Description:</strong> {item.description || "N/A"}
              </p>

              <p>
                <strong>Location Lost:</strong> {item.locationLost || "N/A"}
              </p>

              <p>
                <strong>Date Lost:</strong>{" "}
                {item.dateLost
                  ? new Date(item.dateLost).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginTop: "10px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLostItems;