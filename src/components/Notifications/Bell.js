import React, { useState } from "react";

export default function Bell() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bin #23 is full", time: "2 min ago", read: false },
    { id: 2, text: "New staff assigned", time: "10 min ago", read: false },
    { id: 3, text: "Route optimized successfully", time: "1 hr ago", read: true },
  ]);

  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <div style={{ padding: "1.5rem", marginLeft: "15rem" }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem"
      }}>
        <h2>Notifications</h2>

        <button
          onClick={markAllRead}
          style={{
            border: "none",
            backgroundColor: "#48a111",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          Mark all as read
        </button>
      </div>

      {/* Notification List */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        overflow: "hidden"
      }}>
        {notifications.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#777" }}>
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "1rem",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: n.read ? "#fff" : "rgba(72,161,17,0.1)"
              }}
            >
              <div>
                <div style={{ fontWeight: "500" }}>{n.text}</div>
                <div style={{ fontSize: "0.8rem", color: "#777" }}>
                  {n.time}
                </div>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <span
                  style={{
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    borderRadius: "50%"
                  }}
                ></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}