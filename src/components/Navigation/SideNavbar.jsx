import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideNavbar() {
  const location = useLocation();

  const links = [
    { to: "/", icon: <i className="fa-solid fa-gauge-high mx-3"></i>, label: "Dashboard" },
    { to: "/bin-status", icon: <i className="fa-solid fa-trash mx-3"></i>, label: "Bin Status" },
    { to: "/reports", icon: <i className="fa-solid fa-chart-line mx-3"></i>, label: "Reports" },
    { to: "/alerts", icon: <i className="fa-solid fa-bell mx-3"></i>, label: "Alerts" },
    { to: "/settings", icon: <i className="fa-solid fa-gear mx-3"></i>, label: "Settings" },
    { to: "/staffs", icon: <i className="fa-solid fa-users mx-3"></i>, label: "Sanitation Staff" },
    
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: "5rem",
        left: 0,
        height: "calc(100vh - 56px)",
        width: "15rem",
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        paddingTop: "0.3rem",
        zIndex: 1001,
        //position: "relative",
        overflow: "hidden"
      }}
      aria-label="Vertical navigation"
    >

      {/* Background Image */}
      <img
        src={require("../../images/whitescreenwastebin.png")}
        alt="wastebin"
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          opacity: 0.7,
          zIndex: 0
        }}
      />

      {/* Links */}
      {links.map(({ to, icon, label }) => {
        const isActive = location.pathname === to;

        return (
          <Link
            key={to}
            to={to}
            title={label}
            style={{
              color: isActive ? "#000" : "#333",
              margin: "0.2rem 0",
              fontSize: "1rem",
              textDecoration: "none",
              display: "flex",
              width: "100%",
              alignItems: "center",
              fontWeight: isActive ? "bold" : "normal",
              zIndex: 1
            }}
          >
            <div
              style={{
                width: "80%",
                backgroundColor: isActive ? "rgba(72,161,17,0.2)" : "",
                padding: "0.5rem",
                marginLeft: "0.5rem",
                borderRadius: "1rem",
              }}
            >
              {icon} {label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}