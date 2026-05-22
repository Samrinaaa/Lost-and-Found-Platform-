import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import bellIcon from "../assets/notification.png"; // ← added

const typeIcons = {
  claim_submitted: "📋",
  claim_approved:  "✅",
  claim_rejected:  "❌",
  claim_review:    "🔍",
  need_more_info:  "⚠️",
  role_changed:    "👤",
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const dropdownRef                       = useRef(null);
  const navigate                          = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err.message);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await API.put(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark notification as read:", err.message);
      }
    }

    // Navigate if link exists
    if (notification.link) {
      navigate(notification.link);
    }
    setOpen(false);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60)  return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div ref={dropdownRef} style={styles.wrapper}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.bellBtn}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(45,106,100,0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* ← replaced emoji with custom icon */}
        <img src={bellIcon} alt="notifications" style={styles.bellIcon} />
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          {/* Header */}
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={styles.markAllBtn}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={styles.notifList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyNotif}>
                <img src={bellIcon} alt="no notifications" style={{ width: 32, height: 32, marginBottom: 8, opacity: 0.4 }} />
                <div>No notifications yet</div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    ...styles.notifItem,
                    background: notif.isRead ? "transparent" : "rgba(45,106,100,0.05)",
                    borderLeft: notif.isRead ? "3px solid transparent" : "3px solid #2d6a64",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(45,106,100,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? "transparent" : "rgba(45,106,100,0.05)"}
                >
                  <span style={styles.notifIcon}>
                    {typeIcons[notif.type] || "🔔"}
                  </span>
                  <div style={styles.notifBody}>
                    <p style={styles.notifMessage}>{notif.message}</p>
                    <span style={styles.notifTime}>{timeAgo(notif.createdAt)}</span>
                  </div>
                  {!notif.isRead && <div style={styles.unreadDot} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    display: "inline-block",
  },

  bellBtn: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
  },

  // ← new style for the icon image
  bellIcon: {
    width: 22,
    height: 22,
    objectFit: "contain",
  },

  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: "#dc2626",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    fontFamily: "'Inter', sans-serif",
  },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 340,
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid rgba(45,106,100,0.1)",
    zIndex: 1000,
    overflow: "hidden",
  },

  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px 12px",
    borderBottom: "1px solid rgba(45,106,100,0.08)",
  },

  dropdownTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#2c3e3a",
  },

  markAllBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2d6a64",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 6,
  },

  notifList: {
    maxHeight: 360,
    overflowY: "auto",
  },

  emptyNotif: {
    textAlign: "center",
    padding: "32px 20px",
    color: "#5a6e6a",
    fontSize: 13,
  },

  notifItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 18px",
    cursor: "pointer",
    transition: "background 0.15s ease",
    borderBottom: "1px solid rgba(45,106,100,0.05)",
  },

  notifIcon: {
    fontSize: 18,
    flexShrink: 0,
    marginTop: 2,
  },

  notifBody: {
    flex: 1,
    minWidth: 0,
  },

  notifMessage: {
    fontSize: 13,
    color: "#2c3e3a",
    lineHeight: 1.5,
    margin: "0 0 4px",
    fontWeight: 500,
  },

  notifTime: {
    fontSize: 11,
    color: "#9ca3af",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#2d6a64",
    flexShrink: 0,
    marginTop: 4,
  },
};

export default NotificationBell;