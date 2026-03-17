import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: "5rem",
        left: 0,
        height: "calc(100vh - 56px)",
        width: collapsed ? "5rem" : "clamp(15rem, 18vw, 12rem)",
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
                width: "90%",
                backgroundColor: isActive ? "rgba(72,161,17,0.2)" : "",
                padding: collapsed ? "0.5rem" : "0.5rem 1rem",
                marginLeft: "0.5rem",
                borderRadius: "1rem",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {icon} {!collapsed && label}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}