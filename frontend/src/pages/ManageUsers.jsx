import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      setMessage("Failed to load users.");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    try {
      if (pendingAction.type === "role") {
        const res = await API.put(`/admin/users/${pendingAction.userId}/role`, { role: pendingAction.role });
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

  const otherUsers = users.filter((u) => u._id !== currentUser?.id);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/admin">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        <div style={styles.pageTitle}>
          <h1 style={styles.title}>Manage Users</h1>
          <p style={styles.subtitle}>{otherUsers.length} registered user{otherUsers.length !== 1 ? "s" : ""}</p>
        </div>

        {message && (
          <div style={message.toLowerCase().includes("success") || message.toLowerCase().includes("updated") || message.toLowerCase().includes("deleted") ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}

        {otherUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <p style={{ color: "#5a6e6a", fontSize: 14 }}>No users found.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {otherUsers.map((user) => {
              const isPending = pendingAction?.userId === user._id;
              return (
                <div key={user._id} style={styles.card}>
                  {/* Avatar + name */}
                  <div style={styles.userHeader}>
                    <div style={styles.avatar}>
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.userName}>{user.fullName}</div>
                      <span style={{ ...styles.roleBadge, ...(user.role === "admin" ? styles.adminBadge : styles.userBadge) }}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div style={styles.userInfo}>
                    <div style={styles.userInfoRow}><span style={styles.userInfoLabel}>Email</span><span style={styles.userInfoValue}>{user.email}</span></div>
                    <div style={styles.userInfoRow}><span style={styles.userInfoLabel}>Phone</span><span style={styles.userInfoValue}>{user.phone || "—"}</span></div>
                  </div>

                  {!isPending ? (
                    <div style={styles.actionRow}>
                      <button
                        onClick={() => setPendingAction({ type: "role", userId: user._id, fullName: user.fullName, role: "admin" })}
                        style={styles.makeAdminBtn}
                      >
                        Make Admin
                      </button>
                      <button
                        onClick={() => setPendingAction({ type: "delete", userId: user._id, fullName: user.fullName })}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div style={styles.confirmBox}>
                      <p style={{ fontSize: 13, color: "#2c3e3a", marginBottom: 12, fontWeight: 500 }}>
                        {pendingAction.type === "delete"
                          ? `Delete "${pendingAction.fullName}"?`
                          : `Make "${pendingAction.fullName}" an admin?`}
                      </p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={handleConfirmAction} style={styles.confirmBtn}>Confirm</button>
                        <button onClick={() => setPendingAction(null)} style={styles.cancelBtn}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "#faf9f7", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden", padding: "40px 20px" },
  orb: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.5, pointerEvents: "none" },
  orb1: { width: 400, height: 400, background: "linear-gradient(135deg, #d4e8e6, #c5dbd9)", top: -100, right: -100 },
  orb2: { width: 300, height: 300, background: "linear-gradient(135deg, #e8ead4, #dce0c8)", bottom: -80, left: -60 },
  orb3: { width: 200, height: 200, background: "linear-gradient(135deg, #d4e5e3, #c8dbd8)", top: "40%", left: -80 },
  content: { position: "relative", zIndex: 10, maxWidth: "1000px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" },
  brandName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#2c3e3a", letterSpacing: "-0.01em" },
  backBtn: { padding: "9px 18px", border: "1.5px solid rgba(45,106,100,0.25)", borderRadius: 100, background: "transparent", color: "#2d6a64", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  pageTitle: { marginBottom: "24px" },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 4, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#5a6e6a" },
  successMsg: { background: "rgba(16,185,129,0.1)", color: "#065f46", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(16,185,129,0.2)" },
  errorMsg: { background: "rgba(239,68,68,0.08)", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(239,68,68,0.15)" },
  emptyState: { background: "#fff", borderRadius: 20, padding: "60px 20px", textAlign: "center", border: "1px solid rgba(45,106,100,0.08)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 20, padding: "24px", boxShadow: "0 8px 32px rgba(45,106,100,0.08), 0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(45,106,100,0.08)" },
  userHeader: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  avatar: { width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #2d6a64, #245854)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  userName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#2c3e3a", marginBottom: 4 },
  roleBadge: { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" },
  adminBadge: { background: "rgba(45,106,100,0.12)", color: "#2d6a64" },
  userBadge: { background: "rgba(100,116,139,0.1)", color: "#475569" },
  userInfo: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
  userInfoRow: { display: "flex", gap: 12, fontSize: 13 },
  userInfoLabel: { fontWeight: 600, color: "#2c3e3a", minWidth: 44 },
  userInfoValue: { color: "#5a6e6a", wordBreak: "break-all" },
  actionRow: { display: "flex", gap: 10 },
  makeAdminBtn: { flex: 1, padding: "9px 0", border: "none", borderRadius: 100, background: "linear-gradient(135deg, #2d6a64, #245854)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  deleteBtn: { padding: "9px 16px", border: "1.5px solid rgba(220,38,38,0.3)", borderRadius: 100, background: "transparent", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  confirmBox: { background: "#faf9f7", borderRadius: 12, padding: "14px", border: "1px solid rgba(45,106,100,0.1)" },
  confirmBtn: { flex: 1, padding: "8px 16px", border: "none", borderRadius: 100, background: "#2d6a64", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "8px 16px", border: "1.5px solid rgba(100,116,139,0.3)", borderRadius: 100, background: "transparent", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};

export default ManageUsers;