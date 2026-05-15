import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

const categoryEmoji = { Electronics: "📱", Bags: "👜", Documents: "📄", Clothing: "👕", Others: "📦" };

const statusColors = {
  lost:  { bg: "rgba(239,68,68,0.1)",   color: "#dc2626" },
  found: { bg: "rgba(16,185,129,0.1)",  color: "#059669" },
};

const ViewLostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const fetchLostItems = async () => {
    try {
      const res = await API.get(`/lost?search=${search}`);
      setLostItems(res.data);
    } catch {
      setMessage("Failed to load lost items.");
    }
  };

  useEffect(() => { fetchLostItems(); }, [search]);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.brandName}>Lost and Found</span>
          <Link to="/dashboard">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        {/* Page title + search */}
        <div style={styles.toolbar}>
          <div>
            <h1 style={styles.title}>Lost Items</h1>
            <p style={styles.subtitle}>{lostItems.length} report{lostItems.length !== 1 ? "s" : ""} found</p>
          </div>
          <div style={styles.searchBox}>
            <span style={{ fontSize: 16, color: "#5a6e6a" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {message && <p style={styles.errorMsg}>{message}</p>}

        {lostItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2c3e3a", marginBottom: 8 }}>
              No lost items found
            </h3>
            <p style={{ color: "#5a6e6a", fontSize: 14 }}>
              {search ? "Try a different search term." : "No lost items have been reported yet."}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {lostItems.map((item) => (
              <div
                key={item._id}
                style={styles.card}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 50px rgba(45,106,100,0.15)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,100,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image */}
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.itemName} style={styles.cardImg} />
                ) : (
                  <div style={styles.cardImgPlaceholder}>
                    {categoryEmoji[item.category] || "📦"}
                  </div>
                )}

                <div style={styles.cardBody}>
                  {/* Category + status badges */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    {item.category && (
                      <span style={styles.categoryBadge}>{item.category}</span>
                    )}
                    <span style={{ ...styles.statusBadge, ...(statusColors[item.status] || statusColors.lost) }}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={styles.cardTitle}>{item.itemName}</h3>

                  {item.description && (
                    <p style={styles.cardDesc}>{item.description}</p>
                  )}

                  <div style={styles.cardMeta}>
                    {item.locationLost && (
                      <span>📍 {item.locationLost}</span>
                    )}
                    {item.dateLost && (
                      <span>📅 {new Date(item.dateLost).toLocaleDateString()}</span>
                    )}
                    {item.userId?.fullName && (
                      <span>👤 {item.userId.fullName}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 4, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#5a6e6a" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid rgba(45,106,100,0.15)", borderRadius: 10, padding: "0 14px", minWidth: 260 },
  searchInput: { border: "none", outline: "none", padding: "11px 0", fontSize: 14, background: "transparent", color: "#2c3e3a", width: "100%" },
  errorMsg: { color: "#dc2626", fontSize: 14, marginBottom: 16 },
  emptyState: { background: "#fff", borderRadius: 20, padding: "60px 20px", textAlign: "center", border: "1px solid rgba(45,106,100,0.08)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(45,106,100,0.08)", boxShadow: "0 8px 32px rgba(45,106,100,0.08)", transition: "box-shadow 0.25s ease, transform 0.25s ease" },
  cardImg: { width: "100%", height: 260, objectFit: "contain", background: "#fff" },
  cardImgPlaceholder: { width: "100%", height: 260, background: "linear-gradient(135deg, #f0faf8, #e6f4f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 },
  cardBody: { padding: "18px 20px 22px" },
  categoryBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(45,106,100,0.1)", color: "#2d6a64" },
  statusBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" },
  cardTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#2c3e3a", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#5a6e6a", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#5a6e6a" },
};

export default ViewLostItems;
