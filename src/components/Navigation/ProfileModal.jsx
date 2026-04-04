import React from "react";

function ProfileModal({ onLogout, onGoToSettings,name }) {
    const getName = (fullName) => {
        if (!fullName) return "";
        const nameParts = fullName.trim().split(" ");   
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase(); 
        } else {
            return (
                nameParts[0]+" "+
                nameParts[1]
            );
        }
    };


    return (
        <div style={modalStyle}>
            <p style={nameStyle}>{getName(name)}</p>

            <hr style={{ margin: "10px 0" ,color: "#25671E"}} />

            <button onClick={onGoToSettings} style={modalButtonStyle}>
                Settings
            </button>

            <button
                onClick={onLogout}
                style={{ ...modalButtonStyle, background: "#c62f39" }}
            >
                Log Out
            </button>
        </div>
    );
}

const modalStyle = {
    position: "absolute",
    top: "56px",
    right: "10px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    padding: "15px",
    width: "clamp(160px, 40vw, 220px)", // responsive width
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    gap: "6px"
};

const nameStyle = {
    margin: 0,
    fontWeight: "bold",
    fontSize: "0.95rem",
    wordBreak: "break-word",
    color: "#25671E"
};

const modalButtonStyle = {
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#25671E",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "0.9rem"
};

export default ProfileModal;