import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageFoundItems = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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
        background: "#f5f5f5",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "25px" }}>Admin Dashboard</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            alignItems: "center",
          }}
        >
          <h2>Manage Found Items</h2>

          <button
            onClick={() => navigate("/admin")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            }}
          >
            <p>No found items reported yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
              gap: "20px",
            }}
          >
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                }}
              >
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

                <button
                  onClick={() => deleteItem(item._id)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Delete Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFoundItems;