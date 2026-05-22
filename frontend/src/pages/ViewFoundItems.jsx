import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const categoryEmoji = { Electronics: "📱", Bags: "👜", Documents: "📄", Clothing: "👕", Others: "📦" };

const statusColors = {
  open:    { bg: "rgba(16,185,129,0.1)",  color: "#059669" },
  claimed: { bg: "rgba(59,130,246,0.1)",  color: "#2563eb" },
  closed:  { bg: "rgba(100,116,139,0.1)", color: "#475569" },
};

const ITEMS_PER_PAGE = 6;

const ViewFoundItems = () => {
  const [foundItems, setFoundItems]     = useState([]);
  const [message, setMessage]           = useState("");
  const [search, setSearch]             = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalItems, setTotalItems]     = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [matches, setMatches]           = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError]     = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchFoundItems = async (page = 1) => {
    try {
      const res = await API.get(`/found?search=${search}&page=${page}&limit=${ITEMS_PER_PAGE}`);
      setFoundItems(res.data.items);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch {
      setMessage("Failed to load found items.");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchFoundItems(1);
  }, [search]);

  const handlePageChange = (page) => {
    setSelectedItem(null);
    setMatches([]);
    setMatchError("");
    fetchFoundItems(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFindMatches = async (item) => {
    if (selectedItem?._id === item._id) {
      setSelectedItem(null);
      setMatches([]);
      setMatchError("");
      return;
    }
    setSelectedItem(item);
    setMatches([]);
    setMatchError("");
    setMatchLoading(true);
    try {
      const res = await API.get(`/match/found/${item._id}`);
      setMatches(res.data.matches || []);
      if (res.data.matches.length === 0) {
        setMatchError("No matching lost items at this time. Check back later as more items are reported.");
      }
    } catch {
      setMatchError("Failed to fetch matches. Please try again.");
    } finally {
      setMatchLoading(false);
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
          {currentUser ? (
            <Link to="/dashboard"><button style={styles.backBtn}>← Back to Dashboard</button></Link>
          ) : (
            <Link to="/login"><button style={styles.backBtn}>Login to Report</button></Link>
          )}
        </div>

        <div style={styles.toolbar}>
          <div>
            <h1 style={styles.title}>Found Items</h1>
            <p style={styles.subtitle}>
              {totalItems} report{totalItems !== 1 ? "s" : ""} total
              {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
            </p>
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

        {/* Match panel */}
        {selectedItem && (
          <div style={styles.matchPanel}>
            <div style={styles.matchPanelHeader}>
              <div>
                <h3 style={styles.matchPanelTitle}>🔗 Potential lost item matches for "{selectedItem.itemName}"</h3>
                <p style={styles.matchPanelSub}>Lost item reports ranked by similarity in category, name, description and location.</p>
              </div>
              <button onClick={() => { setSelectedItem(null); setMatches([]); setMatchError(""); }} style={styles.closePanelBtn}>✕</button>
            </div>
            {matchLoading && <div style={styles.matchLoading}><div style={styles.spinner} />Searching for matches…</div>}
            {matchError && !matchLoading && <div style={styles.matchEmpty}>{matchError}</div>}
            {!matchLoading && matches.length > 0 && (
              <div style={styles.matchGrid}>
                {matches.map((match) => (
                  <div key={match._id} style={styles.matchCard}>
                    {match.imageUrl ? (
                      <img src={match.imageUrl} alt={match.itemName} style={styles.matchImg} />
                    ) : (
                      <div style={styles.matchImgPlaceholder}>{categoryEmoji[match.category] || "📦"}</div>
                    )}
                    <div style={styles.matchCardBody}>
                      <div style={styles.scoreRow}>
                        <span style={styles.scoreLabel}>Match score</span>
                        <span style={styles.scoreValue}>{match.matchScore}%</span>
                      </div>
                      <div style={styles.scoreBar}>
                        <div style={{ ...styles.scoreBarFill, width: `${match.matchScore}%`, background: match.matchScore >= 70 ? "linear-gradient(90deg, #2d6a64, #3d8a82)" : match.matchScore >= 50 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #94a3b8, #cbd5e1)" }} />
                      </div>
                      <h4 style={styles.matchCardTitle}>{match.itemName}</h4>
                      {match.description && <p style={styles.matchCardDesc}>{match.description}</p>}
                      <div style={styles.matchCardMeta}>
                        {match.locationLost && <span>📍 {match.locationLost}</span>}
                        {match.dateLost && <span>📅 {new Date(match.dateLost).toLocaleDateString()}</span>}
                        {match.userId?.fullName && <span>👤 {match.userId.fullName}</span>}
                      </div>
                      <div style={styles.reasonsBox}>
                        {match.matchReasons.map((reason, i) => (
                          <span key={i} style={styles.reasonTag}>✓ {reason}</span>
                        ))}
                      </div>
                      {currentUser && <Link to="/claim"><button style={styles.claimBtn}>Submit Claim →</button></Link>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {foundItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#2c3e3a", marginBottom: 8 }}>No found items yet</h3>
            <p style={{ color: "#5a6e6a", fontSize: 14 }}>{search ? "Try a different search term." : "No found items have been reported yet."}</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {foundItems.map((item) => {
                const isSelected = selectedItem?._id === item._id;
                return (
                  <div key={item._id} style={{ ...styles.card, border: isSelected ? "2px solid #2d6a64" : "1px solid rgba(45,106,100,0.08)" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 50px rgba(45,106,100,0.15)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,100,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.itemName} style={styles.cardImg} />
                    ) : (
                      <div style={styles.cardImgPlaceholder}>{categoryEmoji[item.category] || "📦"}</div>
                    )}
                    <div style={styles.cardBody}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        {item.category && <span style={styles.categoryBadge}>{item.category}</span>}
                        <span style={{ ...styles.statusBadge, ...(statusColors[item.status] || statusColors.open) }}>{item.status}</span>
                      </div>
                      <h3 style={styles.cardTitle}>{item.itemName}</h3>
                      {item.description && <p style={styles.cardDesc}>{item.description}</p>}
                      <div style={styles.cardMeta}>
                        {item.locationFound && <span>📍 {item.locationFound}</span>}
                        {item.dateFound && <span>📅 {new Date(item.dateFound).toLocaleDateString()}</span>}
                        {item.userId?.fullName && <span>👤 {item.userId.fullName}</span>}
                      </div>
                      {currentUser && (
                        <button onClick={() => handleFindMatches(item)} style={{ ...styles.matchBtn, background: isSelected ? "linear-gradient(135deg, #2d6a64, #245854)" : "transparent", color: isSelected ? "#fff" : "#2d6a64" }}>
                          {isSelected ? "✓ Viewing Matches" : "🔗 Find Matches"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: "#2c3e3a", marginBottom: 4, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#5a6e6a" },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid rgba(45,106,100,0.15)", borderRadius: 10, padding: "0 14px", minWidth: 260 },
  searchInput: { border: "none", outline: "none", padding: "11px 0", fontSize: 14, background: "transparent", color: "#2c3e3a", width: "100%" },
  errorMsg: { color: "#dc2626", fontSize: 14, marginBottom: 16 },
  emptyState: { background: "#fff", borderRadius: 20, padding: "60px 20px", textAlign: "center", border: "1px solid rgba(45,106,100,0.08)" },
  matchPanel: { background: "#fff", borderRadius: 20, padding: "24px 28px", border: "2px solid rgba(45,106,100,0.2)", boxShadow: "0 8px 32px rgba(45,106,100,0.1)", marginBottom: 28 },
  matchPanelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  matchPanelTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: "#2c3e3a", marginBottom: 4 },
  matchPanelSub: { fontSize: 13, color: "#5a6e6a" },
  closePanelBtn: { background: "transparent", border: "1.5px solid rgba(100,116,139,0.3)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#5a6e6a", fontSize: 14, flexShrink: 0 },
  matchLoading: { display: "flex", alignItems: "center", gap: 12, color: "#5a6e6a", fontSize: 14, padding: "20px 0" },
  spinner: { width: 20, height: 20, border: "2px solid rgba(45,106,100,0.2)", borderTopColor: "#2d6a64", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  matchEmpty: { color: "#5a6e6a", fontSize: 14, fontStyle: "italic", padding: "16px 0" },
  matchGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  matchCard: { background: "#faf9f7", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(45,106,100,0.1)" },
  matchImg: { width: "100%", height: 160, objectFit: "contain", background: "#fff" },
  matchImgPlaceholder: { width: "100%", height: 160, background: "linear-gradient(135deg, #f0faf8, #e6f4f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 },
  matchCardBody: { padding: "14px 16px 18px" },
  scoreRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  scoreLabel: { fontSize: 11, fontWeight: 600, color: "#5a6e6a", textTransform: "uppercase", letterSpacing: ".5px" },
  scoreValue: { fontSize: 13, fontWeight: 700, color: "#2d6a64" },
  scoreBar: { height: 5, background: "rgba(45,106,100,0.1)", borderRadius: 3, marginBottom: 12, overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: 3 },
  matchCardTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: "#2c3e3a", marginBottom: 6 },
  matchCardDesc: { fontSize: 12, color: "#5a6e6a", lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  matchCardMeta: { display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "#5a6e6a", marginBottom: 10 },
  reasonsBox: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  reasonTag: { fontSize: 11, fontWeight: 600, background: "rgba(45,106,100,0.08)", color: "#2d6a64", padding: "3px 8px", borderRadius: 20 },
  claimBtn: { width: "100%", padding: "9px 0", border: "none", borderRadius: 100, background: "linear-gradient(135deg, #2d6a64, #245854)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
  card: { background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(45,106,100,0.08)", transition: "box-shadow 0.25s ease, transform 0.25s ease" },
  cardImg: { width: "100%", height: 260, objectFit: "contain", background: "#fff" },
  cardImgPlaceholder: { width: "100%", height: 260, background: "linear-gradient(135deg, #f0faf8, #e6f4f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 },
  cardBody: { padding: "18px 20px 22px" },
  categoryBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(45,106,100,0.1)", color: "#2d6a64" },
  statusBadge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" },
  cardTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#2c3e3a", marginBottom: 6 },
  cardDesc: { fontSize: 13, color: "#5a6e6a", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#5a6e6a", marginBottom: 14 },
  matchBtn: { width: "100%", padding: "9px 0", border: "1.5px solid rgba(45,106,100,0.3)", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" },
};

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.innerText = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

export default ViewFoundItems;