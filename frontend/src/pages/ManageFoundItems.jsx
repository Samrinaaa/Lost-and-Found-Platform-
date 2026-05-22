import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

const ManageFoundItems = () => {
  const [items, setItems]             = useState([]);
  const [confirmId, setConfirmId]     = useState(null);
  const [message, setMessage]         = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalItems, setTotalItems]   = useState(0);

  const fetchFoundItems = async (page = 1) => {
    try {
      const res = await API.get(`/admin/found-items?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setItems(res.data.items);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch {
      setMessage("Failed to load found items.");
    }
  };

  useEffect(() => { fetchFoundItems(1); }, []);

  const handlePageChange = (page) => {
    fetchFoundItems(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/admin/found-items/${id}`);
      setConfirmId(null);
      setMessage("Item deleted successfully.");
      fetchFoundItems(currentPage);
    } catch {
      setMessage("Failed to delete item.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/admin"><button style={styles.backBtn}>← Back to Dashboard</button></Link>
        </div>

        <div style={styles.pageTitle}>
          <h1 style={styles.title}>Manage Found Items</h1>
          <p style={styles.subtitle}>
            {totalItems} report{totalItems !== 1 ? "s" : ""}
            {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {message && (
          <div style={message.includes("success") || message.includes("deleted") ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}

        {items.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ color: "#5a6e6a", fontSize: 14 }}>No found items reported yet.</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {items.map((item) => (
                <div key={item._id} style={styles.card}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.itemName} style={styles.cardImg} />
                  ) : (
                    <div style={styles.cardImgPlaceholder}>📦</div>
                  )}
                  <div style={styles.cardBody}>
                    {item.category && <span style={styles.categoryBadge}>{item.category}</span>}
                    <h3 style={styles.cardTitle}>{item.itemName}</h3>
                    {item.description && <p style={styles.cardDesc}>{item.description}</p>}
                    <div style={styles.cardMeta}>
                      {item.locationFound && <span>📍 {item.locationFound}</span>}
                      {item.dateFound && <span>📅 {new Date(item.dateFound).toLocaleDateString()}</span>}
                      {item.userId?.fullName && <span>👤 {item.userId.fullName}</span>}
                    </div>
                    {confirmId === item._id ? (
                      <div style={styles.confirmBox}>
                        <p style={styles.confirmText}>Delete this item?</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => deleteItem(item._id)} style={styles.confirmBtn}>Confirm</button>
                          <button onClick={() => setConfirmId(null)} style={styles.cancelBtn}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmId(item._id)} style={styles.deleteBtn}>Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
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
  card: { background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(45,106,100,0.08)", boxShadow: "0 8px 32px rgba(45,106,100,0.08)" },
  cardImg: { width: "100%", height: 240, objectFit: "contain", background: "#fff" },
  cardImgPlaceholder: { width: "100%", height: 240, background: "linear-gradient(135deg, #f0faf8, #e6f4f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 },
  cardBody: { padding: "16px 20px 20px" },
  categoryBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(45,106,100,0.1)", color: "#2d6a64", marginBottom: 8 },
  cardTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: "#2c3e3a", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#5a6e6a", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#5a6e6a", marginBottom: 14 },
  confirmBox: { background: "#fef2f2", borderRadius: 10, padding: "12px", border: "1px solid rgba(239,68,68,0.15)" },
  confirmText: { fontSize: 13, color: "#2c3e3a", fontWeight: 500, marginBottom: 10 },
  confirmBtn: { padding: "7px 16px", border: "none", borderRadius: 100, background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "7px 16px", border: "1.5px solid rgba(100,116,139,0.3)", borderRadius: 100, background: "transparent", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  deleteBtn: { padding: "8px 18px", border: "1.5px solid rgba(220,38,38,0.3)", borderRadius: 100, background: "transparent", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};

export default ManageFoundItems;