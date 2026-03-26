import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import hero from "../assets/Lost&Found.png";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      setMessage("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showRoleConfirm = (user, newRole) => {
    setPendingAction({
      type: "role",
      userId: user._id,
      fullName: user.fullName,
      role: newRole
    });
  };

  const showDeleteConfirm = (user) => {
    setPendingAction({
      type: "delete",
      userId: user._id,
      fullName: user.fullName
    });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      if (pendingAction.type === "role") {
        const res = await API.put(`/admin/users/${pendingAction.userId}/role`, {
          role: pendingAction.role
        });
        setMessage(res.data.message);
      }

      if (pendingAction.type === "delete") {
        const res = await API.delete(`/admin/users/${pendingAction.userId}`);
        setMessage(res.data.message);
      }

      setPendingAction(null);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Action failed.");
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  // ❌ handleLogout REMOVED (no longer needed)

  const otherUsers = users.filter((user) => user._id !== currentUser?.id);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px",
          color: "white"
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ marginBottom: "5px", opacity: 0.8 }}>
            Admin Dashboard
          </h2>

          <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>
            Manage Users
          </h1>

          <p style={{ fontSize: "18px" }}>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex",
            gap: "10px"
          }}
        >
          <Link to="/admin">
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer"
              }}
            >
              Back
            </button>
          </Link>

          {/* ❌ Logout button REMOVED ONLY */}
        </div>

        {/* MESSAGE */}
        {message && (
          <p style={{ marginBottom: "20px" }}>{message}</p>
        )}

        {/* USER CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
            marginTop: "30px"
          }}
        >
          {otherUsers.map((user) => {
            const isPendingForThisUser =
              pendingAction && pendingAction.userId === user._id;

            return (
              <div
                key={user._id}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  padding: "25px",
                  borderRadius: "12px",
                  color: "#111"
                }}
              >
                <h3>{user.fullName}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Role: {user.role}</p>

                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => showRoleConfirm(user, "admin")}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px"
                    }}
                  >
                    Make Admin
                  </button>

                  <button
                    onClick={() => showDeleteConfirm(user)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px"
                    }}
                  >
                    Delete
                  </button>
                </div>

                {isPendingForThisUser && (
                  <div style={{ marginTop: "15px" }}>
                    <button onClick={handleConfirmAction}>Confirm</button>
                    <button onClick={handleCancelAction}>Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;