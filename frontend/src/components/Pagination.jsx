import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];

  // Always show first, last, current, and neighbours
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div style={styles.container}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...styles.btn,
          ...(currentPage === 1 ? styles.btnDisabled : styles.btnNav),
        }}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} style={styles.dots}>…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              ...styles.btn,
              ...(page === currentPage ? styles.btnActive : styles.btnPage),
            }}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...styles.btn,
          ...(currentPage === totalPages ? styles.btnDisabled : styles.btnNav),
        }}
      >
        Next →
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 32,
    flexWrap: "wrap",
  },
  btn: {
    padding: "8px 14px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "1.5px solid transparent",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  btnNav: {
    background: "#fff",
    border: "1.5px solid rgba(45,106,100,0.25)",
    color: "#2d6a64",
  },
  btnPage: {
    background: "#fff",
    border: "1.5px solid rgba(45,106,100,0.15)",
    color: "#5a6e6a",
  },
  btnActive: {
    background: "linear-gradient(135deg, #2d6a64, #245854)",
    border: "1.5px solid transparent",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(45,106,100,0.3)",
  },
  btnDisabled: {
    background: "#f5f5f5",
    border: "1.5px solid #e5e7eb",
    color: "#c0c0c0",
    cursor: "not-allowed",
  },
  dots: {
    fontSize: 14,
    color: "#9ca3af",
    padding: "0 4px",
  },
};

export default Pagination;