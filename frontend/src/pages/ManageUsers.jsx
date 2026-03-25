import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const otherUsers = users.filter((user) => user._id !== currentUser?.id);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <h1 style={{ marginBottom: "25px" }}>Admin Dashboard</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <p style={{ fontSize: "20px", margin: 0 }}>
            Welcome, <strong>{currentUser?.fullName}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              background: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h2 style={{ margin: 0 }}>Manage Users</h2>

          <Link to="/admin">
            <button
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "6px",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer"
              }}
            >
              Back
            </button>
          </Link>
        </div>

        {message && (
          <p
            style={{
              marginBottom: "20px",
              color:
                message.toLowerCase().includes("failed") ||
                message.toLowerCase().includes("denied") ||
                message.toLowerCase().includes("cannot")
                  ? "red"
                  : "green"
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px"
          }}
        >
          {otherUsers.map((user) => {
            const isPendingForThisUser =
              pendingAction && pendingAction.userId === user._id;

            return (
              <div
                key={user._id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
                }}
              >
                <h3 style={{ marginTop: 0 }}>{user.fullName}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Role:</strong> {user.role}</p>

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  {user.role !== "user" && (
                    <button
                      onClick={() => showRoleConfirm(user, "user")}
                      style={{
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                        background: "#3b82f6"
                      }}
                    >
                      Make User
                    </button>
                  )}

                  {user.role !== "admin" && (
                    <button
                      onClick={() => showRoleConfirm(user, "admin")}
                      style={{
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                        background: "#10b981"
                      }}
                    >
                      Make Admin
                    </button>
                  )}

                  <button
                    onClick={() => showDeleteConfirm(user)}
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      background: "#ef4444"
                    }}
                  >
                    Delete User
                  </button>
                </div>

                {isPendingForThisUser && (
                  <div
                    style={{
                      marginTop: "18px",
                      padding: "15px",
                      borderRadius: "10px",
                      background: "#f3f4f6",
                      border: "1px solid #d1d5db"
                    }}
                  >
                    <p style={{ marginTop: 0 }}>
                      {pendingAction.type === "role" && pendingAction.role === "admin" &&
                        `Are you sure you want to make ${pendingAction.fullName} an admin?`}

                      {pendingAction.type === "role" && pendingAction.role === "user" &&
                        `Are you sure you want to make ${pendingAction.fullName} a user?`}

                      {pendingAction.type === "delete" &&
                        `Are you sure you want to delete ${pendingAction.fullName}?`}
                    </p>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={handleConfirmAction}
                        style={{
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "6px",
                          color: "white",
                          cursor: "pointer",
                          background: "#111827"
                        }}
                      >
                        Confirm
                      </button>

                      <button
                        onClick={handleCancelAction}
                        style={{
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "6px",
                          color: "white",
                          cursor: "pointer",
                          background: "#9ca3af"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
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