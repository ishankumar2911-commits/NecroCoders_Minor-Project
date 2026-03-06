import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideNavbar() {
    const location = useLocation();
    //const token = localStorage.getItem('token');
    const links = [
    { to: "/", icon: <i className="fa-solid fa-gauge-high mx-3"></i>, label: "Dashboard" },
    { to: "/binstatus", icon: <i className="fa-solid fa-trash mx-3"></i>, label: "Bin Status" },
    { to: "/collection", icon: <i className="fa-solid fa-truck mx-3"></i>, label: "Collection" },
    { to: "/reports", icon: <i className="fa-solid fa-chart-line mx-3"></i>, label: "Reports" },
    { to: "/alerts", icon: <i className="fa-solid fa-bell mx-3"></i>, label: "Alerts" },
    { to: "/settings", icon: <i className="fa-solid fa-gear mx-3"></i>, label: "Settings" },
];

    // if (!token) {
    //     links.push({
    //         to: "/login",
    //         icon: <i className="fa-solid fa-right-to-bracket mx-3"></i>,
    //         label: "Login",
    //     });
    // }



    return (
        <nav
            style={{
                position: "fixed",
                top: "5rem", // height of your horizontal navbar; adjust if needed
                left: 0,
                height: "calc(100vh - 56px)", // full height minus navbar
                width: "15rem", // very thin width
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "10px",
                zIndex: 1001,
            }}
            aria-label="Vertical navigation"
        >
            {links.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        title={label}
                        style={{
                            color: isActive ? "#000" : "#333",
                            margin: "0.3rem 0",
                            fontSize: "1rem",
                            textDecoration: "none",
                            display: "flex",
                            //justifyContent: "center",
                            width: "100%",
                            alignItems: "center",
                            fontWeight: isActive ? "bold" : "normal",
                        }}
                    >
                        <div style={{ width: "80%" ,backgroundColor:isActive?'rgba(72, 161, 17, 0.2)':'',padding:'0.5rem' ,marginLeft:'0.5rem',borderRadius:'1rem',}}>{icon} {label}</div>
                    </Link>
                );
            })}
        </nav>
    );
}
