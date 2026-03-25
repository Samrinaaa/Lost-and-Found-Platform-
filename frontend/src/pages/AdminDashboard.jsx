import React from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    width: "320px"
  };

  const buttonStyle = {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    background: "#3b82f6"
  };

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

        {/* ADMIN PROFILE */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            marginBottom: "40px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <h3 style={{ marginTop: 0, textAlign: "center" }}>Logged In Admin</h3>
          <p><strong>Full Name:</strong> {currentUser?.fullName}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Phone:</strong> {currentUser?.phone}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
        </div>

        {/* ROW 1 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "30px",
            flexWrap: "wrap"
          }}
        >
          {/* MANAGE USERS */}
          <div style={cardStyle}>
            <h3>Manage Users</h3>
            <p>View users, assign roles, and delete users.</p>

            <Link to="/admin/users">
              <button style={buttonStyle}>
                Open User Management
              </button>
            </Link>
          </div>

          {/* MANAGE CLAIMS */}
          <div style={cardStyle}>
            <h3>Manage Claims</h3>
            <p>Review and approve item claims.</p>

            <Link to="/admin/claims">
              <button style={buttonStyle}>
                Open Claims
              </button>
            </Link>
          </div>
        </div>

        {/* ROW 2 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap"
          }}
        >
          {/* MANAGE LOST ITEMS */}
          <div style={cardStyle}>
            <h3>Manage Lost Items</h3>
            <p>View and delete lost item reports.</p>

            <Link to="/admin/lost-items">
              <button style={buttonStyle}>
                Open Lost Items
              </button>
            </Link>
          </div>

          {/* MANAGE FOUND ITEMS */}
          <div style={cardStyle}>
            <h3>Manage Found Items</h3>
            <p>View and delete found item reports.</p>

            <Link to="/admin/found-items">
              <button style={buttonStyle}>
                Open Found Items
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;